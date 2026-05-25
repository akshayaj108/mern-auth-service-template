"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const data_source_1 = require("./config/data-source");
const logger_1 = __importDefault(require("./config/logger"));
const startServer = async () => {
    try {
        await data_source_1.AppDataSource.initialize();
        logger_1.default.info("Database connected successfully.");
        app_1.default.listen(config_1.CONFIG.PORT, () => {
            logger_1.default.info(`Server started on port ${config_1.CONFIG.PORT}`);
        });
    }
    catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map