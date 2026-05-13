import api from "./api";

export const submitReview = async (reviewData) => {
  try {
    const response = await api.post("/reviews", reviewData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to submit review");
  }
};

export const getReviewByConsultationId = async (consultationId) => {
  try {
    const response = await api.get(`/reviews/consultation/${consultationId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch review");
  }
};
