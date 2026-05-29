/**
 * 中式家常菜 - Chinese Home Cooking Site
 * 中国红配色主题 - China Red Theme
 */

// Site Configuration
const SITE_CONFIG = {
    SITE_ID: 'cn-home',
    SITE_NAME: '中式家常菜',
    SITE_TAGLINE: '传承中华美食文化',
    API_BASE_URL: '/api/cn-home',
    RECIPES_PER_PAGE: 8,
    FEATURED_RECIPES_COUNT: 4
};

// 中式家常菜菜谱数据
const CN_RECIPES = [
    {
        id: 1,
        title: '宫保鸡丁',
        image: '🍗',
        time: '30分钟',
        difficulty: '中等',
        calories: '320卡',
        tags: ['川菜', '经典', '下饭'],
        cuisine: '川菜'
    },
    {
        id: 2,
        title: '麻婆豆腐',
        image: '🥘',
        time: '20分钟',
        difficulty: '简单',
        calories: '180卡',
        tags: ['川菜', '素食', '麻辣'],
        cuisine: '川菜'
    },
    {
        id: 3,
        title: '红烧肉',
        image: '🥩',
        time: '90分钟',
        difficulty: '中等',
        calories: '450卡',
        tags: ['鲁菜', '经典', '家常'],
        cuisine: '鲁菜'
    },
    {
        id: 4,
        title: '糖醋排骨',
        image: '🍖',
        time: '45分钟',
        difficulty: '中等',
        calories: '380卡',
        tags: ['苏菜', '酸甜', '下饭'],
        cuisine: '苏菜'
    },
    {
        id: 5,
        title: '清蒸鲈鱼',
        image: '🐟',
        time: '25分钟',
        difficulty: '简单',
        calories: '150卡',
        tags: ['粤菜', '清淡', '健康'],
        cuisine: '粤菜'
    },
    {
        id: 6,
        title: '回锅肉',
        image: '🥓',
        time: '35分钟',
        difficulty: '中等',
        calories: '420卡',
        tags: ['川菜', '经典', '香辣'],
        cuisine: '川菜'
    },
    {
        id: 7,
        title: '东坡肉',
        image: '🍲',
        time: '120分钟',
        difficulty: '困难',
        calories: '520卡',
        tags: ['浙菜', '传统', '名菜'],
        cuisine: '浙菜'
    },
    {
        id: 8,
        title: '白切鸡',
        image: '🍗',
        time: '40分钟',
        difficulty: '中等',
        calories: '200卡',
        tags: ['粤菜', '清淡', '经典'],
        cuisine: '粤菜'
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
    return CN_RECIPES;
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
            const category = card.querySelector('h4').textContent;
            filterByCategory(category);
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
            const cuisine = tag.textContent;
            filterByCuisine(cuisine);
        });
    });
}

// Handle Load More Button
function handleLoadMore() {
    console.log('加载更多中式菜谱...');
    
    // 模拟加载更多菜谱
    const moreRecipes = CN_RECIPES.map(r => ({
        ...r,
        id: r.id + 100,
        title: r.title + ' (更多做法)'
    }));
    
    const newCards = moreRecipes.map(recipe => createRecipeCard(recipe)).join('');
    recipeGrid.insertAdjacentHTML('beforeend', newCards);
}

// Handle Search
function handleSearch(e) {
    if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query) {
            console.log(`搜索菜谱: ${query}`);
            performSearch(query);
        }
    }
}

// Perform Search
function performSearch(query) {
    const filtered = CN_RECIPES.filter(recipe => 
        recipe.title.includes(query) || 
        recipe.tags.some(tag => tag.includes(query))
    );
    
    if (filtered.length > 0) {
        recipeGrid.innerHTML = filtered.map(recipe => createRecipeCard(recipe)).join('');
    } else {
        recipeGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">未找到相关菜谱，请尝试其他关键词</p>';
    }
}

// Filter by Category
function filterByCategory(category) {
    console.log(`按菜系筛选: ${category}`);
    const filtered = CN_RECIPES.filter(recipe => recipe.cuisine === category);
    
    if (filtered.length > 0) {
        recipeGrid.innerHTML = filtered.map(recipe => createRecipeCard(recipe)).join('');
    } else {
        recipeGrid.innerHTML = `<p style="text-align: center; color: var(--text-secondary);">暂无${category}菜谱，敬请期待</p>`;
    }
}

// Filter by Cuisine (from hero tags)
function filterByCuisine(cuisine) {
    filterByCategory(cuisine);
}

// Open Recipe Detail
function openRecipeDetail(recipeId) {
    const recipe = CN_RECIPES.find(r => r.id == recipeId);
    if (recipe) {
        console.log(`查看菜谱详情: ${recipe.title}`);
        alert(`菜谱详情：${recipe.title}\n烹饪时间：${recipe.time}\n难度：${recipe.difficulty}\n热量：${recipe.calories}`);
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
    module.exports = { SITE_CONFIG, CN_RECIPES, initApp };
}
