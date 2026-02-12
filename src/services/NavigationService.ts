import * as Location from 'expo-location';
import { Linking } from 'react-native';

export interface LocationCoords {
    latitude: number;
    longitude: number;
}

export class NavigationService {
    /**
     * Request location permission
     */
    static async requestPermission(): Promise<boolean> {
        const { status } = await Location.requestForegroundPermissionsAsync();
        return status === 'granted';
    }

    /**
     * Get current location
     */
    static async getCurrentLocation(): Promise<LocationCoords | null> {
        try {
            const hasPermission = await this.requestPermission();
            if (!hasPermission) {
                console.error('Location permission denied');
                return null;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced
            });

            return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            };
        } catch (error) {
            console.error('Get location error:', error);
            return null;
        }
    }

    /**
     * Navigate to address using Google Maps
     */
    static async navigateToAddress(address: string): Promise<boolean> {
        try {
            const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
            const canOpen = await Linking.canOpenURL(url);

            if (canOpen) {
                await Linking.openURL(url);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Navigation error:', error);
            return false;
        }
    }

    /**
     * Navigate to coordinates
     */
    static async navigateToCoords(latitude: number, longitude: number): Promise<boolean> {
        try {
            const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
            const canOpen = await Linking.canOpenURL(url);

            if (canOpen) {
                await Linking.openURL(url);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Navigation error:', error);
            return false;
        }
    }

    /**
     * Get address from coordinates (reverse geocoding)
     */
    static async getAddressFromCoords(latitude: number, longitude: number): Promise<string | null> {
        try {
            const addresses = await Location.reverseGeocodeAsync({
                latitude,
                longitude
            });

            if (addresses.length > 0) {
                const addr = addresses[0];
                return `${addr.street || ''}, ${addr.city || ''}, ${addr.region || ''}, ${addr.country || ''}`.trim();
            }
            return null;
        } catch (error) {
            console.error('Reverse geocode error:', error);
            return null;
        }
    }

    /**
     * Navigate to home (requires home address to be set)
     */
    static async navigateToHome(homeAddress: string): Promise<boolean> {
        return await this.navigateToAddress(homeAddress);
    }

    /**
     * Calculate distance between two points (in km)
     */
    static calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) *
            Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private static toRad(degrees: number): number {
        return degrees * (Math.PI / 180);
    }
}
