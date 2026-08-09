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

// Public Router (mounted at /api)
export const publicRouter = Router();
publicRouter.get("/doctors", getDoctors);
publicRouter.get("/hospitals", getHospitals);

// Doctor Dashboard Router (mounted at /api/doctor)
export const router = Router();

// Protect all dashboard routes
router.use(protect);
router.use(restrictTo("doctor"));

router.get("/queue", getDoctorQueue);
router.get("/current-patient", getCurrentPatient);
router.put("/appointments/:id/status", updateAppointmentStatus);
router.put("/appointments/:id/consult", completeConsultation);
router.get("/follow-ups", getDoctorFollowups);
router.put("/profile", updateDoctorProfile);
