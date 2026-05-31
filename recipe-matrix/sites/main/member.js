// ===== 智能菜谱会员系统 (Smart Recipe Membership System) =====
// 使用 Cloudflare Worker + D1 数据库 + 本地存储回退
// Worker URL: https://recipe-stats-worker.jing2595832.workers.dev

const MemberSystem = {
    API_BASE: 'https://recipe-stats-worker.jing2595832.workers.dev',
    
    init() {
        this.updateLoginButton();
        this.checkSession();
    },

    getUsers() {
        return JSON.parse(localStorage.getItem('recipe_matrix_users') || '[]');
    },

    saveUsers(users) {
        localStorage.setItem('recipe_matrix_users', JSON.stringify(users));
    },

    getCurrentUser() {
        const authUser = localStorage.getItem('auth_user');
        if (authUser) return JSON.parse(authUser);
        const userId = localStorage.getItem('recipe_matrix_current_user');
        if (!userId) return null;
        const users = this.getUsers();
        return users.find(u => u.id === userId) || null;
    },

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
            return this.registerLocal(username, email, password, nickname);
        }
    },
    
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
            username, email, password: btoa(password),
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
            return this.loginLocal(username, password);
        }
    },
    
    loginLocal(username, password) {
        const users = this.getUsers();
        const user = users.find(u => u.username === username && u.password === btoa(password));
        if (!user) return { success: false, message: '用户名或密码错误' };
        user.lastLogin = new Date().toISOString();
        this.saveUsers(users);
        localStorage.setItem('recipe_matrix_current_user', user.id);
        return { success: true, user };
    },

    logout() {
        localStorage.removeItem('recipe_matrix_current_user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        this.updateLoginButton();
    },

    // 更新用户数据
    updateUser(updates) {
        const userId = localStorage.getItem('recipe_matrix_current_user');
        if (!userId) return false;
        const users = this.getUsers();
        const idx = users.findIndex(u => u.id === userId);
        if (idx === -1) return false;
        users[idx] = { ...users[idx], ...updates };
        this.saveUsers(users);
        return true;
    },

    // 收藏功能
    isFavorite(recipeId) {
        const user = this.getCurrentUser();
        return user && user.favorites && user.favorites.includes(recipeId);
    },

    toggleFavorite(recipeId, recipeName) {
        const user = this.getCurrentUser();
        if (!user) {
            this.showAlert('请先登录');
            return false;
        }
        const users = this.getUsers();
        const idx = users.findIndex(u => u.id === user.id);
        if (idx === -1) return false;
        
        if (!users[idx].favorites) users[idx].favorites = [];
        const favIdx = users[idx].favorites.indexOf(recipeId);
        
        if (favIdx === -1) {
            users[idx].favorites.push(recipeId);
            this.saveUsers(users);
            this.showAlert(`已收藏「${recipeName}」`, 'success');
            return true;
        } else {
            users[idx].favorites.splice(favIdx, 1);
            this.saveUsers(users);
            this.showAlert(`已取消收藏`, 'success');
            return false;
        }
    },

    getFavorites() {
        const user = this.getCurrentUser();
        return user && user.favorites ? user.favorites : [];
    },

    // 浏览历史
    addHistory(recipeId, recipeName) {
        const user = this.getCurrentUser();
        if (!user) return;
        const users = this.getUsers();
        const idx = users.findIndex(u => u.id === user.id);
        if (idx === -1) return;
        
        if (!users[idx].history) users[idx].history = [];
        // 移除旧记录，添加到最前面
        users[idx].history = users[idx].history.filter(h => 
            typeof h === 'string' ? h !== recipeId : h.id !== recipeId
        );
        users[idx].history.unshift({ id: recipeId, name: recipeName, time: Date.now() });
        // 只保留最近50条
        if (users[idx].history.length > 50) users[idx].history = users[idx].history.slice(0, 50);
        this.saveUsers(users);
    },

    getHistory() {
        const user = this.getCurrentUser();
        return user && user.history ? user.history : [];
    },

    // 饮食偏好
    getPreferences() {
        const user = this.getCurrentUser();
        return user && user.preferences ? user.preferences : { spicy: false, allergies: [], diet: 'normal' };
    },

    setPreferences(preferences) {
        const user = this.getCurrentUser();
        if (!user) return false;
        const users = this.getUsers();
        const idx = users.findIndex(u => u.id === user.id);
        if (idx === -1) return false;
        users[idx].preferences = preferences;
        this.saveUsers(users);
        return true;
    },

    checkSession() {
        const user = this.getCurrentUser();
        if (user) this.updateLoginButton(user);
    },

    updateLoginButton(user) {
        if (!user) user = this.getCurrentUser();
        const loginBtns = document.querySelectorAll('.btn-login');
        loginBtns.forEach(btn => {
            if (user) {
                btn.textContent = user.nickname || user.username;
                btn.onclick = (e) => {
                    e.preventDefault();
                    this.showUserMenu(user);
                };
            } else {
                btn.textContent = btn.dataset.loginText || '登录/注册';
                btn.onclick = (e) => {
                    e.preventDefault();
                    this.showAuthModal();
                };
            }
        });
    },

    showAuthModal() {
        const overlay = document.createElement('div');
        overlay.id = 'authModal';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px';

        overlay.innerHTML = `
        <div style="background:#fff;border-radius:20px;max-width:420px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3);overflow:hidden;position:relative">
            <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:30px;text-align:center;color:#fff">
                <div style="font-size:2.5rem;margin-bottom:8px">🍽️</div>
                <h2 style="margin:0;font-size:1.4rem" id="authTitle">欢迎回来</h2>
                <p style="margin:8px 0 0;opacity:0.9;font-size:0.9rem" id="authSubtitle">登录您的账号</p>
            </div>
            <div style="padding:30px" id="authFormContainer">
                <div id="loginForm">
                    <div style="margin-bottom:16px">
                        <label style="display:block;font-size:0.85rem;color:#666;margin-bottom:6px;font-weight:600">用户名</label>
                        <input type="text" id="loginUsername" placeholder="请输入用户名" style="width:100%;padding:12px 16px;border:2px solid #e0e0e0;border-radius:10px;font-size:1rem;outline:none;box-sizing:border-box">
                    </div>
                    <div style="margin-bottom:24px">
                        <label style="display:block;font-size:0.85rem;color:#666;margin-bottom:6px;font-weight:600">密码</label>
                        <input type="password" id="loginPassword" placeholder="请输入密码" style="width:100%;padding:12px 16px;border:2px solid #e0e0e0;border-radius:10px;font-size:1rem;outline:none;box-sizing:border-box">
                    </div>
                    <button onclick="MemberSystem.handleLogin()" style="width:100%;padding:14px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:10px;font-size:1.05rem;font-weight:600;cursor:pointer">登 录</button>
                    <p style="text-align:center;margin-top:16px;font-size:0.9rem;color:#666">还没有账号？<a href="javascript:void(0)" onclick="MemberSystem.switchToRegister()" style="color:#667eea;font-weight:600;text-decoration:none">立即注册</a></p>
                </div>
                <div id="registerForm" style="display:none">
                    <div style="margin-bottom:12px">
                        <label style="display:block;font-size:0.85rem;color:#666;margin-bottom:6px;font-weight:600">用户名</label>
                        <input type="text" id="regUsername" placeholder="设置用户名（至少3位）" style="width:100%;padding:12px 16px;border:2px solid #e0e0e0;border-radius:10px;font-size:1rem;outline:none;box-sizing:border-box">
                    </div>
                    <div style="margin-bottom:12px">
                        <label style="display:block;font-size:0.85rem;color:#666;margin-bottom:6px;font-weight:600">邮箱</label>
                        <input type="email" id="regEmail" placeholder="输入邮箱地址" style="width:100%;padding:12px 16px;border:2px solid #e0e0e0;border-radius:10px;font-size:1rem;outline:none;box-sizing:border-box">
                    </div>
                    <div style="margin-bottom:12px">
                        <label style="display:block;font-size:0.85rem;color:#666;margin-bottom:6px;font-weight:600">昵称（可选）</label>
                        <input type="text" id="regNickname" placeholder="设置昵称" style="width:100%;padding:12px 16px;border:2px solid #e0e0e0;border-radius:10px;font-size:1rem;outline:none;box-sizing:border-box">
                    </div>
                    <div style="margin-bottom:12px">
                        <label style="display:block;font-size:0.85rem;color:#666;margin-bottom:6px;font-weight:600">密码</label>
                        <input type="password" id="regPassword" placeholder="设置密码（至少6位）" style="width:100%;padding:12px 16px;border:2px solid #e0e0e0;border-radius:10px;font-size:1rem;outline:none;box-sizing:border-box">
                    </div>
                    <div style="margin-bottom:20px">
                        <label style="display:block;font-size:0.85rem;color:#666;margin-bottom:6px;font-weight:600">确认密码</label>
                        <input type="password" id="regPasswordConfirm" placeholder="再次输入密码" style="width:100%;padding:12px 16px;border:2px solid #e0e0e0;border-radius:10px;font-size:1rem;outline:none;box-sizing:border-box">
                    </div>
                    <button onclick="MemberSystem.handleRegister()" style="width:100%;padding:14px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:10px;font-size:1.05rem;font-weight:600;cursor:pointer">注 册</button>
                    <p style="text-align:center;margin-top:16px;font-size:0.9rem;color:#666">已有账号？<a href="javascript:void(0)" onclick="MemberSystem.switchToLogin()" style="color:#667eea;font-weight:600;text-decoration:none">去登录</a></p>
                </div>
            </div>
            <button onclick="document.getElementById('authModal').remove()" style="position:absolute;top:12px;right:16px;width:32px;height:32px;border:none;background:rgba(255,255,255,0.2);border-radius:50%;color:#fff;font-size:1.2rem;cursor:pointer">&times;</button>
        </div>`;

        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
        document.body.appendChild(overlay);
    },

    switchToRegister() {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
        document.getElementById('authTitle').textContent = '创建账号';
        document.getElementById('authSubtitle').textContent = '注册成为会员';
    },

    switchToLogin() {
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('authTitle').textContent = '欢迎回来';
        document.getElementById('authSubtitle').textContent = '登录您的账号';
    },

    async handleLogin() {
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        if (!username || !password) { this.showAlert('请输入用户名和密码'); return; }
        
        const btn = document.querySelector('#loginForm button');
        btn.textContent = '登录中...'; btn.disabled = true;
        
        const result = await this.login(username, password);
        btn.textContent = '登 录'; btn.disabled = false;
        
        if (result.success) {
            document.getElementById('authModal').remove();
            this.showAlert('登录成功！欢迎回来', 'success');
            this.updateLoginButton(result.user);
        } else {
            this.showAlert(result.message);
        }
    },

    async handleRegister() {
        const username = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const nickname = document.getElementById('regNickname').value.trim();
        const password = document.getElementById('regPassword').value;
        const passwordConfirm = document.getElementById('regPasswordConfirm').value;

        if (!username || !email || !password) { this.showAlert('请填写必填项'); return; }
        if (username.length < 3) { this.showAlert('用户名至少3个字符'); return; }
        if (password.length < 6) { this.showAlert('密码至少6位'); return; }
        if (password !== passwordConfirm) { this.showAlert('两次密码不一致'); return; }
        if (!email.includes('@')) { this.showAlert('请输入有效的邮箱地址'); return; }

        const btn = document.querySelector('#registerForm button');
        btn.textContent = '注册中...'; btn.disabled = true;

        const result = await this.register(username, email, password, nickname);
        btn.textContent = '注 册'; btn.disabled = false;

        if (result.success) {
            document.getElementById('authModal').remove();
            this.showAlert('注册成功！欢迎加入', 'success');
            this.updateLoginButton(result.user);
        } else {
            this.showAlert(result.message);
        }
    },

    showUserMenu(user) {
        if (!user) user = this.getCurrentUser();
        const favCount = (user.favorites || []).length;
        const histCount = (user.history || []).length;

        const overlay = document.createElement('div');
        overlay.id = 'userMenuModal';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px';

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
                    <button onclick="MemberSystem.showFavorites()" style="width:100%;padding:12px;background:#f8f9fa;border:1px solid #e0e0e0;border-radius:10px;font-size:0.95rem;cursor:pointer;text-align:left;padding-left:16px">❤️ 我的收藏</button>
                    <button onclick="MemberSystem.showHistory()" style="width:100%;padding:12px;background:#f8f9fa;border:1px solid #e0e0e0;border-radius:10px;font-size:0.95rem;cursor:pointer;text-align:left;padding-left:16px">📖 浏览历史</button>
                    <button onclick="MemberSystem.showPreferences()" style="width:100%;padding:12px;background:#f8f9fa;border:1px solid #e0e0e0;border-radius:10px;font-size:0.95rem;cursor:pointer;text-align:left;padding-left:16px">⚙️ 饮食偏好</button>
                    <button onclick="MemberSystem.logout();document.getElementById('userMenuModal').remove();MemberSystem.showAlert('已退出登录')" style="width:100%;padding:12px;background:#fff5f5;border:1px solid #ffcdd2;border-radius:10px;font-size:0.95rem;cursor:pointer;text-align:left;padding-left:16px;color:#e74c3c">🚪 退出登录</button>
                </div>
            </div>
            <button onclick="document.getElementById('userMenuModal').remove()" style="position:absolute;top:12px;right:16px;width:32px;height:32px;border:none;background:rgba(255,255,255,0.2);border-radius:50%;color:#fff;font-size:1.2rem;cursor:pointer">&times;</button>
        </div>`;

        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
        document.body.appendChild(overlay);
    },

    // 显示收藏列表
    showFavorites() {
        const user = this.getCurrentUser();
        const favorites = user && user.favorites ? user.favorites : [];
        
        const overlay = document.createElement('div');
        overlay.id = 'favoritesModal';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10001;display:flex;align-items:center;justify-content:center;padding:20px';

        let content = '';
        if (favorites.length === 0) {
            content = '<div style="text-align:center;padding:40px;color:#999"><div style="font-size:3rem;margin-bottom:16px">💔</div>还没有收藏任何菜谱<br>浏览菜谱时点击❤️即可收藏</div>';
        } else {
            content = `<ul style="list-style:none;padding:0;margin:0;max-height:400px;overflow-y:auto">
                ${favorites.map(id => `<li style="padding:16px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
                    <span style="font-weight:500">${id}</span>
                    <button onclick="MemberSystem.toggleFavorite('${id}','${id}');location.reload()" style="padding:6px 12px;background:#fff0f0;color:#e74c3c;border:1px solid #ffcdd2;border-radius:6px;cursor:pointer;font-size:0.85rem">取消收藏</button>
                </li>`).join('')}
            </ul>`;
        }

        overlay.innerHTML = `
        <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3);overflow:hidden">
            <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:20px;color:#fff;display:flex;justify-content:space-between;align-items:center">
                <h3 style="margin:0">❤️ 我的收藏 (${favorites.length})</h3>
                <button onclick="document.getElementById('favoritesModal').remove()" style="background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer">&times;</button>
            </div>
            <div style="padding:20px">${content}</div>
        </div>`;

        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
        document.body.appendChild(overlay);
    },

    // 显示浏览历史
    showHistory() {
        const user = this.getCurrentUser();
        const history = user && user.history ? user.history : [];
        
        const overlay = document.createElement('div');
        overlay.id = 'historyModal';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10001;display:flex;align-items:center;justify-content:center;padding:20px';

        let content = '';
        if (history.length === 0) {
            content = '<div style="text-align:center;padding:40px;color:#999"><div style="font-size:3rem;margin-bottom:16px">📖</div>还没有浏览记录</div>';
        } else {
            content = `<ul style="list-style:none;padding:0;margin:0;max-height:400px;overflow-y:auto">
                ${history.map(h => {
                    const time = h.time ? new Date(h.time).toLocaleDateString('zh-CN') : '';
                    return `<li style="padding:16px;border-bottom:1px solid #eee">
                        <div style="font-weight:500">${h.name || h.id || '未知菜品'}</div>
                        <div style="font-size:0.8rem;color:#999;margin-top:4px">${time}</div>
                    </li>`;
                }).join('')}
            </ul>`;
        }

        overlay.innerHTML = `
        <div style="background:#fff;border-radius:20px;max-width:500px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3);overflow:hidden">
            <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:20px;color:#fff;display:flex;justify-content:space-between;align-items:center">
                <h3 style="margin:0">📖 浏览历史 (${history.length})</h3>
                <button onclick="document.getElementById('historyModal').remove()" style="background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer">&times;</button>
            </div>
            <div style="padding:20px">${content}</div>
        </div>`;

        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
        document.body.appendChild(overlay);
    },

    // 显示饮食偏好设置
    showPreferences() {
        const prefs = this.getPreferences();
        
        const overlay = document.createElement('div');
        overlay.id = 'preferencesModal';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10001;display:flex;align-items:center;justify-content:center;padding:20px';

        overlay.innerHTML = `
        <div style="background:#fff;border-radius:20px;max-width:450px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3);overflow:hidden">
            <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:20px;color:#fff;display:flex;justify-content:space-between;align-items:center">
                <h3 style="margin:0">⚙️ 饮食偏好设置</h3>
                <button onclick="document.getElementById('preferencesModal').remove()" style="background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer">&times;</button>
            </div>
            <div style="padding:24px">
                <div style="margin-bottom:20px">
                    <label style="display:flex;align-items:center;gap:12px;cursor:pointer">
                        <input type="checkbox" id="prefSpicy" ${prefs.spicy ? 'checked' : ''} style="width:20px;height:20px">
                        <span>🌶️ 能吃辣</span>
                    </label>
                </div>
                <div style="margin-bottom:20px">
                    <label style="display:block;margin-bottom:8px;font-weight:600">饮食类型</label>
                    <select id="prefDiet" style="width:100%;padding:12px;border:2px solid #e0e0e0;border-radius:10px;font-size:1rem">
                        <option value="normal" ${prefs.diet === 'normal' ? 'selected' : ''}>正常饮食</option>
                        <option value="vegetarian" ${prefs.diet === 'vegetarian' ? 'selected' : ''}>素食主义</option>
                        <option value="lowcarb" ${prefs.diet === 'lowcarb' ? 'selected' : ''}>低碳水</option>
                        <option value="highprotein" ${prefs.diet === 'highprotein' ? 'selected' : ''}>高蛋白</option>
                    </select>
                </div>
                <div style="margin-bottom:20px">
                    <label style="display:block;margin-bottom:8px;font-weight:600">过敏原（逗号分隔）</label>
                    <input type="text" id="prefAllergies" value="${(prefs.allergies || []).join(', ')}" placeholder="如：花生, 海鲜" style="width:100%;padding:12px;border:2px solid #e0e0e0;border-radius:10px;font-size:1rem;box-sizing:border-box">
                </div>
                <button onclick="MemberSystem.savePreferencesUI()" style="width:100%;padding:14px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:10px;font-size:1rem;font-weight:600;cursor:pointer">保存设置</button>
            </div>
        </div>`;

        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
        document.body.appendChild(overlay);
    },

    savePreferencesUI() {
        const spicy = document.getElementById('prefSpicy').checked;
        const diet = document.getElementById('prefDiet').value;
        const allergiesStr = document.getElementById('prefAllergies').value;
        const allergies = allergiesStr.split(',').map(s => s.trim()).filter(s => s);

        const prefs = { spicy, diet, allergies };
        if (this.setPreferences(prefs)) {
            document.getElementById('preferencesModal').remove();
            this.showAlert('偏好设置已保存', 'success');
        }
    },

    showAlert(message, type) {
        const toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:10002;padding:14px 28px;border-radius:12px;font-size:0.95rem;font-weight:500;box-shadow:0 8px 24px rgba(0,0,0,0.15);max-width:90%;text-align:center';
        toast.style.background = type === 'success' ? '#00c853' : '#ff5252';
        toast.style.color = '#fff';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 2500);
    }
};

document.addEventListener('DOMContentLoaded', () => MemberSystem.init());
