//Function that links to CreateMealPage.html
function navigateToCreate() {
    
    window.location.href = '/createmealpage';
    console.log('is working');
}
// Retrieves a reference to the input element with id caloriesRange
const caloriesRange = document.getElementById("caloriesRange");
// Retrieves a reference to the element with id caloriesValue
const caloriesValue = document.getElementById("caloriesValue");

// Adds event listener to caloriesRange input element
caloriesRange.addEventListener("input", function() {
  // Retrieves current value of caloriesRange input element
  const calories = caloriesRange.value;
 // Updates text content of caloriesValue element to display the selected calorie value
  // Concats selected calorie value with the string "calories"
  caloriesValue.textContent = calories +  " calories";
});