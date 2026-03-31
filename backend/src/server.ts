import express from "express";
import compression from "compression";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import cors from "cors";
import "reflect-metadata";
import "express-async-errors";

import { ExpressApplication } from "./bootstraper.js";
import globalErrorHandler from "./middlewares/errorHandler.js";
import httpLogger from "./middlewares/logger.js";

import { fileURLToPath } from "url";
import path from "path";
import AuthController from "./controllers/auth.controller.js";
import { responseHandler } from "./middlewares/responseHandler.js";
import PropertyController from "./controllers/property.controller.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const app = new ExpressApplication({
  port: process.env.PORT || 3000,
  middlewares: [
    express.json({ limit: "20kb" }),
    compression(),
    cookieParser(),
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
    express.static(__dirname + "../public"),
    responseHandler,
    httpLogger,
  ],
  controllers: [AuthController, PropertyController],
  errorHandler: [globalErrorHandler],
});

const server = app.start();
const shutdown = async () => {
  server.close(async () => {
    console.log("Server closed");
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
