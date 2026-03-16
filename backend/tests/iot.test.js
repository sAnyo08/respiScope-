const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");

let consultationId;

beforeEach(async () => {
  // 1. Register Doctor
  const doctor = await request(app)
    .post("/api/auth/register/doctor")
    .send({
      name: "IoT Doctor",
      password: "123456",
      phone: "1110001111",
      specialization: "General"
    });
  const doctorId = doctor.body.user._id;

  // 2. Register Patient
  await request(app)
    .post("/api/auth/register/patient")
    .send({
      name: "IoT Patient",
      password: "123456",
      phone: "2220002222"
    });

  // 3. Login Patient
  const login = await request(app)
    .post("/api/auth/login/patient")
    .send({ phone: "2220002222", password: "123456" });
  const token = login.body.accessToken;

  // 4. Create Consultation
  const consultation = await request(app)
    .post("/api/consultations")
    .set("Authorization", `Bearer ${token}`)
    .send({ doctorId });
  consultationId = consultation.body._id;
});

test("IoT device should be able to upload raw audio", async () => {
  const dummyAudio = Buffer.alloc(1000, 0x12); // 1KB of dummy data

  const res = await request(app)
    .post(`/api/iot/upload/${consultationId}`)
    .set("Content-Type", "application/octet-stream")
    .send(dummyAudio);

  expect(res.statusCode).toBe(201);
  expect(res.body.message).toBe("Audio uploaded successfully");
  expect(res.body.data).toHaveProperty("messageType", "audio");
  expect(res.body.data).toHaveProperty("fileId");
});

test("IoT upload should fail for invalid consultation ID", async () => {
  const dummyAudio = Buffer.alloc(100, 0x00);
  const fakeId = new mongoose.Types.ObjectId();

  const res = await request(app)
    .post(`/api/iot/upload/${fakeId}`)
    .set("Content-Type", "application/octet-stream")
    .send(dummyAudio);

  expect(res.statusCode).toBe(404);
});
