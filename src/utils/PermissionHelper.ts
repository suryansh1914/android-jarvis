import * as SMS from 'expo-sms';
import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as Brightness from 'expo-brightness';
import { Linking, Alert } from 'react-native';

export class PermissionHelper {
    /**
     * Request all necessary permissions at once
     */
    static async requestAllPermissions(): Promise<{ [key: string]: boolean }> {
        const results: { [key: string]: boolean } = {};

        results.sms = await this.requestSMSPermission();
        results.contacts = await this.requestContactsPermission();
        results.calendar = await this.requestCalendarPermission();
        results.location = await this.requestLocationPermission();
        results.notifications = await this.requestNotificationsPermission();
        results.brightness = await this.requestBrightnessPermission();

        return results;
    }

    /**
     * SMS Permission
     */
    static async requestSMSPermission(): Promise<boolean> {
        try {
            return await SMS.isAvailableAsync();
        } catch (error) {
            console.error('SMS permission error:', error);
            return false;
        }
    }

    /**
     * Contacts Permission
     */
    static async requestContactsPermission(): Promise<boolean> {
        try {
            const { status } = await Contacts.requestPermissionsAsync();
            return status === 'granted';
        } catch (error) {
            console.error('Contacts permission error:', error);
            return false;
        }
    }

    /**
     * Calendar Permission
     */
    static async requestCalendarPermission(): Promise<boolean> {
        try {
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            return status === 'granted';
        } catch (error) {
            console.error('Calendar permission error:', error);
            return false;
        }
    }

    /**
     * Location Permission
     */
    static async requestLocationPermission(): Promise<boolean> {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            return status === 'granted';
        } catch (error) {
            console.error('Location permission error:', error);
            return false;
        }
    }

    /**
     * Notifications Permission
     */
    static async requestNotificationsPermission(): Promise<boolean> {
        try {
            const { status } = await Notifications.requestPermissionsAsync();
            return status === 'granted';
        } catch (error) {
            console.error('Notifications permission error:', error);
            return false;
        }
    }

    /**
     * Brightness Permission
     */
    static async requestBrightnessPermission(): Promise<boolean> {
        try {
            const { status } = await Brightness.requestPermissionsAsync();
            return status === 'granted';
        } catch (error) {
            console.error('Brightness permission error:', error);
            return false;
        }
    }

    /**
     * Show permission explanation dialog
     */
    static showPermissionExplanation(permissionType: string): void {
        const explanations: { [key: string]: { title: string; message: string } } = {
            sms: {
                title: 'SMS Permission',
                message: 'JARVIS ko SMS bhejne ke liye permission chahiye. Isse aap voice command se messages bhej sakte hain.'
            },
            contacts: {
                title: 'Contacts Permission',
                message: 'JARVIS ko contacts access chahiye taaki aap naam se call kar sakein. Example: "Mummy ko call karo"'
            },
            calendar: {
                title: 'Calendar Permission',
                message: 'JARVIS ko calendar access chahiye taaki aap events aur reminders set kar sakein.'
            },
            location: {
                title: 'Location Permission',
                message: 'JARVIS ko location access chahiye navigation aur weather ke liye.'
            },
            notifications: {
                title: 'Notifications Permission',
                message: 'JARVIS ko notifications chahiye alarms, timers aur reminders ke liye.'
            },
            brightness: {
                title: 'Brightness Permission',
                message: 'JARVIS ko screen brightness control karne ke liye permission chahiye.'
            }
        };

        const explanation = explanations[permissionType];
        if (explanation) {
            Alert.alert(
                explanation.title,
                explanation.message,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Settings', onPress: () => Linking.openSettings() }
                ]
            );
        }
    }

    /**
     * Check if permission is granted
     */
    static async checkPermission(permissionType: string): Promise<boolean> {
        switch (permissionType) {
            case 'sms':
                return await this.requestSMSPermission();
            case 'contacts':
                const contactsStatus = await Contacts.getPermissionsAsync();
                return contactsStatus.status === 'granted';
            case 'calendar':
                const calendarStatus = await Calendar.getCalendarPermissionsAsync();
                return calendarStatus.status === 'granted';
            case 'location':
                const locationStatus = await Location.getForegroundPermissionsAsync();
                return locationStatus.status === 'granted';
            case 'notifications':
                const notifStatus = await Notifications.getPermissionsAsync();
                return notifStatus.status === 'granted';
            case 'brightness':
                const brightnessStatus = await Brightness.getPermissionsAsync();
                return brightnessStatus.status === 'granted';
            default:
                return false;
        }
    }

    /**
     * Get all permissions status
     */
    static async getAllPermissionsStatus(): Promise<{ [key: string]: boolean }> {
        return {
            sms: await this.checkPermission('sms'),
            contacts: await this.checkPermission('contacts'),
            calendar: await this.checkPermission('calendar'),
            location: await this.checkPermission('location'),
            notifications: await this.checkPermission('notifications'),
            brightness: await this.checkPermission('brightness'),
        };
    }
}
