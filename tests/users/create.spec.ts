import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import request from "supertest";
import createJWKSMock from "mock-jwks";
import app from "../../src/app";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";

describe("POST /users", () => {
  let connections: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;
  let adminToken: string;
  let managerToken: string;
  beforeAll(async () => {
    jwks = createJWKSMock("http://localhost:5501");
    connections = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await connections.dropDatabase();
    await connections.synchronize();
    jwks.start();
    adminToken = jwks.token({ sub: "1", role: Roles.ADMIN });
    managerToken = jwks.token({
      sub: "1",
      role: Roles.MANAGER,
      lastName: "K",
      email: "rakesh@mern.space",
      password: "password",

      tenantId: 1,
    });
  });

  afterAll(async () => {
    if (connections && connections.isInitialized) {
      await connections.destroy();
    }
  });
  afterEach(async () => {
    jwks.stop();
  });
  describe("Given all fields", () => {
    it("should return 201 status code and register user data", async () => {
      //steps
      //arrange
      const data = {
        firstName: "Akshay",
        lastName: "J",
        email: "akshay.j@gamil.com",
        pass: "secret",
        role: Roles.MANAGER,
      };
      const userRepository = connections.getRepository(User);
      //act
      const response = await request(app)
        .post("/users")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send(data);
      //assert
      const users = await userRepository.find();
      expect(response.statusCode).toBe(201);
      expect(response.body.id).toBe(users[0]?.id);
    });
    it("should save only manager role user", async () => {
      //steps
      //arrange
      const data = {
        firstName: "Akshay",
        lastName: "J",
        email: "akshay.j@gamil.com",
        pass: "secret",
        role: Roles.CUSTOMER,
      };
      const userRepository = connections.getRepository(User);
      //act
      await request(app)
        .post("/users")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send(data);
      //assert
      const users = await userRepository.find();
      expect(users[0]?.role).toBe(Roles.MANAGER);
    });
    it("it should not return password properties", async () => {
      //Register user
      const data = {
        firstName: "Akshay",
        lastName: "J",
        email: "akshay.j@gamil.com",
        pass: "secret",
        role: Roles.MANAGER,
      };
      //act
      const response = await request(app)
        .post("/users")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send(data);
      //assert
      expect(response.body).not.toHaveProperty("pass");
    });
    it("it should return 401 status code if unauthenticated user tries to save manager user", async () => {
      //arrange
      const data = {
        firstName: "Akshay",
        lastName: "J",
        email: "akshay.j@gamil.com",
        pass: "secret",
        role: Roles.MANAGER,
      };
      const userRepository = connections.getRepository(User);
      //act
      const response = await request(app)
        .post("/users")
        .set("Cookie", [`accessToken=''`])
        .send(data);
      //assert
      const users = await userRepository.find();
      expect(response.statusCode).toBe(401);
      expect(users).toHaveLength(0);
    });
    it("it should return 403 status code if non-admin user tries to save manager user", async () => {
      //arrange
      const data = {
        firstName: "Akshay",
        lastName: "J",
        email: "akshay.j@gamil.com",
        pass: "secret",
        role: Roles.MANAGER,
      };
      const userRepository = connections.getRepository(User);
      //act
      const response = await request(app)
        .post("/users")
        .set("Cookie", [`accessToken=${managerToken}`])
        .send(data);
      //assert
      const users = await userRepository.find();
      expect(response.statusCode).toBe(403);
      expect(users).toHaveLength(0);
    });
  });
  describe("Fields are missing", () => {
    it("should return 400 status code if email field is missing", async () => {
      //ararnge
      const data = {
        firstName: "Akshay",
        lastName: "J",
        email: "",
        pass: "secret",
        role: Roles.MANAGER,
      };
      const userData = { ...data, email: "" };
      const userRepository = connections.getRepository(User);
      const users = await userRepository.find();
      //act
      const response = await request(app)
        .post("/users")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send(userData);
      //assert
      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(0);
      expect(response.body.errors[0].msg).toBe("Email is required");
    });
    it("should return 400 status code if firstName field is missing", async () => {
      //ararnge
      const data = {
        firstName: "",
        lastName: "J",
        email: "akshay.j@gamil.com",
        pass: "secret",
        role: Roles.MANAGER,
      };
      const userData = { ...data, firstName: "" };
      const userRepository = connections.getRepository(User);
      const users = await userRepository.find();
      //act
      const response = await request(app)
        .post("/auth/register")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send(userData);
      //assert
      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(0);
      expect(response.body.errors[0].msg).toBe("First name is required");
    });
    it("should return 400 status code if password field is missing", async () => {
      //ararnge
      const data = {
        firstName: "Akshay",
        lastName: "J",
        email: "akshay.j@gamil.com",
        pass: "",
        role: Roles.MANAGER,
      };
      const userData = { ...data, pass: "" };
      const userRepository = connections.getRepository(User);
      const users = await userRepository.find();
      //act
      const response = await request(app)
        .post("/auth/register")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send(userData);
      //assert
      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(0);
      expect(response.body.errors[0].msg).toBe("Password is required");
    });
  });
});
