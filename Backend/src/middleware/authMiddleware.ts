import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { pool } from "../config/db.js";
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        name: string;
        email: string | null;
        phone_number: string | null;
        role: string;
        created_at: Date;
    };
}

// Simple dependency-free helper to parse cookies
const parseCookies = (cookieHeader: string | undefined): Record<string, string> => {
    const list: Record<string, string> = {};
    if (!cookieHeader) return list;
    cookieHeader.split(";").forEach((cookie) => {
        const parts = cookie.split("=");
        const name = parts.shift()?.trim();
        if (name) {
            list[name] = decodeURIComponent(parts.join("="));
        }
    });
    return list;
};

/**
 * Protect middleware: Ensures the request is authenticated.
 */
export const protect = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token: string | undefined;

        // 1. Check Authorization Header (Bearer <token>)
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        // 2. Check cookies
        else if (req.headers.cookie) {
            const cookies = parseCookies(req.headers.cookie);
            token = cookies["token"];
        }

        if (!token) {
            const error: any = new Error("You are not logged in. Please log in to gain access.");
            error.statusCode = 401;
            return next(error);
        }

        // 3. Verify Token
        let decoded: any;
        try {
            decoded = verifyToken(token);
        } catch (err) {
            const error: any = new Error("Invalid or expired authentication token. Please log in again.");
            error.statusCode = 401;
            return next(error);
        }

        // 4. Check if user still exists
        const userRes = await pool.query(
            "SELECT id, name, email, phone_number, role, created_at FROM users WHERE id = $1",
            [decoded.id]
        );

        if (userRes.rows.length === 0) {
            const error: any = new Error("The user belonging to this token no longer exists.");
            error.statusCode = 401;
            return next(error);
        }

        // 5. Attach user to request
        req.user = userRes.rows[0];
        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Role authorization middleware.
 */
export const restrictTo = (...roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            const error: any = new Error("You do not have permission to perform this action.");
            error.statusCode = 403;
            return next(error);
        }
        next();
    };
};
