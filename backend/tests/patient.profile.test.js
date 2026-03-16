const request = require("supertest");
const app = require("../src/app");

let token;

beforeEach(async () => {
  // Register Patient
  await request(app)
    .post("/api/auth/register/patient")
    .send({
      name: "Patient Profile Test",
      password: "123456",
      phone: "9998887777"
    });

  // Login Patient
  const login = await request(app)
    .post("/api/auth/login/patient")
    .send({
      phone: "9998887777",
      password: "123456"
    });

  token = login.body.accessToken;
});

test("Patient should be able to fetch their profile", async () => {
  const res = await request(app)
    .get("/api/patients/profile")
    .set("Authorization", `Bearer ${token}`);

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("name", "Patient Profile Test");
  expect(res.body).toHaveProperty("phone", "9998887777");
});
