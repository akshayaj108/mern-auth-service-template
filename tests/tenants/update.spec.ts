import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import request from "supertest";
import createJWKSMock from "mock-jwks";
import app from "../../src/app";
import { Tenant } from "../../src/entity/Tenants";
import { Roles } from "../../src/constants";

describe("PATCH /tenants", () => {
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
    it("should return 200 status code", async () => {
      //act
      const response = await request(app)
        .patch(`/tenants/${id}`)
        .set("Cookie", [`accessToken=${adminToken}`])
        .send(data);
      //assert
      expect(response.statusCode).toBe(200);
    });
    it("should return 404 status code when tenant not exist in database and tenant not save update value in database", async () => {
      //act
      const notSaveId = 6;
      const response = await request(app)
        .delete(`/tenants/${notSaveId}`)
        .set("Cookie", [`accessToken=${adminToken}`])
        .send(data);
      //assert
      const tenantRepo = connections.getRepository(Tenant);
      const tenantData = await tenantRepo.find();
      expect(response.statusCode).toBe(404);
      expect(tenantData[0]?.name).toBe(existedData?.name);
      expect(tenantData[0]?.address).toBe(existedData?.address);
    });
    it("should update a tenant and saved in database", async () => {
      //act
      await request(app)
        .patch(`/tenants/${id}`)
        .set("Cookie", [`accessToken=${adminToken}`])
        .send(data);
      //assert
      const tenantRepo = connections.getRepository(Tenant);
      const tenantData = await tenantRepo.find();
      expect(tenantData[0]?.id).toBe(id);
      expect(tenantData[0]?.name).toBe(data.name);
      expect(tenantData[0]?.address).toBe(data.address);
    });

    it("should return 401 status if user is unauthenticated", async () => {
      //arrange

      //act
      const resposne = await request(app).patch(`/tenants/${id}`).send(data);
      //assert
      expect(resposne.statusCode).toBe(401);
      const tenantRepo = connections.getRepository(Tenant);

      const tenantData = await tenantRepo.find();
      expect(tenantData[0]?.name).toBe(existedData?.name);
      expect(tenantData[0]?.address).toBe(existedData?.address);
    });
    it("should return 403 status if user role is not admin", async () => {
      //act
      const response = await request(app)
        .patch(`/tenants/${id}`)
        .set("Cookie", [`accessToken=${managerToken}`])
        .send(data);
      //assert
      expect(response.statusCode).toBe(403);
      const tenantRepo = connections.getRepository(Tenant);
      const tenantData = await tenantRepo.find();
      expect(tenantData[0]?.name).toBe(existedData?.name);
      expect(tenantData[0]?.address).toBe(existedData?.address);
    });
    it("should return 400 status if tenant name is or address is missing", async () => {
      //arrange
      //act
      const response = await request(app)
        .patch(`/tenants/${id}`)
        .set("Cookie", [`accessToken=${adminToken}`])
        .send({
          address: "",
        });
      //assert

      expect(response.statusCode).toBe(400);

      expect(response.body.errors[0].msg).toBe("Address is required");
    });
  });
});
