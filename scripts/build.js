#!/usr/bin/env node

/**
 * 构建脚本
 * 用于生产环境的资源优化和打包
 */

const fs = require('fs');
const path = require('path');

// 配置
const config = {
    srcDir: 'src',
    publicDir: 'public',
    distDir: 'dist',
    assetsDir: 'assets'
};

// 工具函数
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function copyFile(src, dest) {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${src} -> ${dest}`);
}

function readFile(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

function writeFile(filePath, content) {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content);
    console.log(`Written: ${filePath}`);
}

// CSS 压缩
function minifyCSS(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
        .replace(/\s+/g, ' ') // 压缩空白
        .replace(/;\s*}/g, '}') // 移除分号
        .replace(/,\s+/g, ',') // 压缩逗号
        .replace(/:\s+/g, ':') // 压缩冒号
        .replace(/{\s+/g, '{') // 压缩左括号
        .replace(/;\s+/g, ';') // 压缩分号
        .trim();
}

// JavaScript 压缩
function minifyJS(js) {
    return js
        .replace(/\/\*[\s\S]*?\*\//g, '') // 移除块注释
        .replace(/\/\/.*$/gm, '') // 移除行注释
        .replace(/\s+/g, ' ') // 压缩空白
        .replace(/;\s*}/g, '}') // 移除分号
        .replace(/,\s+/g, ',') // 压缩逗号
        .replace(/:\s+/g, ':') // 压缩冒号
        .replace(/{\s+/g, '{') // 压缩左括号
        .replace(/;\s+/g, ';') // 压缩分号
        .trim();
}

// HTML 压缩
function minifyHTML(html) {
    return html
        .replace(/<!--[\s\S]*?-->/g, '') // 移除注释
        .replace(/\s+/g, ' ') // 压缩空白
        .replace(/>\s+</g, '><') // 压缩标签间空白
        .trim();
}

// 构建过程
function build() {
    console.log('🚀 Starting build process...');
    
    // 清理 dist 目录
    if (fs.existsSync(config.distDir)) {
        fs.rmSync(config.distDir, { recursive: true });
    }
    ensureDir(config.distDir);
    
    // 复制并更新 HTML 文件
    let htmlContent = readFile(path.join(config.publicDir, 'index.html'));
    
    // 更新CSS引用 - 只保留一个合并后的CSS文件
    htmlContent = htmlContent.replace(
        /<link rel="stylesheet" href="\.\.\/src\/styles\/[^"]+">/g,
        ''
    );
    htmlContent = htmlContent.replace(
        /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter[^"]+" rel="stylesheet">/,
        '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="styles.min.css">'
    );
    
    // 更新JavaScript引用 - 只保留一个合并后的JS文件
    htmlContent = htmlContent.replace(
        /<script src="\.\.\/src\/[^"]+"><\/script>/g,
        ''
    );
    htmlContent = htmlContent.replace(
        /<\/body>/,
        '<script src="app.min.js"></script></body>'
    );
    
    const minifiedHTML = minifyHTML(htmlContent);
    writeFile(path.join(config.distDir, 'index.html'), minifiedHTML);
    
    // 合并和压缩 CSS
    const cssFiles = [
        'main.css',
        'components.css',
        'responsive.css'
    ];
    
    let combinedCSS = '';
    cssFiles.forEach(file => {
        const cssPath = path.join(config.srcDir, 'styles', file);
        if (fs.existsSync(cssPath)) {
            combinedCSS += readFile(cssPath) + '\n';
        }
    });
    
    const minifiedCSS = minifyCSS(combinedCSS);
    writeFile(path.join(config.distDir, 'styles.min.css'), minifiedCSS);
    
    // 合并和压缩 JavaScript
    const jsFiles = [
        'core/fsrs-scheduler.js',
        'core/memory-model.js',
        'app.js'
    ];
    
    let combinedJS = '';
    jsFiles.forEach(file => {
        const jsPath = path.join(config.srcDir, file);
        if (fs.existsSync(jsPath)) {
            combinedJS += readFile(jsPath) + '\n';
        }
    });
    
    const minifiedJS = minifyJS(combinedJS);
    writeFile(path.join(config.distDir, 'app.min.js'), minifiedJS);
    
    // 复制资源文件
    if (fs.existsSync(config.assetsDir)) {
        copyFile(
            path.join(config.assetsDir, 'favicon.ico'),
            path.join(config.distDir, 'favicon.ico')
        );
    }
    
    // 复制 manifest.json
    if (fs.existsSync(path.join(config.publicDir, 'manifest.json'))) {
        copyFile(
            path.join(config.publicDir, 'manifest.json'),
            path.join(config.distDir, 'manifest.json')
        );
    }
    
    // 生成构建信息
    const buildInfo = {
        buildTime: new Date().toISOString(),
        version: '1.0.0',
        files: {
            css: 'styles.min.css',
            js: 'app.min.js',
            html: 'index.html'
        }
    };
    
    writeFile(
        path.join(config.distDir, 'build-info.json'),
        JSON.stringify(buildInfo, null, 2)
    );
    
    console.log('✅ Build completed successfully!');
    console.log(`📁 Output directory: ${config.distDir}`);
    
    // 显示文件大小
    const files = fs.readdirSync(config.distDir);
    files.forEach(file => {
        const filePath = path.join(config.distDir, file);
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`📄 ${file}: ${sizeKB} KB`);
    });
}

// 运行构建
if (require.main === module) {
    build();
}

module.exports = { build };
