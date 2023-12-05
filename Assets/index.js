// DOM Elements and Global Variables
const apiKey = '3bd2964a72284bbe96c1747a38e6b085';

const searchInput = document.querySelector('input'); // Gets the user input from the search field
const searchForm = document.getElementById('searchForm'); // Gets the form element
const resultsContainer = document.getElementById('foodContent'); // Gets the container to display the recipe divs
const savedEntriesDiv = document.getElementById('savedEntriesDiv');
const modal = document.getElementById('default-modal');
const toggleBtn = document.getElementById('toggleBtn');

// Function to only run once the document is fully loaded and ready
// document.addEventListener('DOMContentLoaded', function () {

    // Event listener for the form button click
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevents the form from submitting
        searchRecipes();
        displayFromLocalStorage();
    })

    function displayFromLocalStorage() {
        // Retrieves saved entries from local storage
        const savedEntries = JSON.parse(localStorage.getItem('SavedEntries')) || [];
        savedEntriesDiv.innerHTML = '';
        if (savedEntries.length > 0) {
            savedEntries.forEach(entry => {
                // Actually creates the div
                const div = document.createElement('div');
                div.classList.add('searched-entry');
                // Creates a <p> element for displaying search terms
                const searchPara = document.createElement('p');
                // Creates the anchor element to link to something else
                const link = document.createElement('a');

                searchPara.textContent = `${entry.searchTerm}`;

                // Standard event listener but changes the font color with CSS but
                // It goes back to normal if clicked again, not sure how to fix that yet
                searchPara.addEventListener('click', function (event) {
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
    }
    function displayHomePage(data) {
        data.results.forEach(result => {
            console.log(result);
            const recipeElement = document.createElement('div');
            recipeElement.addEventListener('click', () => displaySingleRecipe(result.id));
            recipeElement.classList.add('cursor-pointer');
            const h3 = document.createElement('h3');
            const img = document.createElement('img');
            h3.textContent = result.title;
            img.src = result.image;
            h3.classList.add('word-wrapper');
            recipeElement.classList.add('recipe-container');
            recipeElement.appendChild(h3);
            recipeElement.appendChild(img);
            resultsContainer.appendChild(recipeElement);
        })
    }
    async function displaySingleRecipe(id) {
        const data = await fetchSingleRecipe(id);
        const title = document.getElementById('recipeTitle');
        title.textContent = '';
        title.textContent = data.title;
        const box = document.getElementById('recipeDesc');
        box.innerHTML = '';
        const img = document.createElement('img');
        img.src = data.image;
        img.classList.add('w-full', 'rounded-lg');
        box.appendChild(img);
        const summary = document.createElement('p');
        summary.innerHTML = data.summary;  
        const instructions = document.createElement('div');
        instructions.innerHTML = data.instructions;
        const servingSize = document.getElementById('servings');
        const userScore = document.getElementById('userScore');
        const readyTime = document.getElementById('readyTime');
        servingSize.textContent = data.servings;
        userScore.textContent = data.spoonacularScore.toFixed();
        readyTime.textContent = data.readyInMinutes;
        box.appendChild(summary);
        box.appendChild(instructions);
        toggleBtn.click();
    }
    // Function to actually run searched Recipes 
    async function searchRecipes() {
        const selectedIngr = Array.from(document.querySelectorAll('input[type=checkbox]:checked')).map(checkbox => checkbox.value); // Array of selected ingredients from checkboxes
        const searchTerm = searchInput.value.trim(); // Trim search recipe name
        resultsContainer.innerHTML = '';
        if (selectedIngr.length > 0) {
            const data = await fetchSearchAndIng(searchTerm, selectedIngr);
            displayHomePage(data);
        } else {
            const data = await fetchSearchTerm(searchTerm);
            displayHomePage(data);
        }

    }
    async function fetchSingleRecipe(id) {
        const URL = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=${apiKey}`
        try {
            const response = await fetch(URL);
            const data = await response.json();

            return data;
        } catch (error) {
            console.error('Error fetching URL', error.message);
        }
    }
    async function fetchSearchTerm(searchTerm) {
        const URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${searchTerm}&type=appetizer&number=6`
        try {
            const response = await fetch(URL);
            const data = await response.json();

            return data;
        } catch (error) {
            console.error('Error fetching URL', error.message);
        }
    }
    async function fetchSearchAndIng(searchTerm, ingredients) {
        const URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${searchTerm}&type=appetizer&number=6&includeIngredients=${ingredients}`
        try {
            const response = await fetch(URL);
            const data = await response.json();

            return data;
        } catch (error) {
            console.error('Error fetching URL', error.message);
        }
    }
    async function init() {
        const data = await fetchSearchTerm('beef');
        displayHomePage(data);
    }
    init()
// })