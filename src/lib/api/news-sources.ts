/**
 * Enhanced News Sources Integration
 * Multiple sources: UN, Greenpeace, and other global/regional publishers
 */

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  sourceType: 'un' | 'greenpeace' | 'world-bank' | 'unesco' | 'eea' | 'fao' | 'other';
  publishedAt: string;
  imageUrl?: string;
  category: 'water' | 'ecology' | 'research' | 'technology' | 'policy' | 'climate';
  author?: string;
  tags?: string[];
}

/**
 * UN News - Environment and Water
 */
export async function fetchUNNews(page = 1, pageSize = 20): Promise<NewsArticle[]> {
  try {
    // UN News RSS feed for environment
    const url = 'https://news.un.org/feed/subscribe/en/news/topic/environment/feed/rss.xml';
    
    const response = await fetch(url, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });
    
    if (!response.ok) {
      throw new Error('UN News API error');
    }
    
    const text = await response.text();
    const items = parseRSSFeed(text);
    const articles: NewsArticle[] = [];
    
    items.forEach((item, index) => {
      if (index >= pageSize) return;
      
      const title = item.title || '';
      const description = item.description || '';
      const link = item.link || '';
      const pubDate = item.pubDate || '';
      const image = item.image;
      
      // Filter for water/ecology related content
      const text = `${title} ${description}`.toLowerCase();
      if (!text.includes('water') && !text.includes('ecology') && 
          !text.includes('environment') && !text.includes('climate')) {
        return;
      }
      
      articles.push({
        id: `un-${Date.now()}-${index}`,
        title,
        description,
        url: link,
        source: 'UN News',
        sourceType: 'un',
        publishedAt: pubDate,
        imageUrl: image || undefined,
        category: categorizeNews(title, description),
        tags: extractTags(title, description),
      });
    });
    
    return articles;
  } catch (error) {
    console.error('Error fetching UN news:', error);
    return [];
  }
}

/**
 * Greenpeace News
 */
export async function fetchGreenpeaceNews(page = 1, pageSize = 20): Promise<NewsArticle[]> {
  try {
    // Greenpeace RSS feed
    const url = 'https://www.greenpeace.org/international/rss/';
    
    const response = await fetch(url, {
      next: { revalidate: 1800 },
    });
    
    if (!response.ok) {
      throw new Error('Greenpeace API error');
    }
    
    const text = await response.text();
    const items = parseRSSFeed(text);
    const articles: NewsArticle[] = [];
    
    items.forEach((item, index) => {
      if (index >= pageSize) return;
      
      const title = item.title || '';
      const description = item.description || '';
      const link = item.link || '';
      const pubDate = item.pubDate || '';
      
      articles.push({
        id: `greenpeace-${Date.now()}-${index}`,
        title,
        description,
        url: link,
        source: 'Greenpeace',
        sourceType: 'greenpeace',
        publishedAt: pubDate,
        category: categorizeNews(title, description),
        tags: extractTags(title, description),
      });
    });
    
    return articles;
  } catch (error) {
    console.error('Error fetching Greenpeace news:', error);
    return [];
  }
}

/**
 * World Bank News
 */
export async function fetchWorldBankNews(page = 1, pageSize = 20): Promise<NewsArticle[]> {
  try {
    const url = 'https://www.worldbank.org/en/news/rss';
    
    const response = await fetch(url, {
      next: { revalidate: 1800 },
    });
    
    if (!response.ok) {
      throw new Error('World Bank News API error');
    }
    
    const text = await response.text();
    const items = parseRSSFeed(text);
    const articles: NewsArticle[] = [];
    
    items.forEach((item, index) => {
      if (index >= pageSize) return;
      
      const title = item.title || '';
      const description = item.description || '';
      const link = item.link || '';
      const pubDate = item.pubDate || '';
      
      // Filter for water/environment related
      const text = `${title} ${description}`.toLowerCase();
      if (!text.includes('water') && !text.includes('environment') && 
          !text.includes('climate') && !text.includes('sustainability')) {
        return;
      }
      
      articles.push({
        id: `worldbank-${Date.now()}-${index}`,
        title,
        description,
        url: link,
        source: 'World Bank',
        sourceType: 'world-bank',
        publishedAt: pubDate,
        category: categorizeNews(title, description),
        tags: extractTags(title, description),
      });
    });
    
    return articles;
  } catch (error) {
    console.error('Error fetching World Bank news:', error);
    return [];
  }
}

/**
 * UNESCO Water News
 */
export async function fetchUNESCONews(page = 1, pageSize = 20): Promise<NewsArticle[]> {
  try {
    const url = 'https://www.unesco.org/en/rss';
    
    const response = await fetch(url, {
      next: { revalidate: 1800 },
    });
    
    if (!response.ok) {
      throw new Error('UNESCO News API error');
    }
    
    const text = await response.text();
    const items = parseRSSFeed(text);
    const articles: NewsArticle[] = [];
    
    items.forEach((item, index) => {
      if (index >= pageSize) return;
      
      const title = item.title || '';
      const description = item.description || '';
      const link = item.link || '';
      const pubDate = item.pubDate || '';
      
      const text = `${title} ${description}`.toLowerCase();
      if (!text.includes('water') && !text.includes('environment') && 
          !text.includes('education') && !text.includes('science')) {
        return;
      }
      
      articles.push({
        id: `unesco-${Date.now()}-${index}`,
        title,
        description,
        url: link,
        source: 'UNESCO',
        sourceType: 'unesco',
        publishedAt: pubDate,
        category: categorizeNews(title, description),
        tags: extractTags(title, description),
      });
    });
    
    return articles;
  } catch (error) {
    console.error('Error fetching UNESCO news:', error);
    return [];
  }
}

/**
 * European Environment Agency News
 */
export async function fetchEEANews(page = 1, pageSize = 20): Promise<NewsArticle[]> {
  try {
    const url = 'https://www.eea.europa.eu/rss';
    
    const response = await fetch(url, {
      next: { revalidate: 1800 },
    });
    
    if (!response.ok) {
      throw new Error('EEA News API error');
    }
    
    const text = await response.text();
    const items = parseRSSFeed(text);
    const articles: NewsArticle[] = [];
    
    items.forEach((item, index) => {
      if (index >= pageSize) return;
      
      const title = item.title || '';
      const description = item.description || '';
      const link = item.link || '';
      const pubDate = item.pubDate || '';
      
      articles.push({
        id: `eea-${Date.now()}-${index}`,
        title,
        description,
        url: link,
        source: 'European Environment Agency',
        sourceType: 'eea',
        publishedAt: pubDate,
        category: categorizeNews(title, description),
        tags: extractTags(title, description),
      });
    });
    
    return articles;
  } catch (error) {
    console.error('Error fetching EEA news:', error);
    return [];
  }
}

/**
 * Aggregate news from all sources
 */
export async function fetchAllNewsSources(
  page = 1,
  pageSize = 20
): Promise<NewsArticle[]> {
  try {
    const [unNews, greenpeaceNews, worldBankNews, unescoNews, eeaNews] = 
      await Promise.allSettled([
        fetchUNNews(page, Math.ceil(pageSize / 5)),
        fetchGreenpeaceNews(page, Math.ceil(pageSize / 5)),
        fetchWorldBankNews(page, Math.ceil(pageSize / 5)),
        fetchUNESCONews(page, Math.ceil(pageSize / 5)),
        fetchEEANews(page, Math.ceil(pageSize / 5)),
      ]);
    
    const allArticles: NewsArticle[] = [];
    
    if (unNews.status === 'fulfilled') allArticles.push(...unNews.value);
    if (greenpeaceNews.status === 'fulfilled') allArticles.push(...greenpeaceNews.value);
    if (worldBankNews.status === 'fulfilled') allArticles.push(...worldBankNews.value);
    if (unescoNews.status === 'fulfilled') allArticles.push(...unescoNews.value);
    if (eeaNews.status === 'fulfilled') allArticles.push(...eeaNews.value);
    
    // Sort by date (newest first)
    allArticles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    // Remove duplicates (by URL)
    const uniqueArticles = Array.from(
      new Map(allArticles.map(article => [article.url, article])).values()
    );
    
    return uniqueArticles.slice(0, pageSize);
  } catch (error) {
    console.error('Error fetching all news sources:', error);
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
  if (text.includes('technology') || text.includes('innovation') || text.includes('iot') || 
      text.includes('ai') || text.includes('blockchain')) {
    return 'technology';
  }
  if (text.includes('policy') || text.includes('government') || text.includes('regulation') ||
      text.includes('law') || text.includes('treaty')) {
    return 'policy';
  }
  if (text.includes('ecology') || text.includes('ecosystem') || text.includes('biodiversity') ||
      text.includes('wildlife') || text.includes('conservation')) {
    return 'ecology';
  }
  if (text.includes('climate') || text.includes('warming') || text.includes('emission')) {
    return 'climate';
  }
  
  return 'water';
}

/**
 * Parse RSS feed XML (server-side compatible)
 */
function parseRSSFeed(xmlText: string): Array<{
  title: string;
  description: string;
  link: string;
  pubDate: string;
  image?: string;
}> {
  const items: Array<{
    title: string;
    description: string;
    link: string;
    pubDate: string;
    image?: string;
  }> = [];
  
  // Extract items using regex (simple but works for most RSS feeds)
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let match;
  
  while ((match = itemRegex.exec(xmlText)) !== null && items.length < 50) {
    const itemContent = match[1];
    
    const titleMatch = itemContent.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const descMatch = itemContent.match(/<description[^>]*>([\s\S]*?)<\/description>/i);
    const linkMatch = itemContent.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
    const pubDateMatch = itemContent.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i);
    const enclosureMatch = itemContent.match(/<enclosure[^>]*url=["']([^"']+)["']/i);
    
    const title = titleMatch ? cleanXMLText(titleMatch[1]) : '';
    const description = descMatch ? cleanXMLText(descMatch[1]) : '';
    const link = linkMatch ? cleanXMLText(linkMatch[1]) : '';
    const pubDate = pubDateMatch ? cleanXMLText(pubDateMatch[1]) : '';
    const image = enclosureMatch ? enclosureMatch[1] : undefined;
    
    if (title && link) {
      items.push({ title, description, link, pubDate, image });
    }
  }
  
  return items;
}

/**
 * Clean XML text (remove CDATA, HTML tags, decode entities)
 */
function cleanXMLText(text: string): string {
  // Remove CDATA
  text = text.replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1');
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, '');
  // Decode common entities
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
  return text;
}

/**
 * Extract tags from news content
 */
function extractTags(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const tags: string[] = [];
  
  const keywords = [
    'water', 'aqua', 'hydrology', 'river', 'lake', 'ocean',
    'ecology', 'ecosystem', 'biodiversity', 'conservation',
    'climate', 'warming', 'emission', 'carbon',
    'sustainability', 'renewable', 'green',
    'pollution', 'contamination', 'cleanup',
    'research', 'study', 'scientific',
    'technology', 'innovation', 'iot', 'ai',
    'policy', 'regulation', 'government',
  ];
  
  keywords.forEach(keyword => {
    if (text.includes(keyword) && !tags.includes(keyword)) {
      tags.push(keyword);
    }
  });
  
  return tags.slice(0, 5); // Limit to 5 tags
}
