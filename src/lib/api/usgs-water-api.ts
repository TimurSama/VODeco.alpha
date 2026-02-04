/**
 * USGS Water Services API Integration
 * https://waterservices.usgs.gov/
 */

export interface USGSWaterSite {
  siteCode: string;
  siteName: string;
  latitude: number;
  longitude: number;
  stateCode: string;
  countyCode: string;
  parameter: {
    code: string;
    name: string;
    unit: string;
  };
  values: {
    dateTime: string;
    value: number;
    qualifiers?: string[];
  }[];
}

export interface USGSWaterData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'river' | 'lake' | 'groundwater' | 'stream';
  flowRate?: number; // m³/s
  waterLevel?: number; // meters
  temperature?: number; // Celsius
  lastUpdated: string;
  state: string;
  county: string;
  metadata: {
    source: string;
    siteCode: string;
    parameter: string;
  };
}

/**
 * Fetch USGS water data for a bounding box or state
 */
export async function fetchUSGSWaterData(
  bbox?: [number, number, number, number],
  stateCode?: string
): Promise<USGSWaterData[]> {
  try {
    // USGS API requires at least one filter (state, bbox, or site)
    // If no filter provided, return empty array (US data only)
    if (!bbox && !stateCode) {
      // Default to a small region to avoid too many results
      // Using California as default example
      stateCode = 'CA';
    }
    
    let url = 'https://waterservices.usgs.gov/nwis/iv/?format=json';
    
    // Add bounding box or state filter
    if (bbox) {
      // bBox format: west,south,east,north
      url += `&bBox=${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]}`;
    } else if (stateCode) {
      url += `&stateCd=${stateCode}`;
    }
    
    // Request common parameters
    // 00060 = Discharge (flow rate)
    // 00065 = Gage height (water level)
    // 00010 = Temperature
    url += '&parameterCd=00060,00065,00010';
    
    // Limit results and ensure we get data
    url += '&siteStatus=all';
    
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes (real-time data)
    });
    
    if (!response.ok) {
      // Don't throw error, just return empty array
      // USGS API may not be available or may require specific parameters
      console.warn(`USGS API returned ${response.status}, skipping USGS data`);
      return [];
    }
    
    const data = await response.json();
    
    if (!data || !data.value || !data.value.timeSeries) {
      return [];
    }
    
    const timeSeries = data.value.timeSeries;
    const sitesMap = new Map<string, Partial<USGSWaterData>>();
    
    timeSeries.forEach((series: any) => {
      const sourceInfo = series.sourceInfo;
      const siteCode = sourceInfo.siteCode[0].value;
      const siteName = sourceInfo.siteName;
      const latitude = parseFloat(sourceInfo.geoLocation.geogLocation.latitude);
      const longitude = parseFloat(sourceInfo.geoLocation.geogLocation.longitude);
      
      if (!sitesMap.has(siteCode)) {
        sitesMap.set(siteCode, {
          id: `usgs-${siteCode}`,
          name: siteName,
          latitude,
          longitude,
          type: 'river', // Default, could be determined from site name
          state: sourceInfo.siteProperty?.find((p: any) => p.name === 'stateCd')?.value || '',
          county: sourceInfo.siteProperty?.find((p: any) => p.name === 'countyCd')?.value || '',
          lastUpdated: new Date().toISOString(),
          metadata: {
            source: 'USGS',
            siteCode,
            parameter: '',
          },
        });
      }
      
      const site = sitesMap.get(siteCode)!;
      const variable = series.variable;
      const values = series.values[0]?.value || [];
      
      if (values.length > 0) {
        const latestValue = values[values.length - 1];
        const value = parseFloat(latestValue.value);
        const dateTime = latestValue.dateTime;
        
        // Update last updated time
        if (new Date(dateTime) > new Date(site.lastUpdated || '')) {
          site.lastUpdated = dateTime;
        }
        
        // Map parameter codes to properties
        const paramCode = variable.variableCode[0].value;
        switch (paramCode) {
          case '00060': // Discharge (flow rate) in ft³/s, convert to m³/s
            site.flowRate = value * 0.0283168; // Convert ft³/s to m³/s
            site.metadata!.parameter = 'Flow Rate';
            break;
          case '00065': // Gage height in feet, convert to meters
            site.waterLevel = value * 0.3048; // Convert feet to meters
            site.metadata!.parameter = 'Water Level';
            break;
          case '00010': // Temperature in Celsius
            site.temperature = value;
            site.metadata!.parameter = 'Temperature';
            break;
        }
      }
    });
    
    return Array.from(sitesMap.values())
      .filter((site): site is USGSWaterData => 
        site.id !== undefined && 
        site.name !== undefined &&
        site.latitude !== undefined &&
        site.longitude !== undefined
      )
      .map(site => ({
        ...site,
        flowRate: site.flowRate,
        waterLevel: site.waterLevel,
        temperature: site.temperature,
      }));
  } catch (error) {
    console.error('Error fetching USGS water data:', error);
    return [];
  }
}

/**
 * Get USGS sites for a specific state
 */
export async function getUSGSSitesByState(stateCode: string): Promise<USGSWaterData[]> {
  return fetchUSGSWaterData(undefined, stateCode);
}
