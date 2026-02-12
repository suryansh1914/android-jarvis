import axios from 'axios';
import { Config } from '../constants/Config';
import { CacheService } from './CacheService';

interface NewsArticle {
    title: string;
    description: string;
    source: string;
    url: string;
    publishedAt: string;
}

export class NewsService {
    /**
     * Get top headlines
     */
    static async getTopHeadlines(category?: string, country: string = 'in'): Promise<NewsArticle[]> {
        try {
            // Check cache
            const cacheKey = `news_${category || 'general'}_${country}`;
            const cached = await CacheService.get<NewsArticle[]>(cacheKey);
            if (cached) {
                return cached;
            }

            if (!Config.NEWS_API_KEY) {
                console.error('News API key not configured');
                return [];
            }

            const response = await axios.get(
                `${Config.NEWS_API_URL}/top-headlines`,
                {
                    params: {
                        country,
                        category,
                        apiKey: Config.NEWS_API_KEY,
                        pageSize: 5
                    }
                }
            );

            const articles: NewsArticle[] = response.data.articles.map((article: any) => ({
                title: article.title,
                description: article.description,
                source: article.source.name,
                url: article.url,
                publishedAt: article.publishedAt
            }));

            // Cache for 15 minutes
            await CacheService.set(cacheKey, articles, 15);

            return articles;
        } catch (error) {
            console.error('News fetch error:', error);
            return [];
        }
    }

    /**
     * Search news by query
     */
    static async searchNews(query: string): Promise<NewsArticle[]> {
        try {
            if (!Config.NEWS_API_KEY) {
                console.error('News API key not configured');
                return [];
            }

            const response = await axios.get(
                `${Config.NEWS_API_URL}/everything`,
                {
                    params: {
                        q: query,
                        apiKey: Config.NEWS_API_KEY,
                        pageSize: 5,
                        sortBy: 'publishedAt'
                    }
                }
            );

            return response.data.articles.map((article: any) => ({
                title: article.title,
                description: article.description,
                source: article.source.name,
                url: article.url,
                publishedAt: article.publishedAt
            }));
        } catch (error) {
            console.error('News search error:', error);
            return [];
        }
    }

    /**
     * Format news for speech
     */
    static formatForSpeech(articles: NewsArticle[], count: number = 3): string {
        if (articles.length === 0) {
            return 'Sir, abhi koi news nahi mil rahi hai.';
        }

        const headlines = articles.slice(0, count).map((article, index) => {
            return `${index + 1}. ${article.title}`;
        });

        return `Sir, aaj ki top news:\n${headlines.join('\n')}`;
    }
}
