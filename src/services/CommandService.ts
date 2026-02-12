import { Linking, Platform } from 'react-native';
import { SystemService } from './SystemService';
import { SMSService } from './SMSService';
import { ContactService } from './ContactService';
import { AlarmService } from './AlarmService';
import { WeatherService } from './WeatherService';
import { NewsService } from './NewsService';
import { NavigationService } from './NavigationService';
import { MusicService } from './MusicService';
import * as Torch from 'expo-torch';

export const CommandService = {
    async executeCommand(action: string, value: string): Promise<string> {
        console.log(`Executing command: ${action} with value: ${value}`);

        try {
            switch (action) {
                case 'CALL':
                    await this.makeCall(value);
                    return 'Call initiated';

                case 'CONTACT_CALL':
                    return await this.callContact(value);

                case 'OPEN':
                    await this.openApp(value);
                    return `Opening ${value}`;

                case 'TORCH':
                    return await this.toggleTorch(value);

                case 'BRIGHTNESS':
                    return await this.setBrightness(value);

                case 'VOLUME':
                    return await this.setVolume(value);

                case 'SMS':
                    return await this.sendSMS(value);

                case 'ALARM':
                    return await this.setAlarm(value);

                case 'TIMER':
                    return await this.setTimer(value);

                case 'REMINDER':
                    return await this.setReminder(value);

                case 'WEATHER':
                    return await this.getWeather(value);

                case 'NEWS':
                    return await this.getNews(value);

                case 'NAVIGATE':
                    return await this.navigate(value);

                case 'MUSIC_PLAY':
                    await MusicService.play();
                    return 'Music playing';

                case 'MUSIC_PAUSE':
                    await MusicService.pause();
                    return 'Music paused';

                case 'MUSIC_STOP':
                    await MusicService.stop();
                    return 'Music stopped';

                default:
                    console.warn(`Unknown action: ${action}`);
                    return 'Unknown command';
            }
        } catch (error) {
            console.error('Command execution error:', error);
            return 'Command failed';
        }
    },

    async makeCall(phoneNumber: string): Promise<void> {
        let phoneUrl = '';
        if (Platform.OS === 'android') {
            phoneUrl = `tel:${phoneNumber}`;
        } else {
            phoneUrl = `telprompt:${phoneNumber}`;
        }
        await Linking.openURL(phoneUrl).catch(err => console.error('Error making call:', err));
    },

    async callContact(name: string): Promise<string> {
        const contacts = await ContactService.searchByName(name);
        if (contacts.length === 0) {
            return `Sir, ${name} naam ka contact nahi mila`;
        }

        const contact = contacts[0];
        const phone = ContactService.getPrimaryPhone(contact);

        if (!phone) {
            return `Sir, ${contact.name} ka phone number nahi hai`;
        }

        await this.makeCall(phone);
        return `Calling ${contact.name}`;
    },

    async openApp(appName: string): Promise<void> {
        const scheme = appName.toLowerCase().replace(/\s/g, '');

        // Comprehensive app mapping
        const appSchemes: { [key: string]: string } = {
            // Social Media
            'youtube': 'vnd.youtube://',
            'whatsapp': 'whatsapp://',
            'facebook': 'fb://',
            'instagram': 'instagram://',
            'twitter': 'twitter://',
            'telegram': 'tg://',
            'snapchat': 'snapchat://',
            'linkedin': 'linkedin://',

            // Browsers
            'chrome': 'googlechrome://',
            'firefox': 'firefox://',
            'brave': 'brave://',

            // Music & Entertainment
            'spotify': 'spotify://',
            'netflix': 'netflix://',
            'amazonprime': 'primevideo://',
            'hotstar': 'hotstar://',
            'gaana': 'gaana://',
            'jiosaavn': 'jiosaavn://',

            // Shopping
            'amazon': 'com.amazon.mobile.shopping://',
            'flipkart': 'flipkart://',
            'myntra': 'myntra://',
            'meesho': 'meesho://',

            // Payment
            'paytm': 'paytmmp://',
            'phonepe': 'phonepe://',
            'googlepay': 'tez://',
            'bhim': 'bhim://',

            // Food
            'zomato': 'zomato://',
            'swiggy': 'swiggy://',

            // Transport
            'uber': 'uber://',
            'ola': 'ola://',

            // Google Apps
            'gmail': 'googlegmail://',
            'maps': 'comgooglemaps://',
            'drive': 'googledrive://',
            'photos': 'googlephotos://',
            'calendar': 'googlecalendar://',

            // Others
            'settings': 'app-settings://',
            'camera': 'camera://',
            'gallery': 'content://media/internal/images/media',
        };

        const url = appSchemes[scheme] || `${scheme}://`;

        try {
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
                await Linking.openURL(url);
            } else {
                // Fallback to web search
                await Linking.openURL(`https://www.google.com/search?q=${appName}`);
            }
        } catch (error) {
            console.error('Open app error:', error);
        }
    },

    async toggleTorch(state: string): Promise<string> {
        try {
            // expo-torch doesn't have hasTorchAsync, we'll just try to set it
            const shouldTurnOn = state.toUpperCase() === 'ON';

            // expo-torch uses setTorchAsync instead of setTorchModeAsync
            await Torch.setTorchAsync(shouldTurnOn);

            return shouldTurnOn ? 'Torch on kar diya Sir' : 'Torch off kar diya Sir';
        } catch (error) {
            console.error('Torch error:', error);
            return 'Torch control mein problem hai Sir';
        }
    },

    async setBrightness(value: string): Promise<string> {
        const level = parseInt(value, 10);
        if (isNaN(level)) {
            return 'Invalid brightness level';
        }

        const success = await SystemService.setBrightness(level / 100);
        return success
            ? `Brightness ${level}% set kar di Sir`
            : 'Brightness set nahi ho saki Sir';
    },

    async setVolume(value: string): Promise<string> {
        const level = parseInt(value, 10);
        if (isNaN(level)) {
            return 'Invalid volume level';
        }

        const success = await MusicService.setVolume(level / 100);
        return success
            ? `Volume ${level}% set kar diya Sir`
            : 'Volume set nahi ho saka Sir';
    },

    async sendSMS(value: string): Promise<string> {
        // Format: "number:message" or "contact_name:message"
        const parts = value.split(':');
        if (parts.length < 2) {
            return 'SMS format galat hai Sir';
        }

        const recipient = parts[0];
        const message = parts.slice(1).join(':');

        // Check if it's a phone number or contact name
        if (/^\d+$/.test(recipient)) {
            // It's a phone number
            const success = await SMSService.sendSMS(recipient, message);
            return success
                ? 'SMS bhej diya Sir'
                : 'SMS nahi bhej saka Sir';
        } else {
            // It's a contact name
            const contacts = await ContactService.searchByName(recipient);
            if (contacts.length === 0) {
                return `Sir, ${recipient} naam ka contact nahi mila`;
            }

            const phone = ContactService.getPrimaryPhone(contacts[0]);
            if (!phone) {
                return `Sir, ${contacts[0].name} ka phone number nahi hai`;
            }

            const success = await SMSService.sendSMS(phone, message);
            return success
                ? `${contacts[0].name} ko SMS bhej diya Sir`
                : 'SMS nahi bhej saka Sir';
        }
    },

    async setAlarm(value: string): Promise<string> {
        // Format: "HH:MM" or "HH:MM:label"
        const parts = value.split(':');
        if (parts.length < 2) {
            return 'Alarm time galat hai Sir';
        }

        const time = `${parts[0]}:${parts[1]}`;
        const label = parts[2] || 'Alarm';

        const id = await AlarmService.setAlarm(time, label);
        return id
            ? `Sir, ${time} baje ka alarm set kar diya`
            : 'Alarm set nahi ho saka Sir';
    },

    async setTimer(value: string): Promise<string> {
        const minutes = parseInt(value, 10);
        if (isNaN(minutes)) {
            return 'Timer duration galat hai Sir';
        }

        const id = await AlarmService.setTimer(minutes);
        return id
            ? `Sir, ${minutes} minute ka timer set kar diya`
            : 'Timer set nahi ho saka Sir';
    },

    async setReminder(value: string): Promise<string> {
        // Format: "time:message"
        const parts = value.split(':');
        if (parts.length < 3) {
            return 'Reminder format galat hai Sir';
        }

        const time = `${parts[0]}:${parts[1]}`;
        const message = parts.slice(2).join(':');

        const id = await AlarmService.setReminder(message, time);
        return id
            ? `Sir, ${time} baje ka reminder set kar diya`
            : 'Reminder set nahi ho saka Sir';
    },

    async getWeather(city: string): Promise<string> {
        const weather = await WeatherService.getWeather(city || 'Delhi');
        return weather
            ? WeatherService.formatForSpeech(weather)
            : 'Sir, weather information nahi mil saki';
    },

    async getNews(category?: string): Promise<string> {
        const articles = await NewsService.getTopHeadlines(category);
        return NewsService.formatForSpeech(articles);
    },

    async navigate(destination: string): Promise<string> {
        if (destination.toLowerCase() === 'home' || destination.toLowerCase() === 'ghar') {
            // You can store home address in AsyncStorage
            return 'Sir, pehle home address set karein';
        }

        const success = await NavigationService.navigateToAddress(destination);
        return success
            ? `Sir, ${destination} ka rasta dikha raha hoon`
            : 'Navigation start nahi ho saka Sir';
    }
};
