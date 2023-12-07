// DOM Elements and Global Variables
const apiKey = '11f3fd3816084112a9aa60f0e238982e';

const searchInput = document.querySelector('input'); 
const searchForm = document.getElementById('searchForm'); 
const resultsContainer = document.getElementById('foodContent');
const savedEntriesDiv = document.getElementById('savedEntriesDiv');
const modal = document.getElementById('default-modal');
const toggleBtn = document.getElementById('toggleBtn');
const dropdownList = document.getElementById('dropdownList');

// Event listener for the form button click
searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    searchRecipes();

    const searchTerm = searchInput.value.trim();
});

// Event listener for when the search input is focused
searchInput.addEventListener('focus', function () {
    dropdownList.style.display = 'block';
});

// Event listener for when the search input loses focus
searchInput.addEventListener('blur', function () {
    dropdownList.style.display = 'none';
});

// Listen for click events on the dropdown list items
dropdownList.addEventListener('click', function (event) {
    if (event.target.tagName === 'LI') {
        // Set input value to clicked item
        searchInput.value = event.target.textContent;
        // Hide the dropdown
        dropdownList.style.display = 'none';
    }
});

// Function to display recipe results on the home page
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
    });
}

// Function to display a single detailed recipe
async function displaySingleRecipe(id) {
    const data = await fetchSingleRecipe(id);
    saveToLocalStorage(data.title); // Save id/recipe name to local storage
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

// Function to save recipe name into local storage
function saveToLocalStorage(recipeName) {
    const savedEntries = JSON.parse(localStorage.getItem('SavedEntries')) || [];
    const existingEntryIndex = savedEntries.findIndex(entry => entry.recipeName === recipeName);

    if (existingEntryIndex !== -1) {
        // Remove the existing entry to move it to the top
        savedEntries.splice(existingEntryIndex, 1);
    }
    
    savedEntries.unshift(recipeName);

    localStorage.setItem('SavedEntries', JSON.stringify(savedEntries));
}

// Function to actually run searched Recipes 
async function searchRecipes() {
    const checkboxes = Array.from(document.querySelectorAll('input[type=checkbox]:checked')).map(checkbox => checkbox.value);
    const selectedIngr = checkboxes.length > 0 ? checkboxes : [];
    const searchTerm = searchInput.value.trim();
    resultsContainer.innerHTML = '';
    if (selectedIngr.length > 0) {
        // Fetch and display recipes based on search term and selected ingredients
        const data = await fetchSearchAndIng(searchTerm, selectedIngr);
        displayHomePage(data);
    } else {
        // Fetch and display recipes based on search term only
        const data = await fetchSearchTerm(searchTerm);
        displayHomePage(data);
    }
}

// Function to fetch a single recipe by its ID
async function fetchSingleRecipe(id) {
    const URL = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=${apiKey}`;
    try {
        const response = await fetch(URL);
        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching URL', error.message);
    }
}

// Function to fetch recipes based on a search term
async function fetchSearchTerm(searchTerm) {
    const URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${searchTerm}&type=appetizer&number=6`;
    try {
        const response = await fetch(URL);
        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching URL', error.message);
    }
}

// Function to fetch recipes based on a search term and selected ingredients
async function fetchSearchAndIng(searchTerm, ingredients) {
    const URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${searchTerm}&type=appetizer&number=6&includeIngredients=${ingredients}`;
    try {
        const response = await fetch(URL);
        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching URL', error.message);
    }
}

// Function to initialize the application with a default search term
async function init() {
    const data = await fetchSearchTerm('beef');
    displayHomePage(data);
}

// Call the initialization function
init();
