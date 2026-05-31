export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;

        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            // Health check
            if (path === '/' || path === '/health') {
                return new Response(JSON.stringify({
                    status: 'ok',
                    message: 'Recipe Stats API',
                    version: '2.0.0'
                }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }

            // ===== 排行榜与仪表盘 API =====

            // 仪表盘总览数据
            if (path === '/api/dashboard' && request.method === 'GET') {
                const siteId = url.searchParams.get('site_id') || 'main';
                
                // 总浏览量、总配餐次数
                const totalStats = await env.DB.prepare(
                    'SELECT SUM(views) as total_views, SUM(meals) as total_meals FROM site_daily_stats'
                ).first();

                // 当前站点统计
                const siteStats = await env.DB.prepare(
                    'SELECT SUM(views) as site_views, SUM(meals) as site_meals FROM site_daily_stats WHERE site_id = ?'
                ).bind(siteId).first();

                // 今日统计
                const todayStats = await env.DB.prepare(
                    'SELECT SUM(views) as today_views, SUM(meals) as today_meals FROM site_daily_stats WHERE date = date("now")'
                ).first();

                // 今日站点统计
                const todaySiteStats = await env.DB.prepare(
                    'SELECT COALESCE(SUM(views),0) as today_views, COALESCE(SUM(meals),0) as today_meals FROM site_daily_stats WHERE site_id = ? AND date = date("now")'
                ).bind(siteId).first();

                // 各站点统计
                const allSiteStats = await env.DB.prepare(
                    'SELECT site_id, SUM(views) as total_views, SUM(meals) as total_meals FROM site_daily_stats GROUP BY site_id ORDER BY total_views DESC'
                ).all();

                // 注册用户数
                const userCount = await env.DB.prepare('SELECT COUNT(*) as count FROM users').first();

                return new Response(JSON.stringify({
                    total_views: totalStats?.total_views || 0,
                    total_meals: totalStats?.total_meals || 0,
                    site_views: siteStats?.site_views || 0,
                    site_meals: siteStats?.site_meals || 0,
                    today_views: todayStats?.today_views || 0,
                    today_meals: todayStats?.today_meals || 0,
                    today_site_views: todaySiteStats?.today_views || 0,
                    today_site_meals: todaySiteStats?.today_meals || 0,
                    user_count: userCount?.count || 0,
                    sites: allSiteStats?.results || []
                }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }

            // 受欢迎菜品排行榜 TOP N
            if (path === '/api/top-recipes' && request.method === 'GET') {
                const limit = Math.min(parseInt(url.searchParams.get('limit')) || 20, 50);
                const siteId = url.searchParams.get('site_id');

                let query, bindings;
                if (siteId) {
                    query = `SELECT recipe_id, MAX(recipe_name) as recipe_name, COUNT(*) as total_views 
                        FROM recipe_views WHERE site_id = ? 
                        GROUP BY recipe_id ORDER BY total_views DESC LIMIT ?`;
                    bindings = [siteId, limit];
                } else {
                    query = `SELECT recipe_id, MAX(recipe_name) as recipe_name, COUNT(*) as total_views 
                        FROM recipe_views GROUP BY recipe_id ORDER BY total_views DESC LIMIT ?`;
                    bindings = [limit];
                }
                const results = await env.DB.prepare(query).bind(...bindings).all();

                return new Response(JSON.stringify({
                    recipes: results?.results || [],
                    count: results?.results?.length || 0
                }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }

            // 受欢迎菜单/配餐排行榜 TOP N（基于配餐中出现的菜品组合频率）
            if (path === '/api/top-meals' && request.method === 'GET') {
                const limit = Math.min(parseInt(url.searchParams.get('limit')) || 20, 50);
                const siteId = url.searchParams.get('site_id');

                // 获取最近的配餐记录，按日期和站点分组统计
                let query = `SELECT site_id, date(created_at) as gen_date, COUNT(*) as gen_count 
                    FROM meal_generations`;
                if (siteId) {
                    query += ' WHERE site_id = ?';
                }
                query += ' GROUP BY site_id, date(created_at) ORDER BY gen_count DESC LIMIT ?';

                const bindings = siteId ? [siteId, limit] : [limit];
                const results = await env.DB.prepare(query).bind(...bindings).all();

                return new Response(JSON.stringify({
                    meals: results?.results || [],
                    count: results?.results?.length || 0
                }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }

            // 站点列表（用于站间导航）
            if (path === '/api/sites' && request.method === 'GET') {
                const sites = [
                    { id: 'main', name: '智能配餐总站', emoji: '🍽️', url: 'https://recipe-matrix.pages.dev' },
                    { id: 'cn-home', name: '中式家常菜', emoji: '🥘', url: 'https://cn-home.recipe-matrix.pages.dev' },
                    { id: 'us-family', name: '美式家庭餐', emoji: '🍔', url: 'https://us-family.recipe-matrix.pages.dev' },
                    { id: 'kid-nutrition', name: '儿童营养餐', emoji: '🧒', url: 'https://kid-nutrition.recipe-matrix.pages.dev' },
                    { id: 'fitness-diet', name: '减脂健康餐', emoji: '💪', url: 'https://fitness-diet.recipe-matrix.pages.dev' },
                    { id: 'quick-meal', name: '懒人快手餐', emoji: '⚡', url: 'https://quick-meal.recipe-matrix.pages.dev' },
                    { id: 'party-feast', name: '宴席派对餐', emoji: '🎉', url: 'https://party-feast.recipe-matrix.pages.dev' }
                ];

                // 附加每个站点的统计数据
                const statsResults = await env.DB.prepare(
                    'SELECT site_id, SUM(views) as total_views, SUM(meals) as total_meals FROM site_daily_stats GROUP BY site_id'
                ).all();
                const statsMap = {};
                (statsResults?.results || []).forEach(row => {
                    statsMap[row.site_id] = { views: row.total_views, meals: row.total_meals };
                });

                sites.forEach(site => {
                    site.views = statsMap[site.id]?.views || 0;
                    site.meals = statsMap[site.id]?.meals || 0;
                });

                return new Response(JSON.stringify({ sites }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }

            // ===== 原有 API =====

            // Track page view
            if (path === '/api/page-view' && request.method === 'POST') {
                const { site_id, fingerprint, ip } = await request.json();
                if (!site_id || !fingerprint) {
                    return new Response(JSON.stringify({ error: 'Missing site_id or fingerprint' }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }
                    });
                }
                const clientIP = request.headers.get('CF-Connecting-IP') || ip || '';
                await env.DB.prepare(
                    'INSERT INTO page_views (site_id, fingerprint, ip, created_at) VALUES (?, ?, ?, datetime("now"))'
                ).bind(site_id, fingerprint, clientIP).run();
                await env.DB.prepare(
                    'INSERT INTO site_daily_stats (site_id, date, views) VALUES (?, date("now"), 1) ON CONFLICT(site_id, date) DO UPDATE SET views = views + 1'
                ).bind(site_id).run();
                return new Response(JSON.stringify({ status: 'ok' }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }

            // Track recipe view
            if (path === '/api/recipe-view' && request.method === 'POST') {
                const { recipe_id, recipe_name, site_id, fingerprint } = await request.json();
                if (!recipe_id || !site_id || !fingerprint) {
                    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }
                    });
                }
                await env.DB.prepare(
                    'INSERT INTO recipe_views (recipe_id, recipe_name, site_id, fingerprint, created_at) VALUES (?, ?, ?, ?, datetime("now"))'
                ).bind(recipe_id, recipe_name || recipe_id, site_id, fingerprint).run();
                await env.DB.prepare(
                    'INSERT INTO recipe_stats (recipe_id, views) VALUES (?, 1) ON CONFLICT(recipe_id) DO UPDATE SET views = views + 1'
                ).bind(recipe_id).run();
                return new Response(JSON.stringify({ status: 'ok' }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }

            // Get recipe stats
            if (path.startsWith('/api/recipe-stats/') && request.method === 'GET') {
                const recipeId = path.replace('/api/recipe-stats/', '');
                const result = await env.DB.prepare(
                    'SELECT * FROM recipe_stats WHERE recipe_id = ?'
                ).bind(recipeId).first();
                return new Response(JSON.stringify(result || { recipe_id: recipeId, views: 0, favorites: 0 }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }

            // Get site stats
            if (path === '/api/site-stats' && request.method === 'GET') {
                const siteId = url.searchParams.get('site_id');
                if (!siteId) {
                    return new Response(JSON.stringify({ error: 'Missing site_id parameter' }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }
                    });
                }
                const result = await env.DB.prepare(
                    'SELECT SUM(views) as total_views, SUM(meals) as total_meals FROM site_daily_stats WHERE site_id = ?'
                ).bind(siteId).first();
                return new Response(JSON.stringify(result), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }

            // Track meal generation
            if (path === '/api/meal-generate' && request.method === 'POST') {
                const { site_id, fingerprint, dish_count } = await request.json();
                if (!site_id || !fingerprint) {
                    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }
                    });
                }
                await env.DB.prepare(
                    'INSERT INTO meal_generations (site_id, fingerprint, dish_count, created_at) VALUES (?, ?, ?, datetime("now"))'
                ).bind(site_id, fingerprint, dish_count || 0).run();
                await env.DB.prepare(
                    'INSERT INTO site_daily_stats (site_id, date, meals) VALUES (?, date("now"), 1) ON CONFLICT(site_id, date) DO UPDATE SET meals = meals + 1'
                ).bind(site_id).run();
                return new Response(JSON.stringify({ status: 'ok' }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }

            // User registration
            if (path === '/api/register' && request.method === 'POST') {
                const { username, email, password, nickname } = await request.json();
                if (!username || !password) {
                    return new Response(JSON.stringify({ error: 'Missing username or password' }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }
                    });
                }
                const id = crypto.randomUUID();
                const encoder = new TextEncoder();
                const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(password));
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                try {
                    await env.DB.prepare(
                        'INSERT INTO users (id, username, email, password_hash, nickname, created_at) VALUES (?, ?, ?, ?, ?, datetime("now"))'
                    ).bind(id, username, email || null, passwordHash, nickname || username).run();
                    return new Response(JSON.stringify({ status: 'ok', user_id: id }), {
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }
                    });
                } catch (e) {
                    return new Response(JSON.stringify({ error: 'Username or email already exists' }), {
                        status: 409,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }
                    });
                }
            }

            // User login
            if (path === '/api/login' && request.method === 'POST') {
                const { username, password } = await request.json();
                if (!username || !password) {
                    return new Response(JSON.stringify({ error: 'Missing username or password' }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }
                    });
                }
                const encoder = new TextEncoder();
                const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(password));
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                const user = await env.DB.prepare(
                    'SELECT id, username, nickname, avatar FROM users WHERE username = ? AND password_hash = ?'
                ).bind(username, passwordHash).first();
                if (!user) {
                    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
                        status: 401,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }
                    });
                }
                const sessionId = crypto.randomUUID();
                await env.DB.prepare(
                    'INSERT INTO sessions (session_id, user_id, created_at, expires_at) VALUES (?, ?, datetime("now"), datetime("now", "+30 days"))'
                ).bind(sessionId, user.id).run();
                return new Response(JSON.stringify({ status: 'ok', user: user, session_id: sessionId }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }

            return new Response(JSON.stringify({ error: 'Not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }
    }
};
