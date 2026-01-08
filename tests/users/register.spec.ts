import request from "supertest";
import app from "../../src/app";

describe("POST /auth/register", () => {
  describe("happy path (given all fields)", () => {
    it("should return the 201 status code", async () => {
      //to write any test we have formula is AAA
      //Arrange
      const data = {
        userName: "Alex",
        email: "alex.t@gmail.com",
        pass: "Test",
      };

      //Act
      const response = await request(app).post("/auth/register").send(data);

      //Assert
      expect(response.statusCode).toBe(201);
    });

    it("should return json response", async () => {
      //Arrange
      const data = {
        userName: "Alex",
        email: "alex.t@gmail.com",
        pass: "Test",
      };

      //Act
      const response = await request(app).post("/auth/register").send(data);

      //Assert
      //to compare object value we use toEqual
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json"),
      );
    });
    it("should persist user data");
  });
  describe("sad path (Fields are missing", () => {});
});
