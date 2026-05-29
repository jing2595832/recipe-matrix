/**
 * 懒人快手餐 - Quick Meal Site
 * 浅蓝配色主题 - Light Blue Theme
 */

// Site Configuration
const SITE_CONFIG = {
    SITE_ID: 'quick-meal',
    SITE_NAME: '懒人快手餐',
    SITE_TAGLINE: '10分钟搞定美味',
    API_BASE_URL: '/api/quick-meal',
    RECIPES_PER_PAGE: 8,
    FEATURED_RECIPES_COUNT: 4
};

// 懒人快手餐菜谱数据
const QUICK_RECIPES = [
    {
        id: 1,
        title: '黄金蛋炒饭',
        image: '🍚',
        time: '5分钟',
        difficulty: '简单',
        calories: '350卡',
        tags: ['剩饭改造', '快手', '主食'],
        timeGroup: '5分钟'
    },
    {
        id: 2,
        title: '微波炉蒸蛋',
        image: '🥚',
        time: '3分钟',
        difficulty: '简单',
        calories: '120卡',
        tags: ['微波炉', '高蛋白', '早餐'],
        timeGroup: '5分钟'
    },
    {
        id: 3,
        title: '番茄鸡蛋面',
        image: '🍜',
        time: '10分钟',
        difficulty: '简单',
        calories: '380卡',
        tags: ['经典', '面食', '家常'],
        timeGroup: '10分钟'
    },
    {
        id: 4,
        title: '蒜蓉西兰花',
        image: '🥦',
        time: '8分钟',
        difficulty: '简单',
        calories: '80卡',
        tags: ['素食', '健康', '快手'],
        timeGroup: '10分钟'
    },
    {
        id: 5,
        title: '一锅出焖饭',
        image: '🥘',
        time: '15分钟',
        difficulty: '中等',
        calories: '420卡',
        tags: ['一锅出', '主食', '省心'],
        timeGroup: '15分钟'
    },
    {
        id: 6,
        title: '凉拌黄瓜',
        image: '🥒',
        time: '5分钟',
        difficulty: '简单',
        calories: '45卡',
        tags: ['免开火', '凉菜', '低脂'],
        timeGroup: '5分钟'
    },
    {
        id: 7,
        title: '泡面神仙吃法',
        image: '🍜',
        time: '8分钟',
        difficulty: '简单',
        calories: '450卡',
        tags: ['创意', '网红', '深夜'],
        timeGroup: '10分钟'
    },
    {
        id: 8,
        title: '芝士焗土豆',
        image: '🧀',
        time: '10分钟',
        difficulty: '简单',
        calories: '280卡',
        tags: ['微波炉', '芝士', '美味'],
        timeGroup: '10分钟'
    }
];

// DOM Elements
const recipeGrid = document.getElementById('recipeGrid');
const loadMoreBtn = document.getElementById('loadMore');
const searchInput = document.querySelector('.search-input');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderRecipes();
    bindEvents();
    console.log(`${SITE_CONFIG.SITE_NAME} - ${SITE_CONFIG.SITE_TAGLINE}`);
}

// Render Recipe Cards
function renderRecipes() {
    if (!recipeGrid) return;
    
    const recipes = getSiteSpecificRecipes();
    recipeGrid.innerHTML = recipes.map(recipe => createRecipeCard(recipe)).join('');
}

// Create Recipe Card HTML
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

// Get Site-Specific Recipes
function getSiteSpecificRecipes() {
    return QUICK_RECIPES;
}

// Bind Event Listeners
function bindEvents() {
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', handleLoadMore);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', handleSearch);
    }
    
    // Category card click events
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const timeText = card.querySelector('p').textContent;
            const timeGroup = card.querySelector('h4').textContent;
            filterByTime(timeGroup);
        });
    });
    
    // Recipe card click events
    document.addEventListener('click', (e) => {
        const recipeCard = e.target.closest('.recipe-card');
        if (recipeCard) {
            const recipeId = recipeCard.dataset.id;
            openRecipeDetail(recipeId);
        }
    });
    
    // Tag click events
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const tagText = tag.textContent;
            filterByTag(tagText);
        });
    });
}

// Handle Load More Button
function handleLoadMore() {
    console.log('加载更多快手菜...');
    
    // 模拟加载更多食谱
    const moreRecipes = QUICK_RECIPES.map(r => ({
        ...r,
        id: r.id + 100,
        title: r.title + ' (新做法)'
    }));
    
    const newCards = moreRecipes.map(recipe => createRecipeCard(recipe)).join('');
    recipeGrid.insertAdjacentHTML('beforeend', newCards);
}

// Handle Search
function handleSearch(e) {
    if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query) {
            console.log(`搜索快手菜: ${query}`);
            performSearch(query);
        }
    }
}

// Perform Search
function performSearch(query) {
    const filtered = QUICK_RECIPES.filter(recipe => 
        recipe.title.includes(query) || 
        recipe.tags.some(tag => tag.includes(query))
    );
    
    if (filtered.length > 0) {
        recipeGrid.innerHTML = filtered.map(recipe => createRecipeCard(recipe)).join('');
    } else {
        recipeGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">未找到相关菜谱，请尝试其他关键词</p>';
    }
}

// Filter by Time
function filterByTime(timeGroup) {
    console.log(`按时间筛选: ${timeGroup}`);
    
    // Map category names to time groups
    const timeMap = {
        '5分钟快手': '5分钟',
        '10分钟速食': '10分钟',
        '15分钟简餐': '15分钟'
    };
    
    const targetTime = timeMap[timeGroup] || timeGroup;
    const filtered = QUICK_RECIPES.filter(recipe => recipe.timeGroup === targetTime);
    
    if (filtered.length > 0) {
        recipeGrid.innerHTML = filtered.map(recipe => createRecipeCard(recipe)).join('');
    } else {
        recipeGrid.innerHTML = `<p style="text-align: center; color: var(--text-secondary);">暂无${timeGroup}相关菜谱，敬请期待</p>`;
    }
}

// Filter by Tag
function filterByTag(tag) {
    console.log(`按标签筛选: ${tag}`);
    
    // Map tag text to recipe tags
    const tagMap = {
        '5分钟搞定': '5分钟',
        '10分钟上桌': '10分钟',
        '微波炉料理': '微波炉',
        '一锅出': '一锅出'
    };
    
    const targetTag = tagMap[tag] || tag;
    
    if (targetTag === '5分钟' || targetTag === '10分钟') {
        const filtered = QUICK_RECIPES.filter(recipe => recipe.timeGroup === targetTag);
        recipeGrid.innerHTML = filtered.map(recipe => createRecipeCard(recipe)).join('');
    } else {
        const filtered = QUICK_RECIPES.filter(recipe => 
            recipe.tags.some(t => t.includes(targetTag))
        );
        
        if (filtered.length > 0) {
            recipeGrid.innerHTML = filtered.map(recipe => createRecipeCard(recipe)).join('');
        } else {
            recipeGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">未找到相关菜谱</p>';
        }
    }
}

// Open Recipe Detail
function openRecipeDetail(recipeId) {
    const recipe = QUICK_RECIPES.find(r => r.id == recipeId);
    if (recipe) {
        console.log(`查看菜谱详情: ${recipe.title}`);
        alert(`菜谱详情：${recipe.title}\n烹饪时间：${recipe.time}\n难度：${recipe.difficulty}\n热量：${recipe.calories}\n\n标签：${recipe.tags.join('、')}`);
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SITE_CONFIG, QUICK_RECIPES, initApp };
}
