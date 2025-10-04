import axios from "axios";

// Easy switching between localhost and production
// Change this to switch between environments:
// const USE_PRODUCTION = false; // localhost
// const USE_PRODUCTION = true;  // hemex.ai

const USE_PRODUCTION = false; // Set to true for hemex.ai, false for localhost

const SEARCH_BASE_URL = USE_PRODUCTION
  ? "https://hemex.ai:3001"
  : "http://localhost:3001"; // backend base URL (no /api prefix)

console.log(`🔗 Search Service Mode: ${USE_PRODUCTION ? 'PRODUCTION (hemex.ai)' : 'DEVELOPMENT (localhost)'}`);

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
