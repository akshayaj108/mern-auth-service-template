import express, { Request, Response } from "express";
import "reflect-metadata";
import { HttpError } from "http-errors";
import logger from "./config/logger";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import tenantRouter from "./routes/tenant";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();

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

app.use((err: HttpError, _req: Request, res: Response) => {
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
