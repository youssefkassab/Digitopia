const { MongoClient } = require("mongodb");
const { MONGO_URI, AI_DB_NAME, AI_COLLECTION_NAME } = require("../config/config");

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined");
}

const client = new MongoClient(MONGO_URI);
let dbInstances = {};

async function connectDB(DBName = AI_DB_NAME, collectionName = AI_COLLECTION_NAME) {
    const key = `${DBName}_${collectionName}`;
    if (!dbInstances[key]) {
        if (!client.topology?.isConnected()) {
            await client.connect();
            console.log("Connected to MongoDB");
    }
    const db = client.db(DBName);
    const collection = db.collection(collectionName);
    dbInstances[key] = { db, collection };
    console.log(`Connected to DB: ${DBName}, Collection: ${collectionName}`);
  }
  return dbInstances[key];
}

module.exports = { connectDB };
