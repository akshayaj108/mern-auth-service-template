import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import request from "supertest";
import createJWKSMock from "mock-jwks";
import app from "../../src/app";
import { Tenant } from "../../src/entity/Tenants";
import { Roles } from "../../src/constants";

describe("GET /tenants/:ID", () => {
  let connections: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;
  let adminToken: string;
  let managerToken: string;
  const existedData = {
    name: "Old Name",
    address: "Old Address",
  };
  beforeAll(async () => {
    jwks = createJWKSMock("http://localhost:5501");

    connections = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await connections.dropDatabase();
    await connections.synchronize();
    await connections.synchronize();
    const tenantRepo = connections.getRepository(Tenant);

    await tenantRepo.save(existedData);
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
  describe("Get Tenant by Id", () => {
    it("should return 200 status and tenant by id data ", async () => {
      //arrange
      const id = 1;
      //act
      const response = await request(app)
        .get(`/tenants/${id}`)
        .set("Cookie", [`accessToken=${adminToken}`]);
      //assert
      expect(response.statusCode).toBe(200);
    });
    it("should return 404 status code and return error message if tenant id is not exist", async () => {
      //arrange
      const tenantRepo = connections.getRepository(Tenant);
      const id = 5;
      //act
      const response = await request(app)
        .get(`/tenants/${id}`)
        .set("Cookie", [`accessToken=${adminToken}`]);
      //assert
      const tenantData = await tenantRepo.findOneBy({ id });
      expect(response.statusCode).toBe(404);
      expect(tenantData).toBeNull();
    });

    it("should return 401 status if user is unauthenticated to get tenant by id", async () => {
      //act
      const id = 1;
      const resposne = await request(app).get(`/tenants/${id}`);
      //assert
      expect(resposne.statusCode).toBe(401);
    });
    it("should return 403 status if user role is not admin to get tenant by id", async () => {
      const id = 1;
      //act
      const response = await request(app)
        .delete(`/tenants/${id}`)
        .set("Cookie", [`accessToken=${managerToken}`]);
      //assert
      expect(response.statusCode).toBe(403);
    });
  });
});
