import * as Brightness from 'expo-brightness';
import * as Battery from 'expo-battery';
import * as Device from 'expo-device';
import NetInfo from '@react-native-community/netinfo';

export interface SystemInfo {
    batteryLevel: number;
    batteryState: string;
    brightness: number;
    deviceName: string;
    osVersion: string;
    networkType: string;
    isConnected: boolean;
}

export const SystemService = {
    /**
     * Get battery level (0-100)
     */
    async getBatteryLevel(): Promise<number> {
        try {
            const level = await Battery.getBatteryLevelAsync();
            return Math.round(level * 100);
        } catch (error) {
            console.error('Battery level error:', error);
            return 0;
        }
    },

    /**
     * Get battery state
     */
    async getBatteryState(): Promise<string> {
        try {
            const state = await Battery.getBatteryStateAsync();
            const stateMap: { [key: number]: string } = {
                [Battery.BatteryState.UNKNOWN]: 'unknown',
                [Battery.BatteryState.UNPLUGGED]: 'unplugged',
                [Battery.BatteryState.CHARGING]: 'charging',
                [Battery.BatteryState.FULL]: 'full'
            };
            return stateMap[state] || 'unknown';
        } catch (error) {
            console.error('Battery state error:', error);
            return 'unknown';
        }
    },

    /**
     * Get current brightness (0-1)
     */
    async getBrightness(): Promise<number> {
        try {
            const { status } = await Brightness.requestPermissionsAsync();
            if (status === 'granted') {
                return await Brightness.getBrightnessAsync();
            }
            return 0;
        } catch (error) {
            console.error('Get brightness error:', error);
            return 0;
        }
    },

    /**
     * Set brightness (0-1)
     */
    async setBrightness(level: number): Promise<boolean> {
        try {
            const { status } = await Brightness.requestPermissionsAsync();
            if (status === 'granted') {
                await Brightness.setBrightnessAsync(Math.max(0, Math.min(1, level)));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Set brightness error:', error);
            return false;
        }
    },

    /**
     * Get device information
     */
    getDeviceInfo(): { name: string; osVersion: string } {
        return {
            name: Device.modelName || Device.deviceName || 'Unknown',
            osVersion: Device.osVersion || 'Unknown'
        };
    },

    /**
     * Get network information
     */
    async getNetworkInfo(): Promise<{ type: string; isConnected: boolean }> {
        try {
            const state = await NetInfo.fetch();
            return {
                type: state.type,
                isConnected: state.isConnected || false
            };
        } catch (error) {
            console.error('Network info error:', error);
            return { type: 'unknown', isConnected: false };
        }
    },

    /**
     * Get complete system context for AI
     */
    async getSystemContext(): Promise<string> {
        const batteryLevel = await this.getBatteryLevel();
        const batteryState = await this.getBatteryState();
        const deviceInfo = this.getDeviceInfo();
        const networkInfo = await this.getNetworkInfo();

        return `
System Status:
- Battery: ${batteryLevel}% (${batteryState})
- Device: ${deviceInfo.name} (Android ${deviceInfo.osVersion})
- Network: ${networkInfo.type} (${networkInfo.isConnected ? 'Connected' : 'Disconnected'})
        `.trim();
    }
};
