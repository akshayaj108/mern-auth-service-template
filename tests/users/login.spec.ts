import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import request from "supertest";
import app from "../../src/app";

describe("POST /auth/login", () => {
  const data = {
    email: "akshay.j@gamil.com",
    pass: "secret",
  };
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
    it("should return 200 if password match in login", async () => {
      //arrange
      const userData = data;
      //act
      await request(app)
        .post("/auth/register")
        .send({
          firstName: "Akshay",
          lastName: "J",
          ...userData,
        });
      const response = await request(app).post("/auth/login").send(userData);

      //assert
      expect(response.statusCode).toBe(200);
    });
    it("should return 400 and error message if email does not exit or invalid", async () => {
      //arrange
      //act

      const response = await request(app).post("/auth/login").send({
        email: "notgmail.com",
        pass: "secret",
      });
      //assert
      expect(response?.statusCode).toBe(400);
    });
  });
});
