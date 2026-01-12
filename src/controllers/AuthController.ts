import { NextFunction, Response } from "express";
import { RegisterRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { validationResult } from "express-validator";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {
    // this.register = this.register.bind(this);
  }
  async register(req: RegisterRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);
    //validation - checkin error array is empty or not if not empty then return resposne
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const { firstName, lastName, email, pass } = req.body;
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
      });
      this.logger.info("User has been registerd", { id: user.id });
      res.status(201).json({ id: user.id });
    } catch (error) {
      next(error);
    }
  }
}
