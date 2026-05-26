import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import createHttpError from "http-errors";

export const isAccess = (roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const _req = req as AuthRequest;
    if (!roles.includes(_req.auth.role)) {
      const error = createHttpError(403, "you dont have enough permission");
      next(error);
      return;
    }
    next();
  };
};
