/**
 * News API Client
 */

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  authorId?: string;
  author?: {
    username: string;
    firstName?: string;
    lastName?: string;
  };
  source?: string;
  sourceUrl?: string;
  published: boolean;
  publishedAt?: string;
  views: number;
  likes: number;
  createdAt: string;
}

export async function fetchNews(limit = 50): Promise<NewsPost[]> {
  try {
    const response = await fetch(`/api/news?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch news');
    return await response.json();
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export async function fetchNewsPost(slug: string): Promise<NewsPost | null> {
  try {
    const response = await fetch(`/api/news/${slug}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch news post');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching news post:', error);
    return null;
  }
}
