import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import request from "supertest";
import app from "../../src/app";
import { Tenant } from "../../src/entity/Tenants";
describe("POST /tenants", () => {
  let connections: DataSource;
  beforeAll(async () => {
    connections = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await connections.dropDatabase();
    await connections.synchronize();
  });

  afterAll(async () => {
    if (connections && connections.isInitialized) {
      await connections.destroy();
    }
  });

  describe("Given all fields", () => {
    //arrange
    const data = {
      name: "Test Name",
      address: "Test Address",
    };
    it("should return 201 status code", async () => {
      //act
      const response = await request(app).post("/tenants").send(data);
      //assert
      expect(response.statusCode).toBe(201);
    });

    it("should create a tenat and store in database", async () => {
      //act
      await request(app).post("/tenants").send(data);
      //assert
      const tenantRepo = connections.getRepository(Tenant);
      const tenantData = await tenantRepo.find();
      expect(tenantData).toHaveLength(1);
      expect(tenantData[0]?.name).toBe(data.name);
      expect(tenantData[0]?.address).toBe(data.address);
    });
  });
});
