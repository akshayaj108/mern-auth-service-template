"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const express_validator_1 = require("express-validator");
const constants_1 = require("../constants");
const http_errors_1 = __importDefault(require("http-errors"));
class UserController {
    userService;
    logger;
    constructor(userService, logger) {
        this.userService = userService;
        this.logger = logger;
        // this.register = this.register.bind(this);
    }
    async register(req, res, next) {
        const result = (0, express_validator_1.validationResult)(req);
        //validation - checkin error array is empty or not if not empty then return resposne
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        const { firstName, lastName, email, pass, tenantId } = req.body;
        const managerRole = constants_1.Roles.MANAGER;
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
            res.status(201).json({ id: user.id });
        }
        catch (error) {
            next(error);
        }
    }
    async get(req, res, next) {
        try {
            const response = await this.userService.get();
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            next((0, http_errors_1.default)(400, "Invalid url param."));
            return;
        }
        try {
            const response = await this.userService.findById(Number(id));
            if (!response) {
                const error = (0, http_errors_1.default)(404, "This Id tenant are not exist");
                next(error);
                return;
            }
            this.logger.info("User has been fetched", { id: response.id });
            res.json(response);
        }
        catch (error) {
            console.log("res++", error);
            next(error);
        }
    }
    async update(req, res, next) {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            next((0, http_errors_1.default)(400, "Invalid url param."));
            return;
        }
        const results = (0, express_validator_1.validationResult)(req);
        if (!results.isEmpty()) {
            return res.status(400).json({ errors: results.array() });
        }
        try {
            const response = await this.userService.updateById(Number(id), req.body);
            if (!response) {
                const error = (0, http_errors_1.default)(404, "Unable to update, This user id is not exist");
                next(error);
                return;
            }
            this.logger.info("User has been updated", { id: response.id });
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            next((0, http_errors_1.default)(400, "Invalid url param."));
            return;
        }
        try {
            const response = await this.userService.delete(Number(id));
            if (!response) {
                const error = (0, http_errors_1.default)(404, "Unable to delete, This user id is not exist");
                next(error);
                return;
            }
            this.logger.info("User has been deleted", {
                id: Number(id),
            });
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map