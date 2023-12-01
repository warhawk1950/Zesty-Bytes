// DOM Elements and Global Variables
const apiKey = '1b4033d0fab74f9baa5f8b0d1950e612';
const searchInput = document.querySelector('input'); // Gets the user input from the search field
const searchForm = document.getElementById('searchForm'); // Gets the form element
const resultsContainer = document.getElementById('foodContent'); // Gets the container to display the recipe divs

// Function to only run once the document is fully loaded and ready
document.addEventListener('DOMContentLoaded', function () {

    // Event listener for the form button click
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevents the form from submitting
        searchRecipes();
    })

    // Function to actually run searched Recipes 
    function searchRecipes() {
        const selectedIngr = Array.from(document.querySelectorAll('input[type=checkbox]:checked')).map(checkbox => checkbox.value); // Array of selected ingredients from checkboxes
        const searchTerm = searchInput.value.trim(); // Trim search recipe name

        // Make sure that results only pull if something is checked or typed
        if (selectedIngr.length > 0 || searchTerm !== '') {
            // Spoonacular API URL Request to search recipe name with Appetizer & only 6 result parameters
            const apiUrl = `https://api.spoonacular.com/recipes/search?apiKey=${apiKey}&query=${searchTerm}&type=appetizer&number=6`;

            if (selectedIngr.length > 0) {
                const ingredientsQuery = selectedIngr.map(ingredient => `&includeIngredients=${ingredient}`).join(''); // Query for selected checkboxes

                // Fetch API data along with checkboxes & query parameters
                fetch(apiUrl + ingredientsQuery)
                    .then(response => response.json())
                    .then(data => {

                        // Clear any existing results
                        resultsContainer.innerHTML = '';

                        // Display each recipe title in a separate div as 6 different divs
                        data.results.forEach(result => {
                            const recipeElement = document.createElement('div');
                            recipeElement.classList.add('box');
                            recipeElement.textContent = result.title;
                            resultsContainer.appendChild(recipeElement);
                        });
                    });
            } else {
                
                // Fetch API data without the checkboxes 
                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        // Clear any existing results
                        resultsContainer.innerHTML = '';

                        // Display each recipe title in a separate div as 6 different divs
                        data.results.forEach(result => {
                            const recipeElement = document.createElement('div');
                            recipeElement.classList.add('box');
                            recipeElement.textContent = result.title;
                            resultsContainer.appendChild(recipeElement);
                        });
                    });
            }
        } else {
            // If no checkboxes are checked and the search is empty, clear results container 
            resultsContainer.innerHTML = '';
        }
    }
});