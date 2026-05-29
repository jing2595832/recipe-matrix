# 🍽️ 智能菜谱网站矩阵 (Recipe Matrix)

> 解决全球用户"每天不知道吃什么"的刚需痛点
> 
> Solve the daily dilemma of "What should I cook today?" for users worldwide

[![Deploy to Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?style=flat&logo=cloudflare)](https://pages.cloudflare.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ 项目亮点

- 🆓 **100% 零成本** - 使用 Cloudflare Pages 免费托管，无服务器费用
- 🌍 **全球化部署** - 全球 CDN 加速，国内外访问都流畅
- 📱 **响应式设计** - 完美适配手机、平板、电脑
- 🔄 **智能配餐** - 根据人数自动计算菜品数量
- 🌐 **多站点矩阵** - 7个细分站点覆盖不同人群
- 📊 **统一数据库** - 改一次数据，全站同步更新

## 🏗️ 项目架构

```
recipe-matrix/
├── public/
│   └── data.js              # 全局共享菜谱数据库
├── common/
│   └── global.js            # 全局配餐算法和工具函数
├── sites/
│   ├── main/                # 🏠 总站：综合智能配餐
│   ├── cn-home/             # 🥢 中式家常菜
│   ├── us-family/           # 🍔 美式家庭餐
│   ├── kid-nutrition/       # 🍼 儿童辅食营养
│   ├── fitness-diet/        # 💪 减脂健康餐
│   ├── quick-meal/          # ⚡ 懒人快手餐
│   └── party-feast/         # 🎉 宴席派对餐
└── README.md
```

## 🚀 快速部署

### 1. Fork 或下载本仓库

```bash
git clone https://github.com/yourusername/recipe-matrix.git
```

### 2. 部署到 Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Pages** → **Create a project**
3. 连接 GitHub 仓库
4. 创建 7 个项目，分别设置：

| 项目名 | Root Directory | 访问地址 |
|--------|---------------|----------|
| recipe-main | `sites/main` | `main.yourdomain.pages.dev` |
| recipe-cn | `sites/cn-home` | `cn.yourdomain.pages.dev` |
| recipe-us | `sites/us-family` | `us.yourdomain.pages.dev` |
| recipe-kids | `sites/kid-nutrition` | `kids.yourdomain.pages.dev` |
| recipe-fitness | `sites/fitness-diet` | `fitness.yourdomain.pages.dev` |
| recipe-quick | `sites/quick-meal` | `quick.yourdomain.pages.dev` |
| recipe-party | `sites/party-feast` | `party.yourdomain.pages.dev` |

5. Build settings:
   - Build command: (留空)
   - Build output directory: (留空)
   - Root directory: `sites/xxx`

### 3. 配置自定义域名（可选）

在 Cloudflare DNS 中添加 CNAME 记录：

```
main    CNAME   main.yourdomain.pages.dev
cn      CNAME   cn.yourdomain.pages.dev
us      CNAME   us.yourdomain.pages.dev
kids    CNAME   kids.yourdomain.pages.dev
fitness CNAME   fitness.yourdomain.pages.dev
quick   CNAME   quick.yourdomain.pages.dev
party   CNAME   party.yourdomain.pages.dev
```

## 📝 自定义配置

### 添加新菜谱

编辑 `public/data.js`，在对应分类中添加新菜谱：

```javascript
{
  id: 'your-recipe-id',
  name: '菜谱名称',
  nameEn: 'English Name',
  cuisine: 'chinese',  // 菜系
  category: 'dish',    // dish 或 soup
  tags: ['quick', 'kid-friendly'],  // 标签
  time: 15,            // 准备时间（分钟）
  difficulty: 'easy',  // easy, medium, hard
  calories: 280,
  protein: 18,
  fat: 12,
  ingredients: [
    { name: '食材', amount: '100g', amountEn: '100g' }
  ],
  steps: ['步骤1', '步骤2', '步骤3']
}
```

### 修改站点主题

编辑对应站点的 `style.css`，修改 CSS 变量：

```css
:root {
  --primary: #e67722;      /* 主色调 */
  --secondary: #27ae60;    /* 次要色 */
  --accent: #f39c12;       /* 强调色 */
}
```

## 🎯 功能特性

### 核心功能

- ✅ 智能人数配菜算法
- ✅ 一键换菜
- ✅ 菜谱详情弹窗
- ✅ 营养信息统计
- ✅ 多站点互通导航
- ✅ 响应式设计
- ✅ 本地设置记忆

### 各站点特色

| 站点 | 目标人群 | 特色功能 |
|------|----------|----------|
| 总站 | 通用 | 综合所有菜系 |
| 中式 | 海外华人 | 八大菜系、双语支持 |
| 美式 | 美国家庭 | 英文界面、烤箱菜谱 |
| 儿童 | 宝妈 | 低盐软烂、营养标注 |
| 减脂 | 健身人群 | 热量显示、高蛋白筛选 |
| 快手 | 上班族 | 10分钟速成 |
| 宴席 | 聚会场景 | 大人数适配、节日套餐 |

## 🛠️ 技术栈

- **前端**: 原生 HTML5 + CSS3 + JavaScript (ES6+)
- **部署**: Cloudflare Pages
- **数据**: JSON 静态数据
- **样式**: CSS Variables + Flexbox + Grid
- **图标**: Emoji + 系统字体

## 📈 后续迭代计划

- [ ] 一周菜单自动规划
- [ ] 购物清单生成
- [ ] 用户收藏功能
- [ ] 搜索和筛选优化
- [ ] PWA 离线支持
- [ ] 暗黑模式

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证开源。

## 🙏 致谢

- 感谢 Cloudflare 提供免费托管服务
- 感谢所有贡献菜谱的朋友
- 感谢使用本项目的每一位用户

---

<p align="center">
  Made with ❤️ for food lovers around the world
</p>
