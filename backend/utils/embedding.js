const { GoogleGenAI } = require("@google/genai");
const { GOOGLE_API_KEY } = require("../config/config");

const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

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