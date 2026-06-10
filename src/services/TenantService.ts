import { Repository } from "typeorm";
import { Tenant } from "../entity/Tenants";
import { DataFromQuery, TenantPayload, UpdateTenantPaylod } from "../types";

export class TenantService {
  constructor(private readonly tenantRepo: Repository<Tenant>) {}

  async create(tenantData: TenantPayload) {
    return await this.tenantRepo.save(tenantData);
  }

  async getAll(validatedQuery: DataFromQuery) {
    const { perPage, currentPage, q } = validatedQuery;
    const serachText = `%${q}%`;
    const queryBuilder = this.tenantRepo.createQueryBuilder("tenant");
    if (q) {
      queryBuilder
        .where("tenant.name ILike :q", {
          q: serachText,
        })
        .orWhere("tenant.address ILike :q", {
          q: serachText,
        });
    }
    const results = queryBuilder
      .skip((currentPage - 1) * perPage)
      .take(perPage)
      .orderBy("tenant.id", "DESC")
      .getManyAndCount();
    return results;
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
