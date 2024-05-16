// Imports the mysql package/module
const mysql = require("mysql")

// Creates a MySQL connection pool with database config info
const db = mysql.createPool({
   // The maximum number of connections allowed in the pool
   connectionLimit: 100,
   // The name of the host where the MySQL server is running
   host: "localhost",
   // The MySQL user account used to connect to the database
   user: "newuser",
   // The password for MySQL user account
   password: "password1#",
   // The name of the MySQL database to connect to
   database: "userdb",
   // The port number where the MySQL server is listening for connections
   port: "3306"
})

// Gets a connection from the connection pool
db.getConnection((err, connection) => {
   // If an error occurs while trying to get a connection, throw an error.
   if (err) throw (err)
   // Logs a message indicating successful connection and the connection's thread ID
   console.log("DB connected successful: " + connection.threadId)
})

// Exports the MySQL connection pool to make it accessible from other modules.
module.exports = db;