/**
 * 智能每日配餐 - 总站应用逻辑
 * Smart Meal Planner - Main Site App Logic
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

// 站点ID
const SITE_ID = 'main';

// 合并所有菜谱数据为统一格式
const ALL_RECIPES = [];

// 中文分类到英文分类的映射
const categoryMap = {
    '热菜': 'dish', '凉菜': 'dish', '主食': 'dish', '早餐': 'dish',
    '甜品': 'dish', '火锅': 'dish', '小吃': 'dish', '烧烤': 'dish',
    '烘焙': 'dish', '沙拉': 'dish', '饮品': 'drink', '三明治': 'dish',
    '汤品': 'soup', '汤': 'soup'
};

// 将新格式菜谱转换为兼容格式并加入 ALL_RECIPES
function normalizeRecipe(r) {
    const rawCategory = r.category || '热菜';
    return {
        id: r.id,
        name: r.name,
        nameEn: r.nameEn || '',
        cuisine: r.cuisine || '',
        category: categoryMap[rawCategory] || 'dish',
        tags: r.tags || [],
        time: (r.prepTime || 0) + (r.cookTime || 0),
        difficulty: r.difficulty || '简单',
        calories: r.calories || Math.round((r.prepTime || 10) * 8 + Math.random() * 100),
        protein: r.protein || Math.round(10 + Math.random() * 25),
        fat: r.fat || Math.round(5 + Math.random() * 15),
        emoji: r.emoji || '🍽️',
        spicy: r.spicy || false,
        ingredients: r.ingredients || [],
        tools: r.tools || [],
        steps: r.steps || []
    };
}

// 处理 CN_RECIPES
if (typeof CN_RECIPES !== 'undefined' && Array.isArray(CN_RECIPES)) {
    CN_RECIPES.forEach(r => ALL_RECIPES.push(normalizeRecipe(r)));
}

// 处理 CN_RECIPES_EXTRA1
if (typeof CN_RECIPES_EXTRA1 !== 'undefined' && Array.isArray(CN_RECIPES_EXTRA1)) {
    CN_RECIPES_EXTRA1.forEach(r => ALL_RECIPES.push(normalizeRecipe(r)));
}

// 处理 WESTERN_RECIPES
if (typeof WESTERN_RECIPES !== 'undefined' && Array.isArray(WESTERN_RECIPES)) {
    WESTERN_RECIPES.forEach(r => ALL_RECIPES.push(normalizeRecipe(r)));
}

// 处理 WESTERN_RECIPES_EXTRA1
if (typeof WESTERN_RECIPES_EXTRA1 !== 'undefined' && Array.isArray(WESTERN_RECIPES_EXTRA1)) {
    WESTERN_RECIPES_EXTRA1.forEach(r => ALL_RECIPES.push(normalizeRecipe(r)));
}

// 如果没有外部菜谱数据，回退到旧的 RECIPE_DATABASE
if (ALL_RECIPES.length === 0 && typeof RECIPE_DATABASE !== 'undefined') {
    Object.values(RECIPE_DATABASE).forEach(category => {
        category.forEach(r => ALL_RECIPES.push(r));
    });
}

// 覆盖 getAllRecipes 使用 ALL_RECIPES
function getAllRecipes() {
    return ALL_RECIPES;
}

// 当前状态
let currentMeal = null;
let currentAdults = 2;
let currentChildren = 0;

// DOM元素
const elements = {
  adultNum: document.getElementById('adultNum'),
  childNum: document.getElementById('childNum'),
  includeSpicy: document.getElementById('includeSpicy'),
  generateBtn: document.getElementById('generateBtn'),
  resultSection: document.getElementById('resultSection'),
  dishGrid: document.getElementById('dishGrid'),
  soupGrid: document.getElementById('soupGrid'),
  mealStats: document.getElementById('mealStats'),
  confirmBtn: document.getElementById('confirmBtn'),
  refreshBtn: document.getElementById('refreshBtn'),
  recipeModal: document.getElementById('recipeModal'),
  modalClose: document.getElementById('modalClose'),
  modalBody: document.getElementById('modalBody'),
  navLinks: document.getElementById('navLinks'),
  navToggle: document.getElementById('navToggle')
};

// 初始化
function init() {
  renderNavigation();
  bindEvents();
  loadSavedSettings();
}

// 渲染导航
function renderNavigation() {
  const nav = generateSiteNav(SITE_ID);
  elements.navLinks.innerHTML = nav.map(item => `
    <li>
      <a href="${item.url}" class="${item.active ? 'active' : ''}">
        ${item.name}
      </a>
    </li>
  `).join('');
}

// 绑定事件
function bindEvents() {
  // 生成按钮
  elements.generateBtn.addEventListener('click', handleGenerate);
  
  // 人数变化
  elements.adultNum.addEventListener('change', (e) => {
    currentAdults = parseInt(e.target.value);
    saveSettings();
  });
  
  elements.childNum.addEventListener('change', (e) => {
    currentChildren = parseInt(e.target.value);
    saveSettings();
  });
  
  // 确认和刷新
  elements.confirmBtn.addEventListener('click', handleConfirm);
  elements.refreshBtn.addEventListener('click', handleRefresh);
  
  // 弹窗
  elements.modalClose.addEventListener('click', closeModal);
  elements.recipeModal.addEventListener('click', (e) => {
    if (e.target === elements.recipeModal) closeModal();
  });
  
  // 导航切换
  elements.navToggle.addEventListener('click', () => {
    elements.navLinks.classList.toggle('active');
  });

  // 支持我们链接
  const sponsorLink = document.getElementById('sponsorLink');
  if (sponsorLink) {
    sponsorLink.addEventListener('click', function(e) {
      e.preventDefault();
      showUnderDevelopment('赞助支持');
    });
  }
  
  // 键盘快捷键
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Enter' && !currentMeal) handleGenerate();
  });
}

// 生成菜单
function handleGenerate() {
  const adults = parseInt(elements.adultNum.value);
  const children = parseInt(elements.childNum.value);
  const includeSpicy = elements.includeSpicy.checked;
  
  currentAdults = adults;
  currentChildren = children;
  
  // 显示加载状态
  elements.generateBtn.innerHTML = '<span class="loading"></span> 生成中...';
  elements.generateBtn.disabled = true;
  
  // 模拟加载延迟（增强体验）
  setTimeout(() => {
    currentMeal = generateMealPlan(adults, children, SITE_ID, { includeSpicy });
    renderMeal(currentMeal);
    
    // 显示结果
    elements.resultSection.style.display = 'block';
    elements.resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // 恢复按钮
    elements.generateBtn.innerHTML = `
      <span class="btn-icon">✨</span>
      <span>重新生成</span>
      <span class="btn-en">Regenerate</span>
    `;
    elements.generateBtn.disabled = false;
    
    // 保存到历史
    saveToHistory(currentMeal);
  }, 600);
}

// 渲染菜单
function renderMeal(meal) {
  // 渲染统计
  const totalDishes = meal.dishes.length + meal.soups.length;
  elements.mealStats.innerHTML = `
    <div class="stat-item">📊 ${totalDishes} 道菜</div>
    <div class="stat-item">🔥 ${meal.stats.totalCalories} 千卡</div>
    <div class="stat-item">💪 ${meal.stats.totalProtein}g 蛋白质</div>
    <div class="stat-item">⏱️ ${meal.stats.prepTime} 分钟</div>
  `;
  
  // 渲染热菜
  elements.dishGrid.innerHTML = meal.dishes.map((dish, index) => 
    createRecipeCard(dish, index, false)
  ).join('');
  
  // 渲染汤品
  elements.soupGrid.innerHTML = meal.soups.map((soup, index) => 
    createRecipeCard(soup, index, true)
  ).join('');
  
  // 添加卡片点击事件
  document.querySelectorAll('.recipe-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('change-btn')) {
        const recipeId = card.dataset.id;
        const recipe = findRecipeById(recipeId);
        if (recipe) showRecipeModal(recipe);
      }
    });
  });
  
  // 添加换菜按钮事件
  document.querySelectorAll('.change-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = parseInt(btn.dataset.index);
      const isSoup = btn.dataset.issoup === 'true';
      handleChangeDish(index, isSoup);
    });
  });
}

// 创建菜谱卡片
function createRecipeCard(recipe, index, isSoup) {
  const tags = recipe.tags.slice(0, 3).map(tag => {
    let className = 'tag';
    if (tag === 'spicy') className += ' spicy';
    if (tag === 'low-calorie' || tag === 'healthy') className += ' healthy';
    if (tag === 'quick' || tag === '10min') className += ' quick';
    return `<span class="${className}">${getTagLabel(tag)}</span>`;
  }).join('');
  
  return `
    <div class="recipe-card fade-in" data-id="${recipe.id}" style="animation-delay: ${index * 0.1}s">
      <button class="change-btn" data-index="${index}" data-issoup="${isSoup}" title="换一道">
        🔄
      </button>
      <div class="recipe-icon">${isSoup ? '🍲' : '🥘'}</div>
      <div class="recipe-name">${recipe.name}</div>
      <div class="recipe-name-en">${recipe.nameEn}</div>
      <div class="recipe-meta">
        <span>⏱️ ${recipe.time}分钟</span>
        <span>🔥 ${recipe.calories}千卡</span>
      </div>
      <div class="recipe-tags">${tags}</div>
    </div>
  `;
}

// 获取标签中文
function getTagLabel(tag) {
  const labels = {
    'kid-friendly': '儿童适宜',
    'quick': '快手',
    'easy': '简单',
    'spicy': '辣味',
    'healthy': '健康',
    'low-calorie': '低卡',
    'high-protein': '高蛋白',
    'vegetarian': '素食',
    'classic': '经典',
    'feast': '宴席',
    '10min': '10分钟',
    '15min': '15分钟'
  };
  return labels[tag] || tag;
}

// 查找菜谱
function findRecipeById(id) {
  const all = getAllRecipes();
  return all.find(r => r.id === id);
}

// 显示菜谱详情弹窗
function showRecipeModal(recipe) {
  // 兼容新旧格式：ingredients 可能是字符串数组或对象数组
  const ingredients = recipe.ingredients.map(ing => {
    if (typeof ing === 'object' && ing.name) {
      return `<span class="ingredient-item">${ing.name} ${ing.amount || ''}</span>`;
    }
    return `<span class="ingredient-item">${ing}</span>`;
  }).join('');
  
  const steps = recipe.steps.map((step, i) => `
    <div class="step-item">
      <div class="step-number">${i + 1}</div>
      <div class="step-content">${step}</div>
    </div>
  `).join('');
  
  // 工具列表（如果有）
  const toolsHtml = recipe.tools && recipe.tools.length > 0 
    ? `<div class="modal-section"><h3 class="modal-section-title">🔧 所需工具</h3><div class="ingredients-list">${recipe.tools.map(t => `<span class="ingredient-item">${t}</span>`).join('')}</div></div>`
    : '';
  
  elements.modalBody.innerHTML = `
    <div class="modal-header">
      <h2 class="modal-title">${recipe.name}</h2>
      <div class="modal-title-en">${recipe.nameEn}</div>
      <div class="modal-meta">
        <span class="meta-item">⏱️ ${recipe.time}分钟</span>
        <span class="meta-item">🔥 ${recipe.calories}千卡</span>
        <span class="meta-item">💪 ${recipe.protein}g蛋白质</span>
        <span class="meta-item">🥩 ${recipe.fat}g脂肪</span>
      </div>
    </div>
    
    <div class="modal-section">
      <h3 class="modal-section-title">🥬 食材清单</h3>
      <div class="ingredients-list">${ingredients}</div>
    </div>
    ${toolsHtml}
    <div class="modal-section">
      <h3 class="modal-section-title">👨‍🍳 烹饪步骤</h3>
      <div class="steps-list">${steps}</div>
    </div>
  `;
  
  elements.recipeModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// 关闭弹窗
function closeModal() {
  elements.recipeModal.classList.remove('active');
  document.body.style.overflow = '';
}

// 换菜
function handleChangeDish(index, isSoup) {
  const btn = document.querySelector(`.change-btn[data-index="${index}"][data-issoup="${isSoup}"]`);
  btn.innerHTML = '<span class="loading"></span>';
  btn.disabled = true;
  
  setTimeout(() => {
    currentMeal = changeDish(
      currentMeal, 
      index, 
      isSoup, 
      SITE_ID, 
      { hasChildren: currentChildren > 0, includeSpicy: elements.includeSpicy.checked }
    );
    renderMeal(currentMeal);
  }, 300);
}

// 确认菜单
function handleConfirm() {
  const totalDishes = currentMeal.dishes.length + currentMeal.soups.length;
  const dishNames = [...currentMeal.dishes, ...currentMeal.soups].map(r => r.name).join('、');
  
  alert(`✅ 菜单确认成功！\n\n共 ${totalDishes} 道菜：\n${dishNames}\n\n点击任意菜品可查看详细做法，祝您用餐愉快！`);
}

// 刷新全部
function handleRefresh() {
  handleGenerate();
}

// 保存设置
function saveSettings() {
  Storage.set('mealSettings', {
    adults: currentAdults,
    children: currentChildren,
    includeSpicy: elements.includeSpicy.checked
  });
}

// 加载设置
function loadSavedSettings() {
  const settings = Storage.get('mealSettings');
  if (settings) {
    elements.adultNum.value = settings.adults || 2;
    elements.childNum.value = settings.children || 0;
    elements.includeSpicy.checked = settings.includeSpicy || false;
    currentAdults = settings.adults || 2;
    currentChildren = settings.children || 0;
  }
}

// 保存到历史
function saveToHistory(meal) {
  const history = Storage.get('mealHistory', []);
  history.unshift({
    date: new Date().toISOString(),
    meal: meal,
    adults: currentAdults,
    children: currentChildren
  });
  // 只保留最近10条
  if (history.length > 10) history.pop();
  Storage.set('mealHistory', history);
}

// 启动应用
document.addEventListener('DOMContentLoaded', init);
