import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheItem<T> {
    data: T;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
}

export class CacheService {
    private static readonly PREFIX = '@jarvis_cache_';

    /**
     * Set cache with TTL (time to live)
     */
    static async set<T>(key: string, data: T, ttlMinutes: number = 60): Promise<void> {
        try {
            const cacheItem: CacheItem<T> = {
                data,
                timestamp: Date.now(),
                ttl: ttlMinutes * 60 * 1000
            };
            await AsyncStorage.setItem(
                `${this.PREFIX}${key}`,
                JSON.stringify(cacheItem)
            );
        } catch (error) {
            console.error('Cache set error:', error);
        }
    }

    /**
     * Get cached data if not expired
     */
    static async get<T>(key: string): Promise<T | null> {
        try {
            const cached = await AsyncStorage.getItem(`${this.PREFIX}${key}`);
            if (!cached) return null;

            const cacheItem: CacheItem<T> = JSON.parse(cached);
            const now = Date.now();

            // Check if expired
            if (now - cacheItem.timestamp > cacheItem.ttl) {
                await this.remove(key);
                return null;
            }

            return cacheItem.data;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }

    /**
     * Remove specific cache
     */
    static async remove(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(`${this.PREFIX}${key}`);
        } catch (error) {
            console.error('Cache remove error:', error);
        }
    }

    /**
     * Clear all cache
     */
    static async clearAll(): Promise<void> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const cacheKeys = keys.filter(key => key.startsWith(this.PREFIX));
            await AsyncStorage.multiRemove(cacheKeys);
        } catch (error) {
            console.error('Cache clear error:', error);
        }
    }

    /**
     * Get cache size
     */
    static async getCacheSize(): Promise<number> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const cacheKeys = keys.filter(key => key.startsWith(this.PREFIX));
            return cacheKeys.length;
        } catch (error) {
            console.error('Cache size error:', error);
            return 0;
        }
    }
}
