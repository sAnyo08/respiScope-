const request = require("supertest");
const app = require("../src/app");

test("Refresh token should generate new access token", async () => {

  await request(app)
    .post("/api/auth/register/patient")
    .send({
      name: "Test",
      password: "123456",
      phone: "2222222222"
    });

  const login = await request(app)
    .post("/api/auth/login/patient")
    .send({
      phone: "2222222222",
      password: "123456"
    });

  const refreshToken = login.headers["set-cookie"]
    .find(c => c.includes("refreshToken"))
    .split(";")[0]
    .split("=")[1];

  const res = await request(app)
    .post("/api/auth/refresh/patient")
    .send({ refreshToken });

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("accessToken");
});
