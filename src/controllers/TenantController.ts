import { NextFunction, Response } from "express";
import { TenantService } from "../services/TenantService";
import { Logger } from "winston";
import { CreateTenantRequest } from "../types";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";

export class TenantController {
  constructor(
    private tenantService: TenantService,
    private logger: Logger,
  ) {}
  async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);
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
    } catch (error) {
      next(error);
    }
  }

  async get(req: CreateTenantRequest, res: Response, next: NextFunction) {
    try {
      const response = await this.tenantService.getAll();
      if (response?.length < 1) {
        res.send("No record saved in database");
      }

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
  async getById(req: CreateTenantRequest, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const response = await this.tenantService.findById(Number(id));
      if (!response) {
        const error = createHttpError(404, "This Id tenant are not exist");
        next(error);
        return;
      }
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
  async update(req: CreateTenantRequest, res: Response, next: NextFunction) {
    const { id } = req.params;
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    try {
      const response = await this.tenantService.updateById(
        Number(id),
        req.body,
      );
      if (!response) {
        const error = createHttpError(
          404,
          "Unable to update, This Id tenant are not exist",
        );
        next(error);
        return;
      }
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
  async delete(req: CreateTenantRequest, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const response = await this.tenantService.delete(Number(id));
      if (!response) {
        const error = createHttpError(
          404,
          "Unable to delete, This Id tenant are not exist",
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
