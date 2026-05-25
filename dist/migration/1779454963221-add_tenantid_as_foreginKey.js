"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTenantidAsForeginKey1779454963221 = void 0;
class AddTenantidAsForeginKey1779454963221 {
    name = "AddTenantidAsForeginKey1779454963221";
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ADD "tenantId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_c58f7e88c286e5e3478960a998b" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_c58f7e88c286e5e3478960a998b"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tenantId"`);
    }
}
exports.AddTenantidAsForeginKey1779454963221 = AddTenantidAsForeginKey1779454963221;
//# sourceMappingURL=1779454963221-add_tenantid_as_foreginKey.js.map