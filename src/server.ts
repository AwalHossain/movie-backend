// always suggest for typescript
import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import app from "./app";

import connectDB from "./config/db";
import config from "./config/index";
import { errorLogger, logger } from "./shared/logger";
import { initSocketServer } from "./socket";

const PORT = Number(config.port) || 8000;
export let server = http.createServer(app);
export let io: Server;

async function bootstrap() {
  try {
    await connectDB();
    logger.info("Database connected successfully");

    // Create HTTP server
    server = http.createServer(app);

    // Initialize Socket.IO
    io = new Server(server, {
      cors: {
        origin: ["http://localhost:3000", "http://127.0.0.1:5500"], // Match your frontend URL
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    // Initialize socket event handlers
    initSocketServer(io);

    // Start server
    server.listen(PORT, () => {
      logger.info(`Server listening on port ${PORT}`);
      console.log("listening on port", PORT);
      logger.info("Application setup completed successfully");
      logger.info("Application started", new Date().toTimeString());
    });
  } catch (error) {
    errorLogger.error("Failed to bootstrap application", error);
    process.exit(1);
  }
}

bootstrap();