import { Router } from "express";
import { 
    getDoctors, 
    getHospitals,
    getDoctorQueue,
    getCurrentPatient,
    updateAppointmentStatus,
    completeConsultation,
    getDoctorFollowups,
    updateDoctorProfile
} from "../controllers/doctorController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

export const router = Router();

// Public routes
router.get("/doctors", getDoctors);
router.get("/hospitals", getHospitals);

// Protect all routes below this point
router.use(protect);

// Restrict all routes below this point to doctors only
router.use(restrictTo("doctor"));

// Doctor Dashboard routes
router.get("/doctor/queue", getDoctorQueue);
router.get("/doctor/current-patient", getCurrentPatient);
router.put("/doctor/appointments/:id/status", updateAppointmentStatus);
router.put("/doctor/appointments/:id/consult", completeConsultation);
router.get("/doctor/follow-ups", getDoctorFollowups);
router.put("/doctor/profile", updateDoctorProfile);
