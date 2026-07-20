import { Request, Response, NextFunction } from "express";

export interface CustomError extends Error {
    statusCode?: number;
}

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error(`[Error] ${req.method} ${req.url} - Status ${statusCode}:`, err.stack || err);

    res.status(statusCode).json({
        success: false,
        error: message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};
