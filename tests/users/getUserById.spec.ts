import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import request from "supertest";
import createJWKSMock from "mock-jwks";
import app from "../../src/app";
import { Roles } from "../../src/constants";
import { User } from "../../src/entity/User";

jest.setTimeout(20000);
describe("GET /users/:ID", () => {
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
  describe("Get User by Id", () => {
    it("should return 200 status and user by id ", async () => {
      //arrange
      const id = 1;
      //act
      const response = await request(app)
        .get(`/users/${id}`)
        .set("Cookie", [`accessToken=${adminToken}`]);
      //assert
      expect(response.statusCode).toBe(200);
    });
    it("should not return password of user", async () => {
      //arrange
      const id = 1;
      //act
      const response = await request(app)
        .get(`/users/${id}`)
        .set("Cookie", [`accessToken=${adminToken}`]);
      //assert
      expect(response.statusCode).toBe(200);
      expect(response.body).not.toHaveProperty("pass");
    });
    it("should return 400 status if user id is not a valid number", async () => {
      const response = await request(app)
        .get(`/users/abc`)
        .set("Cookie", [`accessToken=${adminToken}`]);

      expect(response.statusCode).toBe(400);
    });
    it("should return 404 status code and return error message if user id is not exist", async () => {
      //arrange
      const userRepo = connections.getRepository(User);
      const id = 5;
      //act
      const response = await request(app)
        .get(`/users/${id}`)
        .set("Cookie", [`accessToken=${adminToken}`]);
      //assert
      const userData = await userRepo.findOneBy({ id });
      expect(response.statusCode).toBe(404);
      expect(userData).toBeNull();
    });

    it("should return 401 status if user is unauthenticated to get user by id", async () => {
      //act
      const id = 1;
      const resposne = await request(app).get(`/users/${id}`);
      //assert
      expect(resposne.statusCode).toBe(401);
    });
    it("should return 403 status if user role is not admin to get user by id", async () => {
      const id = 1;
      //act
      const response = await request(app)
        .get(`/users/${id}`)
        .set("Cookie", [`accessToken=${managerToken}`]);
      //assert
      expect(response.statusCode).toBe(403);
    });
  });
});
