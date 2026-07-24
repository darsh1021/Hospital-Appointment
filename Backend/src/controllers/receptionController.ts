import { Response, NextFunction } from "express";
import { pool } from "../config/db.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { emitQueueUpdate } from "../socket/socketManager.js";
import { calculateEstimatedWaitTime } from "../utils/queueEstimator.js";

/**
 * Pre-register a patient into the database.
 * POST /api/reception/register-patient
 */
export const registerPatient = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, email, phone_number } = req.body;

        if (!name || !phone_number) {
            res.status(400).json({
                success: false,
                error: "Please provide patient name and phone number."
            });
            return;
        }

        // Check if email or phone is already registered
        const userCheck = await pool.query(
            "SELECT id FROM users WHERE phone_number = $1 OR (email IS NOT NULL AND email = $2)",
            [phone_number, email || null]
        );

        if (userCheck.rows.length > 0) {
            res.status(400).json({
                success: false,
                error: "Patient with this phone number or email is already registered."
            });
            return;
        }

        // Insert new patient
        const newUser = await pool.query(
            `INSERT INTO users (name, email, phone_number, role) 
             VALUES ($1, $2, $3, 'patient') 
             RETURNING id, name, email, phone_number, role, created_at`,
            [name, email || null, phone_number]
        );

        res.status(201).json({
            success: true,
            message: "Patient registered successfully.",
            patient: newUser.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Register a walk-in patient, assign a doctor, create an appointment, and generate token.
 * POST /api/reception/walk-in
 */
export const walkIn = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { patient_id, doctor_id, symptoms } = req.body;

        if (!patient_id || !doctor_id) {
            res.status(400).json({
                success: false,
                error: "Please provide patient_id and doctor_id."
            });
            return;
        }

        // Verify patient exists and is indeed a patient
        const patientCheck = await pool.query(
            "SELECT id FROM users WHERE id = $1 AND role = 'patient'",
            [Number(patient_id)]
        );
        if (patientCheck.rows.length === 0) {
            res.status(404).json({ success: false, error: "Patient profile not found." });
            return;
        }

        // Verify doctor exists and is available
        const doctorCheck = await pool.query(
            "SELECT id, hospital_id FROM doctors WHERE id = $1 AND is_available = true",
            [Number(doctor_id)]
        );
        if (doctorCheck.rows.length === 0) {
            res.status(404).json({ success: false, error: "Doctor profile not found or doctor is unavailable." });
            return;
        }
        const hospitalId = doctorCheck.rows[0].hospital_id;

        // Auto-resolve hospital ID if null
        let resolvedHospitalId = hospitalId;
        if (!resolvedHospitalId) {
            const fallbackRes = await pool.query("SELECT id FROM hospitals LIMIT 1");
            if (fallbackRes.rows.length > 0) {
                resolvedHospitalId = fallbackRes.rows[0].id;
            } else {
                res.status(400).json({
                    success: false,
                    error: "Hospital ID could not be auto-resolved (no hospitals exist in the system)."
                });
                return;
            }
        }

        const targetDate = new Date().toISOString().split("T")[0];

        // Calculate next token number for this doctor today
        const tokenRes = await pool.query(
            `SELECT COALESCE(MAX(token_number), 0) + 1 AS next_token 
             FROM appointments 
             WHERE doctor_id = $1 AND appointment_date = $2`,
            [Number(doctor_id), targetDate]
        );
        const tokenNumber = parseInt(tokenRes.rows[0].next_token, 10);

        // Calculate estimated wait time before adding the new appointment
        const estimatedWaitTime = await calculateEstimatedWaitTime(Number(doctor_id), targetDate);

        // Create appointment with 'waiting' status because the walk-in patient is physically present
        const newAppointmentRes = await pool.query(
            `INSERT INTO appointments (patient_id, doctor_id, hospital_id, appointment_date, token_number, status, symptoms, checked_in_at) 
             VALUES ($1, $2, $3, $4, $5, 'waiting', $6, CURRENT_TIMESTAMP) 
             RETURNING id, patient_id, doctor_id, hospital_id, appointment_date, token_number, status, symptoms, checked_in_at, created_at`,
            [Number(patient_id), Number(doctor_id), Number(resolvedHospitalId), targetDate, tokenNumber, symptoms || null]
        );

        // Notify client interfaces in real-time
        emitQueueUpdate(Number(doctor_id), {
            action: "appointment_booked",
            appointment_id: newAppointmentRes.rows[0].id,
            status: "waiting",
            token_number: tokenNumber
        });

        res.status(201).json({
            success: true,
            message: "Walk-in appointment registered successfully and token generated.",
            estimated_wait_time_minutes: estimatedWaitTime,
            appointment: newAppointmentRes.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get consolidated view of queues across all doctors in the clinic for today.
 * GET /api/reception/live-queue
 */
export const getLiveQueue = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const queueRes = await pool.query(
            `SELECT 
                d.id AS doctor_id,
                u_doc.name AS doctor_name,
                d.specialization,
                d.is_available,
                a.id AS appointment_id,
                a.token_number,
                a.status AS appointment_status,
                u_pat.name AS patient_name,
                u_pat.phone_number AS patient_phone
             FROM doctors d
             JOIN users u_doc ON d.user_id = u_doc.id
             LEFT JOIN appointments a ON d.id = a.doctor_id 
                AND a.appointment_date = CURRENT_DATE 
                AND a.status IN ('scheduled', 'waiting', 'in-consultation')
             LEFT JOIN users u_pat ON a.patient_id = u_pat.id
             ORDER BY u_doc.name ASC, a.token_number ASC`
        );

        const doctorsMap: Record<number, any> = {};
        for (const row of queueRes.rows) {
            if (!doctorsMap[row.doctor_id]) {
                doctorsMap[row.doctor_id] = {
                    doctor_id: row.doctor_id,
                    doctor_name: row.doctor_name,
                    specialization: row.specialization,
                    is_available: row.is_available,
                    queue: []
                };
            }
            if (row.appointment_id) {
                doctorsMap[row.doctor_id].queue.push({
                    appointment_id: row.appointment_id,
                    token_number: row.token_number,
                    status: row.appointment_status,
                    patient_name: row.patient_name,
                    patient_phone: row.patient_phone
                });
            }
        }

        res.status(200).json({
            success: true,
            doctors: Object.values(doctorsMap)
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update patient check-in status or state.
 * PUT /api/reception/appointments/:id/status
 */
export const updateAppointmentStatusByReception = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const appointmentId = Number(req.params.id);
        const { status } = req.body;

        const validStatuses = ["scheduled", "waiting", "in-consultation", "completed", "cancelled"];
        if (!status || !validStatuses.includes(status)) {
            res.status(400).json({ success: false, error: "Invalid status code specified." });
            return;
        }

        let timeField = "";
        if (status === "waiting") {
            timeField = ", checked_in_at = COALESCE(checked_in_at, CURRENT_TIMESTAMP)";
        } else if (status === "in-consultation") {
            timeField = ", consultation_started_at = COALESCE(consultation_started_at, CURRENT_TIMESTAMP)";
        } else if (status === "completed") {
            timeField = ", completed_at = COALESCE(completed_at, CURRENT_TIMESTAMP)";
        }

        const updateRes = await pool.query(
            `UPDATE appointments 
             SET status = $1 ${timeField} 
             WHERE id = $2 
             RETURNING id, status, token_number, doctor_id`,
            [status, appointmentId]
        );

        if (updateRes.rows.length === 0) {
            res.status(404).json({ success: false, error: "Appointment not found." });
            return;
        }

        const updatedAppointment = updateRes.rows[0];

        // Notify client interfaces in real-time
        emitQueueUpdate(updatedAppointment.doctor_id, {
            action: "status_changed",
            appointment_id: appointmentId,
            status,
            token_number: updatedAppointment.token_number
        });

        res.status(200).json({
            success: true,
            message: `Appointment status updated to ${status}.`,
            appointment: updatedAppointment
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Record payment/invoice details.
 * POST /api/reception/payments
 */
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
                error: "Please provide appointment_id, amount, and payment method."
            });
            return;
        }

        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            res.status(400).json({
                success: false,
                error: "Amount must be a positive number."
            });
            return;
        }

        const validMethods = ["cash", "card", "upi"];
        if (!validMethods.includes(method.toLowerCase())) {
            res.status(400).json({
                success: false,
                error: "Invalid payment method. Choose from: cash, card, upi."
            });
            return;
        }

        // Verify appointment exists
        const appointmentCheck = await pool.query(
            "SELECT id FROM appointments WHERE id = $1",
            [Number(appointment_id)]
        );
        if (appointmentCheck.rows.length === 0) {
            res.status(404).json({ success: false, error: "Appointment not found." });
            return;
        }

        // Insert payment details
        const paymentRes = await pool.query(
            `INSERT INTO payments (appointment_id, amount, method) 
             VALUES ($1, $2, $3) 
             RETURNING id, appointment_id, amount, method, created_at`,
            [Number(appointment_id), numericAmount, method.toLowerCase()]
        );

        res.status(201).json({
            success: true,
            message: "Payment details recorded successfully.",
            payment: paymentRes.rows[0]
        });
    } catch (error) {
        next(error);
    }
};
