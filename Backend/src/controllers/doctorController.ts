import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { emitQueueUpdate } from "../socket/socketManager.js";
import { AppointmentStatus } from "@prisma/client";

const getDoctorIdFromUser = async (userId: number): Promise<number | null> => {
    const doctor = await prisma.doctor.findUnique({ where: { userId }, select: { id: true } });
    return doctor?.id ?? null;
};

export const getDoctors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { specialization, hospital_id, is_available } = req.query;

        const doctors = await prisma.doctor.findMany({
            where: {
                ...(specialization
                    ? { specialization: { contains: String(specialization), mode: "insensitive" } }
                    : {}),
                ...(hospital_id ? { hospitalId: Number(hospital_id) } : {}),
                ...(is_available !== undefined ? { isAvailable: is_available === "true" } : {}),
            },
            include: {
                user:     { select: { name: true } },
                hospital: { select: { id: true, name: true, address: true } },
            },
            orderBy: { user: { name: "asc" } },
        });

        const result = doctors.map((d) => ({
            id:               d.id,
            name:             d.user.name,
            specialization:   d.specialization,
            consultation_fee: d.consultationFee,
            is_available:     d.isAvailable,
            hospital_id:      d.hospital?.id ?? null,
            hospital_name:    d.hospital?.name ?? null,
            hospital_address: d.hospital?.address ?? null,
        }));

        res.status(200).json({ success: true, count: result.length, doctors: result });
    } catch (error) {
        next(error);
    }
};

export const getHospitals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const hospitals = await prisma.hospital.findMany({
            select: { id: true, name: true, address: true, phone: true },
            orderBy: { name: "asc" },
        });
        res.status(200).json({ success: true, count: hospitals.length, hospitals });
    } catch (error) {
        next(error);
    }
};

export const getDoctorQueue = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) { res.status(401).json({ success: false, error: "Unauthorized access." }); return; }

        const doctorId = await getDoctorIdFromUser(userId);
        if (!doctorId) { res.status(404).json({ success: false, error: "Doctor profile not found." }); return; }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const queue = await prisma.appointment.findMany({
            where: {
                doctorId,
                appointmentDate: today,
                status: { in: ["scheduled", "waiting", "in_consultation"] },
            },
            include: {
                patient: { select: { name: true, phoneNumber: true } },
            },
            orderBy: { tokenNumber: "asc" },
        });

        const result = queue.map((a) => ({
            id:               a.id,
            appointment_date: a.appointmentDate,
            token_number:     a.tokenNumber,
            status:           a.status,
            symptoms:         a.symptoms,
            patient_name:     a.patient.name,
            patient_phone:    a.patient.phoneNumber,
        }));

        res.status(200).json({ success: true, count: result.length, queue: result });
    } catch (error) {
        next(error);
    }
};

export const getCurrentPatient = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) { res.status(401).json({ success: false, error: "Unauthorized access." }); return; }

        const doctorId = await getDoctorIdFromUser(userId);
        if (!doctorId) { res.status(404).json({ success: false, error: "Doctor profile not found." }); return; }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const current = await prisma.appointment.findFirst({
            where: { doctorId, appointmentDate: today, status: "in_consultation" },
            include: { patient: { select: { name: true, phoneNumber: true } } },
        });

        res.status(200).json({
            success: true,
            patient: current
                ? {
                      id:               current.id,
                      appointment_date: current.appointmentDate,
                      token_number:     current.tokenNumber,
                      status:           current.status,
                      symptoms:         current.symptoms,
                      patient_name:     current.patient.name,
                      patient_phone:    current.patient.phoneNumber,
                  }
                : null,
        });
    } catch (error) {
        next(error);
    }
};

export const updateAppointmentStatus = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id;
        const appointmentId = Number(req.params.id);
        const { status } = req.body;

        if (!userId) { res.status(401).json({ success: false, error: "Unauthorized access." }); return; }

        const doctorId = await getDoctorIdFromUser(userId);
        if (!doctorId) { res.status(404).json({ success: false, error: "Doctor profile not found." }); return; }

        const validStatuses = ["scheduled", "waiting", "in_consultation", "completed", "cancelled"];
        if (!status || !validStatuses.includes(status)) {
            res.status(400).json({ success: false, error: "Invalid status code specified." });
            return;
        }

        const now = new Date();
        const timeUpdate: Record<string, Date> = {};
        if (status === "waiting")         timeUpdate.checkedInAt            = now;
        if (status === "in_consultation") timeUpdate.consultationStartedAt  = now;
        if (status === "completed")       timeUpdate.completedAt            = now;

        const existing = await prisma.appointment.findFirst({
            where: { id: appointmentId, doctorId },
        });
        if (!existing) {
            res.status(404).json({ success: false, error: "Appointment not found for this doctor." });
            return;
        }

        const updated = await prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                status: status as AppointmentStatus,
                ...(status === "waiting"         && !existing.checkedInAt           ? { checkedInAt: now }           : {}),
                ...(status === "in_consultation" && !existing.consultationStartedAt ? { consultationStartedAt: now } : {}),
                ...(status === "completed"       && !existing.completedAt           ? { completedAt: now }           : {}),
            },
            select: { id: true, status: true, tokenNumber: true },
        });

        emitQueueUpdate(doctorId, {
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

export const completeConsultation = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id;
        const appointmentId = Number(req.params.id);
        const { symptoms, prescription } = req.body;

        if (!userId) { res.status(401).json({ success: false, error: "Unauthorized access." }); return; }

        const doctorId = await getDoctorIdFromUser(userId);
        if (!doctorId) { res.status(404).json({ success: false, error: "Doctor profile not found." }); return; }

        if (!prescription) {
            res.status(400).json({ success: false, error: "Please write a prescription to complete the consultation." });
            return;
        }

        const existing = await prisma.appointment.findFirst({ where: { id: appointmentId, doctorId } });
        if (!existing) {
            res.status(404).json({ success: false, error: "Appointment not found for this doctor." });
            return;
        }

        const updated = await prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                status:       "completed",
                prescription,
                symptoms:     symptoms ?? existing.symptoms,
                completedAt:  existing.completedAt ?? new Date(),
            },
            select: { id: true, status: true, prescription: true, symptoms: true, tokenNumber: true },
        });

        emitQueueUpdate(doctorId, {
            action:         "consultation_completed",
            appointment_id: appointmentId,
            status:         "completed",
            token_number:   updated.tokenNumber,
        });

        res.status(200).json({
            success: true,
            message: "Consultation completed successfully.",
            appointment: updated,
        });
    } catch (error) {
        next(error);
    }
};

export const getDoctorFollowups = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) { res.status(401).json({ success: false, error: "Unauthorized access." }); return; }

        const doctorId = await getDoctorIdFromUser(userId);
        if (!doctorId) { res.status(404).json({ success: false, error: "Doctor profile not found." }); return; }

        const followups = await prisma.appointment.findMany({
            where:   { doctorId, status: "completed" },
            include: { patient: { select: { name: true, phoneNumber: true } } },
            orderBy: { appointmentDate: "desc" },
        });

        const result = followups.map((a) => ({
            id:               a.id,
            appointment_date: a.appointmentDate,
            token_number:     a.tokenNumber,
            symptoms:         a.symptoms,
            prescription:     a.prescription,
            patient_name:     a.patient.name,
            patient_phone:    a.patient.phoneNumber,
        }));

        res.status(200).json({ success: true, count: result.length, followups: result });
    } catch (error) {
        next(error);
    }
};

export const updateDoctorProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { is_available, consultation_fee, specialization } = req.body;

        if (!userId) { res.status(401).json({ success: false, error: "Unauthorized access." }); return; }

        const doctorId = await getDoctorIdFromUser(userId);
        if (!doctorId) { res.status(404).json({ success: false, error: "Doctor profile not found." }); return; }

        const updated = await prisma.doctor.update({
            where: { id: doctorId },
            data: {
                ...(is_available     !== undefined ? { isAvailable:     is_available }            : {}),
                ...(consultation_fee !== undefined ? { consultationFee: Number(consultation_fee) } : {}),
                ...(specialization               ? { specialization }                             : {}),
            },
            select: { id: true, specialization: true, consultationFee: true, isAvailable: true },
        });

        res.status(200).json({
            success: true,
            message: "Doctor profile updated successfully.",
            profile: updated,
        });
    } catch (error) {
        next(error);
    }
};
