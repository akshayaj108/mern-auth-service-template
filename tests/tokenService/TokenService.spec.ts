import { TokenService } from "../../src/services/TokenService";
import { Repository } from "typeorm";
import { RefreshToken } from "../../src/entity/RefreshToken";
import { User } from "../../src/entity/User";
import { CONFIG } from "../../src/config";

// mock the config
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

  // ✅ covers: if (!CONFIG.PRIVATE_KEY) throw error
  describe("generateAccessToken", () => {
    it("should throw error when PRIVATE_KEY is not set", () => {
      (CONFIG as any).PRIVATE_KEY = null;

      expect(() =>
        tokenService.generateAccessToken({ sub: "1", role: "customer" }),
      ).toThrow("SECRET_KEY is not set");
    });
  });

  // ✅ covers: persistRefreshToken save call
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

  // ✅ covers: removeRefreshToken delete call + uncovered condition
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
        affected: 0, // ← this covers the uncovered condition
        raw: {},
      });

      await tokenService.removeRefreshToken(999);

      expect(mockRefreshTokenRepo.delete).toHaveBeenCalledWith({ id: 999 });
    });
  });
});
