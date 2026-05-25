"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TenantController_1 = require("../controllers/TenantController");
const TenantService_1 = require("../services/TenantService");
const data_source_1 = require("../config/data-source");
const Tenants_1 = require("../entity/Tenants");
const logger_1 = __importDefault(require("../config/logger"));
const authenticates_1 = __importDefault(require("../middlewares/authenticates"));
const canAccess_1 = require("../middlewares/canAccess");
const constants_1 = require("../constants");
const tenantValidator_1 = __importDefault(require("../validators/tenantValidator"));
const updateTenanatValidator_1 = __importDefault(require("../validators/updateTenanatValidator"));
const router = express_1.default.Router();
const tenantRepo = data_source_1.AppDataSource.getRepository(Tenants_1.Tenant);
const tenantService = new TenantService_1.TenantService(tenantRepo);
const tenantController = new TenantController_1.TenantController(tenantService, logger_1.default);
router.post("/", authenticates_1.default, (0, canAccess_1.isAccess)([constants_1.Roles.ADMIN]), tenantValidator_1.default, (req, res, next) => tenantController.create(req, res, next));
router.get("/", authenticates_1.default, (0, canAccess_1.isAccess)([constants_1.Roles.ADMIN]), (req, res, next) => tenantController.get(req, res, next));
router.get("/:id", authenticates_1.default, (0, canAccess_1.isAccess)([constants_1.Roles.ADMIN]), (req, res, next) => tenantController.getById(req, res, next));
router.patch("/:id", authenticates_1.default, (0, canAccess_1.isAccess)([constants_1.Roles.ADMIN]), updateTenanatValidator_1.default, (req, res, next) => tenantController.update(req, res, next));
router.delete("/:id", authenticates_1.default, (0, canAccess_1.isAccess)([constants_1.Roles.ADMIN]), (req, res, next) => tenantController.delete(req, res, next));
exports.default = router;
//# sourceMappingURL=tenant.js.map