/**
 * 健身减脂餐 - Fitness Diet Site
 * 黑绿配色主题 - Dark & Green Theme
 * Auto Meal Plan Generator
 */

// Site Configuration
const SITE_ID = 'fitness-diet';
const SITE_CONFIG = {
    SITE_ID: 'fitness-diet',
    SITE_NAME: '健身减脂餐',
    SITE_TAGLINE: '科学饮食塑造完美身材'
};

// 健身减脂餐菜谱数据（含食材和步骤）
const FITNESS_RECIPES = [
    {
        id: 1,
        title: '香煎鸡胸肉沙拉',
        image: '🥗',
        time: '20分钟',
        difficulty: '简单',
        calories: '280卡',
        protein: '35g',
        carbs: '12g',
        fat: '10g',
        tags: ['高蛋白', '低脂', '增肌'],
        goal: '燃脂减重',
        type: 'dish',
        ingredients: [
            '鸡胸肉 150g',
            '混合生菜 100g',
            '小番茄 5个',
            '黄瓜 半根',
            '橄榄油 5ml',
            '柠檬汁 少许',
            '黑胡椒 适量',
            '海盐 适量'
        ],
        steps: [
            '鸡胸肉用海盐和黑胡椒腌制10分钟',
            '平底锅刷少许橄榄油，中火煎鸡胸肉，每面煎4-5分钟至金黄',
            '煎好后静置3分钟，斜刀切片',
            '生菜洗净沥干，小番茄对半切，黄瓜切片',
            '将所有蔬菜铺底，放上鸡胸肉片，淋上柠檬汁和橄榄油即可'
        ]
    },
    {
        id: 2,
        title: '藜麦牛油果碗',
        image: '🥑',
        time: '15分钟',
        difficulty: '简单',
        calories: '350卡',
        protein: '12g',
        carbs: '38g',
        fat: '18g',
        tags: ['健康脂肪', '高纤维', '素食'],
        goal: '维持体重',
        type: 'dish',
        ingredients: [
            '藜麦 80g（干重）',
            '牛油果 1个',
            '鹰嘴豆 50g',
            '玉米粒 30g',
            '红椒 半个',
            '柠檬汁 15ml',
            '橄榄油 10ml',
            '海盐 适量'
        ],
        steps: [
            '藜麦淘洗干净，加水煮15分钟至蓬松',
            '牛油果去核切块，红椒切丁',
            '鹰嘴豆和玉米粒煮熟沥干',
            '将藜麦铺底，摆上牛油果块、鹰嘴豆、玉米粒和红椒丁',
            '淋上柠檬汁和橄榄油，撒海盐调味即可'
        ]
    },
    {
        id: 3,
        title: '三文鱼配芦笋',
        image: '🐟',
        time: '25分钟',
        difficulty: '中等',
        calories: '320卡',
        protein: '38g',
        carbs: '6g',
        fat: '16g',
        tags: ['Omega-3', '高蛋白', '生酮'],
        goal: '增肌塑形',
        type: 'dish',
        ingredients: [
            '三文鱼排 180g',
            '芦笋 6根',
            '柠檬 半个',
            '大蒜 2瓣',
            '黄油 10g',
            '黑胡椒 适量',
            '海盐 适量'
        ],
        steps: [
            '三文鱼用厨房纸吸干水分，两面撒海盐和黑胡椒',
            '芦笋去老根，洗净沥干',
            '平底锅放黄油，中火融化后放入蒜末炒香',
            '放入三文鱼，每面煎3-4分钟至表面金黄',
            '芦笋在旁边一同煎制，挤上柠檬汁即可出锅'
        ]
    },
    {
        id: 4,
        title: '牛肉西兰花',
        image: '🥦',
        time: '30分钟',
        difficulty: '中等',
        calories: '380卡',
        protein: '40g',
        carbs: '10g',
        fat: '18g',
        tags: ['高蛋白', '低碳', '补铁'],
        goal: '增肌塑形',
        type: 'dish',
        ingredients: [
            '牛里脊 200g',
            '西兰花 150g',
            '大蒜 3瓣',
            '生抽 15ml',
            '蚝油 10ml',
            '淀粉 5g',
            '橄榄油 10ml',
            '黑胡椒 适量'
        ],
        steps: [
            '牛里脊切薄片，加生抽、淀粉和黑胡椒腌制15分钟',
            '西兰花掰成小朵，焯水2分钟捞出',
            '锅中放橄榄油，大火快炒牛肉片至变色盛出',
            '锅中留底油，爆香蒜末，放入西兰花翻炒',
            '倒回牛肉片，加蚝油翻炒均匀，出锅装盘'
        ]
    },
    {
        id: 5,
        title: '蛋白燕麦粥',
        image: '🥣',
        time: '10分钟',
        difficulty: '简单',
        calories: '250卡',
        protein: '28g',
        carbs: '30g',
        fat: '5g',
        tags: ['早餐', '高蛋白', '快手'],
        goal: '燃脂减重',
        type: 'dish',
        ingredients: [
            '即食燕麦 50g',
            '牛奶 200ml',
            '乳清蛋白粉 1勺（约25g）',
            '蓝莓 30g',
            '香蕉 半根',
            '奇亚籽 5g',
            '肉桂粉 少许'
        ],
        steps: [
            '燕麦加牛奶放入微波炉加热2分钟（或小火煮3分钟）',
            '搅拌至浓稠状，关火',
            '待燕麦粥稍凉（约60度），拌入蛋白粉搅匀',
            '倒入碗中，摆上蓝莓和香蕉切片',
            '撒上奇亚籽和肉桂粉即可享用'
        ]
    },
    {
        id: 6,
        title: '豆腐蔬菜卷',
        image: '🌯',
        time: '20分钟',
        difficulty: '中等',
        calories: '200卡',
        protein: '18g',
        carbs: '15g',
        fat: '8g',
        tags: ['素食', '高蛋白', '低卡'],
        goal: '素食健身',
        type: 'dish',
        ingredients: [
            '全麦卷饼 1张',
            '老豆腐 100g',
            '胡萝卜 半根',
            '紫甘蓝 30g',
            '黄瓜 半根',
            '花生酱 15g',
            '酱油 少许'
        ],
        steps: [
            '老豆腐切条，用酱油腌制5分钟',
            '平底锅少油，中火煎豆腐条至两面金黄',
            '胡萝卜和黄瓜切丝，紫甘蓝切细丝',
            '全麦饼微微加热使其变软',
            '铺上蔬菜丝和豆腐条，淋上花生酱，卷起切段即可'
        ]
    },
    {
        id: 7,
        title: '虾仁西葫芦面',
        image: '🍤',
        time: '15分钟',
        difficulty: '简单',
        calories: '180卡',
        protein: '30g',
        carbs: '8g',
        fat: '4g',
        tags: ['低碳', '高蛋白', '轻食'],
        goal: '燃脂减重',
        type: 'dish',
        ingredients: [
            '大虾 8只（去壳）',
            '西葫芦 2根',
            '大蒜 2瓣',
            '橄榄油 10ml',
            '柠檬汁 少许',
            '红辣椒碎 少许',
            '海盐 适量',
            '黑胡椒 适量'
        ],
        steps: [
            '大虾去壳去虾线，用海盐和黑胡椒腌制',
            '西葫芦用螺旋切割器切成面条状',
            '锅中放橄榄油，中火炒虾仁至变色盛出',
            '同一锅中爆香蒜末，放入西葫芦面翻炒2分钟（不要炒太软）',
            '倒回虾仁，挤柠檬汁，撒红辣椒碎，快速拌匀出锅'
        ]
    },
    {
        id: 8,
        title: '鸡蛋菠菜杯',
        image: '🥚',
        time: '25分钟',
        difficulty: '简单',
        calories: '220卡',
        protein: '22g',
        carbs: '4g',
        fat: '14g',
        tags: ['早餐', '高蛋白', '生酮'],
        goal: '生酮饮食',
        type: 'snack',
        ingredients: [
            '鸡蛋 3个',
            '菠菜 50g',
            '奶酪 20g',
            '培根 1片',
            '小番茄 3个',
            '黑胡椒 适量',
            '海盐 适量'
        ],
        steps: [
            '烤箱预热180度',
            '培根切碎，小火煎至酥脆',
            '菠菜焯水沥干切碎，小番茄对半切',
            '在马芬杯模具中刷少许油，打入鸡蛋',
            '放入菠菜、培根碎、小番茄和奶酪，撒海盐和黑胡椒',
            '放入烤箱烤15-18分钟至鸡蛋凝固即可'
        ]
    }
];

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

    modalInner.innerHTML = `
        <div class="modal-emoji">${recipe.image}</div>
        <div class="modal-title">${recipe.title}</div>
        <div class="modal-meta">
            <span>⏱️ ${recipe.time}</span>
            <span>📊 ${recipe.difficulty}</span>
            <span>🔥 ${recipe.calories}</span>
            <span>🎯 ${recipe.goal}</span>
        </div>
        <div class="macro-info">
            <div class="macro-item">
                <div class="macro-value">${recipe.protein}</div>
                <div class="macro-label">蛋白质 Protein</div>
            </div>
            <div class="macro-item">
                <div class="macro-value">${recipe.carbs}</div>
                <div class="macro-label">碳水 Carbs</div>
            </div>
            <div class="macro-item">
                <div class="macro-value">${recipe.fat}</div>
                <div class="macro-label">脂肪 Fat</div>
            </div>
        </div>
        <div class="modal-section-title">🥘 食材 Ingredients</div>
        <ul class="modal-ingredients">
            ${recipe.ingredients.map(ing => `<li>• ${ing}</li>`).join('')}
        </ul>
        <div class="modal-section-title">📝 制作步骤 Steps</div>
        <ol class="modal-steps">
            ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
        </ol>
        <div class="modal-section-title">🏷️ 营养标签 Tags</div>
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
    const moreRecipes = FITNESS_RECIPES.map(r => ({
        ...r,
        id: r.id + 100,
        title: r.title + ' (升级版)'
    }));
    const newCards = moreRecipes.map(recipe => createRecipeCard(recipe)).join('');
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
    module.exports = { SITE_CONFIG, FITNESS_RECIPES, initApp };
}
