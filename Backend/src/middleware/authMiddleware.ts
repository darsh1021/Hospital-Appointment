import { Response, NextFunction, Request } from "express";
import { verifyToken } from "../utils/jwt.js";
import { prisma } from "../config/db.js";

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        role: string;
        hospitalId: string | null;
        createdAt: Date;
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
            token = cookies["token"] as string;
        }

        if (!token) {
            const error: any = new Error("You are not logged in. Please log in to gain access.");
            error.statusCode = 401;
            return next(error);
        }

        let decoded: any;

        try {
            decoded = verifyToken(token);
            console.log("Decoded:", decoded)
        } catch {
            const error: any = new Error("Invalid or expired authentication token. Please log in again.");
            error.statusCode = 401;
            return next(error);
        }

        // Patient tokens carry role: "patient"
        if (decoded.role === "patient") {
            const patient = await prisma.patient.findUnique({
                where: { id: decoded.id },
                select: {
                    id:         true,
                    name:       true,
                    phone:      true,
                    hospitalId: true,
                    createdAt:  true,
                    updatedAt:  true,
                },
            });

            if (!patient) {
                const error: any = new Error("Token is Invalid or Expired. Please Login.");
                error.statusCode = 401;
                return next(error);
            }

            req.user = {
                id:         patient.id,
                name:       patient.name,
                email:      null,
                phone:      patient.phone,
                role:       "patient",
                hospitalId: patient.hospitalId,
                createdAt:  patient.createdAt,
            };
        } else {
            // Staff tokens (ADMIN, DOCTOR, RECEPTIONIST)
            const staff = await prisma.staff.findUnique({
                where: { id: decoded.id },
                select: {
                    id:         true,
                    name:       true,
                    email:      true,
                    phone:      true,
                    role:       true,
                    hospitalId: true,
                    createdAt:  true,
                },
            });

            if (!staff) {
                const error: any = new Error("The user belonging to this token no longer exists.");
                error.statusCode = 401;
                return next(error);
            }

            // Map StaffRole enum values to lowercase role strings used in restrictTo()
            const roleMap: Record<string, string> = {
                ADMIN:        "admin",
                DOCTOR:       "doctor",
                RECEPTIONIST: "reception",
            };

            req.user = {
                id:         staff.id,
                name:       staff.name,
                email:      staff.email,
                phone:      staff.phone,
                role:       roleMap[staff.role] ?? staff.role.toLowerCase(),
                hospitalId: staff.hospitalId,
                createdAt:  staff.createdAt,
            };
        }

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
