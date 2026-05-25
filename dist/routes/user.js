"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../config/data-source");
const logger_1 = __importDefault(require("../config/logger"));
const authenticates_1 = __importDefault(require("../middlewares/authenticates"));
const canAccess_1 = require("../middlewares/canAccess");
const constants_1 = require("../constants");
const User_1 = require("../entity/User");
const UserService_1 = require("../services/UserService");
const UserController_1 = require("../controllers/UserController");
const register_validators_1 = __importDefault(require("../validators/register-validators"));
const updateUser_validator_1 = __importDefault(require("../validators/updateUser.validator"));
const router = express_1.default.Router();
const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
const userService = new UserService_1.UserService(userRepo);
const userController = new UserController_1.UserController(userService, logger_1.default);
router.post("/", authenticates_1.default, (0, canAccess_1.isAccess)([constants_1.Roles.ADMIN]), register_validators_1.default, (req, res, next) => userController.register(req, res, next));
router.get("/", authenticates_1.default, (0, canAccess_1.isAccess)([constants_1.Roles.ADMIN]), (req, res, next) => userController.get(req, res, next));
router.get("/:id", authenticates_1.default, (0, canAccess_1.isAccess)([constants_1.Roles.ADMIN]), (req, res, next) => userController.getById(req, res, next));
router.patch("/:id", authenticates_1.default, (0, canAccess_1.isAccess)([constants_1.Roles.ADMIN]), updateUser_validator_1.default, (req, res, next) => userController.update(req, res, next));
router.delete("/:id", authenticates_1.default, (0, canAccess_1.isAccess)([constants_1.Roles.ADMIN]), (req, res, next) => userController.delete(req, res, next));
exports.default = router;
//# sourceMappingURL=user.js.map