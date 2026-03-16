const request = require("supertest");
const app = require("../src/app");

let token;
let consultationId;
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

  // Login Patient
  const login = await request(app)
    .post("/api/auth/login/patient")
    .send({
      phone: "4444444444",
      password: "123456"
    });

  token = login.body.accessToken;

  // Create Consultation
  const consultation = await request(app)
    .post("/api/consultations")
    .set("Authorization", `Bearer ${token}`)
    .send({ doctorId });

  consultationId = consultation.body._id;
});

test("Send Text Message", async () => {
  const res = await request(app)
    .post("/api/messages/text")
    .set("Authorization", `Bearer ${token}`)
    .send({
      consultationId,
      text: "Hello Doctor"
    });

  expect(res.statusCode).toBe(200);
  expect(res.body.data).toHaveProperty("text");
});
