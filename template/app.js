/**
 * Recipe Matrix - Base Application
 * Each site will customize SITE_ID and related configurations
 */

// Site Configuration (Override in each site's app.js)
const SITE_CONFIG = {
    SITE_ID: 'template',
    SITE_NAME: 'Recipe Matrix',
    API_BASE_URL: '/api',
    RECIPES_PER_PAGE: 8,
    FEATURED_RECIPES_COUNT: 4
};

// Sample Recipe Data (In production, this would come from an API)
const SAMPLE_RECIPES = [
    {
        id: 1,
        title: 'Sample Recipe 1',
        image: '🍽️',
        time: '30分钟',
        difficulty: '简单',
        calories: '350卡',
        tags: ['健康', '快手']
    },
    {
        id: 2,
        title: 'Sample Recipe 2',
        image: '🥗',
        time: '45分钟',
        difficulty: '中等',
        calories: '420卡',
        tags: ['低脂', '美味']
    },
    {
        id: 3,
        title: 'Sample Recipe 3',
        image: '🍜',
        time: '60分钟',
        difficulty: '困难',
        calories: '550卡',
        tags: ['传统', '丰盛']
    },
    {
        id: 4,
        title: 'Sample Recipe 4',
        image: '🥘',
        time: '25分钟',
        difficulty: '简单',
        calories: '280卡',
        tags: ['素食', '清淡']
    }
];

// DOM Elements
const recipeGrid = document.getElementById('recipeGrid');
const loadMoreBtn = document.getElementById('loadMore');
const searchInput = document.querySelector('.search-input');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderRecipes();
    bindEvents();
    console.log(`${SITE_CONFIG.SITE_NAME} initialized`);
}

// Render Recipe Cards
function renderRecipes() {
    if (!recipeGrid) return;
    
    const recipes = getRecipes();
    recipeGrid.innerHTML = recipes.map(recipe => createRecipeCard(recipe)).join('');
}

// Create Recipe Card HTML
function createRecipeCard(recipe) {
    return `
        <div class="recipe-card" data-id="${recipe.id}">
            <div class="recipe-image">${recipe.image}</div>
            <div class="recipe-content">
                <h4 class="recipe-title">${recipe.title}</h4>
                <div class="recipe-meta">
                    <span>⏱️ ${recipe.time}</span>
                    <span>📊 ${recipe.difficulty}</span>
                    <span>🔥 ${recipe.calories}</span>
                </div>
                <div class="recipe-tags">
                    ${recipe.tags.map(tag => `<span class="recipe-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

// Get Recipes (In production, this would fetch from API)
function getRecipes() {
    // Return site-specific recipes based on SITE_ID
    return getSiteSpecificRecipes();
}

// Get Site-Specific Recipes
function getSiteSpecificRecipes() {
    // This function should be overridden in each site's app.js
    // to return recipes specific to that site's theme
    return SAMPLE_RECIPES;
}

// Bind Event Listeners
function bindEvents() {
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', handleLoadMore);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', handleSearch);
    }
    
    // Category card click events
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.querySelector('h4').textContent;
            filterByCategory(category);
        });
    });
    
    // Recipe card click events
    document.addEventListener('click', (e) => {
        const recipeCard = e.target.closest('.recipe-card');
        if (recipeCard) {
            const recipeId = recipeCard.dataset.id;
            openRecipeDetail(recipeId);
        }
    });
}

// Handle Load More Button
function handleLoadMore() {
    // In production, this would fetch more recipes from the API
    console.log('Loading more recipes...');
    
    // Simulate loading more recipes
    const moreRecipes = SAMPLE_RECIPES.map(r => ({
        ...r,
        id: r.id + 100,
        title: r.title + ' (More)'
    }));
    
    const newCards = moreRecipes.map(recipe => createRecipeCard(recipe)).join('');
    recipeGrid.insertAdjacentHTML('beforeend', newCards);
}

// Handle Search
function handleSearch(e) {
    if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query) {
            console.log(`Searching for: ${query}`);
            performSearch(query);
        }
    }
}

// Perform Search
function performSearch(query) {
    // In production, this would call the search API
    console.log(`Performing search for: ${query}`);
    // Filter and display results
}

// Filter by Category
function filterByCategory(category) {
    console.log(`Filtering by category: ${category}`);
    // In production, this would filter recipes by category
}

// Open Recipe Detail
function openRecipeDetail(recipeId) {
    console.log(`Opening recipe detail for ID: ${recipeId}`);
    // In production, this would navigate to the recipe detail page
    // or open a modal with recipe details
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SITE_CONFIG, initApp, renderRecipes };
}
