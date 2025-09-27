const { GoogleGenAI } = require("@google/genai");
const { GOOGLE_API_KEY } = require("../config/config");

const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

/**
 * Generate a numeric embedding vector for the provided text using the Gemini embedding model.
 * @param {string} text - Input text to embed.
 * @returns {number[]} An array of numbers representing the first embedding vector (3072 dimensions); returns an empty array on failure.
 */
async function generateEmbedding(text) {
  try {
    const result = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: [{ parts: [{ text }] }],
      config: { outputDimensionality: 3072 }, // adjust if needed
    });
    
    return result.embeddings [0].values;
  } catch (err) {
    console.error("Error generating embedding:", err.message);
    return [];
  }
}

module.exports = { generateEmbedding, ai };