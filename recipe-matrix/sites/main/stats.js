/**
 * 全局统计系统 - Global Statistics System
 * 连接到 Cloudflare Worker + D1 数据库
 * Worker URL: https://recipe-stats-worker.jing2595832.workers.dev
 */

const StatsSystem = {
    // Worker API 地址
    API_BASE: 'https://recipe-stats-worker.jing2595832.workers.dev',
    
    // 当前站点ID
    siteId: null,
    
    // 用户指纹（用于匿名识别）
    fingerprint: null,
    
    // 初始化
    async init(siteId) {
        this.siteId = siteId;
        this.fingerprint = await this.generateFingerprint();
        
        // 记录页面访问
        this.trackPageView();
        
        // 绑定事件
        this.bindEvents();
    },
    
    // 生成用户指纹（基于浏览器特征，不使用cookie）
    async generateFingerprint() {
        const components = [];
        
        // 屏幕信息
        components.push(screen.width + 'x' + screen.height);
        components.push(screen.colorDepth);
        components.push(window.devicePixelRatio || 1);
        
        // 时区
        components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);
        
        // 语言
        components.push(navigator.language);
        
        // 平台
        components.push(navigator.platform);
        
        // Canvas 指纹
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillText('fingerprint', 2, 2);
            components.push(canvas.toDataURL().slice(-50));
        } catch (e) {}
        
        // WebGL 指纹
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl');
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                components.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
                components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
            }
        } catch (e) {}
        
        // 生成哈希
        const fingerprint = components.join('|');
        const hash = await this.sha256(fingerprint);
        return hash;
    },
    
    // SHA256 哈希
    async sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },
    
    // 带超时的fetch
    async fetchWithTimeout(url, options, timeout = 3000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        try {
            const res = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(timeoutId);
            return res;
        } catch (e) {
            clearTimeout(timeoutId);
            throw e;
        }
    },
    
    // 记录页面访问
    async trackPageView() {
        try {
            const data = {
                site_id: this.siteId,
                page_url: window.location.pathname,
                referrer: document.referrer || '',
                user_agent: navigator.userAgent,
                fingerprint: this.fingerprint,
                screen_width: screen.width,
                screen_height: screen.height,
                language: navigator.language
            };
            
            await this.fetchWithTimeout(`${this.API_BASE}/api/page-view`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }, 3000);
        } catch (error) {
            console.log('Stats tracking error:', error);
        }
    },
    
    // 记录菜谱浏览
    async trackRecipeView(recipeId, recipeName) {
        try {
            const data = {
                site_id: this.siteId,
                recipe_id: recipeId,
                recipe_name: recipeName,
                fingerprint: this.fingerprint
            };
            
            await this.fetchWithTimeout(`${this.API_BASE}/api/recipe-view`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }, 3000);
        } catch (error) {
            console.log('Recipe view tracking error:', error);
        }
    },
    
    // 记录配餐生成
    async trackMealGeneration(adults, children, dishes, soups) {
        try {
            const data = {
                site_id: this.siteId,
                adults: adults,
                children: children,
                dishes: dishes.map(d => d.id || d.name).join(','),
                soups: soups.map(s => s.id || s.name).join(','),
                fingerprint: this.fingerprint
            };
            
            await fetch(`${this.API_BASE}/api/meal-generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.log('Meal generation tracking error:', error);
        }
    },
    
    // 获取站点统计
    async getSiteStats() {
        try {
            const response = await fetch(`${this.API_BASE}/api/site-stats?site_id=${this.siteId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Get stats error:', error);
            return null;
        }
    },
    
    // 获取菜谱统计
    async getRecipeStats(recipeId) {
        try {
            const response = await fetch(`${this.API_BASE}/api/recipe-stats/${recipeId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Get recipe stats error:', error);
            return null;
        }
    },
    
    // 绑定事件
    bindEvents() {
        // 监听菜谱点击事件
        document.addEventListener('click', (e) => {
            const recipeCard = e.target.closest('.recipe-card, [data-recipe-id]');
            if (recipeCard) {
                const recipeId = recipeCard.dataset.recipeId || recipeCard.id;
                const recipeName = recipeCard.querySelector('h3, .recipe-name')?.textContent || 'Unknown';
                this.trackRecipeView(recipeId, recipeName);
            }
        });
    }
};

// 用户认证系统（通过Worker API）
const AuthSystem = {
    API_BASE: 'https://recipe-stats-worker.jing2595832.workers.dev',
    
    // 注册
    async register(username, email, password, nickname) {
        try {
            const response = await fetch(`${this.API_BASE}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, nickname })
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('auth_user', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            return { success: false, message: '网络错误，请稍后重试' };
        }
    },
    
    // 登录
    async login(username, password) {
        try {
            const response = await fetch(`${this.API_BASE}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('auth_user', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            return { success: false, message: '网络错误，请稍后重试' };
        }
    },
    
    // 登出
    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
    },
    
    // 获取当前用户
    getCurrentUser() {
        const userStr = localStorage.getItem('auth_user');
        return userStr ? JSON.parse(userStr) : null;
    },
    
    // 检查是否登录
    isLoggedIn() {
        return !!localStorage.getItem('auth_token');
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StatsSystem, AuthSystem };
}
