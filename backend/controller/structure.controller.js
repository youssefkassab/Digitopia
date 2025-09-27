const { connectDB } = require("../utils/db");
const { AI_DB_NAME, AI_COLLECTION_NAME } = require("../config/config");

/**
 * Ensure the configured AI database contains the specified collection, optionally replacing the database first.
 * @param {boolean} replace - If `true`, drop the existing database before ensuring the collection exists; defaults to `false`.
 */
async function generateStructure(replace = false) {
  try {
    const { db, collection } = await connectDB(AI_DB_NAME, AI_COLLECTION_NAME);

    if (replace) {
      await db.dropDatabase().catch(() => {});
      console.log(`Dropped database: ${AI_DB_NAME}`);
    }

    const collections = await db.listCollections({ name: AI_COLLECTION_NAME }).toArray();
    if (collections.length === 0) {
      await db.createCollection(AI_COLLECTION_NAME);
      console.log(`Created collection: ${AI_COLLECTION_NAME}`);
    } else {
      console.log(`Collection already exists: ${AI_COLLECTION_NAME}`);
    }

    console.log(`Single collection structure generated successfully in ${AI_DB_NAME}`);
  } catch (err) {
    console.error("Error generating structure:", err.message);
  }
}

module.exports = { generateStructure };
