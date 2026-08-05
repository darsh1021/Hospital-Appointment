import { Response, NextFunction } from "express";
import { prisma } from "../config/db.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { emitQueueUpdate } from "../socket/socketManager.js";
import { calculateEstimatedWaitTime } from "../utils/queueEstimator.js";
import { AppointmentStatus } from "../../generated/prisma/client.js";

export const registerPatient = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, phone } = req.body;

        if (!name || !phone) {
            res.status(400).json({ success: false, error: "Please provide patient name and phone number." });
            return;
        }

        const conflict = await prisma.patient.findUnique({ where: { phone } });
        if (conflict) {
            res.status(400).json({
                success: false,
                error:   "Patient with this phone number is already registered.",
            });
            return;
        }

        // Use the receptionist's hospital or fallback
        const hospitalId = req.user?.hospitalId ?? (await prisma.hospital.findFirst({ select: { id: true } }))?.id;
        if (!hospitalId) {
            res.status(400).json({ success: false, error: "No hospital found." });
            return;
        }

        const newPatient = await prisma.patient.create({
            data: {
                name,
                phone,
                gender:     req.body.gender ?? "OTHER",
                address:    req.body.address ?? null,
                hospitalId,
            },
            select: { id: true, name: true, phone: true, createdAt: true },
        });

        res.status(201).json({
            success: true,
            message: "Patient registered successfully.",
            patient: newPatient,
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

        const patientId = String(patient_id);
        const doctorId  = String(doctor_id);

        const patient = await prisma.patient.findUnique({ where: { id: patientId } });
        if (!patient) { res.status(404).json({ success: false, error: "Patient not found." }); return; }

        const doctor = await prisma.staff.findFirst({
            where:  { id: doctorId, role: "DOCTOR", status: "ACTIVE" },
            select: { id: true, hospitalId: true },
        });
        if (!doctor) {
            res.status(404).json({ success: false, error: "Doctor profile not found or doctor is unavailable." });
            return;
        }

        const resolvedHospitalId = doctor.hospitalId
            ?? (await prisma.hospital.findFirst({ select: { id: true } }))?.id;
        if (!resolvedHospitalId) {
            res.status(400).json({ success: false, error: "Hospital ID could not be auto-resolved." });
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const estimatedWaitTime = await calculateEstimatedWaitTime(doctorId, today);

        const maxToken = await prisma.appointment.aggregate({
            where: { doctorId, appointmentDate: today },
            _max:  { tokenNumber: true },
        });
        const tokenNumber = (maxToken._max.tokenNumber ?? 0) + 1;

        const appointmentTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

        const newAppointment = await prisma.appointment.create({
            data: {
                patientId:       patientId,
                doctorId:        doctorId,
                hospitalId:      resolvedHospitalId,
                appointmentDate: today,
                appointmentTime,
                tokenNumber,
                bookingSource:   "WALK_IN",
                status:          AppointmentStatus.waiting,
                symptoms:        symptoms ?? null,
                checkedInAt:     new Date(),
            },
        });

        emitQueueUpdate(doctorId, {
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

        const doctors = await prisma.staff.findMany({
            where: { role: "DOCTOR" },
            include: {
                appointments: {
                    where: {
                        appointmentDate: today,
                        status: {
                            in: [
                                AppointmentStatus.scheduled,
                                AppointmentStatus.waiting,
                                AppointmentStatus.in_consultation,
                            ],
                        },
                    },
                    include: { patient: { select: { name: true, phone: true } } },
                    orderBy: { tokenNumber: "asc" },
                },
            },
            orderBy: { name: "asc" },
        });

        const result = doctors.map((d) => ({
            doctor_id:      d.id,
            doctor_name:    d.name,
            specialization: d.specialization,
            is_available:   d.status === "ACTIVE",
            queue:          d.appointments.map((a) => ({
                appointment_id: a.id,
                token_number:   a.tokenNumber,
                status:         a.status,
                patient_name:   a.patient.name,
                patient_phone:  a.patient.phone,
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
        const appointmentId = String(req.params.id);
        const { status }    = req.body;

        const validStatuses = ["scheduled", "waiting", "in_consultation", "completed", "cancelled"];
        if (!status || !validStatuses.includes(status)) {
            res.status(400).json({ success: false, error: "Invalid status code specified." });
            return;
        }

        const existing = await prisma.appointment.findUnique({ where: { id: appointmentId } });
        if (!existing) { res.status(404).json({ success: false, error: "Appointment not found." }); return; }

        const now     = new Date();
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
            success:     true,
            message:     `Appointment status updated to ${status}.`,
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
        const { appointment_id, amount, discount, tax, method } = req.body;

        if (!appointment_id || amount === undefined || !method) {
            res.status(400).json({
                success: false,
                error:   "Please provide appointment_id, amount, and payment method.",
            });
            return;
        }

        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            res.status(400).json({ success: false, error: "Amount must be a positive number." });
            return;
        }

        const validMethods = ["CASH", "ONLINE"];
        const normalizedMethod = String(method).toUpperCase();
        if (!validMethods.includes(normalizedMethod)) {
            res.status(400).json({
                success: false,
                error:   "Invalid payment method. Choose from: CASH, ONLINE.",
            });
            return;
        }

        const appointment = await prisma.appointment.findUnique({
            where:  { id: String(appointment_id) },
            select: { id: true, patientId: true, hospitalId: true },
        });
        if (!appointment) { res.status(404).json({ success: false, error: "Appointment not found." }); return; }

        const numDiscount   = discount   ? Number(discount)   : 0;
        const numTax        = tax        ? Number(tax)        : 0;
        const totalAmount   = numericAmount - numDiscount + numTax;

        const payment = await prisma.payment.create({
            data: {
                appointmentId:  appointment.id,
                patientId:      appointment.patientId,
                hospitalId:     appointment.hospitalId,
                amount:         numericAmount,
                discount:       numDiscount,
                tax:            numTax,
                totalAmount,
                paymentMethod:  normalizedMethod as "CASH" | "ONLINE",
                paymentStatus:  "PAID",
                paymentDate:    new Date(),
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
