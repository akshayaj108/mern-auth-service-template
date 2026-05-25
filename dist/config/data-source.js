"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const _1 = require(".");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: _1.CONFIG.DB_HOST,
    port: Number(_1.CONFIG.DB_PORT),
    username: _1.CONFIG.DB_USER_NAME,
    password: _1.CONFIG.DB_PASS,
    database: _1.CONFIG.DB_NAME,
    //Don't use this prod
    synchronize: false,
    // synchronize: CONFIG.NODE_ENV === "test" || CONFIG.NODE_ENV === "dev",
    logging: false,
    entities: [__dirname + "/../entity/*.{js,ts}"],
    migrations: [__dirname + "/../migration/*.{js,ts}"],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map