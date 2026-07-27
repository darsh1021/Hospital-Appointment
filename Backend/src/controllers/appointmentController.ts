import { Request, Response, NextFunction } from "express";
import { pool } from "../config/db.js";
import { calculateEstimatedWaitTime } from "../utils/queueEstimator.js";
import { generateToken } from "../utils/jwt.js";

/**
 * Public endpoint to book an appointment token.
 * Automatically signs up new patients, computes token_number starting from #1,
 * generates an HttpOnly JWT cookie session, and returns user/token data.
 */
export const bookToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, phone, phone_number, doctor_id, department, hospital_id, appointment_date, symptoms } = req.body;
        const patientPhone = phone || phone_number;

        // 1. Validate inputs
        if (!name || !patientPhone) {
            res.status(400).json({
                success: false,
                error: "Please provide patient name and phone number."
            });
            return;
        }

        // 2. Auto-resolve doctor_id if not explicitly provided
        let resolvedDoctorId: number | null = doctor_id ? Number(doctor_id) : null;
        let resolvedHospitalId: number | null = hospital_id ? Number(hospital_id) : null;

        if (!resolvedDoctorId) {
            if (department) {
                // Find doctor by department / specialization
                const docByDept = await pool.query(
                    "SELECT id, hospital_id FROM doctors WHERE specialization ILIKE $1 LIMIT 1",
                    [`%${department}%`]
                );
                if (docByDept.rows.length > 0) {
                    resolvedDoctorId = docByDept.rows[0].id;
                    resolvedHospitalId = resolvedHospitalId || docByDept.rows[0].hospital_id;
                }
            }

            if (!resolvedDoctorId) {
                // Fallback to first available doctor
                const fallbackDoc = await pool.query("SELECT id, hospital_id FROM doctors LIMIT 1");
                if (fallbackDoc.rows.length > 0) {
                    resolvedDoctorId = fallbackDoc.rows[0].id;
                    resolvedHospitalId = resolvedHospitalId || fallbackDoc.rows[0].hospital_id;
                }
            }
        }

        if (!resolvedDoctorId) {
            res.status(400).json({
                success: false,
                error: "No doctor available to assign this token. Please contact reception."
            });
            return;
        }

        // Auto-resolve hospital_id if still missing
        if (!resolvedHospitalId) {
            const docRes = await pool.query("SELECT hospital_id FROM doctors WHERE id = $1", [resolvedDoctorId]);
            if (docRes.rows.length > 0 && docRes.rows[0].hospital_id) {
                resolvedHospitalId = docRes.rows[0].hospital_id;
            } else {
                const fallbackHosp = await pool.query("SELECT id FROM hospitals LIMIT 1");
                if (fallbackHosp.rows.length > 0) {
                    resolvedHospitalId = fallbackHosp.rows[0].id;
                } else {
                    res.status(400).json({
                        success: false,
                        error: "Hospital ID could not be resolved."
                    });
                    return;
                }
            }
        }

        // 3. Set target appointment date (defaults to today)
        const targetDate = appointment_date || new Date().toISOString().split("T")[0];

        // 4. Find or auto-create the patient user
        let patientUser: any;
        const userCheck = await pool.query("SELECT id, name, email, phone_number, role, created_at FROM users WHERE phone_number = $1", [patientPhone]);

        if (userCheck.rows.length > 0) {
            patientUser = userCheck.rows[0];
            if (name && patientUser.name !== name) {
                const updateRes = await pool.query(
                    `UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, email, phone_number, role, created_at`,
                    [name, patientUser.id]
                );
                patientUser = updateRes.rows[0];
            }
        } else {
            // Auto-signup guest patient
            const newUserRes = await pool.query(
                `INSERT INTO users (name, phone_number, role) 
                 VALUES ($1, $2, 'patient') 
                 RETURNING id, name, email, phone_number, role, created_at`,
                [name, patientPhone]
            );
            patientUser = newUserRes.rows[0];
        }

        // 5. Calculate estimated wait time
        const estimatedWaitTime = await calculateEstimatedWaitTime(resolvedDoctorId, targetDate);

        // 6. Compute next token_number for this doctor on this date (starts from 1 and increments)
        const tokenRes = await pool.query(
            `SELECT COALESCE(MAX(token_number), 0) + 1 AS next_token 
             FROM appointments 
             WHERE doctor_id = $1 AND appointment_date = $2`,
            [resolvedDoctorId, targetDate]
        );
        const tokenNumber = parseInt(tokenRes.rows[0].next_token, 10);

        // 7. Insert appointment record
        const newAppointmentRes = await pool.query(
            `INSERT INTO appointments (patient_id, doctor_id, hospital_id, appointment_date, token_number, status, symptoms) 
             VALUES ($1, $2, $3, $4, $5, 'scheduled', $6) 
             RETURNING id, patient_id, doctor_id, hospital_id, appointment_date, token_number, status, symptoms, created_at`,
            [patientUser.id, resolvedDoctorId, resolvedHospitalId, targetDate, tokenNumber, symptoms || null]
        );

        // 8. Set HttpOnly JWT auth cookie for the patient
        const token = generateToken({ id: patientUser.id, role: patientUser.role });
        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        };
        res.cookie("token", token, cookieOptions);

        res.status(201).json({
            success: true,
            message: "Appointment token successfully booked.",
            token,
            user: patientUser,
            estimated_wait_time_minutes: estimatedWaitTime,
            appointment: newAppointmentRes.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

