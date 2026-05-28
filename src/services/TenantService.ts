import { Repository } from "typeorm";
import { Tenant } from "../entity/Tenants";
import { TenantPayload, UpdateTenantPaylod } from "../types";

export class TenantService {
  constructor(private readonly tenantRepo: Repository<Tenant>) {}

  async create(tenantData: TenantPayload) {
    return await this.tenantRepo.save(tenantData);
  }

  async getAll() {
    return await this.tenantRepo.find();
  }

  async findById(tenantId: number) {
    return await this.tenantRepo.findOneBy({ id: tenantId });
  }

  async updateById(tenantId: number, tenantData: UpdateTenantPaylod) {
    const updatedTenant = await this.tenantRepo.update(tenantId, tenantData);
    if (!updatedTenant) {
      return null;
    }
    return await this.tenantRepo.findOneBy({ id: tenantId });
  }
  async delete(tenantId: number) {
    const deletedTenant = await this.tenantRepo.delete(tenantId);
    if (deletedTenant.affected === 0) {
      return null;
    }
    return deletedTenant;
  }
}
