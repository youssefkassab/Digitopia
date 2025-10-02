require('dotenv').config();
// Environment variables are loaded in app.js
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not set in .env file');
  process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET ;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'digitopia';
const DB_PORT = process.env.DB_PORT || 3306;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const MONGO_URI = process.env.MONGO_URI;
const AI_DB_NAME = process.env.AI_DB_NAME;
const AI_COLLECTION_NAME = process.env.AI_COLLECTION_NAME;
const REPLACE_AI_DB = process.env.REPLACE_AI_DB === 'true' || false;

module.exports = {
  JWT_SECRET,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
  CORS_ORIGIN,
  NODE_ENV,
  PORT,
  GOOGLE_API_KEY,
  MONGO_URI,
  AI_DB_NAME,
  AI_COLLECTION_NAME,
  REPLACE_AI_DB
};
