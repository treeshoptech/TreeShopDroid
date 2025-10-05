// TreeShop Mind Map - Storage Module
// Handles localStorage persistence and data management

class Storage {
    constructor() {
        this.storageKey = 'treeshop_mindmap_data';
        this.settingsKey = 'treeshop_mindmap_settings';
    }

    // Save mind map data
    saveData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    // Load mind map data
    loadData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : this.getDefaultData();
        } catch (error) {
            console.error('Error loading data:', error);
            return this.getDefaultData();
        }
    }

    // Get default data structure
    getDefaultData() {
        return {
            projectName: 'TreeShopDroid Development',
            nodes: [],
            connections: [],
            version: '1.0.0',
            lastModified: new Date().toISOString()
        };
    }

    // Save settings
    saveSettings(settings) {
        try {
            localStorage.setItem(this.settingsKey, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    }

    // Load settings
    loadSettings() {
        try {
            const settings = localStorage.getItem(this.settingsKey);
            return settings ? JSON.parse(settings) : this.getDefaultSettings();
        } catch (error) {
            console.error('Error loading settings:', error);
            return this.getDefaultSettings();
        }
    }

    // Get default settings
    getDefaultSettings() {
        return {
            autoSave: true,
            autoSaveInterval: 30000, // 30 seconds
            theme: 'dark',
            gridSnap: false,
            showGrid: true
        };
    }

    // Export data as JSON file
    exportData() {
        const data = this.loadData();
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `treeshop-mindmap-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Import data from JSON file
    async importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    // Validate data structure
                    if (data.nodes && Array.isArray(data.nodes)) {
                        this.saveData(data);
                        resolve(data);
                    } else {
                        reject(new Error('Invalid data format'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    // Clear all data
    clearData() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            localStorage.removeItem(this.storageKey);
            return true;
        }
        return false;
    }

    // Get statistics
    getStats(data) {
        const nodes = data.nodes || [];
        const total = nodes.length;
        const completed = nodes.filter(n => n.status === 'completed').length;
        const inProgress = nodes.filter(n => n.status === 'in_progress').length;
        const pending = nodes.filter(n => n.status === 'pending').length;
        const blocked = nodes.filter(n => n.status === 'blocked').length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            total,
            completed,
            inProgress,
            pending,
            blocked,
            progress
        };
    }
}

// Export singleton instance
const storage = new Storage();
