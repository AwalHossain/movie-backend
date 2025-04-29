import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from 'jsonwebtoken';
import { AppError } from "../../error/appError";
import { verifyAccessToken } from "../../utils/common";

interface AuthenticatedUser extends JwtPayload {
  id: string;
  role: string;
}

const isAuthenticated = (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const refreshToken = req.cookies?.refreshToken;
    let token: string | null = null;

    console.log("Authorization Header:", authHeader);
    console.log("Refresh Token Cookie:", refreshToken);
    console.log("Request Headers:", req.headers);

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (refreshToken) {
        token = refreshToken;
    }

    if (!token) {
        return next(new AppError("Authorization token missing", httpStatus.UNAUTHORIZED));
    }

    try {
        const decoded = verifyAccessToken(token) as AuthenticatedUser;

        req.user = decoded;
        next();

    } catch (error) {
        console.error("Token verification failed in middleware:", error);
        return next(new AppError("Invalid or expired token", httpStatus.UNAUTHORIZED));
    }
};

export default isAuthenticated;