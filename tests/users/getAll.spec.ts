import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import request from "supertest";
import createJWKSMock from "mock-jwks";
import app from "../../src/app";
import { Roles } from "../../src/constants";
import { User } from "../../src/entity/User";

jest.setTimeout(20000);
describe("GET /users", () => {
  let connections: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;
  let adminToken: string;
  let managerToken: string;
  const existedData = {
    firstName: "Akshay",
    lastName: "J",
    email: "akshay.j@gamil.com",
    pass: "secret",
    role: Roles.MANAGER,
  };
  beforeAll(async () => {
    jwks = createJWKSMock("http://localhost:5501");

    connections = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await connections.dropDatabase();
    await connections.synchronize();
    const userRepo = connections.getRepository(User);

    await userRepo.save(existedData);
    jwks.start();
    adminToken = jwks.token({ sub: "1", role: Roles.ADMIN });
    managerToken = jwks.token({ sub: "1", role: Roles.MANAGER });
  });

  afterAll(async () => {
    if (connections && connections.isInitialized) {
      await connections.destroy();
    }
  });
  afterEach(async () => {
    jwks.stop();
  });
  describe("Get All Users", () => {
    it("should return 200 status and when get all users ", async () => {
      //arrange
      const userRepo = connections.getRepository(User);
      //act
      const response = await request(app)
        .get("/users")
        .set("Cookie", [`accessToken=${adminToken}`]);
      //assert
      const userData = await userRepo.find();
      expect(response.statusCode).toBe(200);
      expect(userData).toHaveLength(1);
    });
    it("should not return password of all users", async () => {
      //act
      const response = await request(app)
        .get(`/users`)
        .set("Cookie", [`accessToken=${adminToken}`]);
      //assert
      expect(response.statusCode).toBe(200);
      expect(response.body[0]).not.toHaveProperty("pass");
    });
    it("should return 401 status if user is unauthenticated to get all users", async () => {
      //act
      const response = await request(app).get(`/users`);
      //assert
      expect(response.statusCode).toBe(401);
    });
    it("should return 403 status if user role is not admin to get all users", async () => {
      //act
      const response = await request(app)
        .get(`/users`)
        .set("Cookie", [`accessToken=${managerToken}`]);
      //assert
      expect(response.statusCode).toBe(403);
    });
  });
});
