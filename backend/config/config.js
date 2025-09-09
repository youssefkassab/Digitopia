// Environment variables are loaded in app.js
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'digitopia';

module.exports = {
  JWT_SECRET,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
};
