// DOM Elements and Global Variables
const apiKey = '9a3fd546fabc4c89b132821f2d49569b';

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

       // Gathers selected ingredients and terms
        const selectedIngr = Array.from(document.querySelectorAll('input[type=checkbox]:checked')).map(checkbox => checkbox.value); // Array of selected ingredients from checkboxes
        const searchTerm = searchInput.value.trim(); // Trim search recipe name
       // Saves the search entries and checked boxes into the local storage
        const savedEntries = JSON.parse(localStorage.getItem('SavedEntries')) || []
        // Creates a new entry object for the search
        const newEntry = {
            searchTerm,
            Ingredients: selectedIngr
        };
        // Adds a new entry into the array
        savedEntries.push(newEntry);
        // Saves array into local storage
        localStorage.setItem('SavedEntries', JSON.stringify(savedEntries));
        
        // Nested function to display searches
        function displaySearchedEntries() {
            // Retrieves saved entries from local storage
            const savedEntries = JSON.parse(localStorage.getItem('SavedEntries')) || [];
            // Retrives the id where the entries will be saved
            const savedEntriesDiv = document.getElementById('savedEntriesDiv');
            // Clears existing content
            savedEntriesDiv.innerHTML = ''; 
            
            // Loops through each saved entry to use
            savedEntries.forEach(entry => {
                // Actually creates the div
                const div = document.createElement('div');
                div.classList.add('searched-entry');
                // Creates a <p> element for displaying search terms
                const searchPara = document.createElement('p');
                // Creates the anchor element to link to something else
                const link = document.createElement('a')

                searchPara.textContent = `${entry.searchTerm}`;

                // Standard event listener but changes the font color with CSS but
                // It goes back to normal if clicked again, not sure how to fix that yet
                searchPara.addEventListener('click', function(event){
                    event.preventDefault();
                    searchPara.classList.toggle('clicked')

                    const modal = document.getElementById('myModal');
                    modal.style.display = modal.style.display === 'block' ? 'block' : 'block';
                    
                    // What the entry does when it is clicked will go here
                    // What the entry does when it is clicked will go here
                    // What the entry does when it is clicked will go here

                    console.log(`Clicked on ${entry.searchTerm}`);
                })
                
                // Appends the paragraph and anchor element to div
                div.appendChild(link);
                div.appendChild(searchPara);
                savedEntriesDiv.appendChild(div);
            });
        }
        // Invokes the function
        displaySearchedEntries();

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
}

});

