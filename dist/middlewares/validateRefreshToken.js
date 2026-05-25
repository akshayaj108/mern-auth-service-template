"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_jwt_1 = require("express-jwt");
const config_1 = require("../config");
const data_source_1 = require("../config/data-source");
const RefreshToken_1 = require("../entity/RefreshToken");
const logger_1 = __importDefault(require("../config/logger"));
exports.default = (0, express_jwt_1.expressjwt)({
    secret: config_1.CONFIG.REFRESH_TOKEN_SECRET,
    algorithms: ["HS256"],
    getToken(req) {
        const { refreshToken } = req.cookies;
        return refreshToken;
    },
    async isRevoked(req, token) {
        try {
            const refreshTokenRepo = data_source_1.AppDataSource.getRepository(RefreshToken_1.RefreshToken);
            const refreshToken = await refreshTokenRepo.findOne({
                where: {
                    id: Number((token?.payload).id),
                    user: { id: Number((token?.payload).sub) },
                },
            });
            return refreshToken === null;
        }
        catch (error) {
            console.log("Error while refresh token", error);
            logger_1.default.error("Error while requesting refresh token for user id ", {
                id: (token?.payload).id,
            });
        }
        return true;
    },
});
//# sourceMappingURL=validateRefreshToken.js.map