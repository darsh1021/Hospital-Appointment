import { Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";

export const getDoctorsAdmin = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const doctors = await prisma.doctor.findMany({
            include: {
                user:     { select: { id: true, name: true, email: true, phoneNumber: true } },
                hospital: { select: { id: true, name: true } },
            },
            orderBy: { user: { name: "asc" } },
        });

        const result = doctors.map((d) => ({
            doctor_id:       d.id,
            user_id:         d.user.id,
            name:            d.user.name,
            email:           d.user.email,
            phone_number:    d.user.phoneNumber,
            specialization:  d.specialization,
            consultation_fee: d.consultationFee,
            is_available:    d.isAvailable,
            hospital_id:     d.hospital?.id ?? null,
            hospital_name:   d.hospital?.name ?? null,
        }));

        res.status(200).json({ success: true, count: result.length, doctors: result });
    } catch (error) {
        next(error);
    }
};

export const createDoctorAdmin = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, email, phone_number, password, specialization, fee, hospital_id } = req.body;

        if (!name || !email || !phone_number || !password || !specialization) {
            res.status(400).json({
                success: false,
                error: "Please provide doctor name, email, phone number, password, and specialization.",
            });
            return;
        }

        const existing = await prisma.user.findFirst({
            where: { OR: [{ email }, { phoneNumber: phone_number }] },
        });
        if (existing) {
            res.status(400).json({
                success: false,
                error: "Email or phone number is already registered to another account.",
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Resolve hospital
        let targetHospitalId: number | null = hospital_id ? Number(hospital_id) : null;
        if (!targetHospitalId) {
            const fallback = await prisma.hospital.findFirst({ select: { id: true } });
            targetHospitalId = fallback?.id ?? null;
        }

        // Atomic creation via transaction
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    phoneNumber: phone_number,
                    password:    hashedPassword,
                    role:        "doctor",
                },
            });

            const doctor = await tx.doctor.create({
                data: {
                    userId:         user.id,
                    hospitalId:     targetHospitalId,
                    specialization,
                    consultationFee: Number(fee) || 0.00,
                    isAvailable:    true,
                },
            });

            return { user, doctor };
        });

        res.status(201).json({
            success: true,
            message: "Doctor account and profile created successfully.",
            doctor: {
                doctor_id:       result.doctor.id,
                user_id:         result.user.id,
                name,
                email,
                phone_number,
                specialization,
                consultation_fee: fee || 0.00,
                hospital_id:     targetHospitalId,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const updateDoctorAdmin = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const doctorId = Number(req.params.id);
        const { name, email, phone_number, specialization, fee, is_available, hospital_id } = req.body;

        const doctor = await prisma.doctor.findUnique({
            where:  { id: doctorId },
            select: { id: true, userId: true },
        });
        if (!doctor) { res.status(404).json({ success: false, error: "Doctor profile not found." }); return; }

        const userId = doctor.userId;

        if (email) {
            const conflict = await prisma.user.findFirst({ where: { email, NOT: { id: userId } } });
            if (conflict) { res.status(400).json({ success: false, error: "Email is already in use by another user." }); return; }
        }

        if (phone_number) {
            const conflict = await prisma.user.findFirst({ where: { phoneNumber: phone_number, NOT: { id: userId } } });
            if (conflict) { res.status(400).json({ success: false, error: "Phone number is already in use by another user." }); return; }
        }

        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userId },
                data: {
                    ...(name         ? { name }                    : {}),
                    ...(email        ? { email }                   : {}),
                    ...(phone_number ? { phoneNumber: phone_number } : {}),
                },
            });

            await tx.doctor.update({
                where: { id: doctorId },
                data: {
                    ...(specialization               ? { specialization }                                : {}),
                    ...(fee !== undefined            ? { consultationFee: Number(fee) }                  : {}),
                    ...(is_available !== undefined   ? { isAvailable: is_available }                    : {}),
                    ...(hospital_id !== undefined    ? { hospitalId: Number(hospital_id) }               : {}),
                },
            });
        });

        res.status(200).json({
            success: true,
            message: "Doctor account and specialization profile updated successfully.",
        });
    } catch (error) {
        next(error);
    }
};

export const deleteDoctorAdmin = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const doctorId = Number(req.params.id);

        const doctor = await prisma.doctor.findUnique({
            where:  { id: doctorId },
            select: { userId: true },
        });
        if (!doctor) { res.status(404).json({ success: false, error: "Doctor profile not found." }); return; }

        // Deleting the user cascades to the doctor record
        await prisma.user.delete({ where: { id: doctor.userId } });

        res.status(200).json({
            success: true,
            message: "Doctor account and specialization profile deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
};

export const getPatientsAdmin = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { search } = req.query;

        const patients = await prisma.user.findMany({
            where: {
                role: "patient",
                ...(search
                    ? {
                          OR: [
                              { name:        { contains: String(search), mode: "insensitive" } },
                              { email:       { contains: String(search), mode: "insensitive" } },
                              { phoneNumber: { contains: String(search), mode: "insensitive" } },
                          ],
                      }
                    : {}),
            },
            select: { id: true, name: true, email: true, phoneNumber: true, createdAt: true },
            orderBy: { name: "asc" },
        });

        const result = patients.map((p) => ({
            id:           p.id,
            name:         p.name,
            email:        p.email,
            phone_number: p.phoneNumber,
            created_at:   p.createdAt,
        }));

        res.status(200).json({ success: true, count: result.length, patients: result });
    } catch (error) {
        next(error);
    }
};

export const getReportsAdmin = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { startDate, endDate } = req.query;

        const dateFilter: Record<string, Date> = {};
        if (startDate) dateFilter.gte = new Date(String(startDate));
        if (endDate)   dateFilter.lte = new Date(String(endDate));

        const appointmentWhere = Object.keys(dateFilter).length
            ? { appointmentDate: dateFilter }
            : {};

        // 1. Total appointments
        const totalAppointments = await prisma.appointment.count({ where: appointmentWhere });

        // 2. Revenue
        const revenueAgg = await prisma.payment.aggregate({
            where:  { appointment: appointmentWhere },
            _sum:   { amount: true },
        });
        const revenueGenerated = Number(revenueAgg._sum.amount ?? 0);

        // 3. Average wait time — raw query for EXTRACT/EPOCH
        type WaitRow = { avg_wait_time: string | null };
        let waitTimeRows: WaitRow[];
        if (startDate && endDate) {
            waitTimeRows = await prisma.$queryRaw<WaitRow[]>`
                SELECT AVG(EXTRACT(EPOCH FROM (a.consultation_started_at - a.checked_in_at)) / 60) AS avg_wait_time
                FROM appointments a
                WHERE a.checked_in_at IS NOT NULL
                  AND a.consultation_started_at IS NOT NULL
                  AND a.appointment_date BETWEEN ${new Date(String(startDate))} AND ${new Date(String(endDate))}
            `;
        } else if (startDate) {
            waitTimeRows = await prisma.$queryRaw<WaitRow[]>`
                SELECT AVG(EXTRACT(EPOCH FROM (a.consultation_started_at - a.checked_in_at)) / 60) AS avg_wait_time
                FROM appointments a
                WHERE a.checked_in_at IS NOT NULL
                  AND a.consultation_started_at IS NOT NULL
                  AND a.appointment_date >= ${new Date(String(startDate))}
            `;
        } else if (endDate) {
            waitTimeRows = await prisma.$queryRaw<WaitRow[]>`
                SELECT AVG(EXTRACT(EPOCH FROM (a.consultation_started_at - a.checked_in_at)) / 60) AS avg_wait_time
                FROM appointments a
                WHERE a.checked_in_at IS NOT NULL
                  AND a.consultation_started_at IS NOT NULL
                  AND a.appointment_date <= ${new Date(String(endDate))}
            `;
        } else {
            waitTimeRows = await prisma.$queryRaw<WaitRow[]>`
                SELECT AVG(EXTRACT(EPOCH FROM (a.consultation_started_at - a.checked_in_at)) / 60) AS avg_wait_time
                FROM appointments a
                WHERE a.checked_in_at IS NOT NULL
                  AND a.consultation_started_at IS NOT NULL
            `;
        }
        const avgWaitingTimeMinutes = waitTimeRows[0]?.avg_wait_time
            ? parseFloat(parseFloat(waitTimeRows[0].avg_wait_time).toFixed(1))
            : 0.0;

        // 4. Doctor utilization
        const doctors = await prisma.doctor.findMany({
            include: {
                user:         { select: { name: true } },
                appointments: { where: appointmentWhere, select: { status: true } },
            },
            orderBy: { user: { name: "asc" } },
        });

        const doctorUtilization = doctors.map((d) => {
            const total     = d.appointments.length;
            const completed = d.appointments.filter((a) => a.status === "completed").length;
            const rate      = total > 0 ? (completed / total) * 100 : 0.0;
            return {
                doctor_id:                   d.id,
                doctor_name:                 d.user.name,
                total_appointments:          total,
                completed_appointments:      completed,
                utilization_rate_percentage: parseFloat(rate.toFixed(1)),
            };
        });

        res.status(200).json({
            success: true,
            statistics: {
                total_appointments:           totalAppointments,
                revenue_generated:            revenueGenerated,
                average_waiting_time_minutes: avgWaitingTimeMinutes,
                doctor_utilization:           doctorUtilization,
            },
        });
    } catch (error) {
        next(error);
    }
};
