import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";
import { generateToken } from "../utils/jwt.js";
import { createAndSendOtp, verifyOtpValue } from "../utils/otp.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";

// Strong password regex check
const isStrongPassword = (password: string): boolean => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return strongPasswordRegex.test(password);
};

// Set token in Cookie and return response
const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
    const token = generateToken({ id: user.id, role: user.role });

    const cookieOptions = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };

    res.cookie("token", token, cookieOptions);

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            role: user.role,
            created_at: user.created_at
        }
    });
};

/**
 * Register user (Email/Password or Phone OTP setup)
 */
export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, phone_number, password, role } = req.body;

        // Basic validations
        if (!name || !role) {
            res.status(400).json({ success: false, error: "Please provide your name and role." });
            return;
        }

        const normalizedRole = role.toLowerCase();
        if (!["admin", "doctor", "reception", "patient"].includes(normalizedRole)) {
            res.status(400).json({ success: false, error: "Invalid role specified." });
            return;
        }

        // DUAL FLOW: If phone_number is supplied (OTP Flow)
        if (phone_number) {
            // Check if phone number is already registered
            const phoneCheck = await pool.query("SELECT * FROM users WHERE phone_number = $1", [phone_number]);
            if (phoneCheck.rows.length > 0) {
                res.status(400).json({ success: false, error: "Phone number already registered. Please log in." });
                return;
            }

            // Generate and send OTP (logged to console)
            await createAndSendOtp(phone_number);

            res.status(200).json({
                success: true,
                message: "OTP sent successfully to your phone number.",
                phone_number,
                name,
                role: normalizedRole
            });
            return;
        }

        // DUAL FLOW: If email is supplied (Password Flow)
        if (email) {
            if (!password) {
                res.status(400).json({ success: false, error: "Please provide a password for email registration." });
                return;
            }

            // Validate strong password
            if (!isStrongPassword(password)) {
                res.status(400).json({
                    success: false,
                    error: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
                });
                return;
            }

            // Check if email already registered
            const emailCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
            if (emailCheck.rows.length > 0) {
                res.status(400).json({ success: false, error: "Email already registered. Please log in." });
                return;
            }

            // Hash password and save user
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUserRes = await pool.query(
                `INSERT INTO users (name, email, password, role) 
                 VALUES ($1, $2, $3, $4) 
                 RETURNING id, name, email, phone_number, role, created_at`,
                [name, email, hashedPassword, normalizedRole]
            );

            sendTokenResponse(newUserRes.rows[0], 201, res);
            return;
        }

        res.status(400).json({ success: false, error: "Please provide either an email or a phone number to register." });
    } catch (error) {
        next(error);
    }
};

/**
 * Login user (Email/Password or Phone OTP request)
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password, phone_number } = req.body;

        // DUAL FLOW: If phone_number is supplied
        if (phone_number) {
            // Check if phone number exists
            const userRes = await pool.query("SELECT * FROM users WHERE phone_number = $1", [phone_number]);
            
            const isNewUser = userRes.rows.length === 0;

            // Generate and send OTP (same procedure for both existing and auto-registering new patients)
            await createAndSendOtp(phone_number);

            res.status(200).json({
                success: true,
                message: isNewUser 
                    ? "OTP sent successfully for auto-registration." 
                    : "OTP sent successfully to your registered phone number.",
                phone_number,
                isNewUser
            });
            return;
        }

        // DUAL FLOW: If email is supplied
        if (email) {
            if (!password) {
                res.status(400).json({ success: false, error: "Please provide your password." });
                return;
            }

            // Fetch user
            const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
            if (userRes.rows.length === 0) {
                res.status(401).json({ success: false, error: "Invalid email or password." });
                return;
            }

            const user = userRes.rows[0];

            // Verify password
            if (!user.password) {
                res.status(400).json({ success: false, error: "This account was registered using phone authentication. Please log in using your phone number." });
                return;
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({ success: false, error: "Invalid email or password." });
                return;
            }

            sendTokenResponse(user, 200, res);
            return;
        }

        res.status(400).json({ success: false, error: "Please provide either an email or a phone number to sign in." });
    } catch (error) {
        next(error);
    }
};

/**
 * Verify OTP (completes login or signup)
 */
export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { phone_number, otp, name } = req.body;

        if (!phone_number || !otp) {
            res.status(400).json({ success: false, error: "Please provide your phone number and OTP code." });
            return;
        }

        // Verify OTP
        const isValid = await verifyOtpValue(phone_number, otp);
        if (!isValid) {
            res.status(400).json({ success: false, error: "Invalid or expired OTP." });
            return;
        }

        // Check if user already exists
        let userRes = await pool.query("SELECT * FROM users WHERE phone_number = $1", [phone_number]);

        // If user doesn't exist, this is an auto-registration
        if (userRes.rows.length === 0) {
            // Auto-signup: default name to provided name or dynamic generic name, role is always patient
            const defaultName = name || `Patient-${phone_number.slice(-4)}`;
            const newUserRes = await pool.query(
                `INSERT INTO users (name, phone_number, role) 
                 VALUES ($1, $2, 'patient') 
                 RETURNING id, name, email, phone_number, role, created_at`,
                [defaultName, phone_number]
            );
            userRes = newUserRes;
        }

        sendTokenResponse(userRes.rows[0], 200, res);
    } catch (error) {
        next(error);
    }
};

/**
 * Logout user
 */
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.cookie("token", "none", {
            expires: new Date(Date.now() + 10 * 1000), // expires in 10 seconds
            httpOnly: true
        });
        res.status(200).json({ success: true, message: "Logged out successfully." });
    } catch (error) {
        next(error);
    }
};

/**
 * Get profile of currently logged in user
 */
export const getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, error: "Not authorized." });
            return;
        }

        res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        next(error);
    }
};