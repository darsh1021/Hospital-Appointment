import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDb } from "./database/initDb.js";
import { router as authRouter } from "./routes/authRoutes.js";
import { router as doctorRouter, publicRouter as doctorPublicRouter } from "./routes/doctorRoutes.js";
import { router as appointmentRouter } from "./routes/appointmentRoutes.js";
import { router as patientRouter } from "./routes/patientRoutes.js";
import { router as receptionRouter } from "./routes/receptionRoutes.js";
import { router as adminRouter } from "./routes/adminRoutes.js";
import { initSocket } from "./socket/socketManager.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

initDb()
    .then(() => {
        app.get("/", (_req, res) => {
            res.json({ message: "Clinic Appointment and Queue API is running successfully." });
        });

        app.use("/api/auth", authRouter);
        app.use("/api/appointment", appointmentRouter);
        app.use("/api/patient", patientRouter);
        app.use("/api/reception", receptionRouter);
        app.use("/api/admin", adminRouter);
        app.use("/api/doctor", doctorRouter);
        app.use("/api", doctorPublicRouter);
        app.use(errorHandler);

        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        initSocket(server);
    })
    .catch((error) => {
        console.error("Application failed to start due to database error:", error);
        process.exit(1);
    });
