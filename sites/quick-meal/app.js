/**
 * 懒人快手餐 - Quick Meal Site
 * 浅蓝配色主题 - Light Blue Theme
 * Auto Meal Plan Generator
 */

const SITE_ID = 'quick-meal';

// 懒人快手餐菜谱数据（含食材和步骤）
const QUICK_RECIPES = [
    {
        id: 1,
        title: '黄金蛋炒饭',
        image: '🍚',
        time: '5分钟',
        difficulty: '简单',
        calories: '350卡',
        tags: ['剩饭改造', '快手', '主食'],
        timeGroup: '5分钟',
        timeMinutes: 5,
        microwave: false,
        ingredients: ['隔夜米饭 1碗', '鸡蛋 2个', '葱花 适量', '盐 1小勺', '食用油 1汤匙', '酱油 少许'],
        steps: ['鸡蛋打散备用', '锅中热油，倒入蛋液快速翻炒至半凝固', '加入米饭，大火翻炒至粒粒分明', '加盐和少许酱油调味', '撒葱花翻炒均匀即可出锅']
    },
    {
        id: 2,
        title: '微波炉蒸蛋',
        image: '🥚',
        time: '3分钟',
        difficulty: '简单',
        calories: '120卡',
        tags: ['微波炉', '高蛋白', '早餐'],
        timeGroup: '5分钟',
        timeMinutes: 3,
        microwave: true,
        ingredients: ['鸡蛋 2个', '温水 200ml', '生抽 1小勺', '香油 几滴', '葱花 少许'],
        steps: ['鸡蛋打入碗中，加入温水搅拌均匀', '用滤网过滤蛋液去除气泡', '碗上盖保鲜膜，扎几个小孔', '微波炉中高火加热2-3分钟', '取出后淋上生抽和香油，撒葱花']
    },
    {
        id: 3,
        title: '番茄鸡蛋面',
        image: '🍜',
        time: '10分钟',
        difficulty: '简单',
        calories: '380卡',
        tags: ['经典', '面食', '家常'],
        timeGroup: '10分钟',
        timeMinutes: 10,
        microwave: false,
        ingredients: ['挂面 1把', '番茄 1个', '鸡蛋 1个', '青菜 适量', '盐 适量', '食用油 少许', '葱花 少许'],
        steps: ['番茄切块，鸡蛋打散', '锅中热油，倒入蛋液炒散盛出', '锅中再加少许油，放入番茄块翻炒出汁', '加入适量清水烧开，放入挂面', '面快熟时加入炒好的鸡蛋和青菜', '加盐调味，撒葱花出锅']
    },
    {
        id: 4,
        title: '蒜蓉西兰花',
        image: '🥦',
        time: '8分钟',
        difficulty: '简单',
        calories: '80卡',
        tags: ['素食', '健康', '快手'],
        timeGroup: '10分钟',
        timeMinutes: 8,
        microwave: false,
        ingredients: ['西兰花 1小朵', '蒜 3瓣', '盐 适量', '蚝油 1汤匙', '食用油 少许'],
        steps: ['西兰花掰成小朵，清水浸泡5分钟', '烧开水，加少许盐和油，焯水2分钟捞出', '蒜切末', '锅中热油，爆香蒜末', '加入西兰花翻炒，加蚝油调味即可']
    },
    {
        id: 5,
        title: '一锅出焖饭',
        image: '🥘',
        time: '15分钟',
        difficulty: '中等',
        calories: '420卡',
        tags: ['一锅出', '主食', '省心'],
        timeGroup: '15分钟',
        timeMinutes: 15,
        microwave: false,
        ingredients: ['大米 1杯', '腊肠 1根', '土豆 1个', '胡萝卜 半根', '生抽 2汤匙', '老抽 1小勺', '食用油 少许'],
        steps: ['大米洗净浸泡10分钟', '腊肠、土豆、胡萝卜切丁', '电饭锅底刷少许油，放入大米和适量水', '铺上腊肠丁、土豆丁、胡萝卜丁', '淋上生抽和老抽', '按下煮饭键，煮好后搅拌均匀即可']
    },
    {
        id: 6,
        title: '凉拌黄瓜',
        image: '🥒',
        time: '5分钟',
        difficulty: '简单',
        calories: '45卡',
        tags: ['免开火', '凉菜', '低脂'],
        timeGroup: '5分钟',
        timeMinutes: 5,
        microwave: false,
        ingredients: ['黄瓜 2根', '蒜 3瓣', '生抽 1汤匙', '香醋 1汤匙', '白糖 半小勺', '辣椒油 适量', '香油 几滴'],
        steps: ['黄瓜拍碎切段', '蒜切末', '将生抽、香醋、白糖、辣椒油、香油调成酱汁', '酱汁浇在黄瓜上，撒上蒜末', '拌匀即可食用']
    },
    {
        id: 7,
        title: '泡面神仙吃法',
        image: '🍜',
        time: '8分钟',
        difficulty: '简单',
        calories: '450卡',
        tags: ['创意', '网红', '深夜'],
        timeGroup: '10分钟',
        timeMinutes: 8,
        microwave: false,
        ingredients: ['泡面 1包', '鸡蛋 1个', '火腿肠 1根', '青菜 适量', '番茄酱 1汤匙', '芝士片 1片（可选）'],
        steps: ['火腿肠切片，青菜洗净', '锅中烧水，放入泡面面饼煮2分钟', '加入调料包、火腿肠和青菜', '打入鸡蛋，不要搅动', '煮1分钟后关火', '可加芝士片，盖上盖子焖30秒']
    },
    {
        id: 8,
        title: '芝士焗土豆',
        image: '🧀',
        time: '10分钟',
        difficulty: '简单',
        calories: '280卡',
        tags: ['微波炉', '芝士', '美味'],
        timeGroup: '10分钟',
        timeMinutes: 10,
        microwave: true,
        ingredients: ['土豆 1个（大）', '芝士碎 适量', '黄油 1小块', '盐和黑胡椒 适量', '培根碎（可选）'],
        steps: ['土豆洗净，用叉子扎几个孔', '微波炉高火加热5-6分钟至软', '对半切开，用叉子压松土豆泥', '撒上盐、黑胡椒，放上黄油', '铺满芝士碎和培根碎', '微波炉再加热1-2分钟至芝士融化']
    }
];

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
    document.getElementById('modalMeta').textContent = `⏱️ ${recipe.time}  |  📊 ${recipe.difficulty}  |  🔥 ${recipe.calories}`;

    document.getElementById('modalIngredients').innerHTML = recipe.ingredients.map(
        ing => `<li>${ing}</li>`
    ).join('');

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

// ===== Utility =====
function pickRandom(arr, count) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SITE_ID, QUICK_RECIPES, generateQuickMeal };
}
