"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTenantsTable1779454662782 = void 0;
class CreateTenantsTable1779454662782 {
    name = "CreateTenantsTable1779454662782";
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "tenants" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "address" character varying NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "tenants"`);
    }
}
exports.CreateTenantsTable1779454662782 = CreateTenantsTable1779454662782;
//# sourceMappingURL=1779454662782-create_tenants_table.js.map