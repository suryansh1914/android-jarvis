import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageHelper {
    private static readonly PREFIX = '@jarvis_';

    /**
     * Save data to storage
     */
    static async save<T>(key: string, data: T): Promise<boolean> {
        try {
            await AsyncStorage.setItem(
                `${this.PREFIX}${key}`,
                JSON.stringify(data)
            );
            return true;
        } catch (error) {
            console.error('Storage save error:', error);
            return false;
        }
    }

    /**
     * Load data from storage
     */
    static async load<T>(key: string): Promise<T | null> {
        try {
            const data = await AsyncStorage.getItem(`${this.PREFIX}${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Storage load error:', error);
            return null;
        }
    }

    /**
     * Remove data from storage
     */
    static async remove(key: string): Promise<boolean> {
        try {
            await AsyncStorage.removeItem(`${this.PREFIX}${key}`);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    }

    /**
     * Clear all app data
     */
    static async clearAll(): Promise<boolean> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const appKeys = keys.filter(key => key.startsWith(this.PREFIX));
            await AsyncStorage.multiRemove(appKeys);
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }

    // Specific storage helpers
    static async saveSettings(settings: any): Promise<boolean> {
        return await this.save('settings', settings);
    }

    static async loadSettings(): Promise<any> {
        return await this.load('settings');
    }

    static async saveConversationHistory(history: any[]): Promise<boolean> {
        return await this.save('conversation_history', history);
    }

    static async loadConversationHistory(): Promise<any[]> {
        return (await this.load<any[]>('conversation_history')) || [];
    }

    static async saveHomeAddress(address: string): Promise<boolean> {
        return await this.save('home_address', address);
    }

    static async loadHomeAddress(): Promise<string | null> {
        return await this.load<string>('home_address');
    }
}
