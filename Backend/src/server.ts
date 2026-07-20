import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDb } from "./database/initDb.js";
import { router as authRouter } from "./routes/authRoutes.js";
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

    // 3. Global Error Handling Middleware (must be registered last)
    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Application failed to start due to database error:", error);
    process.exit(1);
});
