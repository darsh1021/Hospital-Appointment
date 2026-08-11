import { prisma } from "../config/db.js";

export const generateOtpValue = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const createAndSendOtp = async (phoneNumber: string): Promise<string> => {
    const otp = generateOtpValue();
    const expiresAt = new Date(Date.now() + 60 * 1000); // OTP will expire in 60 seconds

    // Look up the patient by phone number
    const patient = await prisma.patient.findUnique({ where: { phone: phoneNumber } });
    if (!patient) {
        throw new Error(`No patient found with phone number: ${phoneNumber}`);
    }

    // Replace any existing OTPs for this patient
    await prisma.oTP.deleteMany({ where: { patientId: patient.id } });
    await prisma.oTP.create({ data: { patientId: patient.id, otp, expiresAt } });

    console.log(`\n==================================================`);
    console.log(`[DEVELOPMENT OTP SERVICE]`);
    console.log(`To phone: ${phoneNumber}`);
    console.log(`Your OTP is: ${otp}`);
    console.log(`Expires at: ${expiresAt.toLocaleString()}`);
    console.log(`==================================================\n`);

    return otp;
};

export const verifyOtpValue = async (phoneNumber: string, inputOtp: string): Promise<boolean> => {
    // Look up the patient by phone number
    const patient = await prisma.patient.findUnique({ where: { phone: phoneNumber } });
    if (!patient) {
        return false;
    }

    const record = await prisma.oTP.findFirst({
        where: {
            patientId: patient.id,
            otp: inputOtp,
            expiresAt: { gt: new Date() },
        },
    });

    if (record) {
        await prisma.oTP.deleteMany({ where: { patientId: patient.id } });
        return true;
    }

    return false;
};
