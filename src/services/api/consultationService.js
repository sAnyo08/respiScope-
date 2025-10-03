import axios from "axios";

  const refreshToken = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/refresh/patient",
        {},
        { withCredentials: true }
      );
      const { accessToken } = response.data;
      localStorage.setItem("token", accessToken);
      console.log("Token refreshed successfully");
      return accessToken;
    } catch (error) {
      console.error("Token refresh error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error("Failed to refresh token: " + (error.response?.data?.message || error.message));
    }
  };

  export const createConsultation = async (doctorId) => {
    try {
      let token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }
      const response = await axios.post(
        "http://localhost:5000/api/consultations",
        { doctorId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Consultation created:", response.data);
      return response.data;
    } catch (error) {
      console.error("Consultation creation error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (error.response?.status === 401) {
        try {
          const newToken = await refreshToken();
          const response = await axios.post(
            "http://localhost:5000/api/consultations",
            { doctorId },
            {
              headers: {
                Authorization: `Bearer ${newToken}`,
              },
            }
          );
          console.log("Consultation created after refresh:", response.data);
          return response.data;
        } catch (refreshError) {
          throw new Error("Authentication failed: Unable to refresh token");
        }
      } else if (error.response?.status === 403) {
        throw new Error("Access denied: Invalid token");
      } else if (error.code === "ERR_INTERNET_DISCONNECTED" || error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to reach the server. Please check your connection.");
      }
      throw new Error(error.response?.data?.message || "Failed to create/fetch consultation");
    }
  };