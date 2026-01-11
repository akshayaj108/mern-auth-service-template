import express, { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { HttpError } from "http-errors";
import logger from "./config/logger";
import authRouter from "./routes/auth";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  // const err = createHttpError(400, "Bad Request Example");
  // next(err);
  res.send("Welcome to Auth Service");
});

app.use("/auth", authRouter);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  logger.error("An error occurred", { message: err.message });
  const statusCode = err.statusCode;
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
