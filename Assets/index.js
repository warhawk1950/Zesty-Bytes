// DOM Elements and Global Variables
const apiKey = 'd21c891cc7d24269b62de05633d46e54';
const searchInput = document.querySelector('input'); // Gets the user input fromt the search field
const resultsContainer = document.getElementById('foodContent'); // Gets the container to display the recipe divs

// Function in order to only run once document is fully loaded and ready
document.addEventListener('DOMContentLoaded', function() {

    // Event listener for search bar to recieve receipe name --- Debounce of 300 ms to limit api result/requests
    searchInput.addEventListener('input', debounce(function() {

        const searchTerm = searchInput.value.trim(); // Trim search recipie name

        // Make sure that results only pull if something is typed
        if (searchTerm !== '') {

            // Spoonacular API Request to search recipie name with Appetizer & only 6 result parameters
            fetch(`https://api.spoonacular.com/recipes/search?apiKey=${apiKey}&query=${searchTerm}&type=appetizer&number=6`)
                
                .then(response => response.json())
                .then(data => {

                    // Clear any previous results
                    resultsContainer.innerHTML = '';

                    // Display new result
                    data.results.forEach(result => {

                        const recipeElement = document.createElement('div');

                        recipeElement.classList.add('box');
                        recipeElement.textContent = result.title;
                        resultsContainer.appendChild(recipeElement);
                    });
                })
        } else {

            // Clear out results if the search input is empty
            resultsContainer.innerHTML = '';
        }

    }, 300)); //debounce milisecond count for deplay
});

// Debounce function to limit API points/requests while typing in search bar
function debounce(func, delay) {

    let timeout; // Stores timeout ID

    return function () {

        const context = this;
        const args = arguments; // Arguments of the debounce function

        // Clear any previous timeout
        clearTimeout(timeout);

        // Set a new timeout for the delay (300) & invoke function including saved context & arguments
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
};