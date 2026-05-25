"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantService = void 0;
class TenantService {
    tenantRepo;
    constructor(tenantRepo) {
        this.tenantRepo = tenantRepo;
    }
    async create(tenantData) {
        return await this.tenantRepo.save(tenantData);
    }
    async getAll() {
        return await this.tenantRepo.find();
    }
    async findById(tenantId) {
        return await this.tenantRepo.findOneBy({ id: tenantId });
    }
    async updateById(tenantId, tenantData) {
        const updatedTenant = await this.tenantRepo.update(tenantId, tenantData);
        if (!updatedTenant) {
            return null;
        }
        return await this.tenantRepo.findOneBy({ id: tenantId });
    }
    async delete(tenantId) {
        const deletedTenant = await this.tenantRepo.delete(tenantId);
        if (deletedTenant.affected === 0) {
            return null;
        }
        return deletedTenant;
    }
}
exports.TenantService = TenantService;
//# sourceMappingURL=TenantService.js.map