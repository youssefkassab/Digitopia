const config = require('../../config/config');
module.exports = {
  "development": {
    "username": config.DB_USER || "root",
    "password": config.DB_PASSWORD || "",
    "database": config.DB_NAME || "digitopia",
    "host": config.DB_HOST || "localhost",
    "dialect": "mysql",
    "timezone": "+02:00"
  },
  "test": {
    "username": config.DB_USER || "root",
    "password": config.DB_PASSWORD || "",
    "database": config.DB_NAME || "digitopia",
    "host": config.DB_HOST || "localhost",
    "dialect": "mysql",
    "timezone": "+02:00"
  },
  "production": {
   "username": config.DB_USER || "root",
    "password": config.DB_PASSWORD || "",
    "database": config.DB_NAME || "digitopia",
    "host": config.DB_HOST || "localhost",
    "dialect": "mysql",
    "timezone": "+02:00"
  }
}
