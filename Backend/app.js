 // Imports the Express framework module.
const express = require("express");
// Import the express-session library
const session = require("express-session");
// Creates an Express application instance.
const app = express();
// Imports the signUp and login functions from the userController module.
const { signUp, login } = require("./userController");
// Imports the 'path' module, which provides utilities for dealing with file and directory paths.
const path = require('path');
// Imports the 'body-parser' module; middleware for parsing request bodies in middleware functions.
const bodyParser = require('body-parser');


// Middleware to parse JSON bodies
app.use(express.json()); 
// Middleware to parse JSON bodies
app.use(bodyParser.json());
// Parses URL-encoded bodies (for form data)
app.use(bodyParser.urlencoded({ extended: true }));


// Configures session middleware
app.use(session({
  secret: "delta-sigma-cronus", 
  resave: false,// Whether to save sessions that have not been modified
  saveUninitialized: true // Whether to save new sessions
}));
// Serve the SignUpPage.html using __dirname
app.get("/signUp", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/SignUpPage.html"));
});
// Serves the styles.css using --dirname
app.get("/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/styles.css"));
});
// Serves the LoginPage.html using __dirname
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/LoginPage.html"));
});

// Serves the About.html using __dirname
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/About.html"));
});
// Serves the CreateMealPage.html using __dirname
app.get("/createmealpage", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/CreateMealPage.html"));
});
app.get("/scripts", (req, res) => {
  res.sendFile(path.join(__dirname, "../Backend/scripts.js"));
});
// Serves the index.html using __dirname
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/Dashboard.html"));
});
// Serves the logout route 
app.get("/logout", (req, res) => {
  // upon clicking logout, if action is successful will destroy session and log user out
  // or will throw an error 
  req.session.destroy((err) => {
      if (err) {
          console.error("Error destroying session:", err);
      } else {
          console.log("User logged out successfully");
      }
      // Redirect the user to the login page or any other desired page
      res.redirect("/login");
  });
});






// Defines a POST route at "/signUp" endpoint, which will call the async signUp function from userController.
app.post("/signUp", signUp);

// Define a POST route at"/login" endpoint, which will call the async login function from userController.
app.post("/login", login);



// Listens for incoming requests on port 3000 and logs a message when the server starts.
app.listen(3000, () => {
   console.log("Server is running on port 3000");
});
// Exports the Express application instance for testing purposes or make it accessible from other modules.
module.exports = app;