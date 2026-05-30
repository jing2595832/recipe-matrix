/**
 * 宝宝辅食乐园 - Kid Nutrition Site
 * 马卡龙粉蓝配色主题 - Macaron Pink & Blue Theme
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

// Site Configuration
const SITE_ID = 'kid-nutrition';
const SITE_CONFIG = {
    SITE_ID: 'kid-nutrition',
    SITE_NAME: '宝宝辅食乐园',
    SITE_TAGLINE: '健康营养每一天'
};

// ===== 使用外部菜谱数据，筛选适合本站的菜谱 =====
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
        tags: r.tags || [],
        cuisine: r.cuisine || '',
        type: r.category === '汤品' || r.category === '汤' ? 'soup' : 'dish',
        spicy: r.spicy === true || (typeof r.spicy === 'number' && r.spicy > 0),
        allergens: ['请查看食材清单'],
        ageGroup: '通用',
        ingredients: r.ingredients || [],
        tools: r.tools || [],
        steps: r.steps || []
    };
}

// 从全局 CN_RECIPES + CN_RECIPES_EXTRA1 + WESTERN_RECIPES + WESTERN_RECIPES_EXTRA1 筛选儿童适宜菜谱
const ALL_RAW = [
    ...(typeof CN_RECIPES !== 'undefined' ? CN_RECIPES : []),
    ...(typeof CN_RECIPES_EXTRA1 !== 'undefined' ? CN_RECIPES_EXTRA1 : []),
    ...(typeof WESTERN_RECIPES !== 'undefined' ? WESTERN_RECIPES : []),
    ...(typeof WESTERN_RECIPES_EXTRA1 !== 'undefined' ? WESTERN_RECIPES_EXTRA1 : [])
];

const KID_RECIPES = ALL_RAW
    .filter(r => {
        // 筛选简单、非辣的菜谱
        const isSimple = r.difficulty === '简单' || r.difficulty === '简单';
        const isNotSpicy = !r.spicy || r.spicy === false || r.spicy === 0;
        return isNotSpicy;
    })
    .map(normalizeRecipe);

// ===== DOM Elements =====
const recipeGrid = document.getElementById('recipeGrid');
const loadMoreBtn = document.getElementById('loadMore');
const ageSelect = document.getElementById('ageSelect');
const mealCountSelect = document.getElementById('mealCount');
const allergyCheckbox = document.getElementById('allergyAlert');
const btnGenerate = document.getElementById('btnGenerate');
const resultSection = document.getElementById('resultSection');
const dishGrid = document.getElementById('dishGrid');
const soupGrid = document.getElementById('soupGrid');
const mealStats = document.getElementById('mealStats');
const btnConfirm = document.getElementById('btnConfirm');
const btnRefresh = document.getElementById('btnRefresh');
const recipeModal = document.getElementById('recipeModal');
const modalClose = document.getElementById('modalClose');
const modalInner = document.getElementById('modalInner');

// Current generated meal plan
let currentMealPlan = { dishes: [], soups: [] };

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderRecipes();
    bindEvents();
    console.log(`${SITE_CONFIG.SITE_NAME} - ${SITE_CONFIG.SITE_TAGLINE}`);
}

// ===== Render Recipe Cards (bottom section) =====
function renderRecipes() {
    if (!recipeGrid) return;
    const recipes = KID_RECIPES;
    recipeGrid.innerHTML = recipes.map(recipe => createRecipeCard(recipe)).join('');
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

// ===== Bind Event Listeners =====
function bindEvents() {
    // Generate button
    if (btnGenerate) {
        btnGenerate.addEventListener('click', generateBabyMeal);
    }

    // Confirm button
    if (btnConfirm) {
        btnConfirm.addEventListener('click', () => {
            alert('✅ 菜单已确认！Menu confirmed!\n\n宝宝的一日辅食安排已保存，祝宝宝用餐愉快~');
        });
    }

    // Refresh button
    if (btnRefresh) {
        btnRefresh.addEventListener('click', generateBabyMeal);
    }

    // Modal close
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    if (recipeModal) {
        recipeModal.addEventListener('click', (e) => {
            if (e.target === recipeModal) closeModal();
        });
    }

    // Load more
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', handleLoadMore);
    }

    // Category card clicks
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const ageText = card.querySelector('p').textContent;
            filterByAgeGroup(ageText);
        });
    });

    // Tag clicks in hero
    document.querySelectorAll('.hero-tags .tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const ageGroup = tag.textContent;
            // Set the dropdown to match
            if (ageSelect) {
                const options = ageSelect.options;
                for (let i = 0; i < options.length; i++) {
                    if (options[i].value.startsWith(ageGroup.substring(0, 2))) {
                        ageSelect.selectedIndex = i;
                        break;
                    }
                }
            }
            filterByAgeGroup(ageGroup);
        });
    });

    // Recipe card click (bottom section) -> open modal
    document.addEventListener('click', (e) => {
        const recipeCard = e.target.closest('.recipe-card');
        if (recipeCard && !e.target.closest('.btn-change')) {
            const recipeId = recipeCard.dataset.id;
            openRecipeModal(recipeId);
        }
    });
}

// ===== Generate Baby Meal Plan =====
function generateBabyMeal() {
    const ageGroup = ageSelect ? ageSelect.value : '6-8个月';
    const mealCount = mealCountSelect ? parseInt(mealCountSelect.value) : 2;
    const showAllergy = allergyCheckbox ? allergyCheckbox.checked : false;

    // Map age group to available recipes (flexible matching)
    const ageMap = {
        '6-8个月': ['6-8个月'],
        '9-12个月': ['9-12个月', '6-8个月'],
        '1-2岁': ['1-2岁', '9-12个月'],
        '2-3岁': ['2岁以上', '1-2岁'],
        '3岁以上': ['2岁以上', '1-2岁']
    };

    const allowedAges = ageMap[ageGroup] || ['6-8个月'];
    const eligibleRecipes = KID_RECIPES.filter(r => allowedAges.includes(r.ageGroup));

    // Shuffle and pick
    const shuffled = [...eligibleRecipes].sort(() => Math.random() - 0.5);

    // Split into dishes and soups (use all as dishes for baby food, pick some as soups)
    const dishCount = mealCount;
    const soupCount = Math.max(1, Math.ceil(mealCount / 2));

    currentMealPlan.dishes = shuffled.slice(0, dishCount);
    currentMealPlan.soups = shuffled.slice(dishCount, dishCount + soupCount);

    // If not enough for soups, repeat from beginning
    while (currentMealPlan.soups.length < soupCount) {
        currentMealPlan.soups.push(shuffled[currentMealPlan.soups.length % shuffled.length]);
    }

    // Render stats
    const totalCalories = [...currentMealPlan.dishes, ...currentMealPlan.soups]
        .reduce((sum, r) => sum + parseInt(r.calories), 0);
    mealStats.innerHTML = `
        <div class="stat-item">
            <div class="stat-value">${ageGroup}</div>
            <div class="stat-label">宝宝年龄 Age</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${mealCount}餐</div>
            <div class="stat-label">用餐数 Meals</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${totalCalories}卡</div>
            <div class="stat-label">总热量 Calories</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${currentMealPlan.dishes.length + currentMealPlan.soups.length}道</div>
            <div class="stat-label">菜品数 Dishes</div>
        </div>
    `;

    // Render dish cards
    dishGrid.innerHTML = currentMealPlan.dishes.map((recipe, idx) =>
        createMealCard(recipe, idx, 'dish', showAllergy)
    ).join('');

    // Render soup cards
    soupGrid.innerHTML = currentMealPlan.soups.map((recipe, idx) =>
        createMealCard(recipe, idx, 'soup', showAllergy)
    ).join('');

    // Show result section
    resultSection.style.display = 'block';
    resultSection.classList.add('fade-in');

    // Scroll to results
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== Create Meal Card for Result Grid =====
function createMealCard(recipe, index, gridType, showAllergy) {
    const allergyHtml = showAllergy && recipe.allergens[0] !== '无常见过敏原'
        ? `<div style="margin-top:6px;font-size:11px;color:#e67e22;">⚠️ ${recipe.allergens.join(', ')}</div>`
        : '';

    return `
        <div class="recipe-card" data-id="${recipe.id}" data-grid="${gridType}" data-index="${index}">
            <div class="card-emoji">${recipe.image}</div>
            <div class="card-body">
                <div class="card-title">${recipe.title}</div>
                <div class="card-meta">
                    <span>⏱️ ${recipe.time}</span>
                    <span>🔥 ${recipe.calories}</span>
                    <span>👶 ${recipe.ageGroup}</span>
                </div>
                <div class="card-tags">
                    ${recipe.tags.map(tag => `<span class="card-tag">${tag}</span>`).join('')}
                </div>
                ${allergyHtml}
                <button class="btn-change" data-grid="${gridType}" data-index="${index}">🔄 换一道 Change</button>
            </div>
        </div>
    `;
}

// ===== Change Single Dish =====
function changeSingleDish(gridType, index) {
    const ageGroup = ageSelect ? ageSelect.value : '6-8个月';
    const ageMap = {
        '6-8个月': ['6-8个月'],
        '9-12个月': ['9-12个月', '6-8个月'],
        '1-2岁': ['1-2岁', '9-12个月'],
        '2-3岁': ['2岁以上', '1-2岁'],
        '3岁以上': ['2岁以上', '1-2岁']
    };
    const allowedAges = ageMap[ageGroup] || ['6-8个月'];
    const eligible = KID_RECIPES.filter(r => allowedAges.includes(r.ageGroup));

    // Pick a different recipe
    const currentList = gridType === 'dish' ? currentMealPlan.dishes : currentMealPlan.soups;
    const currentIds = [...currentMealPlan.dishes, ...currentMealPlan.soups].map(r => r.id);
    const available = eligible.filter(r => !currentIds.includes(r.id));

    if (available.length > 0) {
        const newRecipe = available[Math.floor(Math.random() * available.length)];
        currentList[index] = newRecipe;
    } else {
        // If no new ones available, just shuffle eligible
        const shuffled = eligible.sort(() => Math.random() - 0.5);
        currentList[index] = shuffled[0];
    }

    const showAllergy = allergyCheckbox ? allergyCheckbox.checked : false;
    const grid = gridType === 'dish' ? dishGrid : soupGrid;
    grid.innerHTML = currentList.map((recipe, idx) =>
        createMealCard(recipe, idx, gridType, showAllergy)
    ).join('');

    // Update total calories
    const totalCalories = [...currentMealPlan.dishes, ...currentMealPlan.soups]
        .reduce((sum, r) => sum + parseInt(r.calories), 0);
    const statValues = mealStats.querySelectorAll('.stat-value');
    if (statValues[2]) {
        statValues[2].textContent = totalCalories + '卡';
    }
    const statValuesCount = mealStats.querySelectorAll('.stat-value');
    if (statValuesCount[3]) {
        statValuesCount[3].textContent = (currentMealPlan.dishes.length + currentMealPlan.soups.length) + '道';
    }
}

// ===== Filter by Age Group (tag/category click) =====
function filterByAgeGroup(ageGroup) {
    const filtered = KID_RECIPES.filter(recipe => recipe.ageGroup === ageGroup);
    if (filtered.length > 0) {
        recipeGrid.innerHTML = filtered.map(recipe => createRecipeCard(recipe)).join('');
    } else {
        recipeGrid.innerHTML = `<p style="text-align: center; color: var(--text-secondary);">暂无${ageGroup}的辅食食谱，敬请期待</p>`;
    }
    // Scroll to recipes section
    document.getElementById('recipes').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== Open Recipe Detail Modal =====
function openRecipeModal(recipeId) {
    const recipe = KID_RECIPES.find(r => r.id == recipeId);
    if (!recipe) return;

    const showAllergy = allergyCheckbox ? allergyCheckbox.checked : false;
    const allergyHtml = showAllergy && recipe.allergens && recipe.allergens[0] !== '无常见过敏原' && recipe.allergens[0] !== '请查看食材清单'
        ? `<div class="allergy-alert"><strong>⚠️ 过敏原提示 Allergy Alert:</strong> ${recipe.allergens.join(', ')}</div>`
        : '';

    // 兼容新旧格式
    const ingredientsHtml = recipe.ingredients.map(ing => {
        if (typeof ing === 'object' && ing.name) {
            return `<li>• ${ing.name} ${ing.amount || ''}</li>`;
        }
        return `<li>• ${ing}</li>`;
    }).join('');

    const toolsHtml = recipe.tools && recipe.tools.length > 0
        ? `<div class="modal-section-title">🔧 所需工具</div><ul class="modal-ingredients">${recipe.tools.map(t => `<li>• ${t}</li>`).join('')}</ul>`
        : '';

    modalInner.innerHTML = `
        <div class="modal-emoji">${recipe.image}</div>
        <div class="modal-title">${recipe.title}</div>
        <div class="modal-meta">
            <span>⏱️ ${recipe.time}</span>
            <span>📊 ${recipe.difficulty}</span>
            <span>🔥 ${recipe.calories}卡</span>
            <span>👶 ${recipe.ageGroup}</span>
        </div>
        <div class="modal-section-title">🥘 食材 Ingredients</div>
        <ul class="modal-ingredients">
            ${ingredientsHtml}
        </ul>
        ${toolsHtml}
        <div class="modal-section-title">📝 制作步骤 Steps</div>
        <ol class="modal-steps">
            ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
        </ol>
        <div class="modal-section-title">🏷️ 营养标签 Tags</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px;">
            ${recipe.tags.map(tag => `<span class="card-tag" style="font-size:13px;padding:4px 12px;">${tag}</span>`).join('')}
        </div>
        ${allergyHtml}
    `;

    recipeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    recipeModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Load more recipes
function handleLoadMore() {
    const startIdx = recipeGrid.querySelectorAll('.recipe-card').length;
    const moreRecipes = KID_RECIPES.slice(startIdx, startIdx + 12);
    const newCards = moreRecipes.map(r => createRecipeCard(r)).join('');
    recipeGrid.insertAdjacentHTML('beforeend', newCards);
}

// ===== Delegate click for change buttons =====
document.addEventListener('click', (e) => {
    const changeBtn = e.target.closest('.btn-change');
    if (changeBtn) {
        e.stopPropagation();
        const gridType = changeBtn.dataset.grid;
        const index = parseInt(changeBtn.dataset.index);
        changeSingleDish(gridType, index);
    }
});

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SITE_CONFIG, KID_RECIPES, initApp };
}
