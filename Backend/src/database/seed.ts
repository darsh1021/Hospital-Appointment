import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";

export const seedData = async () => {
    try {
        console.log("Checking if seeding is required...");

        const count = await prisma.user.count();

        if (count > 0) {
            console.log("Database already contains user records. Skipping seeding.");
            return;
        }

        console.log("Database is empty. Starting seeding process...");

        const adminPassword       = await bcrypt.hash("AdminPassword123", 10);
        const doctorPassword      = await bcrypt.hash("DoctorPassword123", 10);
        const receptionistPassword = await bcrypt.hash("StaffPassword123", 10);

        // Admin
        await prisma.user.create({
            data: {
                name:     "System Administrator",
                email:    "admin@hospital.com",
                password: adminPassword,
                role:     "admin",
            },
        });
        console.log("Seeded Admin user: admin@hospital.com");

        // Receptionist
        await prisma.user.create({
            data: {
                name:     "Reception Desk Staff",
                email:    "staff@hospital.com",
                password: receptionistPassword,
                role:     "reception",
            },
        });
        console.log("Seeded Receptionist user: staff@hospital.com");

        // Doctor user
        const doctorUser = await prisma.user.create({
            data: {
                name:     "Dr. Sarah Connor",
                email:    "doctor@hospital.com",
                password: doctorPassword,
                role:     "doctor",
            },
        });
        console.log("Seeded Doctor user: doctor@hospital.com");

        // Hospital
        const hospital = await prisma.hospital.create({
            data: {
                name:    "City General Hospital",
                address: "123 Health Science Parkway, Metropolis",
                phone:   "555-0100",
            },
        });
        console.log("Seeded Hospital: City General Hospital");

        // Doctor profile
        await prisma.doctor.create({
            data: {
                userId:         doctorUser.id,
                hospitalId:     hospital.id,
                specialization: "General Medicine",
                consultationFee: 50.00,
                isAvailable:    true,
            },
        });
        console.log("Seeded Doctor Profile for Dr. Sarah Connor linked to City General Hospital");

        console.log("Seeding process completed successfully.");
    } catch (error) {
        console.error("Error occurred during database seeding:", error);
        throw error;
    }
};
