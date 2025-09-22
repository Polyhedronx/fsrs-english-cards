/**
 * 记忆模型实现
 * 定义记忆状态的数据结构和相关操作
 * 
 * @fileoverview 记忆模型的核心实现，包含记忆状态管理
 * @author FSRS Team
 * @version 1.0.0
 */

/**
 * 记忆状态类
 * 表示单个单词的记忆状态
 */
class MemoryState {
    /**
     * 创建记忆状态实例
     * @param {Object} data - 记忆状态数据
     * @param {number} data.difficulty - 记忆难度 (1-10)
     * @param {number} data.stability - 记忆稳定性
     * @param {number} data.retrievability - 可检索性
     * @param {Date} data.lastReview - 上次复习时间
     * @param {Date} data.nextReviewDate - 下次复习时间
     * @param {number} data.interval - 复习间隔
     * @param {number} data.repetitions - 重复次数
     * @param {number} data.lapses - 遗忘次数
     */
    constructor(data = {}) {
        this.difficulty = data.difficulty || 5.0;
        this.stability = data.stability || 1.0;
        this.retrievability = data.retrievability || 1.0;
        this.lastReview = data.lastReview || null;
        this.nextReviewDate = data.nextReviewDate || null;
        this.interval = data.interval || 1;
        this.repetitions = data.repetitions || 0;
        this.lapses = data.lapses || 0;
    }
    
    /**
     * 检查是否为新单词
     * @returns {boolean} 是否为新单词
     */
    isNew() {
        return this.repetitions === 0;
    }
    
    /**
     * 检查是否已掌握
     * @param {number} threshold - 掌握阈值（默认30天）
     * @returns {boolean} 是否已掌握
     */
    isMastered(threshold = 30) {
        return this.interval >= threshold;
    }
    
    /**
     * 检查是否在学习阶段
     * @returns {boolean} 是否在学习阶段
     */
    isLearning() {
        return this.repetitions > 0 && this.interval < 30;
    }
    
    /**
     * 获取记忆强度等级
     * @returns {string} 记忆强度等级
     */
    getMemoryStrength() {
        if (this.isNew()) return 'new';
        if (this.isLearning()) return 'learning';
        if (this.isMastered()) return 'mastered';
        return 'review';
    }
    
    /**
     * 更新记忆状态
     * @param {Object} newData - 新的状态数据
     */
    update(newData) {
        Object.assign(this, newData);
    }
    
    /**
     * 序列化为JSON
     * @returns {Object} JSON对象
     */
    toJSON() {
        return {
            difficulty: this.difficulty,
            stability: this.stability,
            retrievability: this.retrievability,
            lastReview: this.lastReview,
            nextReviewDate: this.nextReviewDate,
            interval: this.interval,
            repetitions: this.repetitions,
            lapses: this.lapses
        };
    }
    
    /**
     * 从JSON创建实例
     * @param {Object} json - JSON对象
     * @returns {MemoryState} 记忆状态实例
     */
    static fromJSON(json) {
        return new MemoryState(json);
    }
}

/**
 * 记忆管理器类
 * 管理所有单词的记忆状态
 */
class MemoryManager {
    /**
     * 创建记忆管理器实例
     */
    constructor() {
        this.states = new Map();
    }
    
    /**
     * 获取单词的记忆状态
     * @param {string|number} wordId - 单词ID
     * @returns {MemoryState|null} 记忆状态
     */
    getState(wordId) {
        return this.states.get(wordId) || null;
    }
    
    /**
     * 设置单词的记忆状态
     * @param {string|number} wordId - 单词ID
     * @param {MemoryState} state - 记忆状态
     */
    setState(wordId, state) {
        this.states.set(wordId, state);
    }
    
    /**
     * 更新单词的记忆状态
     * @param {string|number} wordId - 单词ID
     * @param {Object} newData - 新的状态数据
     */
    updateState(wordId, newData) {
        const state = this.getState(wordId);
        if (state) {
            state.update(newData);
        } else {
            this.setState(wordId, new MemoryState(newData));
        }
    }
    
    /**
     * 删除单词的记忆状态
     * @param {string|number} wordId - 单词ID
     */
    removeState(wordId) {
        this.states.delete(wordId);
    }
    
    /**
     * 获取所有记忆状态
     * @returns {Map} 所有记忆状态
     */
    getAllStates() {
        return this.states;
    }
    
    /**
     * 获取新单词列表
     * @returns {Array} 新单词ID列表
     */
    getNewWords() {
        const newWords = [];
        for (const [wordId, state] of this.states) {
            if (state.isNew()) {
                newWords.push(wordId);
            }
        }
        return newWords;
    }
    
    /**
     * 获取学习中的单词列表
     * @returns {Array} 学习中单词ID列表
     */
    getLearningWords() {
        const learningWords = [];
        for (const [wordId, state] of this.states) {
            if (state.isLearning()) {
                learningWords.push(wordId);
            }
        }
        return learningWords;
    }
    
    /**
     * 获取已掌握的单词列表
     * @returns {Array} 已掌握单词ID列表
     */
    getMasteredWords() {
        const masteredWords = [];
        for (const [wordId, state] of this.states) {
            if (state.isMastered()) {
                masteredWords.push(wordId);
            }
        }
        return masteredWords;
    }
    
    /**
     * 获取需要复习的单词列表
     * @returns {Array} 需要复习的单词ID列表
     */
    getDueWords() {
        const dueWords = [];
        const now = new Date();
        
        for (const [wordId, state] of this.states) {
            if (!state.nextReviewDate || new Date(state.nextReviewDate) <= now) {
                dueWords.push(wordId);
            }
        }
        
        return dueWords;
    }
    
    /**
     * 获取记忆统计信息
     * @returns {Object} 统计信息
     */
    getStatistics() {
        const stats = {
            total: this.states.size,
            new: 0,
            learning: 0,
            mastered: 0,
            due: 0
        };
        
        for (const state of this.states.values()) {
            if (state.isNew()) stats.new++;
            else if (state.isLearning()) stats.learning++;
            else if (state.isMastered()) stats.mastered++;
            
            if (!state.nextReviewDate || new Date(state.nextReviewDate) <= new Date()) {
                stats.due++;
            }
        }
        
        return stats;
    }
    
    /**
     * 清空所有记忆状态
     */
    clear() {
        this.states.clear();
    }
    
    /**
     * 序列化为JSON
     * @returns {Object} JSON对象
     */
    toJSON() {
        const json = {};
        for (const [wordId, state] of this.states) {
            json[wordId] = state.toJSON();
        }
        return json;
    }
    
    /**
     * 从JSON创建实例
     * @param {Object} json - JSON对象
     * @returns {MemoryManager} 记忆管理器实例
     */
    static fromJSON(json) {
        const manager = new MemoryManager();
        for (const [wordId, stateData] of Object.entries(json)) {
            manager.setState(wordId, MemoryState.fromJSON(stateData));
        }
        return manager;
    }
}

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MemoryState, MemoryManager };
}
