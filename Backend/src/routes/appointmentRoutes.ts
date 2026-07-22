import { Router } from "express";
import { bookToken } from "../controllers/appointmentController.js";

export const router = Router();

router.post("/book-token", bookToken);
