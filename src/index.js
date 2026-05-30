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
                    version: '1.0.0'
                }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }

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
                const { recipe_id, site_id, fingerprint } = await request.json();
                if (!recipe_id || !site_id || !fingerprint) {
                    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }
                    });
                }
                await env.DB.prepare(
                    'INSERT INTO recipe_views (recipe_id, site_id, fingerprint, created_at) VALUES (?, ?, ?, datetime("now"))'
                ).bind(recipe_id, site_id, fingerprint).run();
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
