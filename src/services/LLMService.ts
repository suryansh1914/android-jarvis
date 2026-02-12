import { Config } from '../constants/Config';
import { SystemService } from './SystemService';
import { CacheService } from './CacheService';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const SYSTEM_PROMPT = `
You are JARVIS, an advanced AI assistant for Android.
Address the user as "Sir" (or "Ma'am" if appropriate).
Respond ONLY in Hindi or Hinglish (Hindi-English mix). Keep responses natural and conversational.

AVAILABLE COMMANDS (use at START of response):
[ACTION:CALL:phone_number] - Make a phone call
[ACTION:CONTACT_CALL:name] - Call a contact by name (e.g., "mummy", "papa", "bhai")
[ACTION:OPEN:app_name] - Open an app
[ACTION:TORCH:ON/OFF] - Toggle flashlight
[ACTION:BRIGHTNESS:0-100] - Set screen brightness
[ACTION:VOLUME:0-100] - Set volume
[ACTION:SMS:recipient:message] - Send SMS (recipient can be number or contact name)
[ACTION:ALARM:HH:MM:label] - Set alarm (label optional)
[ACTION:TIMER:minutes] - Set timer
[ACTION:REMINDER:HH:MM:message] - Set reminder
[ACTION:WEATHER:city] - Get weather (city optional, defaults to Delhi)
[ACTION:NEWS:category] - Get news (category optional: business, technology, sports, entertainment)
[ACTION:NAVIGATE:destination] - Start navigation
[ACTION:MUSIC_PLAY] - Play music
[ACTION:MUSIC_PAUSE] - Pause music
[ACTION:MUSIC_STOP] - Stop music

SUPPORTED APPS:
Social: YouTube, WhatsApp, Facebook, Instagram, Twitter, Telegram, Snapchat, LinkedIn
Browsers: Chrome, Firefox, Brave
Entertainment: Spotify, Netflix, Amazon Prime, Hotstar, Gaana, JioSaavn
Shopping: Amazon, Flipkart, Myntra, Meesho
Payment: Paytm, PhonePe, Google Pay, BHIM
Food: Zomato, Swiggy
Transport: Uber, Ola
Google: Gmail, Maps, Drive, Photos, Calendar
Others: Settings, Camera, Gallery

EXAMPLES:
User: "YouTube chalao"
AI: "[ACTION:OPEN:youtube] Bilkul Sir, YouTube khol raha hoon."

User: "Mummy ko call karo"
AI: "[ACTION:CONTACT_CALL:mummy] Ji Sir, mummy ko call kar raha hoon."

User: "Torch jalao"
AI: "[ACTION:TORCH:ON] Light on kar di hai Sir."

User: "5 minute ka timer lagao"
AI: "[ACTION:TIMER:5] Sir, 5 minute ka timer set kar diya."

User: "Kal subah 7 baje alarm lagao"
AI: "[ACTION:ALARM:07:00:Morning Alarm] Sir, kal subah 7 baje ka alarm set kar diya."

User: "Delhi mein mausam kaisa hai?"
AI: "[ACTION:WEATHER:Delhi] Sir, Delhi ka weather check kar raha hoon."

User: "Aaj ki news sunao"
AI: "[ACTION:NEWS:] Sir, aaj ki top news bata raha hoon."

User: "Raj ko SMS bhejo ki main late aaunga"
AI: "[ACTION:SMS:Raj:Main late aaunga] Sir, Raj ko message bhej diya."

User: "Battery kitni hai?"
AI: "Sir, battery abhi [BATTERY_LEVEL]% hai."

User: "Tum kaun ho?"
AI: "Main JARVIS hoon Sir, aapka personal AI assistant. Main aapke phone ko control kar sakta hoon, calls kar sakta hoon, messages bhej sakta hoon, aur bahut kuch."

IMPORTANT:
- Keep responses SHORT and NATURAL in Hindi/Hinglish
- Use action commands when user wants to DO something
- Be witty and respectful like Tony Stark's JARVIS
- If unsure about a contact name, ask for clarification
- For time-based commands, use 24-hour format (HH:MM)
`;

export class LLMService {
    private static conversationHistory: Message[] = [];
    private static readonly MAX_HISTORY = 5;

    /**
     * Get AI response with conversation context
     */
    static async getResponse(userText: string): Promise<string> {
        // Check cache for common queries
        const cacheKey = `llm_${userText.toLowerCase().trim()}`;
        const cached = await CacheService.get<string>(cacheKey);
        if (cached) {
            return cached;
        }

        const apiKey = Config.GEMINI_API_KEY;
        if (!apiKey) {
            return "Sir, mera API key missing hai. Settings mein check karein.";
        }

        try {
            const systemContext = await SystemService.getSystemContext();

            // Build conversation context
            const messages = [
                { role: 'user', content: `${SYSTEM_PROMPT}\n\n${systemContext}` },
                ...this.conversationHistory,
                { role: 'user', content: userText }
            ];

            // Create prompt with context
            const fullPrompt = messages
                .map(m => `${m.role === 'user' ? 'User' : 'JARVIS'}: ${m.content}`)
                .join('\n\n');

            const response = await this.callGeminiAPI(apiKey, fullPrompt);

            // Update conversation history
            this.addToHistory('user', userText);
            this.addToHistory('assistant', response);

            // Cache common queries
            if (this.isCommonQuery(userText)) {
                await CacheService.set(cacheKey, response, 60);
            }

            return response;
        } catch (error) {
            console.error('LLM Error:', error);
            return this.getErrorResponse(error);
        }
    }

    /**
     * Call Gemini API with retry logic
     */
    private static async callGeminiAPI(apiKey: string, prompt: string, retries: number = 2): Promise<string> {
        for (let i = 0; i <= retries; i++) {
            try {
                const response = await fetch(`${Config.GEMINI_API_URL}?key=${apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: prompt }]
                        }]
                    }),
                });

                const data = await response.json();

                if (data.error) {
                    console.error('Gemini API Error:', data.error);
                    if (i < retries) {
                        await this.delay(1000 * (i + 1)); // Exponential backoff
                        continue;
                    }
                    throw new Error(data.error.message);
                }

                if (data.candidates && data.candidates.length > 0 &&
                    data.candidates[0].content && data.candidates[0].content.parts.length > 0) {
                    return data.candidates[0].content.parts[0].text;
                }

                throw new Error('Invalid response format');
            } catch (error) {
                if (i < retries) {
                    await this.delay(1000 * (i + 1));
                    continue;
                }
                throw error;
            }
        }

        throw new Error('Max retries exceeded');
    }

    /**
     * Add message to conversation history
     */
    private static addToHistory(role: 'user' | 'assistant', content: string): void {
        this.conversationHistory.push({ role, content });

        // Keep only last N messages
        if (this.conversationHistory.length > this.MAX_HISTORY * 2) {
            this.conversationHistory = this.conversationHistory.slice(-this.MAX_HISTORY * 2);
        }
    }

    /**
     * Clear conversation history
     */
    static clearHistory(): void {
        this.conversationHistory = [];
    }

    /**
     * Check if query is common (for caching)
     */
    private static isCommonQuery(query: string): boolean {
        const commonQueries = [
            'battery', 'time', 'date', 'hello', 'hi', 'kaun ho', 'who are you',
            'kya kar sakte ho', 'what can you do', 'help'
        ];

        const lowerQuery = query.toLowerCase();
        return commonQueries.some(q => lowerQuery.includes(q));
    }

    /**
     * Get user-friendly error response
     */
    private static getErrorResponse(error: any): string {
        const errorMessage = error?.message || '';

        if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
            return "Sir, network connection mein problem hai. Internet check karein.";
        }

        if (errorMessage.includes('API key')) {
            return "Sir, API key invalid hai. Settings mein check karein.";
        }

        if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
            return "Sir, API limit exceed ho gayi hai. Thodi der baad try karein.";
        }

        return "Sir, kuch technical problem hai. Thodi der baad try karein.";
    }

    /**
     * Delay helper for retry logic
     */
    private static delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get conversation history
     */
    static getHistory(): Message[] {
        return [...this.conversationHistory];
    }
}
