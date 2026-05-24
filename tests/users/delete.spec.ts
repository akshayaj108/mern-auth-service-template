import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import request from "supertest";
import createJWKSMock from "mock-jwks";
import app from "../../src/app";
import { Roles } from "../../src/constants";
import { User } from "../../src/entity/User";

describe("DELETE /users", () => {
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
  describe("Given users all fields", () => {
    //arrange
    const id = 1;
    it("should return 200 status code after user deleted", async () => {
      //act
      const response = await request(app)
        .delete(`/users/${id}`)
        .set("Cookie", [`accessToken=${adminToken}`]);
      //assert
      expect(response.statusCode).toBe(200);
    });
    it("should return 404 status code when user id does not exist in database and user should not be deleted in database", async () => {
      //act
      const notSaveId = 6;
      const response = await request(app)
        .delete(`/users/${notSaveId}`)
        .set("Cookie", [`accessToken=${adminToken}`]);
      //assert
      const userRepo = connections.getRepository(User);
      const userData = await userRepo.find();
      expect(response.statusCode).toBe(404);
      expect(userData).toHaveLength(1);
    });
    it("should delete a user data from database", async () => {
      //act
      await request(app)
        .delete(`/users/${id}`)
        .set("Cookie", [`accessToken=${adminToken}`]);
      //assert
      const userRepo = connections.getRepository(User);
      const userData = await userRepo.find();
      expect(userData).toHaveLength(0);
    });

    it("should return 401 status if user is unauthenticated", async () => {
      //act
      const resposne = await request(app).delete(`/users/${id}`);
      //assert

      const userRepo = connections.getRepository(User);
      const userData = await userRepo.find();
      expect(resposne.statusCode).toBe(401);
      expect(userData).toHaveLength(1);
    });
    it("should return 403 status if user role is not admin", async () => {
      //act
      const response = await request(app)
        .delete(`/users/${id}`)
        .set("Cookie", [`accessToken=${managerToken}`]);
      //assert
      const userRepo = connections.getRepository(User);
      const userData = await userRepo.find();
      expect(response.statusCode).toBe(403);
      expect(userData).toHaveLength(1);
    });
  });
});
