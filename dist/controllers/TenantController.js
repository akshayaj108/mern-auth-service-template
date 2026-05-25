"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantController = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const express_validator_1 = require("express-validator");
class TenantController {
    tenantService;
    logger;
    constructor(tenantService, logger) {
        this.tenantService = tenantService;
        this.logger = logger;
    }
    async create(req, res, next) {
        const result = (0, express_validator_1.validationResult)(req);
        //validation - checkin error array is empty or not if not empty then return resposne
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        const { name, address } = req.body;
        try {
            const tenant = await this.tenantService.create({ name, address });
            this.logger.info("Tenant has been created", { id: tenant.id });
            res.status(201).json({ id: tenant.id });
            res.status(201).json({});
        }
        catch (error) {
            next(error);
        }
    }
    async get(req, res, next) {
        try {
            const response = await this.tenantService.getAll();
            this.logger.info("All tenant have been fetched");
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
            const response = await this.tenantService.findById(Number(id));
            if (!response) {
                const error = (0, http_errors_1.default)(404, "Tenant id does not exits.");
                next(error);
                return;
            }
            this.logger.info("Tenant has been fetched");
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            next((0, http_errors_1.default)(400, "Invalid url param."));
            return;
        }
        const result = (0, express_validator_1.validationResult)(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        try {
            const response = await this.tenantService.updateById(Number(id), req.body);
            if (!response) {
                const error = (0, http_errors_1.default)(404, "Unable to update, This Id tenant are not exist");
                next(error);
                return;
            }
            this.logger.info("Tenant has been updated", { id: id });
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
            const response = await this.tenantService.delete(Number(id));
            if (!response) {
                const error = (0, http_errors_1.default)(404, "Unable to delete, This Id tenant are not exist");
                next(error);
                return;
            }
            this.logger.info("Tenant has been deleted");
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.TenantController = TenantController;
//# sourceMappingURL=TenantController.js.map