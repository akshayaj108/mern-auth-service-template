import request from "supertest";
import "reflect-metadata";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { isJwt } from "../utils";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";
import { RefreshToken } from "../../src/entity/RefreshToken";

jest.setTimeout(20000);
describe("POST /auth/register", () => {
  const data = {
    firstName: "Akshay",
    lastName: "J",
    email: "akshay.j@gamil.com",
    pass: "secret",
  };
  let connections: DataSource;
  beforeAll(async () => {
    connections = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await connections.dropDatabase();
    await connections.synchronize();
  });

  afterAll(async () => {
    if (connections && connections.isInitialized) {
      await connections.destroy();
    }
  });

  describe("given all fields", () => {
    it("should return the 201 status code", async () => {
      //to write any test we have formula is AAA
      //Arrange
      const userData = data;

      //Act
      const response = await request(app).post("/auth/register").send(userData);

      //Assert
      expect(response.statusCode).toBe(201);
    });

    it("should return json response", async () => {
      //Arrange

      const userData = data;

      //Act
      const response = await request(app).post("/auth/register").send(userData);

      //Assert
      //to compare object value we use toEqual
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json"),
      );
    });
    it("should persist user data in DB", async () => {
      //ararnge
      const userData = data;
      //act
      await request(app).post("/auth/register").send(userData);
      //assert
      const userRepository = connections.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(1);
      const user = users[0];
      expect(user).toBeDefined();

      expect(user!.firstName).toBe(userData.firstName);
      expect(user!.lastName).toBe(userData.lastName);
      expect(user!.email).toBe(userData.email);
    });
    it("should return id of created user", async () => {
      //arrange
      const userData = data;
      //act
      const response = await request(app).post("/auth/register").send(userData);
      //assert
      expect(response.body).toHaveProperty("id");
    });
    //role check
    it("should assign a customer role", async () => {
      //arrange
      const userData = data;
      //act
      await request(app).post("/auth/register").send(userData);
      //assert
      const userRepository = connections.getRepository(User);
      const users = await userRepository.find();
      const user = users[0];
      expect(user).toBeDefined();
      expect(user).toHaveProperty("role");
      expect(user!.role).toBe(Roles.CUSTOMER);
    });
    it("should stored only a hashed password", async () => {
      //arrange
      const userData = data;
      //act
      await request(app).post("/auth/register").send(userData);
      //assert
      const userRepository = connections.getRepository(User);
      const users = await userRepository.find({ select: ["pass"] });
      const user = users[0];
      expect(user).toBeDefined();
      expect(user!.pass).not.toBe(userData.pass);
      expect(user!.pass).toHaveLength(60);
      expect(user!.pass).toMatch(/^\$2b\$\d+\$/);
    });
    it("should return 400 if user email is already exists in database", async () => {
      //arrange
      const userData = data;
      const userRepository = connections.getRepository(User);
      await userRepository.save({ ...userData, role: Roles.CUSTOMER });
      //act
      const response = await request(app).post("/auth/register").send(userData);
      //assert
      const users = await userRepository.find();
      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(1);
    });
    it("should return access token and refresh token inside a cookies", async () => {
      //arrange
      const userData = data;
      //act
      const response = await request(app).post("/auth/register").send(userData);
      //assert
      const headers = response.headers as Record<
        string,
        string | string[] | undefined
      >;
      let accessToken = null;
      let refreshToken = null;
      const cookies = headers["set-cookie"] || [];
      if (Array.isArray(cookies)) {
        cookies.forEach((cookie) => {
          const [name, value] = cookie.split(";")[0]?.split("=") ?? [];
          if (name === "accessToken") {
            accessToken = value ?? null;
          }

          if (name === "refreshToken") {
            refreshToken = value ?? null;
          }
        });
      }
      expect(accessToken).not.toBeNull();
      expect(refreshToken).not.toBeNull();
      expect(isJwt(accessToken)).toBeTruthy();
      expect(isJwt(refreshToken)).toBeTruthy();
    });
    it("should store refresh token in database", async () => {
      //Arrange
      const userData = data;
      //Act
      const response = await request(app).post("/auth/register").send(userData);
      //Assert
      const refreshTokenRepo = connections?.getRepository(RefreshToken);
      // const refreshTokenList = await refreshTokenRepo?.find();
      // expect(refreshTokenList).toHaveLength(1);
      const token = await refreshTokenRepo
        .createQueryBuilder("refreshToken")
        .where("refreshToken.userId = :userId", { userId: response.body.id })
        .getMany();
      expect(token).toHaveLength(1);
    });
  });
  describe("Fields are missing", () => {
    it("should return 400 status code if email field is missing", async () => {
      //ararnge
      const userData = { ...data, email: "" };
      const userRepository = connections.getRepository(User);
      const users = await userRepository.find();
      //act
      const response = await request(app).post("/auth/register").send(userData);
      //assert
      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(0);
    });
    it("should return 400 status code if firstName field is missing", async () => {
      //ararnge
      const userData = { ...data, firstName: "" };
      const userRepository = connections.getRepository(User);
      const users = await userRepository.find();
      //act
      const response = await request(app).post("/auth/register").send(userData);
      //assert
      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(0);
    });
    it("should return 400 status code if password field is missing", async () => {
      //ararnge
      const userData = { ...data, pass: "" };
      const userRepository = connections.getRepository(User);
      const users = await userRepository.find();
      //act
      const response = await request(app).post("/auth/register").send(userData);
      //assert
      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(0);
    });
  });
  describe("Fields are not in proper format", () => {
    it("should trim the email field", async () => {
      //ararnge
      const userData = { ...data, email: " akshay.j@jebitech.com" };
      //act
      await request(app).post("/auth/register").send(userData);
      //assert
      const userRepository = connections.getRepository(User);
      const users = await userRepository.find();
      const user = users[0];
      expect(user!.email).toBe(userData?.email.trim());
    });
    it("should return 400 status code if email is invalid", async () => {
      //ararnge
      const userData = { ...data, email: " akshay.j@jebitech." };
      //act
      const response = await request(app).post("/auth/register").send(userData);
      //assert
      expect(response.statusCode).toBe(400);
    });
  });
});
