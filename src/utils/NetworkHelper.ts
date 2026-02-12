import NetInfo from '@react-native-community/netinfo';

export class NetworkHelper {
    private static isConnected: boolean = true;
    private static connectionType: string = 'unknown';

    /**
     * Initialize network monitoring
     */
    static initialize(): void {
        NetInfo.addEventListener(state => {
            this.isConnected = state.isConnected || false;
            this.connectionType = state.type;
        });
    }

    /**
     * Check if device is online
     */
    static async checkConnection(): Promise<boolean> {
        const state = await NetInfo.fetch();
        this.isConnected = state.isConnected || false;
        this.connectionType = state.type;
        return this.isConnected;
    }

    /**
     * Get connection status
     */
    static getConnectionStatus(): { isConnected: boolean; type: string } {
        return {
            isConnected: this.isConnected,
            type: this.connectionType
        };
    }

    /**
     * Wait for connection
     */
    static async waitForConnection(timeoutMs: number = 5000): Promise<boolean> {
        const startTime = Date.now();

        while (Date.now() - startTime < timeoutMs) {
            if (await this.checkConnection()) {
                return true;
            }
            await this.delay(500);
        }

        return false;
    }

    /**
     * Execute with retry on network failure
     */
    static async executeWithRetry<T>(
        fn: () => Promise<T>,
        maxRetries: number = 3
    ): Promise<T> {
        for (let i = 0; i < maxRetries; i++) {
            try {
                // Check connection before attempting
                if (!await this.checkConnection()) {
                    console.log('No connection, waiting...');
                    const connected = await this.waitForConnection();
                    if (!connected) {
                        throw new Error('No internet connection');
                    }
                }

                return await fn();
            } catch (error) {
                console.error(`Attempt ${i + 1} failed:`, error);

                if (i === maxRetries - 1) {
                    throw error;
                }

                // Wait before retry
                await this.delay(1000 * (i + 1));
            }
        }

        throw new Error('Max retries exceeded');
    }

    /**
     * Get connection quality
     */
    static getConnectionQuality(): 'excellent' | 'good' | 'poor' | 'offline' {
        if (!this.isConnected) return 'offline';

        switch (this.connectionType) {
            case 'wifi':
                return 'excellent';
            case 'cellular':
                return 'good';
            case 'ethernet':
                return 'excellent';
            default:
                return 'poor';
        }
    }

    /**
     * Is WiFi connected
     */
    static isWiFi(): boolean {
        return this.connectionType === 'wifi';
    }

    /**
     * Is mobile data connected
     */
    static isMobileData(): boolean {
        return this.connectionType === 'cellular';
    }

    private static delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
