module.exports = {
  "development": {
    "username": process.env.DB_USER || "root",
    "password": process.env.DB_PASSWORD || "",
    "database": process.env.DB_NAME || "digitopia",
    "host": process.env.DB_HOST || "localhost",
    "dialect": process.env.DB_DIALECT || "mysql",
    "timezone": "+02:00"
  },
  "test": {
    "username": process.env.DB_USER || "root",
    "password": process.env.DB_PASSWORD || "",
    "database": process.env.DB_NAME || "digitopia",
    "host": process.env.DB_HOST || "localhost",
    "dialect": process.env.DB_DIALECT || "mysql",
    "timezone": "+02:00"
  },
  "production": {
   "username": process.env.DB_USER || "root",
    "password": process.env.DB_PASSWORD || "",
    "database": process.env.DB_NAME || "digitopia",
    "host": process.env.DB_HOST || "localhost",
    "dialect": process.env.DB_DIALECT || "mysql",
    "timezone": "+02:00"
  }
}
