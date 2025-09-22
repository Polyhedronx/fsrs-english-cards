/**
 * 卡片组件
 * 处理学习卡片的显示和交互逻辑
 * 
 * @fileoverview 卡片组件的实现
 * @author FSRS Team
 * @version 1.0.0
 */

/**
 * 卡片组件类
 */
class CardComponent {
    /**
     * 创建卡片组件实例
     */
    constructor() {
        this.currentCard = null;
        this.isFlipped = false;
    }
    
    /**
     * 显示卡片
     * @param {Object} card - 卡片数据
     */
    showCard(card) {
        this.currentCard = card;
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
     * 获取当前卡片
     * @returns {Object} 当前卡片数据
     */
    getCurrentCard() {
        return this.currentCard;
    }
    
    /**
     * 检查卡片是否已翻转
     * @returns {boolean} 是否已翻转
     */
    isCardFlipped() {
        return this.isFlipped;
    }
}

// 导出组件
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CardComponent;
}
