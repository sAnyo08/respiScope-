import axios from "axios";
import api from "./api";

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const refreshToken = async () => {
    try {
      const response = await axios.post(
        `${API_BASE}/auth/refresh/patient`,
        {},
        { withCredentials: true }
      );
      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      console.log("Token refreshed successfully");
      return accessToken;
    } catch (error) {
      console.error("Token refresh error:", error);
      throw new Error("Failed to refresh token: " + (error.response?.data?.message || error.message));
    }
  };

  export const createConsultation = async (doctorId) => {
    // try {
    //   let token = localStorage.getItem("accessToken");
    //   if (!token) {
    //     throw new Error("No authentication token found. Please log in again.");
    //   }
    //   const response = await axios.post(
    //    `${API_BASE}/consultations`,
    //     { doctorId },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    //   console.log("Consultation created:", response.data);
    //   return response.data;
    // } catch (error) {
    //   console.error("Consultation creation error:", error);
    //   if (error.response?.status === 401) {
    //     try {
    //       const newToken = await refreshToken();
    //       const response = await axios.post(
    //         `${API_BASE}/consultations`,
    //         { doctorId },
    //         {
    //           headers: {
    //             Authorization: `Bearer ${newToken}`,
    //           },
    //         }
    //       );
    //       console.log("Consultation created after refresh:", response.data);
    //       return response.data;
    //     } catch (refreshError) {
    //       throw new Error("Authentication failed: Unable to refresh token");
    //     }
    //   } else if (error.response?.status === 403) {
    //     throw new Error("Access denied: Invalid token");
    //   } else if (error.code === "ERR_INTERNET_DISCONNECTED" || error.code === "ERR_NETWORK") {
    //     throw new Error("Network error: Unable to reach the server. Please check your connection.");
    //   }
    //   throw new Error(error.response?.data?.message || "Failed to create/fetch consultation");
    // }
    try {
      const token = localStorage.getItem("accessToken");
  
      if (!token) {
        throw new Error("Not authenticated. Please login again.");
      }
  
      const response = await axios.post(
        `${API_BASE}/consultations`,
        { doctorId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      return response.data;
    } catch (error) {
      // 🔥 Surface backend message clearly
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to create consultation";
  
      throw new Error(msg);
    }
  };

  export const getPatientConsultations = async () => {
    const token = localStorage.getItem("accessToken");
  
    const res = await fetch(
      "http://localhost:5000/api/consultations/patient",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    if (!res.ok) throw new Error("Failed to fetch consultations");
    return res.json();
  };

  export const getDoctorConsultations = async () => {
    const token = localStorage.getItem("accessToken");
  
    const res = await fetch(
      "http://localhost:5000/api/consultations/doctor",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    if (!res.ok) throw new Error("Failed to fetch doctor consultations");
    return res.json();
  };
  
  export const getConsultationsMessages = async (consultationId) => {
    
    const token = localStorage.getItem("accessToken");
  
      const res = await fetch(
        `http://localhost:5000/message/consultation/${consultationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    if (!res.ok) throw new Error("Failed to fetch consultation messages");
    return res.json();
  }
  

  export const getAllConsultationsMessages = async () => {
    try {
      const response = await api.get("/consultations"); // backend route
      console.log(response.data);
      return response.data;
      
    } catch (error) {
      console.error("Error fetching consultation", error);
      throw error;
    }
  }