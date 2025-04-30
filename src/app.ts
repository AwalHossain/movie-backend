import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";

import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./routes";
import { sendResponse } from "./shared/sendResponse";
import { getDbStatusText } from "./utils/common";

dotenv.config();

const app: Express = express();


app.use(cors({
  origin: process.env.CLIENT_URL!,
  credentials: true,
}));
console.log(process.env.CLIENT_URL, "client url");

if (!process.env.CLIENT_URL) {
  throw new Error("CLIENT_URL is not defined");
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


// health check
app.get("/health", (_req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState;

  const healthCheck = {
    success: true,
    message: "Server is healthy",
    data: {
      uptime: process.uptime(),
      timestamp: new Date(),
      dbStatus: dbStatus, // 0: disconnected, 1: connected, etc.
      dbStatusText: getDbStatusText(dbStatus),
    },
  };

  sendResponse<typeof healthCheck>(res, {
    success: true,
    message: "Server is healthy",
    data: healthCheck,
    statusCode: 200,
  });
});




app.use(`/api/v1`, router);
app.use(globalErrorHandler);

//handle not found
app.use((req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
});

export default app;