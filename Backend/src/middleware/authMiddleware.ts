import { Response, NextFunction, Request } from "express";
import { verifyToken } from "../utils/jwt.js";
import { prisma } from "../config/db.js";

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

export const protect = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token: string | undefined;

        if (req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.headers.cookie) {
            const cookies = parseCookies(req.headers.cookie);
            token = cookies["token"];
        }

        if (!token) {
            const error: any = new Error("You are not logged in. Please log in to gain access.");
            error.statusCode = 401;
            return next(error);
        }

        let decoded: any;
        try {
            decoded = verifyToken(token);
        } catch {
            const error: any = new Error("Invalid or expired authentication token. Please log in again.");
            error.statusCode = 401;
            return next(error);
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            const error: any = new Error("The user belonging to this token no longer exists.");
            error.statusCode = 401;
            return next(error);
        }

        req.user = {
            id:           user.id,
            name:         user.name,
            email:        user.email,
            phone_number: user.phoneNumber,
            role:         user.role,
            created_at:   user.createdAt,
        };
        next();
    } catch (error) {
        next(error);
    }
};

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
