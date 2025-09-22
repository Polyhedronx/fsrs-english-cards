/**
 * 单词数据管理
 * 处理单词数据的加载、保存和管理
 * 
 * @fileoverview 单词数据管理模块
 * @author FSRS Team
 * @version 1.0.0
 */

/**
 * 单词数据管理器类
 */
class WordsManager {
    /**
     * 创建单词数据管理器实例
     */
    constructor() {
        this.words = [];
        this.loadWords();
    }
    
    /**
     * 加载单词数据
     */
    loadWords() {
        const saved = localStorage.getItem('fsrs_words');
        if (saved) {
            this.words = JSON.parse(saved);
        } else {
            this.words = this.getDefaultWords();
            this.saveWords();
        }
    }
    
    /**
     * 保存单词数据
     */
    saveWords() {
        localStorage.setItem('fsrs_words', JSON.stringify(this.words));
    }
    
    /**
     * 获取默认单词库
     * @returns {Array} 默认单词数组
     */
    getDefaultWords() {
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
            },
            {
                id: 11,
                word: "achieve",
                pronunciation: "/əˈtʃiːv/",
                meaning: "实现，达到",
                example: "She achieved her dream.",
                translation: "她实现了她的梦想。"
            },
            {
                id: 12,
                word: "action",
                pronunciation: "/ˈækʃən/",
                meaning: "行动，动作",
                example: "We need to take action now.",
                translation: "我们现在需要采取行动。"
            },
            {
                id: 13,
                word: "active",
                pronunciation: "/ˈæktɪv/",
                meaning: "积极的，活跃的",
                example: "He is very active in sports.",
                translation: "他在体育方面很活跃。"
            },
            {
                id: 14,
                word: "activity",
                pronunciation: "/ækˈtɪvəti/",
                meaning: "活动，行动",
                example: "Physical activity is important.",
                translation: "体育活动很重要。"
            },
            {
                id: 15,
                word: "actual",
                pronunciation: "/ˈæktʃuəl/",
                meaning: "实际的，真实的",
                example: "What is the actual cost?",
                translation: "实际成本是多少？"
            }
        ];
    }
    
    /**
     * 获取所有单词
     * @returns {Array} 单词数组
     */
    getAllWords() {
        return this.words;
    }
    
    /**
     * 根据ID获取单词
     * @param {number} id - 单词ID
     * @returns {Object|null} 单词对象
     */
    getWordById(id) {
        return this.words.find(word => word.id === id) || null;
    }
    
    /**
     * 添加新单词
     * @param {Object} word - 单词对象
     */
    addWord(word) {
        const newId = Math.max(...this.words.map(w => w.id), 0) + 1;
        const newWord = { ...word, id: newId };
        this.words.push(newWord);
        this.saveWords();
        return newWord;
    }
    
    /**
     * 更新单词
     * @param {number} id - 单词ID
     * @param {Object} updates - 更新数据
     */
    updateWord(id, updates) {
        const index = this.words.findIndex(word => word.id === id);
        if (index !== -1) {
            this.words[index] = { ...this.words[index], ...updates };
            this.saveWords();
            return this.words[index];
        }
        return null;
    }
    
    /**
     * 删除单词
     * @param {number} id - 单词ID
     */
    deleteWord(id) {
        const index = this.words.findIndex(word => word.id === id);
        if (index !== -1) {
            this.words.splice(index, 1);
            this.saveWords();
            return true;
        }
        return false;
    }
    
    /**
     * 搜索单词
     * @param {string} query - 搜索查询
     * @returns {Array} 匹配的单词数组
     */
    searchWords(query) {
        const lowerQuery = query.toLowerCase();
        return this.words.filter(word => 
            word.word.toLowerCase().includes(lowerQuery) ||
            word.meaning.includes(query) ||
            word.example.toLowerCase().includes(lowerQuery)
        );
    }
    
    /**
     * 获取单词总数
     * @returns {number} 单词总数
     */
    getWordCount() {
        return this.words.length;
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WordsManager;
}
