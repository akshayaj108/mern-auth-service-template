"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./config/logger"));
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    // const err = createHttpError(400, "Bad Request Example");
    // next(err);
    res.send("Welcome to Auth Service");
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
    logger_1.default.error("An error occurred", { message: err.message });
    const statusCode = err.statusCode;
    res.status(statusCode).json({
        errors: [{
                type: err.name,
                message: err.message,
                path: '',
                location: ''
            }]
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map