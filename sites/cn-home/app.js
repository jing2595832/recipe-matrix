/**
 * 中式家常菜 - Chinese Home Cooking Site
 * 智能配餐 Auto Meal Planner
 */

const SITE_ID = 'cn-home';

// 中式家常菜菜谱数据 (含食材和步骤)
const CN_RECIPES = [
    {
        id: 1,
        title: '宫保鸡丁',
        image: '🍗',
        time: '30分钟',
        difficulty: '中等',
        calories: 320,
        caloriesText: '320卡',
        tags: ['川菜', '经典', '下饭'],
        cuisine: '川菜',
        type: 'dish',
        spicy: true,
        ingredients: ['鸡胸肉 300g', '花生米 50g', '干辣椒 8个', '花椒 1小勺', '大葱 2根', '姜 3片', '蒜 3瓣', '生抽 2勺', '醋 1勺', '白糖 1勺', '淀粉 1勺', '料酒 1勺'],
        steps: [
            '鸡胸肉切成1.5cm小丁，加入料酒、生抽、淀粉腌制15分钟',
            '花生米用小火慢炒至金黄酥脆，盛出备用',
            '干辣椒剪成小段去籽，花椒备好，大葱切丁，姜蒜切末',
            '调碗汁：生抽、醋、白糖、淀粉加少许水搅匀',
            '锅中热油，放入鸡丁滑炒至变色盛出',
            '锅中留底油，小火爆香花椒和干辣椒',
            '放入姜蒜末爆香，倒回鸡丁大火翻炒',
            '淋入碗汁快速翻炒均匀，最后撒入花生米和葱段翻匀出锅'
        ]
    },
    {
        id: 2,
        title: '麻婆豆腐',
        image: '🥘',
        time: '20分钟',
        difficulty: '简单',
        calories: 180,
        caloriesText: '180卡',
        tags: ['川菜', '素食', '麻辣'],
        cuisine: '川菜',
        type: 'dish',
        spicy: true,
        ingredients: ['嫩豆腐 1盒(400g)', '猪肉末 100g', '郫县豆瓣酱 2勺', '花椒粉 1小勺', '豆豉 1勺', '蒜苗 2根', '姜 2片', '蒜 2瓣', '生抽 1勺', '淀粉 1勺'],
        steps: [
            '嫩豆腐切成2cm方块，放入加了盐的开水中焯烫2分钟，沥干备用',
            '蒜苗切成马耳朵段，姜蒜切末',
            '锅中热油，放入猪肉末炒散炒至出油',
            '加入郫县豆瓣酱和豆豉，小火炒出红油',
            '加入姜蒜末炒香，倒入适量清水烧开',
            '轻轻放入豆腐块，小火煮3-5分钟让豆腐入味',
            '淋入水淀粉勾芡，轻轻推匀（不要搅拌防碎）',
            '出锅后撒上花椒粉和蒜苗段即可'
        ]
    },
    {
        id: 3,
        title: '红烧肉',
        image: '🥩',
        time: '90分钟',
        difficulty: '中等',
        calories: 450,
        caloriesText: '450卡',
        tags: ['鲁菜', '经典', '家常'],
        cuisine: '鲁菜',
        type: 'dish',
        spicy: false,
        ingredients: ['五花肉 500g', '冰糖 30g', '生抽 3勺', '老抽 1勺', '料酒 2勺', '八角 2个', '桂皮 1小块', '香叶 2片', '姜 4片', '葱段 3段'],
        steps: [
            '五花肉切成3cm见方的块，冷水下锅焯水去血沫，捞出洗净',
            '锅中不放油，放入五花肉块小火煸炒至表面微黄出油',
            '将肉拨到一边，放入冰糖小火炒至焦糖色',
            '将肉和糖色翻炒均匀，加入料酒、生抽、老抽翻炒上色',
            '加入八角、桂皮、香叶、姜片、葱段炒香',
            '倒入没过肉的开水，大火烧开后转小火炖60分钟',
            '最后大火收汁至汤汁浓稠包裹住肉块即可'
        ]
    },
    {
        id: 4,
        title: '糖醋排骨',
        image: '🍖',
        time: '45分钟',
        difficulty: '中等',
        calories: 380,
        caloriesText: '380卡',
        tags: ['苏菜', '酸甜', '下饭'],
        cuisine: '苏菜',
        type: 'dish',
        spicy: false,
        ingredients: ['小排 500g', '白糖 3勺', '香醋 3勺', '生抽 2勺', '料酒 2勺', '番茄酱 1勺', '姜 3片', '葱段 2段', '白芝麻 适量', '盐 少许'],
        steps: [
            '小排剁成4cm小段，冷水下锅加姜片料酒焯水，捞出洗净',
            '锅中热少许油，放入排骨煎至两面微黄',
            '加入生抽、料酒翻炒均匀',
            '倒入没过排骨的热水，大火烧开后转小火炖30分钟',
            '调糖醋汁：白糖、香醋、番茄酱、少许盐搅匀',
            '排骨炖至软烂后，倒入糖醋汁',
            '大火收汁至汤汁浓稠，不断翻炒让每块排骨均匀裹汁',
            '出锅装盘，撒上白芝麻和葱花点缀'
        ]
    },
    {
        id: 5,
        title: '清蒸鲈鱼',
        image: '🐟',
        time: '25分钟',
        difficulty: '简单',
        calories: 150,
        caloriesText: '150卡',
        tags: ['粤菜', '清淡', '健康'],
        cuisine: '粤菜',
        type: 'dish',
        spicy: false,
        ingredients: ['鲈鱼 1条(约500g)', '葱丝 适量', '姜丝 适量', '红椒丝 少许', '蒸鱼豉油 3勺', '料酒 1勺', '食用油 2勺'],
        steps: [
            '鲈鱼去鳞去内脏洗净，在鱼身两面各划3刀',
            '鱼身抹少许料酒和盐，塞入姜片腌制10分钟',
            '盘底铺上葱段和姜片，放上鲈鱼',
            '蒸锅水烧开后，放入鱼大火蒸8-10分钟',
            '蒸好后倒掉盘中的蒸鱼水，去掉葱姜',
            '鱼身上重新铺上葱丝、姜丝和红椒丝',
            '淋上蒸鱼豉油',
            '另起锅烧热油至冒烟，浇在鱼身的葱姜丝上激出香味'
        ]
    },
    {
        id: 6,
        title: '回锅肉',
        image: '🥓',
        time: '35分钟',
        difficulty: '中等',
        calories: 420,
        caloriesText: '420卡',
        tags: ['川菜', '经典', '香辣'],
        cuisine: '川菜',
        type: 'dish',
        spicy: true,
        ingredients: ['五花肉 400g', '青蒜苗 3根', '青椒 2个', '郫县豆瓣酱 2勺', '甜面酱 1勺', '生抽 1勺', '料酒 1勺', '姜 3片', '花椒 10粒'],
        steps: [
            '五花肉整块冷水下锅，加姜片、花椒、料酒煮至八成熟（筷子能插入）',
            '捞出晾凉后切成薄片（约3mm厚）',
            '青蒜苗斜切成段，蒜白蒜叶分开，青椒切片',
            '锅中不放油，放入五花肉片小火煸炒至出油卷曲',
            '将肉推到一边，放入豆瓣酱炒出红油',
            '加入甜面酱和生抽翻炒均匀',
            '先放入蒜白和青椒翻炒1分钟',
            '最后放入蒜叶段大火快速翻炒几下即可出锅'
        ]
    },
    {
        id: 7,
        title: '东坡肉',
        image: '🍲',
        time: '120分钟',
        difficulty: '困难',
        calories: 520,
        caloriesText: '520卡',
        tags: ['浙菜', '传统', '名菜'],
        cuisine: '浙菜',
        type: 'dish',
        spicy: false,
        ingredients: ['带皮五花肉 600g', '绍兴黄酒 300ml', '冰糖 40g', '生抽 3勺', '老抽 1勺', '葱 5根', '姜 5片', '八角 2个', '桂皮 1小块'],
        steps: [
            '五花肉切成5cm大方块，冷水下锅焯水5分钟，捞出洗净',
            '砂锅底部铺上竹篾或葱段，放上肉块（皮朝下）',
            '加入冰糖、生抽、老抽、八角、桂皮、姜片',
            '倒入绍兴黄酒，没过肉块',
            '大火烧开后转最小火，慢炖90分钟',
            '中途翻面一次，确保均匀上色',
            '炖至肉质酥烂、筷子轻松插入',
            '开盖转大火收汁，汤汁浓稠后皮朝上装盘'
        ]
    },
    {
        id: 8,
        title: '白切鸡',
        image: '🍗',
        time: '40分钟',
        difficulty: '中等',
        calories: 200,
        caloriesText: '200卡',
        tags: ['粤菜', '清淡', '经典'],
        cuisine: '粤菜',
        type: 'dish',
        spicy: false,
        ingredients: ['三黄鸡 1只(约1.2kg)', '姜 1大块', '葱 4根', '料酒 2勺', '冰水 1大盆', '姜蓉 适量', '葱油 适量', '生抽 适量'],
        steps: [
            '整鸡清洗干净，去除内脏和鸡屁股',
            '锅中烧一大锅水，放入姜片、葱段、料酒烧开',
            '提着鸡头将鸡身浸入开水中烫烫5秒，提起，重复3次（三提三放）',
            '整鸡放入水中，水再次烧开后转小火（保持水面微沸不翻滚），煮20分钟',
            '煮好后立即捞出放入冰水中浸泡10分钟（皮脆的关键）',
            '取出沥干，表面刷一层薄薄的葱油增亮',
            '斩件装盘，配姜蓉蘸料（姜末+盐+少许糖+热油浇淋）'
        ]
    }
];

// 汤品数据
const CN_SOUPS = [
    {
        id: 101,
        title: '番茄蛋花汤',
        image: '🍅',
        time: '15分钟',
        difficulty: '简单',
        calories: 80,
        caloriesText: '80卡',
        tags: ['家常', '快手', '清淡'],
        cuisine: '家常',
        type: 'soup',
        spicy: false,
        ingredients: ['番茄 2个', '鸡蛋 2个', '葱花 适量', '盐 适量', '香油 少许', '淀粉水 1勺'],
        steps: [
            '番茄顶部划十字，开水烫后去皮，切成小块',
            '鸡蛋打散备用',
            '锅中热少许油，放入番茄块炒出红汤',
            '加入适量清水烧开，煮5分钟至番茄软烂',
            '淋入淀粉水勾薄芡',
            '转圈淋入蛋液，等10秒后轻轻搅散成蛋花',
            '加盐调味，撒葱花，淋香油出锅'
        ]
    },
    {
        id: 102,
        title: '紫菜虾皮汤',
        image: '🥣',
        time: '10分钟',
        difficulty: '简单',
        calories: 45,
        caloriesText: '45卡',
        tags: ['家常', '快手', '补钙'],
        cuisine: '家常',
        type: 'soup',
        spicy: false,
        ingredients: ['紫菜 10g', '虾皮 15g', '鸡蛋 1个', '姜 2片', '盐 适量', '香油 少许', '葱花 适量'],
        steps: [
            '紫菜撕成小块，用清水快速冲洗后沥干',
            '虾皮用清水泡2分钟后沥干',
            '锅中烧水，放入姜片煮开',
            '放入紫菜和虾皮，煮1-2分钟',
            '淋入打散的蛋液，轻轻搅散',
            '加盐调味，淋香油，撒葱花即可'
        ]
    },
    {
        id: 103,
        title: '酸辣汤',
        image: '🌶️',
        time: '25分钟',
        difficulty: '中等',
        calories: 120,
        caloriesText: '120卡',
        tags: ['川菜', '酸辣', '开胃'],
        cuisine: '川菜',
        type: 'soup',
        spicy: true,
        ingredients: ['豆腐 1块', '木耳 适量', '鸡蛋 1个', '胡萝卜 半根', '香菇 3朵', '醋 3勺', '白胡椒粉 1勺', '淀粉 2勺', '生抽 1勺', '香油 少许'],
        steps: [
            '豆腐、木耳、胡萝卜、香菇全部切成细丝',
            '锅中热油，放入胡萝卜丝和香菇丝炒软',
            '加入适量清水烧开，放入豆腐丝和木耳丝煮3分钟',
            '加入生抽、醋、白胡椒粉调味',
            '淋入水淀粉勾浓芡，不断搅拌',
            '转圈淋入蛋液，形成蛋花',
            '出锅前淋香油，撒香菜末'
        ]
    },
    {
        id: 104,
        title: '冬瓜排骨汤',
        image: '🥘',
        time: '60分钟',
        difficulty: '简单',
        calories: 160,
        caloriesText: '160卡',
        tags: ['家常', '清淡', '滋补'],
        cuisine: '家常',
        type: 'soup',
        spicy: false,
        ingredients: ['排骨 300g', '冬瓜 400g', '姜 4片', '料酒 1勺', '盐 适量', '枸杞 10粒', '葱段 2段'],
        steps: [
            '排骨冷水下锅焯水，加料酒去血沫，捞出洗净',
            '冬瓜去皮去籽，切成大块',
            '砂锅中放入排骨、姜片、葱段，加足量清水',
            '大火烧开后转小火炖40分钟',
            '放入冬瓜块继续炖20分钟至冬瓜透明软烂',
            '加盐调味，撒枸杞焖2分钟即可'
        ]
    }
];

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
    let dishPool = [...CN_RECIPES];
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
    let pool = type === 'dish' ? [...CN_RECIPES] : [...CN_SOUPS];
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
    const allRecipes = [...CN_RECIPES, ...CN_SOUPS];
    const recipe = allRecipes.find(r => r.id === recipeId);
    if (!recipe) return;

    modalEmoji.textContent = recipe.image;
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
            ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
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
    recipeGrid.innerHTML = CN_RECIPES.map(recipe => createRecipeCard(recipe)).join('');
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
    const filtered = CN_RECIPES.filter(r => r.cuisine === cuisine);
    if (filtered.length > 0) {
        recipeGrid.innerHTML = filtered.map(r => createRecipeCard(r)).join('');
    } else {
        recipeGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">暂无该菜系菜谱</p>';
    }
}

function filterByCategory(category) {
    filterByCuisine(category);
}

// 加载更多（模拟）
function handleLoadMore() {
    const moreRecipes = CN_RECIPES.map(r => ({
        ...r,
        id: r.id + 100,
        title: r.title + ' (更多做法)'
    }));
    const newCards = moreRecipes.map(r => createRecipeCard(r)).join('');
    recipeGrid.insertAdjacentHTML('beforeend', newCards);
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CN_RECIPES, CN_SOUPS, initApp };
}
