"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const _1 = require(".");
const logger = winston_1.default.createLogger({
    level: "info",
    defaultMeta: {
        serviceName: "auth-service",
    },
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.prettyPrint()),
    transports: [
        new winston_1.default.transports.File({
            level: "info",
            silent: _1.CONFIG.NODE_ENV === "test",
            dirname: "logs",
            filename: "app.log",
        }),
        new winston_1.default.transports.File({
            level: "error",
            silent: _1.CONFIG.NODE_ENV === "test",
            dirname: "logs",
            filename: "app.error.log",
        }),
        new winston_1.default.transports.Console({
            level: "info",
            silent: _1.CONFIG.NODE_ENV === "test",
        }),
    ],
});
exports.default = logger;
// const levels = {
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3,
//   verbose: 4,
//   debug: 5,
//   silly: 6
// };
//# sourceMappingURL=logger.js.map