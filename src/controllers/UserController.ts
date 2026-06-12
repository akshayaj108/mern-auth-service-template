import { Request, NextFunction, Response } from "express";
import { RegisterUserRequest, UpdateUserRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { matchedData, validationResult } from "express-validator";
import { Roles } from "../constants";
import createHttpError from "http-errors";
import { DataFromQuery } from "../types";
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}
  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);
    //validation - checkin error array is empty or not if not empty then return resposne
    if (!result.isEmpty()) {
      const errors = createHttpError(400, result.array()[0]?.msg as string);
      next(errors);
    }
    const { firstName, lastName, email, pass, tenantId } = req.body;
    const managerRole = Roles.MANAGER;

    this.logger.debug("Request data to register user", {
      firstName,
      lastName,
      email,
      pass: "*****",
    });

    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        pass,
        role: managerRole,
        tenantId,
      });
      this.logger.info("Manager User has been registerd", { id: user.id });
      return res.status(201).json({ id: user.id });
    } catch (error) {
      return next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    const validatedQuery: DataFromQuery = matchedData(req, {
      onlyValidData: true,
    });
    try {
      const [response, count] = await this.userService.get(validatedQuery);
      return res.json({
        currentPage: validatedQuery.currentPage,
        perPage: validatedQuery.perPage,
        total: count,
        data: response,
      });
    } catch (error) {
      return next(error);
    }
  }
  async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (Number.isNaN(Number(id))) {
      next(createHttpError(400, "Invalid url param."));
      return;
    }
    try {
      const response = await this.userService.findById(Number(id));
      if (!response) {
        const error = createHttpError(404, "This Id tenant are not exist");
        next(error);
        return;
      }
      this.logger.info("User has been fetched", { id: response.id });
      return res.json(response);
    } catch (error) {
      return next(error);
    }
  }
  async update(req: UpdateUserRequest, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (Number.isNaN(Number(id))) {
      next(createHttpError(400, "Invalid url param."));
      return;
    }
    const results = validationResult(req);
    if (!results.isEmpty()) {
      const errors = createHttpError(400, results.array()[0]?.msg as string);
      next(errors);
    }
    try {
      const response = await this.userService.updateById(Number(id), req.body);
      if (!response) {
        const error = createHttpError(
          404,
          "Unable to update, This user id is not exist",
        );
        next(error);
        return;
      }
      this.logger.info("User has been updated", { id });
      return res.json(response);
    } catch (error) {
      return next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (Number.isNaN(Number(id))) {
      next(createHttpError(400, "Invalid url param."));
      return;
    }
    try {
      const response = await this.userService.delete(Number(id));
      if (!response) {
        const error = createHttpError(
          404,
          "Unable to delete, This user id is not exist",
        );
        next(error);
        return;
      }
      this.logger.info("User has been deleted", {
        id: Number(id),
      });
      return res.json(response);
    } catch (error) {
      return next(error);
    }
  }
}
