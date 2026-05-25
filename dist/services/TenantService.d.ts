import { Repository } from "typeorm";
import { Tenant } from "../entity/Tenants";
import { TenantPayload, UpdateTenantPaylod } from "../types";
export declare class TenantService {
    private tenantRepo;
    constructor(tenantRepo: Repository<Tenant>);
    create(tenantData: TenantPayload): Promise<TenantPayload & Tenant>;
    getAll(): Promise<Tenant[]>;
    findById(tenantId: number): Promise<Tenant | null>;
    updateById(tenantId: number, tenantData: UpdateTenantPaylod): Promise<Tenant | null>;
    delete(tenantId: number): Promise<import("typeorm").DeleteResult | null>;
}
//# sourceMappingURL=TenantService.d.ts.map