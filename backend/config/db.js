const config = require('../config/config');
const mysql = require('mysql');
const db = mysql.createPool({
    host: config.DB_HOST || "localhost",
    user: config.DB_USER || "root",
    password: config.DB_PASSWORD || "",
    database: config.DB_NAME || "digitopia",
    port: config.DB_PORT ,
});

db.getConnection((err)=>{
    if(err) throw err;
    console.log("Connected!");
})

module.exports = db;
