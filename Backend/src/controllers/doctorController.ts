import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { emitQueueUpdate } from "../socket/socketManager.js";
import { AppointmentStatus } from "../../generated/prisma/client.js";

export const getDoctors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { specialization, hospital_id, is_available } = req.query;

        const doctors = await prisma.staff.findMany({
            where: {
                role: "DOCTOR",
                ...(specialization
                    ? { specialization: { contains: String(specialization), mode: "insensitive" } }
                    : {}),
                ...(hospital_id ? { hospitalId: String(hospital_id) } : {}),
                ...(is_available !== undefined ? { status: is_available === "true" ? "ACTIVE" : "INACTIVE" } : {}),
            },
            include: {
                hospital: { select: { id: true, name: true, address: true } },
            },
            orderBy: { name: "asc" },
        });

        const result = doctors.map((d) => ({
            id:               d.id,
            name:             d.name,
            specialization:   d.specialization,
            experience:       d.experience,
            is_available:     d.status === "ACTIVE",
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
            select: { id: true, name: true, address: true, phoneNumber: true },
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
        const doctorId = req.user?.id;
        if (!doctorId) { res.status(401).json({ success: false, error: "Unauthorized access." }); return; }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const queue = await prisma.appointment.findMany({
            where: {
                doctorId,
                appointmentDate: today,
                status: { in: [AppointmentStatus.scheduled, AppointmentStatus.waiting, AppointmentStatus.in_consultation] },
            },
            include: {
                patient: { select: { name: true, phone: true } },
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
            patient_phone:    a.patient.phone,
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
        const doctorId = req.user?.id;
        if (!doctorId) { res.status(401).json({ success: false, error: "Unauthorized access." }); return; }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const current = await prisma.appointment.findFirst({
            where: { doctorId, appointmentDate: today, status: AppointmentStatus.in_consultation },
            include: { patient: { select: { name: true, phone: true } } },
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
                      patient_phone:    current.patient.phone,
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
        const doctorId     = req.user?.id;
        const appointmentId = String(req.params.id);
        const { status }   = req.body;

        if (!doctorId) { res.status(401).json({ success: false, error: "Unauthorized access." }); return; }

        const validStatuses = ["scheduled", "waiting", "in_consultation", "completed", "cancelled"];
        if (!status || !validStatuses.includes(status)) {
            res.status(400).json({ success: false, error: "Invalid status code specified." });
            return;
        }

        const now = new Date();

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
            success:     true,
            message:     `Appointment status updated to ${status}.`,
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
        const doctorId      = req.user?.id;
        const appointmentId = String(req.params.id);
        const { symptoms, prescription } = req.body;

        if (!doctorId) { res.status(401).json({ success: false, error: "Unauthorized access." }); return; }

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
                status:       AppointmentStatus.completed,
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
            success:     true,
            message:     "Consultation completed successfully.",
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
        const doctorId = req.user?.id;
        if (!doctorId) { res.status(401).json({ success: false, error: "Unauthorized access." }); return; }

        const followups = await prisma.appointment.findMany({
            where:   { doctorId, status: AppointmentStatus.completed },
            include: { patient: { select: { name: true, phone: true } } },
            orderBy: { appointmentDate: "desc" },
        });

        const result = followups.map((a) => ({
            id:               a.id,
            appointment_date: a.appointmentDate,
            token_number:     a.tokenNumber,
            symptoms:         a.symptoms,
            prescription:     a.prescription,
            patient_name:     a.patient.name,
            patient_phone:    a.patient.phone,
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
        const staffId = req.user?.id;
        const { is_available, specialization, experience } = req.body;

        if (!staffId) { res.status(401).json({ success: false, error: "Unauthorized access." }); return; }

        const updated = await prisma.staff.update({
            where: { id: staffId },
            data: {
                ...(is_available  !== undefined ? { status: is_available ? "ACTIVE" : "INACTIVE" } : {}),
                ...(specialization              ? { specialization }                                : {}),
                ...(experience    !== undefined ? { experience: Number(experience) }               : {}),
            },
            select: { id: true, specialization: true, experience: true, status: true },
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
