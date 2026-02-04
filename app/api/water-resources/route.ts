import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { fetchOSMWaterFeatures } from '@/lib/api/overpass-api';
import { fetchUSGSWaterData } from '@/lib/api/usgs-water-api';
import { fetchWorldBankWaterData } from '@/lib/api/world-bank-api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const country = searchParams.get('country');
    const region = searchParams.get('region');
    const minQuality = searchParams.get('minQuality');
    const status = searchParams.get('status');

    const where: any = {};

    if (type) {
      const types = type.split(',');
      where.type = { in: types };
    }

    if (category) {
      const categories = category.split(',');
      where.category = { in: categories };
    }

    if (country) {
      where.country = country;
    }

    if (region) {
      where.region = region;
    }

    if (minQuality) {
      where.qualityIndex = { gte: parseInt(minQuality) };
    }

    if (status) {
      where.status = status;
    }

    // Fetch from database
    const dbResources = await prisma.waterResource.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });

    // Check if we should fetch external data
    const includeExternal = searchParams.get('external') === 'true';
    
    if (includeExternal) {
      try {
        // Fetch from external sources in parallel
        const [osmData, usgsData, wbData] = await Promise.allSettled([
          // OSM for Central Asia region (can be made dynamic)
          fetchOSMWaterFeatures([35.0, 55.0, 50.0, 75.0]),
          // USGS for US (can be filtered by bbox if needed)
          fetchUSGSWaterData(),
          // World Bank data
          fetchWorldBankWaterData(),
        ]);

        // Transform and merge external data
        const externalResources: any[] = [];

        // OSM data
        if (osmData.status === 'fulfilled') {
          externalResources.push(...osmData.value.map(osm => ({
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
            status: 'active',
            metadata: { ...osm.metadata, external: true },
          })));
        }

        // USGS data
        if (usgsData.status === 'fulfilled') {
          externalResources.push(...usgsData.value.map(usgs => ({
            id: usgs.id,
            name: usgs.name,
            type: usgs.type,
            category: 'object' as const,
            latitude: usgs.latitude,
            longitude: usgs.longitude,
            country: 'United States',
            region: usgs.state,
            description: `USGS monitoring site: ${usgs.name}`,
            qualityIndex: undefined,
            flowRate: usgs.flowRate,
            status: 'active',
            metadata: { ...usgs.metadata, external: true },
          })));
        }

        // Combine all resources
        const allResources = [...dbResources, ...externalResources];
        
        // Apply filters to external data too
        let filtered = allResources;
        if (type) {
          const types = type.split(',');
          filtered = filtered.filter(r => types.includes(r.type));
        }
        if (category) {
          const categories = category.split(',');
          filtered = filtered.filter(r => categories.includes(r.category));
        }
        if (country) {
          filtered = filtered.filter(r => r.country === country);
        }
        if (minQuality) {
          const minQ = parseInt(minQuality);
          filtered = filtered.filter(r => !r.qualityIndex || r.qualityIndex >= minQ);
        }

        return NextResponse.json(filtered.slice(0, 1000));
      } catch (error) {
        console.error('Error fetching external water resources:', error);
        // Return database resources even if external fetch fails
      }
    }

    return NextResponse.json(dbResources);
  } catch (error) {
    console.error('Error fetching water resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch water resources' },
      { status: 500 }
    );
  }
}
