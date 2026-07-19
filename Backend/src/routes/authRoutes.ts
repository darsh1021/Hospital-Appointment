import { Router } from "express";
import { login, signup } from "../controllers/authController.js";

export const router = Router();

router.post("/login", login);
router.post("/signup", signup);