import { pool } from "../config/db.js";

/**
 * Calculates the estimated wait time (in minutes) for a new token booking.
 * Formula: (Number of active/waiting tokens ahead of this token) * 15 minutes.
 * @param doctorId The ID of the doctor
 * @param appointmentDate The date of the appointment (YYYY-MM-DD)
 * @returns The estimated wait time in minutes
 */
export const calculateEstimatedWaitTime = async (
    doctorId: number,
    appointmentDate: string | Date
): Promise<number> => {
    // Count active tokens that are scheduled or waiting (excluding in-consultation, completed, cancelled)
    const result = await pool.query(
        `SELECT COUNT(*) FROM appointments 
         WHERE doctor_id = $1 
           AND appointment_date = $2 
           AND status IN ('scheduled', 'waiting')`,
        [doctorId, appointmentDate]
    );

    const countAhead = parseInt(result.rows[0].count, 10);
    
    // Each patient ahead takes an average of 15 minutes
    return countAhead * 15;
};
