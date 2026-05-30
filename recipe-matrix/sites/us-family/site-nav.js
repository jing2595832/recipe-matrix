/**
 * 站间导航组件 - Site Navigation
 * 在页面底部显示所有子站链接，支持相互跳转
 */

const SiteNav = {
    // 站点配置
    sites: [
        { id: 'main', name: '智能配餐总站', emoji: '🍽️', color: '#667eea' },
        { id: 'cn-home', name: '中式家常菜', emoji: '🥘', color: '#e74c3c' },
        { id: 'us-family', name: '美式家庭餐', emoji: '🍔', color: '#3498db' },
        { id: 'kid-nutrition', name: '儿童营养餐', emoji: '🧒', color: '#2ecc71' },
        { id: 'fitness-diet', name: '减脂健康餐', emoji: '💪', color: '#e67e22' },
        { id: 'quick-meal', name: '懒人快手餐', emoji: '⚡', color: '#9b59b6' },
        { id: 'party-feast', name: '宴席派对餐', emoji: '🎉', color: '#1abc9c' }
    ],

    currentSiteId: null,

    init(siteId) {
        this.currentSiteId = siteId;
        this.render();
    },

    // 获取站点URL（本地/线上自动适配）
    getSiteUrl(siteId) {
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (isLocal) {
            if (siteId === 'main') return './index.html';
            return `../${siteId}/index.html`;
        }
        const urlMap = {
            'main': 'https://recipe-matrix.pages.dev',
            'cn-home': 'https://cn-home.recipe-matrix.pages.dev',
            'us-family': 'https://us-family.recipe-matrix.pages.dev',
            'kid-nutrition': 'https://kid-nutrition.recipe-matrix.pages.dev',
            'fitness-diet': 'https://fitness-diet.recipe-matrix.pages.dev',
            'quick-meal': 'https://quick-meal.recipe-matrix.pages.dev',
            'party-feast': 'https://party-feast.recipe-matrix.pages.dev'
        };
        return urlMap[siteId] || '#';
    },

    render() {
        // 查找或创建站间导航容器
        let container = document.getElementById('siteNav');
        if (!container) {
            container = document.createElement('div');
            container.id = 'siteNav';
            const footer = document.querySelector('.site-footer') || document.querySelector('footer');
            if (footer) {
                footer.parentNode.insertBefore(container, footer);
            } else {
                document.body.appendChild(container);
            }
        }

        const currentSite = this.sites.find(s => s.id === this.currentSiteId);
        const otherSites = this.sites.filter(s => s.id !== this.currentSiteId);

        container.innerHTML = `
        <style>
            .site-nav-bar {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                padding: 30px 20px;
                margin-top: 40px;
            }
            .site-nav-title {
                text-align: center;
                color: #fff;
                font-size: 1.1rem;
                font-weight: 600;
                margin-bottom: 20px;
                opacity: 0.9;
            }
            .site-nav-title span {
                color: ${currentSite ? currentSite.color : '#667eea'};
            }
            .site-nav-grid {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 12px;
                max-width: 900px;
                margin: 0 auto;
            }
            .site-nav-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 18px;
                background: rgba(255,255,255,0.08);
                border: 1px solid rgba(255,255,255,0.12);
                border-radius: 12px;
                color: #fff;
                text-decoration: none;
                font-size: 0.9rem;
                transition: all 0.3s ease;
                cursor: pointer;
            }
            .site-nav-item:hover {
                background: rgba(255,255,255,0.18);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }
            .site-nav-item.current {
                background: ${currentSite ? currentSite.color : '#667eea'};
                border-color: transparent;
                font-weight: 600;
                cursor: default;
            }
            .site-nav-item .emoji {
                font-size: 1.3rem;
            }
            @media (max-width: 600px) {
                .site-nav-grid { gap: 8px; }
                .site-nav-item { padding: 8px 14px; font-size: 0.85rem; }
            }
        </style>
        <div class="site-nav-bar">
            <div class="site-nav-title">🍽️ 菜谱网站矩阵 · <span>${currentSite ? currentSite.name : '全站导航'}</span></div>
            <div class="site-nav-grid">
                ${currentSite ? `<a class="site-nav-item current" href="#"><span class="emoji">${currentSite.emoji}</span>${currentSite.name}（当前）</a>` : ''}
                ${otherSites.map(s => `<a class="site-nav-item" href="${this.getSiteUrl(s.id)}"><span class="emoji">${s.emoji}</span>${s.name}</a>`).join('')}
            </div>
        </div>`;
    }
};
