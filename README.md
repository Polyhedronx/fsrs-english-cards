# FSRS英语学习卡片

基于FSRS算法的智能英语学习网页应用，提供科学的间隔重复学习体验。

## ✨ 特性

- 🧠 **科学算法**: 基于FSRS4Anki算法，提供最优的学习间隔
- 📱 **响应式设计**: 支持桌面端和移动端
- 🎯 **智能调度**: 根据记忆状态智能安排复习时间
- 📊 **学习统计**: 详细的学习进度和统计信息
- 💾 **数据持久**: 本地存储，学习进度永不丢失
- 🚀 **快速部署**: 支持多种部署方式

## 🚀 快速开始

### 在线体验
直接在浏览器中打开 `public/index.html` 即可开始使用。

### 本地开发
```bash
# 克隆项目
git clone https://github.com/Polyhedronx/fsrs-english-cards.git
cd fsrs-english-cards

# 启动开发服务器
npm start
# 或
python -m http.server 8000

# 访问 http://localhost:8000
```

### 构建部署
```bash
# 构建项目
npm run build

# 部署到GitHub Pages
npm run deploy:github

# 部署到Netlify
npm run deploy:netlify

# 部署到Vercel
npm run deploy:vercel
```

## 📁 项目结构

```
fsrs-english-cards/
├── public/                 # 静态资源
│   ├── index.html         # 主页面
│   ├── favicon.ico        # 网站图标
│   └── manifest.json      # PWA配置
├── src/                   # 源代码
│   ├── core/             # 核心算法
│   │   ├── fsrs-scheduler.js
│   │   └── memory-model.js
│   ├── components/       # UI组件
│   │   ├── card.js
│   │   ├── progress.js
│   │   └── stats.js
│   ├── data/            # 数据管理
│   │   ├── words.js
│   │   └── storage.js
│   ├── styles/          # 样式文件
│   │   ├── main.css
│   │   ├── components.css
│   │   └── responsive.css
│   └── app.js           # 主应用逻辑
├── docs/               # 文档
│   ├── deployment.md   # 部署指南
│   ├── development.md  # 开发指南
│   └── quick-deploy.md # 快速部署
├── scripts/            # 构建脚本
│   ├── build.js        # 构建脚本
│   └── deploy.js       # 部署脚本
├── .github/            # GitHub配置
│   └── workflows/      # CI/CD
└── config/             # 配置文件
    ├── development.json
    └── production.json
```

## 🛠️ 开发指南

详细的开发文档请查看 [docs/development.md](docs/development.md)

## 🚀 部署指南

### 快速部署（5分钟）
查看 [docs/quick-deploy.md](docs/quick-deploy.md)

### 完整部署指南
查看 [docs/deployment.md](docs/deployment.md)

支持的部署方式：
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting
- 传统服务器（Apache/Nginx）
- Docker容器
- Kubernetes集群

## 📊 技术栈

- **前端**: 原生JavaScript (ES6+)
- **算法**: FSRS4Anki间隔重复算法
- **样式**: CSS3 + 响应式设计
- **构建**: Node.js + 自定义构建脚本
- **部署**: 多平台支持

## 🤝 贡献

欢迎提交Issue和Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [FSRS算法](https://github.com/open-spaced-repetition/fsrs4anki) - 核心学习算法
- [FSRS4Anki](https://github.com/open-spaced-repetition/fsrs4anki) - 算法实现参考

## 📞 联系方式

- 项目链接: [https://github.com/Polyhedronx/fsrs-english-cards](https://github.com/Polyhedronx/fsrs-english-cards)
- 问题反馈: [Issues](https://github.com/Polyhedronx/fsrs-english-cards/issues)
- 讨论交流: [Discussions](https://github.com/Polyhedronx/fsrs-english-cards/discussions) 
