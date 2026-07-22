import { Response, NextFunction } from "express";
import { pool } from "../config/db.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";

/**
 * Get all appointments for the logged-in patient
 */
export const getPatientAppointments = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const patientId = req.user?.id;

        if (!patientId) {
            res.status(401).json({ success: false, error: "Unauthorized access." });
            return;
        }

        const appointmentsRes = await pool.query(
            `SELECT 
                a.id, 
                a.appointment_date, 
                a.token_number, 
                a.status, 
                a.symptoms, 
                a.prescription,
                a.created_at,
                u_doc.name AS doctor_name,
                d.specialization AS doctor_specialization,
                h.name AS hospital_name,
                h.address AS hospital_address
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.id
            JOIN users u_doc ON d.user_id = u_doc.id
            JOIN hospitals h ON a.hospital_id = h.id
            WHERE a.patient_id = $1
            ORDER BY a.appointment_date DESC, a.token_number ASC`,
            [patientId]
        );

        res.status(200).json({
            success: true,
            count: appointmentsRes.rows.length,
            appointments: appointmentsRes.rows
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get completed appointments with prescriptions for the logged-in patient
 */
export const getPatientPrescriptions = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const patientId = req.user?.id;

        if (!patientId) {
            res.status(401).json({ success: false, error: "Unauthorized access." });
            return;
        }

        const prescriptionsRes = await pool.query(
            `SELECT 
                a.id, 
                a.appointment_date, 
                a.prescription,
                a.symptoms,
                u_doc.name AS doctor_name,
                d.specialization AS doctor_specialization
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.id
            JOIN users u_doc ON d.user_id = u_doc.id
            WHERE a.patient_id = $1 
              AND a.status = 'completed' 
              AND a.prescription IS NOT NULL
            ORDER BY a.appointment_date DESC`,
            [patientId]
        );

        res.status(200).json({
            success: true,
            count: prescriptionsRes.rows.length,
            prescriptions: prescriptionsRes.rows
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update the logged-in patient's profile details
 */
export const updatePatientProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const patientId = req.user?.id;
        const { name, email, phone_number } = req.body;

        if (!patientId) {
            res.status(401).json({ success: false, error: "Unauthorized access." });
            return;
        }

        // 1. If email is provided, check if it's already in use by another user
        if (email) {
            const emailCheck = await pool.query(
                "SELECT id FROM users WHERE email = $1 AND id != $2",
                [email, patientId]
            );
            if (emailCheck.rows.length > 0) {
                res.status(400).json({
                    success: false,
                    error: "Email is already registered to another account."
                });
                return;
            }
        }

        // 2. If phone_number is provided, check if it's already in use
        if (phone_number) {
            const phoneCheck = await pool.query(
                "SELECT id FROM users WHERE phone_number = $1 AND id != $2",
                [phone_number, patientId]
            );
            if (phoneCheck.rows.length > 0) {
                res.status(400).json({
                    success: false,
                    error: "Phone number is already registered to another account."
                });
                return;
            }
        }

        // 3. Update the fields in database using COALESCE to support partial updates
        const updateRes = await pool.query(
            `UPDATE users 
             SET name = COALESCE($1, name), 
                 email = COALESCE($2, email), 
                 phone_number = COALESCE($3, phone_number)
             WHERE id = $4
             RETURNING id, name, email, phone_number, role, created_at`,
            [name || null, email || null, phone_number || null, patientId]
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: updateRes.rows[0]
        });
    } catch (error) {
        next(error);
    }
};
