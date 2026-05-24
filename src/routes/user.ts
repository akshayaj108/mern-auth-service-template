import express, { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";
import authenticates from "../middlewares/authenticates";
import { isAccess } from "../middlewares/canAccess";
import { Roles } from "../constants";
import { User } from "../entity/User";
import { UserService } from "../services/UserService";
import { UserController } from "../controllers/UserController";
import registerValidators from "../validators/register-validators";

const router = express.Router();
const userRepo = AppDataSource.getRepository(User);
const userService = new UserService(userRepo);
const userController = new UserController(userService, logger);

router.post(
  "/",
  authenticates,
  isAccess([Roles.ADMIN]),
  registerValidators,
  (req: Request, res: Response, next: NextFunction) =>
    userController.register(req, res, next),
);
// router.get(
//   "/",
//   authenticates,
//   isAccess([Roles.ADMIN]),
//   (req: Request, res: Response, next: NextFunction) =>
//     tenantController.get(req, res, next),
// );
// router.get(
//   "/:id",
//   authenticates,
//   isAccess([Roles.ADMIN]),
//   (req: Request, res: Response, next: NextFunction) =>
//     tenantController.getById(req, res, next),
// );
// router.patch(
//   "/:id",
//   authenticates,
//   isAccess([Roles.ADMIN]),
//   updateTenanatValidator,
//   (req: Request, res: Response, next: NextFunction) =>
//     tenantController.update(req, res, next),
// );
// router.delete(
//   "/:id",
//   authenticates,
//   isAccess([Roles.ADMIN]),
//   (req: Request, res: Response, next: NextFunction) =>
//     tenantController.delete(req, res, next),
// );

export default router;
