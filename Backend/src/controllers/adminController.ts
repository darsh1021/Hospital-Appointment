import { Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";

/**
 * Lists all doctors, specializations, consultation fees, and availability.
 * GET /api/admin/doctors
 */
export const getDoctorsAdmin = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const doctorsRes = await pool.query(
            `SELECT 
                d.id AS doctor_id, 
                u.id AS user_id,
                u.name, 
                u.email,
                u.phone_number,
                d.specialization, 
                d.consultation_fee, 
                d.is_available, 
                h.id AS hospital_id,
                h.name AS hospital_name
             FROM doctors d
             JOIN users u ON d.user_id = u.id
             LEFT JOIN hospitals h ON d.hospital_id = h.id
             ORDER BY u.name ASC`
        );

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
 * Creates a new Doctor user account and references it in the doctors table.
 * POST /api/admin/doctors
 */
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
                error: "Please provide doctor name, email, phone number, password, and specialization."
            });
            return;
        }

        // Check if email or phone is already registered
        const userCheck = await pool.query(
            "SELECT id FROM users WHERE email = $1 OR phone_number = $2",
            [email, phone_number]
        );

        if (userCheck.rows.length > 0) {
            res.status(400).json({
                success: false,
                error: "Email or phone number is already registered to another account."
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Perform transaction to ensure user & doctor records are atomic
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // 1. Create User
            const userRes = await client.query(
                `INSERT INTO users (name, email, phone_number, password, role) 
                 VALUES ($1, $2, $3, $4, 'doctor') 
                 RETURNING id`,
                [name, email, phone_number, hashedPassword]
            );
            const userId = userRes.rows[0].id;

            // 2. Resolve hospital_id (default to first hospital if not specified)
            let targetHospitalId = hospital_id;
            if (!targetHospitalId) {
                const fallbackHospital = await client.query("SELECT id FROM hospitals LIMIT 1");
                if (fallbackHospital.rows.length > 0) {
                    targetHospitalId = fallbackHospital.rows[0].id;
                }
            }

            // 3. Create Doctor Specialization Profile
            const doctorRes = await client.query(
                `INSERT INTO doctors (user_id, hospital_id, specialization, consultation_fee, is_available) 
                 VALUES ($1, $2, $3, $4, true) 
                 RETURNING id`,
                [userId, targetHospitalId || null, specialization, Number(fee) || 0.00]
            );

            await client.query("COMMIT");

            res.status(201).json({
                success: true,
                message: "Doctor account and profile created successfully.",
                doctor: {
                    doctor_id: doctorRes.rows[0].id,
                    user_id: userId,
                    name,
                    email,
                    phone_number,
                    specialization,
                    consultation_fee: fee || 0.00,
                    hospital_id: targetHospitalId
                }
            });
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Modifies an existing doctor's settings.
 * PUT /api/admin/doctors/:id
 */
export const updateDoctorAdmin = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const doctorId = Number(req.params.id);
        const { name, email, phone_number, specialization, fee, is_available, hospital_id } = req.body;

        // Verify doctor exists
        const doctorCheck = await pool.query(
            "SELECT id, user_id FROM doctors WHERE id = $1",
            [doctorId]
        );
        if (doctorCheck.rows.length === 0) {
            res.status(404).json({ success: false, error: "Doctor profile not found." });
            return;
        }
        const userId = doctorCheck.rows[0].user_id;

        // Verify email unique if updated
        if (email) {
            const emailCheck = await pool.query(
                "SELECT id FROM users WHERE email = $1 AND id != $2",
                [email, userId]
            );
            if (emailCheck.rows.length > 0) {
                res.status(400).json({ success: false, error: "Email is already in use by another user." });
                return;
            }
        }

        // Verify phone number unique if updated
        if (phone_number) {
            const phoneCheck = await pool.query(
                "SELECT id FROM users WHERE phone_number = $1 AND id != $2",
                [phone_number, userId]
            );
            if (phoneCheck.rows.length > 0) {
                res.status(400).json({ success: false, error: "Phone number is already in use by another user." });
                return;
            }
        }

        // Perform atomic update inside transaction
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // 1. Update User
            await client.query(
                `UPDATE users 
                 SET name = COALESCE($1, name), 
                     email = COALESCE($2, email),
                     phone_number = COALESCE($3, phone_number)
                 WHERE id = $4`,
                [name || null, email || null, phone_number || null, userId]
            );

            // 2. Update Doctor
            await client.query(
                `UPDATE doctors 
                 SET specialization = COALESCE($1, specialization), 
                     consultation_fee = COALESCE($2, consultation_fee),
                     is_available = COALESCE($3, is_available),
                     hospital_id = COALESCE($4, hospital_id)
                 WHERE id = $5`,
                [
                    specialization || null, 
                    fee !== undefined ? Number(fee) : null, 
                    is_available !== undefined ? is_available : null, 
                    hospital_id !== undefined ? hospital_id : null, 
                    doctorId
                ]
            );

            await client.query("COMMIT");

            res.status(200).json({
                success: true,
                message: "Doctor account and specialization profile updated successfully."
            });
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Deactivates or removes a doctor's account.
 * DELETE /api/admin/doctors/:id
 */
export const deleteDoctorAdmin = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const doctorId = Number(req.params.id);

        // Find user_id associated with the doctor profile
        const docCheck = await pool.query(
            "SELECT user_id FROM doctors WHERE id = $1",
            [doctorId]
        );

        if (docCheck.rows.length === 0) {
            res.status(404).json({ success: false, error: "Doctor profile not found." });
            return;
        }

        const userId = docCheck.rows[0].user_id;

        // Deleting user will cascade delete doctor record
        await pool.query("DELETE FROM users WHERE id = $1", [userId]);

        res.status(200).json({
            success: true,
            message: "Doctor account and specialization profile deleted successfully."
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Lists and searches all patients.
 * GET /api/admin/patients
 */
export const getPatientsAdmin = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { search } = req.query;

        let queryText = `
            SELECT id, name, email, phone_number, created_at 
            FROM users 
            WHERE role = 'patient'
        `;
        const queryParams: any[] = [];

        if (search) {
            queryParams.push(`%${search}%`);
            queryText += ` AND (name ILIKE $1 OR email ILIKE $1 OR phone_number ILIKE $1)`;
        }

        queryText += " ORDER BY name ASC";

        const patientsRes = await pool.query(queryText, queryParams);

        res.status(200).json({
            success: true,
            count: patientsRes.rows.length,
            patients: patientsRes.rows
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Compiles aggregated clinic statistics.
 * GET /api/admin/reports
 */
export const getReportsAdmin = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { startDate, endDate } = req.query;

        // Build date filter clause
        let dateClause = "";
        const queryParams: any[] = [];

        if (startDate && endDate) {
            queryParams.push(startDate, endDate);
            dateClause = "AND a.appointment_date BETWEEN $1 AND $2";
        } else if (startDate) {
            queryParams.push(startDate);
            dateClause = "AND a.appointment_date >= $1";
        } else if (endDate) {
            queryParams.push(endDate);
            dateClause = "AND a.appointment_date <= $1";
        }

        // 1. Total Appointments
        const totalApptRes = await pool.query(
            `SELECT COUNT(*) FROM appointments a WHERE 1=1 ${dateClause}`,
            queryParams
        );
        const totalAppointments = parseInt(totalApptRes.rows[0].count, 10);

        // 2. Revenue Generated (Sum of payments recorded in date range)
        const revenueRes = await pool.query(
            `SELECT COALESCE(SUM(p.amount), 0) AS total_revenue
             FROM payments p
             JOIN appointments a ON p.appointment_id = a.id
             WHERE 1=1 ${dateClause}`,
            queryParams
        );
        const revenueGenerated = parseFloat(revenueRes.rows[0].total_revenue);

        // 3. Average Waiting Time (consultation_started_at - checked_in_at) in minutes
        const waitTimeRes = await pool.query(
            `SELECT AVG(EXTRACT(EPOCH FROM (a.consultation_started_at - a.checked_in_at)) / 60) AS avg_wait_time
             FROM appointments a
             WHERE a.checked_in_at IS NOT NULL 
               AND a.consultation_started_at IS NOT NULL
               ${dateClause}`,
            queryParams
        );
        const avgWaitingTimeMinutes = waitTimeRes.rows[0].avg_wait_time 
            ? parseFloat(parseFloat(waitTimeRes.rows[0].avg_wait_time).toFixed(1)) 
            : 0.0;

        // 4. Doctor Utilization Rates (Completed appointments / Total appointments)
        const utilizationRes = await pool.query(
            `SELECT 
                d.id AS doctor_id,
                u.name AS doctor_name,
                COUNT(a.id) AS total_appointments,
                SUM(CASE WHEN a.status = 'completed' THEN 1 ELSE 0 END) AS completed_appointments
             FROM doctors d
             JOIN users u ON d.user_id = u.id
             LEFT JOIN appointments a ON d.id = a.doctor_id ${dateClause}
             GROUP BY d.id, u.name
             ORDER BY u.name ASC`,
            queryParams
        );

        const doctorUtilization = utilizationRes.rows.map(row => {
            const total = parseInt(row.total_appointments, 10);
            const completed = parseInt(row.completed_appointments, 10);
            const rate = total > 0 ? (completed / total) * 100 : 0.0;
            return {
                doctor_id: row.doctor_id,
                doctor_name: row.doctor_name,
                total_appointments: total,
                completed_appointments: completed,
                utilization_rate_percentage: parseFloat(rate.toFixed(1))
            };
        });

        res.status(200).json({
            success: true,
            statistics: {
                total_appointments: totalAppointments,
                revenue_generated: revenueGenerated,
                average_waiting_time_minutes: avgWaitingTimeMinutes,
                doctor_utilization: doctorUtilization
            }
        });
    } catch (error) {
        next(error);
    }
};
