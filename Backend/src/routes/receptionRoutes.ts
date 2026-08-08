import { Router } from "express";
import { 
    registerPatient, 
    walkIn, 
    getLiveQueue, 
    updateAppointmentStatusByReception, 
    createPayment 
} from "../controllers/receptionController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

export const router = Router();

// Protect all routes under this router
router.use(protect);

// Restrict all routes under this router to receptionists only
router.use(restrictTo("reception","admin"));

router.post("/register-patient", registerPatient);
router.post("/walk-in", walkIn);
router.get("/live-queue", getLiveQueue);
router.put("/appointments/:id/status", updateAppointmentStatusByReception);
router.post("/payments", createPayment);
