/**
 * Water Resources API Client
 * Integrates with multiple water data sources
 */

export interface WaterResource {
  id: string;
  name: string;
  type: 'river' | 'lake' | 'sea' | 'ocean' | 'glacier' | 'underground' | 'station' | 'treatment' | 'organization';
  category: 'source' | 'object' | 'subject';
  latitude: number;
  longitude: number;
  country?: string;
  region?: string;
  description?: string;
  qualityIndex?: number;
  flowRate?: number;
  capacity?: number;
  status: string;
  imageUrl?: string;
  metadata?: Record<string, any>;
}

export interface WaterResourceFilter {
  type?: string[];
  category?: string[];
  country?: string;
  region?: string;
  minQuality?: number;
  status?: string;
  includeExternal?: boolean;
}

/**
 * Fetch water resources from database
 */
export async function fetchWaterResources(
  filter?: WaterResourceFilter
): Promise<WaterResource[]> {
  try {
    const params = new URLSearchParams();
    if (filter?.type) params.append('type', filter.type.join(','));
    if (filter?.category) params.append('category', filter.category.join(','));
    if (filter?.country) params.append('country', filter.country);
    if (filter?.region) params.append('region', filter.region);
    if (filter?.minQuality) params.append('minQuality', filter.minQuality.toString());
    if (filter?.status) params.append('status', filter.status);
    if (filter?.includeExternal) params.append('external', 'true');

    const response = await fetch(`/api/water-resources?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch water resources');

    return await response.json();
  } catch (error) {
    console.error('Error fetching water resources:', error);
    return [];
  }
}

// Re-export from enhanced client
export { fetchAllWaterResources, fetchOSMWaterBodies } from './water-resources-client';

/**
 * Universal API client with caching
 */
class WaterResourcesAPIClient {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTTL = 5 * 60 * 1000; // 5 minutes

  async get<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    try {
      const data = await fetcher();
      this.cache.set(key, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      // Return cached data if available, even if expired
      if (cached) {
        console.warn('Using stale cache due to fetch error:', error);
        return cached.data;
      }
      throw error;
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

export const waterResourcesAPI = new WaterResourcesAPIClient();
