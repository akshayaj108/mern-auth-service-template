import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { CONFIG } from "../config";
import logger from "../config/logger";
import crypto from "node:crypto";

export const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  const errorId = crypto.randomUUID();
  const statusCode = err.status;
  const isProduction = CONFIG.NODE_ENV === "production";
  const message = isProduction ? "Internal server error" : err.message;

  logger.error(err.message, statusCode, {
    id: errorId,
    error: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json({
    errors: [
      {
        ref: errorId,
        type: err.name,
        msg: message,
        path: req.path,
        method: req.method,
        location: "server",
        stack: isProduction ? null : err.stack,
      },
    ],
  });
};
