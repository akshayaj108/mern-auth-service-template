import request from "supertest";
import "reflect-metadata";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/data-source";
import { truncateTable } from "../utils";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";

describe("POST /auth/register", () => {
  let connections: DataSource;
  beforeAll(async () => {
    connections = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await connections.dropDatabase();
    await connections.synchronize();
  });

  afterAll(async () => {
    await truncateTable(connections);
    if (connections && connections.isInitialized) {
      await connections.destroy();
    }
  });

  describe("happy path (given all fields)", () => {
    const data = {
      firstName: "Akshay",
      lastName: "J",
      email: "akshay.j@gamil.com",
      pass: "secret",
    };
    it("should return the 201 status code", async () => {
      //to write any test we have formula is AAA
      //Arrange
      const userData = data;

      //Act
      const response = await request(app).post("/auth/register").send(userData);

      //Assert
      expect(response.statusCode).toBe(201);
    });

    it("should return json response", async () => {
      //Arrange

      const userData = data;

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
      const userData = data;
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
    it("should return id of created user", async () => {
      //arrange
      const userData = data;
      //act
      const response = await request(app).post("/auth/register").send(userData);
      //assert
      expect(response.body).toHaveProperty("id");
    });
    //role check
    it("should assign a customer role", async () => {
      //arrange
      const userData = data;
      //act
      await request(app).post("/auth/register").send(userData);
      //assert
      const userRepository = connections.getRepository(User);
      const users = await userRepository.find();
      expect(users[0]).toHaveProperty("role");
      expect(users[0].role).toBe(Roles.CUSTOMER);
    });
    it("should stored only a hashed password", async () => {
      //arrange
      const userData = data;
      //act
      await request(app).post("/auth/register").send(userData);
      //assert
      const userRepository = connections.getRepository(User);
      const users = await userRepository.find();
      expect(users[0].pass).not.toBe(userData.pass);
      expect(users[0].pass).toHaveLength(60);
      expect(users[0].pass).toMatch(/^\$2b\$\d+\$/);
    });
    it("should return 400 if user email is already exists in database", async () => {
      //arrange
      const userData = data;
      const userRepository = connections.getRepository(User);
      await userRepository.save({ ...userData, role: Roles.CUSTOMER });
      //act
      const response = await request(app).post("/auth/register").send(userData);
      //assert
      const users = await userRepository.find();
      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(1);
    });
  });
  describe("sad path (Fields are missing", () => {});
});
