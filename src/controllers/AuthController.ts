import { Response } from "express";
import { RegisterRequest } from "../types";
import { UserService } from "../services/UserService";

export class AuthController {
  constructor(private userService: UserService) {
    this.register = this.register.bind(this);
  }
  async register(req: RegisterRequest, res: Response) {
    const { firstName, lastName, email, pass } = req.body;

    await this.userService.create({
      firstName,
      lastName,
      email,
      pass,
    });
    res.status(201).json({ message: "User Registered Successfully" });
  }
}
