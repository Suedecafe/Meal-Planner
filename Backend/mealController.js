const db = require("./dbConnection");
const app = require('./app');
const mysql = require("mysql")


// Function to add a new meal
async function addMeal(req, res) {
    // Extract meal data from the request body
    const { mealName, mealType, ingredients, caloriesRange } = req.body;
    // Retrieves user ID from session
    const userId = req.session.user_id;
    console.log("User ID:", userId); // Log the user ID to verify
    // Check if userId is available
    if (!userId) {
        console.error("User ID not found in session");
        res.status(500).send("Error adding meal: User ID not found in session");
        return;
    }
    // Gets a connection from the database pool
    db.getConnection(async (err, connection) => {
        if (err) {
            console.error("Error getting database connection:", err);
            res.status(500).send("Error adding meal");
            return;
        }

        // Defines an SQL query to insert a new meal
        const sqlInsertMeal = "INSERT INTO meal_table (meal_name, meal_type, ingredients, calories, user_id) VALUES (?, ?, ?, ?, ?)";
        // Formats the SQL query with meal data and user ID
        const insertMealQuery = mysql.format(sqlInsertMeal, [mealName, mealType, ingredients, caloriesRange, userId]);

        // Executes the SQL query to insert the meal into the database
        connection.query(insertMealQuery, (err, result) => {
            // Releases the database connection
            connection.release();
            if (err) {
                console.error("Error inserting meal:", err);
                res.status(500).send("Error adding meal");
            } else {
                console.log("New meal added successfully");
                
                res.redirect("/ViewMeals"); // Redirect to view page
            }
        });
    });
}
// Function to fetch meals by user ID from the database
async function getMealsByUserId(userId) {
    // Log the userId parameter to verify it's being passed correctly
    console.log('User ID:', userId);


    try {
        // Construct SQL query to select meals by user ID
        const sqlQuery = "SELECT meal_id, meal_name, meal_type, ingredients, calories FROM meal_table WHERE user_id = ?";
        
        // Execute SQL query with user ID parameter
        const result = await new Promise((resolve, reject) => {
            db.query(sqlQuery, [userId], (err, result) => {
                if (err) {
                    reject(err); // Reject promise if there's an error
                } else {
                    resolve(result); // Resolve promise with query result
                }
            });
        });

        // Log the query result to inspect its structure
        console.log('Query Result:', result);
        
        // Extract meals from the result object
        const meals = result || [];

        // Log the extracted meals to verify their content
        console.log('Extracted Meals:', meals);
        
        // Return meals
        return meals;
    } catch (error) {
        // Handle any errors (e.g., database connection error)
        console.error("Error fetching meals by user ID:", error);
        throw error; // Propagate the error to the caller
    }
}
module.exports = { addMeal,getMealsByUserId };