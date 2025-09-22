# 开发指南

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

## 开发环境设置

### 1. 本地开发服务器

推荐使用 Live Server 或类似工具：

```bash
# 使用 Python 简单服务器
python -m http.server 8000

# 使用 Node.js serve
npx serve .

# 使用 PHP 内置服务器
php -S localhost:8000
```

### 2. 代码编辑器配置

推荐使用 VS Code 并安装以下扩展：
- Live Server
- Prettier
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer

### 3. 浏览器开发工具

- Chrome DevTools
- Firefox Developer Tools
- Safari Web Inspector

## 开发规范

### 1. 代码风格

- 使用 2 个空格缩进
- 使用单引号
- 行末不加分号（可选）
- 使用 const/let 而不是 var

### 2. 命名规范

- 文件名：kebab-case (如：memory-model.js)
- 类名：PascalCase (如：MemoryManager)
- 函数名：camelCase (如：processReview)
- 常量：UPPER_SNAKE_CASE (如：MAX_INTERVAL)

### 3. 注释规范

```javascript
/**
 * 处理单词复习
 * @param {Object} wordState - 单词学习状态
 * @param {string} rating - 评分等级
 * @param {number} elapsedDays - 经过的天数
 * @returns {Object} 更新后的学习状态
 */
function processReview(wordState, rating, elapsedDays = null) {
    // 实现逻辑
}
```

## 核心模块说明

### 1. FSRS调度器 (fsrs-scheduler.js)

负责FSRS算法的核心实现：
- 遗忘曲线计算
- 间隔时间计算
- 难度和稳定性更新
- 复习优先级排序

### 2. 记忆模型 (memory-model.js)

管理记忆状态：
- 记忆状态数据结构
- 状态查询和更新
- 统计信息计算

### 3. 主应用 (app.js)

应用的主要业务逻辑：
- 用户交互处理
- 学习流程控制
- 数据持久化
- 界面状态管理

## 扩展开发

### 1. 添加新功能

1. 在相应目录创建新文件
2. 实现功能逻辑
3. 在 index.html 中引入
4. 更新文档

### 2. 自定义样式

1. 修改 CSS 变量定义
2. 添加新的组件样式
3. 更新响应式断点

### 3. 数据扩展

1. 修改单词数据结构
2. 更新存储逻辑
3. 调整界面显示

## 调试技巧

### 1. 控制台调试

```javascript
// 启用调试模式
localStorage.setItem('fsrs_debug', 'true');

// 查看当前状态
console.log(app.memoryManager.getAllStates());
```

### 2. 性能监控

```javascript
// 测量函数执行时间
console.time('processReview');
app.rateCard('good');
console.timeEnd('processReview');
```

### 3. 数据检查

```javascript
// 检查本地存储
console.log(localStorage.getItem('fsrs_words'));
console.log(localStorage.getItem('fsrs_memory_states'));
```

## 测试

### 1. 单元测试

```javascript
// 测试FSRS算法
const scheduler = new FSRS4AnkiScheduler();
const result = scheduler.processReview({}, 'good');
console.assert(result.interval > 0, 'Interval should be positive');
```

### 2. 集成测试

```javascript
// 测试完整学习流程
app.startLearning();
app.flipCard();
app.rateCard('good');
console.assert(app.currentCardIndex === 1, 'Should move to next card');
```

## 部署准备

### 1. 代码优化

- 压缩 CSS 和 JavaScript
- 优化图片资源
- 启用 Gzip 压缩

### 2. 性能优化

- 使用 CDN 加速
- 实现缓存策略
- 优化加载时间

### 3. 兼容性检查

- 测试不同浏览器
- 检查移动端适配
- 验证 PWA 功能

## 常见问题

### 1. 本地存储问题

```javascript
// 检查存储空间
if (localStorage.getItem('fsrs_words') === null) {
    console.warn('Local storage not available');
}
```

### 2. 算法参数调整

```javascript
// 自定义参数
const customParams = [0.1, 1.0, 2.0, /* ... */];
const scheduler = new FSRS4AnkiScheduler({ params: customParams });
```

### 3. 界面适配问题

检查 CSS 媒体查询和响应式断点设置。
