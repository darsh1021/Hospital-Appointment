import { Request, Response, NextFunction } from "express";

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
    }
    catch (error) {
        next(error)
    }
}

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

    }
    catch (error) {
        next(error);
    }
}