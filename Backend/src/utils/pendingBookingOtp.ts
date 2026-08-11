import { prisma } from "../config/db.js";
import { generateOtpValue } from "./otp.js";

// ─── Pending Booking OTP helpers ─────────────────────────────────────────────
// These work with the PendingBooking table, so no Patient row is needed yet.

/**
 * Saves (or replaces) a pending booking + its OTP for the given phone.
 * The OTP expires in 5 minutes.
 */
export const createPendingBookingOtp = async (
    phone: string,
    bookingData: object
): Promise<string> => {
    const otp = generateOtpValue();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.pendingBooking.upsert({
        where: { phone },
        update: { data: bookingData, otp, expiresAt, updatedAt: new Date() },
        create: { phone, data: bookingData, otp, expiresAt },
    });

    console.log(`\n==================================================`);
    console.log(`[DEVELOPMENT OTP SERVICE — PENDING BOOKING]`);
    console.log(`To phone: ${phone}`);
    console.log(`Your OTP is: ${otp}`);
    console.log(`Expires at: ${expiresAt.toLocaleString()}`);
    console.log(`==================================================\n`);

    return otp;
};

/**
 * Verifies the OTP for a pending booking.
 * Returns the stored booking data on success, or null on failure.
 */
export const verifyPendingBookingOtp = async (
    phone: string,
    inputOtp: string
): Promise<object | null> => {
    const record = await prisma.pendingBooking.findUnique({ where: { phone } });

    if (!record) return null;
    if (record.otp !== inputOtp) return null;
    if (record.expiresAt < new Date()) return null;

    // Valid — delete it so it cannot be reused
    await prisma.pendingBooking.delete({ where: { phone } });

    return record.data as object;
};
