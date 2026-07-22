import { pool } from "../config/db.js";

/**
 * Generates a random 6-digit numeric OTP.
 */
export const generateOtpValue = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Saves the OTP in the database (valid for 5 minutes) and logs it to console for development.
 * @param phoneNumber The patient's phone number
 * @returns The generated OTP value
 */
export const createAndSendOtp = async (phoneNumber: string): Promise<string> => {
    const otp = generateOtpValue();
    // Expiry: 5 minutes from now
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Delete any existing active OTPs for this phone number to avoid duplicate entries
    await pool.query(
        "DELETE FROM otps WHERE phone_number = $1",
        [phoneNumber]
    );

    // Insert new OTP record
    await pool.query(
        "INSERT INTO otps (phone_number, otp, expires_at) VALUES ($1, $2, $3)",
        [phoneNumber, otp, expiresAt]
    );

    console.log(`\n==================================================`);
    console.log(`[DEVELOPMENT OTP SERVICE]`);
    console.log(`To phone: ${phoneNumber}`);
    console.log(`Your OTP is: ${otp}`);
    console.log(`Expires at: ${expiresAt.toLocaleString()}`);
    console.log(`==================================================\n`);

    return otp;
};

/**
 * Verifies an OTP. If correct and not expired, returns true and deletes it.
 */
export const verifyOtpValue = async (phoneNumber: string, inputOtp: string): Promise<boolean> => {
    const result = await pool.query(
        "SELECT * FROM otps WHERE phone_number = $1 AND otp = $2 AND expires_at > NOW()",
        [phoneNumber, inputOtp]
    );

    if (result.rows.length > 0) {
        // OTP is valid. Clean it up from the database.
        await pool.query("DELETE FROM otps WHERE phone_number = $1", [phoneNumber]);
        return true;
    }

    return false;
};
