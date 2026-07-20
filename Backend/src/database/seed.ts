import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";

export const seedData = async () => {
    try {
        console.log("Checking if seeding is required...");
        
        // 1. Check if users already exist
        const userCountRes = await pool.query("SELECT COUNT(*) FROM users");
        const count = parseInt(userCountRes.rows[0].count, 10);

        if (count > 0) {
            console.log("Database already contains user records. Skipping seeding.");
            return;
        }

        console.log("Database is empty. Starting seeding process...");

        // 2. Hash passwords for the default roles
        const adminPassword = await bcrypt.hash("AdminPassword123", 10);
        const doctorPassword = await bcrypt.hash("DoctorPassword123", 10);
        const receptionistPassword = await bcrypt.hash("StaffPassword123", 10);

        // 3. Insert Admin User
        await pool.query(
            `INSERT INTO users (name, email, password, role) 
             VALUES ($1, $2, $3, $4)`,
            ["System Administrator", "admin@hospital.com", adminPassword, "admin"]
        );
        console.log("Seeded Admin user: admin@hospital.com");

        // 4. Insert Receptionist (Clinic Staff) User
        await pool.query(
            `INSERT INTO users (name, email, password, role) 
             VALUES ($1, $2, $3, $4)`,
            ["Reception Desk Staff", "staff@hospital.com", receptionistPassword, "reception"]
        );
        console.log("Seeded Receptionist user: staff@hospital.com");

        // 5. Insert Doctor User
        const doctorUserRes = await pool.query(
            `INSERT INTO users (name, email, password, role) 
             VALUES ($1, $2, $3, $4) RETURNING id`,
            ["Dr. Sarah Connor", "doctor@hospital.com", doctorPassword, "doctor"]
        );
        const doctorUserId = doctorUserRes.rows[0].id;
        console.log("Seeded Doctor user: doctor@hospital.com");

        // 6. Insert Sample Hospital
        const hospitalRes = await pool.query(
            `INSERT INTO hospitals (name, address, phone) 
             VALUES ($1, $2, $3) RETURNING id`,
            ["City General Hospital", "123 Health Science Parkway, Metropolis", "555-0100"]
        );
        const hospitalId = hospitalRes.rows[0].id;
        console.log("Seeded Hospital: City General Hospital");

        // 7. Insert Doctor Specialization Profile
        await pool.query(
            `INSERT INTO doctors (user_id, hospital_id, specialization, consultation_fee, is_available) 
             VALUES ($1, $2, $3, $4, $5)`,
            [doctorUserId, hospitalId, "General Medicine", 50.00, true]
        );
        console.log("Seeded Doctor Profile for Dr. Sarah Connor linked to City General Hospital");

        console.log("Seeding process completed successfully.");
    } catch (error) {
        console.error("Error occurred during database seeding:", error);
        throw error;
    }
};
