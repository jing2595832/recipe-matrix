/**
 * 智能菜谱网站矩阵 - 全局配餐算法
 * Recipe Matrix - Global Meal Planning Algorithm
 * 
 * 所有站点共享此算法文件
 * All sites share this algorithm file
 */

// 配餐算法配置
const MEAL_CONFIG = {
  // 人数与菜品数量对应关系
  portionRules: {
    dishes: [
      { maxPeople: 2, count: 2 },    // 1-2人: 2道菜
      { maxPeople: 4, count: 3 },    // 3-4人: 3道菜
      { maxPeople: 99, count: 4 }    // 5人及以上: 4道菜
    ],
    soups: [
      { maxPeople: 6, count: 1 },    // 1-6人: 1道汤
      { maxPeople: 99, count: 2 }    // 7人及以上: 2道汤
    ]
  },
  
  // 儿童餐调整规则
  kidAdjustments: {
    avoidTags: ['spicy', 'hot', 'greasy'],
    preferTags: ['kid-friendly', 'mild', 'soft', 'low-salt'],
    maxSpiciness: 'mild'
  }
};

/**
 * 根据人数计算需要的菜品数量
 * Calculate required dish count based on people count
 */
function calculatePortion(adults, children) {
  const totalPeople = adults + children;
  
  let dishCount = 2;
  for (const rule of MEAL_CONFIG.portionRules.dishes) {
    if (totalPeople <= rule.maxPeople) {
      dishCount = rule.count;
      break;
    }
  }
  
  let soupCount = 1;
  for (const rule of MEAL_CONFIG.portionRules.soups) {
    if (totalPeople <= rule.maxPeople) {
      soupCount = rule.count;
      break;
    }
  }
  
  return { dishCount, soupCount, totalPeople };
}

/**
 * 从数组中随机选取指定数量的元素
 * Randomly select specified count of items from array
 */
function randomSelect(array, count) {
  if (!array || array.length === 0) return [];
  if (count >= array.length) return [...array];
  
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * 智能配餐主函数
 * Smart meal planning main function
 */
function generateMealPlan(adults, children, siteId, options = {}) {
  const { dishCount, soupCount } = calculatePortion(adults, children);
  
  // 获取该站点可用的菜谱
  const availableDishes = getRecipesByCategory(siteId, 'dish');
  const availableSoups = getRecipesByCategory(siteId, 'soup');
  
  // 如果有儿童，过滤掉不适合儿童的菜品
  let filteredDishes = availableDishes;
  if (children > 0 && !options.includeSpicy) {
    filteredDishes = availableDishes.filter(dish => 
      !dish.tags.some(tag => MEAL_CONFIG.kidAdjustments.avoidTags.includes(tag))
    );
  }
  
  // 如果过滤后菜品不足，回退到全部菜品
  if (filteredDishes.length < dishCount) {
    filteredDishes = availableDishes;
  }
  
  // 随机选择
  const selectedDishes = randomSelect(filteredDishes, dishCount);
  const selectedSoups = randomSelect(availableSoups, soupCount);
  
  return {
    dishes: selectedDishes,
    soups: selectedSoups,
    stats: {
      totalCalories: [...selectedDishes, ...selectedSoups].reduce((sum, r) => sum + (r.calories || 0), 0),
      totalProtein: [...selectedDishes, ...selectedSoups].reduce((sum, r) => sum + (r.protein || 0), 0),
      prepTime: Math.max(...[...selectedDishes, ...selectedSoups].map(r => r.time || 0))
    }
  };
}

/**
 * 重新生成单个菜品（换菜功能）
 * Regenerate single dish (change dish feature)
 */
function changeDish(currentMeal, dishIndex, isSoup, siteId, options = {}) {
  const { dishes, soups } = currentMeal;
  const isDish = !isSoup;
  
  // 获取可用菜谱
  const availableRecipes = isDish 
    ? getRecipesByCategory(siteId, 'dish')
    : getRecipesByCategory(siteId, 'soup');
  
  // 排除当前已选
  const currentRecipes = isDish ? dishes : soups;
  const excludeIds = currentRecipes.map(r => r.id);
  
  // 过滤可用选项
  let candidates = availableRecipes.filter(r => !excludeIds.includes(r.id));
  
  // 儿童过滤
  if (options.hasChildren && !options.includeSpicy) {
    candidates = candidates.filter(r => 
      !r.tags.some(tag => MEAL_CONFIG.kidAdjustments.avoidTags.includes(tag))
    );
  }
  
  // 如果过滤后没有可选，从全部中随机（可能重复）
  if (candidates.length === 0) {
    candidates = availableRecipes;
  }
  
  // 随机选择一个新菜品
  const newDish = candidates[Math.floor(Math.random() * candidates.length)];
  
  // 替换
  if (isDish) {
    dishes[dishIndex] = newDish;
  } else {
    soups[dishIndex] = newDish;
  }
  
  return { ...currentMeal, dishes: [...dishes], soups: [...soups] };
}

/**
 * 计算营养信息
 * Calculate nutrition info
 */
function calculateNutrition(recipes) {
  return recipes.reduce((total, recipe) => ({
    calories: total.calories + (recipe.calories || 0),
    protein: total.protein + (recipe.protein || 0),
    fat: total.fat + (recipe.fat || 0)
  }), { calories: 0, protein: 0, fat: 0 });
}

/**
 * 格式化食材单位（根据站点配置）
 * Format ingredient units based on site config
 */
function formatIngredient(ingredient, siteId) {
  const config = getSiteConfig(siteId);
  
  // 如果是美式站点，使用英制单位
  if (config.units === 'imperial' && ingredient.amountEn) {
    return {
      name: ingredient.nameEn || ingredient.name,
      amount: ingredient.amountEn
    };
  }
  
  return ingredient;
}

/**
 * 获取站点主题配置
 * Get site theme configuration
 */
function getThemeConfig(siteId) {
  const themes = {
    'warm-orange': {
      primary: '#e67722',
      secondary: '#fef5eb',
      accent: '#27ae60',
      text: '#333333',
      light: '#ffffff',
      gradient: 'linear-gradient(135deg, #e67722 0%, #f39c12 100%)'
    },
    'chinese-red': {
      primary: '#c41e3a',
      secondary: '#fdf5e6',
      accent: '#d4a574',
      text: '#333333',
      light: '#ffffff',
      gradient: 'linear-gradient(135deg, #c41e3a 0%, #e74c3c 100%)'
    },
    'american-minimal': {
      primary: '#2c3e50',
      secondary: '#ecf0f1',
      accent: '#3498db',
      text: '#2c3e50',
      light: '#ffffff',
      gradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
    },
    'cute-pastel': {
      primary: '#ff9a9e',
      secondary: '#fad0c4',
      accent: '#a8edea',
      text: '#5d4e6d',
      light: '#ffffff',
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)'
    },
    'fitness-dark': {
      primary: '#1a1a2e',
      secondary: '#16213e',
      accent: '#4ecca3',
      text: '#eeeeee',
      light: '#0f3460',
      gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
    },
    'quick-blue': {
      primary: '#3498db',
      secondary: '#ebf5fb',
      accent: '#2ecc71',
      text: '#2c3e50',
      light: '#ffffff',
      gradient: 'linear-gradient(135deg, #3498db 0%, #5dade2 100%)'
    },
    'luxury-gold': {
      primary: '#c9a227',
      secondary: '#f9f3e3',
      accent: '#8b0000',
      text: '#4a4a4a',
      light: '#ffffff',
      gradient: 'linear-gradient(135deg, #c9a227 0%, #d4af37 100%)'
    }
  };
  
  const config = getSiteConfig(siteId);
  return themes[config.theme] || themes['warm-orange'];
}

/**
 * 生成站点导航链接
 * Generate site navigation links
 */
function generateSiteNav(currentSiteId) {
  const sites = [
    { id: 'main', name: '首页', nameEn: 'Home' },
    { id: 'cn-home', name: '中式菜', nameEn: 'Chinese' },
    { id: 'us-family', name: '美式餐', nameEn: 'American' },
    { id: 'kid-nutrition', name: '儿童餐', nameEn: 'Kids' },
    { id: 'fitness-diet', name: '减脂餐', nameEn: 'Fitness' },
    { id: 'quick-meal', name: '快手餐', nameEn: 'Quick' },
    { id: 'party-feast', name: '宴席餐', nameEn: 'Party' }
  ];
  
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  return sites.map(site => ({
    ...site,
    active: site.id === currentSiteId,
    url: isLocal 
      ? (site.id === 'main' ? 'index.html' : `../${site.id}/index.html`)
      : (site.id === 'main' ? 'https://recipe-matrix.pages.dev' : `https://${site.id}-recipe.pages.dev`)
  }));
}

/**
 * 防抖函数
 * Debounce function
 */
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

/**
 * 本地存储工具
 * Local storage utilities
 */
const Storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage not available');
    }
  },
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('Storage not available');
    }
  }
};

// 导出（如果在模块环境中）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MEAL_CONFIG,
    calculatePortion,
    randomSelect,
    generateMealPlan,
    changeDish,
    calculateNutrition,
    formatIngredient,
    getThemeConfig,
    generateSiteNav,
    debounce,
    Storage
  };
}
