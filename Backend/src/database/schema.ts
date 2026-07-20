import { pool } from "../config/db.js";

export const createTable = async () => {
    console.log("Checking and creating required tables: users, otps, hospitals, doctors, appointments...");

    // 1. Create Users Table (supports Admin, Doctor, Reception, and Patient)
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE,
            phone_number VARCHAR(50) UNIQUE,
            password VARCHAR(255),
            role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'doctor', 'reception', 'patient')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // 2. Create OTP Storage Table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS otps (
            id SERIAL PRIMARY KEY,
            phone_number VARCHAR(50) NOT NULL,
            otp VARCHAR(6) NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // 3. Create Hospitals Table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS hospitals (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            address TEXT,
            phone VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // 4. Create Doctors Table (maps a user id to specialization details & hospital)
    await pool.query(`
        CREATE TABLE IF NOT EXISTS doctors (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            hospital_id INTEGER REFERENCES hospitals(id) ON DELETE SET NULL,
            specialization VARCHAR(255) NOT NULL,
            consultation_fee NUMERIC(10, 2) DEFAULT 0.00,
            is_available BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // 5. Create Appointments Table (includes token number and consultation details)
    await pool.query(`
        CREATE TABLE IF NOT EXISTS appointments (
            id SERIAL PRIMARY KEY,
            patient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
            hospital_id INTEGER NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
            appointment_date DATE NOT NULL,
            token_number INTEGER NOT NULL,
            status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'waiting', 'in-consultation', 'completed', 'cancelled')),
            symptoms TEXT,
            prescription TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    console.log("All database tables checked/created successfully.");
};