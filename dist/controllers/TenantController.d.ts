import { NextFunction, Response } from "express";
import { TenantService } from "../services/TenantService";
import { Logger } from "winston";
import { CreateTenantRequest } from "../types";
export declare class TenantController {
    private tenantService;
    private logger;
    constructor(tenantService: TenantService, logger: Logger);
    create(req: CreateTenantRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    get(req: CreateTenantRequest, res: Response, next: NextFunction): Promise<void>;
    getById(req: CreateTenantRequest, res: Response, next: NextFunction): Promise<void>;
    update(req: CreateTenantRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: CreateTenantRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=TenantController.d.ts.map