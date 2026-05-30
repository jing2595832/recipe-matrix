/**
 * 智能菜谱网站矩阵 - 全局共享数据库
 * Recipe Matrix - Global Shared Database
 * 
 * 所有站点共享此数据文件
 * All sites share this data file
 */

// 站点配置
const SITE_CONFIG = {
  main: {
    name: '智能每日配餐',
    nameEn: 'Smart Meal Planner',
    theme: 'warm-orange',
    cuisines: ['all'],
    filters: {}
  },
  'cn-home': {
    name: '中式家常菜',
    nameEn: 'Chinese Home Cooking',
    theme: 'chinese-red',
    cuisines: ['chinese', 'sichuan', 'cantonese', 'hunan', 'jiangsu'],
    filters: { cuisine: ['chinese', 'sichuan', 'cantonese', 'hunan', 'jiangsu'] }
  },
  'us-family': {
    name: '美式家庭餐',
    nameEn: 'American Family Meals',
    theme: 'american-minimal',
    cuisines: ['american', 'western'],
    filters: { cuisine: ['american', 'western'] },
    units: 'imperial'
  },
  'kid-nutrition': {
    name: '儿童辅食营养',
    nameEn: 'Kids Nutrition',
    theme: 'cute-pastel',
    cuisines: ['kid-friendly'],
    filters: { tags: ['kid-friendly', 'low-salt', 'soft', 'mild'] }
  },
  'fitness-diet': {
    name: '减脂健康餐',
    nameEn: 'Fitness Diet',
    theme: 'fitness-dark',
    cuisines: ['fitness', 'low-carb', 'high-protein'],
    filters: { tags: ['low-calorie', 'high-protein', 'low-fat', 'keto'] }
  },
  'quick-meal': {
    name: '懒人快手餐',
    nameEn: 'Quick Meals',
    theme: 'quick-blue',
    cuisines: ['quick', 'easy'],
    filters: { tags: ['quick', 'easy', '15min', '10min'] }
  },
  'party-feast': {
    name: '宴席派对餐',
    nameEn: 'Party Feast',
    theme: 'luxury-gold',
    cuisines: ['feast', 'party'],
    filters: { tags: ['feast', 'party', 'holiday', 'special'] }
  }
};

// 菜谱数据库
const RECIPE_DATABASE = {
  // 中式热菜
  chinese: [
    {
      id: 'tomato-egg',
      name: '番茄炒蛋',
      nameEn: 'Tomato Scrambled Eggs',
      cuisine: 'chinese',
      category: 'dish',
      tags: ['kid-friendly', 'quick', 'easy', 'vegetarian'],
      time: 10,
      difficulty: 'easy',
      calories: 180,
      protein: 12,
      fat: 14,
      ingredients: [
        { name: '番茄', amount: '2个', amountEn: '2 tomatoes' },
        { name: '鸡蛋', amount: '3个', amountEn: '3 eggs' },
        { name: '食盐', amount: '适量', amountEn: 'to taste' },
        { name: '白糖', amount: '1茶匙', amountEn: '1 tsp' },
        { name: '食用油', amount: '2汤匙', amountEn: '2 tbsp' }
      ],
      steps: [
        '番茄洗净切块，鸡蛋加少许盐打散备用',
        '热锅倒油，倒入蛋液炒熟盛出',
        '再起锅炒番茄，加少许白糖帮助出汁',
        '倒入炒好的鸡蛋翻炒均匀，加盐调味即可'
      ],
      stepsEn: [
        'Cut tomatoes into chunks, beat eggs with a pinch of salt',
        'Heat oil, scramble eggs until cooked, set aside',
        'Sauté tomatoes with sugar to help release juices',
        'Add eggs back, season with salt, mix well'
      ]
    },
    {
      id: 'kung-pao-chicken',
      name: '宫保鸡丁',
      nameEn: 'Kung Pao Chicken',
      cuisine: 'sichuan',
      category: 'dish',
      tags: ['spicy', 'sichuan', 'classic'],
      time: 25,
      difficulty: 'medium',
      calories: 320,
      protein: 28,
      fat: 18,
      ingredients: [
        { name: '鸡胸肉', amount: '300g', amountEn: '300g chicken breast' },
        { name: '花生米', amount: '50g', amountEn: '50g peanuts' },
        { name: '干辣椒', amount: '10个', amountEn: '10 dried chilies' },
        { name: '花椒', amount: '1茶匙', amountEn: '1 tsp Sichuan pepper' },
        { name: '葱姜蒜', amount: '适量', amountEn: 'scallion, ginger, garlic' }
      ],
      steps: [
        '鸡肉切丁，加料酒、生抽、淀粉腌制15分钟',
        '花生米炸酥备用，调好宫保汁（生抽、醋、糖、淀粉）',
        '热油滑炒鸡丁至变色盛出',
        '爆香干辣椒花椒，下鸡丁翻炒，倒入宫保汁收汁，撒花生米'
      ],
      stepsEn: [
        'Dice chicken, marinate with wine, soy sauce, starch for 15min',
        'Fry peanuts until crispy, prepare Kung Pao sauce',
        'Stir-fry chicken until color changes, set aside',
        'Fry chilies and peppercorns, add chicken, pour sauce, add peanuts'
      ]
    },
    {
      id: 'braised-pork',
      name: '红烧肉',
      nameEn: 'Braised Pork Belly',
      cuisine: 'chinese',
      category: 'dish',
      tags: ['classic', 'feast', 'rich'],
      time: 90,
      difficulty: 'medium',
      calories: 450,
      protein: 22,
      fat: 35,
      ingredients: [
        { name: '五花肉', amount: '500g', amountEn: '500g pork belly' },
        { name: '冰糖', amount: '30g', amountEn: '30g rock sugar' },
        { name: '生抽', amount: '2汤匙', amountEn: '2 tbsp light soy' },
        { name: '老抽', amount: '1汤匙', amountEn: '1 tbsp dark soy' },
        { name: '八角桂皮', amount: '适量', amountEn: 'star anise, cinnamon' }
      ],
      steps: [
        '五花肉切块，冷水下锅焯水去血沫',
        '锅中少油，放冰糖小火炒出糖色',
        '倒入肉块翻炒上色，加葱姜八角',
        '加生抽老抽，倒入开水没过肉块，小火炖60分钟，大火收汁'
      ],
      stepsEn: [
        'Cut pork belly, blanch in cold water',
        'Caramelize rock sugar in oil over low heat',
        'Add pork, stir-fry until colored, add aromatics',
        'Add soy sauces, boiling water, simmer 60min, reduce sauce'
      ]
    },
    {
      id: 'stir-fried-broccoli',
      name: '清炒西兰花',
      nameEn: 'Stir-fried Broccoli',
      cuisine: 'chinese',
      category: 'dish',
      tags: ['vegetarian', 'healthy', 'quick', 'low-calorie'],
      time: 8,
      difficulty: 'easy',
      calories: 85,
      protein: 4,
      fat: 6,
      ingredients: [
        { name: '西兰花', amount: '1颗', amountEn: '1 broccoli head' },
        { name: '大蒜', amount: '3瓣', amountEn: '3 garlic cloves' },
        { name: '盐', amount: '适量', amountEn: 'to taste' },
        { name: '蚝油', amount: '1汤匙', amountEn: '1 tbsp oyster sauce' }
      ],
      steps: [
        '西兰花切小朵，焯水30秒捞出过凉水',
        '蒜末爆香',
        '放入西兰花大火快炒',
        '加少许盐和蚝油，翻炒均匀出锅'
      ],
      stepsEn: [
        'Cut broccoli, blanch 30 seconds, cool in water',
        'Sauté minced garlic until fragrant',
        'Add broccoli, stir-fry over high heat',
        'Season with salt and oyster sauce'
      ]
    },
    {
      id: 'fish-fragrant-pork',
      name: '鱼香肉丝',
      nameEn: 'Fish-fragrant Pork',
      cuisine: 'sichuan',
      category: 'dish',
      tags: ['spicy', 'sichuan', 'classic'],
      time: 20,
      difficulty: 'medium',
      calories: 280,
      protein: 20,
      fat: 16,
      ingredients: [
        { name: '猪里脊', amount: '200g', amountEn: '200g pork tenderloin' },
        { name: '木耳', amount: '50g', amountEn: '50g wood ear' },
        { name: '胡萝卜', amount: '1根', amountEn: '1 carrot' },
        { name: '冬笋', amount: '100g', amountEn: '100g bamboo shoots' },
        { name: '豆瓣酱', amount: '1汤匙', amountEn: '1 tbsp doubanjiang' }
      ],
      steps: [
        '所有食材切丝，猪肉加料酒淀粉腌制',
        '调鱼香汁：生抽、醋、糖、淀粉、清水搅匀',
        '热油滑炒肉丝盛出',
        '爆香豆瓣酱，下配菜翻炒，倒入肉丝和鱼香汁收汁'
      ],
      stepsEn: [
        'Julienne all ingredients, marinate pork',
        'Mix fish-fragrant sauce: soy, vinegar, sugar, starch, water',
        'Stir-fry pork, set aside',
        'Fry doubanjiang, add vegetables, pork, and sauce'
      ]
    },
    {
      id: 'chicken-potato',
      name: '土豆炖鸡块',
      nameEn: 'Chicken Stew with Potatoes',
      cuisine: 'chinese',
      category: 'dish',
      tags: ['kid-friendly', 'hearty', 'classic'],
      time: 45,
      difficulty: 'easy',
      calories: 380,
      protein: 32,
      fat: 18,
      ingredients: [
        { name: '鸡腿', amount: '2个', amountEn: '2 chicken legs' },
        { name: '土豆', amount: '2个', amountEn: '2 potatoes' },
        { name: '葱姜', amount: '适量', amountEn: 'ginger, scallion' },
        { name: '生抽', amount: '2汤匙', amountEn: '2 tbsp soy sauce' },
        { name: '盐', amount: '适量', amountEn: 'to taste' }
      ],
      steps: [
        '鸡块焯水去血沫，土豆切块',
        '热油炒香葱姜，煎鸡块至微黄',
        '加生抽和热水，放入土豆',
        '小火炖20分钟，加盐调味收汁'
      ],
      stepsEn: [
        'Blanch chicken, cut potatoes',
        'Sauté aromatics, sear chicken',
        'Add soy sauce, hot water, potatoes',
        'Simmer 20min, season and reduce'
      ]
    }
  ],

  // 西式主菜
  american: [
    {
      id: 'grilled-steak',
      name: '香煎牛排',
      nameEn: 'Grilled Steak',
      cuisine: 'american',
      category: 'dish',
      tags: ['high-protein', 'keto', 'classic'],
      time: 15,
      difficulty: 'medium',
      calories: 420,
      protein: 45,
      fat: 28,
      ingredients: [
        { name: '牛排', amount: '200g', amountEn: '200g steak (7oz)' },
        { name: '黄油', amount: '20g', amountEn: '20g butter' },
        { name: '大蒜', amount: '2瓣', amountEn: '2 garlic cloves' },
        { name: '迷迭香', amount: '1枝', amountEn: '1 rosemary sprig' },
        { name: '海盐黑胡椒', amount: '适量', amountEn: 'sea salt, pepper' }
      ],
      steps: [
        '牛排室温放置20分钟，用厨房纸吸干水分',
        '两面撒上海盐和黑胡椒',
        '热锅下牛排，每面煎2-3分钟',
        '加入黄油、大蒜、迷迭香，淋油在牛排上，静置5分钟后切片'
      ],
      stepsEn: [
        'Bring steak to room temp, pat dry',
        'Season both sides with salt and pepper',
        'Sear 2-3 minutes per side',
        'Add butter, garlic, rosemary, baste, rest 5min before slicing'
      ]
    },
    {
      id: 'roast-chicken',
      name: '烤鸡',
      nameEn: 'Roast Chicken',
      cuisine: 'american',
      category: 'dish',
      tags: ['kid-friendly', 'feast', 'classic'],
      time: 90,
      difficulty: 'medium',
      calories: 350,
      protein: 38,
      fat: 22,
      ingredients: [
        { name: '整鸡', amount: '1只(1.5kg)', amountEn: '1 whole chicken (3.3lb)' },
        { name: '柠檬', amount: '1个', amountEn: '1 lemon' },
        { name: '百里香', amount: '适量', amountEn: 'thyme' },
        { name: '黄油', amount: '30g', amountEn: '30g butter' },
        { name: '盐黑胡椒', amount: '适量', amountEn: 'salt, pepper' }
      ],
      steps: [
        '鸡洗净擦干，黄油软化后混合香料涂抹在鸡皮下',
        '鸡腹塞入柠檬和香草',
        '表面撒盐和黑胡椒',
        '烤箱200°C烤60-75分钟，至内部温度达74°C'
      ],
      stepsEn: [
        'Clean and dry chicken, rub herb butter under skin',
        'Stuff cavity with lemon and herbs',
        'Season skin with salt and pepper',
        'Roast at 200°C/400°F for 60-75min until 74°C/165°F internal'
      ]
    },
    {
      id: 'spaghetti-bolognese',
      name: '意式肉酱面',
      nameEn: 'Spaghetti Bolognese',
      cuisine: 'western',
      category: 'dish',
      tags: ['kid-friendly', 'classic', 'pasta'],
      time: 45,
      difficulty: 'easy',
      calories: 520,
      protein: 28,
      fat: 22,
      ingredients: [
        { name: '意大利面', amount: '200g', amountEn: '200g spaghetti' },
        { name: '牛肉末', amount: '150g', amountEn: '150g ground beef' },
        { name: '番茄酱', amount: '200g', amountEn: '200g tomato sauce' },
        { name: '洋葱', amount: '1个', amountEn: '1 onion' },
        { name: '帕玛森芝士', amount: '适量', amountEn: 'Parmesan cheese' }
      ],
      steps: [
        '煮意面至al dente，保留一些煮面水',
        '炒香洋葱，加入牛肉末炒至变色',
        '加入番茄酱和煮面水，小火炖20分钟',
        '拌入意面，撒上芝士即可'
      ],
      stepsEn: [
        'Cook pasta al dente, reserve pasta water',
        'Sauté onion, add ground beef until browned',
        'Add tomato sauce and pasta water, simmer 20min',
        'Toss with pasta, top with cheese'
      ]
    },
    {
      id: 'caesar-salad',
      name: '凯撒沙拉',
      nameEn: 'Caesar Salad',
      cuisine: 'american',
      category: 'dish',
      tags: ['low-carb', 'healthy', 'quick', 'vegetarian'],
      time: 10,
      difficulty: 'easy',
      calories: 280,
      protein: 12,
      fat: 22,
      ingredients: [
        { name: '罗马生菜', amount: '1颗', amountEn: '1 head romaine' },
        { name: '面包丁', amount: '50g', amountEn: '50g croutons' },
        { name: '帕玛森芝士', amount: '30g', amountEn: '30g Parmesan' },
        { name: '凯撒酱', amount: '3汤匙', amountEn: '3 tbsp Caesar dressing' }
      ],
      steps: [
        '生菜洗净撕成适口大小',
        '加入面包丁和芝士碎',
        '淋上凯撒酱拌匀即可'
      ],
      stepsEn: [
        'Wash and tear lettuce into bite-sized pieces',
        'Add croutons and cheese',
        'Toss with Caesar dressing'
      ]
    }
  ],

  // 汤品
  soups: [
    {
      id: 'seaweed-egg',
      name: '紫菜蛋花汤',
      nameEn: 'Seaweed Egg Drop Soup',
      cuisine: 'chinese',
      category: 'soup',
      tags: ['quick', 'easy', 'kid-friendly', 'low-calorie'],
      time: 5,
      difficulty: 'easy',
      calories: 65,
      protein: 6,
      fat: 4,
      ingredients: [
        { name: '紫菜', amount: '1片', amountEn: '1 sheet seaweed' },
        { name: '鸡蛋', amount: '1个', amountEn: '1 egg' },
        { name: '葱花', amount: '适量', amountEn: 'scallion' },
        { name: '盐', amount: '适量', amountEn: 'to taste' },
        { name: '香油', amount: '几滴', amountEn: 'sesame oil' }
      ],
      steps: [
        '锅中烧水，水开后放入紫菜',
        '蛋液缓缓淋入锅中形成蛋花',
        '加盐调味，撒葱花，滴香油即可'
      ],
      stepsEn: [
        'Boil water, add seaweed',
        'Slowly drizzle beaten egg into boiling water',
        'Season with salt, garnish with scallion and sesame oil'
      ]
    },
    {
      id: 'wintermelon-rib',
      name: '冬瓜排骨汤',
      nameEn: 'Winter Melon Pork Rib Soup',
      cuisine: 'chinese',
      category: 'soup',
      tags: ['healthy', 'kid-friendly', 'nourishing'],
      time: 60,
      difficulty: 'easy',
      calories: 180,
      protein: 18,
      fat: 10,
      ingredients: [
        { name: '排骨', amount: '300g', amountEn: '300g pork ribs' },
        { name: '冬瓜', amount: '300g', amountEn: '300g winter melon' },
        { name: '姜片', amount: '3片', amountEn: '3 ginger slices' },
        { name: '盐', amount: '适量', amountEn: 'to taste' }
      ],
      steps: [
        '排骨焯水后放入砂锅',
        '加姜片和足量清水，大火煮开转小火炖40分钟',
        '冬瓜切块放入，继续炖15分钟',
        '出锅前加盐调味'
      ],
      stepsEn: [
        'Blanch ribs, place in pot',
        'Add ginger and water, simmer 40min',
        'Add winter melon chunks, simmer 15min more',
        'Season with salt before serving'
      ]
    },
    {
      id: 'tomato-egg-soup',
      name: '番茄蛋汤',
      nameEn: 'Tomato Egg Soup',
      cuisine: 'chinese',
      category: 'soup',
      tags: ['quick', 'easy', 'kid-friendly', 'vegetarian'],
      time: 10,
      difficulty: 'easy',
      calories: 95,
      protein: 7,
      fat: 6,
      ingredients: [
        { name: '番茄', amount: '2个', amountEn: '2 tomatoes' },
        { name: '鸡蛋', amount: '1个', amountEn: '1 egg' },
        { name: '盐', amount: '适量', amountEn: 'to taste' },
        { name: '葱花', amount: '适量', amountEn: 'scallion' }
      ],
      steps: [
        '番茄炒出汤汁',
        '加入足量清水烧开',
        '淋入蛋液，煮1分钟',
        '加盐、葱花即可'
      ],
      stepsEn: [
        'Sauté tomatoes until juicy',
        'Add water and bring to boil',
        'Drizzle in egg, cook 1min',
        'Season with salt and scallion'
      ]
    },
    {
      id: 'mushroom-chicken',
      name: '香菇鸡汤',
      nameEn: 'Mushroom Chicken Soup',
      cuisine: 'chinese',
      category: 'soup',
      tags: ['nourishing', 'kid-friendly', 'healthy'],
      time: 90,
      difficulty: 'easy',
      calories: 220,
      protein: 28,
      fat: 10,
      ingredients: [
        { name: '鸡肉', amount: '半只', amountEn: 'half chicken' },
        { name: '干香菇', amount: '8朵', amountEn: '8 dried shiitake' },
        { name: '红枣', amount: '5颗', amountEn: '5 red dates' },
        { name: '姜片', amount: '3片', amountEn: '3 ginger slices' },
        { name: '盐', amount: '适量', amountEn: 'to taste' }
      ],
      steps: [
        '鸡肉焯水，香菇泡发',
        '所有食材放入砂锅',
        '加足量清水，大火煮开转小火',
        '慢炖1小时，加盐调味'
      ],
      stepsEn: [
        'Blanch chicken, soak mushrooms',
        'Place all ingredients in pot',
        'Add water, bring to boil then simmer',
        'Simmer 1 hour, season with salt'
      ]
    },
    {
      id: 'cream-mushroom',
      name: '奶油蘑菇汤',
      nameEn: 'Cream of Mushroom Soup',
      cuisine: 'western',
      category: 'soup',
      tags: ['creamy', 'comfort', 'kid-friendly'],
      time: 25,
      difficulty: 'medium',
      calories: 280,
      protein: 10,
      fat: 22,
      ingredients: [
        { name: '口蘑', amount: '200g', amountEn: '200g button mushrooms' },
        { name: '淡奶油', amount: '100ml', amountEn: '100ml heavy cream' },
        { name: '黄油', amount: '20g', amountEn: '20g butter' },
        { name: '面粉', amount: '1汤匙', amountEn: '1 tbsp flour' },
        { name: '鸡汤', amount: '300ml', amountEn: '300ml chicken stock' }
      ],
      steps: [
        '蘑菇切片，用黄油炒香',
        '撒入面粉炒匀',
        '慢慢倒入鸡汤搅拌至无颗粒',
        '加入淡奶油，小火煮5分钟，加盐胡椒调味'
      ],
      stepsEn: [
        'Slice mushrooms, sauté in butter',
        'Sprinkle flour, stir well',
        'Slowly add stock, whisk until smooth',
        'Add cream, simmer 5min, season'
      ]
    }
  ],

  // 减脂餐
  fitness: [
    {
      id: 'grilled-salmon',
      name: '香煎三文鱼',
      nameEn: 'Grilled Salmon',
      cuisine: 'fitness',
      category: 'dish',
      tags: ['keto', 'high-protein', 'low-carb', 'omega-3'],
      time: 12,
      difficulty: 'easy',
      calories: 320,
      protein: 35,
      fat: 18,
      ingredients: [
        { name: '三文鱼排', amount: '150g', amountEn: '150g salmon fillet (5oz)' },
        { name: '柠檬', amount: '半个', amountEn: 'half lemon' },
        { name: '橄榄油', amount: '1茶匙', amountEn: '1 tsp olive oil' },
        { name: '海盐黑胡椒', amount: '适量', amountEn: 'salt, pepper' },
        { name: '芦笋', amount: '100g', amountEn: '100g asparagus' }
      ],
      steps: [
        '三文鱼用盐和胡椒腌制10分钟',
        '芦笋焯水备用',
        '热锅刷薄油，三文鱼皮朝下煎3分钟',
        '翻面再煎2分钟，搭配芦笋，挤柠檬汁'
      ],
      stepsEn: [
        'Season salmon with salt and pepper, rest 10min',
        'Blanch asparagus',
        'Sear salmon skin-side down 3min',
        'Flip, cook 2min more, serve with asparagus and lemon'
      ]
    },
    {
      id: 'chicken-salad',
      name: '鸡胸肉沙拉',
      nameEn: 'Chicken Breast Salad',
      cuisine: 'fitness',
      category: 'dish',
      tags: ['high-protein', 'low-fat', 'low-carb'],
      time: 15,
      difficulty: 'easy',
      calories: 240,
      protein: 38,
      fat: 6,
      ingredients: [
        { name: '鸡胸肉', amount: '150g', amountEn: '150g chicken breast (5oz)' },
        { name: '生菜', amount: '100g', amountEn: '100g lettuce' },
        { name: '小番茄', amount: '8个', amountEn: '8 cherry tomatoes' },
        { name: '黄瓜', amount: '半根', amountEn: 'half cucumber' },
        { name: '油醋汁', amount: '1汤匙', amountEn: '1 tbsp vinaigrette' }
      ],
      steps: [
        '鸡胸肉煮熟撕成丝或切片',
        '蔬菜洗净切块',
        '所有食材混合',
        '淋上油醋汁拌匀'
      ],
      stepsEn: [
        'Poach chicken, shred or slice',
        'Wash and chop vegetables',
        'Combine all ingredients',
        'Toss with vinaigrette'
      ]
    }
  ],

  // 快手菜
  quick: [
    {
      id: 'fried-rice',
      name: '蛋炒饭',
      nameEn: 'Egg Fried Rice',
      cuisine: 'chinese',
      category: 'dish',
      tags: ['quick', 'easy', '10min', 'kid-friendly'],
      time: 8,
      difficulty: 'easy',
      calories: 420,
      protein: 16,
      fat: 18,
      ingredients: [
        { name: '隔夜饭', amount: '1碗', amountEn: '1 bowl leftover rice' },
        { name: '鸡蛋', amount: '2个', amountEn: '2 eggs' },
        { name: '葱花', amount: '适量', amountEn: 'scallion' },
        { name: '盐', amount: '适量', amountEn: 'to taste' },
        { name: '生抽', amount: '1茶匙', amountEn: '1 tsp soy sauce' }
      ],
      steps: [
        '鸡蛋打散炒熟盛出',
        '热锅下米饭炒散',
        '倒入鸡蛋翻炒均匀',
        '加盐、生抽、葱花，炒匀出锅'
      ],
      stepsEn: [
        'Scramble eggs, set aside',
        'Heat oil, break up rice',
        'Add eggs, stir-fry',
        'Season with salt, soy sauce, scallion'
      ]
    },
    {
      id: 'instant-noodles',
      name: '快手汤面',
      nameEn: 'Quick Noodle Soup',
      cuisine: 'chinese',
      category: 'dish',
      tags: ['quick', 'easy', '10min', 'comfort'],
      time: 8,
      difficulty: 'easy',
      calories: 380,
      protein: 14,
      fat: 12,
      ingredients: [
        { name: '挂面', amount: '100g', amountEn: '100g noodles' },
        { name: '青菜', amount: '2颗', amountEn: '2 bok choy' },
        { name: '鸡蛋', amount: '1个', amountEn: '1 egg' },
        { name: '生抽', amount: '1汤匙', amountEn: '1 tbsp soy sauce' },
        { name: '香油', amount: '1茶匙', amountEn: '1 tsp sesame oil' }
      ],
      steps: [
        '水开下面条煮3分钟',
        '打入鸡蛋，放入青菜',
        '煮2分钟至蛋熟',
        '连汤盛入碗中，加生抽香油'
      ],
      stepsEn: [
        'Boil noodles 3 minutes',
        'Add egg and vegetables',
        'Cook 2min until egg is done',
        'Serve in bowl with soy sauce and sesame oil'
      ]
    }
  ],

  // 宴席菜
  feast: [
    {
      id: 'braised-fish',
      name: '红烧鱼',
      nameEn: 'Braised Whole Fish',
      cuisine: 'chinese',
      category: 'dish',
      tags: ['feast', 'party', 'whole-fish', 'classic'],
      time: 30,
      difficulty: 'medium',
      calories: 280,
      protein: 32,
      fat: 14,
      ingredients: [
        { name: '鲈鱼', amount: '1条(500g)', amountEn: '1 sea bass (1.1lb)' },
        { name: '葱姜蒜', amount: '适量', amountEn: 'ginger, garlic, scallion' },
        { name: '生抽老抽', amount: '各1汤匙', amountEn: 'light & dark soy sauce' },
        { name: '料酒', amount: '2汤匙', amountEn: '2 tbsp cooking wine' },
        { name: '糖', amount: '1茶匙', amountEn: '1 tsp sugar' }
      ],
      steps: [
        '鱼洗净划几刀，抹盐料酒腌制10分钟',
        '热油将鱼两面煎至金黄',
        '爆香葱姜蒜，加生抽老抽料酒和适量水',
        '放入鱼，小火焖10分钟，大火收汁装盘'
      ],
      stepsEn: [
        'Clean fish, score, marinate with salt and wine',
        'Pan-fry until golden both sides',
        'Sauté aromatics, add soy sauces, wine, water',
        'Simmer fish 10min, reduce sauce, serve'
      ]
    },
    {
      id: 'sweet-sour-ribs',
      name: '糖醋排骨',
      nameEn: 'Sweet and Sour Ribs',
      cuisine: 'chinese',
      category: 'dish',
      tags: ['feast', 'party', 'kid-friendly', 'classic'],
      time: 45,
      difficulty: 'medium',
      calories: 420,
      protein: 26,
      fat: 28,
      ingredients: [
        { name: '排骨', amount: '500g', amountEn: '500g pork ribs' },
        { name: '白糖', amount: '3汤匙', amountEn: '3 tbsp sugar' },
        { name: '醋', amount: '2汤匙', amountEn: '2 tbsp vinegar' },
        { name: '生抽', amount: '2汤匙', amountEn: '2 tbsp soy sauce' },
        { name: '料酒', amount: '1汤匙', amountEn: '1 tbsp cooking wine' }
      ],
      steps: [
        '排骨焯水洗净',
        '热油炒糖色，下排骨翻炒上色',
        '加料酒生抽醋和适量水',
        '小火炖30分钟，大火收汁至浓稠'
      ],
      stepsEn: [
        'Blanch and rinse ribs',
        'Caramelize sugar, add ribs to coat',
        'Add wine, soy, vinegar, water',
        'Simmer 30min, reduce to thick glaze'
      ]
    }
  ]
};

// 获取所有菜谱（扁平化数组）
function getAllRecipes() {
  // 如果 ALL_RECIPES 已被 app.js 定义，优先使用
  if (typeof ALL_RECIPES !== 'undefined' && ALL_RECIPES.length > 0) {
    return ALL_RECIPES;
  }
  const all = [];
  Object.values(RECIPE_DATABASE).forEach(category => {
    all.push(...category);
  });
  return all;
}

// 根据站点获取过滤后的菜谱
function getRecipesForSite(siteId) {
  const config = SITE_CONFIG[siteId];
  if (!config) return getAllRecipes();
  
  const all = getAllRecipes();
  
  // 总站返回所有
  if (siteId === 'main') return all;
  
  // 根据filters过滤
  return all.filter(recipe => {
    // 菜系过滤
    if (config.filters.cuisine && config.filters.cuisine.length > 0) {
      if (!config.filters.cuisine.includes(recipe.cuisine)) {
        return false;
      }
    }
    
    // 标签过滤
    if (config.filters.tags && config.filters.tags.length > 0) {
      const hasTag = config.filters.tags.some(tag => recipe.tags.includes(tag));
      if (!hasTag) return false;
    }
    
    return true;
  });
}

// 获取指定类型的菜谱（热菜/汤品）
function getRecipesByCategory(siteId, category) {
  const recipes = getRecipesForSite(siteId);
  return recipes.filter(r => r.category === category);
}

// 获取站点配置
function getSiteConfig(siteId) {
  return SITE_CONFIG[siteId] || SITE_CONFIG.main;
}

// 导出（如果在模块环境中）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SITE_CONFIG,
    RECIPE_DATABASE,
    getAllRecipes,
    getRecipesForSite,
    getRecipesByCategory,
    getSiteConfig
  };
}
