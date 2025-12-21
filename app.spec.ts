import { calculateDiscount } from "./src/utils";
import request from "supertest";
import app from "./src/app";

describe("App", () => {
  it("should run tests calculateDiscount function", () => {
    expect(calculateDiscount(100, 20)).toBe(80);
  });

  test("should api return 200 status code", async () => {
    const response = await request(app).get("/").expect(200);
    expect(response.statusCode).toBe(200);
  });
});
