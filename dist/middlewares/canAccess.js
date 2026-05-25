"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAccess = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const isAccess = (roles) => {
    return (req, res, next) => {
        const _req = req;
        if (!roles.includes(_req.auth.role)) {
            const error = (0, http_errors_1.default)(403, "you dont have enough permission");
            next(error);
            return;
        }
        next();
    };
};
exports.isAccess = isAccess;
//# sourceMappingURL=canAccess.js.map