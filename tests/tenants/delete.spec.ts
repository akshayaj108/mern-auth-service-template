import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import request from "supertest";
import createJWKSMock from "mock-jwks";
import app from "../../src/app";
import { Tenant } from "../../src/entity/Tenants";
import { Roles } from "../../src/constants";

jest.setTimeout(20000);
describe("DELETE /tenants", () => {
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
  describe("Given Tenants all fields", () => {
    //arrange
    //generate mock token
    const id = 1;
    const data = {
      name: "Updated Name",
      address: "Updated Address",
    };
    it("should return 200 status code after deleted tenats", async () => {
      //act
      const response = await request(app)
        .delete(`/tenants/${id}`)
        .set("Cookie", [`accessToken=${adminToken}`])
        .send();
      //assert
      expect(response.statusCode).toBe(200);
    });

    it("should return 404 status code when tenant id data not exist in database", async () => {
      //act
      const notSaveId = 6;
      const response = await request(app)
        .delete(`/tenants/${notSaveId}`)
        .set("Cookie", [`accessToken=${adminToken}`])
        .send();
      //assert
      const tenantRepo = connections.getRepository(Tenant);
      const tenantData = await tenantRepo.find();
      expect(response.statusCode).toBe(404);
      expect(tenantData).toHaveLength(1);
    });
    it("should remove tenant in database", async () => {
      //act
      await request(app)
        .delete(`/tenants/${id}`)
        .set("Cookie", [`accessToken=${adminToken}`])
        .send();
      //assert
      const tenantRepo = connections.getRepository(Tenant);
      const tenantData = await tenantRepo.find();
      expect(tenantData).toHaveLength(0);
    });

    it("should return 401 status if user is unauthenticated", async () => {
      //act
      const resposne = await request(app).delete(`/tenants/${id}`).send(data);
      //assert
      expect(resposne.statusCode).toBe(401);
      const tenantRepo = connections.getRepository(Tenant);

      const tenantData = await tenantRepo.find();
      expect(tenantData).toHaveLength(1);
    });
    it("should return 403 status if user role is not admin", async () => {
      //act
      const response = await request(app)
        .delete(`/tenants/${id}`)
        .set("Cookie", [`accessToken=${managerToken}`])
        .send(data);
      //assert
      expect(response.statusCode).toBe(403);
      const tenantRepo = connections.getRepository(Tenant);
      const tenantData = await tenantRepo.find();
      expect(tenantData).toHaveLength(1);
    });
  });
});
