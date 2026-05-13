import api from "./api";

export const createConsultation = async (doctorId, type = "heart") => {
  try {
    const response = await api.post("/consultations", { doctorId, type });
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message || "Failed to create consultation";
    throw new Error(msg);
  }
};

export const addRecordingPoint = async (consultationId, pointData) => {
  try {
    const response = await api.post(`/consultations/${consultationId}/points`, pointData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add recording point");
  }
};

export const completeConsultation = async (consultationId, notes = "") => {
  try {
    const response = await api.post(`/consultations/${consultationId}/complete`, { notes });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to complete consultation");
  }
};

export const getConsultationDetails = async (consultationId) => {
  try {
    const response = await api.get(`/consultations/${consultationId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch consultation details");
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