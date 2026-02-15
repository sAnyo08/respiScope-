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
      password: "123456",
      phone: "5555555555",
      specialization: "Cardiology"
    });

  doctorId = doctor.body.user._id;

  // Register Patient
  await request(app)
    .post("/api/auth/register/patient")
    .send({
      name: "Test Patient",
      password: "123456",
      phone: "4444444444"
    });

  // Login Patient (IMPORTANT)
  const login = await request(app)
    .post("/api/auth/login/patient")
    .send({
      phone: "4444444444",
      password: "123456"
    });

  token = login.body.accessToken;
});

test("Create Consultation", async () => {
  const res = await request(app)
    .post("/api/consultations")
    .set("Authorization", `Bearer ${token}`)  // 🔥 must send token
    .send({ doctorId });

  expect(res.statusCode).toBe(201);
  expect(res.body).toHaveProperty("doctorId");
});
