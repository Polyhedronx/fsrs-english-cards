/**
 * 英语学习应用主逻辑
 * 
 * @fileoverview 应用的主要业务逻辑和用户交互处理
 * @author FSRS Team
 * @version 1.0.0
 */

/**
 * 英语学习应用主类
 */
class EnglishLearningApp {
    /**
     * 创建应用实例
     */
    constructor() {
        this.scheduler = new FSRS4AnkiScheduler({
            requestRetention: 0.9,
            maximumInterval: 36500
        });
        
        this.memoryManager = new MemoryManager();
        this.currentDeck = [];
        this.currentCardIndex = 0;
        this.isFlipped = false;
        this.sessionStats = {
            total: 0,
            new: 0,
            review: 0
        };
        
        this.userStats = this.loadUserStats();
        this.words = this.loadWords();
        
        this.init();
    }
    
    /**
     * 初始化应用
     */
    init() {
        this.loadMemoryStates();
        this.updateStats();
        this.updateSidebar();
        this.setupEventListeners();
    }
    
    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    if (document.getElementById('actionButtons').style.display !== 'none') {
                        this.flipCard();
                    }
                    break;
                case '1':
                    if (document.getElementById('ratingButtons').style.display !== 'none') {
                        this.rateCard('again');
                    }
                    break;
                case '2':
                    if (document.getElementById('ratingButtons').style.display !== 'none') {
                        this.rateCard('hard');
                    }
                    break;
                case '3':
                    if (document.getElementById('ratingButtons').style.display !== 'none') {
                        this.rateCard('good');
                    }
                    break;
                case '4':
                    if (document.getElementById('ratingButtons').style.display !== 'none') {
                        this.rateCard('easy');
                    }
                    break;
            }
        });
    }
    
    /**
     * 加载用户统计
     * @returns {Object} 用户统计数据
     */
    loadUserStats() {
        const saved = localStorage.getItem('fsrs_user_stats');
        return saved ? JSON.parse(saved) : {
            totalWords: 0,
            masteredWords: 0,
            streak: 0,
            lastStudyDate: null,
            todayCount: 0
        };
    }
    
    /**
     * 保存用户统计
     */
    saveUserStats() {
        localStorage.setItem('fsrs_user_stats', JSON.stringify(this.userStats));
    }
    
    /**
     * 加载单词数据
     * @returns {Array} 单词数组
     */
    loadWords() {
        const saved = localStorage.getItem('fsrs_words');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // 默认单词库
        return [
            {
                id: 1,
                word: "abandon",
                pronunciation: "/əˈbændən/",
                meaning: "放弃，抛弃",
                example: "He abandoned his car in the snow.",
                translation: "他在雪地里抛弃了他的车。"
            },
            {
                id: 2,
                word: "ability",
                pronunciation: "/əˈbɪləti/",
                meaning: "能力，才能",
                example: "She has the ability to solve complex problems.",
                translation: "她有解决复杂问题的能力。"
            },
            {
                id: 3,
                word: "absolute",
                pronunciation: "/ˈæbsəluːt/",
                meaning: "绝对的，完全的",
                example: "I have absolute confidence in you.",
                translation: "我对你绝对有信心。"
            },
            {
                id: 4,
                word: "accept",
                pronunciation: "/əkˈsept/",
                meaning: "接受，承认",
                example: "I accept your apology.",
                translation: "我接受你的道歉。"
            },
            {
                id: 5,
                word: "access",
                pronunciation: "/ˈækses/",
                meaning: "接近，进入",
                example: "Students have access to the library.",
                translation: "学生可以进入图书馆。"
            },
            {
                id: 6,
                word: "accident",
                pronunciation: "/ˈæksɪdənt/",
                meaning: "事故，意外",
                example: "It was just an accident.",
                translation: "这只是个意外。"
            },
            {
                id: 7,
                word: "accompany",
                pronunciation: "/əˈkʌmpəni/",
                meaning: "陪伴，伴随",
                example: "I will accompany you to the station.",
                translation: "我会陪你去车站。"
            },
            {
                id: 8,
                word: "accomplish",
                pronunciation: "/əˈkʌmplɪʃ/",
                meaning: "完成，实现",
                example: "We accomplished our goal.",
                translation: "我们实现了目标。"
            },
            {
                id: 9,
                word: "account",
                pronunciation: "/əˈkaʊnt/",
                meaning: "账户，解释",
                example: "Please check your bank account.",
                translation: "请检查你的银行账户。"
            },
            {
                id: 10,
                word: "accurate",
                pronunciation: "/ˈækjərət/",
                meaning: "准确的，精确的",
                example: "The measurement is accurate.",
                translation: "测量是准确的。"
            }
        ];
    }
    
    /**
     * 保存单词数据
     */
    saveWords() {
        localStorage.setItem('fsrs_words', JSON.stringify(this.words));
    }
    
    /**
     * 加载记忆状态
     */
    loadMemoryStates() {
        const saved = localStorage.getItem('fsrs_memory_states');
        if (saved) {
            const statesData = JSON.parse(saved);
            this.memoryManager = MemoryManager.fromJSON(statesData);
        }
    }
    
    /**
     * 保存记忆状态
     */
    saveMemoryStates() {
        localStorage.setItem('fsrs_memory_states', JSON.stringify(this.memoryManager.toJSON()));
    }
    
    /**
     * 开始学习
     */
    startLearning() {
        this.prepareDeck();
        this.showLearningScreen();
        this.showCurrentCard();
    }
    
    /**
     * 准备学习卡片
     */
    prepareDeck() {
        const today = new Date().toDateString();
        const isNewDay = this.userStats.lastStudyDate !== today;
        
        if (isNewDay) {
            this.userStats.todayCount = 0;
            this.userStats.lastStudyDate = today;
            this.userStats.streak++;
        }
        
        // 获取需要复习的单词
        const reviewWords = this.words.filter(word => {
            const state = this.memoryManager.getState(word.id);
            if (!state) return false;
            return this.scheduler.isDue(state);
        }).sort((a, b) => {
            const stateA = this.memoryManager.getState(a.id);
            const stateB = this.memoryManager.getState(b.id);
            return this.scheduler.getReviewPriority(stateB) - 
                   this.scheduler.getReviewPriority(stateA);
        });
        
        // 获取新单词
        const newWords = this.words.filter(word => !this.memoryManager.getState(word.id));
        
        // 组合学习卡片
        this.currentDeck = [
            ...reviewWords.slice(0, 5), // 最多5个复习单词
            ...newWords.slice(0, 5)     // 最多5个新单词
        ];
        
        // 洗牌
        this.shuffleDeck();
        
        this.currentCardIndex = 0;
        this.isFlipped = false;
        this.sessionStats = {
            total: this.currentDeck.length,
            new: newWords.slice(0, 5).length,
            review: reviewWords.slice(0, 5).length
        };
        
        this.updateProgress();
    }
    
    /**
     * 洗牌算法
     */
    shuffleDeck() {
        for (let i = this.currentDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.currentDeck[i], this.currentDeck[j]] = [this.currentDeck[j], this.currentDeck[i]];
        }
    }
    
    /**
     * 显示学习界面
     */
    showLearningScreen() {
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('learningScreen').style.display = 'block';
        document.getElementById('completionScreen').style.display = 'none';
    }
    
    /**
     * 显示当前卡片
     */
    showCurrentCard() {
        if (this.currentCardIndex >= this.currentDeck.length) {
            this.showCompletionScreen();
            return;
        }
        
        const card = this.currentDeck[this.currentCardIndex];
        this.isFlipped = false;
        
        // 显示英文面
        document.getElementById('wordText').textContent = card.word;
        document.getElementById('pronunciationText').textContent = card.pronunciation;
        document.getElementById('meaningText').textContent = card.meaning;
        document.getElementById('exampleText').textContent = card.example;
        document.getElementById('translationText').textContent = card.translation;
        
        // 重置卡片状态
        document.getElementById('cardFront').style.display = 'block';
        document.getElementById('cardBack').style.display = 'none';
        document.getElementById('actionButtons').style.display = 'block';
        document.getElementById('ratingButtons').style.display = 'none';
        
        this.updateProgress();
    }
    
    /**
     * 翻转卡片
     */
    flipCard() {
        this.isFlipped = true;
        document.getElementById('cardFront').style.display = 'none';
        document.getElementById('cardBack').style.display = 'block';
        document.getElementById('actionButtons').style.display = 'none';
        document.getElementById('ratingButtons').style.display = 'block';
    }
    
    /**
     * 评分卡片
     * @param {string} rating - 评分等级
     */
    rateCard(rating) {
        const card = this.currentDeck[this.currentCardIndex];
        const currentState = this.memoryManager.getState(card.id);
        
        // 更新学习状态
        const newState = this.scheduler.processReview(currentState, rating);
        this.memoryManager.setState(card.id, new MemoryState(newState));
        
        // 更新统计
        this.userStats.todayCount++;
        if (newState.interval > 30) {
            this.userStats.masteredWords++;
        }
        
        // 保存数据
        this.saveMemoryStates();
        this.saveUserStats();
        
        // 下一张卡片
        this.currentCardIndex++;
        this.showCurrentCard();
    }
    
    /**
     * 更新进度
     */
    updateProgress() {
        const progress = (this.currentCardIndex / this.currentDeck.length) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('currentCard').textContent = this.currentCardIndex + 1;
        document.getElementById('totalCards').textContent = this.currentDeck.length;
    }
    
    /**
     * 显示完成界面
     */
    showCompletionScreen() {
        document.getElementById('learningScreen').style.display = 'none';
        document.getElementById('completionScreen').style.display = 'block';
        
        document.getElementById('sessionCount').textContent = this.sessionStats.total;
        document.getElementById('newWordsCount').textContent = this.sessionStats.new;
        document.getElementById('reviewWordsCount').textContent = this.sessionStats.review;
        
        this.updateStats();
        this.updateSidebar();
    }
    
    /**
     * 开始新的学习会话
     */
    startNewSession() {
        this.startLearning();
    }
    
    /**
     * 更新统计显示
     */
    updateStats() {
        document.getElementById('todayCount').textContent = this.userStats.todayCount;
        document.getElementById('masteredCount').textContent = this.userStats.masteredWords;
        document.getElementById('streakCount').textContent = this.userStats.streak;
    }
    
    /**
     * 更新侧边栏
     */
    updateSidebar() {
        const stats = this.memoryManager.getStatistics();
        
        document.getElementById('totalWords').textContent = stats.total;
        document.getElementById('learningWords').textContent = stats.learning;
        document.getElementById('masteredWords').textContent = stats.mastered;
        
        // 更新今日任务
        const newWords = this.words.filter(w => !this.memoryManager.getState(w.id)).length;
        const reviewWords = this.words.filter(w => {
            const state = this.memoryManager.getState(w.id);
            return state && this.scheduler.isDue(state);
        }).length;
        
        document.getElementById('newTaskProgress').textContent = `${Math.min(newWords, 10)}/10`;
        document.getElementById('reviewTaskProgress').textContent = `${Math.min(reviewWords, 5)}/5`;
    }
}

// 全局变量
let app;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    app = new EnglishLearningApp();
});

// 全局函数
function startLearning() {
    app.startLearning();
}

function flipCard() {
    app.flipCard();
}

function rateCard(rating) {
    app.rateCard(rating);
}

function startNewSession() {
    app.startNewSession();
}
