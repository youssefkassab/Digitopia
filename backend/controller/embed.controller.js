const { connectDB } = require("../utils/db");
const { AI_DB_NAME, AI_COLLECTION_NAME } = require("../config/config");
const { generateEmbedding } = require("../utils/embedding");

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
