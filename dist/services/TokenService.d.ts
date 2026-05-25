import { JwtPayload } from "jsonwebtoken";
import { Repository } from "typeorm";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";
export declare class TokenService {
    private refreshTokenRepo;
    constructor(refreshTokenRepo: Repository<RefreshToken>);
    generateAccessToken(payload: JwtPayload): string;
    generateRefreshToken(payload: JwtPayload): string;
    persistRefreshToken(user: User): Promise<{
        user: User;
        expiresAt: Date;
    } & RefreshToken>;
    removeRefreshToken(id: number): Promise<import("typeorm").DeleteResult>;
}
//# sourceMappingURL=TokenService.d.ts.map