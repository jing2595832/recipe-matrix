/**
 * 宝宝辅食乐园 - Kid Nutrition Site
 * 马卡龙粉蓝配色主题 - Macaron Pink & Blue Theme
 * Auto Meal Plan Generator
 */

// Site Configuration
const SITE_ID = 'kid-nutrition';
const SITE_CONFIG = {
    SITE_ID: 'kid-nutrition',
    SITE_NAME: '宝宝辅食乐园',
    SITE_TAGLINE: '健康营养每一天'
};

// 宝宝辅食菜谱数据（含食材和步骤）
const KID_RECIPES = [
    {
        id: 1,
        title: '南瓜泥米糊',
        image: '🎃',
        time: '15分钟',
        difficulty: '简单',
        calories: '80卡',
        tags: ['6-8个月', '蔬菜', '初添'],
        ageGroup: '6-8个月',
        type: 'dish',
        allergens: ['无常见过敏原'],
        ingredients: [
            '南瓜 50g（去皮去籽）',
            '婴儿米粉 20g',
            '温水 适量（约60ml）'
        ],
        steps: [
            '南瓜去皮去籽，切成小块',
            '上锅蒸15分钟至软烂',
            '取出南瓜放入研磨碗，加少量温水研磨成细腻泥状',
            '婴儿米粉用温水冲调均匀',
            '将南瓜泥拌入米糊中，搅拌均匀即可'
        ]
    },
    {
        id: 2,
        title: '胡萝卜苹果泥',
        image: '🥕',
        time: '20分钟',
        difficulty: '简单',
        calories: '65卡',
        tags: ['6-8个月', '蔬果', '维A'],
        ageGroup: '6-8个月',
        type: 'dish',
        allergens: ['无常见过敏原'],
        ingredients: [
            '胡萝卜 30g',
            '苹果 半个（约50g）',
            '温水 少许'
        ],
        steps: [
            '胡萝卜去皮切薄片，苹果去皮去核切小块',
            '胡萝卜上锅蒸10分钟至软烂',
            '苹果用研磨碗磨成细腻果泥',
            '将蒸好的胡萝卜研磨成泥',
            '混合胡萝卜泥和苹果泥，加少许温水调匀'
        ]
    },
    {
        id: 3,
        title: '蛋黄粥',
        image: '🥚',
        time: '25分钟',
        difficulty: '简单',
        calories: '95卡',
        tags: ['9-12个月', '蛋白质', '补铁'],
        ageGroup: '9-12个月',
        type: 'dish',
        allergens: ['鸡蛋 Egg'],
        ingredients: [
            '大米 30g',
            '鸡蛋 1个（取蛋黄）',
            '清水 200ml'
        ],
        steps: [
            '大米淘洗干净，加水大火煮开后转小火',
            '慢熬约20分钟至粥变得浓稠',
            '鸡蛋煮熟，取出蛋黄压碎',
            '将蛋黄碎拌入粥中，搅拌均匀',
            '稍煮1-2分钟即可出锅'
        ]
    },
    {
        id: 4,
        title: '三文鱼蔬菜泥',
        image: '🐟',
        time: '30分钟',
        difficulty: '中等',
        calories: '120卡',
        tags: ['9-12个月', 'DHA', '鱼肉'],
        ageGroup: '9-12个月',
        type: 'dish',
        allergens: ['鱼类 Fish'],
        ingredients: [
            '三文鱼 30g（去刺）',
            '西兰花 2小朵',
            '胡萝卜 20g',
            '温水 少许'
        ],
        steps: [
            '三文鱼洗净，用柠檬汁腌制5分钟去腥',
            '三文鱼上锅蒸10分钟至熟透',
            '西兰花和胡萝卜分别焯水煮熟',
            '将蒸好的三文鱼研磨成泥',
            '西兰花和胡萝卜研磨成泥，与鱼泥混合，加少许温水调匀'
        ]
    },
    {
        id: 5,
        title: '鸡肉蔬菜粥',
        image: '🍲',
        time: '35分钟',
        difficulty: '中等',
        calories: '140卡',
        tags: ['1-2岁', '主食', '均衡'],
        ageGroup: '1-2岁',
        type: 'dish',
        allergens: ['鸡肉 Chicken'],
        ingredients: [
            '大米 40g',
            '鸡胸肉 30g',
            '胡萝卜 20g',
            '菠菜叶 3片',
            '清水 250ml'
        ],
        steps: [
            '大米淘洗干净，鸡胸肉切小丁用姜片腌制去腥',
            '锅中加水煮开后放入大米，大火煮沸转小火',
            '熬煮15分钟后加入鸡肉丁',
            '胡萝卜切小丁，10分钟后加入锅中',
            '菠菜焯水切碎，出锅前拌入粥中，再煮2分钟即可'
        ]
    },
    {
        id: 6,
        title: '牛肉土豆泥',
        image: '🥔',
        time: '40分钟',
        difficulty: '中等',
        calories: '160卡',
        tags: ['1-2岁', '补铁', '肉类'],
        ageGroup: '1-2岁',
        type: 'dish',
        allergens: ['牛肉 Beef'],
        ingredients: [
            '牛里脊 30g',
            '土豆 50g',
            '洋葱 10g',
            '温水 少许'
        ],
        steps: [
            '牛里脊切小块，冷水下锅焯水去血沫',
            '土豆去皮切小块，洋葱切碎',
            '牛肉加少许水炖煮25分钟至软烂',
            '土豆上锅蒸15分钟至软烂',
            '将牛肉、土豆、洋葱一起研磨成泥，加少许原汤调匀'
        ]
    },
    {
        id: 7,
        title: '彩色蔬菜面',
        image: '🍜',
        time: '20分钟',
        difficulty: '简单',
        calories: '130卡',
        tags: ['2岁以上', '主食', '多彩'],
        ageGroup: '2岁以上',
        type: 'dish',
        allergens: ['小麦 Wheat', '鸡蛋 Egg'],
        ingredients: [
            '婴儿面条 40g',
            '西红柿 半个',
            '胡萝卜 20g',
            '西兰花 2小朵',
            '鸡蛋 1个'
        ],
        steps: [
            '面条折短，西红柿去皮切碎，胡萝卜切丁，西兰花切小朵',
            '锅中烧水，水开后下面条煮3分钟捞出',
            '另起锅加少许油，放入西红柿炒出汁',
            '加入胡萝卜丁翻炒，加适量水煮开',
            '打入鸡蛋搅散成蛋花，放入面条和西兰花，煮2分钟即可'
        ]
    },
    {
        id: 8,
        title: '鲜虾蔬菜饼',
        image: '🦐',
        time: '25分钟',
        difficulty: '中等',
        calories: '110卡',
        tags: ['2岁以上', '手指食物', '补钙'],
        ageGroup: '2岁以上',
        type: 'dish',
        allergens: ['虾类 Shrimp', '鸡蛋 Egg', '小麦 Wheat'],
        ingredients: [
            '鲜虾 3只（去壳去虾线）',
            '鸡蛋 1个',
            '面粉 30g',
            '胡萝卜 15g',
            '葱花 少许'
        ],
        steps: [
            '鲜虾去壳去虾线，剁成虾泥',
            '胡萝卜擦细丝，焯水沥干',
            '鸡蛋打散，加入面粉搅拌成糊',
            '放入虾泥、胡萝卜丝、葱花拌匀',
            '平底锅刷少许油，小火倒入面糊摊成小饼，两面煎至金黄即可'
        ]
    }
];

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
    const allergyHtml = showAllergy && recipe.allergens[0] !== '无常见过敏原'
        ? `<div class="allergy-alert"><strong>⚠️ 过敏原提示 Allergy Alert:</strong> ${recipe.allergens.join(', ')}</div>`
        : '';

    modalInner.innerHTML = `
        <div class="modal-emoji">${recipe.image}</div>
        <div class="modal-title">${recipe.title}</div>
        <div class="modal-meta">
            <span>⏱️ ${recipe.time}</span>
            <span>📊 ${recipe.difficulty}</span>
            <span>🔥 ${recipe.calories}</span>
            <span>👶 ${recipe.ageGroup}</span>
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
        ${allergyHtml}
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
    const moreRecipes = KID_RECIPES.map(r => ({
        ...r,
        id: r.id + 100,
        title: r.title + ' (新做法)'
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
    module.exports = { SITE_CONFIG, KID_RECIPES, initApp };
}
