import { Router } from "express";
import { login, signup, verifyOtp, logout, getProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

export const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/patient-login", login);
router.post("/verify-otp", verifyOtp);
router.post("/logout", logout);
router.get("/profile", protect, getProfile);
router.get("/me", protect, getProfile);
