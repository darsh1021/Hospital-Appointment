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

const sendTokenResponse = (
    user: { id: number; name: string; email: string | null; phoneNumber: string | null; role: string; createdAt: Date },
    statusCode: number,
    res: Response
) => {
    const token = generateToken({ id: user.id, role: user.role });

    res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id:           user.id,
            name:         user.name,
            email:        user.email,
            phone_number: user.phoneNumber,
            role:         user.role,
            created_at:   user.createdAt,
        },
    });
};

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, phone_number, password, role } = req.body;

        if (!name || !role) {
            res.status(400).json({ success: false, error: "Please provide your name and role." });
            return;
        }

        const normalizedRole = role.toLowerCase();
        if (!["admin", "doctor", "reception", "patient"].includes(normalizedRole)) {
            res.status(400).json({ success: false, error: "Invalid role specified." });
            return;
        }

        // OTP flow
        if (phone_number) {
            const existing = await prisma.user.findUnique({ where: { phoneNumber: phone_number } });
            if (existing) {
                res.status(400).json({ success: false, error: "Phone number already registered. Please log in." });
                return;
            }
            await createAndSendOtp(phone_number);
            res.status(200).json({
                success: true,
                message: "OTP sent successfully to your phone number.",
                phone_number,
                name,
                role: normalizedRole,
            });
            return;
        }

        // Password flow
        if (email) {
            if (!password) {
                res.status(400).json({ success: false, error: "Please provide a password for email registration." });
                return;
            }
            if (!isStrongPassword(password)) {
                res.status(400).json({
                    success: false,
                    error: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
                });
                return;
            }

            const existing = await prisma.user.findUnique({ where: { email } });
            if (existing) {
                res.status(400).json({ success: false, error: "Email already registered. Please log in." });
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await prisma.user.create({
                data: { name, email, password: hashedPassword, role: normalizedRole },
            });

            sendTokenResponse(newUser, 201, res);
            return;
        }

        res.status(400).json({ success: false, error: "Please provide either an email or a phone number to register." });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password, phone_number } = req.body;

        // OTP flow
        if (phone_number) {
            const existing = await prisma.user.findUnique({ where: { phoneNumber: phone_number } });
            await createAndSendOtp(phone_number);
            res.status(200).json({
                success: true,
                message: existing
                    ? "OTP sent successfully to your registered phone number."
                    : "OTP sent successfully for auto-registration.",
                phone_number,
                isNewUser: !existing,
            });
            return;
        }

        // Password flow
        if (email) {
            if (!password) {
                res.status(400).json({ success: false, error: "Please provide your password." });
                return;
            }

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                res.status(401).json({ success: false, error: "Invalid email or password." });
                return;
            }

            if (!user.password) {
                res.status(400).json({
                    success: false,
                    error: "This account was registered using phone authentication. Please log in using your phone number.",
                });
                return;
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({ success: false, error: "Invalid email or password." });
                return;
            }

            sendTokenResponse(user, 200, res);
            return;
        }

        res.status(400).json({ success: false, error: "Please provide either an email or a phone number to sign in." });
    } catch (error) {
        next(error);
    }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { phone_number, otp, name } = req.body;

        if (!phone_number || !otp) {
            res.status(400).json({ success: false, error: "Please provide your phone number and OTP code." });
            return;
        }

        const isValid = await verifyOtpValue(phone_number, otp);
        if (!isValid) {
            res.status(400).json({ success: false, error: "Invalid or expired OTP." });
            return;
        }

        let user = await prisma.user.findUnique({ where: { phoneNumber: phone_number } });

        if (!user) {
            const defaultName = name || `Patient-${phone_number.slice(-4)}`;
            user = await prisma.user.create({
                data: { name: defaultName, phoneNumber: phone_number, role: "patient" },
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.cookie("token", "none", {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        });
        res.status(200).json({ success: true, message: "Logged out successfully." });
    } catch (error) {
        next(error);
    }
};

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
