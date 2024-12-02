import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
    status?: number;
    details?: any;
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    if (err instanceof Error && process.env.NODE_ENV === "development") {
        res.status(statusCode).json({
            success: false,
            message: message,
            error: err.message
        });
    } else {
        res.status(statusCode).json({
            success: false,
            message
        });
    }
}

export default errorHandler;