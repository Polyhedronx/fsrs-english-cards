# FSRS英语学习卡片 - 完整部署指南

## 📋 目录

- [部署前准备](#部署前准备)
- [构建项目](#构建项目)
- [静态网站托管](#静态网站托管)
- [传统Web服务器部署](#传统web服务器部署)
- [容器化部署](#容器化部署)
- [CDN和性能优化](#cdn和性能优化)
- [环境配置](#环境配置)
- [监控和分析](#监控和分析)
- [安全配置](#安全配置)
- [故障排除](#故障排除)

## 🚀 部署前准备

### 系统要求

- **Node.js**: 版本 14.0.0 或更高
- **Python**: 版本 3.6 或更高（用于开发服务器）
- **Git**: 用于版本控制
- **现代浏览器**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

### 项目结构检查

确保项目包含以下关键文件：
```
fsrs-english-cards/
├── src/
│   ├── app.js                 # 主应用逻辑
│   ├── core/                  # 核心算法模块
│   ├── components/            # UI组件
│   ├── data/                  # 数据管理
│   └── styles/                # 样式文件
├── public/
│   ├── index.html            # 主页面
│   └── manifest.json         # PWA配置
├── scripts/
│   └── build.js              # 构建脚本
├── package.json              # 项目配置
└── docs/                     # 文档
```

## 🔨 构建项目

### 1. 安装依赖

```bash
# 克隆项目
git clone https://github.com/username/fsrs-english-cards.git
cd fsrs-english-cards

# 安装依赖
npm install
```

### 2. 构建生产版本

```bash
# 构建项目
npm run build

# 构建完成后，dist/ 目录包含：
# - index.html (压缩后的主页面)
# - styles.min.css (合并压缩的样式)
# - app.min.js (合并压缩的脚本)
# - manifest.json (PWA配置)
# - build-info.json (构建信息)
```

### 3. 验证构建结果

```bash
# 检查构建文件
ls -la dist/

# 启动本地服务器测试
cd dist
python -m http.server 8000
# 访问 http://localhost:8000 验证
```

## 🌐 静态网站托管

### GitHub Pages

#### 方法一：使用 gh-pages 分支

```bash
# 1. 安装 gh-pages
npm install --save-dev gh-pages

# 2. 在 package.json 中添加部署脚本
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}

# 3. 部署到 GitHub Pages
npm run deploy
```

#### 方法二：使用 GitHub Actions

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Netlify

#### 方法一：拖拽部署

1. 访问 [Netlify](https://netlify.com)
2. 将 `dist/` 文件夹拖拽到部署区域
3. 获得临时域名，可自定义域名

#### 方法二：Git 集成

1. 连接 GitHub 仓库
2. 配置构建设置：
   - **构建命令**: `npm run build`
   - **发布目录**: `dist`
   - **Node 版本**: `18`

#### 方法三：Netlify CLI

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 部署
netlify deploy --prod --dir=dist
```

### Vercel

#### 方法一：Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel --prod

# 配置 vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### 方法二：Git 集成

1. 导入 GitHub 仓库到 Vercel
2. 自动检测为静态网站
3. 配置构建设置：
   - **构建命令**: `npm run build`
   - **输出目录**: `dist`

### Firebase Hosting

```bash
# 安装 Firebase CLI
npm install -g firebase-tools

# 登录
firebase login

# 初始化项目
firebase init hosting

# 配置 firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}

# 部署
firebase deploy
```

## 🖥️ 传统Web服务器部署

### Apache 服务器

#### 1. 上传文件

```bash
# 将 dist/ 目录内容上传到服务器
scp -r dist/* user@server:/var/www/html/fsrs-cards/
```

#### 2. 配置 .htaccess

```apache
# .htaccess 配置
RewriteEngine On

# SPA 路由支持
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [QSA,L]

# 启用 Gzip 压缩
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>

# 设置缓存
<IfModule mod_expires.c>
    ExpiresActive on
    
    # 静态资源长期缓存
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/ico "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    
    # HTML 短期缓存
    ExpiresByType text/html "access plus 1 hour"
</IfModule>

# 安全头
<IfModule mod_headers.c>
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

### Nginx 服务器

#### 1. 配置文件

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/fsrs-english-cards;
    index index.html;

    # 日志配置
    access_log /var/log/nginx/fsrs-cards.access.log;
    error_log /var/log/nginx/fsrs-cards.error.log;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        application/xml
        image/svg+xml;

    # 静态资源缓存
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
    }

    # HTML 文件缓存
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data:;" always;

    # 禁止访问敏感文件
    location ~ /\. {
        deny all;
    }
    
    location ~ /(package\.json|\.git|node_modules) {
        deny all;
    }
}

# HTTPS 重定向
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL 配置
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;
    
    # 其他配置与 HTTP 相同
    root /var/www/fsrs-english-cards;
    index index.html;
    
    # ... 其他配置
}
```

#### 2. 部署脚本

```bash
#!/bin/bash
# deploy.sh

# 构建项目
echo "Building project..."
npm run build

# 备份当前版本
echo "Backing up current version..."
sudo cp -r /var/www/fsrs-english-cards /var/www/fsrs-english-cards.backup.$(date +%Y%m%d_%H%M%S)

# 部署新版本
echo "Deploying new version..."
sudo rm -rf /var/www/fsrs-english-cards/*
sudo cp -r dist/* /var/www/fsrs-english-cards/

# 设置权限
sudo chown -R www-data:www-data /var/www/fsrs-english-cards
sudo chmod -R 755 /var/www/fsrs-english-cards

# 重载 Nginx
echo "Reloading Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "Deployment completed!"
```

## 🐳 容器化部署

### Docker 部署

#### 1. 创建 Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建结果
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. Nginx 配置文件

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # 静态资源缓存
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### 3. 构建和运行

```bash
# 构建镜像
docker build -t fsrs-english-cards .

# 运行容器
docker run -d -p 8080:80 --name fsrs-app fsrs-english-cards

# 使用 Docker Compose
# docker-compose.yml
version: '3.8'
services:
  fsrs-app:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

### Kubernetes 部署

#### 1. 创建 Kubernetes 配置

```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fsrs-english-cards
  labels:
    app: fsrs-english-cards
spec:
  replicas: 3
  selector:
    matchLabels:
      app: fsrs-english-cards
  template:
    metadata:
      labels:
        app: fsrs-english-cards
    spec:
      containers:
      - name: fsrs-app
        image: fsrs-english-cards:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "100m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: fsrs-english-cards-service
spec:
  selector:
    app: fsrs-english-cards
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: fsrs-english-cards-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: fsrs-cards.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: fsrs-english-cards-service
            port:
              number: 80
```

#### 2. 部署到 Kubernetes

```bash
# 应用配置
kubectl apply -f k8s-deployment.yaml

# 检查部署状态
kubectl get pods
kubectl get services
kubectl get ingress
```

## 🚀 CDN和性能优化

### Cloudflare

#### 1. 配置 Cloudflare

```bash
# 1. 添加域名到 Cloudflare
# 2. 更新 DNS 记录指向 Cloudflare
# 3. 启用以下功能：
#    - Auto Minify (CSS, HTML, JS)
#    - Brotli 压缩
#    - Browser Cache TTL: 1 month
#    - Always Use HTTPS
#    - HTTP/2
#    - HTTP/3 (QUIC)
```

#### 2. 页面规则配置

```
# 静态资源缓存
*.css, *.js, *.png, *.jpg, *.jpeg, *.gif, *.ico, *.svg
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month
- Browser Cache TTL: 1 month

# HTML 文件
*.html
- Cache Level: Bypass
- Browser Cache TTL: 1 hour
```

### 性能优化配置

#### 1. 资源预加载

```html
<!-- 在 index.html 中添加 -->
<link rel="preload" href="styles.min.css" as="style">
<link rel="preload" href="app.min.js" as="script">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

#### 2. Service Worker 缓存

```javascript
// sw.js
const CACHE_NAME = 'fsrs-cards-v1';
const urlsToCache = [
  '/',
  '/styles.min.css',
  '/app.min.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
```

## ⚙️ 环境配置

### 开发环境

```json
// config/development.json
{
  "debug": true,
  "logLevel": "debug",
  "apiUrl": "http://localhost:3000",
  "features": {
    "analytics": false,
    "errorReporting": false,
    "hotReload": true
  },
  "storage": {
    "type": "localStorage",
    "prefix": "fsrs_dev_"
  }
}
```

### 生产环境

```json
// config/production.json
{
  "debug": false,
  "logLevel": "error",
  "apiUrl": "https://api.yourdomain.com",
  "features": {
    "analytics": true,
    "errorReporting": true,
    "hotReload": false
  },
  "storage": {
    "type": "localStorage",
    "prefix": "fsrs_"
  },
  "performance": {
    "enableServiceWorker": true,
    "enablePreload": true,
    "enableCompression": true
  }
}
```

## 📊 监控和分析

### 性能监控

#### 1. Web Vitals 监控

```javascript
// 添加性能监控
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // 发送到分析服务
  if (typeof gtag !== 'undefined') {
    gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

#### 2. 错误监控

```javascript
// 全局错误处理
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  // 发送错误报告
  if (typeof gtag !== 'undefined') {
    gtag('event', 'exception', {
      description: event.error?.message || 'Unknown error',
      fatal: false
    });
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  if (typeof gtag !== 'undefined') {
    gtag('event', 'exception', {
      description: event.reason?.message || 'Unhandled promise rejection',
      fatal: false
    });
  }
});
```

### 用户分析

#### 1. Google Analytics 4

```html
<!-- 在 index.html 中添加 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### 2. 学习事件跟踪

```javascript
// 学习事件跟踪
function trackLearningEvent(eventName, parameters = {}) {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, {
      event_category: 'Learning',
      ...parameters
    });
  }
}

// 使用示例
trackLearningEvent('card_reviewed', {
  rating: 'good',
  word_id: cardId,
  session_id: sessionId
});

trackLearningEvent('session_completed', {
  total_cards: sessionStats.total,
  new_words: sessionStats.new,
  review_words: sessionStats.review
});
```

## 🔒 安全配置

### HTTPS 部署

#### 1. SSL 证书配置

```bash
# 使用 Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 自动续期
sudo crontab -e
# 添加: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### 2. 安全头配置

```nginx
# Nginx 安全头
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' www.googletagmanager.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data:; connect-src 'self' www.google-analytics.com;" always;
```

### 内容安全策略

```html
<!-- 在 index.html 中添加 -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  font-src 'self' fonts.gstatic.com;
  img-src 'self' data:;
  connect-src 'self' www.google-analytics.com;
  frame-ancestors 'self';
  base-uri 'self';
  form-action 'self';
">
```

## 🔧 故障排除

### 常见问题

#### 1. 页面无法加载

**症状**: 浏览器显示空白页面或 404 错误

**可能原因**:
- 文件路径错误
- 服务器配置问题
- 构建失败

**解决方案**:
```bash
# 检查文件是否存在
ls -la dist/

# 检查服务器配置
nginx -t
apache2ctl configtest

# 重新构建
npm run build
```

#### 2. 样式不生效

**症状**: 页面显示但样式丢失

**可能原因**:
- CSS 文件路径错误
- 缓存问题
- 构建配置错误

**解决方案**:
```bash
# 清除浏览器缓存
# 检查 CSS 文件引用
grep -r "styles.min.css" dist/

# 验证 CSS 文件内容
head -20 dist/styles.min.css
```

#### 3. JavaScript 错误

**症状**: 功能不工作，控制台显示错误

**可能原因**:
- 脚本加载失败
- 依赖缺失
- 浏览器兼容性问题

**解决方案**:
```bash
# 检查 JavaScript 文件
ls -la dist/app.min.js

# 验证脚本内容
head -10 dist/app.min.js

# 检查浏览器控制台错误
```

### 调试工具

#### 1. 浏览器开发者工具

- **Network 面板**: 检查资源加载
- **Console 面板**: 查看错误信息
- **Application 面板**: 检查本地存储
- **Performance 面板**: 分析性能问题

#### 2. 性能分析

```bash
# 使用 Lighthouse 进行性能审计
npm install -g lighthouse
lighthouse http://localhost:8000 --output html --output-path ./lighthouse-report.html

# 使用 WebPageTest
# 访问 https://www.webpagetest.org/
```

## 📚 维护和更新

### 版本管理

#### 1. 语义化版本

```json
// package.json
{
  "name": "fsrs-english-cards",
  "version": "1.0.0",
  "description": "基于FSRS算法的英语学习应用",
  "scripts": {
    "version:patch": "npm version patch",
    "version:minor": "npm version minor",
    "version:major": "npm version major"
  }
}
```

#### 2. 更新策略

```bash
# 创建发布分支
git checkout -b release/v1.0.1

# 更新版本号
npm run version:patch

# 构建和测试
npm run build
npm test

# 创建标签
git tag v1.0.1
git push origin v1.0.1
```

### 备份策略

#### 1. 代码备份

```bash
# 自动备份脚本
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/fsrs-cards"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份代码
tar -czf $BACKUP_DIR/code_$DATE.tar.gz /var/www/fsrs-english-cards

# 备份配置
cp /etc/nginx/sites-available/fsrs-cards $BACKUP_DIR/nginx_$DATE.conf

# 清理旧备份（保留30天）
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

#### 2. 数据备份

```javascript
// 用户数据导出
function exportUserData() {
  const data = {
    userStats: localStorage.getItem('fsrs_user_stats'),
    words: localStorage.getItem('fsrs_words'),
    memoryStates: localStorage.getItem('fsrs_memory_states'),
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `fsrs-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
}
```

### 监控和维护

#### 1. 健康检查

```bash
#!/bin/bash
# health-check.sh

URL="https://your-domain.com"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ $RESPONSE -eq 200 ]; then
    echo "✅ Site is healthy"
    exit 0
else
    echo "❌ Site is down (HTTP $RESPONSE)"
    # 发送告警通知
    exit 1
fi
```

#### 2. 自动部署

```yaml
# .github/workflows/auto-deploy.yml
name: Auto Deploy

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to production
      run: |
        # 部署到生产服务器
        rsync -avz --delete dist/ user@server:/var/www/fsrs-english-cards/
        ssh user@server 'sudo systemctl reload nginx'
```

---

## 🎉 总结

本部署指南涵盖了 FSRS 英语学习卡片应用的完整部署流程，包括：

- ✅ **多种部署方式**: 静态托管、传统服务器、容器化部署
- ✅ **性能优化**: CDN配置、缓存策略、资源压缩
- ✅ **安全配置**: HTTPS、安全头、数据保护
- ✅ **监控分析**: 性能监控、错误追踪、用户分析
- ✅ **维护更新**: 版本管理、备份策略、自动化部署

选择适合你需求的部署方式，按照步骤操作即可成功部署应用。如有问题，请参考故障排除部分或查看项目文档。

**祝你部署顺利！** 🚀