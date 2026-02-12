import { GEMINI_API_KEY, OPENAI_API_KEY, WEATHER_API_KEY, NEWS_API_KEY } from '@env';

export const Config = {
    // AI Services
    GEMINI_API_KEY: GEMINI_API_KEY || '',
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    OPENAI_API_KEY: OPENAI_API_KEY || '',
    OPENAI_API_URL: 'https://api.openai.com/v1',

    // External APIs
    WEATHER_API_KEY: WEATHER_API_KEY || '',
    WEATHER_API_URL: 'https://api.openweathermap.org/data/2.5',
    NEWS_API_KEY: NEWS_API_KEY || '',
    NEWS_API_URL: 'https://newsapi.org/v2',
};
