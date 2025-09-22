# 快速部署指南

## 🚀 5分钟快速部署

### 方法一：GitHub Pages（推荐新手）

```bash
# 1. 克隆项目
git clone https://github.com/username/fsrs-english-cards.git
cd fsrs-english-cards

# 2. 构建项目
npm install
npm run build

# 3. 部署到 GitHub Pages
npm install --save-dev gh-pages
npm run deploy
```

### 方法二：Netlify（推荐）

```bash
# 1. 构建项目
npm run build

# 2. 拖拽 dist/ 文件夹到 netlify.com
# 或使用 CLI：
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### 方法三：Vercel（推荐）

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 部署
vercel --prod
```

## 📋 部署检查清单

- [ ] 项目构建成功 (`npm run build`)
- [ ] `dist/` 目录包含所有必要文件
- [ ] 本地测试通过 (`python -m http.server 8000`)
- [ ] 域名和SSL证书配置正确
- [ ] 缓存策略配置完成
- [ ] 安全头配置完成
- [ ] 监控和分析工具配置完成

## 🔧 常见问题快速解决

### 构建失败
```bash
# 清理缓存重新安装
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 页面空白
```bash
# 检查文件路径
ls -la dist/
# 确保 index.html 存在且包含正确的资源引用
```

### 样式丢失
```bash
# 检查 CSS 文件
head -10 dist/styles.min.css
# 确保 HTML 中正确引用了 CSS 文件
```

## 📞 获取帮助

- 📖 查看完整部署文档：[deployment.md](./deployment.md)
- 🐛 报告问题：[GitHub Issues](https://github.com/username/fsrs-english-cards/issues)
- 💬 讨论交流：[GitHub Discussions](https://github.com/username/fsrs-english-cards/discussions)
