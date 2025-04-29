import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../../config";
import { AppError } from "../../../error/appError";
import catchAsync from "../../../shared/catchAsyncError";
import { sendResponse } from "../../../shared/sendResponse";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../../../utils/common";
import { UserService } from "./user.service";

const registrationUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    console.log("data from api-server controller", req.body);
    
    const newUser = await UserService.register(req.body);

   
    const jwtPayload = {
      _id: newUser._id, 
      role: newUser.role,
      name: newUser.name,
    };

    const accessToken = createAccessToken(jwtPayload);
    const refreshToken = createRefreshToken(jwtPayload);

    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.env === 'production', 
      // sameSite: 'strict', 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });


    const userResponseData = newUser.toObject ? newUser.toObject() : { ...newUser };
    delete userResponseData.password; 

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully!",
      data: {
        user: userResponseData,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
  }
);

const loginUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    console.log("data from api-server controller", req.body);
    const userObject = await UserService.login(req.body); 

    const jwtPayload = {
      _id: userObject._id, 
      role: userObject.role, 
      name: userObject.name,
    };


    const accessToken = createAccessToken(jwtPayload);
    const refreshToken = createRefreshToken(jwtPayload);


    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.env === 'production', 
      // sameSite: 'lax', 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      // path: '/' 
    });

    sendResponse(res, {
      statusCode: 200, 
      success: true,
      message: "User logged in successfully!",
      data: {
        user: userObject, 
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
  }
);

const refreshToken = catchAsync(
  async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken;
    console.log("token refresh controller", token);
    if (!token) {
      throw new AppError("Refresh token not found", httpStatus.UNAUTHORIZED);
    }

    try {
      const decoded = verifyRefreshToken(token) as { _id: string; role: string }; 

      const user = await UserService.getUserById(decoded._id);
      if (!user) {
        throw new AppError("User not found", httpStatus.UNAUTHORIZED);
      }

      const jwtPayload = {
        id: decoded._id,
        role: decoded.role,
      };
      const newAccessToken = createAccessToken(jwtPayload);

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Access token refreshed successfully!",
        data: {
          accessToken: newAccessToken,
        },
      });
    } catch (error) {
      console.error("Refresh token verification failed:", error);
      res.clearCookie('refreshToken', { 
          httpOnly: true, 
          secure: config.env === 'production',
          sameSite: 'strict' 
      });
      throw new AppError("Invalid or expired refresh token", httpStatus.FORBIDDEN); // Use 403 Forbidden
    }
  }
);

const logoutUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('refreshToken', { 
        httpOnly: true, 
        secure: config.env === 'production',
        sameSite: 'strict' 
    });

    if (req.logout) { 
      req.logout(function (err: any) {
        if (err) {
          return next(err);
        }
        res.clearCookie("connect.sid", { path: "/" }); 

        sendResponse(res, {
          statusCode: 200, 
          success: true,
          message: "User logged out successfully!",
          data: {},
        });
      });
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User logged out successfully!",
        data: {},
      });
    }
  }
);

const getUserById = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const result = await UserService.getUserById(req.params.id);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User get successfully !",
      data: result,
    });
  }
);

const updateUserById = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const result = await UserService.updateUserById(req.params.id, req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User update successfully !",
      data: result,
    });
  }
);

export const UserController = {
  registrationUser,
  loginUser,
  refreshToken,
  logoutUser,
  getUserById,
  updateUserById,
};
