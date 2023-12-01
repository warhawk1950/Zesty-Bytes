// DOM Elements and Global Variables
const apiKey = 'd21c891cc7d24269b62de05633d46e54';
const searchInput = document.querySelector('input'); // Gets the user input from the search field
const resultsContainer = document.getElementById('foodContent'); // Gets the container to display the recipe divs

// Function to only run once the document is fully loaded and ready
document.addEventListener('DOMContentLoaded', function () {

    // Event listener for ingredient checkboxes AND search bar typed input
    searchInput.addEventListener('input', searchRecipes);
    document.querySelectorAll('input[type=checkbox]').forEach(checkbox => {
        checkbox.addEventListener('change', searchRecipes);
    });

    // Function to actually run searched Recipes 
    function searchRecipes() {

        const searchTerm = searchInput.value.trim(); // Trim search recipe name
        const selectedIngr = Array.from(document.querySelectorAll('input[type=checkbox]:checked')).map(checkbox => checkbox.value); // Array of selected ingredients from checkboxes

        // Make sure that results only pull if something is typed
        if (searchTerm !== '') {

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

                        // Diplay each recipe title in a seperate div as 6 different divs
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

                        // Display each recipe title in a seperate div as 6 different divs
                        data.results.forEach(result => {
                            const recipeElement = document.createElement('div');
                            recipeElement.classList.add('box');
                            recipeElement.textContent = result.title;
                            resultsContainer.appendChild(recipeElement);
                        });
                    });
            }
        } else {

            // If search is empty, clear results container 
            resultsContainer.innerHTML = '';
        }
    }
});