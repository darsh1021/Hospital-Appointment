import { Request, Response, NextFunction } from "express";
import { pool } from "../config/db.js";
import { calculateEstimatedWaitTime } from "../utils/queueEstimator.js";

/**
 * Public endpoint to book an appointment token.
 * If the patient is new, automatically signs them up in the users database.
 */
export const bookToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, phone, doctor_id, hospital_id, appointment_date, symptoms } = req.body;

        // 1. Validate inputs
        if (!name || !phone || !doctor_id) {
            res.status(400).json({
                success: false,
                error: "Please provide patient name, phone, and doctor_id."
            });
            return;
        }

        // Auto-resolve hospital_id if not explicitly provided
        let resolvedHospitalId = hospital_id;
        if (!resolvedHospitalId) {
            const docRes = await pool.query("SELECT hospital_id FROM doctors WHERE id = $1", [Number(doctor_id)]);
            if (docRes.rows.length > 0 && docRes.rows[0].hospital_id) {
                resolvedHospitalId = docRes.rows[0].hospital_id;
            } else {
                // Fallback to first hospital if no hospital is associated with the doctor
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
        }

        // 2. Set target appointment date (default to today if not provided)
        const targetDate = appointment_date || new Date().toISOString().split("T")[0];

        // 3. Find or auto-create the patient user
        let patientId: number;
        const userCheck = await pool.query("SELECT id FROM users WHERE phone_number = $1", [phone]);

        if (userCheck.rows.length > 0) {
            patientId = userCheck.rows[0].id;
        } else {
            // Auto-signup the guest as a patient
            const newUser = await pool.query(
                `INSERT INTO users (name, phone_number, role) 
                 VALUES ($1, $2, 'patient') 
                 RETURNING id`,
                [name, phone]
            );
            patientId = newUser.rows[0].id;
        }

        // 4. Calculate estimated wait time (based on active queue size before adding this token)
        const estimatedWaitTime = await calculateEstimatedWaitTime(Number(doctor_id), targetDate);

        // 5. Calculate next token number for this doctor on this day
        const tokenRes = await pool.query(
            `SELECT COALESCE(MAX(token_number), 0) + 1 AS next_token 
             FROM appointments 
             WHERE doctor_id = $1 AND appointment_date = $2`,
            [Number(doctor_id), targetDate]
        );
        const tokenNumber = parseInt(tokenRes.rows[0].next_token, 10);

        // 6. Create the appointment record
        const newAppointmentRes = await pool.query(
            `INSERT INTO appointments (patient_id, doctor_id, hospital_id, appointment_date, token_number, status, symptoms) 
             VALUES ($1, $2, $3, $4, $5, 'scheduled', $6) 
             RETURNING id, patient_id, doctor_id, hospital_id, appointment_date, token_number, status, symptoms, created_at`,
            [patientId, Number(doctor_id), Number(resolvedHospitalId), targetDate, tokenNumber, symptoms || null]
        );

        res.status(201).json({
            success: true,
            message: "Appointment token successfully booked.",
            estimated_wait_time_minutes: estimatedWaitTime,
            appointment: newAppointmentRes.rows[0]
        });
    } catch (error) {
        next(error);
    }
};
