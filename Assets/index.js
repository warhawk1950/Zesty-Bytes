// DOM Elements and Global Variables

const apiKey = 'd21c891cc7d24269b62de05633d46e54';


const searchInput = document.querySelector('input'); // Gets the user input from the search field
const searchForm = document.getElementById('searchForm'); // Gets the form element
const resultsContainer = document.getElementById('foodContent'); // Gets the container to display the recipe divs
const savedEntriesDiv = document.getElementById('savedEntriesDiv');
const modal = document.getElementById('default-modal');
const toggleBtn = document.getElementById('toggleBtn');

const dropdownList = document.getElementById('dropdownList');

// Function to only run once the document is fully loaded and ready
// document.addEventListener('DOMContentLoaded', function () {

    // Event listener for the form button click
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevents the form from submitting
        searchRecipes();
        
    // Get the search term from the input field
    const searchTerm = searchInput.value.trim();
    // Save the search term to local storage
    saveToLocalStorage(searchTerm);
    })

    

    searchInput.addEventListener('focus', function() {
        dropdownList.style.display = 'block';
      });
      
      searchInput.addEventListener('blur', function() {
        dropdownList.style.display = 'none';
      });
      
      // Listen for click events on the dropdown list items
      dropdownList.addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            searchInput.value = event.target.textContent; // Set input value to clicked item
            dropdownList.style.display = 'none'; // Hide the dropdown
        }
      });

    

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

        // Save id/recipe name to local storage
        saveToLocalStorage(data.title);

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
    // Function to save recipie name into local storage
    function saveToLocalStorage(searchTerm) {
        const savedEntries = JSON.parse(localStorage.getItem('SavedEntries')) || [];
        // Check if the entry already exists in the local storage
        const existingEntryIndex = savedEntries.findIndex(entry => entry === searchTerm);
        if (existingEntryIndex !== -1) {
        // Remove the existing entry to move it to the top
        savedEntries.splice(existingEntryIndex, 1);
        }
        // Add the new entry to the beginning of the array
        savedEntries.unshift(searchTerm);

        // Save the updated array back to local storage
        localStorage.setItem('SavedEntries', JSON.stringify(savedEntries));
    }
    // Function to actually run searched Recipes 
    async function searchRecipes() {
        const checkboxes = Array.from(document.querySelectorAll('input[type=checkbox]:checked')).map(checkbox => checkbox.value);
        const selectedIngr = checkboxes.length > 0 ? checkboxes : [];
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
