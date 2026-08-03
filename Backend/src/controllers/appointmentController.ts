import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db.js";
import { calculateEstimatedWaitTime } from "../utils/queueEstimator.js";

export const bookToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, phone, doctor_id, hospital_id, appointment_date, symptoms } = req.body;

        if (!name || !phone || !doctor_id) {
            res.status(400).json({
                success: false,
                error: "Please provide patient name, phone, and doctor_id.",
            });
            return;
        }

        // Resolve hospital_id
        let resolvedHospitalId = hospital_id ? Number(hospital_id) : null;
        if (!resolvedHospitalId) {
            const doc = await prisma.doctor.findUnique({
                where:  { id: Number(doctor_id) },
                select: { hospitalId: true },
            });
            resolvedHospitalId = doc?.hospitalId ?? null;

            if (!resolvedHospitalId) {
                const fallback = await prisma.hospital.findFirst({ select: { id: true } });
                if (fallback) {
                    resolvedHospitalId = fallback.id;
                } else {
                    res.status(400).json({
                        success: false,
                        error: "Hospital ID could not be auto-resolved (no hospitals exist in the system).",
                    });
                    return;
                }
            }
        }

        const targetDate = appointment_date
            ? new Date(appointment_date)
            : (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();

        // Find or create patient
        let patient = await prisma.user.findUnique({ where: { phoneNumber: phone } });
        if (!patient) {
            patient = await prisma.user.create({
                data: { name, phoneNumber: phone, role: "patient" },
            });
        }

        const estimatedWaitTime = await calculateEstimatedWaitTime(Number(doctor_id), targetDate);

        // Next token number
        const maxToken = await prisma.appointment.aggregate({
            where:   { doctorId: Number(doctor_id), appointmentDate: targetDate },
            _max:    { tokenNumber: true },
        });
        const tokenNumber = (maxToken._max.tokenNumber ?? 0) + 1;

        const newAppointment = await prisma.appointment.create({
            data: {
                patientId:       patient.id,
                doctorId:        Number(doctor_id),
                hospitalId:      resolvedHospitalId,
                appointmentDate: targetDate,
                tokenNumber,
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
