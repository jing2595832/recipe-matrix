/**
 * 首页统计组件 - Dashboard
 * 仅显示：实时热门菜品 + 受欢迎菜品TOP 10 + 底部统计栏
 * 完整统计数据请访问 stats.html
 */

const Dashboard = {
    API_BASE: 'https://recipe-stats-worker.jing2595832.workers.dev',
    siteId: null,
    siteName: null,

    init(siteId, siteName) {
        this.siteId = siteId;
        this.siteName = siteName || siteId;
        this.loadHotRecipes();
        this.loadTopRecipesForMain();
        this.loadBottomStats();
    },

    // 格式化数字
    formatNum(n) {
        if (!n) return '0';
        if (n >= 10000) return (n / 10000).toFixed(1) + '万';
        if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
        return String(n);
    },

    // 带超时的fetch
    async fetchWithTimeout(url, timeout = 5000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        try {
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            return res;
        } catch (e) {
            clearTimeout(timeoutId);
            throw e;
        }
    },

    // 加载实时热门菜品（6个，带图片卡片样式）
    async loadHotRecipes() {
        const container = document.getElementById('hotRecipesContainer');
        if (!container) return;

        try {
            const res = await this.fetchWithTimeout(`${this.API_BASE}/api/top-recipes?limit=6`, 5000);
            const data = await res.json();
            
            if (!data.recipes || data.recipes.length === 0) {
                container.innerHTML = '<div class="loading-placeholder">暂无数据，浏览菜谱后将显示热门菜品 🍳</div>';
                return;
            }

            container.innerHTML = data.recipes.map((r, i) => {
                const cls = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : 'normal';
                const name = r.recipe_name || r.recipe_id || '未知菜品';
                return `<div class="hot-recipe-item">
                    <span class="hot-rank ${cls}">${i + 1}</span>
                    <div class="hot-recipe-info">
                        <div class="hot-recipe-name">${name}</div>
                        <div class="hot-recipe-views">${this.formatNum(r.total_views)} 次浏览</div>
                    </div>
                </div>`;
            }).join('');
        } catch (e) {
            container.innerHTML = '<div class="loading-placeholder">网络超时，请稍后重试</div>';
        }
    },

    // 加载受欢迎菜品TOP 10（列表样式）
    async loadTopRecipesForMain() {
        const list = document.getElementById('topRecipesList');
        if (!list) return;

        try {
            const res = await this.fetchWithTimeout(`${this.API_BASE}/api/top-recipes?limit=10`, 5000);
            const data = await res.json();
            
            if (!data.recipes || data.recipes.length === 0) {
                list.innerHTML = '<li class="loading-placeholder">暂无数据，浏览菜谱后将显示排行榜 🍳</li>';
                return;
            }

            list.innerHTML = data.recipes.map((r, i) => {
                const cls = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : 'normal';
                const name = r.recipe_name || r.recipe_id || '未知菜品';
                return `<li class="top-recipe-item">
                    <span class="top-rank ${cls}">${i + 1}</span>
                    <span class="top-name">${name}</span>
                    <span class="top-views">${this.formatNum(r.total_views)} 次</span>
                </li>`;
            }).join('');
        } catch (e) {
            list.innerHTML = '<li class="loading-placeholder">网络超时</li>';
        }
    },

    // 底部统计栏
    async loadBottomStats() {
        try {
            const res = await this.fetchWithTimeout(`${this.API_BASE}/api/site-stats?site_id=${this.siteId}`, 5000);
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
            const footer = document.querySelector('footer');
            if (footer) {
                footer.parentNode.insertBefore(bar, footer);
            } else {
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
