"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRefreshtokenCascade1699475145577 = void 0;
class AddRefreshtokenCascade1699475145577 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "refreshTokens" DROP CONSTRAINT "FK_265bec4e500714d5269580a0219"`);
        await queryRunner.query(`ALTER TABLE "refreshTokens" ADD CONSTRAINT "FK_265bec4e500714d5269580a0219" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "refreshTokens" DROP CONSTRAINT "FK_265bec4e500714d5269580a0219"`);
        await queryRunner.query(`ALTER TABLE "refreshTokens" ADD CONSTRAINT "FK_265bec4e500714d5269580a0219" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
exports.AddRefreshtokenCascade1699475145577 = AddRefreshtokenCascade1699475145577;
//# sourceMappingURL=1699475145577-add_refreshtoken_cascade.js.map