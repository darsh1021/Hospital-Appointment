import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set. Add it to Backend/.env before starting the server.");
}

const maskedDatabaseUrl = (() => {
    try {
        const parsedUrl = new URL(databaseUrl);
        if (parsedUrl.password) {
            parsedUrl.password = "****";
        }
        return parsedUrl.toString();
    } catch {
        return "Invalid DATABASE_URL format";
    }
})();

export const pool = new Pool({
    connectionString: databaseUrl,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

pool.on("error", (error) => {
    console.error("Unexpected PostgreSQL pool error:", error.message);
});

export const verifyDatabaseConnection = async () => {
    try {
        await pool.query("SELECT 1");
    } catch (error) {
        const dbError = error as Error & { code?: string };

        if (dbError.code === "28P01") {
            throw new Error(
                `PostgreSQL authentication failed for DATABASE_URL ${maskedDatabaseUrl}. If you are using Docker, the container may still have an older password in its volume.`
            );
        }

        throw new Error(
            `Unable to connect to PostgreSQL using DATABASE_URL ${maskedDatabaseUrl}: ${dbError.message}`
        );
    }
};
