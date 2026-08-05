import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db.js";
import { calculateEstimatedWaitTime } from "../utils/queueEstimator.js";

export const bookToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, phone, doctor_id, hospital_id, appointment_date, symptoms } = req.body;

        if (!name || !phone || !doctor_id) {
            res.status(400).json({
                success: false,
                error:   "Please provide patient name, phone, and doctor_id.",
            });
            return;
        }

        // Resolve hospital_id (staff.id is a String cuid)
        let resolvedHospitalId = hospital_id as string | undefined;
        if (!resolvedHospitalId) {
            const doc = await prisma.staff.findUnique({
                where:  { id: String(doctor_id) },
                select: { hospitalId: true },
            });
            resolvedHospitalId = doc?.hospitalId ?? undefined;

            if (!resolvedHospitalId) {
                const fallback = await prisma.hospital.findFirst({ select: { id: true } });
                if (fallback) {
                    resolvedHospitalId = fallback.id;
                } else {
                    res.status(400).json({
                        success: false,
                        error:   "Hospital ID could not be auto-resolved (no hospitals exist in the system).",
                    });
                    return;
                }
            }
        }

        const targetDate = appointment_date
            ? new Date(appointment_date)
            : (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();

        const appointmentTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

        // Find or create patient
        let patient = await prisma.patient.findUnique({ where: { phone } });
        if (!patient) {
            patient = await prisma.patient.create({
                data: {
                    name,
                    phone,
                    gender:     "OTHER",
                    hospitalId: resolvedHospitalId,
                },
            });
        }

        const doctorId = String(doctor_id);
        const estimatedWaitTime = await calculateEstimatedWaitTime(doctorId, targetDate);

        // Next token number
        const maxToken = await prisma.appointment.aggregate({
            where: { doctorId, appointmentDate: targetDate },
            _max:  { tokenNumber: true },
        });
        const tokenNumber = (maxToken._max.tokenNumber ?? 0) + 1;

        const newAppointment = await prisma.appointment.create({
            data: {
                patientId:       patient.id,
                doctorId,
                hospitalId:      resolvedHospitalId,
                appointmentDate: targetDate,
                appointmentTime,
                tokenNumber,
                bookingSource:   "ONLINE",
                status:          "scheduled",
                symptoms:        symptoms ?? null,
            },
        });

        res.status(201).json({
            success: true,
            message: "Appointment token successfully booked.",
            estimated_wait_time_minutes: estimatedWaitTime,
            appointment: newAppointment,
        });
    } catch (error) {
        next(error);
    }
};
