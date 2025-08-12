const env = require('dotenv');
env.config();

const API_KEY = process.env.API_KEY;

module.exports = {
  API_KEY
};
