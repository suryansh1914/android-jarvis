import * as Speech from 'expo-speech';

export class TtsService {
    private static isSpeaking: boolean = false;
    private static queue: Array<{ text: string; callback?: () => void }> = [];

    /**
     * Speak text with enhanced options
     */
    static speak(text: string, onDone?: () => void, options?: {
        language?: string;
        pitch?: number;
        rate?: number;
    }): void {
        const defaultOptions = {
            language: 'hi-IN', // Hindi
            pitch: 1.0,
            rate: 0.9,
            ...options
        };

        // Add to queue
        this.queue.push({ text, callback: onDone });

        // Process queue
        this.processQueue(defaultOptions);
    }

    /**
     * Process speech queue
     */
    private static processQueue(options: any): void {
        if (this.isSpeaking || this.queue.length === 0) {
            return;
        }

        const item = this.queue.shift();
        if (!item) return;

        this.isSpeaking = true;

        Speech.speak(item.text, {
            ...options,
            onDone: () => {
                this.isSpeaking = false;
                if (item.callback) {
                    item.callback();
                }
                // Process next in queue
                this.processQueue(options);
            },
            onStopped: () => {
                this.isSpeaking = false;
                if (item.callback) {
                    item.callback();
                }
            },
            onError: (error) => {
                console.error('TTS Error:', error);
                this.isSpeaking = false;
                if (item.callback) {
                    item.callback();
                }
                // Try next in queue
                this.processQueue(options);
            }
        });
    }

    /**
     * Stop current speech
     */
    static stop(): void {
        Speech.stop();
        this.isSpeaking = false;
        this.queue = [];
    }

    /**
     * Pause speech
     */
    static pause(): void {
        Speech.pause();
    }

    /**
     * Resume speech
     */
    static resume(): void {
        Speech.resume();
    }

    /**
     * Check if speaking
     */
    static getIsSpeaking(): boolean {
        return this.isSpeaking;
    }

    /**
     * Get available voices
     */
    static async getAvailableVoices(): Promise<any[]> {
        try {
            const voices = await Speech.getAvailableVoicesAsync();
            return voices;
        } catch (error) {
            console.error('Get voices error:', error);
            return [];
        }
    }

    /**
     * Set default voice settings
     */
    static setDefaultSettings(settings: {
        language?: string;
        pitch?: number;
        rate?: number;
    }): void {
        // Store in app settings (can be persisted with StorageHelper)
        console.log('Default TTS settings:', settings);
    }
}
