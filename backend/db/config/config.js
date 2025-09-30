const config = require('../../config/config');

module.exports = {
  "development": {
    "username": config.DB_USER || "root",
    "password": config.DB_PASSWORD || "",
    "database": config.DB_NAME || "digitopia",
    "host": config.DB_HOST || "localhost",
    "dialect": "mysql",
    "timezone": "+02:00",
    "dialectOptions": {
      "charset": "utf8mb4"
    },
    "define": {
      "charset": "utf8mb4",
      "collate": "utf8mb4_unicode_ci"
    }
  },
  "test": {
    "username": config.DB_USER || "root",
    "password": config.DB_PASSWORD || "",
    "database": config.DB_NAME || "digitopia",
    "host": config.DB_HOST || "localhost",
    "dialect": "mysql",
    "timezone": "+02:00",
    "dialectOptions": {
      "charset": "utf8mb4"
    },
    "define": {
      "charset": "utf8mb4",
      "collate": "utf8mb4_unicode_ci"
    }
  },
  "production": {
    "username": config.DB_USER || "root",
    "password": config.DB_PASSWORD || "",
    "database": config.DB_NAME || "digitopia",
    "host": config.DB_HOST || "localhost",
    "dialect": "mysql",
    "timezone": "+02:00",
    "dialectOptions": {
      "charset": "utf8mb4"
    },
    "define": {
      "charset": "utf8mb4",
      "collate": "utf8mb4_unicode_ci"
    }
  }
}