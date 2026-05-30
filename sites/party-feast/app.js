/**
 * 宴席派对餐 - Party Feast Site
 * 金色酒红配色主题 - Gold & Burgundy Theme
 * Auto Feast Plan Generator
 */

const SITE_ID = 'party-feast';

// 宴席菜谱数据（含食材和步骤，按课程分类）
const PARTY_RECIPES = [
    // ===== 冷盘 / Cold Appetizers =====
    {
        id: 101,
        title: '海鲜拼盘',
        image: '🦞',
        time: '45分钟',
        difficulty: '中等',
        calories: '320卡',
        tags: ['海鲜', '冷盘', '高端'],
        occasion: ['婚礼', '商务宴请', '节日聚餐'],
        course: '冷盘',
        seafood: true,
        ingredients: ['大虾 500g', '三文鱼 200g', '北极贝 200g', '柠檬 1个', '冰块 适量', '海鲜酱 适量', '芥末 少许'],
        steps: ['大虾去虾线，煮熟后冰水浸泡', '三文鱼切片摆盘', '北极贝解冻切片', '冰块铺底，摆上各类海鲜', '配柠檬片、海鲜酱和芥末上桌']
    },
    {
        id: 102,
        title: '凉拌木耳',
        image: '🍄',
        time: '20分钟',
        difficulty: '简单',
        calories: '85卡',
        tags: ['素食', '冷盘', '清爽'],
        occasion: ['家宴', '生日派对', '节日聚餐'],
        course: '冷盘',
        seafood: false,
        ingredients: ['黑木耳 200g', '红椒 1个', '香菜 适量', '蒜 3瓣', '生抽 2汤匙', '香醋 1汤匙', '白糖 1小勺', '辣椒油 适量'],
        steps: ['黑木耳提前泡发，撕成小朵', '烧开水焯水3分钟，捞出过凉水', '红椒切丝，蒜切末', '将生抽、香醋、白糖、辣椒油调成酱汁', '酱汁浇在木耳上，撒上红椒丝、蒜末和香菜拌匀']
    },
    {
        id: 103,
        title: '白切鸡',
        image: '🍗',
        time: '60分钟',
        difficulty: '中等',
        calories: '280卡',
        tags: ['经典', '冷盘', '粤菜'],
        occasion: ['家宴', '商务宴请', '节日聚餐'],
        course: '冷盘',
        seafood: false,
        ingredients: ['三黄鸡 1只（约1.5kg）', '姜 1块', '葱 3根', '料酒 2汤匙', '姜葱蓉蘸料 适量', '香油 少许'],
        steps: ['整鸡洗净，姜切片，葱打结', '锅中烧开水，放入姜葱料酒', '将鸡放入沸水中，提起三次让鸡腔内外受热均匀', '转小火煮20分钟，关火焖20分钟', '取出放入冰水中浸泡至完全冷却', '斩块摆盘，配姜葱蓉蘸料']
    },
    {
        id: 104,
        title: '蒜泥白肉',
        image: '🥩',
        time: '30分钟',
        difficulty: '中等',
        calories: '350卡',
        tags: ['川菜', '冷盘', '经典'],
        occasion: ['家宴', '生日派对'],
        course: '冷盘',
        seafood: false,
        ingredients: ['五花肉 500g', '蒜 1整头', '辣椒油 2汤匙', '生抽 2汤匙', '香醋 1汤匙', '白糖 1小勺', '葱花 适量', '黄瓜 1根'],
        steps: ['五花肉整块冷水下锅，加葱姜料酒煮至熟透', '捞出放入冰水中冷却', '蒜捣成泥，加辣椒油、生抽、香醋、白糖调成蒜泥酱', '黄瓜切片铺底', '五花肉切薄片摆盘，浇上蒜泥酱，撒葱花']
    },

    // ===== 主菜 / Main Dishes =====
    {
        id: 201,
        title: '烤全羊',
        image: '🍖',
        time: '4小时',
        difficulty: '困难',
        calories: '850卡',
        tags: ['硬菜', '聚会', '豪华'],
        occasion: ['商务宴请', '节日聚餐', '家宴'],
        course: '主菜',
        seafood: false,
        ingredients: ['整羊腿 3-4kg', '孜然粉 3汤匙', '辣椒粉 2汤匙', '盐 适量', '蒜 1整头', '姜 1块', '洋葱 2个', '料酒 100ml', '蜂蜜 2汤匙'],
        steps: ['羊腿洗净，用竹签扎孔方便入味', '将孜然粉、辣椒粉、盐、蒜末、姜末混合成腌料', '均匀涂抹腌料，冷藏腌制过夜', '烤箱预热200°C，羊腿放在烤架上', '烤制3-4小时，期间多次刷蜂蜜水翻面', '最后15分钟高温上色，取出切块上桌']
    },
    {
        id: 202,
        title: '佛跳墙',
        image: '🍲',
        time: '6小时',
        difficulty: '困难',
        calories: '420卡',
        tags: ['汤羹', '名菜', '滋补'],
        occasion: ['商务宴请', '婚礼', '节日聚餐'],
        course: '主菜',
        seafood: true,
        ingredients: ['鲍鱼 6只', '鱼翅 50g', '花胶 100g', '干贝 100g', '海参 3条', '香菇 8朵', '蹄筋 200g', '母鸡 1只', '火腿 200g', '高汤 2L', '花雕酒 200ml'],
        steps: ['鲍鱼、海参、花胶提前泡发处理', '母鸡和火腿熬制高汤4小时', '蹄筋泡发，香菇泡发', '将所有食材分层放入坛中', '倒入高汤和花雕酒', '密封坛口，小火煨炖2小时至汤浓味醇']
    },
    {
        id: 203,
        title: '红烧狮子头',
        image: '🥘',
        time: '90分钟',
        difficulty: '中等',
        calories: '480卡',
        tags: ['淮扬菜', '经典', '团圆'],
        occasion: ['家宴', '节日聚餐', '生日派对'],
        course: '主菜',
        seafood: false,
        ingredients: ['五花肉 500g', '荸荠 5个', '鸡蛋 1个', '葱姜 适量', '生抽 2汤匙', '老抽 1汤匙', '冰糖 30g', '白菜心 4棵', '高汤 500ml'],
        steps: ['五花肉切小丁（不要绞碎），荸荠切碎', '加鸡蛋、葱姜、生抽搅拌上劲，做成大肉丸', '油温七成热，炸至表面金黄捞出', '白菜心铺在砂锅底，放入狮子头', '加高汤、老抽、冰糖', '小火炖煮60分钟至汤汁浓稠']
    },
    {
        id: 204,
        title: '糖醋排骨',
        image: '🍖',
        time: '50分钟',
        difficulty: '中等',
        calories: '520卡',
        tags: ['经典', '硬菜', '酸甜'],
        occasion: ['家宴', '生日派对', '节日聚餐'],
        course: '主菜',
        seafood: false,
        ingredients: ['小排 500g', '料酒 2汤匙', '生抽 2汤匙', '香醋 3汤匙', '白糖 3汤匙', '番茄酱 1汤匙', '姜 3片', '白芝麻 适量'],
        steps: ['排骨冷水下锅，加料酒姜片焯水去血沫', '捞出洗净沥干', '锅中少许油，放入排骨煎至两面微黄', '加入生抽、香醋、白糖、番茄酱和适量水', '大火烧开后转小火焖30分钟', '大火收汁至浓稠，撒白芝麻出锅']
    },
    {
        id: 205,
        title: '清蒸石斑鱼',
        image: '🐟',
        time: '25分钟',
        difficulty: '中等',
        calories: '220卡',
        tags: ['海鲜', '清蒸', '鲜美'],
        occasion: ['商务宴请', '婚礼', '节日聚餐'],
        course: '主菜',
        seafood: true,
        ingredients: ['石斑鱼 1条（约1kg）', '姜 1块', '葱 3根', '蒸鱼豉油 3汤匙', '料酒 1汤匙', '食用油 2汤匙'],
        steps: ['鱼去鳞去内脏洗净，两面划刀', '抹少许料酒和盐腌制10分钟', '鱼身放姜片和葱段', '水开后大火蒸8-10分钟', '取出倒掉蒸出的水，去掉葱姜', '铺上新鲜葱丝姜丝，淋蒸鱼豉油，浇热油激香']
    },
    {
        id: 206,
        title: '宫保鸡丁',
        image: '🐔',
        time: '20分钟',
        difficulty: '中等',
        calories: '380卡',
        tags: ['川菜', '经典', '下饭'],
        occasion: ['家宴', '生日派对'],
        course: '主菜',
        seafood: false,
        ingredients: ['鸡胸肉 300g', '花生米 100g', '干辣椒 8个', '花椒 1小勺', '葱 2根', '姜蒜 适量', '生抽 2汤匙', '香醋 1汤匙', '白糖 1汤匙', '淀粉 1汤匙'],
        steps: ['鸡胸肉切丁，加生抽、淀粉腌制15分钟', '花生米炒熟备用', '调碗汁：生抽、香醋、白糖、淀粉加水', '锅中热油，爆香干辣椒和花椒', '放入鸡丁大火翻炒至变色', '倒入碗汁翻炒均匀，加入花生米和葱段出锅']
    },
    {
        id: 207,
        title: '蒜蓉粉丝蒸扇贝',
        image: '🐚',
        time: '20分钟',
        difficulty: '简单',
        calories: '180卡',
        tags: ['海鲜', '蒸菜', '鲜美'],
        occasion: ['婚礼', '商务宴请', '节日聚餐'],
        course: '主菜',
        seafood: true,
        ingredients: ['扇贝 12只', '粉丝 2把', '蒜 2整头', '小米辣 3个', '蒸鱼豉油 3汤匙', '食用油 3汤匙', '葱花 适量'],
        steps: ['粉丝提前泡软，蒜切末', '锅中热油，小火炒至蒜末微黄制成蒜蓉油', '扇贝洗净，粉丝盘在贝壳上，放扇贝肉', '每只扇贝上铺蒜蓉和小米辣', '水开后大火蒸6-8分钟', '取出淋蒸鱼豉油，浇热油，撒葱花']
    },

    // ===== 汤羹 / Soups =====
    {
        id: 301,
        title: '松茸鸡汤',
        image: '🥣',
        time: '120分钟',
        difficulty: '中等',
        calories: '180卡',
        tags: ['汤羹', '滋补', '高端'],
        occasion: ['商务宴请', '婚礼', '家宴'],
        course: '汤羹',
        seafood: false,
        ingredients: ['老母鸡 半只', '松茸 100g', '枸杞 10g', '红枣 6颗', '姜 3片', '盐 适量', '料酒 1汤匙'],
        steps: ['老母鸡斩块焯水去血沫', '松茸提前泡发洗净', '所有食材放入砂锅中', '加足清水和料酒', '大火烧开后转小火炖90分钟', '加盐调味，撒枸杞即可']
    },
    {
        id: 302,
        title: '番茄牛腩汤',
        image: '🍅',
        time: '90分钟',
        difficulty: '中等',
        calories: '260卡',
        tags: ['汤羹', '家常', '暖胃'],
        occasion: ['家宴', '生日派对', '节日聚餐'],
        course: '汤羹',
        seafood: false,
        ingredients: ['牛腩 500g', '番茄 3个', '土豆 1个', '洋葱 半个', '姜 3片', '八角 2个', '番茄酱 2汤匙', '盐 适量'],
        steps: ['牛腩切块焯水去血沫', '番茄去皮切块，土豆切块，洋葱切丁', '锅中热油，爆香姜片和八角', '放入洋葱和番茄翻炒出汁', '加入牛腩和番茄酱，加足清水', '大火烧开后小火炖60分钟，加入土豆再炖20分钟']
    },
    {
        id: 303,
        title: '海鲜豆腐羹',
        image: '🦐',
        time: '30分钟',
        difficulty: '简单',
        calories: '150卡',
        tags: ['汤羹', '海鲜', '清淡'],
        occasion: ['婚礼', '商务宴请', '家宴'],
        course: '汤羹',
        seafood: true,
        ingredients: ['嫩豆腐 1盒', '虾仁 150g', '蛤蜊 200g', '香菇 3朵', '鸡蛋 1个', '淀粉水 适量', '盐 适量', '白胡椒粉 少许', '香油 几滴'],
        steps: ['豆腐切小丁，香菇切丁，虾仁去虾线', '蛤蜊吐沙后煮至开口取肉', '锅中加高汤烧开，放入豆腐和香菇', '煮3分钟后加入虾仁和蛤蜊肉', '淋入淀粉水勾薄芡', '打入蛋花，加盐和白胡椒粉调味，淋香油']
    },

    // ===== 甜品 / Desserts =====
    {
        id: 401,
        title: '寿桃包',
        image: '🍑',
        time: '90分钟',
        difficulty: '中等',
        calories: '180卡',
        tags: ['面点', '甜品', '传统'],
        occasion: ['生日派对', '节日聚餐', '家宴'],
        course: '甜品',
        seafood: false,
        ingredients: ['面粉 500g', '酵母 5g', '白糖 50g', '温水 250ml', '豆沙馅 300g', '食用红色素 少许', '刷面油 少许'],
        steps: ['面粉加酵母、白糖和温水揉成光滑面团', '发酵至两倍大', '分成小剂子，包入豆沙馅', '捏出桃子形状，用刮板压出桃子纹路', '垫蒸纸，二次醒发15分钟', '大火蒸15分钟，取出刷油，桃尖点红色素']
    },
    {
        id: 402,
        title: '千层蛋糕',
        image: '🎂',
        time: '2小时',
        difficulty: '中等',
        calories: '350卡',
        tags: ['甜品', '庆祝', '精美'],
        occasion: ['生日派对', '婚礼', '周年庆典'],
        course: '甜品',
        seafood: false,
        ingredients: ['低筋面粉 120g', '鸡蛋 3个', '牛奶 380ml', '淡奶油 400ml', '白糖 60g', '黄油 20g', '香草精 少许'],
        steps: ['鸡蛋加白糖打散，加入牛奶和融化的黄油', '筛入低筋面粉拌匀成薄面糊', '平底锅小火摊薄饼，约20张', '淡奶油加糖打发至硬挺', '一层饼皮一层奶油叠放', '做好后冷藏2小时，切块食用']
    },
    {
        id: 403,
        title: '圣诞烤火鸡',
        image: '🦃',
        time: '3小时',
        difficulty: '困难',
        calories: '580卡',
        tags: ['节日', '西餐', '传统'],
        occasion: ['节日聚餐', '商务宴请', '家宴'],
        course: '主菜',
        seafood: false,
        ingredients: ['火鸡 1只（约5kg）', '黄油 100g', '洋葱 2个', '胡萝卜 2根', '芹菜 2根', '迷迭香 适量', '百里香 适量', '蒜 1整头', '苹果 2个', '橙子 2个', '盐和黑胡椒 适量'],
        steps: ['火鸡提前24小时解冻，盐擦全身腌制冷藏', '洋葱、胡萝卜、芹菜切块', '苹果和橙子切片', '火鸡腔内塞入水果和香料蔬菜', '表面涂软化黄油，撒迷迭香和百里香', '烤箱预热160°C，烤3小时，期间每小时刷黄油汁']
    },
    {
        id: 404,
        title: '杨枝甘露',
        image: '🥭',
        time: '30分钟',
        difficulty: '简单',
        calories: '200卡',
        tags: ['甜品', '港式', '清爽'],
        occasion: ['婚礼', '生日派对', '商务宴请'],
        course: '甜品',
        seafood: false,
        ingredients: ['芒果 3个', '西柚 1个', '椰浆 200ml', '牛奶 200ml', '西米 80g', '白糖 30g'],
        steps: ['西米煮至透明，过凉水备用', '2个芒果切丁，1个芒果打成泥', '西柚剥出果肉', '椰浆加牛奶和白糖煮开，放凉', '碗中放入西米、芒果丁和西柚肉', '倒入椰浆牛奶，淋芒果泥即可']
    },

    // ===== 饮品 / Drinks =====
    {
        id: 501,
        title: '香槟鸡尾酒',
        image: '🥂',
        time: '10分钟',
        difficulty: '简单',
        calories: '120卡',
        tags: ['饮品', '庆祝', '调酒'],
        occasion: ['周年庆典', '生日派对', '婚礼', '商务宴请'],
        course: '饮品',
        seafood: false,
        ingredients: ['香槟 1瓶', '草莓 6颗', '蓝莓 适量', '橙子 1个', '薄荷 适量', '冰块 适量'],
        steps: ['水果洗净切片备用', '杯中放入冰块和水果', '倒入香槟至八分满', '点缀薄荷叶即可']
    },
    {
        id: 502,
        title: '桂花酸梅汤',
        image: '🍵',
        time: '40分钟',
        difficulty: '简单',
        calories: '60卡',
        tags: ['饮品', '传统', '消暑'],
        occasion: ['家宴', '节日聚餐', '生日派对'],
        course: '饮品',
        seafood: false,
        ingredients: ['乌梅 30g', '山楂干 20g', '甘草 5g', '陈皮 5g', '冰糖 80g', '干桂花 适量', '清水 2L'],
        steps: ['乌梅、山楂、甘草、陈皮洗净', '加清水大火煮开', '转小火煮30分钟', '加入冰糖搅拌至融化', '过滤渣滓，撒上干桂花', '放凉后冷藏饮用']
    }
];

// ===== DOM Elements =====
const resultSection = document.getElementById('resultSection');
const resultCourses = document.getElementById('resultCourses');
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
    // Show a curated selection from all courses
    const featured = PARTY_RECIPES.slice(0, 8);
    recipeGrid.innerHTML = featured.map(recipe => createRecipeCard(recipe)).join('');
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
        btnGenerate.addEventListener('click', generateFeast);
    }

    // Hero tag clicks
    document.querySelectorAll('.hero-tags .tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const filter = tag.dataset.filter;
            filterByOccasion(filter);
        });
    });

    // Category card clicks
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const occasion = card.querySelector('h4').textContent;
            filterByOccasion(occasion);
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

// ===== Auto Feast Plan Generator =====
function generateFeast() {
    const guests = parseInt(document.getElementById('guestCount').value);
    const occasion = document.getElementById('occasionType').value;
    const includeSeafood = document.getElementById('includeSeafood').checked;

    // Determine dish counts based on guest count
    // More guests = more dishes, ranging from 8 to 12
    let totalDishes;
    if (guests <= 4) totalDishes = 8;
    else if (guests <= 6) totalDishes = 9;
    else if (guests <= 8) totalDishes = 10;
    else if (guests <= 12) totalDishes = 11;
    else totalDishes = 12;

    // Course distribution
    const coldCount = Math.ceil(totalDishes * 0.25);  // ~25% cold appetizers
    const mainCount = Math.ceil(totalDishes * 0.35);   // ~35% main dishes
    const soupCount = Math.max(1, Math.round(totalDishes * 0.1)); // ~10% soups
    const dessertCount = Math.max(1, Math.round(totalDishes * 0.15)); // ~15% desserts
    const drinkCount = Math.max(1, totalDishes - coldCount - mainCount - soupCount - dessertCount); // remainder drinks

    // Filter recipes by occasion and seafood preference
    let pool = PARTY_RECIPES.filter(r => {
        // Match occasion
        const occasionMatch = r.occasion.includes(occasion) || r.occasion.includes('家宴');
        // Seafood filter
        const seafoodMatch = includeSeafood ? true : !r.seafood;
        return occasionMatch && seafoodMatch;
    });

    // If pool is too small, relax occasion constraint
    if (pool.length < totalDishes) {
        pool = PARTY_RECIPES.filter(r => includeSeafood ? true : !r.seafood);
    }
    if (pool.length < totalDishes) {
        pool = [...PARTY_RECIPES];
    }

    // Select dishes per course
    const courseConfig = [
        { course: '冷盘', count: coldCount, label: '🥢 冷盘开胃 Cold Appetizers' },
        { course: '主菜', count: mainCount, label: '🍖 主菜硬菜 Main Dishes' },
        { course: '汤羹', count: soupCount, label: '🥣 汤羹 Soups' },
        { course: '甜品', count: dessertCount, label: '🍰 甜品 Desserts' },
        { course: '饮品', count: drinkCount, label: '🥂 饮品 Drinks' }
    ];

    let html = '';
    let allSelectedIds = [];

    courseConfig.forEach(({ course, count, label }) => {
        let coursePool = pool.filter(r => r.course === course);
        if (coursePool.length === 0) coursePool = pool;

        const selected = pickRandom(coursePool, Math.min(count, coursePool.length));
        selected.forEach(r => allSelectedIds.push(r.id));

        if (selected.length > 0) {
            html += `<div class="result-course-label">${label}</div>`;
            html += `<div class="result-cards">`;
            html += selected.map((recipe, idx) => `
                <div class="result-card" data-recipe-id="${recipe.id}" data-course="${course}" data-slot="${course}-${idx}">
                    <div class="result-card-img">${recipe.image}</div>
                    <div class="result-card-body">
                        <h4>${recipe.title}</h4>
                        <div class="result-card-meta">
                            <span>⏱️ ${recipe.time}</span>
                            <span>📊 ${recipe.difficulty}</span>
                            <span>🔥 ${recipe.calories}</span>
                        </div>
                        <div class="result-card-actions">
                            <button class="btn-change" onclick="changeFeastDish(this, '${course}')">🔄 换一道</button>
                            <button class="btn-detail" onclick="openRecipeDetail('${recipe.id}')">📖 查看做法</button>
                        </div>
                    </div>
                </div>
            `).join('');
            html += `</div>`;
        }
    });

    // Update title
    resultTitle.textContent = `${occasion} · ${guests}人宴席菜单（共${allSelectedIds.length}道）`;

    // Render
    resultCourses.innerHTML = html;
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== Change a Single Dish in Feast =====
function changeFeastDish(btn, course) {
    const card = btn.closest('.result-card');
    const currentId = parseInt(card.dataset.recipeId);

    // Get currently displayed IDs in the same course
    const sameCourseCards = document.querySelectorAll(`.result-card[data-course="${course}"]`);
    const currentIds = Array.from(sameCourseCards).map(c => parseInt(c.dataset.recipeId));

    // Find a replacement from the same course
    let coursePool = PARTY_RECIPES.filter(r => r.course === course && !currentIds.includes(r.id));
    if (coursePool.length === 0) coursePool = PARTY_RECIPES.filter(r => !currentIds.includes(r.id));
    if (coursePool.length === 0) return;

    const newRecipe = coursePool[Math.floor(Math.random() * coursePool.length)];

    // Update card
    card.dataset.recipeId = newRecipe.id;
    card.querySelector('.result-card-img').textContent = newRecipe.image;
    card.querySelector('h4').textContent = newRecipe.title;
    const meta = card.querySelector('.result-card-meta');
    meta.innerHTML = `
        <span>⏱️ ${newRecipe.time}</span>
        <span>📊 ${newRecipe.difficulty}</span>
        <span>🔥 ${newRecipe.calories}</span>
    `;
    const detailBtn = card.querySelector('.btn-detail');
    detailBtn.setAttribute('onclick', `openRecipeDetail('${newRecipe.id}')`);
}

// ===== Filter by Occasion (tag / category clicks) =====
function filterByOccasion(occasion) {
    // Map display names to internal occasion values
    const occasionMap = {
        '婚礼宴席': '婚礼',
        '节日大餐': '节日聚餐'
    };
    const target = occasionMap[occasion] || occasion;

    const filtered = PARTY_RECIPES.filter(r => r.occasion.includes(target));

    if (filtered.length > 0) {
        // Group by course
        const courses = ['冷盘', '主菜', '汤羹', '甜品', '饮品'];
        const courseLabels = {
            '冷盘': '🥢 冷盘开胃 Cold Appetizers',
            '主菜': '🍖 主菜硬菜 Main Dishes',
            '汤羹': '🥣 汤羹 Soups',
            '甜品': '🍰 甜品 Desserts',
            '饮品': '🥂 饮品 Drinks'
        };

        let html = '';
        courses.forEach(course => {
            const items = filtered.filter(r => r.course === course);
            if (items.length > 0) {
                html += `<div class="result-course-label">${courseLabels[course]}</div>`;
                html += `<div class="result-cards">`;
                html += items.map(recipe => `
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
                html += `</div>`;
            }
        });

        resultCourses.innerHTML = html;
        resultTitle.textContent = `${occasion} 推荐菜谱`;
        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===== Recipe Detail Modal =====
function openRecipeDetail(recipeId) {
    const recipe = PARTY_RECIPES.find(r => r.id == recipeId);
    if (!recipe) return;

    document.getElementById('modalEmoji').textContent = recipe.image;
    document.getElementById('modalTitle').textContent = recipe.title;
    document.getElementById('modalMeta').textContent = `⏱️ ${recipe.time}  |  📊 ${recipe.difficulty}  |  🔥 ${recipe.calories}  |  🍽️ ${recipe.course}`;

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
    module.exports = { SITE_ID, PARTY_RECIPES, generateFeast };
}
