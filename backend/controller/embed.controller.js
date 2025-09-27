const { connectDB } = require("../utils/db");
const { AI_DB_NAME, AI_COLLECTION_NAME } = require("../config/config");
const { generateEmbedding } = require("../utils/embedding");

/**
 * Generate embeddings for documents that have chunks but no embedding and store them on each document.
 *
 * Iterates documents in the configured collection, generates embeddings from `doc.chunks`, updates documents that receive embeddings, and responds with JSON summarizing how many documents were updated and how many remain without embeddings.
 * @param {import('express').Request} req - Express request object (not used).
 * @param {import('express').Response} res - Express response used to send the JSON result.
 */
async function addEmbeddings(req, res) {
  try {
    const { collection } = await connectDB(AI_DB_NAME, AI_COLLECTION_NAME);

    // Fetch docs missing embeddings
    const docs = await collection
      .find({ chunks: { $exists: true }, embedding: { $exists: false } })
      .toArray();

    let updatedCount = 0;

    for (const doc of docs) {
      try {
        const chunkEmbedding = await generateEmbedding(doc.chunks);

        if (chunkEmbedding.length > 0) {
          await collection.updateOne(
            { _id: doc._id },
            { $set: { embedding: chunkEmbedding } }
          );
          updatedCount++;
        }
      } catch (err) {
        console.error(`Failed embedding for doc ${doc._id}:`, err.message);
      }
    }

    const remaining = await collection.countDocuments({
      chunks: { $exists: true },
      embedding: { $exists: false },
    });

    res.json({
      success: true,
      updated: updatedCount,
      remaining,
    });
  } catch (err) {
    console.error("Error in addEmbeddings:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { addEmbeddings };
