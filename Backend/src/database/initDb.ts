import { createTable } from "./schema.js";
import { seedData } from "./seed.js";
import { verifyDatabaseConnection } from "../config/db.js";

export const initDb = async () => {
    try {
        console.log("Starting database initialization...");

        // Fail fast with a clearer message before schema setup starts.
        await verifyDatabaseConnection();
        
        // 1. Create tables if they do not exist
        await createTable();
        
        // 2. Seed initial testing data
        await seedData();
        
        console.log("Database initialized and ready.");
    } catch (error) {
        console.error("Database initialization failed critically:", error);
        throw error; // Let the main server crash if database initialization fails
    }
};
