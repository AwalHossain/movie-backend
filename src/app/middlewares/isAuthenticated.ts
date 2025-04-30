import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from 'jsonwebtoken';
import { AppError } from "../../error/appError";
import { verifyAccessToken, verifyRefreshToken } from "../../utils/common";

interface AuthenticatedUser extends JwtPayload {
    id: string;
    role: string;
}

const isAuthenticated = (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const refreshToken = req.cookies?.refreshToken;

    // Try access token first (preferred method)
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = verifyAccessToken(token) as AuthenticatedUser;
            req.user = decoded;
            return next();
        } catch (error) {
            console.log("Access token verification failed, trying refresh token...");
        }
    }

    // If access token failed or wasn't provided, try refresh token
    if (refreshToken) {
        try {
            const decoded = verifyRefreshToken(refreshToken) as AuthenticatedUser;
            req.user = decoded;
            return next();
        } catch (error) {
            console.error("Refresh token verification failed:", error);
            return next(new AppError("Invalid or expired tokens", httpStatus.UNAUTHORIZED));
        }
    }

    return next(new AppError("Authentication required", httpStatus.UNAUTHORIZED));
};

export default isAuthenticated;