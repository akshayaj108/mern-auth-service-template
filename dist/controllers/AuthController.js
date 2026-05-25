"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const express_validator_1 = require("express-validator");
const http_errors_1 = __importDefault(require("http-errors"));
const constants_1 = require("../constants");
class AuthController {
    userService;
    logger;
    tokenService;
    credentialsService;
    constructor(userService, logger, tokenService, credentialsService) {
        this.userService = userService;
        this.logger = logger;
        this.tokenService = tokenService;
        this.credentialsService = credentialsService;
        // this.register = this.register.bind(this);
    }
    async register(req, res, next) {
        const result = (0, express_validator_1.validationResult)(req);
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
                role: constants_1.Roles.CUSTOMER,
            });
            this.logger.info("User has been registerd", { id: user.id });
            const payload = {
                sub: String(user.id),
                role: user.role,
            };
            await this.generateAndSetTokens(payload, null, res, user);
            res.status(201).json({ id: user.id });
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        const result = (0, express_validator_1.validationResult)(req);
        //validation - checkin error array is empty or not if not empty then return resposne
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        const { email, pass } = req.body;
        try {
            const user = await this.userService.findByEmailWithPassword(email);
            if (!user) {
                const err = (0, http_errors_1.default)(400, "Email or password does not match");
                next(err);
                return;
            }
            const isPasswordMatch = await this.credentialsService.comparePassword(pass, user.pass);
            if (!isPasswordMatch) {
                const err = (0, http_errors_1.default)(400, "Email or password does not match");
                next(err);
                return;
            }
            const payload = {
                sub: String(user.id),
                role: user.role,
            };
            await this.generateAndSetTokens(payload, null, res, user);
            this.logger.info("User has been registerd", { id: user.id });
            res.status(200).json({ id: user.id });
        }
        catch (error) {
            next(error);
        }
    }
    async self(req, res) {
        const user = await this.userService.findById(Number(req.auth.sub));
        res.json({ ...user, pass: undefined });
    }
    async refreshToken(req, res, next) {
        try {
            const payload = {
                sub: String(req.auth.sub),
                role: req.auth.role,
            };
            const user = await this.userService.findById(Number(req.auth.sub));
            if (!user) {
                const error = (0, http_errors_1.default)(400, "User with token could not find");
                next(error);
                return;
            }
            await this.generateAndSetTokens(payload, req.auth.id, res, user);
            res.status(200).json({ id: user.id });
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            await this.tokenService.removeRefreshToken(Number(req.auth.id));
            this.logger.info("User has been logout", { id: req.auth.sub });
            this.logger.info("Refresh token has been deleted", req.auth.id);
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            res.json({});
        }
        catch (error) {
            next(error);
        }
    }
    async generateAndSetTokens(payload, refreshTokenId, res, user) {
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
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map