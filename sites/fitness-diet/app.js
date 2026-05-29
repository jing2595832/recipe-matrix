/**
 * 健身减脂餐 - Fitness Diet Site
 * 黑绿配色主题 - Dark & Green Theme
 */

// Site Configuration
const SITE_CONFIG = {
    SITE_ID: 'fitness-diet',
    SITE_NAME: '健身减脂餐',
    SITE_TAGLINE: '科学饮食塑造完美身材',
    API_BASE_URL: '/api/fitness-diet',
    RECIPES_PER_PAGE: 8,
    FEATURED_RECIPES_COUNT: 4
};

// 健身减脂餐菜谱数据
const FITNESS_RECIPES = [
    {
        id: 1,
        title: '香煎鸡胸肉沙拉',
        image: '🥗',
        time: '20分钟',
        difficulty: '简单',
        calories: '280卡',
        tags: ['高蛋白', '低脂', '增肌'],
        goal: '燃脂减重'
    },
    {
        id: 2,
        title: '藜麦牛油果碗',
        image: '🥑',
        time: '15分钟',
        difficulty: '简单',
        calories: '350卡',
        tags: ['健康脂肪', '高纤维', '素食'],
        goal: '维持体重'
    },
    {
        id: 3,
        title: '三文鱼配芦笋',
        image: '🐟',
        time: '25分钟',
        difficulty: '中等',
        calories: '320卡',
        tags: ['Omega-3', '高蛋白', '生酮'],
        goal: '增肌塑形'
    },
    {
        id: 4,
        title: '牛肉西兰花',
        image: '🥦',
        time: '30分钟',
        difficulty: '中等',
        calories: '380卡',
        tags: ['高蛋白', '低碳', '补铁'],
        goal: '增肌塑形'
    },
    {
        id: 5,
        title: '蛋白燕麦粥',
        image: '🥣',
        time: '10分钟',
        difficulty: '简单',
        calories: '250卡',
        tags: ['早餐', '高蛋白', '快手'],
        goal: '燃脂减重'
    },
    {
        id: 6,
        title: '豆腐蔬菜卷',
        image: '🌯',
        time: '20分钟',
        difficulty: '中等',
        calories: '200卡',
        tags: ['素食', '高蛋白', '低卡'],
        goal: '素食健身'
    },
    {
        id: 7,
        title: '虾仁西葫芦面',
        image: '🍤',
        time: '15分钟',
        difficulty: '简单',
        calories: '180卡',
        tags: ['低碳', '高蛋白', '轻食'],
        goal: '燃脂减重'
    },
    {
        id: 8,
        title: '鸡蛋菠菜杯',
        image: '🥚',
        time: '25分钟',
        difficulty: '简单',
        calories: '220卡',
        tags: ['早餐', '高蛋白', '生酮'],
        goal: '生酮饮食'
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
    return FITNESS_RECIPES;
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
            const categoryTitle = card.querySelector('h4').textContent;
            filterByGoal(categoryTitle);
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
    console.log('加载更多健身食谱...');
    
    // 模拟加载更多食谱
    const moreRecipes = FITNESS_RECIPES.map(r => ({
        ...r,
        id: r.id + 100,
        title: r.title + ' (升级版)'
    }));
    
    const newCards = moreRecipes.map(recipe => createRecipeCard(recipe)).join('');
    recipeGrid.insertAdjacentHTML('beforeend', newCards);
}

// Handle Search
function handleSearch(e) {
    if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query) {
            console.log(`搜索健身餐: ${query}`);
            performSearch(query);
        }
    }
}

// Perform Search
function performSearch(query) {
    const filtered = FITNESS_RECIPES.filter(recipe => 
        recipe.title.includes(query) || 
        recipe.tags.some(tag => tag.includes(query))
    );
    
    if (filtered.length > 0) {
        recipeGrid.innerHTML = filtered.map(recipe => createRecipeCard(recipe)).join('');
    } else {
        recipeGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">未找到相关食谱，请尝试其他关键词</p>';
    }
}

// Filter by Goal
function filterByGoal(goal) {
    console.log(`按目标筛选: ${goal}`);
    const filtered = FITNESS_RECIPES.filter(recipe => recipe.goal === goal);
    
    if (filtered.length > 0) {
        recipeGrid.innerHTML = filtered.map(recipe => createRecipeCard(recipe)).join('');
    } else {
        recipeGrid.innerHTML = `<p style="text-align: center; color: var(--text-secondary);">暂无${goal}相关食谱，敬请期待</p>`;
    }
}

// Filter by Tag
function filterByTag(tag) {
    console.log(`按标签筛选: ${tag}`);
    const filtered = FITNESS_RECIPES.filter(recipe => 
        recipe.tags.some(t => t.includes(tag))
    );
    
    if (filtered.length > 0) {
        recipeGrid.innerHTML = filtered.map(recipe => createRecipeCard(recipe)).join('');
    } else {
        recipeGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">未找到相关食谱</p>';
    }
}

// Open Recipe Detail
function openRecipeDetail(recipeId) {
    const recipe = FITNESS_RECIPES.find(r => r.id == recipeId);
    if (recipe) {
        console.log(`查看食谱详情: ${recipe.title}`);
        alert(`食谱详情：${recipe.title}\n烹饪时间：${recipe.time}\n难度：${recipe.difficulty}\n热量：${recipe.calories}\n适合目标：${recipe.goal}\n\n营养标签：${recipe.tags.join('、')}`);
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
    module.exports = { SITE_CONFIG, FITNESS_RECIPES, initApp };
}
