"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const jsonwebtoken_1 = require("jsonwebtoken");
const http_errors_1 = __importDefault(require("http-errors"));
const config_1 = require("../config");
class TokenService {
    refreshTokenRepo;
    constructor(refreshTokenRepo) {
        this.refreshTokenRepo = refreshTokenRepo;
    }
    generateAccessToken(payload) {
        let privateKey;
        try {
            privateKey = fs_1.default.readFileSync(path_1.default.join(__dirname, "../../certs/private.pem"));
        }
        catch (error) {
            console.log("error in generating private and public key", error);
            const err = (0, http_errors_1.default)(500, "Error reading private key");
            throw err;
        }
        const accessToken = (0, jsonwebtoken_1.sign)(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "1h",
            issuer: "auth-service",
        });
        return accessToken;
    }
    generateRefreshToken(payload) {
        const refreshToken = (0, jsonwebtoken_1.sign)(payload, config_1.CONFIG.REFRESH_TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: "1y",
            issuer: "auth-service",
            jwtid: String(payload?.id),
        });
        return refreshToken;
    }
    async persistRefreshToken(user) {
        const expiry = 1000 * 60 * 60 * 24 * 365;
        const newRefreshToken = await this.refreshTokenRepo.save({
            user: user,
            expiresAt: new Date(Date.now() + expiry),
        });
        return newRefreshToken;
    }
    async removeRefreshToken(id) {
        return await this.refreshTokenRepo.delete({ id });
    }
}
exports.TokenService = TokenService;
//# sourceMappingURL=TokenService.js.map