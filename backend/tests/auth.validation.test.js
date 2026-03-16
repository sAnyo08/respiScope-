const request = require("supertest");
const app = require("../src/app");

describe("Auth Validation", () => {
  test("Should fail registration with invalid phone", async () => {
    const res = await request(app)
      .post("/api/auth/register/patient")
      .send({
        name: "Fail Test",
        password: "123456",
        phone: "invalid"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("Invalid phone");
  });

  test("Should fail registration with short password", async () => {
    const res = await request(app)
      .post("/api/auth/register/patient")
      .send({
        name: "Fail Test",
        password: "123",
        phone: "1234567890"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("Password must be >= 6 chars");
  });
});
