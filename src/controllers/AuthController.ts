import { NextFunction, Response, Request } from "express";
import { AuthRequest, RegisterRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import { JwtPayload } from "jsonwebtoken";
import { TokenService } from "../services/TokenService";
import createHttpError from "http-errors";
import { CredentialsService } from "../services/CredintialService";
import { User } from "../entity/User";
import { Roles } from "../constants";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private tokenService: TokenService,
    private credentialsService: CredentialsService,
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
        role: Roles.CUSTOMER,
      });
      this.logger.info("User has been registerd", { id: user.id });

      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };
      await this.generateAndSetTokens(payload, null, res, user);

      return res.status(201).json({ id: user.id });
    } catch (error) {
      return next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    //validation - checkin error array is empty or not if not empty then return resposne
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const { email, pass } = req.body;

    try {
      const user = await this.userService.findByEmailWithPassword(
        String(email),
      );
      if (!user) {
        const err = createHttpError(400, "Email or password does not match");
        next(err);
        return;
      }

      const isPasswordMatch = await this.credentialsService.comparePassword(
        String(pass),
        user.pass,
      );
      if (!isPasswordMatch) {
        const err = createHttpError(400, "Email or password does not match");
        next(err);
        return;
      }
      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };
      await this.generateAndSetTokens(payload, null, res, user);

      this.logger.info("User has been registerd", { id: user.id });
      return res.status(200).json({ id: user.id });
    } catch (error) {
      return next(error);
    }
  }
  async self(req: AuthRequest, res: Response) {
    const user = await this.userService.findById(Number(req.auth.sub));
    res.json({ ...user, pass: undefined });
  }

  async refreshToken(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const payload: JwtPayload = {
        sub: String(req.auth.sub),
        role: req.auth.role,
      };

      const user = await this.userService.findById(Number(req.auth.sub));

      if (!user) {
        const error = createHttpError(400, "User with token could not find");
        next(error);
        return;
      }
      await this.generateAndSetTokens(payload, req.auth.id!, res, user);

      res.status(200).json({ id: user.id });
    } catch (error) {
      next(error);
    }
  }
  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await this.tokenService.removeRefreshToken(Number(req.auth.id));

      this.logger.info("User has been logout", { id: req.auth.sub });
      this.logger.info("Refresh token has been deleted", req.auth.id);

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.json({});
    } catch (error) {
      return next(error);
    }
  }
  async generateAndSetTokens(
    payload: JwtPayload,
    refreshTokenId: string | null,
    res: Response,
    user: User,
  ) {
    const accessToken = this.tokenService.generateAccessToken(payload);

    //Persist the refresh token
    const newRefreshToken = await this.tokenService.persistRefreshToken(user);
    //update refresh token by deleting old refresh token
    if (refreshTokenId) {
      await this.tokenService.removeRefreshToken(Number(refreshTokenId));
    }

    const refreshToken = this.tokenService.generateRefreshToken({
      ...payload,
      id: newRefreshToken?.id,
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
  }
}
