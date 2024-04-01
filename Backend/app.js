 // Imports the Express framework module.
const express = require("express");
// Creates an Express application instance.
const app = express();
// Imports the signUp function from the userController module.
const signUp = require("./userController");
// Middleware to parse JSON bodies
app.use(express.json()); 

// Defines a POST route at "/signUp" endpoint, which will call the signUp function from userController.
app.post("/signUp", signUp);

// Listens for incoming requests on port 3000 and logs a message when the server starts.
app.listen(3000, () => {
   console.log("Server is running on port 3000");
});
// Exports the Express application instance for testing purposes or make it accessible from other modules.
module.exports = app;