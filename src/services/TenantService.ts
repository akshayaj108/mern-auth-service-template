import { Repository } from "typeorm";
import { Tenant } from "../entity/Tenants";
import { TenantPayload } from "../types";

export class TenantService {
  constructor(private tenantRepo: Repository<Tenant>) {}

  async create(tenantData: TenantPayload) {
    return await this.tenantRepo.save(tenantData);
  }
}
