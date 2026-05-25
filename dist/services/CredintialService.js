"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialsService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class CredentialsService {
    async comparePassword(userPassword, hashedPassword) {
        return await bcrypt_1.default.compare(userPassword, hashedPassword);
    }
}
exports.CredentialsService = CredentialsService;
//# sourceMappingURL=CredintialService.js.map