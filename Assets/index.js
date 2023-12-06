// DOM Elements and Global Variables
const apiKey = '1b4033d0fab74f9baa5f8b0d1950e612';

const searchInput = document.querySelector('input'); // Gets the user input from the search field
const searchForm = document.getElementById('searchForm'); // Gets the form element
const resultsContainer = document.getElementById('foodContent'); // Gets the container to display the recipe divs
const savedEntriesDiv = document.getElementById('savedEntriesDiv');
const modal = document.getElementById('default-modal');
const toggleBtn = document.getElementById('toggleBtn');

// Event listener for the form button click
searchForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevents the form from submitting
    searchRecipes();
})

function displayHomePage(data) {
    data.results.forEach(result => {
        const recipeElement = document.createElement('div');
        recipeElement.addEventListener('click', () => displaySingleRecipe(result.id));
        recipeElement.classList.add('cursor-pointer');
        const h3 = document.createElement('h3');
        const img = document.createElement('img');
        h3.textContent = result.title;
        img.src = result.image;
        h3.classList.add('word-wrapper');
        img.classList.add('rounded-lg')
        recipeElement.classList.add('recipe-container');
        recipeElement.appendChild(h3);
        recipeElement.appendChild(img);
        resultsContainer.appendChild(recipeElement);
    })
}
function removeFirstATagAndAfter(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Find the first <a> tag
    const firstATag = doc.querySelector('a');
    
    if (firstATag) {
        // Remove everything after and including the first <a> tag
        const parent = firstATag.parentNode;
        let currentNode = firstATag;
        while (currentNode) {
            const nextNode = currentNode.nextSibling;
            parent.removeChild(currentNode);
            currentNode = nextNode;
        }
    }

    // Get the modified HTML string
    const modifiedHtmlString = doc.body.innerHTML;

    return modifiedHtmlString;
}

async function displaySingleRecipe(id) {
    const data = await fetchSingleRecipe(id);

    // Save id/recipe name to local storage
    saveToLocalStorage(data.title, data.id);

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
    summary.innerHTML = removeFirstATagAndAfter(data.summary);
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
function displayLocalStorage() {
    const localStorageDis = document.getElementById('displayLocalStorage');
    const savedEntries = JSON.parse(localStorage.getItem('SavedEntries'));
    if (savedEntries.length > 0) {
        localStorageDis.classList.remove('hidden');
        localStorageDis.innerHTML = '';
        const h3 = document.createElement('h3');
        h3.textContent = 'Recently Viewed Recipes';
        h3.classList.add('text-lg', 'font-bold')
        localStorageDis.appendChild(h3);
        savedEntries.forEach(entry => {
            const p = document.createElement('p');
            p.textContent = entry.recipeName;
            p.addEventListener('click', () => displaySingleRecipe(entry.id));
            p.classList.add('cursor-pointer', 'word-wrapper')
            localStorageDis.appendChild(p);
        });
    }
}
// Function to save recipie name into local storage
function saveToLocalStorage(recipeName, id) {
    const savedEntries = JSON.parse(localStorage.getItem('SavedEntries')) || [];
    // Check if the entry already exists in the local storage
    const existingEntryIndex = savedEntries.findIndex(entry => entry.recipeName === recipeName);
    if (existingEntryIndex !== -1) {
        // Remove the existing entry to move it to the top
        savedEntries.splice(existingEntryIndex, 1);
    }
    if (savedEntries.length == 5) {
        savedEntries.pop();
    }
    let tempObject = {
        id: id,
        recipeName: recipeName,
    }
    // Add the new entry to the beginning of the array
    savedEntries.unshift(tempObject);

    // Save the updated array back to local storage
    localStorage.setItem('SavedEntries', JSON.stringify(savedEntries));
    displayLocalStorage()
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
    let loading = document.createElement('p');
    resultsContainer.appendChild(loading);
    loading.textContent = 'Loading...';
    const data = await fetchSearchTerm('wings');
    resultsContainer.removeChild(loading);
    displayHomePage(data);
    displayLocalStorage();
}
init()

