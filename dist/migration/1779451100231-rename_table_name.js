"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenameTableName1779451100231 = void 0;
class RenameTableName1779451100231 {
    name = "RenameTableName1779451100231";
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`);
        await queryRunner.renameTable("user", "users");
        await queryRunner.renameTable("refresh_token", "refreshTokens");
        await queryRunner.query(`ALTER TABLE "refreshTokens" ADD CONSTRAINT "FK_265bec4e500714d5269580a0219" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "refreshTokens" DROP CONSTRAINT "FK_265bec4e500714d5269580a0219"`);
        await queryRunner.renameTable("users", "user");
        await queryRunner.renameTable("refreshTokens", "refresh_token");
    }
}
exports.RenameTableName1779451100231 = RenameTableName1779451100231;
//# sourceMappingURL=1779451100231-rename_table_name.js.map