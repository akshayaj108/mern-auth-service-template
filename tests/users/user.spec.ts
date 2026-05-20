import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import request from "supertest";
import createJWKSMock from "mock-jwks";
import app from "../../src/app";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";

describe("POST /auth/self", () => {
  let connections: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;
  beforeAll(async () => {
    jwks = createJWKSMock("http://localhost:5501");

    jwks.start();

    connections = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await connections.dropDatabase();
    await connections.synchronize();
  });

  afterAll(async () => {
    jwks.stop();
    if (connections && connections.isInitialized) {
      await connections.destroy();
    }
  });

  describe("Given all fields", () => {
    it("should return 200 status code", async () => {
      //arrange

      //generate mock token
      const accessToken = jwks.token({ sub: "1", role: Roles.CUSTOMER });
      //arrange
      //act
      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send();
      //assert
      expect(response.statusCode).toBe(200);
    });

    it("should return user data", async () => {
      //steps
      //Register user
      const data = {
        firstName: "Akshay",
        lastName: "J",
        email: "akshay.j@gamil.com",
        pass: "secret",
      };
      const userRepository = connections.getRepository(User);
      const userData = await userRepository.save({
        ...data,
        role: Roles.CUSTOMER,
      });
      //generate mock token
      const accessToken = jwks.token({
        sub: String(userData.id),
        role: userData.role,
      });
      //arrange
      //act
      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send();
      //assert
      expect(response.body.id).toBe(userData.id);
    });
    it("it should not return password properties", async () => {
      //Register user
      const data = {
        firstName: "Akshay",
        lastName: "J",
        email: "akshay.j@gamil.com",
        pass: "secret",
      };
      const userRepository = connections.getRepository(User);
      const userData = await userRepository.save({
        ...data,
        role: Roles.CUSTOMER,
      });
      //generate mock token
      const accessToken = jwks.token({
        sub: String(userData.id),
        role: userData.role,
      });
      //arrange
      //act
      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send();
      //assert
      expect(response.body).not.toHaveProperty("pass");
    });
    it("it should return 401 status code if token is missing password", async () => {
      //arrange
      //act
      const response = await request(app).get("/auth/self").send();
      //assert
      expect(response.statusCode).toBe(401);
    });
  });
});
