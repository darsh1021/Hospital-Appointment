import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey123!";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

/**
 * Generate a JWT token for the user payload.
 * @param payload Object containing user identifiers (e.g., { id, role })
 * @returns JWT token string
 */
export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN as any,
    });
};

/**
 * Verify a JWT token.
 * @param token JWT token string
 * @returns Decoded payload or throws an error if invalid
 */
export const verifyToken = (token: string): any => {
    return jwt.verify(token, JWT_SECRET);
};
