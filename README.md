# FSRS英语学习卡片

基于FSRS算法的智能英语学习网页应用，提供科学的间隔重复学习体验。

## 项目结构

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
│   ├── components/       # 组件
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
├── assets/              # 资源文件
│   ├── images/         # 图片资源
│   ├── fonts/          # 字体文件
│   └── icons/          # 图标文件
├── docs/               # 文档
│   ├── api.md
│   ├── development.md
│   └── deployment.md
├── tests/              # 测试文件
│   ├── unit/
│   └── integration/
├── config/             # 配置文件
│   ├── development.json
│   └── production.json
└── scripts/            # 构建脚本
    ├── build.js
    └── deploy.js
```

## 快速开始

1. 在浏览器中打开 `public/index.html`
2. 开始您的英语学习之旅

## 开发指南

详见 `docs/development.md`

## 部署说明

详见 `docs/deployment.md`

## 许可证

MIT License
"# fsrs-english-cards" 
