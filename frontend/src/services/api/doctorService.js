import api from "./api";

export const getDoctors = async () => {
  try {
    const response = await api.get("/doctors"); // backend route
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};
// --------------------
// DOCTOR PROFILE
// --------------------
export const fetchDoctorProfile = async () => {
  const res = await api.get("/doctors/profile");
  return res.data;
};
