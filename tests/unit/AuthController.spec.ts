import { NextFunction, Response } from "express";
import { Logger } from "winston";
import { validationResult } from "express-validator";

import { AuthController } from "../../src/controllers/AuthController";
import { UserService } from "../../src/services/UserService";
import { TokenService } from "../../src/services/TokenService";
import { CredentialsService } from "../../src/services/CredintialService";
import { AuthRequest, RegisterRequest } from "../../src/types";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";

// Mock express-validator
jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

const validationResultMock = validationResult as unknown as jest.Mock;

describe("AuthController", () => {
  let authController: AuthController;

  let userServiceMock: jest.Mocked<UserService>;
  let tokenServiceMock: jest.Mocked<TokenService>;
  let credentialsServiceMock: jest.Mocked<CredentialsService>;
  let loggerMock: jest.Mocked<Logger>;

  let res: Response;
  let next: jest.MockedFunction<NextFunction>;

  const mockUser = {
    id: 1,
    firstName: "Akshay",
    lastName: "Jadhao",
    email: "akshay@example.com",
    pass: "hashed-password",
    role: Roles.CUSTOMER,
    tenant: {
      id: 10,
    },
  } as User;

  const createResponse = (): Response =>
    ({
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    }) as unknown as Response;

  const createAuthRequest = (): AuthRequest =>
    ({
      auth: {
        sub: "1",
        role: Roles.CUSTOMER,
        id: "22",
      },
    }) as unknown as AuthRequest;

  beforeEach(() => {
    // Reset mock implementations and call history for every test.
    jest.resetAllMocks();

    userServiceMock = {
      create: jest.fn(),
      findByEmailWithPassword: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    tokenServiceMock = {
      generateAccessToken: jest.fn(),
      persistRefreshToken: jest.fn(),
      removeRefreshToken: jest.fn(),
      generateRefreshToken: jest.fn(),
    } as unknown as jest.Mocked<TokenService>;

    credentialsServiceMock = {
      comparePassword: jest.fn(),
    } as unknown as jest.Mocked<CredentialsService>;

    loggerMock = {
      debug: jest.fn(),
      info: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    res = createResponse();
    next = jest.fn() as jest.MockedFunction<NextFunction>;

    authController = new AuthController(
      userServiceMock,
      loggerMock,
      tokenServiceMock,
      credentialsServiceMock,
    );

    // Default validation result: no validation errors.
    // This is important because validationResultMock is shared
    // across all tests.
    validationResultMock.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });

    // Default token service responses.
    tokenServiceMock.generateAccessToken.mockReturnValue(
      "access-token",
    );

    tokenServiceMock.persistRefreshToken.mockResolvedValue({
      id: 22,
    } as never);

    tokenServiceMock.generateRefreshToken.mockReturnValue(
      "refresh-token",
    );
  });

  // --------------------------------------------------
  // REGISTER
  // --------------------------------------------------

  describe("register", () => {
    it("should register a user successfully", async () => {
      userServiceMock.create.mockResolvedValue(mockUser);

      const req = {
        body: {
          firstName: "Akshay",
          lastName: "Jadhao",
          email: "akshay@example.com",
          pass: "password123",
        },
      } as RegisterRequest;

      await authController.register(req, res, next);

      expect(userServiceMock.create).toHaveBeenCalledWith({
        firstName: "Akshay",
        lastName: "Jadhao",
        email: "akshay@example.com",
        pass: "password123",
        role: Roles.CUSTOMER,
      });

      expect(tokenServiceMock.generateAccessToken).toHaveBeenCalled();

      expect(tokenServiceMock.persistRefreshToken).toHaveBeenCalledWith(
        mockUser,
      );

      expect(res.cookie).toHaveBeenCalledTimes(2);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: mockUser.id });

      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with an error when user creation fails", async () => {
      const error = new Error("User creation failed");

      userServiceMock.create.mockRejectedValue(error);

      const req = {
        body: {
          firstName: "Akshay",
          lastName: "Jadhao",
          email: "akshay@example.com",
          pass: "password123",
        },
      } as RegisterRequest;

      await authController.register(req, res, next);

      expect(userServiceMock.create).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------

  describe("login", () => {
    const req = {
      body: {
        email: "akshay@example.com",
        pass: "password123",
      },
    } as AuthRequest;

    it("should login a user successfully", async () => {
      userServiceMock.findByEmailWithPassword.mockResolvedValue(mockUser);
      credentialsServiceMock.comparePassword.mockResolvedValue(true);

      await authController.login(req, res, next);

      expect(
        userServiceMock.findByEmailWithPassword,
      ).toHaveBeenCalledWith("akshay@example.com");

      expect(credentialsServiceMock.comparePassword).toHaveBeenCalledWith(
        "password123",
        mockUser.pass,
      );

      expect(tokenServiceMock.generateAccessToken).toHaveBeenCalled();

      expect(res.cookie).toHaveBeenCalledTimes(2);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: mockUser.id });

      expect(next).not.toHaveBeenCalled();
    });

    it("should call next when user does not exist", async () => {
      userServiceMock.findByEmailWithPassword.mockResolvedValue(
        null as never,
      );

      await authController.login(req, res, next);

      expect(
        userServiceMock.findByEmailWithPassword,
      ).toHaveBeenCalledWith("akshay@example.com");

      expect(
        credentialsServiceMock.comparePassword,
      ).not.toHaveBeenCalled();

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Email or password does not match",
          status: 400,
        }),
      );
    });

    it("should call next when password does not match", async () => {
      userServiceMock.findByEmailWithPassword.mockResolvedValue(mockUser);
      credentialsServiceMock.comparePassword.mockResolvedValue(false);

      await authController.login(req, res, next);

      expect(credentialsServiceMock.comparePassword).toHaveBeenCalled();

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Email or password does not match",
          status: 400,
        }),
      );

      expect(res.json).not.toHaveBeenCalled();
    });

    it("should call next when login service throws an error", async () => {
      const error = new Error("Login failed");

      userServiceMock.findByEmailWithPassword.mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --------------------------------------------------
  // SELF
  // --------------------------------------------------

  describe("self", () => {
    it("should return the current user without password", async () => {
      userServiceMock.findById.mockResolvedValue(mockUser);

      const req = createAuthRequest();

      await authController.self(req, res);

      expect(userServiceMock.findById).toHaveBeenCalledWith(1);

      expect(res.json).toHaveBeenCalledWith({
        ...mockUser,
        pass: undefined,
      });
    });
  });

  // --------------------------------------------------
  // REFRESH TOKEN
  // --------------------------------------------------

  describe("refreshToken", () => {
    it("should refresh tokens successfully", async () => {
      userServiceMock.findById.mockResolvedValue(mockUser);

      const req = createAuthRequest();

      await authController.refreshToken(req, res, next);

      expect(userServiceMock.findById).toHaveBeenCalledWith(1);

      expect(tokenServiceMock.persistRefreshToken).toHaveBeenCalledWith(
        mockUser,
      );

      // The existing refresh token should be removed.
      expect(tokenServiceMock.removeRefreshToken).toHaveBeenCalledWith(22);

      expect(res.cookie).toHaveBeenCalledTimes(2);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: mockUser.id });

      expect(next).not.toHaveBeenCalled();
    });

    it("should call next when user is not found", async () => {
      userServiceMock.findById.mockResolvedValue(null as never);

      const req = createAuthRequest();

      await authController.refreshToken(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "User with token could not find",
          status: 400,
        }),
      );

      expect(tokenServiceMock.persistRefreshToken).not.toHaveBeenCalled();
    });

    it("should call next when refreshing token throws an error", async () => {
      const error = new Error("Token refresh failed");

      userServiceMock.findById.mockRejectedValue(error);

      const req = createAuthRequest();

      await authController.refreshToken(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  describe("logout", () => {
    it("should logout successfully", async () => {
      const req = createAuthRequest();

      await authController.logout(req, res, next);

      expect(tokenServiceMock.removeRefreshToken).toHaveBeenCalledWith(22);

      expect(res.clearCookie).toHaveBeenCalledWith("accessToken");
      expect(res.clearCookie).toHaveBeenCalledWith("refreshToken");

      expect(res.json).toHaveBeenCalledWith({});

      expect(next).not.toHaveBeenCalled();
    });

    it("should call next when logout fails", async () => {
      const error = new Error("Logout failed");

      tokenServiceMock.removeRefreshToken.mockRejectedValue(error);

      const req = createAuthRequest();

      await authController.logout(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --------------------------------------------------
  // GENERATE AND SET TOKENS
  // --------------------------------------------------

  describe("generateAndSetTokens", () => {
    it("should generate and set access and refresh tokens", async () => {
      const payload = {
        sub: "1",
        role: Roles.CUSTOMER,
      };

      await authController.generateAndSetTokens(
        payload,
        null,
        res,
        mockUser,
      );

      expect(tokenServiceMock.generateAccessToken).toHaveBeenCalledWith(
        payload,
      );

      expect(tokenServiceMock.persistRefreshToken).toHaveBeenCalledWith(
        mockUser,
      );

      expect(tokenServiceMock.removeRefreshToken).not.toHaveBeenCalled();

      expect(tokenServiceMock.generateRefreshToken).toHaveBeenCalledWith({
        ...payload,
        id: 22,
      });

      expect(res.cookie).toHaveBeenNthCalledWith(
        1,
        "accessToken",
        "access-token",
        expect.objectContaining({
          httpOnly: true,
          sameSite: "strict",
          maxAge: 1000 * 60 * 60,
        }),
      );

      expect(res.cookie).toHaveBeenNthCalledWith(
        2,
        "refreshToken",
        "refresh-token",
        expect.objectContaining({
          httpOnly: true,
          sameSite: "strict",
          maxAge: 1000 * 60 * 60 * 24 * 365,
        }),
      );
    });

    it("should remove the old refresh token when refreshTokenId is provided", async () => {
      const payload = {
        sub: "1",
        role: Roles.CUSTOMER,
      };

      await authController.generateAndSetTokens(
        payload,
        "15",
        res,
        mockUser,
      );

      expect(tokenServiceMock.removeRefreshToken).toHaveBeenCalledWith(15);
    });
  });

  // --------------------------------------------------
  // VALIDATION ERRORS
  // --------------------------------------------------

  describe("validation errors", () => {
    beforeEach(() => {
      // Override the default successful validation result.
      validationResultMock.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: "Email is required" }],
      });
    });

    it("should stop registration when validation fails", async () => {
      const req = {
        body: {
          firstName: "",
          lastName: "",
          email: "",
          pass: "",
        },
      } as RegisterRequest;

      await authController.register(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Email is required",
          status: 400,
        }),
      );

      expect(userServiceMock.create).not.toHaveBeenCalled();
    });

    it("should stop login when validation fails", async () => {
      const req = {
        body: {
          email: "",
          pass: "",
        },
      } as AuthRequest;

      await authController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Email is required",
          status: 400,
        }),
      );

      expect(
        userServiceMock.findByEmailWithPassword,
      ).not.toHaveBeenCalled();
    });
  });
});