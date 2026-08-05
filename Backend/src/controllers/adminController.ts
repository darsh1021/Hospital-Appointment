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
        const doctors = await prisma.staff.findMany({
            where:   { role: "DOCTOR" },
            include: { hospital: { select: { id: true, name: true } } },
            orderBy: { name: "asc" },
        });

        const result = doctors.map((d) => ({
            id:             d.id,
            name:           d.name,
            email:          d.email,
            phone:          d.phone,
            specialization: d.specialization,
            experience:     d.experience,
            status:         d.status,
            hospital_id:    d.hospital?.id ?? null,
            hospital_name:  d.hospital?.name ?? null,
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
        const { name, email, phone, password, specialization, experience, hospital_id } = req.body;

        if (!name || !email || !phone || !password || !specialization) {
            res.status(400).json({
                success: false,
                error:   "Please provide doctor name, email, phone number, password, and specialization.",
            });
            return;
        }

        const existing = await prisma.staff.findFirst({
            where: { OR: [{ email }, { phone }] },
        });
        if (existing) {
            res.status(400).json({
                success: false,
                error:   "Email or phone number is already registered to another account.",
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Resolve hospital
        let targetHospitalId = hospital_id ? String(hospital_id) : undefined;
        if (!targetHospitalId) {
            const fallback = await prisma.hospital.findFirst({ select: { id: true } });
            targetHospitalId = fallback?.id;
        }
        if (!targetHospitalId) {
            res.status(400).json({ success: false, error: "No hospital found to assign the doctor." });
            return;
        }

        const doctor = await prisma.staff.create({
            data: {
                name,
                email,
                phone,
                password:       hashedPassword,
                role:           "DOCTOR",
                gender:         req.body.gender ?? "OTHER",
                hospitalId:     targetHospitalId,
                specialization,
                experience:     experience ? Number(experience) : undefined,
                status:         "ACTIVE",
            },
        });

        res.status(201).json({
            success: true,
            message: "Doctor account created successfully.",
            doctor: {
                id:             doctor.id,
                name:           doctor.name,
                email:          doctor.email,
                phone:          doctor.phone,
                specialization: doctor.specialization,
                hospital_id:    doctor.hospitalId,
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
        const doctorId = String(req.params.id);
        const { name, email, phone, specialization, experience, is_available, hospital_id } = req.body;

        const doctor = await prisma.staff.findFirst({
            where:  { id: doctorId, role: "DOCTOR" },
            select: { id: true },
        });
        if (!doctor) { res.status(404).json({ success: false, error: "Doctor profile not found." }); return; }

        if (email) {
            const conflict = await prisma.staff.findFirst({ where: { email, NOT: { id: doctorId } } });
            if (conflict) { res.status(400).json({ success: false, error: "Email is already in use by another user." }); return; }
        }

        if (phone) {
            const conflict = await prisma.staff.findFirst({ where: { phone, NOT: { id: doctorId } } });
            if (conflict) { res.status(400).json({ success: false, error: "Phone number is already in use by another user." }); return; }
        }

        await prisma.staff.update({
            where: { id: doctorId },
            data: {
                ...(name           ? { name }                                                    : {}),
                ...(email          ? { email }                                                   : {}),
                ...(phone          ? { phone }                                                   : {}),
                ...(specialization ? { specialization }                                          : {}),
                ...(experience !== undefined ? { experience: Number(experience) }               : {}),
                ...(is_available   !== undefined ? { status: is_available ? "ACTIVE" : "INACTIVE" } : {}),
                ...(hospital_id    ? { hospitalId: String(hospital_id) }                         : {}),
            },
        });

        res.status(200).json({
            success: true,
            message: "Doctor profile updated successfully.",
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
        const doctorId = String(req.params.id);

        const doctor = await prisma.staff.findFirst({
            where:  { id: doctorId, role: "DOCTOR" },
            select: { id: true },
        });
        if (!doctor) { res.status(404).json({ success: false, error: "Doctor profile not found." }); return; }

        await prisma.staff.delete({ where: { id: doctorId } });

        res.status(200).json({
            success: true,
            message: "Doctor account deleted successfully.",
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

        const patients = await prisma.patient.findMany({
            where: search
                ? {
                      OR: [
                          { name:  { contains: String(search), mode: "insensitive" } },
                          { phone: { contains: String(search), mode: "insensitive" } },
                      ],
                  }
                : {},
            select:  { id: true, name: true, phone: true, address: true, createdAt: true },
            orderBy: { name: "asc" },
        });

        const result = patients.map((p) => ({
            id:         p.id,
            name:       p.name,
            phone:      p.phone,
            address:    p.address,
            created_at: p.createdAt,
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
            where: { appointment: appointmentWhere },
            _sum:  { totalAmount: true },
        });
        const revenueGenerated = Number(revenueAgg._sum.totalAmount ?? 0);

        // 3. Average wait time — raw query
        type WaitRow = { avg_wait_time: string | null };
        let waitTimeRows: WaitRow[];
        if (startDate && endDate) {
            waitTimeRows = await prisma.$queryRaw<WaitRow[]>`
                SELECT AVG(EXTRACT(EPOCH FROM ("consultationStartedAt" - "checkedInAt")) / 60) AS avg_wait_time
                FROM "Appointment"
                WHERE "checkedInAt" IS NOT NULL
                  AND "consultationStartedAt" IS NOT NULL
                  AND "appointmentDate" BETWEEN ${new Date(String(startDate))} AND ${new Date(String(endDate))}
            `;
        } else if (startDate) {
            waitTimeRows = await prisma.$queryRaw<WaitRow[]>`
                SELECT AVG(EXTRACT(EPOCH FROM ("consultationStartedAt" - "checkedInAt")) / 60) AS avg_wait_time
                FROM "Appointment"
                WHERE "checkedInAt" IS NOT NULL
                  AND "consultationStartedAt" IS NOT NULL
                  AND "appointmentDate" >= ${new Date(String(startDate))}
            `;
        } else if (endDate) {
            waitTimeRows = await prisma.$queryRaw<WaitRow[]>`
                SELECT AVG(EXTRACT(EPOCH FROM ("consultationStartedAt" - "checkedInAt")) / 60) AS avg_wait_time
                FROM "Appointment"
                WHERE "checkedInAt" IS NOT NULL
                  AND "consultationStartedAt" IS NOT NULL
                  AND "appointmentDate" <= ${new Date(String(endDate))}
            `;
        } else {
            waitTimeRows = await prisma.$queryRaw<WaitRow[]>`
                SELECT AVG(EXTRACT(EPOCH FROM ("consultationStartedAt" - "checkedInAt")) / 60) AS avg_wait_time
                FROM "Appointment"
                WHERE "checkedInAt" IS NOT NULL
                  AND "consultationStartedAt" IS NOT NULL
            `;
        }
        const avgWaitingTimeMinutes = waitTimeRows[0]?.avg_wait_time
            ? parseFloat(parseFloat(waitTimeRows[0].avg_wait_time).toFixed(1))
            : 0.0;

        // 4. Doctor utilization
        const doctors = await prisma.staff.findMany({
            where:   { role: "DOCTOR" },
            include: {
                appointments: { where: appointmentWhere, select: { status: true } },
            },
            orderBy: { name: "asc" },
        });

        const doctorUtilization = doctors.map((d) => {
            const total     = d.appointments.length;
            const completed = d.appointments.filter((a) => a.status === "completed").length;
            const rate      = total > 0 ? (completed / total) * 100 : 0.0;
            return {
                doctor_id:                   d.id,
                doctor_name:                 d.name,
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
