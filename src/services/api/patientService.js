import api from "./api";

export const getPatients = async () => {
  try {
    const response = await api.get("/patients"); // backend route
    return response.data;
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }
};

// --------------------
// PATIENT PROFILE
// --------------------
export const fetchPatientProfile = async () => {
  const res = await api.get("/patients/profile");
  return res.data;
};
