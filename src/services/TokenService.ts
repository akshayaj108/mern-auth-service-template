import { JwtPayload, sign } from "jsonwebtoken";
import createHttpError from "http-errors";
import { CONFIG } from "../config";
import { Repository } from "typeorm";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";

export class TokenService {
  constructor(private refreshTokenRepo: Repository<RefreshToken>) {}

  generateAccessToken(payload: JwtPayload) {
    let privateKey: string;
    if (!CONFIG.PRIVATE_KEY) {
      const error = createHttpError(500, "SECRET_KEY is not set");
      throw error;
    }
    try {
      privateKey = CONFIG.PRIVATE_KEY;
    } catch (error) {
      console.log("error in generating private and public key", error);
      const err = createHttpError(500, "Error reading private key");
      throw err;
    }
    const accessToken = sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "1h",
      issuer: "auth-service",
    });

    return accessToken;
  }

  generateRefreshToken(payload: JwtPayload) {
    const refreshToken = sign(payload, CONFIG.REFRESH_TOKEN_SECRET!, {
      algorithm: "HS256",
      expiresIn: "1y",
      issuer: "auth-service",
      jwtid: String(payload?.id),
    });
    return refreshToken;
  }

  async persistRefreshToken(user: User) {
    const expiry = 1000 * 60 * 60 * 24 * 365;
    const newRefreshToken = await this.refreshTokenRepo.save({
      user: user,
      expiresAt: new Date(Date.now() + expiry),
    });
    return newRefreshToken;
  }
  async removeRefreshToken(id: number) {
    return await this.refreshTokenRepo.delete({ id });
  }
}
