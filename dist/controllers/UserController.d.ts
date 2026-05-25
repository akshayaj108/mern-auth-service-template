import { Request, NextFunction, Response } from "express";
import { RegisterUserRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
export declare class UserController {
    private userService;
    private logger;
    constructor(userService: UserService, logger: Logger);
    register(req: RegisterUserRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    get(req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    update(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=UserController.d.ts.map