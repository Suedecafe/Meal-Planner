const express = require("express")
const app = express()
const mysql = require("mysql")
const db = mysql.createPool({
   connectionLimit: 100,
   host: "localhost",       //This is the localhost 
   user: "newuser",         // "newuser" account for users account in MySQL
   password: "password1#",  // password for the new user(s)
   database: "userdb",      // Database name
   port: "3306"             // port number, "3306" 
})
db.getConnection( (err, connection)=> {
   if (err) throw (err)
   console.log ("DB connected successful: " + connection.threadId)
})