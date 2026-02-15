const request = require("supertest");
const app = require("../src/app");

test("Should fail without token", async () => {
  const res = await request(app)
    .get("/api/consultations/doctor");

  expect(res.statusCode).toBe(401);
  expect(res.body).toHaveProperty("message");
});
