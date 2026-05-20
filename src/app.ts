import express, { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { HttpError } from "http-errors";
import logger from "./config/logger";
import authRouter from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();

app.use(express.json());
// app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static("public"));

app.use(cookieParser());

// can be publicly accessed via /.well-known/* routes.
// On Windows, folders starting with "." (like .well-known) may not be served correctly with the default public static mapping, so we map this directory explicitly to avoid path resolution issues.
app.use(
  "/.well-known",
  express.static(path.join(__dirname, "../public/.well-known")),
);
app.get("/", (req, res) => {
  // const err = createHttpError(400, "Bad Request Example");
  // next(err);
  res.send("Welcome to Auth Service");
});

app.use("/auth", authRouter);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
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
