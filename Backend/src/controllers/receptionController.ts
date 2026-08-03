import { Response, NextFunction } from "express";
import { prisma } from "../config/db.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { emitQueueUpdate } from "../socket/socketManager.js";
import { calculateEstimatedWaitTime } from "../utils/queueEstimator.js";
import { AppointmentStatus } from "@prisma/client";

export const registerPatient = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, email, phone_number } = req.body;

        if (!name || !phone_number) {
            res.status(400).json({ success: false, error: "Please provide patient name and phone number." });
            return;
        }

        const conflict = await prisma.user.findFirst({
            where: {
                OR: [
                    { phoneNumber: phone_number },
                    ...(email ? [{ email }] : []),
                ],
            },
        });

        if (conflict) {
            res.status(400).json({
                success: false,
                error: "Patient with this phone number or email is already registered.",
            });
            return;
        }

        const newUser = await prisma.user.create({
            data: { name, email: email ?? null, phoneNumber: phone_number, role: "patient" },
            select: { id: true, name: true, email: true, phoneNumber: true, role: true, createdAt: true },
        });

        res.status(201).json({
            success: true,
            message: "Patient registered successfully.",
            patient: {
                id:           newUser.id,
                name:         newUser.name,
                email:        newUser.email,
                phone_number: newUser.phoneNumber,
                role:         newUser.role,
                created_at:   newUser.createdAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const walkIn = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { patient_id, doctor_id, symptoms } = req.body;

        if (!patient_id || !doctor_id) {
            res.status(400).json({ success: false, error: "Please provide patient_id and doctor_id." });
            return;
        }

        const patient = await prisma.user.findFirst({
            where: { id: Number(patient_id), role: "patient" },
        });
        if (!patient) { res.status(404).json({ success: false, error: "Patient profile not found." }); return; }

        const doctor = await prisma.doctor.findFirst({
            where: { id: Number(doctor_id), isAvailable: true },
            select: { id: true, hospitalId: true },
        });
        if (!doctor) {
            res.status(404).json({ success: false, error: "Doctor profile not found or doctor is unavailable." });
            return;
        }

        let resolvedHospitalId = doctor.hospitalId;
        if (!resolvedHospitalId) {
            const fallback = await prisma.hospital.findFirst({ select: { id: true } });
            if (!fallback) {
                res.status(400).json({
                    success: false,
                    error: "Hospital ID could not be auto-resolved (no hospitals exist in the system).",
                });
                return;
            }
            resolvedHospitalId = fallback.id;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const estimatedWaitTime = await calculateEstimatedWaitTime(Number(doctor_id), today);

        const maxToken = await prisma.appointment.aggregate({
            where:  { doctorId: Number(doctor_id), appointmentDate: today },
            _max:   { tokenNumber: true },
        });
        const tokenNumber = (maxToken._max.tokenNumber ?? 0) + 1;

        const newAppointment = await prisma.appointment.create({
            data: {
                patientId:       Number(patient_id),
                doctorId:        Number(doctor_id),
                hospitalId:      resolvedHospitalId,
                appointmentDate: today,
                tokenNumber,
                status:          "waiting",
                symptoms:        symptoms ?? null,
                checkedInAt:     new Date(),
            },
        });

        emitQueueUpdate(Number(doctor_id), {
            action:         "appointment_booked",
            appointment_id: newAppointment.id,
            status:         "waiting",
            token_number:   tokenNumber,
        });

        res.status(201).json({
            success: true,
            message: "Walk-in appointment registered successfully and token generated.",
            estimated_wait_time_minutes: estimatedWaitTime,
            appointment: newAppointment,
        });
    } catch (error) {
        next(error);
    }
};

export const getLiveQueue = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const doctors = await prisma.doctor.findMany({
            include: {
                user:         { select: { name: true } },
                appointments: {
                    where: {
                        appointmentDate: today,
                        status: { in: ["scheduled", "waiting", "in_consultation"] },
                    },
                    include: { patient: { select: { name: true, phoneNumber: true } } },
                    orderBy: { tokenNumber: "asc" },
                },
            },
            orderBy: { user: { name: "asc" } },
        });

        const result = doctors.map((d) => ({
            doctor_id:      d.id,
            doctor_name:    d.user.name,
            specialization: d.specialization,
            is_available:   d.isAvailable,
            queue:          d.appointments.map((a) => ({
                appointment_id: a.id,
                token_number:   a.tokenNumber,
                status:         a.status,
                patient_name:   a.patient.name,
                patient_phone:  a.patient.phoneNumber,
            })),
        }));

        res.status(200).json({ success: true, doctors: result });
    } catch (error) {
        next(error);
    }
};

export const updateAppointmentStatusByReception = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const appointmentId = Number(req.params.id);
        const { status } = req.body;

        const validStatuses = ["scheduled", "waiting", "in_consultation", "completed", "cancelled"];
        if (!status || !validStatuses.includes(status)) {
            res.status(400).json({ success: false, error: "Invalid status code specified." });
            return;
        }

        const existing = await prisma.appointment.findUnique({ where: { id: appointmentId } });
        if (!existing) { res.status(404).json({ success: false, error: "Appointment not found." }); return; }

        const now = new Date();
        const updated = await prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                status: status as AppointmentStatus,
                ...(status === "waiting"         && !existing.checkedInAt           ? { checkedInAt: now }           : {}),
                ...(status === "in_consultation" && !existing.consultationStartedAt ? { consultationStartedAt: now } : {}),
                ...(status === "completed"       && !existing.completedAt           ? { completedAt: now }           : {}),
            },
            select: { id: true, status: true, tokenNumber: true, doctorId: true },
        });

        emitQueueUpdate(updated.doctorId, {
            action:         "status_changed",
            appointment_id: appointmentId,
            status,
            token_number:   updated.tokenNumber,
        });

        res.status(200).json({
            success: true,
            message: `Appointment status updated to ${status}.`,
            appointment: updated,
        });
    } catch (error) {
        next(error);
    }
};

export const createPayment = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { appointment_id, amount, method } = req.body;

        if (!appointment_id || amount === undefined || !method) {
            res.status(400).json({
                success: false,
                error: "Please provide appointment_id, amount, and payment method.",
            });
            return;
        }

        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            res.status(400).json({ success: false, error: "Amount must be a positive number." });
            return;
        }

        const validMethods = ["cash", "card", "upi"];
        if (!validMethods.includes(method.toLowerCase())) {
            res.status(400).json({
                success: false,
                error: "Invalid payment method. Choose from: cash, card, upi.",
            });
            return;
        }

        const appointment = await prisma.appointment.findUnique({
            where: { id: Number(appointment_id) },
        });
        if (!appointment) { res.status(404).json({ success: false, error: "Appointment not found." }); return; }

        const payment = await prisma.payment.create({
            data: {
                appointmentId: Number(appointment_id),
                amount:        numericAmount,
                method:        method.toLowerCase() as "cash" | "card" | "upi",
            },
        });

        res.status(201).json({
            success: true,
            message: "Payment details recorded successfully.",
            payment,
        });
    } catch (error) {
        next(error);
    }
};
