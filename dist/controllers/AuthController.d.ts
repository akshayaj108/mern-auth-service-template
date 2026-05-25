import { NextFunction, Response, Request } from "express";
import { AuthRequest, RegisterRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { JwtPayload } from "jsonwebtoken";
import { TokenService } from "../services/TokenService";
import { CredentialsService } from "../services/CredintialService";
import { User } from "../entity/User";
export declare class AuthController {
    private userService;
    private logger;
    private tokenService;
    private credentialsService;
    constructor(userService: UserService, logger: Logger, tokenService: TokenService, credentialsService: CredentialsService);
    register(req: RegisterRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    login(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    self(req: AuthRequest, res: Response): Promise<void>;
    refreshToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    generateAndSetTokens(payload: JwtPayload, refreshTokenId: string | null, res: Response, user: User): Promise<void>;
}
//# sourceMappingURL=AuthController.d.ts.map