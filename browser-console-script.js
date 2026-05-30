// ============================================================
// Cloudflare Recipe Stats System - 浏览器控制台部署脚本
// ============================================================
// 使用方法:
//   1. 在浏览器中登录 https://dash.cloudflare.com
//   2. 按 F12 打开开发者工具
//   3. 切换到 Console 标签
//   4. 将整个脚本粘贴到控制台中运行
// ============================================================

(async () => {
    const ACCOUNT_ID = '243a88b11027802a7ca7e78830726236';
    const BASE = `/client/v4/accounts/${ACCOUNT_ID}`;

    console.log('%c=== Cloudflare Recipe Stats System ===', 'color: cyan; font-size: 16px; font-weight: bold');

    // Step 1: Create D1 Database
    console.log('%c[Step 1/4] Creating D1 Database...', 'color: yellow');
    const dbResp = await fetch(`${BASE}/d1/database`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'recipe-stats' })
    }).then(r => r.json());

    let DB_UUID;
    if (dbResp.success) {
        DB_UUID = dbResp.result.uuid;
        console.log('%c  Database created!', 'color: green');
        console.log('  UUID:', DB_UUID);
    } else {
        console.warn('  Create failed, checking existing databases...');
        const listResp = await fetch(`${BASE}/d1/database`).then(r => r.json());
        const existing = listResp.result?.find(d => d.name === 'recipe-stats');
        if (existing) {
            DB_UUID = existing.uuid;
            console.log('%c  Found existing database!', 'color: green');
            console.log('  UUID:', DB_UUID);
        } else {
            console.error('FATAL: Cannot find or create database.');
            return;
        }
    }

    // Step 2: Create Worker
    console.log('%c[Step 2/4] Deploying Worker...', 'color: yellow');
    const workerCode = `export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };
        if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
        try {
            if (path === '/' || path === '/health') {
                return new Response(JSON.stringify({ status: 'ok', message: 'Recipe Stats API', version: '1.0.0' }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }
            if (path === '/api/page-view' && request.method === 'POST') {
                const { site_id, fingerprint, ip } = await request.json();
                if (!site_id || !fingerprint) return new Response(JSON.stringify({ error: 'Missing site_id or fingerprint' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
                const clientIP = request.headers.get('CF-Connecting-IP') || ip || '';
                await env.DB.prepare('INSERT INTO page_views (site_id, fingerprint, ip, created_at) VALUES (?, ?, ?, datetime("now"))').bind(site_id, fingerprint, clientIP).run();
                await env.DB.prepare('INSERT INTO site_daily_stats (site_id, date, views) VALUES (?, date("now"), 1) ON CONFLICT(site_id, date) DO UPDATE SET views = views + 1').bind(site_id).run();
                return new Response(JSON.stringify({ status: 'ok' }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
            }
            if (path === '/api/recipe-view' && request.method === 'POST') {
                const { recipe_id, site_id, fingerprint } = await request.json();
                if (!recipe_id || !site_id || !fingerprint) return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
                await env.DB.prepare('INSERT INTO recipe_views (recipe_id, site_id, fingerprint, created_at) VALUES (?, ?, ?, datetime("now"))').bind(recipe_id, site_id, fingerprint).run();
                await env.DB.prepare('INSERT INTO recipe_stats (recipe_id, views) VALUES (?, 1) ON CONFLICT(recipe_id) DO UPDATE SET views = views + 1').bind(recipe_id).run();
                return new Response(JSON.stringify({ status: 'ok' }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
            }
            if (path.startsWith('/api/recipe-stats/') && request.method === 'GET') {
                const recipeId = path.replace('/api/recipe-stats/', '');
                const result = await env.DB.prepare('SELECT * FROM recipe_stats WHERE recipe_id = ?').bind(recipeId).first();
                return new Response(JSON.stringify(result || { recipe_id: recipeId, views: 0, favorites: 0 }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
            }
            if (path === '/api/site-stats' && request.method === 'GET') {
                const siteId = url.searchParams.get('site_id');
                if (!siteId) return new Response(JSON.stringify({ error: 'Missing site_id parameter' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
                const result = await env.DB.prepare('SELECT SUM(views) as total_views, SUM(meals) as total_meals FROM site_daily_stats WHERE site_id = ?').bind(siteId).first();
                return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
            }
            if (path === '/api/meal-generate' && request.method === 'POST') {
                const { site_id, fingerprint, dish_count } = await request.json();
                if (!site_id || !fingerprint) return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
                await env.DB.prepare('INSERT INTO meal_generations (site_id, fingerprint, dish_count, created_at) VALUES (?, ?, ?, datetime("now"))').bind(site_id, fingerprint, dish_count || 0).run();
                await env.DB.prepare('INSERT INTO site_daily_stats (site_id, date, meals) VALUES (?, date("now"), 1) ON CONFLICT(site_id, date) DO UPDATE SET meals = meals + 1').bind(site_id).run();
                return new Response(JSON.stringify({ status: 'ok' }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
            }
            if (path === '/api/register' && request.method === 'POST') {
                const { username, email, password, nickname } = await request.json();
                if (!username || !password) return new Response(JSON.stringify({ error: 'Missing username or password' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
                const id = crypto.randomUUID();
                const encoder = new TextEncoder();
                const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(password));
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                try {
                    await env.DB.prepare('INSERT INTO users (id, username, email, password_hash, nickname, created_at) VALUES (?, ?, ?, ?, ?, datetime("now"))').bind(id, username, email || null, passwordHash, nickname || username).run();
                    return new Response(JSON.stringify({ status: 'ok', user_id: id }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
                } catch (e) {
                    return new Response(JSON.stringify({ error: 'Username or email already exists' }), { status: 409, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
                }
            }
            if (path === '/api/login' && request.method === 'POST') {
                const { username, password } = await request.json();
                if (!username || !password) return new Response(JSON.stringify({ error: 'Missing username or password' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
                const encoder = new TextEncoder();
                const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(password));
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                const user = await env.DB.prepare('SELECT id, username, nickname, avatar FROM users WHERE username = ? AND password_hash = ?').bind(username, passwordHash).first();
                if (!user) return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
                const sessionId = crypto.randomUUID();
                await env.DB.prepare('INSERT INTO sessions (session_id, user_id, created_at, expires_at) VALUES (?, ?, datetime("now"), datetime("now", "+30 days"))').bind(sessionId, user.id).run();
                return new Response(JSON.stringify({ status: 'ok', user: user, session_id: sessionId }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
            }
            return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        }
    }
}`;

    const workerResp = await fetch(`${BASE}/workers/scripts/recipe-stats-worker`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/javascript' },
        body: workerCode
    }).then(r => r.json());
    console.log('  Worker response:', workerResp.success ? '%cSuccess!' : '%cFailed', workerResp.success ? 'color: green' : 'color: red');
    if (!workerResp.success) console.error('  Errors:', workerResp.errors);

    // Step 2b: Bind D1 to Worker
    console.log('%c  Binding D1 to Worker...', 'color: yellow');
    const bindResp = await fetch(`${BASE}/workers/scripts/recipe-stats-worker/bindings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            bindings: [{
                type: 'd1',
                name: 'DB',
                id: DB_UUID
            }]
        })
    }).then(r => r.json());
    console.log('  Binding response:', bindResp.success ? '%cSuccess!' : '%cFailed', bindResp.success ? 'color: green' : 'color: red');
    if (!bindResp.success) console.error('  Errors:', bindResp.errors);

    // Step 3: Create Business Tables
    console.log('%c[Step 3/4] Creating business tables...', 'color: yellow');
    const businessSQL = `
CREATE TABLE IF NOT EXISTS page_views (id INTEGER PRIMARY KEY AUTOINCREMENT, site_id TEXT NOT NULL, fingerprint TEXT NOT NULL, ip TEXT, created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_pv_site ON page_views(site_id);
CREATE TABLE IF NOT EXISTS recipe_views (id INTEGER PRIMARY KEY AUTOINCREMENT, recipe_id TEXT NOT NULL, site_id TEXT NOT NULL, fingerprint TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_rv_recipe ON recipe_views(recipe_id);
CREATE TABLE IF NOT EXISTS recipe_stats (recipe_id TEXT PRIMARY KEY, views INTEGER DEFAULT 0, favorites INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS meal_generations (id INTEGER PRIMARY KEY AUTOINCREMENT, site_id TEXT NOT NULL, fingerprint TEXT NOT NULL, dish_count INTEGER DEFAULT 0, created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_mg_site ON meal_generations(site_id);
CREATE TABLE IF NOT EXISTS meal_plans (meal_id TEXT PRIMARY KEY, site_id TEXT NOT NULL, dish_ids TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_mp_date ON meal_plans(created_at);
CREATE TABLE IF NOT EXISTS site_daily_stats (site_id TEXT NOT NULL, date TEXT NOT NULL, views INTEGER DEFAULT 0, meals INTEGER DEFAULT 0, PRIMARY KEY (site_id, date));`;

    const sqlResp = await fetch(`${BASE}/d1/database/${DB_UUID}/raw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: businessSQL })
    }).then(r => r.json());
    console.log('  Business tables:', sqlResp.success ? '%cCreated!' : '%cFailed', sqlResp.success ? 'color: green' : 'color: red');
    if (!sqlResp.success) console.error('  Errors:', sqlResp.errors);

    // Step 4: Create User Tables
    console.log('%c[Step 4/4] Creating user tables...', 'color: yellow');
    const userSQL = `
CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, email TEXT UNIQUE, password_hash TEXT NOT NULL, nickname TEXT, avatar TEXT DEFAULT '👨‍🍳', favorites TEXT DEFAULT '[]', history TEXT DEFAULT '[]', preferences TEXT DEFAULT '{}', created_at TEXT NOT NULL, last_login TEXT);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE TABLE IF NOT EXISTS sessions (session_id TEXT PRIMARY KEY, user_id TEXT NOT NULL, created_at TEXT NOT NULL, expires_at TEXT NOT NULL, ip TEXT, user_agent TEXT);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);`;

    const userSqlResp = await fetch(`${BASE}/d1/database/${DB_UUID}/raw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: userSQL })
    }).then(r => r.json());
    console.log('  User tables:', userSqlResp.success ? '%cCreated!' : '%cFailed', userSqlResp.success ? 'color: green' : 'color: red');
    if (!userSqlResp.success) console.error('  Errors:', userSqlResp.errors);

    // Summary
    console.log('%c=== DEPLOYMENT COMPLETE ===', 'color: cyan; font-size: 16px; font-weight: bold');
    console.log(`%cD1 Database UUID: ${DB_UUID}`, 'color: white');
    console.log('%cWorker Name: recipe-stats-worker', 'color: white');
    console.log(`%cWorker URL: https://recipe-stats-worker.${ACCOUNT_ID}.workers.dev`, 'color: white');
    console.log('');
    console.log('%cAPI Endpoints:', 'color: yellow');
    console.log('  GET  /health               - Health check');
    console.log('  POST /api/page-view         - Track page view');
    console.log('  POST /api/recipe-view       - Track recipe view');
    console.log('  GET  /api/recipe-stats/:id  - Get recipe stats');
    console.log('  GET  /api/site-stats        - Get site stats');
    console.log('  POST /api/meal-generate     - Track meal generation');
    console.log('  POST /api/register          - User registration');
    console.log('  POST /api/login             - User login');
})();
