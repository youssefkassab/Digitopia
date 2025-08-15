// Environment variables are loaded in app.js
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is using default value. Please set it in .env file for production.');
}

module.exports = {
  JWT_SECRET
};
