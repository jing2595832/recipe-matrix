/**
 * 仪表盘组件 - Dashboard
 * 显示受欢迎菜品排行榜、菜单排行榜、统计概览
 * 底部统计栏：菜单生成次数 + 网页浏览量
 */

const Dashboard = {
    API_BASE: 'https://recipe-stats-worker.jing2595832.workers.dev',
    siteId: null,
    siteName: null,

    init(siteId, siteName) {
        this.siteId = siteId;
        this.siteName = siteName || siteId;
        this.loadDashboard();
        this.loadBottomStats();
    },

    // 格式化数字
    formatNum(n) {
        if (!n) return '0';
        if (n >= 10000) return (n / 10000).toFixed(1) + '万';
        if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
        return String(n);
    },

    // 加载仪表盘数据
    async loadDashboard() {
        try {
            const res = await fetch(`${this.API_BASE}/api/dashboard?site_id=${this.siteId}`);
            const data = await res.json();
            this.renderDashboard(data);
        } catch (e) {
            console.log('Dashboard load error:', e);
            this.renderDashboard(null);
        }

        // 加载排行榜
        this.loadTopRecipes();
        this.loadTopMeals();
    },

    // 渲染仪表盘
    renderDashboard(data) {
        let container = document.getElementById('dashboardSection');
        if (!container) {
            container = document.createElement('section');
            container.id = 'dashboardSection';
            // 插入到 hero-section 之后
            const hero = document.querySelector('.hero-section') || document.querySelector('.hero') || document.querySelector('section');
            if (hero && hero.parentNode) {
                hero.parentNode.insertBefore(container, hero.nextSibling);
            } else {
                const main = document.querySelector('main');
                if (main) main.prepend(container);
                else document.body.prepend(container);
            }
        }

        const tv = data ? this.formatNum(data.total_views) : '--';
        const tm = data ? this.formatNum(data.total_meals) : '--';
        const sv = data ? this.formatNum(data.site_views) : '--';
        const sm = data ? this.formatNum(data.site_meals) : '--';
        const tvToday = data ? this.formatNum(data.today_views) : '--';
        const tmToday = data ? this.formatNum(data.today_meals) : '--';
        const uc = data ? this.formatNum(data.user_count) : '--';

        container.innerHTML = `
        <style>
            .dashboard-section {
                max-width: 1200px;
                margin: 0 auto;
                padding: 40px 20px;
            }
            .dashboard-header {
                text-align: center;
                margin-bottom: 30px;
            }
            .dashboard-header h2 {
                font-size: 1.6rem;
                color: #333;
                margin: 0 0 8px;
            }
            .dashboard-header p {
                color: #888;
                font-size: 0.9rem;
                margin: 0;
            }
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 16px;
                margin-bottom: 30px;
            }
            .stat-card {
                background: #fff;
                border-radius: 16px;
                padding: 20px;
                text-align: center;
                box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                border: 1px solid #f0f0f0;
                transition: transform 0.2s;
            }
            .stat-card:hover { transform: translateY(-2px); }
            .stat-card .stat-value {
                font-size: 1.8rem;
                font-weight: 700;
                background: linear-gradient(135deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .stat-card .stat-label {
                font-size: 0.8rem;
                color: #999;
                margin-top: 4px;
            }
            .stat-card .stat-sub {
                font-size: 0.75rem;
                color: #bbb;
                margin-top: 2px;
            }
            .rank-section {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
            }
            @media (max-width: 768px) {
                .rank-section { grid-template-columns: 1fr; }
                .stats-grid { grid-template-columns: repeat(2, 1fr); }
            }
            .rank-card {
                background: #fff;
                border-radius: 16px;
                padding: 24px;
                box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                border: 1px solid #f0f0f0;
            }
            .rank-card h3 {
                font-size: 1.1rem;
                color: #333;
                margin: 0 0 16px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .rank-card h3 .icon { font-size: 1.3rem; }
            .rank-list { list-style: none; padding: 0; margin: 0; }
            .rank-item {
                display: flex;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid #f5f5f5;
                gap: 12px;
            }
            .rank-item:last-child { border-bottom: none; }
            .rank-num {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                font-weight: 700;
                flex-shrink: 0;
            }
            .rank-num.gold { background: #FFD700; color: #fff; }
            .rank-num.silver { background: #C0C0C0; color: #fff; }
            .rank-num.bronze { background: #CD7F32; color: #fff; }
            .rank-num.normal { background: #f0f0f0; color: #999; }
            .rank-name {
                flex: 1;
                font-size: 0.9rem;
                color: #444;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .rank-count {
                font-size: 0.8rem;
                color: #999;
                flex-shrink: 0;
            }
            .rank-empty {
                text-align: center;
                color: #ccc;
                padding: 30px;
                font-size: 0.9rem;
            }
        </style>
        <div class="dashboard-section">
            <div class="dashboard-header">
                <h2>📊 数据仪表盘</h2>
                <p>实时统计 · 全站数据概览</p>
            </div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${tv}</div>
                    <div class="stat-label">全站总浏览量</div>
                    <div class="stat-sub">今日 +${tvToday}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${tm}</div>
                    <div class="stat-label">菜单生成总次数</div>
                    <div class="stat-sub">今日 +${tmToday}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${sv}</div>
                    <div class="stat-label">本站浏览量</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${sm}</div>
                    <div class="stat-label">本站菜单生成</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${uc}</div>
                    <div class="stat-label">注册用户</div>
                </div>
            </div>
            <div class="rank-section">
                <div class="rank-card">
                    <h3><span class="icon">🔥</span> 受欢迎菜品 TOP 10</h3>
                    <ul class="rank-list" id="topRecipesList">
                        <li class="rank-empty">加载中...</li>
                    </ul>
                </div>
                <div class="rank-card">
                    <h3><span class="icon">📋</span> 活跃站点排行</h3>
                    <ul class="rank-list" id="topMealsList">
                        <li class="rank-empty">加载中...</li>
                    </ul>
                </div>
            </div>
        </div>`;
    },

    // 加载菜品排行榜
    async loadTopRecipes() {
        try {
            const res = await fetch(`${this.API_BASE}/api/top-recipes?limit=10&site_id=${this.siteId}`);
            const data = await res.json();
            const list = document.getElementById('topRecipesList');
            if (!list) return;
            if (!data.recipes || data.recipes.length === 0) {
                list.innerHTML = '<li class="rank-empty">暂无数据，浏览菜谱后这里将显示排行榜 🍳</li>';
                return;
            }
            list.innerHTML = data.recipes.map((r, i) => {
                const cls = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : 'normal';
                const name = r.recipe_name || r.recipe_id || '未知菜品';
                return `<li class="rank-item">
                    <span class="rank-num ${cls}">${i + 1}</span>
                    <span class="rank-name">${name}</span>
                    <span class="rank-count">${this.formatNum(r.total_views)} 次</span>
                </li>`;
            }).join('');
        } catch (e) {
            const list = document.getElementById('topRecipesList');
            if (list) list.innerHTML = '<li class="rank-empty">加载失败</li>';
        }
    },

    // 加载菜单/站点活跃排行
    async loadTopMeals() {
        try {
            const res = await fetch(`${this.API_BASE}/api/sites`);
            const data = await res.json();
            const list = document.getElementById('topMealsList');
            if (!list) return;
            if (!data.sites || data.sites.length === 0) {
                list.innerHTML = '<li class="rank-empty">暂无数据</li>';
                return;
            }
            // 按浏览量排序
            const sorted = data.sites.sort((a, b) => (b.views || 0) - (a.views || 0));
            list.innerHTML = sorted.map((s, i) => {
                const cls = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : 'normal';
                const isCurrent = s.id === this.siteId;
                return `<li class="rank-item" style="${isCurrent ? 'background:#f8f0ff;border-radius:8px;padding:10px 8px;' : ''}">
                    <span class="rank-num ${cls}">${i + 1}</span>
                    <span class="rank-name">${s.emoji} ${s.name}${isCurrent ? ' (当前)' : ''}</span>
                    <span class="rank-count">${this.formatNum(s.views)} 浏览</span>
                </li>`;
            }).join('');
        } catch (e) {
            const list = document.getElementById('topMealsList');
            if (list) list.innerHTML = '<li class="rank-empty">加载失败</li>';
        }
    },

    // 底部统计栏
    async loadBottomStats() {
        try {
            const res = await fetch(`${this.API_BASE}/api/site-stats?site_id=${this.siteId}`);
            const data = await res.json();
            this.renderBottomStats(data);
        } catch (e) {
            this.renderBottomStats(null);
        }
    },

    renderBottomStats(data) {
        let bar = document.getElementById('bottomStatsBar');
        if (!bar) {
            bar = document.createElement('div');
            bar.id = 'bottomStatsBar';
            // 尝试插入到 footer 之前
            const footer = document.querySelector('footer');
            if (footer) {
                footer.parentNode.insertBefore(bar, footer);
            } else {
                // 如果没有 footer，追加到 body 末尾
                document.body.appendChild(bar);
            }
        }

        const views = data ? this.formatNum(data.total_views) : '--';
        const meals = data ? this.formatNum(data.total_meals) : '--';

        bar.innerHTML = `
        <style>
            .bottom-stats-bar {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 30px;
                padding: 16px 20px;
                border-top: 1px solid rgba(255,255,255,0.1);
                flex-wrap: wrap;
            }
            .bottom-stat-item {
                display: flex;
                align-items: center;
                gap: 6px;
                color: rgba(255,255,255,0.7);
                font-size: 0.85rem;
            }
            .bottom-stat-item .val {
                color: #fff;
                font-weight: 700;
                font-size: 1rem;
            }
        </style>
        <div class="bottom-stats-bar">
            <div class="bottom-stat-item">
                🍳 菜单已生成 <span class="val">${meals}</span> 次
            </div>
            <div class="bottom-stat-item">
                👁️ 网页浏览量 <span class="val">${views}</span>
            </div>
            <div class="bottom-stat-item">
                ⚡ 由 Cloudflare Workers 驱动
            </div>
        </div>`;
    }
};
