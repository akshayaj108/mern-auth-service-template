import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import request from "supertest";
import createJWKSMock from "mock-jwks";
import app from "../../src/app";
import { Tenant } from "../../src/entity/Tenants";
import { Roles } from "../../src/constants";

jest.setTimeout(20000);
describe("POST /tenants", () => {
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

    const data = {
      name: "Test Name",
      address: "Test Address",
    };
    it("should return 201 status code", async () => {
      //act
      const response = await request(app)
        .post("/tenants")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send(data);
      //assert
      expect(response.statusCode).toBe(201);
    });

    it("should create a tenant and store in database", async () => {
      //act
      await request(app)
        .post("/tenants")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send(data);
      //assert
      const tenantRepo = connections.getRepository(Tenant);
      const tenantData = await tenantRepo.find();
      expect(tenantData).toHaveLength(1);
      expect(tenantData[0]?.name).toBe(data.name);
      expect(tenantData[0]?.address).toBe(data.address);
    });

    it("should return 401 status if user is unauthenticated", async () => {
      //act
      const resposne = await request(app).post("/tenants").send(data);
      //assert
      expect(resposne.statusCode).toBe(401);
      const tenantRepo = connections.getRepository(Tenant);
      const tenantData = await tenantRepo.find();
      expect(tenantData).toHaveLength(0);
    });
    it("should return 403 status if user role is not admin", async () => {
      //act
      const response = await request(app)
        .post("/tenants")
        .set("Cookie", [`accessToken=${managerToken}`])
        .send(data);
      //assert
      expect(response.statusCode).toBe(403);
      const tenantRepo = connections.getRepository(Tenant);
      const tenantData = await tenantRepo.find();
      expect(tenantData).toHaveLength(0);
    });
    it("should return 400 status if tenant name is or address is missing", async () => {
      //act
      const response = await request(app)
        .post("/tenants")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send({
          name: "Test Name",
          address: "",
        });
      //assert
      expect(response.statusCode).toBe(400);
      expect(response.body.errors[0].msg).toBe("Address is required");
    });
  });
});
