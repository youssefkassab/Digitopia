const { connectDB } = require("../utils/db");
const { AI_DB_NAME, AI_COLLECTION_NAME } = require("../config/config");
const logger = require("../utils/logger");

async function uploadJsonData(grade, subject, term, fileData, replace = false) {
  try {
    const { collection } = await connectDB(AI_DB_NAME, AI_COLLECTION_NAME);

    if (replace) {
      await collection.deleteMany({ subject, grade, term });
      logger.info(`Removed old docs for subject: ${subject}, grade: ${grade}, term: ${term}`);
    }

    const jsonData = JSON.parse(fileData);
    const docs = Array.isArray(jsonData) ? jsonData : [jsonData];

    const docsWithMeta = docs.map((doc) => ({
      grade,
      subject,
      term,
      ...doc,
    }));

    if (docsWithMeta.length > 0) {
      await collection.insertMany(docsWithMeta);
      logger.info(
        `Inserted ${docsWithMeta.length} docs for subject: ${subject}, grade: ${grade}, term: ${term}`
      );
    } else {
      logger.info("No documents to insert");
    }
  } catch (err) {
    logger.error("Error uploading JSON data:", { error: err.message, stack: err.stack });
    throw err;
  }
}

module.exports = { uploadJsonData };
