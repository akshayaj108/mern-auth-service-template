"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findByEmailWithPassword(email) {
        return await this.userRepository.findOne({
            where: { email },
            select: [
                "id",
                "firstName",
                "lastName",
                "email",
                "pass",
                "role",
                "tenant",
            ],
        });
    }
    async getHashPassword(password) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        return hashedPassword;
    }
    async create({ firstName, lastName, email, pass, role, tenantId }) {
        const user = await this.findByEmailWithPassword(email);
        if (user) {
            const err = (0, http_errors_1.default)(400, "User email is already exists");
            throw err;
        }
        try {
            const hashedPassword = await this.getHashPassword(pass);
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                pass: hashedPassword,
                role: role,
                tenantId: tenantId ? { id: tenantId } : undefined,
            });
        }
        catch (error) {
            console.log("err", error);
            const customError = (0, http_errors_1.default)(500, "Failed to store data in database");
            throw customError;
        }
    }
    async get() {
        return await this.userRepository.find();
    }
    async findById(id) {
        return await this.userRepository.findOne({ where: { id } });
    }
    async updateById(userId, userData) {
        const updatedUser = await this.userRepository.update(userId, userData);
        if (!updatedUser) {
            return null;
        }
        return await this.userRepository.findOneBy({ id: userId });
    }
    async delete(userId) {
        const response = await this.userRepository.delete(userId);
        if (response.affected === 0) {
            return null;
        }
        return response;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map