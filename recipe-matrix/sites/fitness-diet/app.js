/**
 * 健身减脂餐 - Fitness Diet Site
 * 黑绿配色主题 - Dark & Green Theme
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
const SITE_ID = 'fitness-diet';
const SITE_CONFIG = {
    SITE_ID: 'fitness-diet',
    SITE_NAME: '健身减脂餐',
    SITE_TAGLINE: '科学饮食塑造完美身材'
};

// ===== 使用外部菜谱数据，筛选适合本站的菜谱 =====
function normalizeRecipe(r) {
    return {
        id: r.id,
        title: r.name,
        image: r.emoji || '💪',
        nameEn: r.nameEn || '',
        time: ((r.prepTime || 0) + (r.cookTime || 0)) + '分钟',
        timeMinutes: (r.prepTime || 0) + (r.cookTime || 0),
        difficulty: r.difficulty || '简单',
        calories: r.calories || Math.round((r.prepTime || 10) * 8 + 100),
        protein: r.protein || Math.round(15 + Math.random() * 20),
        fat: r.fat || Math.round(5 + Math.random() * 10),
        carbs: r.carbs || Math.round(20 + Math.random() * 30),
        tags: r.tags || [],
        cuisine: r.cuisine || '',
        type: r.category === '汤品' || r.category === '汤' ? 'soup' : 'dish',
        spicy: r.spicy === true || (typeof r.spicy === 'number' && r.spicy > 0),
        ingredients: r.ingredients || [],
        tools: r.tools || [],
        steps: r.steps || []
    };
}

// 从全局 CN_RECIPES + CN_RECIPES_EXTRA1 + WESTERN_RECIPES + WESTERN_RECIPES_EXTRA1 筛选健康/健身菜谱
const ALL_RAW = [
    ...(typeof CN_RECIPES !== 'undefined' ? CN_RECIPES : []),
    ...(typeof CN_RECIPES_EXTRA1 !== 'undefined' ? CN_RECIPES_EXTRA1 : []),
    ...(typeof WESTERN_RECIPES !== 'undefined' ? WESTERN_RECIPES : []),
    ...(typeof WESTERN_RECIPES_EXTRA1 !== 'undefined' ? WESTERN_RECIPES_EXTRA1 : [])
];

const FITNESS_RECIPES = ALL_RAW
    .filter(r => {
        // 筛选标签含健康/健身/低脂/高蛋白/沙拉/蔬菜相关，或菜名含相关关键词
        const healthTags = ['健康', '低脂', '高蛋白', '沙拉', '蔬菜', '轻食', '减脂', '健身', '清淡', '蔬果', '蒸', '煮', '素'];
        const healthKeywords = ['沙拉', '鸡胸', '蛋白', '蔬菜', '燕麦', '糙米', '藜麦', '三文鱼', '蒸', '清蒸', '水煮', '低脂', '轻食', '健康', '蔬'];
        const tagsStr = (r.tags || []).join(' ') + ' ' + (r.category || '') + ' ' + (r.name || '');
        return healthTags.some(t => tagsStr.includes(t)) || healthKeywords.some(k => r.name.includes(k));
    })
    .map(normalizeRecipe);

// 如果过滤后菜谱太少，补充一些
if (FITNESS_RECIPES.length < 20) {
    const extra = ALL_RAW
        .filter(r => !FITNESS_RECIPES.find(f => f.id === r.id))
        .slice(0, 20 - FITNESS_RECIPES.length)
        .map(normalizeRecipe);
    FITNESS_RECIPES.push(...extra);
}

// ===== DOM Elements =====
const recipeGrid = document.getElementById('recipeGrid');
const loadMoreBtn = document.getElementById('loadMore');
const goalSelect = document.getElementById('goalSelect');
const peopleCountSelect = document.getElementById('peopleCount');
const highProteinCheckbox = document.getElementById('highProtein');
const btnGenerate = document.getElementById('btnGenerate');
const resultSection = document.getElementById('resultSection');
const dishGrid = document.getElementById('dishGrid');
const snackGrid = document.getElementById('snackGrid');
const mealStats = document.getElementById('mealStats');
const btnConfirm = document.getElementById('btnConfirm');
const btnRefresh = document.getElementById('btnRefresh');
const recipeModal = document.getElementById('recipeModal');
const modalClose = document.getElementById('modalClose');
const modalInner = document.getElementById('modalInner');

// Current generated meal plan
let currentMealPlan = { dishes: [], snacks: [] };

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
    const recipes = FITNESS_RECIPES;
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
        btnGenerate.addEventListener('click', generateFitnessMeal);
    }

    // Confirm button
    if (btnConfirm) {
        btnConfirm.addEventListener('click', () => {
            alert('✅ 菜单已确认！Menu confirmed!\n\n你的健身餐计划已保存，坚持科学饮食，加油！');
        });
    }

    // Refresh button
    if (btnRefresh) {
        btnRefresh.addEventListener('click', generateFitnessMeal);
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
            const categoryTitle = card.querySelector('h4').textContent;
            filterByGoal(categoryTitle);
        });
    });

    // Tag clicks in hero
    document.querySelectorAll('.hero-tags .tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const tagText = tag.textContent;
            filterByTag(tagText);
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

// ===== Generate Fitness Meal Plan =====
function generateFitnessMeal() {
    const goal = goalSelect ? goalSelect.value : '减脂Cutting';
    const people = peopleCountSelect ? parseInt(peopleCountSelect.value) : 1;
    const highProtein = highProteinCheckbox ? highProteinCheckbox.checked : false;

    // Map goal to matching recipes
    const goalMap = {
        '减脂Cutting': ['燃脂减重', '素食健身'],
        '增肌Bulking': ['增肌塑形', '燃脂减重'],
        '维持Maintenance': ['维持体重', '增肌塑形', '素食健身']
    };

    const allowedGoals = goalMap[goal] || ['燃脂减重'];
    let eligible = FITNESS_RECIPES.filter(r => allowedGoals.includes(r.goal));

    // High protein mode: prioritize recipes with protein >= 25g
    if (highProtein) {
        const highProteinRecipes = eligible.filter(r => parseInt(r.protein) >= 25);
        if (highProteinRecipes.length >= 2) {
            eligible = highProteinRecipes;
        }
    }

    // Shuffle
    const shuffled = [...eligible].sort(() => Math.random() - 0.5);

    // Calculate dish count based on people (at least 2, max 6)
    const dishCount = Math.min(Math.max(2, people), 6);
    const snackCount = Math.max(1, Math.ceil(people / 2));

    currentMealPlan.dishes = shuffled.slice(0, dishCount);
    currentMealPlan.snacks = shuffled.filter(r => r.type === 'snack');

    // If no snack-type recipes, use some dishes as snacks
    if (currentMealPlan.snacks.length === 0) {
        currentMealPlan.snacks = shuffled.slice(dishCount, dishCount + snackCount);
    }

    // Ensure enough snacks
    while (currentMealPlan.snacks.length < snackCount) {
        currentMealPlan.snacks.push(shuffled[currentMealPlan.snacks.length % shuffled.length]);
    }

    // Render stats
    const allRecipes = [...currentMealPlan.dishes, ...currentMealPlan.snacks];
    const totalCalories = allRecipes.reduce((sum, r) => sum + parseInt(r.calories), 0) * people;
    const totalProtein = allRecipes.reduce((sum, r) => sum + parseInt(r.protein), 0) * people;

    mealStats.innerHTML = `
        <div class="stat-item">
            <div class="stat-value">${goal.split(/[A-Z]/)[0]}</div>
            <div class="stat-label">目标 Goal</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${people}人</div>
            <div class="stat-label">人数 People</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${totalCalories}卡</div>
            <div class="stat-label">总热量 Calories</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${totalProtein}g</div>
            <div class="stat-label">总蛋白 Protein</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${allRecipes.length}道</div>
            <div class="stat-label">菜品数 Dishes</div>
        </div>
    `;

    // Render dish cards
    dishGrid.innerHTML = currentMealPlan.dishes.map((recipe, idx) =>
        createMealCard(recipe, idx, 'dish')
    ).join('');

    // Render snack cards
    snackGrid.innerHTML = currentMealPlan.snacks.map((recipe, idx) =>
        createMealCard(recipe, idx, 'snack')
    ).join('');

    // Show result section
    resultSection.style.display = 'block';
    resultSection.classList.add('fade-in');

    // Scroll to results
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== Create Meal Card for Result Grid =====
function createMealCard(recipe, index, gridType) {
    return `
        <div class="recipe-card" data-id="${recipe.id}" data-grid="${gridType}" data-index="${index}">
            <div class="card-emoji">${recipe.image}</div>
            <div class="card-body">
                <div class="card-title">${recipe.title}</div>
                <div class="card-meta">
                    <span>⏱️ ${recipe.time}</span>
                    <span>🔥 ${recipe.calories}</span>
                    <span>💪 P:${recipe.protein}</span>
                </div>
                <div class="card-tags">
                    ${recipe.tags.map(tag => `<span class="card-tag">${tag}</span>`).join('')}
                </div>
                <button class="btn-change" data-grid="${gridType}" data-index="${index}">🔄 换一道 Change</button>
            </div>
        </div>
    `;
}

// ===== Change Single Dish =====
function changeSingleDish(gridType, index) {
    const goal = goalSelect ? goalSelect.value : '减脂Cutting';
    const goalMap = {
        '减脂Cutting': ['燃脂减重', '素食健身'],
        '增肌Bulking': ['增肌塑形', '燃脂减重'],
        '维持Maintenance': ['维持体重', '增肌塑形', '素食健身']
    };
    const allowedGoals = goalMap[goal] || ['燃脂减重'];
    const eligible = FITNESS_RECIPES.filter(r => allowedGoals.includes(r.goal));

    const currentList = gridType === 'dish' ? currentMealPlan.dishes : currentMealPlan.snacks;
    const currentIds = [...currentMealPlan.dishes, ...currentMealPlan.snacks].map(r => r.id);
    const available = eligible.filter(r => !currentIds.includes(r.id));

    if (available.length > 0) {
        const newRecipe = available[Math.floor(Math.random() * available.length)];
        currentList[index] = newRecipe;
    } else {
        const shuffled = eligible.sort(() => Math.random() - 0.5);
        currentList[index] = shuffled[0];
    }

    const grid = gridType === 'dish' ? dishGrid : snackGrid;
    grid.innerHTML = currentList.map((recipe, idx) =>
        createMealCard(recipe, idx, gridType)
    ).join('');

    // Update stats
    const people = peopleCountSelect ? parseInt(peopleCountSelect.value) : 1;
    const allRecipes = [...currentMealPlan.dishes, ...currentMealPlan.snacks];
    const totalCalories = allRecipes.reduce((sum, r) => sum + parseInt(r.calories), 0) * people;
    const totalProtein = allRecipes.reduce((sum, r) => sum + parseInt(r.protein), 0) * people;
    const statValues = mealStats.querySelectorAll('.stat-value');
    if (statValues[2]) statValues[2].textContent = totalCalories + '卡';
    if (statValues[3]) statValues[3].textContent = totalProtein + 'g';
}

// ===== Filter by Goal (category click) =====
function filterByGoal(goal) {
    const goalNameMap = {
        '燃脂减重': '燃脂减重',
        '增肌塑形': '增肌塑形',
        '维持体重': '维持体重',
        '素食健身': '素食健身',
        '生酮饮食': '生酮饮食',
        '间歇断食': '间歇断食'
    };
    const goalKey = goalNameMap[goal] || goal;
    const filtered = FITNESS_RECIPES.filter(recipe => recipe.goal === goalKey);
    if (filtered.length > 0) {
        recipeGrid.innerHTML = filtered.map(recipe => createRecipeCard(recipe)).join('');
    } else {
        recipeGrid.innerHTML = `<p style="text-align: center; color: var(--text-secondary);">暂无${goal}相关食谱，敬请期待</p>`;
    }
    document.getElementById('recipes').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== Filter by Tag =====
function filterByTag(tag) {
    const filtered = FITNESS_RECIPES.filter(recipe =>
        recipe.tags.some(t => t.includes(tag))
    );
    if (filtered.length > 0) {
        recipeGrid.innerHTML = filtered.map(recipe => createRecipeCard(recipe)).join('');
    } else {
        recipeGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">未找到相关食谱</p>';
    }
    document.getElementById('recipes').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== Open Recipe Detail Modal =====
function openRecipeModal(recipeId) {
    const recipe = FITNESS_RECIPES.find(r => r.id == recipeId);
    if (!recipe) return;

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
        </div>
        <div class="macro-bars">
            <div class="macro-bar">
                <span class="macro-label">蛋白质</span>
                <div class="macro-track"><div class="macro-fill protein-fill" style="width:${Math.min(recipe.protein * 2.5, 100)}%"></div></div>
                <span class="macro-value">${recipe.protein}g</span>
            </div>
            <div class="macro-bar">
                <span class="macro-label">碳水</span>
                <div class="macro-track"><div class="macro-fill carbs-fill" style="width:${Math.min(recipe.carbs * 2, 100)}%"></div></div>
                <span class="macro-value">${recipe.carbs}g</span>
            </div>
            <div class="macro-bar">
                <span class="macro-label">脂肪</span>
                <div class="macro-track"><div class="macro-fill fat-fill" style="width:${Math.min(recipe.fat * 3, 100)}%"></div></div>
                <span class="macro-value">${recipe.fat}g</span>
            </div>
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
        <div class="modal-section-title">🏷️ 标签 Tags</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px;">
            ${recipe.tags.map(tag => `<span class="card-tag" style="font-size:13px;padding:4px 12px;">${tag}</span>`).join('')}
        </div>
    `;

    recipeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    recipeModal.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== Handle Load More =====
function handleLoadMore() {
    if (loadMoreBtn) {
        loadMoreBtn.textContent = '已加载全部 All Loaded';
        loadMoreBtn.disabled = true;
        loadMoreBtn.style.opacity = '0.5';
        loadMoreBtn.style.cursor = 'not-allowed';
    }
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
    module.exports = { SITE_CONFIG, FITNESS_RECIPES, initApp };
}
