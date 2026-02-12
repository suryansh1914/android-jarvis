import * as SMS from 'expo-sms';

export class SMSService {
    /**
     * Check if SMS is available on device
     */
    static async isAvailable(): Promise<boolean> {
        return await SMS.isAvailableAsync();
    }

    /**
     * Send SMS to phone number
     */
    static async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
        try {
            const isAvailable = await this.isAvailable();
            if (!isAvailable) {
                console.error('SMS not available on this device');
                return false;
            }

            const { result } = await SMS.sendSMSAsync(
                [phoneNumber],
                message
            );

            return result === 'sent';
        } catch (error) {
            console.error('SMS send error:', error);
            return false;
        }
    }

    /**
     * Send SMS to multiple recipients
     */
    static async sendBulkSMS(phoneNumbers: string[], message: string): Promise<boolean> {
        try {
            const isAvailable = await this.isAvailable();
            if (!isAvailable) {
                console.error('SMS not available on this device');
                return false;
            }

            const { result } = await SMS.sendSMSAsync(
                phoneNumbers,
                message
            );

            return result === 'sent';
        } catch (error) {
            console.error('Bulk SMS send error:', error);
            return false;
        }
    }
}
