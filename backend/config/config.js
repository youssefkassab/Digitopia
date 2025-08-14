const env = require('dotenv');
env.config();

const API_KEY = process.env.API_KEY;
const JWT_SECRET = process.env.JWT_SECRET;
module.exports = {
  API_KEY,
  JWT_SECRET
};
