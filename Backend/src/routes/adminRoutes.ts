import { Router } from "express";
import {
    getDoctorsAdmin,
    createDoctorAdmin,
    updateDoctorAdmin,
    deleteDoctorAdmin,
    getPatientsAdmin,
    getReportsAdmin,
    getPatientDetailsAdmin,
    deletePatientAdmin,
    createReceptionistAdmin,
    getReceptionistsAdmin
} from "../controllers/adminController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

export const router = Router();

// Protect all routes under this router
router.use(protect);

// Restrict all routes under this router to admin only
router.use(restrictTo("admin"));

router.get("/doctors", getDoctorsAdmin);
router.post("/doctors", createDoctorAdmin);
router.put("/doctors/:id", updateDoctorAdmin);
router.delete("/doctors/:id", deleteDoctorAdmin);
router.get("/receptionists", getReceptionistsAdmin);
router.post("/receptionists", createReceptionistAdmin);
router.get("/patients", getPatientsAdmin);
router.get("/reports", getReportsAdmin);
router.get("/patient/:id", getPatientDetailsAdmin);
router.delete("/patient/:id", deletePatientAdmin);