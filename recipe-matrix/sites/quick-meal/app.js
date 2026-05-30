/**
 * 懒人快手餐 - Quick Meal Site
 * 浅蓝配色主题 - Light Blue Theme
 * Auto Meal Plan Generator
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

const SITE_ID = 'quick-meal';

// ===== 使用外部菜谱数据，筛选适合本站的菜谱 =====
function normalizeRecipe(r) {
    return {
        id: r.id,
        title: r.name,
        image: r.emoji || '⚡',
        nameEn: r.nameEn || '',
        time: ((r.prepTime || 0) + (r.cookTime || 0)) + '分钟',
        timeMinutes: (r.prepTime || 0) + (r.cookTime || 0),
        difficulty: r.difficulty || '简单',
        calories: r.calories || Math.round((r.prepTime || 10) * 8 + 100),
        tags: r.tags || [],
        cuisine: r.cuisine || '',
        type: r.category === '汤品' || r.category === '汤' ? 'soup' : 'dish',
        spicy: r.spicy === true || (typeof r.spicy === 'number' && r.spicy > 0),
        ingredients: r.ingredients || [],
        tools: r.tools || [],
        steps: r.steps || []
    };
}

// 从全局 CN_RECIPES + CN_RECIPES_EXTRA1 + WESTERN_RECIPES + WESTERN_RECIPES_EXTRA1 筛选快手菜谱
const ALL_RAW = [
    ...(typeof CN_RECIPES !== 'undefined' ? CN_RECIPES : []),
    ...(typeof CN_RECIPES_EXTRA1 !== 'undefined' ? CN_RECIPES_EXTRA1 : []),
    ...(typeof WESTERN_RECIPES !== 'undefined' ? WESTERN_RECIPES : []),
    ...(typeof WESTERN_RECIPES_EXTRA1 !== 'undefined' ? WESTERN_RECIPES_EXTRA1 : [])
];

const QUICK_RECIPES = ALL_RAW
    .filter(r => {
        const totalTime = (r.prepTime || 0) + (r.cookTime || 0);
        return totalTime <= 30;
    })
    .map(normalizeRecipe);

// 如果过滤后菜谱太少，放宽到45分钟
if (QUICK_RECIPES.length < 20) {
    const extra = ALL_RAW
        .filter(r => {
            const totalTime = (r.prepTime || 0) + (r.cookTime || 0);
            return totalTime > 30 && totalTime <= 45 && !QUICK_RECIPES.find(q => q.id === r.id);
        })
        .slice(0, 20 - QUICK_RECIPES.length)
        .map(normalizeRecipe);
    QUICK_RECIPES.push(...extra);
}

// ===== DOM Elements =====
const resultSection = document.getElementById('resultSection');
const resultCards = document.getElementById('resultCards');
const resultTitle = document.getElementById('resultTitle');
const recipeGrid = document.getElementById('recipeGrid');
const btnGenerate = document.getElementById('btnGenerate');
const recipeModal = document.getElementById('recipeModal');

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderRecipes();
    bindEvents();
}

// ===== Render Default Recipe Cards =====
function renderRecipes() {
    if (!recipeGrid) return;
    recipeGrid.innerHTML = QUICK_RECIPES.map(recipe => createRecipeCard(recipe)).join('');
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
                    <span>🔥 ${recipe.calories}</span>
                </div>
                <div class="recipe-tags">
                    ${recipe.tags.map(tag => `<span class="recipe-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

// ===== Bind Events =====
function bindEvents() {
    // Generate button
    if (btnGenerate) {
        btnGenerate.addEventListener('click', generateQuickMeal);
    }

    // Hero tag clicks
    document.querySelectorAll('.hero-tags .tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const filter = tag.dataset.filter;
            filterByTime(filter);
        });
    });

    // Category card clicks
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const timeGroup = card.querySelector('h4').textContent;
            filterByTime(timeGroup);
        });
    });

    // Recipe card clicks (default grid)
    document.addEventListener('click', (e) => {
        const recipeCard = e.target.closest('.recipe-card');
        if (recipeCard && recipeCard.closest('#recipeGrid')) {
            openRecipeDetail(recipeCard.dataset.id);
        }
    });

    // Modal close
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    if (recipeModal) {
        recipeModal.addEventListener('click', (e) => {
            if (e.target === recipeModal) closeModal();
        });
    }

    // Load more button
    const loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', handleLoadMore);
    }
}

// ===== Auto Meal Plan Generator =====
function generateQuickMeal() {
    const people = parseInt(document.getElementById('peopleCount').value);
    const maxTime = parseInt(document.getElementById('timeAvailable').value);
    const microwaveOnly = document.getElementById('microwaveOnly').checked;

    // Determine how many dishes to generate (1 person = 1-2 dishes, more = 2-3)
    let dishCount = people <= 2 ? 2 : 3;

    // Filter recipes by time and microwave
    let pool = QUICK_RECIPES.filter(r => r.timeMinutes <= maxTime);
    if (microwaveOnly) {
        pool = pool.filter(r => r.microwave);
    }

    // If not enough recipes, relax constraints
    if (pool.length < dishCount) {
        pool = microwaveOnly
            ? QUICK_RECIPES.filter(r => r.microwave)
            : QUICK_RECIPES.filter(r => r.timeMinutes <= maxTime + 5);
    }
    if (pool.length < dishCount) {
        pool = [...QUICK_RECIPES];
    }

    // Pick random dishes
    const selected = pickRandom(pool, dishCount);

    // Update result title
    resultTitle.textContent = `为 ${people} 人搭配的 ${maxTime}分钟快手餐`;

    // Render result cards
    resultCards.innerHTML = selected.map((recipe, idx) => `
        <div class="result-card" data-recipe-id="${recipe.id}" data-slot="${idx}">
            <div class="result-card-img">${recipe.image}</div>
            <div class="result-card-body">
                <h4>${recipe.title}</h4>
                <div class="result-card-meta">
                    <span>⏱️ ${recipe.time}</span>
                    <span>📊 ${recipe.difficulty}</span>
                    <span>🔥 ${recipe.calories}</span>
                </div>
                <div class="result-card-actions">
                    <button class="btn-change" onclick="changeDish(${idx}, ${people}, ${maxTime}, ${microwaveOnly})">🔄 换一道</button>
                    <button class="btn-detail" onclick="openRecipeDetail('${recipe.id}')">📖 查看做法</button>
                </div>
            </div>
        </div>
    `).join('');

    // Show result section
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== Change a Single Dish =====
function changeDish(slotIndex, people, maxTime, microwaveOnly) {
    let pool = QUICK_RECIPES.filter(r => r.timeMinutes <= maxTime);
    if (microwaveOnly) pool = pool.filter(r => r.microwave);
    if (pool.length < 2) pool = [...QUICK_RECIPES];

    // Get currently displayed recipe IDs
    const currentIds = Array.from(document.querySelectorAll('.result-card')).map(
        card => parseInt(card.dataset.recipeId)
    );

    // Pick a recipe not currently shown
    let available = pool.filter(r => !currentIds.includes(r.id));
    if (available.length === 0) available = pool;

    const newRecipe = available[Math.floor(Math.random() * available.length)];

    // Replace the card at slotIndex
    const cards = document.querySelectorAll('.result-card');
    if (cards[slotIndex]) {
        cards[slotIndex].dataset.recipeId = newRecipe.id;
        cards[slotIndex].querySelector('.result-card-img').textContent = newRecipe.image;
        cards[slotIndex].querySelector('h4').textContent = newRecipe.title;
        const meta = cards[slotIndex].querySelector('.result-card-meta');
        meta.innerHTML = `
            <span>⏱️ ${newRecipe.time}</span>
            <span>📊 ${newRecipe.difficulty}</span>
            <span>🔥 ${newRecipe.calories}</span>
        `;
        // Update detail button
        const detailBtn = cards[slotIndex].querySelector('.btn-detail');
        detailBtn.setAttribute('onclick', `openRecipeDetail('${newRecipe.id}')`);
    }
}

// ===== Filter by Time (tag / category clicks) =====
function filterByTime(filter) {
    // Map filter text to timeGroup
    const timeMap = {
        '5分钟': '5分钟',
        '5分钟快手': '5分钟',
        '10分钟': '10分钟',
        '10分钟速食': '10分钟',
        '15分钟': '15分钟',
        '15分钟简餐': '15分钟',
        '微波炉': '微波炉',
        '一锅出': '一锅出'
    };

    const target = timeMap[filter] || filter;

    let filtered;
    if (target === '微波炉' || target === '一锅出') {
        filtered = QUICK_RECIPES.filter(r => r.tags.some(t => t.includes(target)));
    } else {
        filtered = QUICK_RECIPES.filter(r => r.timeGroup === target);
    }

    if (filtered.length > 0) {
        resultCards.innerHTML = filtered.map((recipe, idx) => `
            <div class="result-card" data-recipe-id="${recipe.id}">
                <div class="result-card-img">${recipe.image}</div>
                <div class="result-card-body">
                    <h4>${recipe.title}</h4>
                    <div class="result-card-meta">
                        <span>⏱️ ${recipe.time}</span>
                        <span>📊 ${recipe.difficulty}</span>
                        <span>🔥 ${recipe.calories}</span>
                    </div>
                    <div class="result-card-actions">
                        <button class="btn-detail" onclick="openRecipeDetail('${recipe.id}')">📖 查看做法</button>
                    </div>
                </div>
            </div>
        `).join('');

        resultTitle.textContent = `${filter} 菜谱推荐`;
        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===== Recipe Detail Modal =====
function openRecipeDetail(recipeId) {
    const recipe = QUICK_RECIPES.find(r => r.id == recipeId);
    if (!recipe) return;

    document.getElementById('modalEmoji').textContent = recipe.image;
    document.getElementById('modalTitle').textContent = recipe.title;
    document.getElementById('modalMeta').textContent = `⏱️ ${recipe.time}  |  📊 ${recipe.difficulty}  |  🔥 ${recipe.calories}卡`;

    // 兼容新旧格式
    const ingredientsHtml = recipe.ingredients.map(ing => {
        if (typeof ing === 'object' && ing.name) {
            return `<li>• ${ing.name} ${ing.amount || ''}</li>`;
        }
        return `<li>• ${ing}</li>`;
    }).join('');

    document.getElementById('modalIngredients').innerHTML = ingredientsHtml;

    document.getElementById('modalSteps').innerHTML = recipe.steps.map(
        step => `<li>${step}</li>`
    ).join('');

    recipeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    recipeModal.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== Load more recipes =====
function handleLoadMore() {
    const startIdx = recipeGrid.querySelectorAll('.recipe-card').length;
    const moreRecipes = QUICK_RECIPES.slice(startIdx, startIdx + 12);
    const newCards = moreRecipes.map(r => createRecipeCard(r)).join('');
    recipeGrid.insertAdjacentHTML('beforeend', newCards);
}

// ===== Utility =====
function pickRandom(arr, count) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SITE_ID, QUICK_RECIPES, generateQuickMeal };
}
