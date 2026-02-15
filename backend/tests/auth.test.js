const request = require("supertest");
const app = require("../src/app");

describe("Auth API", () => {

  test("Register Patient Successfully", async () => {
    const res = await request(app)
      .post("/api/auth/register/patient")
      .send({
        name: "Test Patient",
        email: "test@test.com",
        password: "123456",
        phone: "9999999999"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message");
  });

  test("Login Patient Successfully", async () => {
    await request(app)
      .post("/api/auth/register/patient")
      .send({
        name: "Test Patient",
        email: "test2@test.com",
        password: "123456",
        phone: "8888888888"
      });

    const res = await request(app)
      .post("/api/auth/login/patient")
      .send({
        phone: "8888888888",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

});