const mysql = require('mysql');

const db=mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"digitopia"
})

db.getConnection((err)=>{
    if(err) throw err;
    console.log("Connected!");
})

module.exports = db;
