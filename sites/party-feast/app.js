/**
 * 宴席派对餐 - Party Feast Site
 * 金色酒红配色主题 - Gold & Burgundy Theme
 */

// Site Configuration
const SITE_CONFIG = {
    SITE_ID: 'party-feast',
    SITE_NAME: '宴席派对餐',
    SITE_TAGLINE: '打造难忘的美食盛宴',
    API_BASE_URL: '/api/party-feast',
    RECIPES_PER_PAGE: 8,
    FEATURED_RECIPES_COUNT: 4
};

// 宴席派对餐菜谱数据
const PARTY_RECIPES = [
    {
        id: 1,
        title: '烤全羊',
        image: '🍖',
        time: '4小时',
        difficulty: '困难',
        calories: '850卡',
        tags: ['硬菜', '聚会', '豪华'],
        occasion: '商务宴请'
    },
    {
        id: 2,
        title: '海鲜拼盘',
        image: '🦞',
        time: '45分钟',
        difficulty: '中等',
        calories: '320卡',
        tags: ['海鲜', '冷盘', '高端'],
        occasion: '婚礼宴席'
    },
    {
        id: 3,
        title: '寿桃包',
        image: '🍑',
        time: '90分钟',
        difficulty: '中等',
        calories: '180卡',
        tags: ['面点', '甜品', '传统'],
        occasion: '生日派对'
    },
    {
        id: 4,
        title: '佛跳墙',
        image: '🍲',
        time: '6小时',
        difficulty: '困难',
        calories: '420卡',
        tags: ['汤羹', '名菜', '滋补'],
        occasion: '商务宴请'
    },
    {
        id: 5,
        title: '圣诞烤火鸡',
        image: '🦃',
        time: '3小时',
        difficulty: '困难',
        calories: '580卡',
        tags: ['节日', '西餐', '传统'],
        occasion: '节日大餐'
    },
    {
        id: 6,
        title: '千层蛋糕',
        image: '🎂',
        time: '2小时',
        difficulty: '中等',
        calories: '350卡',
        tags: ['甜品', '庆祝', '精美'],
        occasion: '生日派对'
    },
    {
        id: 7,
        title: '红烧狮子头',
        image: '🥘',
        time: '90分钟',
        difficulty: '中等',
        calories: '480卡',
        tags: ['淮扬菜', '经典', '团圆'],
        occasion: '家庭聚会'
    },
    {
        id: 8,
        title: '香槟鸡尾酒',
        image: '🥂',
        time: '10分钟',
        difficulty: '简单',
        calories: '120卡',
        tags: ['饮品', '庆祝', '调酒'],
        occasion: '周年庆典'
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
    return PARTY_RECIPES;
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
            const occasion = card.querySelector('h4').textContent;
            filterByOccasion(occasion);
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
            const occasion = tag.textContent;
            filterByOccasion(occasion);
        });
    });
}

// Handle Load More Button
function handleLoadMore() {
    console.log('加载更多宴会菜谱...');
    
    // 模拟加载更多菜谱
    const moreRecipes = PARTY_RECIPES.map(r => ({
        ...r,
        id: r.id + 100,
        title: r.title + ' (豪华版)'
    }));
    
    const newCards = moreRecipes.map(recipe => createRecipeCard(recipe)).join('');
    recipeGrid.insertAdjacentHTML('beforeend', newCards);
}

// Handle Search
function handleSearch(e) {
    if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query) {
            console.log(`搜索宴会菜: ${query}`);
            performSearch(query);
        }
    }
}

// Perform Search
function performSearch(query) {
    const filtered = PARTY_RECIPES.filter(recipe => 
        recipe.title.includes(query) || 
        recipe.tags.some(tag => tag.includes(query))
    );
    
    if (filtered.length > 0) {
        recipeGrid.innerHTML = filtered.map(recipe => createRecipeCard(recipe)).join('');
    } else {
        recipeGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">未找到相关菜谱，请尝试其他关键词</p>';
    }
}

// Filter by Occasion
function filterByOccasion(occasion) {
    console.log(`按场合筛选: ${occasion}`);
    const filtered = PARTY_RECIPES.filter(recipe => recipe.occasion === occasion);
    
    if (filtered.length > 0) {
        recipeGrid.innerHTML = filtered.map(recipe => createRecipeCard(recipe)).join('');
    } else {
        recipeGrid.innerHTML = `<p style="text-align: center; color: var(--text-secondary);">暂无${occasion}相关菜谱，敬请期待</p>`;
    }
}

// Open Recipe Detail
function openRecipeDetail(recipeId) {
    const recipe = PARTY_RECIPES.find(r => r.id == recipeId);
    if (recipe) {
        console.log(`查看菜谱详情: ${recipe.title}`);
        alert(`菜谱详情：${recipe.title}\n烹饪时间：${recipe.time}\n难度：${recipe.difficulty}\n热量：${recipe.calories}\n适合场合：${recipe.occasion}\n\n标签：${recipe.tags.join('、')}`);
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
    module.exports = { SITE_CONFIG, PARTY_RECIPES, initApp };
}
