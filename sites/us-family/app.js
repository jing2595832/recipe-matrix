/**
 * American Family Meals - US Family Cooking Site
 * Auto Meal Planner - 智能配餐
 */

const SITE_ID = 'us-family';

// American Family Recipes Data (with ingredients and steps)
const US_RECIPES = [
    {
        id: 1,
        title: 'Classic Cheeseburger',
        image: '🍔',
        time: '25 min',
        difficulty: 'Easy',
        calories: 550,
        caloriesText: '550 cal',
        tags: ['Beef', 'Quick', 'Kid-Friendly'],
        category: 'Burgers',
        type: 'dish',
        spicy: false,
        ingredients: ['Ground beef 1 lb (450g)', 'Cheddar cheese 4 slices', 'Hamburger buns 4', 'Lettuce leaves', 'Tomato slices', 'Red onion rings', 'Pickles', 'Ketchup', 'Mustard', 'Salt & pepper'],
        steps: [
            'Divide ground beef into 4 equal portions and gently form into patties, about 3/4 inch thick',
            'Season both sides generously with salt and pepper',
            'Heat a grill or skillet over medium-high heat and lightly oil the surface',
            'Cook patties for 4-5 minutes per side for medium, or until desired doneness',
            'In the last minute of cooking, place a slice of cheddar cheese on each patty and cover to melt',
            'Toast the hamburger buns on the grill or in a skillet for 1 minute',
            'Assemble burgers: bottom bun, lettuce, patty with cheese, tomato, onion, pickles, top bun',
            'Serve with ketchup, mustard, and your favorite sides like fries'
        ]
    },
    {
        id: 2,
        title: 'Mac and Cheese',
        image: '🧀',
        time: '35 min',
        difficulty: 'Easy',
        calories: 480,
        caloriesText: '480 cal',
        tags: ['Pasta', 'Comfort', 'Cheesy'],
        category: 'Pasta',
        type: 'dish',
        spicy: false,
        ingredients: ['Elbow macaroni 1 lb (450g)', 'Sharp cheddar cheese 3 cups shredded', 'Butter 3 tbsp', 'All-purpose flour 3 tbsp', 'Whole milk 3 cups', 'Salt 1 tsp', 'Garlic powder 1/2 tsp', 'Mustard powder 1/4 tsp', 'Breadcrumbs 1/2 cup', 'Paprika for garnish'],
        steps: [
            'Cook macaroni in a large pot of salted boiling water until al dente, about 8 minutes. Drain and set aside',
            'In the same pot, melt butter over medium heat',
            'Whisk in flour and cook for 1-2 minutes to form a roux, stirring constantly',
            'Gradually pour in milk while whisking to prevent lumps',
            'Cook sauce for 5-7 minutes, stirring frequently, until thickened and smooth',
            'Remove from heat and stir in 2.5 cups of shredded cheddar, salt, garlic powder, and mustard powder until melted',
            'Add the cooked macaroni to the cheese sauce and stir until well coated',
            'Transfer to a baking dish, top with remaining cheese and breadcrumbs, broil 3-4 minutes until golden'
        ]
    },
    {
        id: 3,
        title: 'Fried Chicken',
        image: '🍗',
        time: '45 min',
        difficulty: 'Medium',
        calories: 620,
        caloriesText: '620 cal',
        tags: ['Chicken', 'Classic', 'Crispy'],
        category: 'Chicken',
        type: 'dish',
        spicy: false,
        ingredients: ['Chicken pieces (thighs, drumsticks) 2 lbs (900g)', 'Buttermilk 2 cups', 'All-purpose flour 2 cups', 'Cornstarch 1/2 cup', 'Paprika 2 tsp', 'Garlic powder 1 tsp', 'Onion powder 1 tsp', 'Cayenne pepper 1/4 tsp', 'Salt 1 tbsp', 'Black pepper 1 tsp', 'Vegetable oil for frying'],
        steps: [
            'Soak chicken pieces in buttermilk for at least 30 minutes (or overnight for best results)',
            'Mix flour, cornstarch, paprika, garlic powder, onion powder, cayenne, salt, and pepper in a large bowl',
            'Heat vegetable oil to 350F (175C) in a large heavy pot or Dutch oven',
            'Remove chicken from buttermilk, letting excess drip off',
            'Dredge each piece thoroughly in the flour mixture, pressing firmly to coat',
            'Carefully place chicken in hot oil, skin side down, working in batches to avoid overcrowding',
            'Fry for 12-15 minutes, turning once halfway, until golden brown and cooked through (internal temp 165F)',
            'Drain on a wire rack set over a baking sheet. Serve hot with your favorite dipping sauce'
        ]
    },
    {
        id: 4,
        title: 'BBQ Ribs',
        image: '🥩',
        time: '3 hrs',
        difficulty: 'Medium',
        calories: 750,
        caloriesText: '750 cal',
        tags: ['Pork', 'BBQ', 'Slow-Cook'],
        category: 'Beef',
        type: 'dish',
        spicy: false,
        ingredients: ['Pork ribs (baby back) 2 racks', 'BBQ sauce 1.5 cups', 'Brown sugar 1/4 cup', 'Smoked paprika 2 tbsp', 'Garlic powder 1 tbsp', 'Onion powder 1 tbsp', 'Dry mustard 1 tsp', 'Salt 1 tbsp', 'Black pepper 1 tsp', 'Apple cider vinegar 1/4 cup'],
        steps: [
            'Remove the membrane from the back of each rib rack for better tenderness',
            'Mix brown sugar, smoked paprika, garlic powder, onion powder, dry mustard, salt, and pepper to make the dry rub',
            'Generously coat both sides of the ribs with the dry rub, pressing it in with your hands',
            'Wrap each rack tightly in aluminum foil and refrigerate for at least 1 hour (or overnight)',
            'Preheat oven to 275F (135C). Place foil-wrapped ribs on a baking sheet bone-side down',
            'Bake for 2.5 hours until the meat is tender and pulls away from the bone slightly',
            'Remove from foil, increase oven to 400F (200C). Brush ribs generously with BBQ sauce mixed with vinegar',
            'Return to oven uncovered for 15-20 minutes until the sauce is caramelized and bubbly'
        ]
    },
    {
        id: 5,
        title: 'Caesar Salad',
        image: '🥗',
        time: '15 min',
        difficulty: 'Easy',
        calories: 220,
        caloriesText: '220 cal',
        tags: ['Salad', 'Healthy', 'Quick'],
        category: 'Salads',
        type: 'dish',
        spicy: false,
        ingredients: ['Romaine lettuce 1 head', 'Parmesan cheese 1/2 cup shaved', 'Croutons 1 cup', 'Caesar dressing 1/2 cup', 'Lemon juice 2 tbsp', 'Garlic 2 cloves minced', 'Anchovy fillets 2 (optional)', 'Olive oil 3 tbsp', 'Dijon mustard 1 tsp', 'Egg yolk 1'],
        steps: [
            'Wash and dry romaine lettuce leaves, tear into bite-size pieces, and place in a large bowl',
            'Make the dressing: whisk together egg yolk, minced garlic, anchovy paste, Dijon mustard, and lemon juice',
            'Slowly drizzle in olive oil while whisking constantly to emulsify',
            'Stir in grated parmesan and season with salt and pepper to taste',
            'Toss the lettuce with just enough dressing to coat the leaves evenly',
            'Top with shaved parmesan and homemade or store-bought croutons',
            'Serve immediately as a side dish or add grilled chicken to make it a complete meal'
        ]
    },
    {
        id: 6,
        title: 'Apple Pie',
        image: '🥧',
        time: '90 min',
        difficulty: 'Medium',
        calories: 380,
        caloriesText: '380 cal',
        tags: ['Dessert', 'Classic', 'Baking'],
        category: 'Desserts',
        type: 'dish',
        spicy: false,
        ingredients: ['Pie crust (double) 2 sheets', 'Granny Smith apples 6', 'Granulated sugar 3/4 cup', 'Brown sugar 1/4 cup', 'Cinnamon 1.5 tsp', 'Nutmeg 1/4 tsp', 'Lemon juice 1 tbsp', 'Butter 2 tbsp', 'Vanilla extract 1 tsp', 'Egg 1 (for egg wash)'],
        steps: [
            'Preheat oven to 375F (190C). Roll out one pie crust and fit it into a 9-inch pie dish',
            'Peel, core, and slice apples into 1/4-inch thick slices',
            'Toss apple slices with granulated sugar, brown sugar, cinnamon, nutmeg, lemon juice, and vanilla',
            'Pile the apple filling into the prepared crust, mounding it slightly in the center',
            'Dot the top with small pieces of butter',
            'Roll out the second crust and place over the filling. Crimp edges to seal and cut a few steam vents',
            'Beat egg with 1 tbsp water and brush over the top crust for a golden finish',
            'Bake for 45-55 minutes until the crust is golden and filling is bubbly. Cool at least 1 hour before serving'
        ]
    },
    {
        id: 7,
        title: 'Meatloaf',
        image: '🍖',
        time: '60 min',
        difficulty: 'Easy',
        calories: 420,
        caloriesText: '420 cal',
        tags: ['Beef', 'Comfort', 'Family'],
        category: 'Beef',
        type: 'dish',
        spicy: false,
        ingredients: ['Ground beef 1.5 lbs (680g)', 'Ground pork 0.5 lbs (225g)', 'Breadcrumbs 1 cup', 'Onion 1 medium, finely diced', 'Carrot 1 small, grated', 'Eggs 2', 'Ketchup 1/4 cup (plus more for glaze)', 'Worcestershire sauce 2 tbsp', 'Garlic 3 cloves minced', 'Brown sugar 2 tbsp', 'Mustard 1 tbsp'],
        steps: [
            'Preheat oven to 375F (190C). Line a loaf pan or baking sheet with parchment paper',
            'In a large bowl, combine ground beef, ground pork, breadcrumbs, diced onion, grated carrot, eggs, ketchup, Worcestershire sauce, and garlic',
            'Mix gently with your hands until just combined (overmixing makes it tough)',
            'Shape the mixture into a loaf on the prepared pan, about 9x5 inches',
            'Mix the glaze: combine 1/2 cup ketchup, brown sugar, and mustard in a small bowl',
            'Spread the glaze evenly over the top of the meatloaf',
            'Bake for 50-60 minutes until the internal temperature reaches 160F (71C)',
            'Let rest for 10 minutes before slicing. Serve with mashed potatoes and green beans'
        ]
    },
    {
        id: 8,
        title: 'Chicken Pot Pie',
        image: '🥘',
        time: '75 min',
        difficulty: 'Medium',
        calories: 520,
        caloriesText: '520 cal',
        tags: ['Chicken', 'Comfort', 'Baking'],
        category: 'Chicken',
        type: 'dish',
        spicy: false,
        ingredients: ['Pie crust 2 sheets', 'Chicken breast 2 cups cooked & diced', 'Frozen mixed vegetables 2 cups', 'Chicken broth 2 cups', 'Heavy cream 1/2 cup', 'Butter 4 tbsp', 'All-purpose flour 4 tbsp', 'Onion 1 medium, diced', 'Celery 2 stalks, diced', 'Garlic 2 cloves minced', 'Salt & pepper to taste', 'Thyme 1 tsp'],
        steps: [
            'Preheat oven to 400F (200C). Roll out one pie crust and fit into a 9-inch deep dish pie plate',
            'In a large skillet, melt butter over medium heat. Add diced onion and celery, cook 5 minutes until soft',
            'Add garlic and thyme, cook for 30 seconds until fragrant',
            'Sprinkle flour over the vegetables and stir to coat, cook 1 minute',
            'Gradually pour in chicken broth while stirring, then add heavy cream',
            'Simmer for 5-7 minutes until the sauce thickens. Add chicken, frozen vegetables, salt, and pepper',
            'Pour the filling into the prepared crust. Top with the second crust, crimp edges, and cut steam vents',
            'Brush with egg wash and bake 35-45 minutes until golden brown and filling is bubbly'
        ]
    }
];

// Soups & Sides data
const US_SOUPS = [
    {
        id: 101,
        title: 'Creamy Tomato Soup',
        image: '🍅',
        time: '30 min',
        difficulty: 'Easy',
        calories: 180,
        caloriesText: '180 cal',
        tags: ['Soup', 'Comfort', 'Quick'],
        category: 'Soups',
        type: 'soup',
        spicy: false,
        ingredients: ['Canned whole tomatoes 28 oz', 'Onion 1 medium', 'Garlic 3 cloves', 'Butter 2 tbsp', 'Heavy cream 1/2 cup', 'Chicken broth 1 cup', 'Fresh basil 1/4 cup', 'Sugar 1 tsp', 'Salt & pepper to taste', 'Olive oil 1 tbsp'],
        steps: [
            'Heat olive oil and butter in a large pot over medium heat',
            'Add diced onion and cook for 5 minutes until translucent',
            'Add minced garlic and cook for 30 seconds',
            'Add canned tomatoes with their juice, chicken broth, and sugar. Bring to a boil',
            'Reduce heat and simmer for 15 minutes to blend flavors',
            'Use an immersion blender to puree until smooth (or blend in batches in a regular blender)',
            'Stir in heavy cream and season with salt and pepper',
            'Serve hot, garnished with fresh basil and a swirl of cream. Perfect with grilled cheese!'
        ]
    },
    {
        id: 102,
        title: 'Chicken Noodle Soup',
        image: '🍜',
        time: '40 min',
        difficulty: 'Easy',
        calories: 150,
        caloriesText: '150 cal',
        tags: ['Soup', 'Classic', 'Healthy'],
        category: 'Soups',
        type: 'soup',
        spicy: false,
        ingredients: ['Chicken breast 2', 'Egg noodles 8 oz', 'Chicken broth 6 cups', 'Carrots 2 medium, sliced', 'Celery 3 stalks, sliced', 'Onion 1 medium, diced', 'Garlic 3 cloves', 'Fresh thyme 3 sprigs', 'Bay leaf 1', 'Salt & pepper to taste'],
        steps: [
            'Place chicken breasts in a large pot with broth, onion, garlic, thyme, and bay leaf',
            'Bring to a boil, then reduce heat and simmer for 15-20 minutes until chicken is cooked through',
            'Remove chicken and set aside to cool slightly',
            'Add sliced carrots and celery to the simmering broth, cook for 10 minutes',
            'Shred the cooled chicken into bite-size pieces using two forks',
            'Add egg noodles and shredded chicken to the pot, cook for 5-7 minutes until noodles are tender',
            'Remove bay leaf and thyme sprigs. Season with salt and pepper to taste',
            'Ladle into bowls and serve with crusty bread'
        ]
    },
    {
        id: 103,
        title: 'Loaded Baked Potato Soup',
        image: '🥔',
        time: '45 min',
        difficulty: 'Easy',
        calories: 320,
        caloriesText: '320 cal',
        tags: ['Soup', 'Comfort', 'Cheesy'],
        category: 'Soups',
        type: 'soup',
        spicy: false,
        ingredients: ['Russet potatoes 4 large', 'Chicken broth 4 cups', 'Heavy cream 1 cup', 'Butter 3 tbsp', 'All-purpose flour 3 tbsp', 'Sharp cheddar cheese 1.5 cups shredded', 'Bacon 6 strips, cooked and crumbled', 'Green onions 4, sliced', 'Sour cream for topping', 'Salt & pepper to taste'],
        steps: [
            'Bake potatoes at 400F for 45 minutes until fork-tender, or microwave for 10-12 minutes',
            'Let potatoes cool slightly, then peel and cube them',
            'In a large pot, melt butter over medium heat. Whisk in flour and cook 1 minute',
            'Gradually add chicken broth while whisking, then add heavy cream',
            'Add cubed potatoes and mash some of them into the broth to thicken (leave some chunks)',
            'Simmer for 10 minutes, stirring occasionally, until heated through and slightly thickened',
            'Stir in 1 cup of shredded cheddar until melted. Season with salt and pepper',
            'Serve topped with remaining cheese, crumbled bacon, green onions, and a dollop of sour cream'
        ]
    },
    {
        id: 104,
        title: 'Spicy Black Bean Chili',
        image: '🌶️',
        time: '35 min',
        difficulty: 'Easy',
        calories: 280,
        caloriesText: '280 cal',
        tags: ['Soup', 'Spicy', 'Hearty'],
        category: 'Soups',
        type: 'soup',
        spicy: true,
        ingredients: ['Black beans 2 cans (15 oz each)', 'Diced tomatoes 1 can (14 oz)', 'Onion 1 large, diced', 'Bell pepper 1, diced', 'Garlic 4 cloves minced', 'Chili powder 2 tbsp', 'Cumin 1 tbsp', 'Smoked paprika 1 tsp', 'Cayenne pepper 1/4 tsp', 'Vegetable broth 2 cups', 'Fresh cilantro for garnish'],
        steps: [
            'Heat a large pot over medium heat. Add a drizzle of oil, then diced onion and bell pepper',
            'Cook for 5-7 minutes until vegetables are soft',
            'Add garlic, chili powder, cumin, smoked paprika, and cayenne. Stir for 30 seconds until fragrant',
            'Add drained and rinsed black beans, diced tomatoes, and vegetable broth',
            'Bring to a boil, then reduce heat and simmer for 20-25 minutes, stirring occasionally',
            'Mash about 1/4 of the beans with a spoon or potato masher to thicken the chili',
            'Season with salt and pepper to taste',
            'Serve in bowls topped with fresh cilantro, shredded cheese, sour cream, and tortilla chips'
        ]
    }
];

// Current selected dishes
let currentDishes = [];
let currentSoups = [];

// DOM Elements
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    bindEvents();
    renderRecipeGrid();
    console.log('American Family Meals - Meal Planner ready');
}

// Bind Events
function bindEvents() {
    generateBtn.addEventListener('click', handleGenerate);
    confirmBtn.addEventListener('click', handleConfirm);
    refreshBtn.addEventListener('click', handleRefresh);
    modalClose.addEventListener('click', closeModal);

    // Click overlay to close modal
    recipeModal.addEventListener('click', (e) => {
        if (e.target === recipeModal) closeModal();
    });

    // ESC to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Tag click filtering
    document.querySelectorAll('.hero-tags .tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const tagText = tag.textContent;
            filterByTag(tagText);
        });
    });

    // Category card click
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.querySelector('h4').textContent;
            filterByCategory(category);
        });
    });

    // Load more
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', handleLoadMore);
    }
}

// Calculate dish count based on people
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

// Pick random non-duplicate recipes
function pickRandom(arr, count, excludeIds) {
    const available = arr.filter(r => !excludeIds.includes(r.id));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Generate meal plan
function handleGenerate() {
    const adults = parseInt(adultNum.value);
    const kids = parseInt(childNum.value);
    const spicy = includeSpicy.checked;

    const dishCount = getDishCount(adults, kids);
    const soupCount = getSoupCount(adults, kids);

    // Filter recipe pools
    let dishPool = [...US_RECIPES];
    let soupPool = [...US_SOUPS];

    if (!spicy) {
        dishPool = dishPool.filter(r => !r.spicy);
        soupPool = soupPool.filter(r => !r.spicy);
    }

    // Randomly select
    currentDishes = pickRandom(dishPool, dishCount, []);
    const dishIds = currentDishes.map(d => d.id);
    currentSoups = pickRandom(soupPool, soupCount, dishIds);

    renderResults(adults, kids);
}

// Render results
function renderResults(adults, kids) {
    resultSection.style.display = 'block';

    // Stats
    const allRecipes = [...currentDishes, ...currentSoups];
    const totalDishes = allRecipes.length;
    const totalCalories = allRecipes.reduce((sum, r) => sum + r.calories, 0);
    const maxTime = Math.max(...allRecipes.map(r => parseInt(r.time)));

    mealStats.innerHTML = `
        <div class="stat-item">
            <span class="stat-icon">🍽️</span>
            <span>Dishes</span>
            <span class="stat-value">${totalDishes}</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon">🔥</span>
            <span>Total Cal</span>
            <span class="stat-value">${totalCalories} cal</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon">⏱️</span>
            <span>Max Cook</span>
            <span class="stat-value">${maxTime} min</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon">👥</span>
            <span>Diners</span>
            <span class="stat-value">${adults}A ${kids}K</span>
        </div>
    `;

    // Render main dishes
    dishGrid.innerHTML = currentDishes.map((recipe, index) => createMealCard(recipe, index, 'dish')).join('');

    // Render soups
    soupGrid.innerHTML = currentSoups.map((recipe, index) => createMealCard(recipe, index, 'soup')).join('');

    // Scroll to results
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Create meal card
function createMealCard(recipe, index, type) {
    return `
        <div class="meal-card" data-id="${recipe.id}" data-type="${type}" data-index="${index}">
            <button class="change-btn" data-id="${recipe.id}" data-type="${type}" data-index="${index}" title="Swap this dish">🔄</button>
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

// Event delegation: click card for detail, click change button to swap
document.addEventListener('click', (e) => {
    // Change button
    const changeBtn = e.target.closest('.change-btn');
    if (changeBtn) {
        e.stopPropagation();
        const id = parseInt(changeBtn.dataset.id);
        const type = changeBtn.dataset.type;
        const index = parseInt(changeBtn.dataset.index);
        handleSwapDish(id, type, index);
        return;
    }

    // Card click for detail
    const card = e.target.closest('.meal-card');
    if (card) {
        const id = parseInt(card.dataset.id);
        openRecipeModal(id);
    }
});

// Swap a single dish
function handleSwapDish(currentId, type, index) {
    const spicy = includeSpicy.checked;
    let pool = type === 'dish' ? [...US_RECIPES] : [...US_SOUPS];
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

    // Re-render the grid
    const grid = type === 'dish' ? dishGrid : soupGrid;
    const list = type === 'dish' ? currentDishes : currentSoups;
    grid.innerHTML = list.map((recipe, i) => createMealCard(recipe, i, type)).join('');

    // Update stats
    const adults = parseInt(adultNum.value);
    const kids = parseInt(childNum.value);
    updateStats(adults, kids);
}

// Update stats
function updateStats(adults, kids) {
    const allRecipes = [...currentDishes, ...currentSoups];
    const totalDishes = allRecipes.length;
    const totalCalories = allRecipes.reduce((sum, r) => sum + r.calories, 0);
    const maxTime = Math.max(...allRecipes.map(r => parseInt(r.time)));

    mealStats.innerHTML = `
        <div class="stat-item">
            <span class="stat-icon">🍽️</span>
            <span>Dishes</span>
            <span class="stat-value">${totalDishes}</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon">🔥</span>
            <span>Total Cal</span>
            <span class="stat-value">${totalCalories} cal</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon">⏱️</span>
            <span>Max Cook</span>
            <span class="stat-value">${maxTime} min</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon">👥</span>
            <span>Diners</span>
            <span class="stat-value">${adults}A ${kids}K</span>
        </div>
    `;
}

// Confirm menu
function handleConfirm() {
    if (currentDishes.length === 0 && currentSoups.length === 0) return;

    const dishNames = currentDishes.map(d => d.title).join(', ');
    const soupNames = currentSoups.map(s => s.title).join(', ');

    const summary = `✅ Menu Confirmed!\n\n` +
        `🥘 Main Dishes: ${dishNames}\n` +
        `🍲 Soups & Sides: ${soupNames}\n\n` +
        `Enjoy your meal! 祝您用餐愉快！`;

    alert(summary);
}

// Refresh all
function handleRefresh() {
    handleGenerate();
}

// Open recipe detail modal
function openRecipeModal(recipeId) {
    const allRecipes = [...US_RECIPES, ...US_SOUPS];
    const recipe = allRecipes.find(r => r.id === recipeId);
    if (!recipe) return;

    modalEmoji.textContent = recipe.image;
    modalBody.innerHTML = `
        <h3>${recipe.title}</h3>
        <div class="modal-meta">
            <span>⏱️ ${recipe.time}</span>
            <span>🔥 ${recipe.caloriesText}</span>
            <span>📊 ${recipe.difficulty}</span>
            <span>📍 ${recipe.category}</span>
        </div>
        <div class="modal-tags">
            ${recipe.tags.map(tag => `<span class="meal-card-tag">${tag}</span>`).join('')}
        </div>
        <div class="modal-section-title">🛒 Ingredients · 食材</div>
        <ul class="modal-ingredients">
            ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
        <div class="modal-section-title">👨‍🍳 Steps · 做法步骤</div>
        <ol class="modal-steps">
            ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
        </ol>
    `;

    recipeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    recipeModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Render bottom recipe grid
function renderRecipeGrid() {
    if (!recipeGrid) return;
    recipeGrid.innerHTML = US_RECIPES.map(recipe => createRecipeCard(recipe)).join('');
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

// Filter by tag
function filterByTag(tag) {
    const filtered = US_RECIPES.filter(r =>
        r.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
    if (filtered.length > 0) {
        recipeGrid.innerHTML = filtered.map(r => createRecipeCard(r)).join('');
    } else {
        recipeGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No recipes found with this tag.</p>';
    }
}

// Filter by category
function filterByCategory(category) {
    const categoryMap = {
        'Burgers & Sandwiches': 'Burgers',
        'Pasta & Noodles': 'Pasta',
        'Chicken Dishes': 'Chicken',
        'Beef & Steak': 'Beef',
        'Salads & Sides': 'Salads',
        'Desserts': 'Desserts'
    };

    const targetCategory = categoryMap[category] || category;
    const filtered = US_RECIPES.filter(r => r.category === targetCategory);

    if (filtered.length > 0) {
        recipeGrid.innerHTML = filtered.map(r => createRecipeCard(r)).join('');
    } else {
        recipeGrid.innerHTML = `<p style="text-align: center; color: var(--text-secondary);">No recipes found in ${category}. Check back soon!</p>`;
    }
}

// Load more (simulated)
function handleLoadMore() {
    const moreRecipes = US_RECIPES.map(r => ({
        ...r,
        id: r.id + 100,
        title: r.title + ' (Variation)'
    }));
    const newCards = moreRecipes.map(r => createRecipeCard(r)).join('');
    recipeGrid.insertAdjacentHTML('beforeend', newCards);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { US_RECIPES, US_SOUPS, initApp };
}
