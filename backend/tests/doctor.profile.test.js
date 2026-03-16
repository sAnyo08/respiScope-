const request = require("supertest");
const app = require("../src/app");

let token;

beforeEach(async () => {
  // Register Doctor
  await request(app)
    .post("/api/auth/register/doctor")
    .send({
      name: "Dr Test Profile",
      password: "123456",
      phone: "1112223333",
      specialization: "General"
    });

  // Login Doctor
  const login = await request(app)
    .post("/api/auth/login/doctor")
    .send({
      phone: "1112223333",
      password: "123456"
    });

  token = login.body.accessToken;
});

test("Doctor should be able to fetch their profile", async () => {
  const res = await request(app)
    .get("/api/doctors/profile")
    .set("Authorization", `Bearer ${token}`);

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("name", "Dr Test Profile");
  expect(res.body).toHaveProperty("phone", "1112223333");
});

test("Fetching profile without token should fail", async () => {
  const res = await request(app).get("/api/doctors/profile");
  expect(res.statusCode).toBe(401);
});
