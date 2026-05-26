import { expressjwt } from "express-jwt";
import { CONFIG } from "../config";
import { Request } from "express";
import { AppDataSource } from "../config/data-source";
import { RefreshToken } from "../entity/RefreshToken";
import { IRefreshTokenPayload } from "../types";
import { JwtPayload } from "jsonwebtoken";
import logger from "../config/logger";

export default expressjwt({
  secret: CONFIG.REFRESH_TOKEN_SECRET!,
  algorithms: ["HS256"],
  getToken(req: Request) {
    const refreshToken = req.cookies?.refreshToken as string | undefined;
    if (refreshToken) {
      return refreshToken;
    }
    return;
  },
  async isRevoked(_req: Request, token) {
    try {
      const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);
      const refreshToken = await refreshTokenRepo.findOne({
        where: {
          id: Number((token?.payload as IRefreshTokenPayload).id),
          user: { id: Number((token?.payload as JwtPayload).sub) },
        },
      });
      return refreshToken === null;
    } catch (error) {
      console.log("Error while refresh token", error);
      logger.error("Error while requesting refresh token for user id ", {
        id: (token?.payload as IRefreshTokenPayload).id,
      });
    }

    return true;
  },
});
