# 🚀 Cloudflare Pages 部署指南

## 📋 部署前准备

1. GitHub 账号
2. Cloudflare 账号（免费注册）
3. 本项目代码已上传到 GitHub

---

## 🎯 部署步骤

### 第一步：上传代码到 GitHub

```bash
# 在本地项目目录执行
git init
git add .
git commit -m "Initial commit: Recipe Matrix"
git branch -M main
git remote add origin https://github.com/yourusername/recipe-matrix.git
git push -u origin main
```

### 第二步：创建 Cloudflare Pages 项目

#### 2.1 总站部署

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击左侧菜单 **Pages**
3. 点击 **Create a project**
4. 选择 **Connect to Git**
5. 授权并选择 `recipe-matrix` 仓库
6. 配置如下：

| 配置项 | 值 |
|--------|-----|
| Project name | `recipe-main` |
| Production branch | `main` |
| Root directory | `sites/main` |
| Build command | *(留空)* |
| Build output directory | *(留空)* |

7. 点击 **Save and Deploy**

#### 2.2 其他分站部署

重复上述步骤，创建 6 个额外项目：

| 项目名 | Root Directory | 用途 |
|--------|---------------|------|
| `recipe-cn` | `sites/cn-home` | 中式家常菜 |
| `recipe-us` | `sites/us-family` | 美式家庭餐 |
| `recipe-kids` | `sites/kid-nutrition` | 儿童辅食 |
| `recipe-fitness` | `sites/fitness-diet` | 减脂健康餐 |
| `recipe-quick` | `sites/quick-meal` | 懒人快手餐 |
| `recipe-party` | `sites/party-feast` | 宴席派对餐 |

### 第三步：配置自定义域名（可选）

#### 3.1 添加域名到 Cloudflare

1. 在 Cloudflare Dashboard 点击 **Add a Site**
2. 输入你的域名（如 `yourdomain.com`）
3. 选择免费计划
4. 按提示修改域名 NS 记录

#### 3.2 配置子域名

1. 进入域名的 **DNS** 设置
2. 添加 CNAME 记录：

| Type | Name | Target | Proxy status |
|------|------|--------|--------------|
| CNAME | main | recipe-main.pages.dev | Proxied |
| CNAME | cn | recipe-cn.pages.dev | Proxied |
| CNAME | us | recipe-us.pages.dev | Proxied |
| CNAME | kids | recipe-kids.pages.dev | Proxied |
| CNAME | fitness | recipe-fitness.pages.dev | Proxied |
| CNAME | quick | recipe-quick.pages.dev | Proxied |
| CNAME | party | recipe-party.pages.dev | Proxied |

3. 等待 DNS 生效（通常几分钟到几小时）

#### 3.3 在 Pages 项目中绑定域名

1. 进入每个 Pages 项目的 **Custom domains** 标签
2. 点击 **Set up a custom domain**
3. 输入对应子域名（如 `main.yourdomain.com`）
4. 点击 **Activate domain**

---

## 🔧 自动部署配置

Cloudflare Pages 默认开启自动部署：

- 每次推送到 `main` 分支 → 自动重新部署
- 预览部署：其他分支的推送会生成预览链接

### 部署规则设置

在项目的 **Settings** → **Builds & deployments**：

```
Build configuration:
  ├─ Build command: (空)
  ├─ Build output directory: (空)
  ├─ Root directory: sites/main (或其他分站路径)
  └─ Environment variables: (无需设置)

Git configuration:
  ├─ Production branch: main
  └─ Preview branches: (所有分支)
```

---

## ✅ 部署验证

### 检查清单

- [ ] 所有 7 个站点都能正常访问
- [ ] 站点间导航链接正常工作
- [ ] 菜谱数据正确加载
- [ ] 配餐功能正常运行
- [ ] 弹窗详情正常显示
- [ ] 响应式布局正常

### 测试命令

```bash
# 测试主站
curl https://main.yourdomain.com

# 测试各分站
curl https://cn.yourdomain.com
curl https://us.yourdomain.com
# ... 其他站点
```

---

## 🐛 常见问题

### Q1: 部署后页面空白？

**原因**: Root directory 设置错误

**解决**: 确保每个项目的 Root directory 指向正确的站点文件夹，如 `sites/main`

### Q2: 菜谱数据加载失败？

**原因**: 路径引用错误

**解决**: 
- 检查 `index.html` 中 `data.js` 和 `global.js` 的路径
- 确保路径是相对于站点根目录的，如 `../../public/data.js`

### Q3: 站点间跳转404？

**原因**: 相对路径错误

**解决**: 
- 如果每个站点有独立域名，使用绝对路径如 `https://cn.yourdomain.com`
- 如果使用子路径，使用相对路径如 `../cn-home/index.html`

### Q4: 样式没有生效？

**原因**: CSS 文件路径错误或缓存

**解决**:
- 检查浏览器开发者工具的 Network 面板
- 清除 Cloudflare 缓存：Caching → Purge Everything

### Q5: 如何更新网站？

**解决**:
```bash
# 修改代码后
git add .
git commit -m "Update: xxx"
git push origin main

# Cloudflare 会自动重新部署
```

---

## 📊 性能优化

### 启用 Cloudflare 优化功能

1. **Speed** → **Optimization**:
   - Auto Minify: 勾选 HTML, CSS, JS
   - Brotli: 开启
   - Early Hints: 开启

2. **Caching** → **Configuration**:
   - Caching Level: Standard
   - Browser Cache TTL: 4 hours
   - Always Online: 开启

3. **Network**:
   - HTTP/2: 开启
   - HTTP/3 (QUIC): 开启
   - 0-RTT Connection Resumption: 开启

---

## 🔒 安全设置

### HTTPS 强制

Cloudflare Pages 默认启用 HTTPS，无需额外配置。

### 安全头部（可选）

在项目根目录创建 `_headers` 文件：

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

---

## 📈 监控分析

### 查看访问数据

1. Cloudflare Dashboard → **Analytics**
2. 查看：
   - 请求数
   - 带宽使用
   - 访问来源
   - 性能指标

### 设置通知

1. 进入每个 Pages 项目
2. **Settings** → **Notifications**
3. 启用：
   - Build failures
   - Domain verification

---

## 🎉 完成！

部署完成后，你的菜谱网站矩阵就上线啦！

访问地址：
- 🏠 总站: https://main.yourdomain.com
- 🥢 中式: https://cn.yourdomain.com
- 🍔 美式: https://us.yourdomain.com
- 🍼 儿童: https://kids.yourdomain.com
- 💪 减脂: https://fitness.yourdomain.com
- ⚡ 快手: https://quick.yourdomain.com
- 🎉 宴席: https://party.yourdomain.com

---

## 📞 需要帮助？

- Cloudflare 文档: https://developers.cloudflare.com/pages/
- 项目 Issues: https://github.com/yourusername/recipe-matrix/issues
