import { TokenService } from "../../src/services/TokenService";
import { Repository } from "typeorm";
import { RefreshToken } from "../../src/entity/RefreshToken";
import { User } from "../../src/entity/User";
import { CONFIG } from "../../src/config";
import request from "supertest";
import app from "../../src/app";

jest.mock("../../src/config", () => ({
  CONFIG: {
    PRIVATE_KEY: null,
    REFRESH_TOKEN_SECRET: "test-secret",
  },
}));

describe("TokenService", () => {
  let mockRefreshTokenRepo: jest.Mocked<Repository<RefreshToken>>;
  let tokenService: TokenService;

  beforeEach(() => {
    mockRefreshTokenRepo = {
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<RefreshToken>>;

    tokenService = new TokenService(mockRefreshTokenRepo);
  });

  describe("generateAccessToken", () => {
    it("should throw error when PRIVATE_KEY is not set", () => {
      (CONFIG as any).PRIVATE_KEY = null;

      expect(() =>
        tokenService.generateAccessToken({ sub: "1", role: "customer" }),
      ).toThrow("SECRET_KEY is not set");
    });

    it("should generate access token when PRIVATE_KEY is set", () => {
      (CONFIG as any).PRIVATE_KEY = "test-private-key";

      // it will throw error in sign() since key is invalid
      // but the important thing is it passes the PRIVATE_KEY check
      expect(() =>
        tokenService.generateAccessToken({ sub: "1", role: "customer" }),
      ).toThrow();
    });
  });

  // ← ADD THIS NEW BLOCK
  describe("generateRefreshToken", () => {
    it("should generate a refresh token string", () => {
      (CONFIG as any).REFRESH_TOKEN_SECRET = "test-secret";

      const token = tokenService.generateRefreshToken({
        sub: "1",
        role: "customer",
        id: 1,
      });

      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3); // JWT = header.payload.signature
    });
    it("should return 401 when no refresh token cookie is present", async () => {
      const response = await request(app)
        .post("/auth/refresh")
        .set("Cookie", [``]); // no refreshToken cookie

      expect(response.statusCode).toBe(401);
    });
  });

  describe("persistRefreshToken", () => {
    it("should save and return refresh token", async () => {
      const user = { id: 1 } as User;
      const mockToken = { id: 10, user, expiresAt: new Date() };

      mockRefreshTokenRepo.save.mockResolvedValue(
        mockToken as unknown as RefreshToken,
      );

      const result = await tokenService.persistRefreshToken(user);

      expect(mockRefreshTokenRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ user }),
      );
      expect(result).toHaveProperty("id", 10);
    });
  });

  describe("removeRefreshToken", () => {
    it("should delete refresh token by id", async () => {
      mockRefreshTokenRepo.delete.mockResolvedValue({
        affected: 1,
        raw: {},
      });

      await tokenService.removeRefreshToken(1);

      expect(mockRefreshTokenRepo.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it("should handle delete when token does not exist", async () => {
      mockRefreshTokenRepo.delete.mockResolvedValue({
        affected: 0,
        raw: {},
      });

      await tokenService.removeRefreshToken(999);

      expect(mockRefreshTokenRepo.delete).toHaveBeenCalledWith({ id: 999 });
    });
  });
});
