/**
 * 中式家常菜 - Chinese Home Cooking Site
 * 智能配餐 Auto Meal Planner
 * 使用统一数据接口 getRecipesByCategory()
 */

const SITE_ID = 'cn-home';

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

// 将新格式菜谱转换为站点兼容格式
function normalizeRecipe(r) {
    return {
        id: r.id,
        title: r.name,
        image: r.emoji || '🍽️',
        nameEn: r.nameEn || '',
        time: ((r.prepTime || 0) + (r.cookTime || 0)) + '分钟',
        timeMinutes: (r.prepTime || 0) + (r.cookTime || 0),
        difficulty: r.difficulty || '简单',
        calories: r.calories || Math.round((r.prepTime || 10) * 8 + 100),
        caloriesText: (r.calories || Math.round((r.prepTime || 10) * 8 + 100)) + '卡',
        tags: r.tags || [],
        cuisine: r.cuisine || '',
        category: r.category || '热菜',
        type: r.category === '汤品' || r.category === '汤' ? 'soup' : 'dish',
        spicy: r.spicy === true || (typeof r.spicy === 'number' && r.spicy > 0),
        spicyLevel: r.spicy || 0,
        ingredients: r.ingredients || [],
        tools: r.tools || [],
        steps: r.steps || [],
        tips: r.tips || [],
        servings: r.servings || 4
    };
}

// 从统一数据接口获取菜谱
function getSiteRecipes() {
    if (typeof getRecipesByCategory === 'function') {
        return getRecipesByCategory('cn-home').map(normalizeRecipe);
    }
    if (typeof ALL_RECIPES !== 'undefined') {
        const config = SITE_CONFIG['cn-home'];
        let recipes = ALL_RECIPES;
        if (config && config.filters && config.filters.cuisine) {
            recipes = recipes.filter(r => config.filters.cuisine.includes(r.cuisine));
        }
        return recipes.map(normalizeRecipe);
    }
    return [];
}

// 站点数据
let SITE_RECIPES = [];
let SITE_SOUPS = [];
let CN_HOME_DISHES = [];

// 初始化数据
function initSiteData() {
    SITE_RECIPES = getSiteRecipes();
    SITE_SOUPS = SITE_RECIPES.filter(r => r.type === 'soup');
    CN_HOME_DISHES = SITE_RECIPES.filter(r => r.type === 'dish');
    console.log(`[${SITE_ID}] 加载了 ${SITE_RECIPES.length} 道菜谱`);
}

// 当前选中的菜品
let currentDishes = [];
let currentSoups = [];

// DOM 元素
let adultNum, childNum, includeSpicy, generateBtn, resultSection;
let dishGrid, soupGrid, mealStats, confirmBtn, refreshBtn;
let recipeModal, modalClose, modalEmoji, modalBody;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initSiteData();
    initApp();
});

function initApp() {
    adultNum = document.getElementById('adultNum');
    childNum = document.getElementById('childNum');
    includeSpicy = document.getElementById('includeSpicy');
    generateBtn = document.getElementById('generateBtn');
    resultSection = document.getElementById('resultSection');
    dishGrid = document.getElementById('dishGrid');
    soupGrid = document.getElementById('soupGrid');
    mealStats = document.getElementById('mealStats');
    confirmBtn = document.getElementById('confirmBtn');
    refreshBtn = document.getElementById('refreshBtn');
    recipeModal = document.getElementById('recipeModal');
    modalClose = document.getElementById('modalClose');
    modalEmoji = document.getElementById('modalEmoji');
    modalBody = document.getElementById('modalBody');

    bindEvents();
    console.log('中式家常菜 - 智能配餐已就绪');
}

function bindEvents() {
    if (generateBtn) generateBtn.addEventListener('click', handleGenerate);
    if (confirmBtn) confirmBtn.addEventListener('click', handleConfirm);
    if (refreshBtn) refreshBtn.addEventListener('click', handleRefresh);
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (recipeModal) {
        recipeModal.addEventListener('click', (e) => {
            if (e.target === recipeModal) closeModal();
        });
    }
}

// 生成配餐
function handleGenerate() {
    const adults = parseInt(adultNum?.value || 2);
    const children = parseInt(childNum?.value || 0);
    const wantSpicy = includeSpicy?.checked !== false;

    const totalPeople = adults + children;
    let dishCount = 2;
    let soupCount = 1;

    if (totalPeople >= 6) {
        dishCount = 4;
        soupCount = 2;
    } else if (totalPeople >= 4) {
        dishCount = 3;
        soupCount = 1;
    }

    let availableDishes = CN_HOME_DISHES;
    let availableSoups = SITE_SOUPS;

    if (!wantSpicy) {
        availableDishes = availableDishes.filter(r => !r.spicy);
        availableSoups = availableSoups.filter(r => !r.spicy);
    }

    currentDishes = shuffleArray(availableDishes).slice(0, dishCount);
    currentSoups = shuffleArray(availableSoups).slice(0, soupCount);

    displayResult();
}

function displayResult() {
    if (!resultSection || !dishGrid || !soupGrid) return;

    resultSection.style.display = 'block';
    dishGrid.innerHTML = currentDishes.map(dish => createDishCard(dish)).join('');
    soupGrid.innerHTML = currentSoups.map(soup => createDishCard(soup)).join('');
    updateStats();
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function createDishCard(recipe) {
    const difficultyClass = recipe.difficulty === '简单' ? 'easy' :
                           recipe.difficulty === '中等' ? 'medium' : 'hard';

    return `
        <div class="meal-card" onclick="showRecipeDetail('${recipe.id}')">
            <div class="meal-card-emoji">
                <span>${recipe.image}</span>
                <span class="meal-card-difficulty difficulty-${difficultyClass}">${recipe.difficulty}</span>
            </div>
            <div class="meal-card-content">
                <h5 class="meal-card-name">${recipe.title}</h5>
                <p class="meal-card-name-en">${recipe.nameEn}</p>
                <div class="meal-card-meta">
                    <span>⏱️ ${recipe.time}</span>
                    <span>🔥 ${recipe.caloriesText}</span>
                </div>
                <div class="meal-card-tags">
                    ${recipe.tags.slice(0, 3).map(tag => `<span class="meal-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

function updateStats() {
    if (!mealStats) return;

    const totalTime = [...currentDishes, ...currentSoups].reduce((sum, r) => sum + r.timeMinutes, 0);
    const totalCalories = [...currentDishes, ...currentSoups].reduce((sum, r) => sum + (r.calories || 0), 0);

    mealStats.innerHTML = `
        <div class="stat-item">
            <span class="stat-number">${currentDishes.length + currentSoups.length}</span>
            <span class="stat-label">道菜</span>
        </div>
        <div class="stat-item">
            <span class="stat-number">${totalTime}</span>
            <span class="stat-label">分钟</span>
        </div>
        <div class="stat-item">
            <span class="stat-number">${totalCalories}</span>
            <span class="stat-label">卡路里</span>
        </div>
    `;
}

function handleConfirm() {
    const allRecipes = [...currentDishes, ...currentSoups];
    if (allRecipes.length === 0) {
        alert('请先生成配餐方案');
        return;
    }

    const ingredients = [];
    allRecipes.forEach(r => {
        if (r.ingredients) {
            r.ingredients.forEach(ing => {
                ingredients.push(`${ing.name}: ${ing.amount}`);
            });
        }
    });

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;';
    overlay.innerHTML = `
        <div style="background:#fff;border-radius:16px;padding:30px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;">
            <h3 style="margin-bottom:20px;">🎉 菜单已确认</h3>
            <p style="margin-bottom:15px;">您选择了 ${allRecipes.length} 道菜</p>
            <h4 style="margin-bottom:10px;">🛒 购物清单：</h4>
            <ul style="margin-bottom:20px;padding-left:20px;">
                ${ingredients.map(i => `<li>${i}</li>`).join('')}
            </ul>
            <button onclick="this.parentElement.remove()" style="padding:12px 24px;background:#e67722;color:#fff;border:none;border-radius:8px;cursor:pointer;">确定</button>
        </div>
    `;
    document.body.appendChild(overlay);
}

function handleRefresh() {
    handleGenerate();
}

function showRecipeDetail(recipeId) {
    const allRecipes = [...SITE_RECIPES];
    const recipe = allRecipes.find(r => r.id === recipeId);
    if (!recipe || !modalEmoji || !modalBody) return;

    modalEmoji.textContent = recipe.image;

    let html = `
        <h2>${recipe.title}</h2>
        <p style="color:#666;margin-bottom:20px;">${recipe.nameEn}</p>
        <div style="display:flex;gap:15px;margin-bottom:20px;flex-wrap:wrap;">
            <span>🍽️ ${recipe.cuisine}</span>
            <span>⏱️ ${recipe.time}</span>
            <span>🔥 ${recipe.caloriesText}</span>
            <span>👥 ${recipe.servings}人份</span>
        </div>
    `;

    if (recipe.ingredients && recipe.ingredients.length > 0) {
        html += '<h3>🥬 食材</h3><ul style="margin-bottom:20px;padding-left:20px;">';
        recipe.ingredients.forEach(ing => {
            html += `<li><strong>${ing.name}</strong> - ${ing.amount}</li>`;
        });
        html += '</ul>';
    }

    if (recipe.steps && recipe.steps.length > 0) {
        html += '<h3>📝 步骤</h3><ol style="margin-bottom:20px;padding-left:20px;">';
        recipe.steps.forEach(step => {
            html += `<li style="margin-bottom:8px;">${step}</li>`;
        });
        html += '</ol>';
    }

    if (recipe.tips && recipe.tips.length > 0) {
        html += '<h3>💡 小贴士</h3><div style="background:#f8f9fa;padding:15px;border-radius:8px;margin-bottom:20px;">';
        html += '<ul style="padding-left:20px;">';
        recipe.tips.forEach(tip => {
            html += `<li style="margin-bottom:5px;">${tip}</li>`;
        });
        html += '</ul></div>';
    }

    modalBody.innerHTML = html;
    recipeModal.classList.add('active');
}

function closeModal() {
    if (recipeModal) recipeModal.classList.remove('active');
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function filterByCuisine(cuisine) {
    const filtered = SITE_RECIPES.filter(r => r.cuisine === cuisine);
    alert(`${cuisine} 共有 ${filtered.length} 道菜谱`);
}
