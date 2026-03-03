import api from "./api";

export const createConsultation = async (doctorId) => {
  try {
    const response = await api.post("/consultations", { doctorId });
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message || "Failed to create consultation";
    throw new Error(msg);
  }
};

export const getPatientConsultations = async () => {
  try {
    const res = await api.get("/consultations/patient");
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch consultations");
  }
};

export const getDoctorConsultations = async () => {
  try {
    const res = await api.get("/consultations/doctor");
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch doctor consultations");
  }
};

export const getConsultationsMessages = async (consultationId) => {
  try {
    const res = await api.get(`/messages/consultation/${consultationId}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch consultation messages");
  }
};

export const getAllConsultationsMessages = async () => {
  try {
    const response = await api.get("/consultations");
    return response.data;
  } catch (error) {
    console.error("Error fetching consultations", error);
    throw error;
  }
};