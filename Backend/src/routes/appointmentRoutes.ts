import { Router } from "express";
import { bookToken, verifyBookingOtp, getDoctorsByCategory, getCategories } from "../controllers/appointmentController.js";

export const router = Router();

// Public routes — no authentication required

// GET  /appointments/categories
router.get("/categories", getCategories);

// POST /appointments/book-token
// Step 1: Validate form + send OTP to patient's phone.
// Returns { otpSent: true, phone } — frontend should show OTP input next.
router.post("/book-token", bookToken);

// POST /appointments/verify-booking-otp
// Step 2: Verify OTP, create patient (if new), create appointment, issue JWT.
// Body: { phone, otp }
router.post("/verify-booking-otp", verifyBookingOtp);
