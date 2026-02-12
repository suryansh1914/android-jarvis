import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export class AlarmService {
    /**
     * Request notification permissions
     */
    static async requestPermission(): Promise<boolean> {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('alarms', {
                name: 'Alarms & Timers',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                sound: 'default',
            });
        }

        const { status } = await Notifications.requestPermissionsAsync();
        return status === 'granted';
    }

    /**
     * Set alarm for specific time
     * @param time - Time in format "HH:MM" (24-hour)
     * @param label - Optional label for alarm
     */
    static async setAlarm(time: string, label: string = 'Alarm'): Promise<string | null> {
        try {
            const hasPermission = await this.requestPermission();
            if (!hasPermission) {
                console.error('Notification permission denied');
                return null;
            }

            // Parse time
            const [hours, minutes] = time.split(':').map(Number);
            if (isNaN(hours) || isNaN(minutes)) {
                console.error('Invalid time format');
                return null;
            }

            // Create date for alarm
            const now = new Date();
            const alarmDate = new Date();
            alarmDate.setHours(hours, minutes, 0, 0);

            // If time has passed today, set for tomorrow
            if (alarmDate <= now) {
                alarmDate.setDate(alarmDate.getDate() + 1);
            }

            const trigger = alarmDate;

            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: '⏰ ' + label,
                    body: `Alarm for ${time}`,
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.MAX,
                },
                trigger,
            });

            return notificationId;
        } catch (error) {
            console.error('Set alarm error:', error);
            return null;
        }
    }

    /**
     * Set timer for duration
     * @param minutes - Duration in minutes
     * @param label - Optional label for timer
     */
    static async setTimer(minutes: number, label: string = 'Timer'): Promise<string | null> {
        try {
            const hasPermission = await this.requestPermission();
            if (!hasPermission) {
                console.error('Notification permission denied');
                return null;
            }

            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: '⏱️ ' + label,
                    body: `${minutes} minute timer completed!`,
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.MAX,
                },
                trigger: {
                    seconds: minutes * 60,
                },
            });

            return notificationId;
        } catch (error) {
            console.error('Set timer error:', error);
            return null;
        }
    }

    /**
     * Set reminder
     * @param message - Reminder message
     * @param time - Time in format "HH:MM"
     */
    static async setReminder(message: string, time: string): Promise<string | null> {
        try {
            const hasPermission = await this.requestPermission();
            if (!hasPermission) {
                console.error('Notification permission denied');
                return null;
            }

            const [hours, minutes] = time.split(':').map(Number);
            if (isNaN(hours) || isNaN(minutes)) {
                console.error('Invalid time format');
                return null;
            }

            const now = new Date();
            const reminderDate = new Date();
            reminderDate.setHours(hours, minutes, 0, 0);

            if (reminderDate <= now) {
                reminderDate.setDate(reminderDate.getDate() + 1);
            }

            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: '🔔 Reminder',
                    body: message,
                    sound: true,
                },
                trigger: reminderDate,
            });

            return notificationId;
        } catch (error) {
            console.error('Set reminder error:', error);
            return null;
        }
    }

    /**
     * Cancel alarm/timer/reminder
     */
    static async cancel(notificationId: string): Promise<boolean> {
        try {
            await Notifications.cancelScheduledNotificationAsync(notificationId);
            return true;
        } catch (error) {
            console.error('Cancel notification error:', error);
            return false;
        }
    }

    /**
     * Cancel all scheduled notifications
     */
    static async cancelAll(): Promise<boolean> {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
            return true;
        } catch (error) {
            console.error('Cancel all notifications error:', error);
            return false;
        }
    }

    /**
     * Get all scheduled notifications
     */
    static async getAllScheduled(): Promise<Notifications.NotificationRequest[]> {
        try {
            return await Notifications.getAllScheduledNotificationsAsync();
        } catch (error) {
            console.error('Get scheduled notifications error:', error);
            return [];
        }
    }
}
