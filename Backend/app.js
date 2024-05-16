// Imports the 'body-parser' module; middleware for parsing request bodies in middleware functions.
const bodyParser = require('body-parser');

const db = require("./dbConnection");

const { getMealsByUserId } = require('./mealController');

// Middleware to parse JSON bodies
app.use(express.json()); 


 // Serves the LoginPage.html using __dirname
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/About.html"));
});
// Serves the Contact.html using __dirname
app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/Contact.html"));
});
// Serves the CreateMealPage.html using __dirname
app.get("/createmealpage", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/CreateMealPage.html"));
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
// Serves the findPlaces.html using __dirname
app.get("/findplaces", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/findPlaces.html"));
});




  
    // Send the ViewMeals.html file along with the fetched data
    app.get("/ViewMeals", async (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend/ViewMeals.html"));
    });
    // Define route handler for fetching meals data
    app.get("/meals", async (req, res) => {
      try {
        // Fetch meals for the logged-in user
        const userId = req.session.user_id;
        const meals = await getMealsByUserId(userId);
        
        // Send the serialized meals as JSON response
        res.json(meals);
      } catch (error) {
        // Handle any errors
        console.error("Error fetching meal data:", error);
        res.status(500).send("Error fetching meal data");
      }
    });
    app.get("/edit", async (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend/editMeal.html"));
    });
  
    
// Express route handler for fetching meal details by ID
app.post('/fetch-meal-details', async (req, res) => {
  const mealId = req.body.mealId;
  try {
      // Query the database to fetch meal details by ID
      const mealDetails = await db.query('SELECT * FROM meal_table WHERE meal_id = ?', [mealId]);
      if (mealDetails.length === 0) {
          throw new Error('Meal not found');
      }
      // Send the meal details (including meal ID) to the client
      res.json(mealDetails[0]); // Assuming meal ID is unique and there's only one result
  } catch (error) {
      console.error('Error fetching meal details:', error);
      res.status(500).send('Error fetching meal details');
  }
});
app.delete('/delete-meal', async (req, res) => {
  const { mealId } = req.body;
  try {
      // Perform deletion in the database using the mealId
      await db.query('DELETE FROM meal_table WHERE meal_id = ?', [mealId]);
      // Send a success response
      res.status(200).send('Meal deleted successfully');
  } catch (error) {
      console.error('Error deleting meal:', error);
      res.status(500).send('Error deleting meal');
  }
});


// Defines a POST route at "/signUp" endpoint, which will call the async signUp function from userController.

app.post("/login", login);
// Define a POST route at"/addMeal" endpoint, which will call the async addMeal function from mealController.
app.post("/addMeal", mealController.addMeal);

// Authentication status route
app.get('/auth/status', (req, res) => {
  // Check if user is authenticated
  const isAuthenticated = req.session.user_id ? true : false;
  res.json({ isAuthenticated });
});



// Listens for incoming requests on port 3000 and logs a message when the server starts.
app.listen(3000, () => {
   console.log("Server is running on port 3000");
});
// Exports the Express application instance for testing purposes or make it accessible from other modules.
module.exports = app;