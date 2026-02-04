/**
 * Enhanced Water Resources API Client
 * Integrates multiple data sources with fallback
 */

import { WaterResource, WaterResourceFilter } from './water-resources';

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const data = await fetcher();
    cache.set(key, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    if (cached) {
      console.warn('Using stale cache due to fetch error:', error);
      return cached.data;
    }
    throw error;
  }
}

/**
 * Fetch from OpenStreetMap Overpass API
 */
export async function fetchOSMWaterBodies(
  bbox?: [number, number, number, number]
): Promise<WaterResource[]> {
  return fetchWithCache('osm-water-bodies', async () => {
    try {
      const query = `
        [out:json][timeout:25];
        (
          way["natural"="water"]${bbox ? `(${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]})` : ''};
          way["waterway"="river"]${bbox ? `(${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]})` : ''};
        );
        out center meta;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: query,
      });

      if (!response.ok) throw new Error('OSM API error');
      const data = await response.json();

      return data.elements
        .filter((el: any) => el.center || el.lat)
        .map((element: any) => ({
          id: `osm_${element.id}`,
          name: element.tags?.name || 'Unnamed Water Body',
          type: element.tags?.waterway === 'river' ? 'river' : 'lake',
          category: 'source' as const,
          latitude: element.center?.lat || element.lat,
          longitude: element.center?.lon || element.lon,
          country: element.tags?.['addr:country'],
          description: element.tags?.description,
          status: 'active',
          metadata: { osmId: element.id, tags: element.tags },
        }));
    } catch (error) {
      console.error('Error fetching OSM water bodies:', error);
      return [];
    }
  });
}

/**
 * Fetch from database (primary source)
 */
export async function fetchDBWaterResources(
  filter?: WaterResourceFilter
): Promise<WaterResource[]> {
  const params = new URLSearchParams();
  if (filter?.type) params.append('type', filter.type.join(','));
  if (filter?.category) params.append('category', filter.category.join(','));
  if (filter?.country) params.append('country', filter.country);
  if (filter?.region) params.append('region', filter.region);
  if (filter?.minQuality) params.append('minQuality', filter.minQuality.toString());
  if (filter?.status) params.append('status', filter.status);

  try {
    const response = await fetch(`/api/water-resources?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch water resources');
    return await response.json();
  } catch (error) {
    console.error('Error fetching DB water resources:', error);
    return [];
  }
}

/**
 * Combined fetch - DB first, then OSM as supplement
 */
export async function fetchAllWaterResources(
  filter?: WaterResourceFilter
): Promise<WaterResource[]> {
  const [dbResources, osmResources] = await Promise.all([
    fetchDBWaterResources(filter),
    fetchOSMWaterBodies(), // Can be filtered by bbox later
  ]);

  // Merge and deduplicate
  const allResources = [...dbResources];
  const existingIds = new Set(dbResources.map((r) => r.id));

  osmResources.forEach((resource) => {
    if (!existingIds.has(resource.id)) {
      allResources.push(resource);
    }
  });

  return allResources;
}
