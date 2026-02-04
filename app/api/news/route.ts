import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { fetchWaterNews } from '@/lib/api/water-data-sources';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const useAPI = searchParams.get('api') === 'true';

    let newsPosts = [];

    if (useAPI) {
      // Fetch from all news sources (UN, Greenpeace, World Bank, UNESCO, EEA)
      const { fetchAllNewsSources } = await import('@/lib/api/news-sources');
      const apiNews = await fetchAllNewsSources(page, pageSize);
      
      // Also try NewsAPI as additional source
      const newsApiArticles = await fetchWaterNews(page, Math.ceil(pageSize / 2));
      
      // Combine all news sources
      const allArticles = [...apiNews, ...newsApiArticles];
      
      // Remove duplicates by URL
      const uniqueArticles = Array.from(
        new Map(allArticles.map(article => [article.url, article])).values()
      );
      
      // Transform and save to database
      for (const article of uniqueArticles) {
        try {
          await prisma.newsPost.upsert({
            where: { slug: article.id },
            update: {
              title: article.title,
              excerpt: article.description?.substring(0, 200) || '',
              content: article.description || article.title,
              source: article.source,
              sourceUrl: article.url,
              imageUrl: article.imageUrl,
              publishedAt: new Date(article.publishedAt),
            },
            create: {
              slug: article.id,
              title: article.title,
              excerpt: article.description?.substring(0, 200) || '',
              content: article.description || article.title,
              source: article.source,
              sourceUrl: article.url,
              imageUrl: article.imageUrl,
              published: true,
              publishedAt: new Date(article.publishedAt),
              views: 0,
              likes: 0,
            },
          });
        } catch (error) {
          console.error('Error saving news article:', error);
          // Continue with next article
        }
      }
    }

    // Fetch from database
    newsPosts = await prisma.newsPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: pageSize,
      skip: (page - 1) * pageSize,
      include: {
        comments: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json(newsPosts);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
