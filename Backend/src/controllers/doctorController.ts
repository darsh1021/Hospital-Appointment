import { Request, Response, NextFunction } from "express";
import { pool } from "../config/db.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { emitQueueUpdate } from "../socket/socketManager.js";

/**
 * Get all doctors with optional filters (specialization, hospital, availability)
 */
export const getDoctors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { specialization, hospital_id, is_available } = req.query;

        let queryText = `
            SELECT 
                d.id, 
                u.name, 
                d.specialization, 
                d.consultation_fee, 
                d.is_available, 
                h.id AS hospital_id,
                h.name AS hospital_name,
                h.address AS hospital_address
            FROM doctors d
            JOIN users u ON d.user_id = u.id
            LEFT JOIN hospitals h ON d.hospital_id = h.id
        `;

        const queryParams: any[] = [];
        const whereClauses: string[] = [];

        if (specialization) {
            queryParams.push(`%${specialization}%`);
            whereClauses.push(`d.specialization ILIKE $${queryParams.length}`);
        }

        if (hospital_id) {
            queryParams.push(Number(hospital_id));
            whereClauses.push(`d.hospital_id = $${queryParams.length}`);
        }

        if (is_available !== undefined) {
            queryParams.push(is_available === "true");
            whereClauses.push(`d.is_available = $${queryParams.length}`);
        }

        if (whereClauses.length > 0) {
            queryText += ` WHERE ` + whereClauses.join(" AND ");
        }

        queryText += " ORDER BY u.name ASC";

        const doctorsRes = await pool.query(queryText, queryParams);

        res.status(200).json({
            success: true,
            count: doctorsRes.rows.length,
            doctors: doctorsRes.rows
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all hospitals/clinics
 */
export const getHospitals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await pool.query("SELECT id, name, address, phone FROM hospitals ORDER BY name ASC");
        res.status(200).json({
            success: true,
            count: result.rows.length,
            hospitals: result.rows
        });
    } catch (error) {
        next(error);
    }
};

// Helper: Retrieves doctor ID from active user session
const getDoctorIdFromUser = async (userId: number): Promise<number | null> => {
    const docRes = await pool.query("SELECT id FROM doctors WHERE user_id = $1", [userId]);
    return docRes.rows.length > 0 ? docRes.rows[0].id : null;
};

/**
 * Get active patient queue for today
 */
export const getDoctorQueue = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, error: "Unauthorized access." });
            return;
        }

        const doctorId = await getDoctorIdFromUser(userId);
        if (!doctorId) {
            res.status(404).json({ success: false, error: "Doctor profile not found." });
            return;
        }

        const queueRes = await pool.query(
            `SELECT 
                a.id, 
                a.appointment_date, 
                a.token_number, 
                a.status, 
                a.symptoms, 
                u.name AS patient_name, 
                u.phone_number AS patient_phone
            FROM appointments a
            JOIN users u ON a.patient_id = u.id
            WHERE a.doctor_id = $1 
              AND a.appointment_date = CURRENT_DATE 
              AND a.status IN ('scheduled', 'waiting', 'in-consultation')
            ORDER BY a.token_number ASC`,
            [doctorId]
        );

        res.status(200).json({
            success: true,
            count: queueRes.rows.length,
            queue: queueRes.rows
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get current patient in consultation (status = 'in-consultation')
 */
export const getCurrentPatient = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, error: "Unauthorized access." });
            return;
        }

        const doctorId = await getDoctorIdFromUser(userId);
        if (!doctorId) {
            res.status(404).json({ success: false, error: "Doctor profile not found." });
            return;
        }

        const currentRes = await pool.query(
            `SELECT 
                a.id, 
                a.appointment_date, 
                a.token_number, 
                a.status, 
                a.symptoms, 
                u.name AS patient_name, 
                u.phone_number AS patient_phone
            FROM appointments a
            JOIN users u ON a.patient_id = u.id
            WHERE a.doctor_id = $1 
              AND a.appointment_date = CURRENT_DATE 
              AND a.status = 'in-consultation'
            LIMIT 1`,
            [doctorId]
        );

        res.status(200).json({
            success: true,
            patient: currentRes.rows.length > 0 ? currentRes.rows[0] : null
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update the status of an appointment in the doctor's queue
 */
export const updateAppointmentStatus = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id;
        const appointmentId = Number(req.params.id);
        const { status } = req.body;

        if (!userId) {
            res.status(401).json({ success: false, error: "Unauthorized access." });
            return;
        }

        const doctorId = await getDoctorIdFromUser(userId);
        if (!doctorId) {
            res.status(404).json({ success: false, error: "Doctor profile not found." });
            return;
        }

        const validStatuses = ["scheduled", "waiting", "in-consultation", "completed", "cancelled"];
        if (!status || !validStatuses.includes(status)) {
            res.status(400).json({ success: false, error: "Invalid status code specified." });
            return;
        }

        const updateRes = await pool.query(
            `UPDATE appointments 
             SET status = $1 
             WHERE id = $2 AND doctor_id = $3
             RETURNING id, status, token_number`,
            [status, appointmentId, doctorId]
        );

        if (updateRes.rows.length === 0) {
            res.status(404).json({ success: false, error: "Appointment not found for this doctor." });
            return;
        }

        // Notify client interfaces in real-time
        emitQueueUpdate(doctorId, {
            action: "status_changed",
            appointment_id: appointmentId,
            status,
            token_number: updateRes.rows[0].token_number
        });

        res.status(200).json({
            success: true,
            message: `Appointment status updated to ${status}.`,
            appointment: updateRes.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Complete patient consultation: Write prescription and mark completed
 */
export const completeConsultation = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id;
        const appointmentId = Number(req.params.id);
        const { symptoms, prescription } = req.body;

        if (!userId) {
            res.status(401).json({ success: false, error: "Unauthorized access." });
            return;
        }

        const doctorId = await getDoctorIdFromUser(userId);
        if (!doctorId) {
            res.status(404).json({ success: false, error: "Doctor profile not found." });
            return;
        }

        if (!prescription) {
            res.status(400).json({ success: false, error: "Please write a prescription to complete the consultation." });
            return;
        }

        const updateRes = await pool.query(
            `UPDATE appointments 
             SET status = 'completed', 
                 prescription = $1, 
                 symptoms = COALESCE($2, symptoms)
             WHERE id = $3 AND doctor_id = $4
             RETURNING id, status, prescription, symptoms, token_number`,
            [prescription, symptoms || null, appointmentId, doctorId]
        );

        if (updateRes.rows.length === 0) {
            res.status(404).json({ success: false, error: "Appointment not found for this doctor." });
            return;
        }

        // Notify clients
        emitQueueUpdate(doctorId, {
            action: "consultation_completed",
            appointment_id: appointmentId,
            status: "completed",
            token_number: updateRes.rows[0].token_number
        });

        res.status(200).json({
            success: true,
            message: "Consultation completed successfully.",
            appointment: updateRes.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get past completed follow-up appointments for this doctor
 */
export const getDoctorFollowups = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, error: "Unauthorized access." });
            return;
        }

        const doctorId = await getDoctorIdFromUser(userId);
        if (!doctorId) {
            res.status(404).json({ success: false, error: "Doctor profile not found." });
            return;
        }

        const followupsRes = await pool.query(
            `SELECT 
                a.id, 
                a.appointment_date, 
                a.token_number, 
                a.symptoms, 
                a.prescription,
                u.name AS patient_name, 
                u.phone_number AS patient_phone
            FROM appointments a
            JOIN users u ON a.patient_id = u.id
            WHERE a.doctor_id = $1 AND a.status = 'completed'
            ORDER BY a.appointment_date DESC`,
            [doctorId]
        );

        res.status(200).json({
            success: true,
            count: followupsRes.rows.length,
            followups: followupsRes.rows
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update doctor profile settings
 */
export const updateDoctorProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { is_available, consultation_fee, specialization } = req.body;

        if (!userId) {
            res.status(401).json({ success: false, error: "Unauthorized access." });
            return;
        }

        const doctorId = await getDoctorIdFromUser(userId);
        if (!doctorId) {
            res.status(404).json({ success: false, error: "Doctor profile not found." });
            return;
        }

        const updateRes = await pool.query(
            `UPDATE doctors 
             SET is_available = COALESCE($1, is_available), 
                 consultation_fee = COALESCE($2, consultation_fee), 
                 specialization = COALESCE($3, specialization)
             WHERE id = $4
             RETURNING id, specialization, consultation_fee, is_available`,
            [is_available !== undefined ? is_available : null, consultation_fee || null, specialization || null, doctorId]
        );

        res.status(200).json({
            success: true,
            message: "Doctor profile updated successfully.",
            profile: updateRes.rows[0]
        });
    } catch (error) {
        next(error);
    }
};
