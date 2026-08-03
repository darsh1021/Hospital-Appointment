import { prisma } from "../config/db.js";

export const generateOtpValue = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const createAndSendOtp = async (phoneNumber: string): Promise<string> => {
    const otp       = generateOtpValue();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Replace any existing OTP for this phone number
    await prisma.otp.deleteMany({ where: { phoneNumber } });
    await prisma.otp.create({ data: { phoneNumber, otp, expiresAt } });

    console.log(`\n==================================================`);
    console.log(`[DEVELOPMENT OTP SERVICE]`);
    console.log(`To phone: ${phoneNumber}`);
    console.log(`Your OTP is: ${otp}`);
    console.log(`Expires at: ${expiresAt.toLocaleString()}`);
    console.log(`==================================================\n`);

    return otp;
};

export const verifyOtpValue = async (phoneNumber: string, inputOtp: string): Promise<boolean> => {
    const record = await prisma.otp.findFirst({
        where: {
            phoneNumber,
            otp:       inputOtp,
            expiresAt: { gt: new Date() },
        },
    });

    if (record) {
        await prisma.otp.deleteMany({ where: { phoneNumber } });
        return true;
    }

    return false;
};
