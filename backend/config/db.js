const env = require('dotenv').config();
const mysql = require('mysql');
const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME|| "digitopia",
    port: process.env.DB_PORT
});

db.getConnection((err)=>{
    if(err) throw err;
    console.log("Connected!");
})

module.exports = db;
