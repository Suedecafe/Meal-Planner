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
            console.log("Search Results")
            console.log(result.length)

            // If the search result is not empty, it means the username already exists.
            if (result.length != 0) {
                // Release the database connection.
                connection.release()
                // Log a message indicating that the username already exists.
                console.log("Username already exists")
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
                    console.log (" New User Created")
                    // Prints the ID of the newly inserted user.
                    console.log(result.insertId)
                    // Set the userId in the session
                    req.session.user_id = result.insertId;
            
                    res.redirect('/login');
                    
                })
            }
        }) //end of connection.query()
    }) //end of db.getConnection()
} //end of signUp function

// An asynchronous function called login, which takes two parameters: req (request) and res (response).
async function login(req, res) {
    // Extracting the username and password from the request body.
    const user_name = req.body.user_name;
    const password = req.body.password;

    // Establishing a database connection.
    db.getConnection(async (err, connection) => {
        // If an error occurs while establishing the connection, throw an error.
        if (err) throw (err);

        // Create an SQL query to search for a user with the specified username.
        const sqlSearch = "SELECT * FROM user_table WHERE user_name = ?";
        // Format the SQL query with the username.
        const search_query = mysql.format(sqlSearch, [user_name]);

        // Executes search query to find user with the specified username.
        await connection.query(search_query, async (err, result) => {
   
            // Releases the database connection.
            connection.release();

            // If an error occurs during the query execution, throw an error.
            if (err) throw (err);

            // If no user with the specified username is found, sends a 404 status code.
            if (result.length == 0) {
                console.log(" User not found");
                res.sendStatus(404);
            }
            // if a user with the specified username is found, proceed with password verification.
            else {
                // Retrieves hashed password from the database query result.
                const hashedPassword = result[0].password;
                // Compares the provided password with the hashed password retrieved from the database.
                if (await bcrypt.compare(password, hashedPassword)) {
                    const user = result[0]; // Extracts the user data from the result
                    const userId = user.user_id; // Extracts user ID from the user data
                    console.log("Retrieved User ID:", userId); // Logs the retrieved user ID

                    // Set the user ID in the session
                    req.session.user_id = userId;
                    console.log("Session User ID:", req.session.user_id); // Logs the user ID in the session to verify
                    // If the passwords match, sends a success message to show successful login.
                    console.log("Login Successful");
                    res.redirect('/dashboard');
                } 
                // If the passwords do not match, sends a message showing incorrect password.
                else {
                    console.log(" Password Incorrect");
                    res.send("Password incorrect!");
                } //end of bcrypt.compare()
            }//end of User exists i.e. results.length==0
        }); //end of connection.query()
    }); //end of db.getConnection()
} //end of login function



// Export the signUp function to make it accessible from other modules.
module.exports = { signUp, login };