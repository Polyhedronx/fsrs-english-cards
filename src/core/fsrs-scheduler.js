/**
 * FSRS4Anki 调度器实现
 * 基于FSRS算法的间隔重复学习调度器
 * 
 * @fileoverview FSRS算法的核心实现，包含所有调度逻辑
 * @author FSRS Team
 * @version 1.0.0
 */

class FSRS4AnkiScheduler {
    /**
     * 创建FSRS调度器实例
     * @param {Object} config - 配置选项
     * @param {Array} config.params - FSRS算法参数数组
     * @param {number} config.requestRetention - 期望保持率
     * @param {number} config.maximumInterval - 最大间隔天数
     * @param {boolean} config.enableFuzz - 是否启用模糊因子
     */
    constructor(config = {}) {
        // 默认参数
        this.params = config.params || [
            0.212, 1.2931, 2.3065, 8.2956, 6.4133, 0.8334, 3.0194, 0.001, 1.8722,
            0.1666, 0.796, 1.4835, 0.0614, 0.2629, 1.6483, 0.6014, 1.8729,
            0.5425, 0.0912, 0.0658, 0.1542
        ];
        
        this.requestRetention = config.requestRetention || 0.9;
        this.maximumInterval = config.maximumInterval || 36500;
        this.enableFuzz = config.enableFuzz !== false;
        
        // 计算常量
        this.DECAY = -this.params[20];
        this.FACTOR = Math.pow(0.9, 1 / this.DECAY) - 1;
        
        // 评分映射
        this.ratings = {
            'again': 1,
            'hard': 2,
            'good': 3,
            'easy': 4
        };
    }
    
    /**
     * 计算遗忘曲线
     * @param {number} elapsedDays - 经过的天数
     * @param {number} stability - 记忆稳定性
     * @returns {number} 记忆保持概率
     */
    forgettingCurve(elapsedDays, stability) {
        return Math.pow(1 + this.FACTOR * elapsedDays / stability, this.DECAY);
    }
    
    /**
     * 计算下次复习间隔
     * @param {number} stability - 记忆稳定性
     * @returns {number} 复习间隔天数
     */
    nextInterval(stability) {
        const newInterval = this.applyFuzz(
            stability / this.FACTOR * (Math.pow(this.requestRetention, 1 / this.DECAY) - 1)
        );
        return Math.min(Math.max(Math.round(newInterval), 1), this.maximumInterval);
    }
    
    /**
     * 应用模糊因子
     * @param {number} interval - 原始间隔
     * @returns {number} 应用模糊因子后的间隔
     */
    applyFuzz(interval) {
        if (!this.enableFuzz || interval < 2.5) return interval;
        
        interval = Math.round(interval);
        const minInterval = Math.max(2, Math.round(interval * 0.95 - 1));
        const maxInterval = Math.round(interval * 1.05 + 1);
        
        // 使用简单的随机数生成器
        const random = Math.random();
        return Math.floor(random * (maxInterval - minInterval + 1) + minInterval);
    }
    
    /**
     * 更新难度
     * @param {number} difficulty - 当前难度
     * @param {string} rating - 评分等级
     * @returns {number} 新的难度值
     */
    nextDifficulty(difficulty, rating) {
        const deltaD = -this.params[6] * (this.ratings[rating] - 3);
        const nextD = difficulty + this.linearDamping(deltaD, difficulty);
        return this.constrainDifficulty(this.meanReversion(this.initDifficulty('easy'), nextD));
    }
    
    /**
     * 线性阻尼
     * @param {number} deltaD - 难度变化量
     * @param {number} oldD - 旧难度值
     * @returns {number} 阻尼后的变化量
     */
    linearDamping(deltaD, oldD) {
        return deltaD * (10 - oldD) / 9;
    }
    
    /**
     * 均值回归
     * @param {number} init - 初始值
     * @param {number} current - 当前值
     * @returns {number} 回归后的值
     */
    meanReversion(init, current) {
        return this.params[7] * init + (1 - this.params[7]) * current;
    }
    
    /**
     * 约束难度范围
     * @param {number} difficulty - 难度值
     * @returns {number} 约束后的难度值
     */
    constrainDifficulty(difficulty) {
        return Math.min(Math.max(Number(difficulty.toFixed(2)), 1), 10);
    }
    
    /**
     * 初始化难度
     * @param {string} rating - 评分等级
     * @returns {number} 初始难度值
     */
    initDifficulty(rating) {
        return Number(this.constrainDifficulty(
            this.params[4] - Math.exp(this.params[5] * (this.ratings[rating] - 1)) + 1
        ).toFixed(2));
    }
    
    /**
     * 成功回忆后的稳定性更新
     * @param {number} difficulty - 难度
     * @param {number} stability - 稳定性
     * @param {number} retrievability - 可检索性
     * @param {string} rating - 评分等级
     * @returns {number} 新的稳定性值
     */
    nextRecallStability(difficulty, stability, retrievability, rating) {
        const hardPenalty = rating === 'hard' ? this.params[15] : 1;
        const easyBonus = rating === 'easy' ? this.params[16] : 1;
        
        return Number((stability * (1 + Math.exp(this.params[8]) *
            (11 - difficulty) *
            Math.pow(stability, -this.params[9]) *
            (Math.exp((1 - retrievability) * this.params[10]) - 1) *
            hardPenalty *
            easyBonus)).toFixed(2));
    }
    
    /**
     * 遗忘后的稳定性更新
     * @param {number} difficulty - 难度
     * @param {number} stability - 稳定性
     * @param {number} retrievability - 可检索性
     * @returns {number} 新的稳定性值
     */
    nextForgetStability(difficulty, stability, retrievability) {
        const sMin = stability / Math.exp(this.params[17] * this.params[18]);
        return Number(Math.min(
            this.params[11] *
            Math.pow(difficulty, -this.params[12]) *
            (Math.pow(stability + 1, this.params[13]) - 1) *
            Math.exp((1 - retrievability) * this.params[14]),
            sMin
        ).toFixed(2));
    }
    
    /**
     * 短期稳定性更新（学习阶段）
     * @param {number} stability - 稳定性
     * @param {string} rating - 评分等级
     * @returns {number} 新的稳定性值
     */
    nextShortTermStability(stability, rating) {
        let sinc = Math.exp(this.params[17] * (this.ratings[rating] - 3 + this.params[18])) * 
                   Math.pow(stability, -this.params[19]);
        if (this.ratings[rating] >= 3) {
            sinc = Math.max(sinc, 1);
        }
        return Number((stability * sinc).toFixed(2));
    }
    
    /**
     * 初始化状态
     * @returns {Object} 包含所有评分等级的初始状态
     */
    initStates() {
        return {
            again: {
                difficulty: this.initDifficulty('again'),
                stability: this.initStability('again')
            },
            hard: {
                difficulty: this.initDifficulty('hard'),
                stability: this.initStability('hard')
            },
            good: {
                difficulty: this.initDifficulty('good'),
                stability: this.initStability('good')
            },
            easy: {
                difficulty: this.initDifficulty('easy'),
                stability: this.initStability('easy')
            }
        };
    }
    
    /**
     * 初始化稳定性
     * @param {string} rating - 评分等级
     * @returns {number} 初始稳定性值
     */
    initStability(rating) {
        return Number(Math.max(this.params[this.ratings[rating] - 1], 0.1).toFixed(2));
    }
    
    /**
     * 处理单词复习
     * @param {Object} wordState - 单词学习状态
     * @param {string} rating - 评分等级
     * @param {number} elapsedDays - 经过的天数
     * @returns {Object} 更新后的学习状态
     */
    processReview(wordState, rating, elapsedDays = null) {
        if (!wordState.difficulty || !wordState.stability) {
            // 新单词，初始化状态
            const states = this.initStates();
            wordState = states[rating];
        }
        
        const actualElapsedDays = elapsedDays || this.getElapsedDays(wordState.lastReview);
        const retrievability = this.forgettingCurve(actualElapsedDays, wordState.stability);
        
        let newDifficulty, newStability;
        
        if (rating === 'again') {
            newDifficulty = this.nextDifficulty(wordState.difficulty, rating);
            newStability = this.nextForgetStability(wordState.difficulty, wordState.stability, retrievability);
        } else {
            newDifficulty = this.nextDifficulty(wordState.difficulty, rating);
            newStability = this.nextRecallStability(wordState.difficulty, wordState.stability, retrievability, rating);
        }
        
        const nextInterval = this.nextInterval(newStability);
        const nextReviewDate = new Date(Date.now() + nextInterval * 24 * 60 * 60 * 1000);
        
        return {
            difficulty: newDifficulty,
            stability: newStability,
            retrievability: retrievability,
            nextReviewDate: nextReviewDate,
            interval: nextInterval,
            lastReview: new Date()
        };
    }
    
    /**
     * 计算经过的天数
     * @param {Date|string} lastReviewDate - 上次复习日期
     * @returns {number} 经过的天数
     */
    getElapsedDays(lastReviewDate) {
        if (!lastReviewDate) return 0;
        const now = new Date();
        const lastReview = new Date(lastReviewDate);
        return Math.max(0, (now - lastReview) / (1000 * 60 * 60 * 24));
    }
    
    /**
     * 检查单词是否到期复习
     * @param {Object} wordState - 单词学习状态
     * @returns {boolean} 是否到期
     */
    isDue(wordState) {
        if (!wordState.nextReviewDate) return true;
        return new Date() >= new Date(wordState.nextReviewDate);
    }
    
    /**
     * 获取单词的复习优先级
     * @param {Object} wordState - 单词学习状态
     * @returns {number} 优先级数值
     */
    getReviewPriority(wordState) {
        if (!wordState.nextReviewDate) return 1;
        const daysOverdue = this.getElapsedDays(wordState.nextReviewDate);
        return Math.max(1, daysOverdue + 1);
    }
}

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FSRS4AnkiScheduler;
}
