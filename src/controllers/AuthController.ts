import fs from "fs";
import path from "path";
import { NextFunction, Response } from "express";
import { RegisterRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import { JwtPayload, sign } from "jsonwebtoken";
import createHttpError from "http-errors";
import { CONFIG } from "../config";

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
      let privateKey: Buffer;
      try {
        privateKey = fs.readFileSync(
          path.join(__dirname, "../../certs/private.pem"),
        );
      } catch (error) {
        console.log("error in generate keys", error);
        const err = createHttpError(500, "Error reading private key");
        next(err);
        return;
      }
      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };
      const accessToken = sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn: "1h",
        issuer: "auth-service",
      });
      const refreshToken = sign(payload, CONFIG.REFRESH_TOKEN_SECRET!, {
        algorithm: "HS256",
        expiresIn: "1y",
        issuer: "auth-service",
      });
      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, //1h
        httpOnly: true,
      });
      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365, //1y
        httpOnly: true,
      });
      res.status(201).json({ id: user.id });
    } catch (error) {
      next(error);
    }
  }
}
