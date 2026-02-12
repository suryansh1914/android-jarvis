import { Audio } from 'expo-av';

export class MusicService {
    private static sound: Audio.Sound | null = null;
    private static isPlaying: boolean = false;

    /**
     * Initialize audio mode
     */
    static async initialize(): Promise<void> {
        try {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
                shouldDuckAndroid: true,
            });
        } catch (error) {
            console.error('Audio initialization error:', error);
        }
    }

    /**
     * Play/Resume music
     * Note: This is a basic implementation. For full music control,
     * you'd need to integrate with device's music player or streaming services
     */
    static async play(): Promise<boolean> {
        try {
            if (this.sound) {
                await this.sound.playAsync();
                this.isPlaying = true;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Play error:', error);
            return false;
        }
    }

    /**
     * Pause music
     */
    static async pause(): Promise<boolean> {
        try {
            if (this.sound) {
                await this.sound.pauseAsync();
                this.isPlaying = false;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Pause error:', error);
            return false;
        }
    }

    /**
     * Stop music
     */
    static async stop(): Promise<boolean> {
        try {
            if (this.sound) {
                await this.sound.stopAsync();
                this.isPlaying = false;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Stop error:', error);
            return false;
        }
    }

    /**
     * Set volume (0.0 to 1.0)
     */
    static async setVolume(volume: number): Promise<boolean> {
        try {
            if (this.sound) {
                await this.sound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Set volume error:', error);
            return false;
        }
    }

    /**
     * Get playing status
     */
    static getPlayingStatus(): boolean {
        return this.isPlaying;
    }

    /**
     * Open Spotify
     */
    static async openSpotify(): Promise<boolean> {
        try {
            const { Linking } = require('react-native');
            const url = 'spotify://';
            const canOpen = await Linking.canOpenURL(url);

            if (canOpen) {
                await Linking.openURL(url);
                return true;
            } else {
                // Fallback to web
                await Linking.openURL('https://open.spotify.com');
                return true;
            }
        } catch (error) {
            console.error('Open Spotify error:', error);
            return false;
        }
    }

    /**
     * Open YouTube Music
     */
    static async openYouTubeMusic(): Promise<boolean> {
        try {
            const { Linking } = require('react-native');
            const url = 'https://music.youtube.com';
            await Linking.openURL(url);
            return true;
        } catch (error) {
            console.error('Open YouTube Music error:', error);
            return false;
        }
    }

    /**
     * Cleanup
     */
    static async cleanup(): Promise<void> {
        try {
            if (this.sound) {
                await this.sound.unloadAsync();
                this.sound = null;
                this.isPlaying = false;
            }
        } catch (error) {
            console.error('Cleanup error:', error);
        }
    }
}
