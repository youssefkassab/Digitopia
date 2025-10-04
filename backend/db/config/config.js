'use strict';

// CRITICAL FIX: This loads environment variables from your .env file 
// directly into the process.env object, making them accessible to the CLI.
require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DB_USER ,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST || "localhost",
    "dialect": "mysql", // Essential property that must be defined
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
    "username": process.env.DB_USER ,
    "password": process.env.DB_PASSWORD ,
    "database": process.env.DB_NAME ,
    "host": process.env.DB_HOST || "localhost",
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
    "username": process.env.DB_USER || process.env.DB_USER ,
    "password": process.env.DB_PASSWORD || process.env.DB_PASSWORD,
    "database": process.env.DB_NAME ,
    "host": process.env.DB_HOST || "localhost",
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
};
