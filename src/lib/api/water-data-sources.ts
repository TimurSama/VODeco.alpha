/**
 * Water Data Sources API Integration
 * Aggregates data from multiple sources for comprehensive water resource information
 */
import { XMLParser } from 'fast-xml-parser';

export interface WaterDataPoint {
  id: string;
  source: string;
  latitude: number;
  longitude: number;
  name: string;
  type: string;
  qualityIndex?: number;
  flowRate?: number;
  capacity?: number;
  lastUpdated: string;
  metadata: Record<string, any>;
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
  category: 'water' | 'ecology' | 'research' | 'technology' | 'policy' | 'climate';
}

/**
 * World Bank Water Data
 * @deprecated Use fetchWorldBankWaterData from './world-bank-api' instead
 */
export async function fetchWorldBankWaterData(countryCode?: string): Promise<WaterDataPoint[]> {
  // Re-export from dedicated module
  const { fetchWorldBankWaterData: fetchWB } = await import('./world-bank-api');
  const wbData = await fetchWB(countryCode);
  
  // Transform to WaterDataPoint format
  return wbData.map(data => ({
    id: `wb-${data.countryCode}-${data.year}`,
    source: 'World Bank',
    latitude: 0, // Would need country coordinates
    longitude: 0,
    name: data.country,
    type: 'country',
    qualityIndex: data.accessToSafeWater || undefined,
    flowRate: data.waterWithdrawalsPerCapita || undefined,
    capacity: undefined,
    lastUpdated: new Date().toISOString(),
    metadata: {
      countryCode: data.countryCode,
      year: data.year,
      accessToSanitation: data.accessToSanitation,
      ...data.metadata,
    },
  }));
}

/**
 * USGS Water Services
 * @deprecated Use fetchUSGSWaterData from './usgs-water-api' instead
 */
export async function fetchUSGSWaterData(bbox?: [number, number, number, number]): Promise<WaterDataPoint[]> {
  // Re-export from dedicated module
  const { fetchUSGSWaterData: fetchUSGS } = await import('./usgs-water-api');
  const usgsData = await fetchUSGS(bbox);
  
  // Transform to WaterDataPoint format
  return usgsData.map(data => ({
    id: data.id,
    source: 'USGS',
    latitude: data.latitude,
    longitude: data.longitude,
    name: data.name,
    type: data.type,
    qualityIndex: undefined,
    flowRate: data.flowRate,
    capacity: undefined,
    lastUpdated: data.lastUpdated,
    metadata: {
      state: data.state,
      county: data.county,
      ...data.metadata,
    },
  }));
}

/**
 * NewsAPI - Water & Ecology News
 * Enhanced with multiple sources: UN, Greenpeace, World Bank, UNESCO, EEA
 */
export async function fetchWaterNews(page = 1, pageSize = 20): Promise<NewsArticle[]> {
  try {
    // First, try to fetch from all news sources
    const { fetchAllNewsSources } = await import('./news-sources');
    const allNews = await fetchAllNewsSources(page, pageSize);
    
    if (allNews.length > 0) {
      return allNews.map(article => ({
        id: article.id,
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source,
        publishedAt: article.publishedAt,
        imageUrl: article.imageUrl,
        category: article.category,
      }));
    }
    
    // Fallback to NewsAPI if available
    const apiKey = process.env.NEWS_API_KEY || process.env.NEXT_PUBLIC_NEWS_API_KEY || '';
    if (apiKey) {
      const query = 'water OR water resources OR ecology OR environmental protection OR climate change';
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        
        return data.articles.map((article: any, index: number) => ({
          id: `newsapi-${article.publishedAt}-${index}`,
          title: article.title,
          description: article.description,
          url: article.url,
          source: article.source.name,
          publishedAt: article.publishedAt,
          imageUrl: article.urlToImage,
          category: categorizeNews(article.title, article.description),
        }));
      }
    }
    
    // Final fallback to RSS
    return fetchWaterNewsRSS(page, pageSize);
  } catch (error) {
    console.error('Error fetching news:', error);
    return fetchWaterNewsRSS(page, pageSize);
  }
}

/**
 * Google News RSS Fallback
 */
async function fetchWaterNewsRSS(page = 1, pageSize = 20): Promise<NewsArticle[]> {
  try {
    const query = 'water+resources+ecology+environment';
    const url = `https://news.google.com/rss/search?q=${query}&hl=en&gl=US&ceid=US:en`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('RSS fetch error');
    
    const text = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
    });
    const xml = parser.parse(text);
    const itemsRaw = xml?.rss?.channel?.item ?? [];
    const items = Array.isArray(itemsRaw) ? itemsRaw : [itemsRaw];
    const articles: NewsArticle[] = [];

    const normalizeText = (value: unknown): string => {
      if (typeof value === 'string') return value;
      if (value && typeof value === 'object' && '#text' in value) {
        const textValue = (value as { '#text'?: unknown })['#text'];
        return typeof textValue === 'string' ? textValue : '';
      }
      return '';
    };

    items.forEach((item, index) => {
      if (!item || index >= pageSize) return;
      const title = normalizeText(item.title);
      const description = normalizeText(item.description);
      const link = normalizeText(item.link);
      const pubDate = normalizeText(item.pubDate);

      articles.push({
        id: `rss-${Date.now()}-${index}`,
        title,
        description,
        url: link,
        source: 'Google News',
        publishedAt: pubDate,
        category: categorizeNews(title, description),
      });
    });
    
    return articles;
  } catch (error) {
    console.error('Error fetching RSS news:', error);
    return [];
  }
}

/**
 * Categorize news article
 */
function categorizeNews(title: string, description: string): NewsArticle['category'] {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('research') || text.includes('study') || text.includes('scientific')) {
    return 'research';
  }
  if (text.includes('technology') || text.includes('innovation') || text.includes('iot')) {
    return 'technology';
  }
  if (text.includes('policy') || text.includes('government') || text.includes('regulation')) {
    return 'policy';
  }
  if (text.includes('ecology') || text.includes('ecosystem') || text.includes('biodiversity')) {
    return 'ecology';
  }
  
  return 'water';
}

/**
 * Aggregate all water data sources
 */
export async function aggregateWaterData(): Promise<WaterDataPoint[]> {
  const [worldBank, usgs] = await Promise.all([
    fetchWorldBankWaterData(),
    fetchUSGSWaterData(),
  ]);
  
  return [...worldBank, ...usgs];
}
