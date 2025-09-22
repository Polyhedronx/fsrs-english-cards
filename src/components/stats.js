/**
 * 统计组件
 * 处理学习统计的显示和更新
 * 
 * @fileoverview 统计组件的实现
 * @author FSRS Team
 * @version 1.0.0
 */

/**
 * 统计组件类
 */
class StatsComponent {
    /**
     * 创建统计组件实例
     */
    constructor() {
        this.userStats = {
            totalWords: 0,
            masteredWords: 0,
            streak: 0,
            lastStudyDate: null,
            todayCount: 0
        };
        
        this.sessionStats = {
            total: 0,
            new: 0,
            review: 0
        };
    }
    
    /**
     * 更新用户统计
     * @param {Object} stats - 统计数据
     */
    updateUserStats(stats) {
        this.userStats = { ...this.userStats, ...stats };
        this.updateUserStatsDisplay();
    }
    
    /**
     * 更新会话统计
     * @param {Object} stats - 会话统计数据
     */
    updateSessionStats(stats) {
        this.sessionStats = { ...this.sessionStats, ...stats };
        this.updateSessionStatsDisplay();
    }
    
    /**
     * 更新用户统计显示
     */
    updateUserStatsDisplay() {
        document.getElementById('todayCount').textContent = this.userStats.todayCount;
        document.getElementById('masteredCount').textContent = this.userStats.masteredWords;
        document.getElementById('streakCount').textContent = this.userStats.streak;
    }
    
    /**
     * 更新会话统计显示
     */
    updateSessionStatsDisplay() {
        document.getElementById('sessionCount').textContent = this.sessionStats.total;
        document.getElementById('newWordsCount').textContent = this.sessionStats.new;
        document.getElementById('reviewWordsCount').textContent = this.sessionStats.review;
    }
    
    /**
     * 更新侧边栏统计
     * @param {Object} memoryStats - 记忆统计
     * @param {Object} taskStats - 任务统计
     */
    updateSidebarStats(memoryStats, taskStats) {
        document.getElementById('totalWords').textContent = memoryStats.total;
        document.getElementById('learningWords').textContent = memoryStats.learning;
        document.getElementById('masteredWords').textContent = memoryStats.mastered;
        
        document.getElementById('newTaskProgress').textContent = `${taskStats.new}/10`;
        document.getElementById('reviewTaskProgress').textContent = `${taskStats.review}/5`;
    }
    
    /**
     * 增加今日学习计数
     */
    incrementTodayCount() {
        this.userStats.todayCount++;
        this.updateUserStatsDisplay();
    }
    
    /**
     * 增加掌握单词计数
     */
    incrementMasteredCount() {
        this.userStats.masteredWords++;
        this.updateUserStatsDisplay();
    }
    
    /**
     * 获取用户统计
     * @returns {Object} 用户统计数据
     */
    getUserStats() {
        return this.userStats;
    }
    
    /**
     * 获取会话统计
     * @returns {Object} 会话统计数据
     */
    getSessionStats() {
        return this.sessionStats;
    }
}

// 导出组件
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StatsComponent;
}
