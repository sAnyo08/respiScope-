const request = require("supertest");
const app = require("../src/app");

let token;
let doctorId;

beforeEach(async () => {
  // Register Doctor
  const doctor = await request(app)
    .post("/api/auth/register/doctor")
    .send({
      name: "Dr Test",
      email: "doc@test.com",
      password: "123456",
      phone: "7777777777",
      specialization: "Cardiology"
    });

  doctorId = doctor.body.user._id;

  // Register Patient
  await request(app)
    .post("/api/auth/register/patient")
    .send({
      name: "Test Patient",
      email: "pat@test.com",
      password: "123456",
      phone: "6666666666"
    });

  const login = await request(app)
    .post("/api/auth/login/patient")
    .send({
      email: "pat@test.com",
      password: "123456"
    });

  token = login.body.accessToken;
});

test("Create Consultation", async () => {
  const res = await request(app)
    .post("/api/consultations")
    .set("Authorization", `Bearer ${token}`)
    .send({ doctorId });

  expect(res.statusCode).toBe(201);
  expect(res.body).toHaveProperty("doctorId");
});
