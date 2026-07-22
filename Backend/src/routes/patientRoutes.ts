import { Router } from "express";
import { 
    getPatientAppointments, 
    getPatientPrescriptions, 
    updatePatientProfile 
} from "../controllers/patientController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

export const router = Router();

// Protect all routes under this router
router.use(protect);

// Restrict all routes under this router to patients only
router.use(restrictTo("patient"));

router.get("/appointments", getPatientAppointments);
router.get("/prescriptions", getPatientPrescriptions);
router.put("/profile", updatePatientProfile);
