// Imports required modules for hashing passwords, connecting & interacting with the database, and accessing the application.
const bcrypt = require("bcrypt");
const db = require("./dbConnection");
const app = require('./app');
const mysql = require("mysql")

// Defines an asynchronous function called signUp, which takes two parameters: req (request) and res (response).
async function signUp(req, res) {
    // Extracts user info from the request body (such as their username, password, email, first name, and last name).
    const user_name = req.body.user_name;
    const password = await bcrypt.hash(req.body.password,10); // Hash the user's password for security.
    const email = req.body.email; 
    const first_name = req.body.first_name; 
    const last_name = req.body.last_name; 

    // Gets a connection from the database pool.
    db.getConnection( async (err, connection) => {
        // If an error occurs while getting the connection, throw an error.
        if (err) throw (err)

        // Defines an SQL query to search for a user with the same username in the user_table.
        const sqlSearch = "SELECT * FROM user_table WHERE user_name = ?"
        const search_query = mysql.format(sqlSearch,[user_name])

        // Defines a SQL query to insert a new user into the user_table.
        const sqlInsert = "INSERT INTO user_table VALUES (0,?,?,?,?,?)"
        const insert_query = mysql.format(sqlInsert,[user_name, password, email, first_name, last_name])

        // Executes a search query to check if the user already exists in the database.
        await connection.query (search_query, async (err, result) => {
            // If an error occurs during the search query, throw an error.
            if (err) throw (err)

            // Print the number of search results (should be either 0 or 1).
            console.log("------> Search Results")
            console.log(result.length)

            // If the search result is not empty, it means the username already exists.
            if (result.length != 0) {
                // Release the database connection.
                connection.release()
                // Log a message indicating that the username already exists.
                console.log("------> Username already exists")
                // Sends a status code of 409 (Conflict) to indicate that the user can't be created.
                res.sendStatus(409) 
            } 
            // If the search result is empty, it means the username does not exist, so proceed to insert the new user.
            else {
                // Execute an insert query to add the new user to the database.
                await connection.query (insert_query, (err, result)=> {
                    // Release the database connection.
                    connection.release()
                    // If an error occurs during the insert query, throws an error.
                    if (err) throw (err)
                    // Logs a message indicating that a new user has been created.
                    console.log ("--------> New User Created")
                    // Prints the ID of the newly inserted user.
                    console.log(result.insertId)
                    // Sends a status code of 201 (Created) to indicate that the user has been successfully created.
                    res.sendStatus(201)
                })
            }
        }) //end of connection.query()
    }) //end of db.getConnection()
} //end of signUp function

// Export the signUp function to make it accessible from other modules.
module.exports = signUp;