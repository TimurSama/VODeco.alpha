/**
 * Enhanced Water Data API Integration
 * Combines multiple data sources for comprehensive visualization
 */

import { WaterResource } from './water-resources';
import { fetchWorldBankWaterData as fetchWB } from './world-bank-api';
import { fetchUSGSWaterData as fetchUSGS } from './usgs-water-api';
import { fetchOSMWaterFeatures } from './overpass-api';

export interface EnhancedWaterMetrics {
  totalResources: number;
  countries: number;
  averageQuality: number;
  totalFlowRate: number;
  totalCapacity: number;
  qualityDistribution: {
    excellent: number; // >70%
    good: number; // 40-70%
    poor: number; // <40%
  };
  typeDistribution: Record<string, number>;
  categoryDistribution: Record<string, number>;
  regionalStats: {
    region: string;
    resources: number;
    averageQuality: number;
  }[];
}

/**
 * Calculate enhanced metrics from water resources
 */
export function calculateWaterMetrics(resources: WaterResource[]): EnhancedWaterMetrics {
  const totalResources = resources.length;
  const countries = new Set(resources.map(r => r.country).filter(Boolean)).size;
  
  const qualityScores = resources
    .map(r => r.qualityIndex)
    .filter((q): q is number => q !== undefined);
  
  const averageQuality = qualityScores.length > 0
    ? qualityScores.reduce((sum, q) => sum + q, 0) / qualityScores.length
    : 0;
  
  const totalFlowRate = resources
    .map(r => r.flowRate || 0)
    .reduce((sum, rate) => sum + rate, 0);
  
  const totalCapacity = resources
    .map(r => r.capacity || 0)
    .reduce((sum, cap) => sum + cap, 0);
  
  const qualityDistribution = {
    excellent: qualityScores.filter(q => q > 70).length,
    good: qualityScores.filter(q => q >= 40 && q <= 70).length,
    poor: qualityScores.filter(q => q < 40).length,
  };
  
  const typeDistribution: Record<string, number> = {};
  resources.forEach(r => {
    typeDistribution[r.type] = (typeDistribution[r.type] || 0) + 1;
  });
  
  const categoryDistribution: Record<string, number> = {};
  resources.forEach(r => {
    categoryDistribution[r.category] = (categoryDistribution[r.category] || 0) + 1;
  });
  
  const regionalStatsMap: Record<string, { resources: number; totalQuality: number; count: number }> = {};
  resources.forEach(r => {
    if (r.region) {
      if (!regionalStatsMap[r.region]) {
        regionalStatsMap[r.region] = { resources: 0, totalQuality: 0, count: 0 };
      }
      regionalStatsMap[r.region].resources++;
      if (r.qualityIndex !== undefined) {
        regionalStatsMap[r.region].totalQuality += r.qualityIndex;
        regionalStatsMap[r.region].count++;
      }
    }
  });
  
  const regionalStats = Object.entries(regionalStatsMap).map(([region, stats]) => ({
    region,
    resources: stats.resources,
    averageQuality: stats.count > 0 ? stats.totalQuality / stats.count : 0,
  }));
  
  return {
    totalResources,
    countries,
    averageQuality: Math.round(averageQuality * 10) / 10,
    totalFlowRate,
    totalCapacity,
    qualityDistribution,
    typeDistribution,
    categoryDistribution,
    regionalStats,
  };
}

/**
 * Fetch and merge external water data with database resources
 */
export async function fetchEnhancedWaterData(
  dbResources: WaterResource[],
  includeExternal = true
): Promise<{
  resources: WaterResource[];
  metrics: EnhancedWaterMetrics;
  externalData: {
    osm: any[];
    usgs: any[];
    worldBank: any[];
  };
}> {
  try {
    let externalData = {
      osm: [] as any[],
      usgs: [] as any[],
      worldBank: [] as any[],
    };
    
    if (includeExternal) {
      // Fetch external data sources in parallel
      // Note: USGS only works for US regions, so we skip it for global view
      const [osmData, worldBankData] = await Promise.allSettled([
        // OSM for Central Asia region (default, can be made dynamic)
        fetchOSMWaterFeatures([35.0, 55.0, 50.0, 75.0]),
        // World Bank data
        fetchWB(),
      ]);
      
      // USGS is optional and only works for US - skip to avoid errors
      // Uncomment if you need USGS data for specific US regions:
      // const usgsResult = await Promise.allSettled([fetchUSGS(undefined, 'CA')]);
      // if (usgsResult[0].status === 'fulfilled') {
      //   externalData.usgs = usgsResult[0].value;
      // }
      
      if (osmData.status === 'fulfilled') {
        externalData.osm = osmData.value;
      }
      if (worldBankData.status === 'fulfilled') {
        externalData.worldBank = worldBankData.value;
      }
    }
    
    // Calculate metrics from all resources
    const allResources = [
      ...dbResources,
      ...externalData.osm.map(osm => ({
        id: osm.id,
        name: osm.name,
        type: osm.type,
        category: osm.category,
        latitude: osm.latitude,
        longitude: osm.longitude,
        country: osm.country,
        region: osm.region,
        description: osm.description,
        qualityIndex: osm.qualityIndex,
        status: 'active' as const,
      })),
    ];
    
    const metrics = calculateWaterMetrics(allResources);
    
    return {
      resources: dbResources,
      metrics,
      externalData,
    };
  } catch (error) {
    console.error('Error fetching enhanced water data:', error);
    // Return database resources with metrics even if external APIs fail
    return {
      resources: dbResources,
      metrics: calculateWaterMetrics(dbResources),
      externalData: {
        osm: [],
        usgs: [],
        worldBank: [],
      },
    };
  }
}

/**
 * Get real-time water quality trends
 */
export function calculateQualityTrends(
  resources: WaterResource[],
  timeWindow: 'day' | 'week' | 'month' = 'week'
): {
  period: string;
  averageQuality: number;
  change: number;
}[] {
  // This would typically use historical data
  // For now, we'll simulate trends based on current data
  const baseQuality = resources
    .map(r => r.qualityIndex)
    .filter((q): q is number => q !== undefined);
  
  const average = baseQuality.length > 0
    ? baseQuality.reduce((sum, q) => sum + q, 0) / baseQuality.length
    : 0;
  
  // Simulate trend data (in production, this would come from historical records)
  const periods = timeWindow === 'day' ? 7 : timeWindow === 'week' ? 4 : 12;
  const trends = [];
  
  for (let i = periods; i >= 0; i--) {
    const variation = (Math.random() - 0.5) * 10; // ±5% variation
    trends.push({
      period: `${i} ${timeWindow === 'day' ? 'days' : timeWindow === 'week' ? 'weeks' : 'months'} ago`,
      averageQuality: Math.max(0, Math.min(100, average + variation)),
      change: i === periods ? 0 : variation,
    });
  }
  
  return trends.reverse();
}
