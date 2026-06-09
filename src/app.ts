import express, { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { HttpError } from "http-errors";
import logger from "./config/logger";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import tenantRouter from "./routes/tenant";
import cookieParser from "cookie-parser";
import path from "node:path";
import cors from "cors";
import { CONFIG } from "./config";

const app = express();
app.disable("x-powered-by");

app.use(
  cors({
    origin: CONFIG.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use(express.static("public"));

app.use(cookieParser());

// can be publicly accessed via /.well-known/* routes.
// On Windows, folders starting with "." (like .well-known) may not be served correctly with the default public static mapping, so we map this directory explicitly to avoid path resolution issues.
app.use(
  "/.well-known",
  express.static(path.join(__dirname, "../public/.well-known")),
);
app.get("/", (_req, res) => {
  res.send("Welcome to Auth Service");
});

app.use("/auth", authRouter);
app.use("/tenants", tenantRouter);
app.use("/users", userRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  logger.error("An error occurred", { message: err.message });
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        message: err.message,
        path: "",
        location: "",
      },
    ],
  });
});

export default app;
