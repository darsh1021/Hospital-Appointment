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

// Doctor Dashboard routes (Protected & Restricted to role 'doctor')
router.get("/doctor/queue", protect, restrictTo("doctor"), getDoctorQueue);
router.get("/doctor/current-patient", protect, restrictTo("doctor"), getCurrentPatient);
router.put("/doctor/appointments/:id/status", protect, restrictTo("doctor"), updateAppointmentStatus);
router.put("/doctor/appointments/:id/consult", protect, restrictTo("doctor"), completeConsultation);
router.get("/doctor/follow-ups", protect, restrictTo("doctor"), getDoctorFollowups);
router.put("/doctor/profile", protect, restrictTo("doctor"), updateDoctorProfile);
