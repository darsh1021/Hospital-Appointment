import { createTable } from "./schema.js";
import { seedData } from "./seed.js";

export const initDb = async () => {
    try {
        console.log("Starting database initialization...");
        
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