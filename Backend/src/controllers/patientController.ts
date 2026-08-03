import { Response, NextFunction } from "express";
import { prisma } from "../config/db.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";

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
                doctor:   { include: { user: { select: { name: true } } } },
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
            doctor_name:           a.doctor.user.name,
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
            where:  { patientId, status: "completed", NOT: { prescription: null } },
            include: { doctor: { include: { user: { select: { name: true } } } } },
            orderBy: { appointmentDate: "desc" },
        });

        const result = prescriptions.map((a) => ({
            id:                    a.id,
            appointment_date:      a.appointmentDate,
            prescription:          a.prescription,
            symptoms:              a.symptoms,
            doctor_name:           a.doctor.user.name,
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
        const { name, email, phone_number } = req.body;

        if (!patientId) { res.status(401).json({ success: false, error: "Unauthorized access." }); return; }

        if (email) {
            const conflict = await prisma.user.findFirst({
                where: { email, NOT: { id: patientId } },
            });
            if (conflict) {
                res.status(400).json({ success: false, error: "Email is already registered to another account." });
                return;
            }
        }

        if (phone_number) {
            const conflict = await prisma.user.findFirst({
                where: { phoneNumber: phone_number, NOT: { id: patientId } },
            });
            if (conflict) {
                res.status(400).json({ success: false, error: "Phone number is already registered to another account." });
                return;
            }
        }

        const updated = await prisma.user.update({
            where: { id: patientId },
            data: {
                ...(name         ? { name }                    : {}),
                ...(email        ? { email }                   : {}),
                ...(phone_number ? { phoneNumber: phone_number } : {}),
            },
            select: { id: true, name: true, email: true, phoneNumber: true, role: true, createdAt: true },
        });

        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: {
                id:           updated.id,
                name:         updated.name,
                email:        updated.email,
                phone_number: updated.phoneNumber,
                role:         updated.role,
                created_at:   updated.createdAt,
            },
        });
    } catch (error) {
        next(error);
    }
};
