import { Response, NextFunction } from "express";
import { prisma } from "../config/db.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { AppointmentStatus } from "../../generated/prisma/client.js";

export const getPatientAppointments = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const patientId = req.user?.id;
        if (!patientId) { res.status(401).json({ success: false, error: "Unauthorized access." }); return; }

        const appointments = await prisma.appointment.findMany({
            where:   { patientId },
            include: {
                doctor:   { select: { name: true, specialization: true } },
                hospital: { select: { name: true, address: true } },
            },
            orderBy: [{ appointmentDate: "desc" }, { tokenNumber: "asc" }],
        });

        const result = appointments.map((a) => ({
            id:                    a.id,
            appointment_date:      a.appointmentDate,
            token_number:          a.tokenNumber,
            status:                a.status,
            symptoms:              a.symptoms,
            prescription:          a.prescription,
            created_at:            a.createdAt,
            doctor_name:           a.doctor.name,
            doctor_specialization: a.doctor.specialization,
            hospital_name:         a.hospital.name,
            hospital_address:      a.hospital.address,
        }));

        res.status(200).json({ success: true, count: result.length, appointments: result });
    } catch (error) {
        next(error);
    }
};

export const getPatientPrescriptions = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const patientId = req.user?.id;
        if (!patientId) { res.status(401).json({ success: false, error: "Unauthorized access." }); return; }

        const prescriptions = await prisma.appointment.findMany({
            where:   { patientId, status: AppointmentStatus.completed, NOT: { prescription: null } },
            include: { doctor: { select: { name: true, specialization: true } } },
            orderBy: { appointmentDate: "desc" },
        });

        const result = prescriptions.map((a) => ({
            id:                    a.id,
            appointment_date:      a.appointmentDate,
            prescription:          a.prescription,
            symptoms:              a.symptoms,
            doctor_name:           a.doctor.name,
            doctor_specialization: a.doctor.specialization,
        }));

        res.status(200).json({ success: true, count: result.length, prescriptions: result });
    } catch (error) {
        next(error);
    }
};

export const updatePatientProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const patientId = req.user?.id;
        const { name, phone, address } = req.body;

        if (!patientId) { res.status(401).json({ success: false, error: "Unauthorized access." }); return; }

        if (phone) {
            const conflict = await prisma.patient.findFirst({
                where: { phone, NOT: { id: patientId } },
            });
            if (conflict) {
                res.status(400).json({ success: false, error: "Phone number is already registered to another account." });
                return;
            }
        }

        const updated = await prisma.patient.update({
            where: { id: patientId },
            data: {
                ...(name    ? { name }    : {}),
                ...(phone   ? { phone }   : {}),
                ...(address ? { address } : {}),
            },
            select: { id: true, name: true, phone: true, address: true, hospitalId: true, createdAt: true },
        });

        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: {
                id:          updated.id,
                name:        updated.name,
                phone:       updated.phone,
                address:     updated.address,
                hospital_id: updated.hospitalId,
                created_at:  updated.createdAt,
            },
        });
    } catch (error) {
        next(error);
    }
};
