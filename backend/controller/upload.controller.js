const { connectDB } = require("../utils/db");
const { AI_DB_NAME, AI_COLLECTION_NAME } = require("../config/config");

async function uploadJsonData(grade, subject, term, fileData, replace = false) {
  try {
    const { collection } = await connectDB(AI_DB_NAME, AI_COLLECTION_NAME);

    if (replace) {
      await collection.deleteMany({ subject, grade, term });
      console.log(`Removed old docs for subject: ${subject}, grade: ${grade}, term: ${term}`);
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
      console.log(
        `Inserted ${docsWithMeta.length} docs for subject: ${subject}, grade: ${grade}, term: ${term}`
      );
    } else {
      console.log("No documents to insert");
    }
  } catch (err) {
    console.error("Error uploading JSON data:", err.message);
    throw err;
  }
}

module.exports = { uploadJsonData };
