import express, { Request, Response, NextFunction } from "express";
import { TenantController } from "../controllers/TenantController";
import { TenantService } from "../services/TenantService";
import { AppDataSource } from "../config/data-source";
import { Tenant } from "../entity/Tenants";
import logger from "../config/logger";
import authenticates from "../middlewares/authenticates";

const router = express.Router();
const tenantRepo = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepo);
const tenantController = new TenantController(tenantService, logger);

router.post(
  "/",
  authenticates,
  (req: Request, res: Response, next: NextFunction) =>
    tenantController.create(req, res, next),
);

export default router;
