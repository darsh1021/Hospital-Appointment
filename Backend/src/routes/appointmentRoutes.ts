import { Router } from "express";
import { bookToken, getDoctorsByCategory } from "../controllers/appointmentController.js";

export const router = Router();

// Public routes — no authentication required
router.get("/doctors", getDoctorsByCategory);   // GET  /appointments/doctors?category=Dermatology
router.post("/book-token", bookToken);           // POST /appointments/book-token
