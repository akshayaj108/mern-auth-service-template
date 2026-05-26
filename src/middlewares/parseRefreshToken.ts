import { expressjwt } from "express-jwt";
import { CONFIG } from "../config";
import { Request } from "express";

export default expressjwt({
  secret: CONFIG.REFRESH_TOKEN_SECRET!,
  algorithms: ["HS256"],
  getToken(req: Request) {
    const { refreshToken } = req.cookies;
    if (typeof refreshToken !== "string") {
      return undefined;
    }
    return refreshToken;
  },
});
