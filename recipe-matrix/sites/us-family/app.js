/**
 * American Family Meals - US Family Cooking Site
 * Auto Meal Planner - 智能配餐
 */

// 全局"开发中"弹窗函数
function showUnderDevelopment(featureName) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.3s ease';
    const box = document.createElement('div');
    box.style.cssText = 'background:#fff;border-radius:16px;padding:40px;text-align:center;max-width:400px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3)';
    box.innerHTML = '<div style="font-size:3rem;margin-bottom:16px">🚧</div><h3 style="color:#333;margin-bottom:12px;font-size:1.3rem">功能开发中</h3><p style="color:#666;margin-bottom:24px;line-height:1.6">「' + (featureName || '此功能') + '」正在紧锣密鼓地开发中，敬请期待！</p><button onclick="this.closest(\'div[style]\').parentElement.remove()" style="padding:12px 32px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer;font-weight:600">我知道了</button>';
    overlay.appendChild(box);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
}

const SITE_ID = 'us-family';

// ===== 使用外部菜谱数据，筛选适合本站的菜谱 =====
function normalizeRecipe(r) {
    return {
        id: r.id,
        title: r.name,
        image: r.emoji || '🍽️',
        nameEn: r.nameEn || '',
        time: ((r.prepTime || 0) + (r.cookTime || 0)) + ' min',
        timeMinutes: (r.prepTime || 0) + (r.cookTime || 0),
        difficulty: r.difficulty || 'Easy',
        calories: r.calories || Math.round((r.prepTime || 10) * 8 + 100),
        caloriesText: (r.calories || Math.round((r.prepTime || 10) * 8 + 100)) + ' cal',
        tags: r.tags || [],
        cuisine: r.cuisine || '',
        category: r.cuisine || 'Western',
        type: r.category === '汤品' || r.category === '汤' ? 'soup' : 'dish',
        spicy: r.spicy === true,
        ingredients: r.ingredients || [],
        tools: r.tools || [],
        steps: r.steps || []
    };
}

// 从全局 WESTERN_RECIPES + WESTERN_RECIPES_EXTRA1 筛选美式家庭菜谱
const ALL_WESTERN = [
    ...(typeof WESTERN_RECIPES !== 'undefined' ? WESTERN_RECIPES : []),
    ...(typeof WESTERN_RECIPES_EXTRA1 !== 'undefined' ? WESTERN_RECIPES_EXTRA1 : [])
];

const US_RECIPES = ALL_WESTERN
    .filter(r => true) // 保留所有西式菜谱
    .map(normalizeRecipe);

const US_SOUPS = US_RECIPES.filter(r => r.type === 'soup');
const US_DISHES = US_RECIPES.filter(r => r.type === 'dish');

// Current selected dishes
let currentDishes = [];
let currentSoups = [];

// DOM Elements
const adultNum = document.getElementById('adultNum');
const childNum = document.getElementById('childNum');
const includeSpicy = document.getElementById('includeSpicy');
const generateBtn = document.getElementById('generateBtn');
const resultSection = document.getElementById('resultSection');
const dishGrid = document.getElementById('dishGrid');
const soupGrid = document.getElementById('soupGrid');
const mealStats = document.getElementById('mealStats');
const confirmBtn = document.getElementById('confirmBtn');
const refreshBtn = document.getElementById('refreshBtn');
const recipeModal = document.getElementById('recipeModal');
const modalClose = document.getElementById('modalClose');
const modalEmoji = document.getElementById('modalEmoji');
const modalBody = document.getElementById('modalBody');
const recipeGrid = document.getElementById('recipeGrid');
const loadMoreBtn = document.getElementById('loadMore');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    bindEvents();
    renderRecipeGrid();
    console.log('American Family Meals - Meal Planner ready');
}

// Bind Events
function bindEvents() {
    generateBtn.addEventListener('click', handleGenerate);
    confirmBtn.addEventListener('click', handleConfirm);
    refreshBtn.addEventListener('click', handleRefresh);
    modalClose.addEventListener('click', closeModal);

    // Click overlay to close modal
    recipeModal.addEventListener('click', (e) => {
        if (e.target === recipeModal) closeModal();
    });

    // ESC to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Tag click filtering
    document.querySelectorAll('.hero-tags .tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const tagText = tag.textContent;
            filterByTag(tagText);
        });
    });

    // Category card click
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.querySelector('h4').textContent;
            filterByCategory(category);
        });
    });

    // Load more
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', handleLoadMore);
    }
}

// Calculate dish count based on people
function getDishCount(adults, kids) {
    const total = adults + kids * 0.5;
    if (total <= 1.5) return 2;
    if (total <= 3) return 3;
    if (total <= 5) return 4;
    if (total <= 7) return 5;
    return 6;
}

function getSoupCount(adults, kids) {
    const total = adults + kids * 0.5;
    if (total <= 2) return 1;
    return Math.min(2, Math.ceil(total / 4));
}

// Pick random non-duplicate recipes
function pickRandom(arr, count, excludeIds) {
    const available = arr.filter(r => !excludeIds.includes(r.id));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Generate meal plan
function handleGenerate() {
    const adults = parseInt(adultNum.value);
    const kids = parseInt(childNum.value);
    const spicy = includeSpicy.checked;

    const dishCount = getDishCount(adults, kids);
    const soupCount = getSoupCount(adults, kids);

    // Filter recipe pools
    let dishPool = [...US_RECIPES];
    let soupPool = [...US_SOUPS];

    if (!spicy) {
        dishPool = dishPool.filter(r => !r.spicy);
        soupPool = soupPool.filter(r => !r.spicy);
    }

    // Randomly select
    currentDishes = pickRandom(dishPool, dishCount, []);
    const dishIds = currentDishes.map(d => d.id);
    currentSoups = pickRandom(soupPool, soupCount, dishIds);

    renderResults(adults, kids);
}

// Render results
function renderResults(adults, kids) {
    resultSection.style.display = 'block';

    // Stats
    const allRecipes = [...currentDishes, ...currentSoups];
    const totalDishes = allRecipes.length;
    const totalCalories = allRecipes.reduce((sum, r) => sum + r.calories, 0);
    const maxTime = Math.max(...allRecipes.map(r => parseInt(r.time)));

    mealStats.innerHTML = `
        <div class="stat-item">
            <span class="stat-icon">🍽️</span>
            <span>Dishes</span>
            <span class="stat-value">${totalDishes}</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon">🔥</span>
            <span>Total Cal</span>
            <span class="stat-value">${totalCalories} cal</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon">⏱️</span>
            <span>Max Cook</span>
            <span class="stat-value">${maxTime} min</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon">👥</span>
            <span>Diners</span>
            <span class="stat-value">${adults}A ${kids}K</span>
        </div>
    `;

    // Render main dishes
    dishGrid.innerHTML = currentDishes.map((recipe, index) => createMealCard(recipe, index, 'dish')).join('');

    // Render soups
    soupGrid.innerHTML = currentSoups.map((recipe, index) => createMealCard(recipe, index, 'soup')).join('');

    // Scroll to results
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Create meal card
function createMealCard(recipe, index, type) {
    return `
        <div class="meal-card" data-id="${recipe.id}" data-type="${type}" data-index="${index}">
            <button class="change-btn" data-id="${recipe.id}" data-type="${type}" data-index="${index}" title="Swap this dish">🔄</button>
            <div class="meal-card-emoji">${recipe.image}</div>
            <div class="meal-card-body">
                <div class="meal-card-title">${recipe.title}</div>
                <div class="meal-card-meta">
                    <span>⏱️ ${recipe.time}</span>
                    <span>🔥 ${recipe.caloriesText}</span>
                    <span>📊 ${recipe.difficulty}</span>
                </div>
                <div class="meal-card-tags">
                    ${recipe.tags.map(tag => `<span class="meal-card-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

// Event delegation: click card for detail, click change button to swap
document.addEventListener('click', (e) => {
    // Change button
    const changeBtn = e.target.closest('.change-btn');
    if (changeBtn) {
        e.stopPropagation();
        const id = parseInt(changeBtn.dataset.id);
        const type = changeBtn.dataset.type;
        const index = parseInt(changeBtn.dataset.index);
        handleSwapDish(id, type, index);
        return;
    }

    // Card click for detail
    const card = e.target.closest('.meal-card');
    if (card) {
        const id = parseInt(card.dataset.id);
        openRecipeModal(id);
    }
});

// Swap a single dish
function handleSwapDish(currentId, type, index) {
    const spicy = includeSpicy.checked;
    let pool = type === 'dish' ? [...US_RECIPES] : [...US_SOUPS];
    const currentList = type === 'dish' ? currentDishes : currentSoups;

    if (!spicy) {
        pool = pool.filter(r => !r.spicy);
    }

    const excludeIds = currentList.map(r => r.id);
    const available = pool.filter(r => !excludeIds.includes(r.id));

    if (available.length === 0) return;

    const newRecipe = available[Math.floor(Math.random() * available.length)];

    if (type === 'dish') {
        currentDishes[index] = newRecipe;
    } else {
        currentSoups[index] = newRecipe;
    }

    // Re-render the grid
    const grid = type === 'dish' ? dishGrid : soupGrid;
    const list = type === 'dish' ? currentDishes : currentSoups;
    grid.innerHTML = list.map((recipe, i) => createMealCard(recipe, i, type)).join('');

    // Update stats
    const adults = parseInt(adultNum.value);
    const kids = parseInt(childNum.value);
    updateStats(adults, kids);
}

// Update stats
function updateStats(adults, kids) {
    const allRecipes = [...currentDishes, ...currentSoups];
    const totalDishes = allRecipes.length;
    const totalCalories = allRecipes.reduce((sum, r) => sum + r.calories, 0);
    const maxTime = Math.max(...allRecipes.map(r => parseInt(r.time)));

    mealStats.innerHTML = `
        <div class="stat-item">
            <span class="stat-icon">🍽️</span>
            <span>Dishes</span>
            <span class="stat-value">${totalDishes}</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon">🔥</span>
            <span>Total Cal</span>
            <span class="stat-value">${totalCalories} cal</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon">⏱️</span>
            <span>Max Cook</span>
            <span class="stat-value">${maxTime} min</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon">👥</span>
            <span>Diners</span>
            <span class="stat-value">${adults}A ${kids}K</span>
        </div>
    `;
}

// Confirm menu
function handleConfirm() {
    if (currentDishes.length === 0 && currentSoups.length === 0) return;

    const dishNames = currentDishes.map(d => d.title).join(', ');
    const soupNames = currentSoups.map(s => s.title).join(', ');

    const summary = `✅ Menu Confirmed!\n\n` +
        `🥘 Main Dishes: ${dishNames}\n` +
        `🍲 Soups & Sides: ${soupNames}\n\n` +
        `Enjoy your meal! 祝您用餐愉快！`;

    alert(summary);
}

// Refresh all
function handleRefresh() {
    handleGenerate();
}

// Open recipe detail modal
function openRecipeModal(recipeId) {
    const allRecipes = [...US_DISHES, ...US_SOUPS];
    const recipe = allRecipes.find(r => r.id === recipeId);
    if (!recipe) return;

    modalEmoji.textContent = recipe.image;
    // 兼容新旧格式
    const ingredientsHtml = recipe.ingredients.map(ing => {
        if (typeof ing === 'object' && ing.name) {
            return `<li>${ing.name} ${ing.amount || ''}</li>`;
        }
        return `<li>${ing}</li>`;
    }).join('');

    const toolsHtml = recipe.tools && recipe.tools.length > 0
        ? `<div class="modal-section-title">🔧 Tools · 工具</div><ul class="modal-ingredients">${recipe.tools.map(t => `<li>${t}</li>`).join('')}</ul>`
        : '';

    modalBody.innerHTML = `
        <h3>${recipe.title}</h3>
        <div class="modal-meta">
            <span>⏱️ ${recipe.time}</span>
            <span>🔥 ${recipe.caloriesText}</span>
            <span>📊 ${recipe.difficulty}</span>
            <span>📍 ${recipe.category}</span>
        </div>
        <div class="modal-tags">
            ${recipe.tags.map(tag => `<span class="meal-card-tag">${tag}</span>`).join('')}
        </div>
        <div class="modal-section-title">🛒 Ingredients · 食材</div>
        <ul class="modal-ingredients">
            ${ingredientsHtml}
        </ul>
        ${toolsHtml}
        <div class="modal-section-title">👨‍🍳 Steps · 做法步骤</div>
        <ol class="modal-steps">
            ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
        </ol>
    `;

    recipeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    recipeModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Render bottom recipe grid
function renderRecipeGrid() {
    if (!recipeGrid) return;
    const displayRecipes = US_DISHES.slice(0, 24);
    recipeGrid.innerHTML = displayRecipes.map(recipe => createRecipeCard(recipe)).join('');
}

function createRecipeCard(recipe) {
    return `
        <div class="recipe-card" data-id="${recipe.id}">
            <div class="recipe-image">${recipe.image}</div>
            <div class="recipe-content">
                <h4 class="recipe-title">${recipe.title}</h4>
                <div class="recipe-meta">
                    <span>⏱️ ${recipe.time}</span>
                    <span>📊 ${recipe.difficulty}</span>
                    <span>🔥 ${recipe.caloriesText}</span>
                </div>
                <div class="recipe-tags">
                    ${recipe.tags.map(tag => `<span class="recipe-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

// Filter by tag
function filterByTag(tag) {
    const filtered = US_DISHES.filter(r =>
        r.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
    if (filtered.length > 0) {
        recipeGrid.innerHTML = filtered.map(r => createRecipeCard(r)).join('');
    } else {
        recipeGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No recipes found with this tag.</p>';
    }
}

// Filter by category
function filterByCategory(category) {
    const categoryMap = {
        'Burgers & Sandwiches': 'Burgers',
        'Pasta & Noodles': 'Pasta',
        'Chicken Dishes': 'Chicken',
        'Beef & Steak': 'Beef',
        'Salads & Sides': 'Salads',
        'Desserts': 'Desserts'
    };

    const targetCategory = categoryMap[category] || category;
    const filtered = US_DISHES.filter(r => r.category === targetCategory);

    if (filtered.length > 0) {
        recipeGrid.innerHTML = filtered.map(r => createRecipeCard(r)).join('');
    } else {
        recipeGrid.innerHTML = `<p style="text-align: center; color: var(--text-secondary);">No recipes found in ${category}. Check back soon!</p>`;
    }
}

// Load more (from recipe database)
function handleLoadMore() {
    const startIdx = recipeGrid.querySelectorAll('.recipe-card').length;
    const moreRecipes = US_DISHES.slice(startIdx, startIdx + 12);
    const newCards = moreRecipes.map(r => createRecipeCard(r)).join('');
    recipeGrid.insertAdjacentHTML('beforeend', newCards);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { US_RECIPES, US_SOUPS, initApp };
}
