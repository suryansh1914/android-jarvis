export class HindiHelper {
    /**
     * Common Hindi/Hinglish phrase mappings
     */
    static readonly COMMON_PHRASES: { [key: string]: string } = {
        // Greetings
        'namaste': 'hello',
        'namaskar': 'hello',
        'hello': 'hello',
        'hi': 'hi',

        // Family
        'mummy': 'mom',
        'mumma': 'mom',
        'mama': 'mom',
        'papa': 'dad',
        'daddy': 'dad',
        'bhai': 'brother',
        'bhaiya': 'brother',
        'behen': 'sister',
        'didi': 'sister',
        'dada': 'grandfather',
        'dadi': 'grandmother',
        'nana': 'grandfather',
        'nani': 'grandmother',

        // Time
        'abhi': 'now',
        'kal': 'tomorrow',
        'parso': 'day after tomorrow',
        'subah': 'morning',
        'dopahar': 'afternoon',
        'shaam': 'evening',
        'raat': 'night',

        // Actions
        'chalao': 'open',
        'kholo': 'open',
        'band karo': 'close',
        'bhejo': 'send',
        'lagao': 'set',
        'batao': 'tell',
        'dikhao': 'show',
        'sunao': 'play',

        // Questions
        'kya': 'what',
        'kaun': 'who',
        'kab': 'when',
        'kahan': 'where',
        'kaise': 'how',
        'kitna': 'how much',
        'kyun': 'why',
    };

    /**
     * Number to Hindi words
     */
    static readonly NUMBERS_HINDI: { [key: number]: string } = {
        0: 'shunya',
        1: 'ek',
        2: 'do',
        3: 'teen',
        4: 'char',
        5: 'paanch',
        6: 'chhe',
        7: 'saat',
        8: 'aath',
        9: 'nau',
        10: 'das',
        20: 'bees',
        30: 'tees',
        40: 'chalis',
        50: 'pachaas',
        60: 'saath',
        70: 'sattar',
        80: 'assi',
        90: 'nabbe',
        100: 'sau'
    };

    /**
     * Convert English number to Hindi word
     */
    static numberToHindi(num: number): string {
        if (num in this.NUMBERS_HINDI) {
            return this.NUMBERS_HINDI[num];
        }
        return num.toString();
    }

    /**
     * Format time in Hindi
     */
    static formatTimeHindi(hours: number, minutes: number): string {
        const hourHindi = this.numberToHindi(hours);
        const minuteHindi = this.numberToHindi(minutes);

        if (minutes === 0) {
            return `${hourHindi} baje`;
        }
        return `${hourHindi} baj kar ${minuteHindi} minute`;
    }

    /**
     * Get time of day in Hindi
     */
    static getTimeOfDay(): string {
        const hour = new Date().getHours();

        if (hour < 12) return 'subah';
        if (hour < 17) return 'dopahar';
        if (hour < 20) return 'shaam';
        return 'raat';
    }

    /**
     * Format date in Hindi
     */
    static formatDateHindi(date: Date): string {
        const days = ['Ravivar', 'Somvar', 'Mangalvar', 'Budhvar', 'Guruvar', 'Shukravar', 'Shanivar'];
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const dayName = days[date.getDay()];
        const monthName = months[date.getMonth()];
        const dateNum = date.getDate();

        return `${dayName}, ${dateNum} ${monthName}`;
    }

    /**
     * Normalize Hindi text for processing
     */
    static normalize(text: string): string {
        return text
            .toLowerCase()
            .trim()
            .replace(/\s+/g, ' ');
    }

    /**
     * Extract phone number from text
     */
    static extractPhoneNumber(text: string): string | null {
        const phoneRegex = /\b\d{10}\b/;
        const match = text.match(phoneRegex);
        return match ? match[0] : null;
    }

    /**
     * Extract time from text (HH:MM format)
     */
    static extractTime(text: string): string | null {
        const timeRegex = /\b(\d{1,2}):(\d{2})\b/;
        const match = text.match(timeRegex);
        return match ? match[0] : null;
    }

    /**
     * Convert Hindi numerals to English
     */
    static hindiToEnglishNumber(text: string): string {
        let result = text;

        const hindiNumerals: { [key: string]: string } = {
            '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
            '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
        };

        for (const [hindi, english] of Object.entries(hindiNumerals)) {
            result = result.replace(new RegExp(hindi, 'g'), english);
        }

        return result;
    }

    /**
     * Get greeting based on time
     */
    static getGreeting(): string {
        const hour = new Date().getHours();

        if (hour < 12) return 'Subah bakhair Sir';
        if (hour < 17) return 'Namaste Sir';
        if (hour < 20) return 'Shubh sandhya Sir';
        return 'Shubh ratri Sir';
    }
}
