/**
 * OpenStreetMap Overpass API Integration
 * https://wiki.openstreetmap.org/wiki/Overpass_API
 */

export interface OSMWaterFeature {
  id: string;
  type: 'node' | 'way' | 'relation';
  name: string;
  waterType: 'river' | 'lake' | 'pond' | 'reservoir' | 'canal' | 'stream' | 'sea';
  latitude: number;
  longitude: number;
  area?: number; // m²
  length?: number; // meters
  tags: Record<string, string>;
}

export interface OSMWaterData {
  id: string;
  name: string;
  type: string;
  category: 'source' | 'object' | 'subject';
  latitude: number;
  longitude: number;
  country?: string;
  region?: string;
  description?: string;
  qualityIndex?: number;
  metadata: {
    source: string;
    osmId: string;
    osmType: string;
    area?: number;
    length?: number;
  };
}

/**
 * Overpass API query for water features
 */
async function queryOverpassAPI(query: string): Promise<any> {
  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(query)}`,
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error querying Overpass API:', error);
    throw error;
  }
}

/**
 * Fetch water features from OpenStreetMap for a bounding box
 */
export async function fetchOSMWaterFeatures(
  bbox: [number, number, number, number], // [minLat, minLon, maxLat, maxLon]
  waterTypes: string[] = ['river', 'lake', 'pond', 'reservoir', 'canal', 'stream']
): Promise<OSMWaterData[]> {
  try {
    const [minLat, minLon, maxLat, maxLon] = bbox;
    
    // Build Overpass QL query
    const waterTypeFilters = waterTypes.map(type => 
      `["natural"="${type}"]`
    ).join('');
    
    const query = `
      [out:json][timeout:25];
      (
        way["natural"~"^(river|lake|pond|reservoir|canal|stream)$"](${minLat},${minLon},${maxLat},${maxLon});
        relation["natural"~"^(river|lake|pond|reservoir|canal|stream)$"](${minLat},${minLon},${maxLat},${maxLon});
        node["natural"~"^(spring|water)$"](${minLat},${minLon},${maxLat},${maxLon});
      );
      out center meta;
    `;
    
    const data = await queryOverpassAPI(query);
    
    if (!data || !data.elements) {
      return [];
    }
    
    const waterFeatures: OSMWaterData[] = [];
    
    data.elements.forEach((element: any) => {
      const tags = element.tags || {};
      const name = tags.name || tags['name:en'] || tags['name:ru'] || 'Unnamed Water Feature';
      const natural = tags.natural || '';
      
      // Determine water type
      let waterType = 'river';
      if (natural.includes('lake')) waterType = 'lake';
      else if (natural.includes('pond')) waterType = 'pond';
      else if (natural.includes('reservoir')) waterType = 'reservoir';
      else if (natural.includes('canal')) waterType = 'canal';
      else if (natural.includes('stream')) waterType = 'stream';
      else if (natural.includes('spring')) waterType = 'stream';
      
      // Get coordinates
      let latitude: number;
      let longitude: number;
      
      if (element.type === 'node') {
        latitude = element.lat;
        longitude = element.lon;
      } else if (element.center) {
        latitude = element.center.lat;
        longitude = element.center.lon;
      } else {
        return; // Skip if no coordinates
      }
      
      // Calculate area/length if available
      let area: number | undefined;
      let length: number | undefined;
      
      if (tags.area) {
        area = parseFloat(tags.area);
      }
      if (tags.length) {
        length = parseFloat(tags.length);
      }
      
      // Determine category
      let category: 'source' | 'object' | 'subject' = 'source';
      if (waterType === 'reservoir' || waterType === 'canal') {
        category = 'object';
      }
      
      waterFeatures.push({
        id: `osm-${element.type}-${element.id}`,
        name,
        type: waterType,
        category,
        latitude,
        longitude,
        country: tags['addr:country'] || tags.iso3166_1,
        region: tags['addr:state'] || tags['addr:region'],
        description: tags.description || tags.note,
        qualityIndex: undefined, // OSM doesn't provide quality data
        metadata: {
          source: 'OpenStreetMap',
          osmId: element.id.toString(),
          osmType: element.type,
          area,
          length,
        },
      });
    });
    
    return waterFeatures;
  } catch (error) {
    console.error('Error fetching OSM water features:', error);
    return [];
  }
}

/**
 * Fetch water features for a specific country (using bounding box)
 */
export async function fetchOSMWaterByCountry(
  countryCode: string,
  bbox?: [number, number, number, number]
): Promise<OSMWaterData[]> {
  // Country bounding boxes (simplified, could use a library)
  const countryBboxes: Record<string, [number, number, number, number]> = {
    'UZ': [37.0, 55.9, 45.6, 73.1], // Uzbekistan
    'KZ': [40.9, 46.4, 55.4, 87.4], // Kazakhstan
    'US': [24.5, -125.0, 49.4, -66.9], // United States
    'RU': [41.2, 19.6, 81.2, 180.0], // Russia
    // Add more as needed
  };
  
  const useBbox = bbox || countryBboxes[countryCode.toUpperCase()];
  
  if (!useBbox) {
    console.warn(`No bounding box available for country: ${countryCode}`);
    return [];
  }
  
  return fetchOSMWaterFeatures(useBbox);
}
