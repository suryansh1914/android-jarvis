import axios from 'axios';
import { Config } from '../constants/Config';
import { CacheService } from './CacheService';

interface WeatherData {
    temperature: number;
    feelsLike: number;
    description: string;
    humidity: number;
    windSpeed: number;
    city: string;
}

export class WeatherService {
    /**
     * Get current weather by city name
     */
    static async getWeather(city: string = 'Delhi'): Promise<WeatherData | null> {
        try {
            // Check cache first
            const cacheKey = `weather_${city.toLowerCase()}`;
            const cached = await CacheService.get<WeatherData>(cacheKey);
            if (cached) {
                return cached;
            }

            if (!Config.WEATHER_API_KEY) {
                console.error('Weather API key not configured');
                return null;
            }

            const response = await axios.get(
                `${Config.WEATHER_API_URL}/weather`,
                {
                    params: {
                        q: city,
                        appid: Config.WEATHER_API_KEY,
                        units: 'metric',
                        lang: 'en'
                    }
                }
            );

            const data = response.data;
            const weatherData: WeatherData = {
                temperature: Math.round(data.main.temp),
                feelsLike: Math.round(data.main.feels_like),
                description: data.weather[0].description,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                city: data.name
            };

            // Cache for 30 minutes
            await CacheService.set(cacheKey, weatherData, 30);

            return weatherData;
        } catch (error) {
            console.error('Weather fetch error:', error);
            return null;
        }
    }

    /**
     * Get weather by coordinates
     */
    static async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData | null> {
        try {
            if (!Config.WEATHER_API_KEY) {
                console.error('Weather API key not configured');
                return null;
            }

            const response = await axios.get(
                `${Config.WEATHER_API_URL}/weather`,
                {
                    params: {
                        lat,
                        lon,
                        appid: Config.WEATHER_API_KEY,
                        units: 'metric',
                        lang: 'en'
                    }
                }
            );

            const data = response.data;
            return {
                temperature: Math.round(data.main.temp),
                feelsLike: Math.round(data.main.feels_like),
                description: data.weather[0].description,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                city: data.name
            };
        } catch (error) {
            console.error('Weather fetch error:', error);
            return null;
        }
    }

    /**
     * Format weather data for speech
     */
    static formatForSpeech(weather: WeatherData): string {
        return `${weather.city} mein abhi ${weather.temperature} degree hai. Mausam ${weather.description} hai. Humidity ${weather.humidity}% hai.`;
    }
}
