import request from "supertest";
import "reflect-metadata";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/data-source";
import { truncateTable } from "../utils";
import { User } from "../../src/entity/User";

describe("POST /auth/register", () => {
  let connections: DataSource;
  beforeAll(async () => {
    connections = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await truncateTable(connections);
  });

  afterAll(async () => {
    await truncateTable(connections);
    if (connections && connections.isInitialized) {
      await connections.destroy();
    }
  });

  describe("happy path (given all fields)", () => {
    it("should return the 201 status code", async () => {
      //to write any test we have formula is AAA
      //Arrange
      const userData = {
        firstName: "Akshay",
        lastName: "J",
        email: "akshay.j@gamil.com",
        pass: "secret",
      };

      //Act
      const response = await request(app).post("/auth/register").send(userData);

      //Assert
      expect(response.statusCode).toBe(201);
    });

    it("should return json response", async () => {
      //Arrange
      const userData = {
        firstName: "Akshay",
        lastName: "J",
        email: "akshay.j@gamil.com",
        pass: "secret",
      };

      //Act
      const response = await request(app).post("/auth/register").send(userData);

      //Assert
      //to compare object value we use toEqual
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json"),
      );
    });
    it("should persist user data in DB", async () => {
      //ararnge
      const userData = {
        firstName: "Akshay",
        lastName: "J",
        email: "akshay.j@gamil.com",
        pass: "secret",
      };
      //act
      await request(app).post("/auth/register").send(userData);
      //assert
      const userRepository = connections.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(1);
      expect(users[0].firstName).toBe(userData.firstName);
      expect(users[0].lastName).toBe(userData.lastName);
      expect(users[0].email).toBe(userData.email);
    });
  });
  describe("sad path (Fields are missing", () => {});
});
