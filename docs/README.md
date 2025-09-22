# FSRS英语学习卡片 - 文档中心

## 📚 文档目录

### 🚀 部署相关
- **[完整部署指南](./deployment.md)** - 详细的部署教程，包含所有部署方式
- **[快速部署指南](./quick-deploy.md)** - 5分钟快速部署教程

### 🛠️ 开发相关
- **[开发指南](./development.md)** - 项目开发环境搭建和开发流程

## 🎯 快速开始

### 新手推荐流程

1. **阅读快速部署指南** - [quick-deploy.md](./quick-deploy.md)
2. **选择部署方式** - GitHub Pages（最简单）
3. **按照步骤操作** - 5分钟完成部署
4. **遇到问题** - 查看完整部署指南的故障排除部分

### 高级用户

1. **阅读完整部署指南** - [deployment.md](./deployment.md)
2. **选择适合的部署方式** - 根据需求选择最佳方案
3. **配置性能优化** - CDN、缓存、安全配置
4. **设置监控分析** - 性能监控、用户分析

## 🛠️ 部署工具

项目提供了便捷的部署工具：

```bash
# 检查部署环境
npm run check

# 构建项目
npm run build

# 预览构建结果
npm run preview

# 部署到 GitHub Pages
npm run deploy:github

# 部署到 Netlify
npm run deploy:netlify

# 部署到 Vercel
npm run deploy:vercel

# 部署到 Firebase
npm run deploy:firebase

# 使用部署工具
npm run deploy github
npm run deploy netlify
npm run deploy vercel
```

## 📋 部署检查清单

### 部署前
- [ ] 项目构建成功
- [ ] 本地测试通过
- [ ] 环境配置正确
- [ ] 依赖工具已安装

### 部署后
- [ ] 网站可正常访问
- [ ] 所有功能正常工作
- [ ] 性能表现良好
- [ ] 安全配置完成
- [ ] 监控工具配置完成

## 🔧 常见问题

### 构建问题
- **构建失败**: 检查Node.js版本，清理缓存重新安装依赖
- **文件缺失**: 确保所有源文件完整，重新克隆项目

### 部署问题
- **页面空白**: 检查文件路径，确保资源正确引用
- **样式丢失**: 检查CSS文件，清除浏览器缓存
- **功能异常**: 检查JavaScript控制台错误

### 性能问题
- **加载缓慢**: 配置CDN，启用压缩，优化资源
- **缓存问题**: 配置正确的缓存策略

## 📞 获取帮助

- 📖 **详细文档**: [deployment.md](./deployment.md)
- 🚀 **快速指南**: [quick-deploy.md](./quick-deploy.md)
- 🐛 **问题反馈**: [GitHub Issues](https://github.com/username/fsrs-english-cards/issues)
- 💬 **讨论交流**: [GitHub Discussions](https://github.com/username/fsrs-english-cards/discussions)

## 🎉 部署成功

恭喜你成功部署了FSRS英语学习卡片应用！

- 🌟 **功能完整**: 基于FSRS算法的智能学习系统
- 📱 **响应式设计**: 支持各种设备访问
- 🚀 **性能优化**: 快速加载，流畅体验
- 🔒 **安全可靠**: HTTPS部署，数据保护
- 📊 **数据持久**: 本地存储，学习进度保存

开始你的英语学习之旅吧！🎓
