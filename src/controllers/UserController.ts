import { Request, NextFunction, Response } from "express";
import { RegisterUserRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import { Roles } from "../constants";
import createHttpError from "http-errors";

export class UserController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {
    // this.register = this.register.bind(this);
  }
  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);
    //validation - checkin error array is empty or not if not empty then return resposne
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const { firstName, lastName, email, pass } = req.body;
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
      });
      this.logger.info("Manager User has been registerd", { id: user.id });

      res.status(201).json({ id: user.id });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.userService.get();
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
  async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const response = await this.userService.findById(Number(id));
      if (!response) {
        const error = createHttpError(404, "This Id tenant are not exist");
        next(error);
        return;
      }
      const userWithoutPassword = {
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        role: response.role,
      };

      res.json(userWithoutPassword);
    } catch (error) {
      console.log("res++", error);
      next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const results = validationResult(req);
    if (!results.isEmpty()) {
      return res.status(400).json({ errors: results.array() });
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
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
