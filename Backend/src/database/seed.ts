import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";

export const seedData = async () => {
    try {
        console.log("Checking if seeding is required...");

        const count = await prisma.staff.count();

        if (count > 0) {
            console.log("Database already contains staff records. Skipping seeding.");
            return;
        }

        console.log("Database is empty. Starting seeding process...");

        const adminPassword        = await bcrypt.hash("AdminPassword123", 10);
        const doctorPassword       = await bcrypt.hash("DoctorPassword123", 10);
        const receptionistPassword = await bcrypt.hash("StaffPassword123", 10);

        // Hospital
        const hospital = await prisma.hospital.create({
            data: {
                name:      "City General Hospital",
                email:     "info@citygeneral.com",
                city:      "Metropolis",
                state:     "Maharashtra",
                pinCode:   "400001",
                country:   "India",
                address:   "123 Health Science Parkway, Metropolis",
                isActive:  true,
            },
        });
        console.log("Seeded Hospital: City General Hospital");

        // Admin Staff
        await prisma.staff.create({
            data: {
                hospitalId:    hospital.id,
                name:          "System Administrator",
                email:         "admin@hospital.com",
                phone:         "9000000001",
                password:      adminPassword,
                role:          "ADMIN",
                gender:        "MALE",
                status:        "ACTIVE",
            },
        });
        console.log("Seeded Admin staff: admin@hospital.com");

        // Doctor Staff
        await prisma.staff.create({
            data: {
                hospitalId:     hospital.id,
                name:           "Dr. Sarah Connor",
                email:          "doctor@hospital.com",
                phone:          "9000000002",
                password:       doctorPassword,
                role:           "DOCTOR",
                gender:         "FEMALE",
                specialization: "General Medicine",
                experience:     5,
                status:         "ACTIVE",
            },
        });
        console.log("Seeded Doctor staff: doctor@hospital.com");

        // Receptionist Staff
        await prisma.staff.create({
            data: {
                hospitalId: hospital.id,
                name:       "Reception Desk Staff",
                email:      "staff@hospital.com",
                phone:      "9000000003",
                password:   receptionistPassword,
                role:       "RECEPTIONIST",
                gender:     "FEMALE",
                status:     "ACTIVE",
            },
        });
        console.log("Seeded Receptionist staff: staff@hospital.com");

        console.log("Seeding process completed successfully.");
    } catch (error) {
        console.error("Error occurred during database seeding:", error);
        throw error;
    }
};
