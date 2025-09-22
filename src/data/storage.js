/**
 * 存储管理
 * 处理本地存储的数据管理
 * 
 * @fileoverview 存储管理模块
 * @author FSRS Team
 * @version 1.0.0
 */

/**
 * 存储管理器类
 */
class StorageManager {
    /**
     * 创建存储管理器实例
     */
    constructor() {
        this.storagePrefix = 'fsrs_';
    }
    
    /**
     * 保存数据到本地存储
     * @param {string} key - 存储键
     * @param {*} data - 要存储的数据
     */
    save(key, data) {
        try {
            const fullKey = this.storagePrefix + key;
            localStorage.setItem(fullKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('保存数据失败:', error);
            return false;
        }
    }
    
    /**
     * 从本地存储加载数据
     * @param {string} key - 存储键
     * @param {*} defaultValue - 默认值
     * @returns {*} 加载的数据
     */
    load(key, defaultValue = null) {
        try {
            const fullKey = this.storagePrefix + key;
            const data = localStorage.getItem(fullKey);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('加载数据失败:', error);
            return defaultValue;
        }
    }
    
    /**
     * 删除存储的数据
     * @param {string} key - 存储键
     */
    remove(key) {
        try {
            const fullKey = this.storagePrefix + key;
            localStorage.removeItem(fullKey);
            return true;
        } catch (error) {
            console.error('删除数据失败:', error);
            return false;
        }
    }
    
    /**
     * 清空所有存储数据
     */
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.storagePrefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('清空数据失败:', error);
            return false;
        }
    }
    
    /**
     * 检查存储是否可用
     * @returns {boolean} 存储是否可用
     */
    isAvailable() {
        try {
            const testKey = this.storagePrefix + 'test';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }
    
    /**
     * 获取存储使用情况
     * @returns {Object} 存储使用情况
     */
    getStorageInfo() {
        let used = 0;
        const keys = Object.keys(localStorage);
        
        keys.forEach(key => {
            if (key.startsWith(this.storagePrefix)) {
                used += localStorage.getItem(key).length;
            }
        });
        
        return {
            used: used,
            usedKB: (used / 1024).toFixed(2),
            keys: keys.filter(key => key.startsWith(this.storagePrefix))
        };
    }
    
    /**
     * 导出所有数据
     * @returns {Object} 导出的数据
     */
    exportData() {
        const data = {};
        const keys = Object.keys(localStorage);
        
        keys.forEach(key => {
            if (key.startsWith(this.storagePrefix)) {
                const cleanKey = key.replace(this.storagePrefix, '');
                data[cleanKey] = JSON.parse(localStorage.getItem(key));
            }
        });
        
        return {
            version: '1.0.0',
            exportDate: new Date().toISOString(),
            data: data
        };
    }
    
    /**
     * 导入数据
     * @param {Object} exportData - 导入的数据
     * @returns {boolean} 导入是否成功
     */
    importData(exportData) {
        try {
            if (!exportData.data) {
                throw new Error('无效的导入数据格式');
            }
            
            Object.keys(exportData.data).forEach(key => {
                this.save(key, exportData.data[key]);
            });
            
            return true;
        } catch (error) {
            console.error('导入数据失败:', error);
            return false;
        }
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}
