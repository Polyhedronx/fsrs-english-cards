#!/usr/bin/env node

/**
 * 部署脚本
 * 支持多种部署方式的自动化部署工具
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const config = {
    platforms: {
        github: {
            name: 'GitHub Pages',
            command: 'npm run deploy',
            requirements: ['gh-pages']
        },
        netlify: {
            name: 'Netlify',
            command: 'netlify deploy --prod --dir=dist',
            requirements: ['netlify-cli']
        },
        vercel: {
            name: 'Vercel',
            command: 'vercel --prod',
            requirements: ['vercel']
        },
        firebase: {
            name: 'Firebase Hosting',
            command: 'firebase deploy',
            requirements: ['firebase-tools']
        }
    }
};

// 工具函数
function log(message, type = 'info') {
    const colors = {
        info: '\x1b[36m',    // 青色
        success: '\x1b[32m', // 绿色
        error: '\x1b[31m',   // 红色
        warning: '\x1b[33m', // 黄色
        reset: '\x1b[0m'
    };
    
    console.log(`${colors[type]}${message}${colors.reset}`);
}

function checkRequirements(platform) {
    const requirements = config.platforms[platform].requirements;
    
    for (const req of requirements) {
        try {
            execSync(`which ${req}`, { stdio: 'ignore' });
            log(`✓ ${req} 已安装`, 'success');
        } catch (error) {
            log(`✗ ${req} 未安装`, 'error');
            log(`请运行: npm install -g ${req}`, 'warning');
            return false;
        }
    }
    return true;
}

function buildProject() {
    log('🔨 开始构建项目...', 'info');
    
    try {
        execSync('npm run build', { stdio: 'inherit' });
        log('✅ 项目构建成功', 'success');
        return true;
    } catch (error) {
        log('❌ 项目构建失败', 'error');
        return false;
    }
}

function deployToPlatform(platform) {
    const platformConfig = config.platforms[platform];
    
    if (!platformConfig) {
        log(`❌ 不支持的部署平台: ${platform}`, 'error');
        return false;
    }
    
    log(`🚀 开始部署到 ${platformConfig.name}...`, 'info');
    
    // 检查依赖
    if (!checkRequirements(platform)) {
        return false;
    }
    
    try {
        execSync(platformConfig.command, { stdio: 'inherit' });
        log(`✅ 成功部署到 ${platformConfig.name}`, 'success');
        return true;
    } catch (error) {
        log(`❌ 部署到 ${platformConfig.name} 失败`, 'error');
        return false;
    }
}

function showHelp() {
    console.log(`
🚀 FSRS英语学习卡片 - 部署工具

用法:
  node scripts/deploy.js <platform> [options]

支持的平台:
  github     - GitHub Pages
  netlify    - Netlify
  vercel     - Vercel
  firebase   - Firebase Hosting

选项:
  --help, -h    显示帮助信息
  --build-only  仅构建项目，不部署
  --check       检查部署环境

示例:
  node scripts/deploy.js github
  node scripts/deploy.js netlify
  node scripts/deploy.js --build-only
  node scripts/deploy.js --check
`);
}

function checkEnvironment() {
    log('🔍 检查部署环境...', 'info');
    
    // 检查 Node.js 版本
    const nodeVersion = process.version;
    log(`Node.js 版本: ${nodeVersion}`, 'info');
    
    // 检查项目文件
    const requiredFiles = ['package.json', 'src/app.js', 'public/index.html'];
    for (const file of requiredFiles) {
        if (fs.existsSync(file)) {
            log(`✓ ${file} 存在`, 'success');
        } else {
            log(`✗ ${file} 不存在`, 'error');
        }
    }
    
    // 检查构建结果
    if (fs.existsSync('dist')) {
        const distFiles = fs.readdirSync('dist');
        log(`构建文件: ${distFiles.join(', ')}`, 'info');
    } else {
        log('⚠️  dist 目录不存在，需要先构建项目', 'warning');
    }
    
    // 检查各平台工具
    for (const [platform, platformConfig] of Object.entries(config.platforms)) {
        log(`\n检查 ${platformConfig.name}:`, 'info');
        checkRequirements(platform);
    }
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        showHelp();
        return;
    }
    
    if (args.includes('--check')) {
        checkEnvironment();
        return;
    }
    
    if (args.includes('--build-only')) {
        buildProject();
        return;
    }
    
    const platform = args[0];
    
    // 构建项目
    if (!buildProject()) {
        process.exit(1);
    }
    
    // 部署到指定平台
    if (!deployToPlatform(platform)) {
        process.exit(1);
    }
    
    log('\n🎉 部署完成！', 'success');
}

// 运行主函数
if (require.main === module) {
    main();
}

module.exports = {
    buildProject,
    deployToPlatform,
    checkEnvironment
};
