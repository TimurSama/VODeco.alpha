/**
 * World Bank Water Data API Integration
 * https://datahelpdesk.worldbank.org/knowledgebase/articles/889392
 */

export interface WorldBankIndicator {
  indicator: {
    id: string;
    value: string;
  };
  country: {
    id: string;
    value: string;
  };
  countryiso3code: string;
  date: string;
  value: number | null;
  unit: string;
  obs_status: string;
  decimal: number;
}

export interface WorldBankWaterData {
  country: string;
  countryCode: string;
  accessToSafeWater: number | null;
  accessToSanitation: number | null;
  waterWithdrawalsPerCapita: number | null;
  year: string;
  metadata: {
    indicator: string;
    source: string;
  };
}

const WATER_INDICATORS = {
  SAFE_WATER: 'SH.H2O.SAFE.ZS', // Access to safe water (% of population)
  SANITATION: 'SH.STA.BASS.ZS', // Access to basic sanitation (% of population)
  WATER_WITHDRAWALS: 'ER.H2O.INTR.PC', // Water withdrawals per capita (m³)
  WATER_STRESS: 'ER.H2O.FWTL.ZS', // Freshwater withdrawals as % of total renewable water resources
  WATER_QUALITY: 'EN.WAT.SCAR.ZS', // Water scarcity index
};

/**
 * Fetch World Bank water data for a specific country or all countries
 */
export async function fetchWorldBankWaterData(
  countryCode?: string,
  year?: string
): Promise<WorldBankWaterData[]> {
  try {
    const country = countryCode || 'all';
    const dateRange = year ? `${year}:${year}` : '2020:2024';
    
    // Fetch all water indicators
    const indicators = Object.values(WATER_INDICATORS).join(';');
    const url = `https://api.worldbank.org/v2/country/${country}/indicator/${indicators}?format=json&date=${dateRange}&per_page=1000`;
    
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`World Bank API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !Array.isArray(data) || data.length < 2) {
      return [];
    }
    
    const [metadata, indicatorsData] = data;
    
    if (!Array.isArray(indicatorsData)) {
      return [];
    }
    
    // Group data by country and year
    const countryDataMap = new Map<string, Partial<WorldBankWaterData>>();
    
    indicatorsData.forEach((item: WorldBankIndicator) => {
      if (!item.value || !item.countryiso3code) return;
      
      const key = `${item.countryiso3code}-${item.date}`;
      
      if (!countryDataMap.has(key)) {
        countryDataMap.set(key, {
          country: item.country.value,
          countryCode: item.countryiso3code,
          year: item.date,
        });
      }
      
      const countryData = countryDataMap.get(key)!;
      
      switch (item.indicator.id) {
        case WATER_INDICATORS.SAFE_WATER:
          countryData.accessToSafeWater = item.value;
          break;
        case WATER_INDICATORS.SANITATION:
          countryData.accessToSanitation = item.value;
          break;
        case WATER_INDICATORS.WATER_WITHDRAWALS:
          countryData.waterWithdrawalsPerCapita = item.value;
          break;
      }
      
      countryData.metadata = {
        indicator: item.indicator.value,
        source: 'World Bank',
      };
    });
    
    return Array.from(countryDataMap.values())
      .filter((data): data is WorldBankWaterData => 
        data.country !== undefined && 
        data.countryCode !== undefined &&
        (data.accessToSafeWater !== null || 
         data.accessToSanitation !== null || 
         data.waterWithdrawalsPerCapita !== null)
      )
      .map(data => ({
        ...data,
        accessToSafeWater: data.accessToSafeWater ?? null,
        accessToSanitation: data.accessToSanitation ?? null,
        waterWithdrawalsPerCapita: data.waterWithdrawalsPerCapita ?? null,
      }));
  } catch (error) {
    console.error('Error fetching World Bank water data:', error);
    return [];
  }
}

/**
 * Get water stress level for a country
 */
export async function getWaterStressLevel(countryCode: string): Promise<{
  level: 'low' | 'moderate' | 'high' | 'critical';
  percentage: number | null;
}> {
  try {
    const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${WATER_INDICATORS.WATER_STRESS}?format=json&date=2020:2024&per_page=1`;
    
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) return { level: 'low', percentage: null };
    
    const data = await response.json();
    if (!data || !Array.isArray(data) || data.length < 2) {
      return { level: 'low', percentage: null };
    }
    
    const indicators = data[1];
    if (!Array.isArray(indicators) || indicators.length === 0) {
      return { level: 'low', percentage: null };
    }
    
    const latest = indicators[0];
    const percentage = latest.value;
    
    if (percentage === null) {
      return { level: 'low', percentage: null };
    }
    
    let level: 'low' | 'moderate' | 'high' | 'critical';
    if (percentage < 25) level = 'low';
    else if (percentage < 50) level = 'moderate';
    else if (percentage < 75) level = 'high';
    else level = 'critical';
    
    return { level, percentage };
  } catch (error) {
    console.error('Error fetching water stress level:', error);
    return { level: 'low', percentage: null };
  }
}
