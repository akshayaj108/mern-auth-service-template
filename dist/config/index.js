"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
(0, dotenv_1.config)({
    path: path_1.default.join(__dirname, `../../.env.${process.env.NODE_ENV || "dev"}`),
});
const { PORT, NODE_ENV, DB_HOST, DB_PORT, DB_USER_NAME, DB_PASS, DB_NAME, REFRESH_TOKEN_SECRET, JWKS_URI, PRIVATE_KEY, } = process.env;
exports.CONFIG = {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_USER_NAME,
    DB_PASS,
    DB_NAME,
    REFRESH_TOKEN_SECRET,
    JWKS_URI,
    PRIVATE_KEY,
};
//# sourceMappingURL=index.js.map