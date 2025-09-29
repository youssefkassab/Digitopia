import axios from "axios";

const SEARCH_BASE_URL = "http://localhost:3000"; // backend base URL (no /api prefix)

/**
 * Sends a search query to the backend search route.
 * @param {Object} payload - The search parameters.
 * @param {string} payload.question - The search question or keyword.
 * @param {string} payload.grade - The grade level (e.g., "6").
 * @param {string} payload.subject - The subject name (e.g., "Science").
 * @param {boolean} [payload.cumulative=false] - Whether to use cumulative search.
 * @param {string} [token] - Optional JWT token for authentication.
 */
export const searchQuery = async (payload, token) => {
  try {
    const response = await axios.post(`${SEARCH_BASE_URL}/search`, payload, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Search Service Error:", error);
    throw error.response?.data || error;
  }
};
