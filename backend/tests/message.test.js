const request = require("supertest");
const app = require("../src/app");

let token;
let consultationId;
let doctorId;

beforeEach(async () => {
  const doctor = await request(app)
    .post("/api/auth/register/doctor")
    .send({
      name: "Dr Test",
      email: "doc1@test.com",
      password: "123456",
      phone: "5555555555",
      specialization: "Cardiology"
    });

  doctorId = doctor.body.user._id;

  await request(app)
    .post("/api/auth/register/patient")
    .send({
      name: "Test Patient",
      email: "pat1@test.com",
      password: "123456",
      phone: "4444444444"
    });

  const login = await request(app)
    .post("/api/auth/login/patient")
    .send({
      email: "pat1@test.com",
      password: "123456"
    });

  token = login.body.accessToken;

  const consultation = await request(app)
    .post("/api/consultations")
    .set("Authorization", `Bearer ${token}`)
    .send({ doctorId });

  consultationId = consultation.body._id;
});

test("Send Text Message", async () => {
  const res = await request(app)
    .post("/message/text")
    .send({
      consultationId,
      senderRole: "patient",
      senderId: consultationId,
      receiverId: doctorId,
      text: "Hello Doctor"
    });

  expect(res.statusCode).toBe(200);
  expect(res.body.data).toHaveProperty("text");
});
