/**
 * 宝宝辅食乐园 - Kid Nutrition Site
 * 马卡龙粉蓝配色主题 - Macaron Pink & Blue Theme
 */

// Site Configuration
const SITE_CONFIG = {
    SITE_ID: 'kid-nutrition',
    SITE_NAME: '宝宝辅食乐园',
    SITE_TAGLINE: '健康营养每一天',
    API_BASE_URL: '/api/kid-nutrition',
    RECIPES_PER_PAGE: 8,
    FEATURED_RECIPES_COUNT: 4
};

// 宝宝辅食菜谱数据
const KID_RECIPES = [
    {
        id: 1,
        title: '南瓜泥米糊',
        image: '🎃',
        time: '15分钟',
        difficulty: '简单',
        calories: '80卡',
        tags: ['6-8个月', '蔬菜', '初添'],
        ageGroup: '6-8个月'
    },
    {
        id: 2,
        title: '胡萝卜苹果泥',
        image: '🥕',
        time: '20分钟',
        difficulty: '简单',
        calories: '65卡',
        tags: ['6-8个月', '蔬果', '维A'],
        ageGroup: '6-8个月'
    },
    {
        id: 3,
        title: '蛋黄粥',
        image: '🥚',
        time: '25分钟',
        difficulty: '简单',
        calories: '95卡',
        tags: ['9-12个月', '蛋白质', '补铁'],
        ageGroup: '9-12个月'
    },
    {
        id: 4,
        title: '三文鱼蔬菜泥',
        image: '🐟',
        time: '30分钟',
        difficulty: '中等',
        calories: '120卡',
        tags: ['9-12个月', 'DHA', '鱼肉'],
        ageGroup: '9-12个月'
    },
    {
        id: 5,
        title: '鸡肉蔬菜粥',
        image: '🍲',
        time: '35分钟',
        difficulty: '中等',
        calories: '140卡',
        tags: ['1-2岁', '主食', '均衡'],
        ageGroup: '1-2岁'
    },
    {
        id: 6,
        title: '牛肉土豆泥',
        image: '🥔',
        time: '40分钟',
        difficulty: '中等',
        calories: '160卡',
        tags: ['1-2岁', '补铁', '肉类'],
        ageGroup: '1-2岁'
    },
    {
        id: 7,
        title: '彩色蔬菜面',
        image: '🍜',
        time: '20分钟',
        difficulty: '简单',
        calories: '130卡',
        tags: ['2岁以上', '主食', '多彩'],
        ageGroup: '2岁以上'
    },
    {
        id: 8,
        title: '鲜虾蔬菜饼',
        image: '🦐',
        time: '25分钟',
        difficulty: '中等',
        calories: '110卡',
        tags: ['2岁以上', '手指食物', '补钙'],
        ageGroup: '2岁以上'
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
    return KID_RECIPES;
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
            const ageText = card.querySelector('p').textContent;
            filterByAgeGroup(ageText);
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
            const ageGroup = tag.textContent;
            filterByAgeGroup(ageGroup);
        });
    });
}

// Handle Load More Button
function handleLoadMore() {
    console.log('加载更多辅食食谱...');
    
    // 模拟加载更多食谱
    const moreRecipes = KID_RECIPES.map(r => ({
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
            console.log(`搜索辅食: ${query}`);
            performSearch(query);
        }
    }
}

// Perform Search
function performSearch(query) {
    const filtered = KID_RECIPES.filter(recipe => 
        recipe.title.includes(query) || 
        recipe.tags.some(tag => tag.includes(query))
    );
    
    if (filtered.length > 0) {
        recipeGrid.innerHTML = filtered.map(recipe => createRecipeCard(recipe)).join('');
    } else {
        recipeGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">未找到相关辅食，请尝试其他关键词</p>';
    }
}

// Filter by Age Group
function filterByAgeGroup(ageGroup) {
    console.log(`按月龄筛选: ${ageGroup}`);
    const filtered = KID_RECIPES.filter(recipe => recipe.ageGroup === ageGroup);
    
    if (filtered.length > 0) {
        recipeGrid.innerHTML = filtered.map(recipe => createRecipeCard(recipe)).join('');
    } else {
        recipeGrid.innerHTML = `<p style="text-align: center; color: var(--text-secondary);">暂无${ageGroup}的辅食食谱，敬请期待</p>`;
    }
}

// Open Recipe Detail
function openRecipeDetail(recipeId) {
    const recipe = KID_RECIPES.find(r => r.id == recipeId);
    if (recipe) {
        console.log(`查看辅食详情: ${recipe.title}`);
        alert(`辅食详情：${recipe.title}\n适合月龄：${recipe.ageGroup}\n烹饪时间：${recipe.time}\n难度：${recipe.difficulty}\n热量：${recipe.calories}\n\n营养标签：${recipe.tags.join('、')}`);
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
    module.exports = { SITE_CONFIG, KID_RECIPES, initApp };
}
