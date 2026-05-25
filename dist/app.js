"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const logger_1 = __importDefault(require("./config/logger"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const tenant_1 = __importDefault(require("./routes/tenant"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// app.use(express.static(path.join(__dirname, "../public")));
app.use(express_1.default.static("public"));
app.use((0, cookie_parser_1.default)());
// can be publicly accessed via /.well-known/* routes.
// On Windows, folders starting with "." (like .well-known) may not be served correctly with the default public static mapping, so we map this directory explicitly to avoid path resolution issues.
app.use("/.well-known", express_1.default.static(path_1.default.join(__dirname, "../public/.well-known")));
app.get("/", (req, res) => {
    // const err = createHttpError(400, "Bad Request Example");
    // next(err);
    res.send("Welcome to Auth Service");
});
app.use("/auth", auth_1.default);
app.use("/tenants", tenant_1.default);
app.use("/users", user_1.default);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
    logger_1.default.error("An error occurred", { message: err.message });
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                message: err.message,
                path: "",
                location: "",
            },
        ],
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map