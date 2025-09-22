/**
 * 进度组件
 * 处理学习进度的显示和更新
 * 
 * @fileoverview 进度组件的实现
 * @author FSRS Team
 * @version 1.0.0
 */

/**
 * 进度组件类
 */
class ProgressComponent {
    /**
     * 创建进度组件实例
     */
    constructor() {
        this.currentIndex = 0;
        this.totalCount = 0;
    }
    
    /**
     * 设置进度
     * @param {number} current - 当前进度
     * @param {number} total - 总进度
     */
    setProgress(current, total) {
        this.currentIndex = current;
        this.totalCount = total;
        this.updateDisplay();
    }
    
    /**
     * 更新进度显示
     */
    updateDisplay() {
        const progress = (this.currentIndex / this.totalCount) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('currentCard').textContent = this.currentIndex + 1;
        document.getElementById('totalCards').textContent = this.totalCount;
    }
    
    /**
     * 增加进度
     */
    increment() {
        this.currentIndex++;
        this.updateDisplay();
    }
    
    /**
     * 重置进度
     */
    reset() {
        this.currentIndex = 0;
        this.updateDisplay();
    }
    
    /**
     * 获取当前进度
     * @returns {number} 当前进度百分比
     */
    getProgress() {
        return this.totalCount > 0 ? (this.currentIndex / this.totalCount) * 100 : 0;
    }
    
    /**
     * 检查是否完成
     * @returns {boolean} 是否完成
     */
    isComplete() {
        return this.currentIndex >= this.totalCount;
    }
}

// 导出组件
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressComponent;
}
