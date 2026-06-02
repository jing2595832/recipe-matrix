/**
 * 中式家常菜 - Chinese Home Cooking Site
 * 智能配餐 Auto Meal Planner
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

const SITE_ID = 'cn-home';

// ===== 使用外部菜谱数据，筛选适合本站的菜谱 =====
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
        type: r.category === '汤品' || r.category === '汤' ? 'soup' : 'dish',
        spicy: r.spicy === true || (typeof r.spicy === 'number' && r.spicy > 0),
        ingredients: r.ingredients || [],
        tools: r.tools || [],
        steps: r.steps || []
    };
}

// 从全局 CN_RECIPES + CN_RECIPES_EXTRA1 筛选中式家常菜
const ALL_CN = [
    ...(typeof CN_RECIPES !== 'undefined' ? CN_RECIPES : []),
    ...(typeof CN_RECIPES_EXTRA1 !== 'undefined' ? CN_RECIPES_EXTRA1 : [])
];

const SITE_RECIPES = ALL_CN
    .filter(r => {
        // 保留所有中式菜谱
        return true;
    })
    .map(normalizeRecipe);

const SITE_SOUPS = SITE_RECIPES.filter(r => r.type === 'soup');
const CN_SOUPS = SITE_SOUPS; // 兼容旧引用
const CN_HOME_DISHES = SITE_RECIPES.filter(r => r.type === 'dish');

// 当前选中的菜品
let currentDishes = [];
let currentSoups = [];

// DOM 元素
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

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    bindEvents();
    renderRecipeGrid();
    console.log('中式家常菜 - 智能配餐已就绪');
}

// 绑定事件
function bindEvents() {
    generateBtn.addEventListener('click', handleGenerate);
    confirmBtn.addEventListener('click', handleConfirm);
    refreshBtn.addEventListener('click', handleRefresh);
    modalClose.addEventListener('click', closeModal);

    // 点击遮罩关闭弹窗
    recipeModal.addEventListener('click', (e) => {
        if (e.target === recipeModal) closeModal();
    });

    // ESC 关闭弹窗
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // 标签点击筛选
    document.querySelectorAll('.hero-tags .tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const cuisine = tag.textContent;
            filterByCuisine(cuisine);
        });
    });

    // 分类卡片点击
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.querySelector('h4').textContent;
            filterByCategory(category);
        });
    });

    // 加载更多
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', handleLoadMore);
    }
}

// 根据人数计算菜品数量
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

// 随机选择不重复的菜品
function pickRandom(arr, count, excludeIds) {
    const available = arr.filter(r => !excludeIds.includes(r.id));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// 生成菜单
function handleGenerate() {
    const adults = parseInt(adultNum.value);
    const kids = parseInt(childNum.value);
    const spicy = includeSpicy.checked;

    const dishCount = getDishCount(adults, kids);
    const soupCount = getSoupCount(adults, kids);

    // 筛选菜品池
    let dishPool = [...CN_HOME_DISHES];
    let soupPool = [...CN_SOUPS];

    if (!spicy) {
        dishPool = dishPool.filter(r => !r.spicy);
        soupPool = soupPool.filter(r => !r.spicy);
    }

    // 随机选菜
    currentDishes = pickRandom(dishPool, dishCount, []);
    const dishIds = currentDishes.map(d => d.id);
    currentSoups = pickRandom(soupPool, soupCount, dishIds);

    renderResults(adults, kids);
}

// 渲染结果
function renderResults(adults, kids) {
    resultSection.style.display = 'block';

    // 统计
    const allRecipes = [...currentDishes, ...currentSoups];
    const totalDishes = allRecipes.length;
    const totalCalories = allRecipes.reduce((sum, r) => sum + r.calories, 0);
    const maxTime = Math.max(...allRecipes.map(r => parseInt(r.time)));

    mealStats.innerHTML = `
        <div class="stat-item">
            <span class="stat-icon">🍽️</span>
            <span>菜品数</span>
            <span class="stat-value">${totalDishes}道</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon">🔥</span>
            <span>总热量</span>
            <span class="stat-value">${totalCalories}卡</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon">⏱️</span>
            <span>最长烹饪</span>
            <span class="stat-value">${maxTime}分钟</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon">👥</span>
            <span>用餐人数</span>
            <span class="stat-value">${adults}大${kids}小</span>
        </div>
    `;

    // 渲染热菜
    dishGrid.innerHTML = currentDishes.map((recipe, index) => createMealCard(recipe, index, 'dish')).join('');

    // 渲染汤品
    soupGrid.innerHTML = currentSoups.map((recipe, index) => createMealCard(recipe, index, 'soup')).join('');

    // 滚动到结果区
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 创建菜品卡片
function createMealCard(recipe, index, type) {
    return `
        <div class="meal-card" data-id="${recipe.id}" data-type="${type}" data-index="${index}">
            <button class="change-btn" data-id="${recipe.id}" data-type="${type}" data-index="${index}" title="换一道菜">🔄</button>
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

// 事件委托：点击菜品卡片显示详情，点击换菜按钮替换
document.addEventListener('click', (e) => {
    // 换菜按钮
    const changeBtn = e.target.closest('.change-btn');
    if (changeBtn) {
        e.stopPropagation();
        const id = parseInt(changeBtn.dataset.id);
        const type = changeBtn.dataset.type;
        const index = parseInt(changeBtn.dataset.index);
        handleSwapDish(id, type, index);
        return;
    }

    // 菜品卡片点击查看详情
    const card = e.target.closest('.meal-card');
    if (card) {
        const id = parseInt(card.dataset.id);
        openRecipeModal(id);
    }
});

// 替换单道菜
function handleSwapDish(currentId, type, index) {
    const spicy = includeSpicy.checked;
    let pool = type === 'dish' ? [...CN_HOME_DISHES] : [...CN_SOUPS];
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

    // 重新渲染对应区域
    const grid = type === 'dish' ? dishGrid : soupGrid;
    const list = type === 'dish' ? currentDishes : currentSoups;
    grid.innerHTML = list.map((recipe, i) => createMealCard(recipe, i, type)).join('');

    // 更新统计
    const adults = parseInt(adultNum.value);
    const kids = parseInt(childNum.value);
    updateStats(adults, kids);
}

// 更新统计信息
function updateStats(adults, kids) {
    const allRecipes = [...currentDishes, ...currentSoups];
    const totalDishes = allRecipes.length;
    const totalCalories = allRecipes.reduce((sum, r) => sum + r.calories, 0);
    const maxTime = Math.max(...allRecipes.map(r => parseInt(r.time)));

    mealStats.innerHTML = `
        <div class="stat-item">
            <span class="stat-icon">🍽️</span>
            <span>菜品数</span>
            <span class="stat-value">${totalDishes}道</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon">🔥</span>
            <span>总热量</span>
            <span class="stat-value">${totalCalories}卡</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon">⏱️</span>
            <span>最长烹饪</span>
            <span class="stat-value">${maxTime}分钟</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon">👥</span>
            <span>用餐人数</span>
            <span class="stat-value">${adults}大${kids}小</span>
        </div>
    `;
}

// 确认菜单
function handleConfirm() {
    if (currentDishes.length === 0 && currentSoups.length === 0) return;

    const dishNames = currentDishes.map(d => d.title).join('、');
    const soupNames = currentSoups.map(s => s.title).join('、');

    const summary = `✅ 菜单已确认！\n\n` +
        `🥘 热菜：${dishNames}\n` +
        `🍲 汤品：${soupNames}\n\n` +
        `祝您用餐愉快！Bon Appetit!`;

    alert(summary);
}

// 换一批
function handleRefresh() {
    handleGenerate();
}

// 打开菜谱详情弹窗
function openRecipeModal(recipeId) {
    const allRecipes = [...CN_HOME_DISHES, ...CN_SOUPS];
    const recipe = allRecipes.find(r => r.id === recipeId);
    if (!recipe) return;

    modalEmoji.textContent = recipe.image;
    // 兼容新旧格式：ingredients 可能是字符串数组或对象数组
    const ingredientsHtml = recipe.ingredients.map(ing => {
        if (typeof ing === 'object' && ing.name) {
            return `<li>${ing.name} ${ing.amount || ''}</li>`;
        }
        return `<li>${ing}</li>`;
    }).join('');

    const toolsHtml = recipe.tools && recipe.tools.length > 0
        ? `<div class="modal-section-title">🔧 所需工具</div><ul class="modal-ingredients">${recipe.tools.map(t => `<li>${t}</li>`).join('')}</ul>`
        : '';

    modalBody.innerHTML = `
        <h3>${recipe.title}</h3>
        <div class="modal-meta">
            <span>⏱️ ${recipe.time}</span>
            <span>🔥 ${recipe.caloriesText}</span>
            <span>📊 ${recipe.difficulty}</span>
            <span>📍 ${recipe.cuisine}</span>
        </div>
        <div class="modal-tags">
            ${recipe.tags.map(tag => `<span class="meal-card-tag">${tag}</span>`).join('')}
        </div>
        <div class="modal-section-title">🛒 食材 Ingredients</div>
        <ul class="modal-ingredients">
            ${ingredientsHtml}
        </ul>
        ${toolsHtml}
        <div class="modal-section-title">👨‍🍳 做法步骤 Steps</div>
        <ol class="modal-steps">
            ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
        </ol>
    `;

    recipeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 关闭弹窗
function closeModal() {
    recipeModal.classList.remove('active');
    document.body.style.overflow = '';
}

// 渲染底部菜谱展示区
function renderRecipeGrid() {
    if (!recipeGrid) return;
    // 只展示前24道菜（避免页面过长）
    const displayRecipes = CN_HOME_DISHES.slice(0, 24);
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

// 按菜系筛选
function filterByCuisine(cuisine) {
    const filtered = CN_HOME_DISHES.filter(r => r.cuisine === cuisine);
    if (filtered.length > 0) {
        recipeGrid.innerHTML = filtered.map(r => createRecipeCard(r)).join('');
    } else {
        recipeGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">暂无该菜系菜谱</p>';
    }
}

function filterByCategory(category) {
    filterByCuisine(category);
}

// 加载更多（从菜谱库加载更多）
function handleLoadMore() {
    const startIdx = recipeGrid.querySelectorAll('.recipe-card').length;
    const moreRecipes = CN_HOME_DISHES.slice(startIdx, startIdx + 12);
    const newCards = moreRecipes.map(r => createRecipeCard(r)).join('');
    recipeGrid.insertAdjacentHTML('beforeend', newCards);
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CN_RECIPES, CN_SOUPS, initApp };
}
