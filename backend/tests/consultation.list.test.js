const request = require("supertest");
const app = require("../src/app");

let doctorToken;
let patientToken;
let doctorId;

beforeEach(async () => {
  // 1. Register and Login Doctor
  const doctor = await request(app)
    .post("/api/auth/register/doctor")
    .send({
      name: "Dr List Test",
      password: "123456",
      phone: "7778889999",
      specialization: "Pulmonology"
    });
  doctorId = doctor.body.user._id;

  const docLogin = await request(app)
    .post("/api/auth/login/doctor")
    .send({ phone: "7778889999", password: "123456" });
  doctorToken = docLogin.body.accessToken;

  // 2. Register and Login Patient
  await request(app)
    .post("/api/auth/register/patient")
    .send({
      name: "Patient List Test",
      password: "123456",
      phone: "6665554444"
    });

  const ptLogin = await request(app)
    .post("/api/auth/login/patient")
    .send({ phone: "6665554444", password: "123456" });
  patientToken = ptLogin.body.accessToken;

  // 3. Create a consultation
  await request(app)
    .post("/api/consultations")
    .set("Authorization", `Bearer ${patientToken}`)
    .send({ doctorId });
});

test("Doctor should see their consultations", async () => {
  const res = await request(app)
    .get("/api/consultations/doctor")
    .set("Authorization", `Bearer ${doctorToken}`);

  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThan(0);
});

test("Patient should see their consultations", async () => {
  const res = await request(app)
    .get("/api/consultations/patient")
    .set("Authorization", `Bearer ${patientToken}`);

  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThan(0);
});
