import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import { generateToken } from "../utils/jwt.js";
import { createAndSendOtp, verifyOtpValue } from "../utils/otp.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";

const isStrongPassword = (password: string): boolean => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return strongPasswordRegex.test(password);
};

// ─── Staff (email+password) login helper ──────────────────────────────────────
const sendStaffTokenResponse = (
    staff: { id: string; name: string; email: string; phone: string; role: string; hospitalId: string; createdAt: Date },
    statusCode: number,
    res: Response
) => {
    const roleMap: Record<string, string> = {
        ADMIN:        "admin",
        DOCTOR:       "doctor",
        RECEPTIONIST: "reception",
    };
    const mappedRole = roleMap[staff.role] ?? staff.role.toLowerCase();

    const token = generateToken({ id: staff.id, role: mappedRole });

    res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure:   process.env.NODE_ENV === "production",
    });

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id:          staff.id,
            name:        staff.name,
            email:       staff.email,
            phone:       staff.phone,
            role:        mappedRole,
            hospital_id: staff.hospitalId,
            created_at:  staff.createdAt,
        },
    });
};

// ─── Patient (phone+OTP) token helper ─────────────────────────────────────────
const sendPatientTokenResponse = (
    patient: { id: string; name: string; phone: string; hospitalId: string; createdAt: Date },
    statusCode: number,
    res: Response
) => {
    const token = generateToken({ id: patient.id, role: "patient" });

    res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure:   process.env.NODE_ENV === "production",
    });

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id:          patient.id,
            name:        patient.name,
            phone:       patient.phone,
            role:        "patient",
            hospital_id: patient.hospitalId,
            created_at:  patient.createdAt,
        },
    });
};

// ─── signup (staff only — patients are created via OTP flow) ──────────────────
export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, phone, password, role, hospital_id } = req.body;

        if (!name || !email || !phone || !password || !role) {
            res.status(400).json({ success: false, error: "Please provide name, email, phone, password, and role." });
            return;
        }

        const normalizedRole = String(role).toUpperCase();
        if (!["ADMIN", "DOCTOR", "RECEPTIONIST"].includes(normalizedRole)) {
            res.status(400).json({ success: false, error: "Invalid role. Use ADMIN, DOCTOR, or RECEPTIONIST." });
            return;
        }

        if (!isStrongPassword(password)) {
            res.status(400).json({
                success: false,
                error:   "Password must be at least 8 characters with uppercase, lowercase, number and special character.",
            });
            return;
        }

        const existing = await prisma.staff.findFirst({
            where: { OR: [{ email }, { phone }] },
        });
        if (existing) {
            res.status(400).json({ success: false, error: "Email or phone number already registered." });
            return;
        }

        // Resolve hospital
        let resolvedHospitalId = hospital_id as string | undefined;
        if (!resolvedHospitalId) {
            const hospital = await prisma.hospital.findFirst({ select: { id: true } });
            if (!hospital) {
                res.status(400).json({ success: false, error: "No hospital found. Please create a hospital first." });
                return;
            }
            resolvedHospitalId = hospital.id;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newStaff = await prisma.staff.create({
            data: {
                name,
                email,
                phone,
                password:   hashedPassword,
                role:       normalizedRole as "ADMIN" | "DOCTOR" | "RECEPTIONIST",
                gender:     req.body.gender ?? "OTHER",
                hospitalId: resolvedHospitalId,
            },
        });

        sendStaffTokenResponse(newStaff, 201, res);
    } catch (error) {
        next(error);
    }
};

// ─── login (staff email+password  OR  patient phone→OTP step 1) ───────────────
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password, phone } = req.body;

        // OTP flow: patient login via phone
        if (phone) {
            // Check if patient exists; if not, the OTP will be sent after patient is auto-created at verifyOtp
            const existing = await prisma.patient.findUnique({ where: { phone } });
            if (!existing) {
                // Return early telling frontend the patient doesn't exist yet – they should register
                res.status(200).json({
                    success:   true,
                    message:   "OTP will be sent once patient is registered.",
                    phone,
                    isNewUser: true,
                });
                return;
            }

            await createAndSendOtp(phone);
            res.status(200).json({
                success:   true,
                message:   "OTP sent successfully to your registered phone number.",
                phone,
                isNewUser: false,
            });
            return;
        }

        // Password flow: staff login via email
        if (email) {
            if (!password) {
                res.status(400).json({ success: false, error: "Please provide your password." });
                return;
            }

            const staff = await prisma.staff.findUnique({ where: { email } });
            if (!staff) {
                res.status(401).json({ success: false, error: "Invalid email or password." });
                return;
            }

            const isMatch = await bcrypt.compare(password, staff.password);
            if (!isMatch) {
                res.status(401).json({ success: false, error: "Invalid email or password." });
                return;
            }

            sendStaffTokenResponse(staff, 200, res);
            return;
        }

        res.status(400).json({ success: false, error: "Please provide either an email or a phone number to sign in." });
    } catch (error) {
        next(error);
    }
};

// ─── verifyOtp (patient phone+OTP step 2) ────────────────────────────────────
export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { phone, otp, name, hospital_id } = req.body;

        if (!phone || !otp) {
            res.status(400).json({ success: false, error: "Please provide your phone number and OTP code." });
            return;
        }

        const isValid = await verifyOtpValue(phone, otp);
        if (!isValid) {
            res.status(400).json({ success: false, error: "Invalid or expired OTP." });
            return;
        }

        let patient = await prisma.patient.findUnique({ where: { phone } });

        if (!patient) {
            // Auto-register patient
            let resolvedHospitalId = hospital_id as string | undefined;
            if (!resolvedHospitalId) {
                const hospital = await prisma.hospital.findFirst({ select: { id: true } });
                resolvedHospitalId = hospital?.id;
            }
            if (!resolvedHospitalId) {
                res.status(400).json({ success: false, error: "No hospital found to register patient." });
                return;
            }

            const defaultName = name || `Patient-${phone.slice(-4)}`;
            patient = await prisma.patient.create({
                data: {
                    name:       defaultName,
                    phone,
                    gender:     "OTHER",
                    hospitalId: resolvedHospitalId,
                },
            });
        }

        sendPatientTokenResponse(patient, 200, res);
    } catch (error) {
        next(error);
    }
};

// ─── logout ───────────────────────────────────────────────────────────────────
export const logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.cookie("token", "none", {
            expires:  new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        });
        res.status(200).json({ success: true, message: "Logged out successfully." });
    } catch (error) {
        next(error);
    }
};

// ─── getProfile ───────────────────────────────────────────────────────────────
export const getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, error: "Not authorized." });
            return;
        }
        res.status(200).json({ success: true, user: req.user });
    } catch (error) {
        next(error);
    }
};
