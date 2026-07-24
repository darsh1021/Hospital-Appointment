import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDb } from "./database/initDb.js";
import { router as authRouter } from "./routes/authRoutes.js";
import { router as doctorRouter } from "./routes/doctorRoutes.js";
import { router as appointmentRouter } from "./routes/appointmentRoutes.js";
import { router as patientRouter } from "./routes/patientRoutes.js";
import { router as receptionRouter } from "./routes/receptionRoutes.js";
import { router as adminRouter } from "./routes/adminRoutes.js";
import { initSocket } from "./socket/socketManager.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and request body JSON parsing
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Initialize Database (schema creation & seeding)
initDb().then(() => {
    // 1. Root welcome endpoint
    app.get('/', (req, res) => {
        res.json({ message: "Clinic Appointment and Queue API is running successfully." });
    });

    // 2. Auth Routes
    app.use('/api/auth', authRouter);

    // 3. Public Doctor/Hospital Routes
    app.use('/api', doctorRouter);

    // 4. Appointment Routes
    app.use('/api/appointments', appointmentRouter);

    // 5. Patient Dashboard Routes
    app.use('/api/patient', patientRouter);

    // 6. Reception Dashboard Routes
    app.use('/api/reception', receptionRouter);

    // 7. Admin Dashboard Routes
    app.use('/api/admin', adminRouter);

    // 8. Global Error Handling Middleware (must be registered last)
    app.use(errorHandler);

    const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    // Initialize Socket.io
    initSocket(server);
}).catch((error) => {
    console.error("Application failed to start due to database error:", error);
    process.exit(1);
});
