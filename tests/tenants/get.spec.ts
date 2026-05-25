import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import request from "supertest";
import createJWKSMock from "mock-jwks";
import app from "../../src/app";
import { Tenant } from "../../src/entity/Tenants";
import { Roles } from "../../src/constants";

jest.setTimeout(20000);
describe("GET /tenants", () => {
  let connections: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;
  let adminToken: string;

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
  });

  afterAll(async () => {
    if (connections && connections.isInitialized) {
      await connections.destroy();
    }
  });
  afterEach(async () => {
    jwks.stop();
  });
  describe("Get All Tenants", () => {
    it("should return 200 status and tenant data ", async () => {
      //arrange
      const tenantRepo = connections.getRepository(Tenant);
      //act
      const response = await request(app)
        .get("/tenants")
        .set("Cookie", [`accessToken=${adminToken}`]);
      //assert
      const tenantData = await tenantRepo.find();
      expect(response.statusCode).toBe(200);
      expect(tenantData).toHaveLength(1);
      expect(tenantData[0]).toMatchObject(existedData);
    });
  });
});
