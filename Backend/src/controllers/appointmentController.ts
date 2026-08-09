import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db.js";
import { calculateEstimatedWaitTime } from "../utils/queueEstimator.js";
import { generateToken } from "../utils/jwt.js";

// ─── List of allowed medical specialization categories ────────────────────────
export const ALLOWED_CATEGORIES = [
    "General Medicine",
    "Dermatology",
    "Cardiology",
    "Orthopedics",
    "Pediatrics",
    "ENT"
];

// ─── Helper: today's date range (midnight → midnight) ─────────────────────────
const getTodayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0); // start of today 00:00:00
    const end = new Date();
    end.setHours(23, 59, 59, 999); // end of today 23:59:59
    return { start, end };
};

// ─── GET /appointments/categories ───────────────────────────────────────────
// Public — no auth required
// Returns a list of all allowed medical specialization categories
export const getCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        res.status(200).json({
            success: true,
            categories: ALLOWED_CATEGORIES,
        });
    } catch (error) {
        next(error);
    }
};

// ─── GET /appointments/doctors?category=Dermatology ──────────────────────────
// Public — no auth required
// Returns list of active doctors filtered by specialization (case-insensitive)
export const getDoctorsByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { category } = req.query;

        if (!category || typeof category !== "string") {
            res.status(400).json({
                success: false,
                error: "Please provide a category (e.g. ?category=Dermatology).",
            });
            return;
        }

        const matchedCategory = ALLOWED_CATEGORIES.find(
            c => c.toLowerCase() === category.trim().toLowerCase()
        );

        if (!matchedCategory) {
            res.status(400).json({
                success: false,
                error: `Invalid category. Allowed categories are: ${ALLOWED_CATEGORIES.join(", ")}`,
            });
            return;
        }

        const doctors = await prisma.staff.findMany({
            where: {
                role: "DOCTOR",
                status: "ACTIVE",
                specialization: {
                    equals: matchedCategory,
                    mode: "insensitive",
                },
            },
            select: {
                id: true,
                name: true,
                specialization: true,
                experience: true,
                qualification: true,
                hospital: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        city: true,
                        state: true,
                    },
                },
            },
        });

        if (doctors.length === 0) {
            res.status(404).json({
                success: false,
                error: `No active doctors found for category: "${matchedCategory}".`,
            });
            return;
        }

        res.status(200).json({
            success: true,
            count: doctors.length,
            doctors,
        });

    } catch (error) {
        next(error);
    }
};

// ─── POST /appointments/book-token ────────────────────────────────────────────
// Public — no auth required
// Body: { name, phone, gender, category, symptoms?, address?, payment_method? }
// Rules:
//   1. `category` (specialization) is used to auto-select the first active matching doctor
//   2. Only today's date is allowed — future dates are rejected
//   3. If phone already exists AND patient has a token today → return that token (alreadyBooked)
//   4. If phone exists but no token today → book a new token
//   5. If phone is new → auto-register patient + book token
//   6. If payment_method is provided → create a Payment record

export const bookToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {
            name,
            phone,
            gender,
            category,
            dob,
            symptoms,
            address,
            payment_method,
        } = req.body;

        console.log(req.body)

        // ── 1. Validate required fields ──────────────────────────────────────
        if (!name || !phone || !gender || !category || !dob) {
            res.status(400).json({
                success: false,
                error: "Please provide name, phone, gender, category, and date of birth (dob).",
            });
            return;
        }

        const matchedCategory = ALLOWED_CATEGORIES.find(
            c => c.toLowerCase() === String(category).trim().toLowerCase()
        );

        if (!matchedCategory) {
            res.status(400).json({
                success: false,
                error: `Invalid category. Allowed categories are: ${ALLOWED_CATEGORIES.join(", ")}`,
            });
            return;
        }

        const normalizedGender = String(gender).toUpperCase();
        if (!["MALE", "FEMALE", "OTHER"].includes(normalizedGender)) {
            res.status(400).json({
                success: false,
                error: "Invalid gender. Use MALE, FEMALE, or OTHER.",
            });
            return;
        }

        // Valid Date DD/MM/YYYY format
        // if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) {
        //     res.status(400).json({
        //         success: false,
        //         error: "Invalid date format for dob. Expected DD/MM/YYYY.",
        //     });
        //     return;
        // }

        const [yearStr, monthStr, dayStr] = dob.split("-");
        const day = parseInt(dayStr, 10);
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10);

        const parsedDob = new Date(year, month - 1, day);

        if (
            isNaN(parsedDob.getTime()) ||
            parsedDob.getFullYear() !== year ||
            parsedDob.getMonth() !== month - 1 ||
            parsedDob.getDate() !== day
        ) {
            res.status(400).json({
                success: false,
                error: "Invalid date for dob.",
            });
            return;
        }

        // Calculate age from dob
        const today = new Date();
        let age = today.getFullYear() - parsedDob.getFullYear();
        const m = today.getMonth() - parsedDob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < parsedDob.getDate())) {
            age--;
        }

        // ── 2. Validate payment_method if provided ───────────────────────────
        if (payment_method && !["CASH", "ONLINE"].includes(String(payment_method).toUpperCase())) {
            res.status(400).json({
                success: false,
                error: "Invalid payment_method. Use CASH or ONLINE.",
            });
            return;
        }

        // ── 3. Enforce today-only rule ───────────────────────────────────────
        const { start: todayStart, end: todayEnd } = getTodayRange();
        const appointmentDate = todayStart; // always book for today

        // ── 4. Find active doctor by category (specialization) ───────────────
        const doctor = await prisma.staff.findFirst({
            where: {
                role: "DOCTOR",
                status: "ACTIVE",
                specialization: {
                    equals: matchedCategory,
                    mode: "insensitive",
                },
            },
            select: { id: true, name: true, specialization: true, hospitalId: true },
        });

        if (!doctor) {
            res.status(404).json({
                success: false,
                error: `No active doctor found for category: "${matchedCategory}". Please try a different category.`,
            });
            return;
        }

        const resolvedHospitalId = doctor.hospitalId;

        // Fetch full hospital details for the response
        const hospital = await prisma.hospital.findUnique({
            where: { id: resolvedHospitalId },
            select: { id: true, name: true, address: true, city: true, state: true, pinCode: true },
        });

        // ── 5. Check if phone already exists ────────────────────────────────
        let patient = await prisma.patient.findUnique({ where: { phone } });
        let isExistingPatient = !!patient;

        if (patient) {
            // ── 5a. Existing patient — check if they already have a token today ──
            const existingTodayAppointment = await prisma.appointment.findFirst({
                where: {
                    patientId: patient.id,
                    doctorId: doctor.id,
                    appointmentDate: { gte: todayStart, lte: todayEnd },
                },
                include: {
                    doctor: { select: { name: true, specialization: true } },
                    hospital: { select: { name: true, address: true, city: true } },
                },
            });

            if (existingTodayAppointment) {
                // Generate JWT token for the patient to automatically sign them in
                const token = generateToken({ id: patient.id, role: "patient" });

                res.cookie("token", token, {
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                });

                // Patient already has a token with this doctor today → return it
                res.status(200).json({
                    success: true,
                    alreadyBooked: true,
                    redirectToDashboard: true,
                    token, // return token in JSON body too
                    message: "You already have a token booked for today with this doctor.",
                    token_number: existingTodayAppointment.tokenNumber,
                    appointment: {
                        id: existingTodayAppointment.id,
                        token_number: existingTodayAppointment.tokenNumber,
                        status: existingTodayAppointment.status,
                        appointment_date: existingTodayAppointment.appointmentDate,
                        doctor_name: existingTodayAppointment.doctor.name,
                        doctor_specialization: existingTodayAppointment.doctor.specialization,
                        hospital_name: existingTodayAppointment.hospital.name,
                        hospital_address: existingTodayAppointment.hospital.address,
                    },
                    patient: {
                        id: patient.id,
                        name: patient.name,
                        phone: patient.phone,
                        role: patient.role,
                        age: patient.age,
                    },
                });
                return;
            }
            // Existing patient, no token today → fall through to book a new token

        } else {
            // ── 5b. New patient — auto-register ──────────────────────────────
            patient = await prisma.patient.create({
                data: {
                    name,
                    phone,
                    gender: normalizedGender as "MALE" | "FEMALE" | "OTHER",
                    age,
                    address: address ?? null,
                    role: "PATIENT",
                    hospitalId: resolvedHospitalId,
                },
            });
        }

        // ── 6. Calculate next token number ───────────────────────────────────
        const doctorId = doctor.id;
        const maxToken = await prisma.appointment.aggregate({
            where: {
                doctorId,
                appointmentDate: { gte: todayStart, lte: todayEnd },
            },
            _max: { tokenNumber: true },
        });
        const tokenNumber = (maxToken._max.tokenNumber ?? 0) + 1;

        const appointmentTime = new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });

        const estimatedWaitTime = await calculateEstimatedWaitTime(doctorId, appointmentDate);

        // ── 7. Create the appointment ────────────────────────────────────────
        const newAppointment = await prisma.appointment.create({
            data: {
                patientId: patient.id,
                doctorId,
                hospitalId: resolvedHospitalId,
                appointmentDate,
                appointmentTime,
                tokenNumber,
                bookingSource: "ONLINE",
                status: "waiting",
                symptoms: symptoms ?? null,
            },
        });

        // ── 8. Optionally create Payment record ──────────────────────────────
        let paymentRecord = null;
        if (payment_method) {
            const method = String(payment_method).toUpperCase() as "CASH" | "ONLINE";
            paymentRecord = await prisma.payment.create({
                data: {
                    hospitalId: resolvedHospitalId,
                    patientId: patient.id,
                    appointmentId: newAppointment.id,
                    amount: 0,
                    totalAmount: 0,
                    paymentMethod: method,
                    paymentStatus: "PENDING",
                    paymentDate: new Date(),
                },
            });
        }

        // Generate JWT token for the patient to automatically sign them in
        const token = generateToken({ id: patient.id, role: "patient" });

        res.cookie("token", token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });

        // ── 9. Respond ───────────────────────────────────────────────────────
        res.status(201).json({
            success: true,
            alreadyBooked: false,
            isExistingPatient,
            redirectToDashboard: true,
            token, // return token in JSON body too
            message: isExistingPatient
                ? "New token booked successfully for your existing account."
                : "Appointment token successfully booked.",
            estimated_wait_time_minutes: estimatedWaitTime,
            token_number: tokenNumber,
            appointment: {
                id: newAppointment.id,
                token_number: newAppointment.tokenNumber,
                status: newAppointment.status,
                appointment_date: newAppointment.appointmentDate,
                appointment_time: newAppointment.appointmentTime,
            },
            patient: {
                id: patient.id,
                name: patient.name,
                phone: patient.phone,
                role: patient.role,
                age: patient.age,
            },
            hospital,
            payment: paymentRecord
                ? {
                    id: paymentRecord.id,
                    payment_method: paymentRecord.paymentMethod,
                    payment_status: paymentRecord.paymentStatus,
                }
                : null,
        });
    } catch (error) {
        next(error);
    }
};
