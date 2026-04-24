const { connectDB } = require("../utils/db");
const { AI_DB_NAME, AI_COLLECTION_NAME } = require("../config/config");
const logger = require("../utils/logger");

async function generateStructure(replace = false) {
  try {
    const { db, collection } = await connectDB(AI_DB_NAME, AI_COLLECTION_NAME);

    if (replace) {
      await db.dropDatabase().catch(() => {});
      logger.info(`Dropped database: ${AI_DB_NAME}`);
    }

    const collections = await db.listCollections({ name: AI_COLLECTION_NAME }).toArray();
    if (collections.length === 0) {
      await db.createCollection(AI_COLLECTION_NAME);
      logger.info(`Created collection: ${AI_COLLECTION_NAME}`);
    } else {
      logger.info(`Collection already exists: ${AI_COLLECTION_NAME}`);
    }

    logger.info(`Single collection structure generated successfully in ${AI_DB_NAME}`);
  } catch (err) {
    logger.error("Error generating structure:", { error: err.message, stack: err.stack });
  }
}

module.exports = { generateStructure };
