import { prisma } from "../config/db.js";
import { seedData } from "./seed.js";

export const initDb = async () => {
    try {
        console.log("Verifying database connection...");

        // Verify Prisma can connect (schema is managed via migrations)
        await prisma.$connect();
        console.log("Database connection established.");

        // Seed initial data if needed
        await seedData();

        console.log("Database initialized and ready.");
    } catch (error) {
        console.error("Database initialization failed critically:", error);
        throw error;
    }
};
