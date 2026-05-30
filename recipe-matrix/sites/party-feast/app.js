/**
 * 宴席派对餐 - Party Feast Site
 * 金色酒红配色主题 - Gold & Burgundy Theme
 * Auto Feast Plan Generator
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

const SITE_ID = 'party-feast';

// ===== 使用外部菜谱数据，筛选适合本站的菜谱 =====
function normalizeRecipe(r) {
    return {
        id: r.id,
        title: r.name,
        image: r.emoji || '🎉',
        nameEn: r.nameEn || '',
        time: ((r.prepTime || 0) + (r.cookTime || 0)) + '分钟',
        timeMinutes: (r.prepTime || 0) + (r.cookTime || 0),
        difficulty: r.difficulty || '中等',
        calories: r.calories || Math.round((r.prepTime || 10) * 8 + 100),
        tags: r.tags || [],
        cuisine: r.cuisine || '',
        type: r.category === '汤品' || r.category === '汤' ? 'soup' : 'dish',
        course: r.category || '主菜',
        occasion: ['家宴', '生日派对', '节日聚餐'],
        seafood: (r.tags || []).some(t => t.includes('海鲜') || t.includes('鱼') || t.includes('虾')),
        spicy: r.spicy === true || (typeof r.spicy === 'number' && r.spicy > 0),
        ingredients: r.ingredients || [],
        tools: r.tools || [],
        steps: r.steps || []
    };
}

// 从全局 CN_RECIPES + CN_RECIPES_EXTRA1 + WESTERN_RECIPES + WESTERN_RECIPES_EXTRA1 筛选宴会/聚会菜谱
const ALL_RAW = [
    ...(typeof CN_RECIPES !== 'undefined' ? CN_RECIPES : []),
    ...(typeof CN_RECIPES_EXTRA1 !== 'undefined' ? CN_RECIPES_EXTRA1 : []),
    ...(typeof WESTERN_RECIPES !== 'undefined' ? WESTERN_RECIPES : []),
    ...(typeof WESTERN_RECIPES_EXTRA1 !== 'undefined' ? WESTERN_RECIPES_EXTRA1 : [])
];

const PARTY_RECIPES = ALL_RAW
    .filter(r => {
        // 筛选标签含宴会/聚会/节日/宴客/经典/名菜/烤/红烧/大菜等关键词
        const partyTags = ['宴客', '聚会', '节日', '经典', '名菜', '大菜', '烤', '红烧', '硬菜', '宴席', '生日', '派对', '烤肉', '烧烤', '甜品', '蛋糕', '烘焙'];
        const partyKeywords = ['烤', '红烧', '东坡', '全鱼', '龙虾', '牛排', '烤鸭', '蛋糕', '甜品', '焗', '芝士', '盛宴', '拼盘', '大虾', '螃蟹'];
        const tagsStr = (r.tags || []).join(' ') + ' ' + (r.category || '') + ' ' + (r.name || '');
        const hasPartyTag = partyTags.some(t => tagsStr.includes(t));
        const hasPartyKeyword = partyKeywords.some(k => r.name.includes(k));
        // 也保留难度为"困难"或"中等"的菜谱（通常更复杂、更impressive）
        const isImpressive = r.difficulty === '困难' || r.difficulty === '中等' || r.difficulty === 'Hard' || r.difficulty === 'Medium';
        return hasPartyTag || hasPartyKeyword || isImpressive;
    })
    .map(normalizeRecipe);

// 如果过滤后菜谱太少，补充一些
if (PARTY_RECIPES.length < 20) {
    const extra = ALL_RAW
        .filter(r => !PARTY_RECIPES.find(p => p.id === r.id))
        .slice(0, 20 - PARTY_RECIPES.length)
        .map(normalizeRecipe);
    PARTY_RECIPES.push(...extra);
}

// ===== DOM Elements =====
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

    // Load more button
    const loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', handleLoadMore);
    }
}

// Load more recipes
function handleLoadMore() {
    const startIdx = recipeGrid.querySelectorAll('.recipe-card').length;
    const moreRecipes = PARTY_RECIPES.slice(startIdx, startIdx + 12);
    const newCards = moreRecipes.map(r => createRecipeCard(r)).join('');
    recipeGrid.insertAdjacentHTML('beforeend', newCards);
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
    document.getElementById('modalMeta').textContent = `⏱️ ${recipe.time}  |  📊 ${recipe.difficulty}  |  🔥 ${recipe.calories}卡  |  🍽️ ${recipe.course}`;

    // 兼容新旧格式
    const ingredientsHtml = recipe.ingredients.map(ing => {
        if (typeof ing === 'object' && ing.name) {
            return `<li>${ing.name} ${ing.amount || ''}</li>`;
        }
        return `<li>${ing}</li>`;
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

// ===== Utility =====
function pickRandom(arr, count) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SITE_ID, PARTY_RECIPES, generateFeast };
}
