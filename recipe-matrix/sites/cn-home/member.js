// ===== 智能菜谱会员系统 (Smart Recipe Membership System) =====
// 使用 Cloudflare Worker + D1 数据库
// Worker URL: https://recipe-stats-worker.jing2595832.workers.dev

const MemberSystem = {
    // Worker API 地址
    API_BASE: 'https://recipe-stats-worker.jing2595832.workers.dev',
    
    // 初始化
    init() {
        this.updateLoginButton();
        this.checkSession();
    },

    // 获取所有用户（本地备用）
    getUsers() {
        return JSON.parse(localStorage.getItem('recipe_matrix_users') || '[]');
    },

    // 保存用户（本地备用）
    saveUsers(users) {
        localStorage.setItem('recipe_matrix_users', JSON.stringify(users));
    },

    // 获取当前登录用户
    getCurrentUser() {
        // 优先从Worker认证获取
        const authUser = localStorage.getItem('auth_user');
        if (authUser) {
            return JSON.parse(authUser);
        }
        // 回退到本地存储
        const userId = localStorage.getItem('recipe_matrix_current_user');
        if (!userId) return null;
        const users = this.getUsers();
        return users.find(u => u.id === userId) || null;
    },

    // 带超时的fetch请求
    async fetchWithTimeout(url, options, timeout = 5000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        try {
            const response = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    },

    // 注册（通过Worker API）
    async register(username, email, password, nickname) {
        try {
            const response = await this.fetchWithTimeout(`${this.API_BASE}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, nickname })
            }, 5000);
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('auth_user', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            // 网络错误时回退到本地注册
            console.log('API register failed, using local fallback');
            return this.registerLocal(username, email, password, nickname);
        }
    },
    
    // 本地注册（离线备用）
    registerLocal(username, email, password, nickname) {
        const users = this.getUsers();
        if (users.find(u => u.username === username)) {
            return { success: false, message: '用户名已存在' };
        }
        if (users.find(u => u.email === email)) {
            return { success: false, message: '邮箱已被注册' };
        }
        const newUser = {
            id: 'user_' + Date.now(),
            username: username,
            email: email,
            password: btoa(password),
            nickname: nickname || username,
            avatar: '👨‍🍳',
            favorites: [],
            history: [],
            preferences: { spicy: false, allergies: [], diet: 'normal' },
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
        users.push(newUser);
        this.saveUsers(users);
        localStorage.setItem('recipe_matrix_current_user', newUser.id);
        return { success: true, user: newUser };
    },

    // 登录（通过Worker API）
    async login(username, password) {
        try {
            const response = await this.fetchWithTimeout(`${this.API_BASE}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            }, 5000);
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('auth_user', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            // 网络错误时回退到本地登录
            console.log('API login failed, using local fallback');
            return this.loginLocal(username, password);
        }
    },
    
    // 本地登录（离线备用）
    loginLocal(username, password) {
        const users = this.getUsers();
        const user = users.find(u => u.username === username && u.password === btoa(password));
        if (!user) {
            return { success: false, message: '用户名或密码错误' };
        }
        user.lastLogin = new Date().toISOString();
        this.saveUsers(users);
        localStorage.setItem('recipe_matrix_current_user', user.id);
        return { success: true, user: user };
    },

    // 登出
    logout() {
        localStorage.removeItem('recipe_matrix_current_user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        this.updateLoginButton();
    },

    // 添加收藏
    addFavorite(recipeId) {
        const users = this.getUsers();
        const userId = localStorage.getItem('recipe_matrix_current_user');
        if (!userId) return false;
        const user = users.find(u => u.id === userId);
        if (!user) return false;
        if (!user.favorites.includes(recipeId)) {
            user.favorites.push(recipeId);
            this.saveUsers(users);
        }
        return true;
    },

    // 移除收藏
    removeFavorite(recipeId) {
        const users = this.getUsers();
        const userId = localStorage.getItem('recipe_matrix_current_user');
        if (!userId) return false;
        const user = users.find(u => u.id === userId);
        if (!user) return false;
        user.favorites = user.favorites.filter(id => id !== recipeId);
        this.saveUsers(users);
        return true;
    },

    // 添加浏览历史
    addHistory(recipeId) {
        const users = this.getUsers();
        const userId = localStorage.getItem('recipe_matrix_current_user');
        if (!userId) return false;
        const user = users.find(u => u.id === userId);
        if (!user) return false;
        // Remove if already exists, then add to front
        user.history = user.history.filter(id => id !== recipeId);
        user.history.unshift(recipeId);
        // Keep only last 50
        if (user.history.length > 50) user.history = user.history.slice(0, 50);
        this.saveUsers(users);
        return true;
    },

    // 检查会话
    checkSession() {
        const user = this.getCurrentUser();
        if (user) {
            this.updateLoginButton(user);
        }
    },

    // 更新登录按钮显示
    updateLoginButton(user) {
        if (!user) user = this.getCurrentUser();
        const loginBtns = document.querySelectorAll('.btn-login');
        loginBtns.forEach(btn => {
            if (user) {
                btn.textContent = user.nickname || user.username;
                btn.onclick = function(e) {
                    e.preventDefault();
                    MemberSystem.showUserMenu(user);
                };
                btn.style.cursor = 'pointer';
            } else {
                btn.textContent = btn.dataset.loginText || '登录/注册';
                btn.onclick = function(e) {
                    e.preventDefault();
                    MemberSystem.showAuthModal();
                };
            }
        });
    },

    // 显示认证弹窗（登录/注册切换）
    showAuthModal() {
        const overlay = document.createElement('div');
        overlay.id = 'authModal';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.3s ease';

        overlay.innerHTML = `
        <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3);overflow:hidden">
            <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:30px;text-align:center;color:#fff">
                <div style="font-size:2.5rem;margin-bottom:8px">🍽️</div>
                <h2 style="margin:0;font-size:1.4rem" id="authTitle">欢迎回来</h2>
                <p style="margin:8px 0 0;opacity:0.9;font-size:0.9rem" id="authSubtitle">登录您的账号</p>
            </div>
            <div style="padding:30px" id="authFormContainer">
                <div id="loginForm">
                    <div style="margin-bottom:16px">
                        <label style="display:block;font-size:0.85rem;color:#666;margin-bottom:6px;font-weight:600">用户名</label>
                        <input type="text" id="loginUsername" placeholder="请输入用户名" style="width:100%;padding:12px 16px;border:2px solid #e0e0e0;border-radius:10px;font-size:1rem;outline:none;transition:border-color 0.3s;box-sizing:border-box" onfocus="this.style.borderColor='#667eea'" onblur="this.style.borderColor='#e0e0e0'">
                    </div>
                    <div style="margin-bottom:24px">
                        <label style="display:block;font-size:0.85rem;color:#666;margin-bottom:6px;font-weight:600">密码</label>
                        <input type="password" id="loginPassword" placeholder="请输入密码" style="width:100%;padding:12px 16px;border:2px solid #e0e0e0;border-radius:10px;font-size:1rem;outline:none;transition:border-color 0.3s;box-sizing:border-box" onfocus="this.style.borderColor='#667eea'" onblur="this.style.borderColor='#e0e0e0'" onkeydown="if(event.key==='Enter')MemberSystem.handleLogin()">
                    </div>
                    <button onclick="MemberSystem.handleLogin()" style="width:100%;padding:14px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:10px;font-size:1.05rem;font-weight:600;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 24px rgba(102,126,234,0.4)'" onmouseout="this.style.transform='';this.style.boxShadow=''">登 录</button>
                    <p style="text-align:center;margin-top:16px;font-size:0.9rem;color:#666">还没有账号？<a href="javascript:void(0)" onclick="MemberSystem.switchToRegister()" style="color:#667eea;font-weight:600;text-decoration:none">立即注册</a></p>
                </div>
                <div id="registerForm" style="display:none">
                    <div style="margin-bottom:12px">
                        <label style="display:block;font-size:0.85rem;color:#666;margin-bottom:6px;font-weight:600">用户名</label>
                        <input type="text" id="regUsername" placeholder="设置用户名" style="width:100%;padding:12px 16px;border:2px solid #e0e0e0;border-radius:10px;font-size:1rem;outline:none;transition:border-color 0.3s;box-sizing:border-box" onfocus="this.style.borderColor='#667eea'" onblur="this.style.borderColor='#e0e0e0'">
                    </div>
                    <div style="margin-bottom:12px">
                        <label style="display:block;font-size:0.85rem;color:#666;margin-bottom:6px;font-weight:600">邮箱</label>
                        <input type="email" id="regEmail" placeholder="输入邮箱地址" style="width:100%;padding:12px 16px;border:2px solid #e0e0e0;border-radius:10px;font-size:1rem;outline:none;transition:border-color 0.3s;box-sizing:border-box" onfocus="this.style.borderColor='#667eea'" onblur="this.style.borderColor='#e0e0e0'">
                    </div>
                    <div style="margin-bottom:12px">
                        <label style="display:block;font-size:0.85rem;color:#666;margin-bottom:6px;font-weight:600">昵称</label>
                        <input type="text" id="regNickname" placeholder="设置昵称（可选）" style="width:100%;padding:12px 16px;border:2px solid #e0e0e0;border-radius:10px;font-size:1rem;outline:none;transition:border-color 0.3s;box-sizing:border-box" onfocus="this.style.borderColor='#667eea'" onblur="this.style.borderColor='#e0e0e0'">
                    </div>
                    <div style="margin-bottom:12px">
                        <label style="display:block;font-size:0.85rem;color:#666;margin-bottom:6px;font-weight:600">密码</label>
                        <input type="password" id="regPassword" placeholder="设置密码（至少6位）" style="width:100%;padding:12px 16px;border:2px solid #e0e0e0;border-radius:10px;font-size:1rem;outline:none;transition:border-color 0.3s;box-sizing:border-box" onfocus="this.style.borderColor='#667eea'" onblur="this.style.borderColor='#e0e0e0'">
                    </div>
                    <div style="margin-bottom:20px">
                        <label style="display:block;font-size:0.85rem;color:#666;margin-bottom:6px;font-weight:600">确认密码</label>
                        <input type="password" id="regPasswordConfirm" placeholder="再次输入密码" style="width:100%;padding:12px 16px;border:2px solid #e0e0e0;border-radius:10px;font-size:1rem;outline:none;transition:border-color 0.3s;box-sizing:border-box" onfocus="this.style.borderColor='#667eea'" onblur="this.style.borderColor='#e0e0e0'" onkeydown="if(event.key==='Enter')MemberSystem.handleRegister()">
                    </div>
                    <button onclick="MemberSystem.handleRegister()" style="width:100%;padding:14px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:10px;font-size:1.05rem;font-weight:600;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 24px rgba(102,126,234,0.4)'" onmouseout="this.style.transform='';this.style.boxShadow=''">注 册</button>
                    <p style="text-align:center;margin-top:16px;font-size:0.9rem;color:#666">已有账号？<a href="javascript:void(0)" onclick="MemberSystem.switchToLogin()" style="color:#667eea;font-weight:600;text-decoration:none">去登录</a></p>
                </div>
            </div>
            <button onclick="document.getElementById('authModal').remove()" style="position:absolute;top:12px;right:16px;width:32px;height:32px;border:none;background:rgba(255,255,255,0.2);border-radius:50%;color:#fff;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">&times;</button>
        </div>`;

        overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
        document.body.appendChild(overlay);
    },

    // 切换到注册表单
    switchToRegister() {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
        document.getElementById('authTitle').textContent = '创建账号';
        document.getElementById('authSubtitle').textContent = '注册成为会员';
    },

    // 切换到登录表单
    switchToLogin() {
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('authTitle').textContent = '欢迎回来';
        document.getElementById('authSubtitle').textContent = '登录您的账号';
    },

    // 处理登录
    async handleLogin() {
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        if (!username || !password) {
            this.showAlert('请输入用户名和密码');
            return;
        }
        // 显示加载状态
        const btn = document.querySelector('#loginForm button');
        const originalText = btn.textContent;
        btn.textContent = '登录中...';
        btn.disabled = true;
        
        const result = await this.login(username, password);
        
        btn.textContent = originalText;
        btn.disabled = false;
        
        if (result.success) {
            document.getElementById('authModal').remove();
            this.showAlert('登录成功！欢迎回来，' + (result.user.nickname || result.user.username), 'success');
            this.updateLoginButton(result.user);
        } else {
            this.showAlert(result.message);
        }
    },

    // 处理注册
    async handleRegister() {
        const username = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const nickname = document.getElementById('regNickname').value.trim();
        const password = document.getElementById('regPassword').value;
        const passwordConfirm = document.getElementById('regPasswordConfirm').value;

        if (!username || !email || !password) {
            this.showAlert('请填写必填项');
            return;
        }
        if (username.length < 3) {
            this.showAlert('用户名至少3个字符');
            return;
        }
        if (password.length < 6) {
            this.showAlert('密码至少6位');
            return;
        }
        if (password !== passwordConfirm) {
            this.showAlert('两次密码不一致');
            return;
        }
        if (!email.includes('@')) {
            this.showAlert('请输入有效的邮箱地址');
            return;
        }

        // 显示加载状态
        const btn = document.querySelector('#registerForm button');
        const originalText = btn.textContent;
        btn.textContent = '注册中...';
        btn.disabled = true;

        const result = await this.register(username, email, password, nickname);

        btn.textContent = originalText;
        btn.disabled = false;

        if (result.success) {
            document.getElementById('authModal').remove();
            this.showAlert('注册成功！欢迎加入，' + (result.user.nickname || result.user.username), 'success');
            this.updateLoginButton(result.user);
        } else {
            this.showAlert(result.message);
        }
    },

    // 显示用户菜单
    showUserMenu(user) {
        const overlay = document.createElement('div');
        overlay.id = 'userMenuModal';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px';

        const favCount = (user.favorites || []).length;
        const histCount = (user.history || []).length;

        overlay.innerHTML = `
        <div style="background:#fff;border-radius:20px;max-width:380px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3);overflow:hidden;position:relative">
            <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:30px;text-align:center;color:#fff">
                <div style="font-size:3rem;margin-bottom:8px">${user.avatar || '👨‍🍳'}</div>
                <h2 style="margin:0;font-size:1.3rem">${user.nickname || user.username}</h2>
                <p style="margin:6px 0 0;opacity:0.8;font-size:0.85rem">${user.email}</p>
            </div>
            <div style="padding:24px">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
                    <div style="background:#f0f4ff;border-radius:12px;padding:16px;text-align:center">
                        <div style="font-size:1.5rem;font-weight:700;color:#667eea">${favCount}</div>
                        <div style="font-size:0.85rem;color:#666;margin-top:4px">收藏菜谱</div>
                    </div>
                    <div style="background:#fff0f0;border-radius:12px;padding:16px;text-align:center">
                        <div style="font-size:1.5rem;font-weight:700;color:#e74c3c">${histCount}</div>
                        <div style="font-size:0.85rem;color:#666;margin-top:4px">浏览记录</div>
                    </div>
                </div>
                <div style="display:flex;flex-direction:column;gap:8px">
                    <button onclick="MemberSystem.showUnderDevelopment('我的收藏')" style="width:100%;padding:12px;background:#f8f9fa;border:1px solid #e0e0e0;border-radius:10px;font-size:0.95rem;cursor:pointer;text-align:left;padding-left:16px;display:flex;align-items:center;gap:10px" onmouseover="this.style.background='#eef'" onmouseout="this.style.background='#f8f9fa'">❤️ 我的收藏</button>
                    <button onclick="MemberSystem.showUnderDevelopment('浏览历史')" style="width:100%;padding:12px;background:#f8f9fa;border:1px solid #e0e0e0;border-radius:10px;font-size:0.95rem;cursor:pointer;text-align:left;padding-left:16px;display:flex;align-items:center;gap:10px" onmouseover="this.style.background='#eef'" onmouseout="this.style.background='#f8f9fa'">📖 浏览历史</button>
                    <button onclick="MemberSystem.showUnderDevelopment('饮食偏好设置')" style="width:100%;padding:12px;background:#f8f9fa;border:1px solid #e0e0e0;border-radius:10px;font-size:0.95rem;cursor:pointer;text-align:left;padding-left:16px;display:flex;align-items:center;gap:10px" onmouseover="this.style.background='#eef'" onmouseout="this.style.background='#f8f9fa'">⚙️ 饮食偏好</button>
                    <button onclick="MemberSystem.logout();document.getElementById('userMenuModal').remove();MemberSystem.showAlert('已退出登录')" style="width:100%;padding:12px;background:#fff5f5;border:1px solid #ffcdd2;border-radius:10px;font-size:0.95rem;cursor:pointer;text-align:left;padding-left:16px;color:#e74c3c;display:flex;align-items:center;gap:10px" onmouseover="this.style.background='#ffebee'" onmouseout="this.style.background='#fff5f5'">🚪 退出登录</button>
                </div>
            </div>
            <button onclick="document.getElementById('userMenuModal').remove()" style="position:absolute;top:12px;right:16px;width:32px;height:32px;border:none;background:rgba(255,255,255,0.2);border-radius:50%;color:#fff;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center">&times;</button>
        </div>`;

        overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
        document.body.appendChild(overlay);
    },

    // 提示信息
    showAlert(message, type) {
        const toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:10001;padding:14px 28px;border-radius:12px;font-size:0.95rem;font-weight:500;box-shadow:0 8px 24px rgba(0,0,0,0.15);animation:slideIn 0.3s ease;max-width:90%;text-align:center';
        if (type === 'success') {
            toast.style.background = '#00c853';
            toast.style.color = '#fff';
        } else {
            toast.style.background = '#ff5252';
            toast.style.color = '#fff';
        }
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    },

    // 开发中提示（复用）
    showUnderDevelopment(featureName) {
        if (typeof showUnderDevelopment === 'function') {
            showUnderDevelopment(featureName);
        } else {
            this.showAlert('「' + featureName + '」功能开发中');
        }
    }
};

// 页面加载后初始化
document.addEventListener('DOMContentLoaded', function() {
    MemberSystem.init();
});
