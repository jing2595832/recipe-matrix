/**
 * American Family Meals - US Family Cooking Site
 * 极简灰配色主题 - Minimal Gray Theme
 */

// Site Configuration
const SITE_CONFIG = {
    SITE_ID: 'us-family',
    SITE_NAME: 'American Family Meals',
    SITE_TAGLINE: 'Simple & Delicious Home Cooking',
    API_BASE_URL: '/api/us-family',
    RECIPES_PER_PAGE: 8,
    FEATURED_RECIPES_COUNT: 4
};

// American Family Recipes Data
const US_RECIPES = [
    {
        id: 1,
        title: 'Classic Cheeseburger',
        image: '🍔',
        time: '25 min',
        difficulty: 'Easy',
        calories: '550 cal',
        tags: ['Beef', 'Quick', 'Kid-Friendly'],
        category: 'Burgers'
    },
    {
        id: 2,
        title: 'Mac and Cheese',
        image: '🧀',
        time: '35 min',
        difficulty: 'Easy',
        calories: '480 cal',
        tags: ['Pasta', 'Comfort', 'Cheesy'],
        category: 'Pasta'
    },
    {
        id: 3,
        title: 'Fried Chicken',
        image: '🍗',
        time: '45 min',
        difficulty: 'Medium',
        calories: '620 cal',
        tags: ['Chicken', 'Classic', 'Crispy'],
        category: 'Chicken'
    },
    {
        id: 4,
        title: 'BBQ Ribs',
        image: '🥩',
        time: '3 hrs',
        difficulty: 'Medium',
        calories: '750 cal',
        tags: ['Pork', 'BBQ', 'Slow-Cook'],
        category: 'Beef'
    },
    {
        id: 5,
        title: 'Caesar Salad',
        image: '🥗',
        time: '15 min',
        difficulty: 'Easy',
        calories: '220 cal',
        tags: ['Salad', 'Healthy', 'Quick'],
        category: 'Salads'
    },
    {
        id: 6,
        title: 'Apple Pie',
        image: '🥧',
        time: '90 min',
        difficulty: 'Medium',
        calories: '380 cal',
        tags: ['Dessert', 'Classic', 'Baking'],
        category: 'Desserts'
    },
    {
        id: 7,
        title: 'Meatloaf',
        image: '🍖',
        time: '60 min',
        difficulty: 'Easy',
        calories: '420 cal',
        tags: ['Beef', 'Comfort', 'Family'],
        category: 'Beef'
    },
    {
        id: 8,
        title: 'Chicken Pot Pie',
        image: '🥘',
        time: '75 min',
        difficulty: 'Medium',
        calories: '520 cal',
        tags: ['Chicken', 'Comfort', 'Baking'],
        category: 'Chicken'
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
    console.log(`${SITE_CONFIG.SITE_NAME} - ${SITE_CONFIG.SITE_TAGLINE}`);
}

// Render Recipe Cards
function renderRecipes() {
    if (!recipeGrid) return;
    
    const recipes = getSiteSpecificRecipes();
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

// Get Site-Specific Recipes
function getSiteSpecificRecipes() {
    return US_RECIPES;
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
    
    // Tag click events
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const tagText = tag.textContent;
            filterByTag(tagText);
        });
    });
}

// Handle Load More Button
function handleLoadMore() {
    console.log('Loading more family recipes...');
    
    // Simulate loading more recipes
    const moreRecipes = US_RECIPES.map(r => ({
        ...r,
        id: r.id + 100,
        title: r.title + ' (Variation)'
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
    const lowerQuery = query.toLowerCase();
    const filtered = US_RECIPES.filter(recipe => 
        recipe.title.toLowerCase().includes(lowerQuery) || 
        recipe.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
    
    if (filtered.length > 0) {
        recipeGrid.innerHTML = filtered.map(recipe => createRecipeCard(recipe)).join('');
    } else {
        recipeGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No recipes found. Try different keywords.</p>';
    }
}

// Filter by Category
function filterByCategory(category) {
    console.log(`Filtering by category: ${category}`);
    
    // Map category names to recipe categories
    const categoryMap = {
        'Burgers & Sandwiches': 'Burgers',
        'Pasta & Noodles': 'Pasta',
        'Chicken Dishes': 'Chicken',
        'Beef & Steak': 'Beef',
        'Salads & Sides': 'Salads',
        'Desserts': 'Desserts'
    };
    
    const targetCategory = categoryMap[category] || category;
    const filtered = US_RECIPES.filter(recipe => recipe.category === targetCategory);
    
    if (filtered.length > 0) {
        recipeGrid.innerHTML = filtered.map(recipe => createRecipeCard(recipe)).join('');
    } else {
        recipeGrid.innerHTML = `<p style="text-align: center; color: var(--text-secondary);">No recipes found in ${category}. Check back soon!</p>`;
    }
}

// Filter by Tag
function filterByTag(tag) {
    console.log(`Filtering by tag: ${tag}`);
    const filtered = US_RECIPES.filter(recipe => 
        recipe.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
    
    if (filtered.length > 0) {
        recipeGrid.innerHTML = filtered.map(recipe => createRecipeCard(recipe)).join('');
    } else {
        recipeGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No recipes found with this tag.</p>';
    }
}

// Open Recipe Detail
function openRecipeDetail(recipeId) {
    const recipe = US_RECIPES.find(r => r.id == recipeId);
    if (recipe) {
        console.log(`Opening recipe detail: ${recipe.title}`);
        alert(`Recipe: ${recipe.title}\nTime: ${recipe.time}\nDifficulty: ${recipe.difficulty}\nCalories: ${recipe.calories}\n\nFull recipe details would open here!`);
    }
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

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SITE_CONFIG, US_RECIPES, initApp };
}
