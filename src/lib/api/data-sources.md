# Data Sources & APIs for VODeco

## Current Data Sources

### 1. Database (Primary)
- **Source**: PostgreSQL
- **Data**: User-generated water resources, projects, staking data
- **Update**: Real-time via Prisma ORM

### 2. OpenStreetMap Overpass API
- **URL**: `https://overpass-api.de/api/interpreter`
- **Data**: Water bodies, rivers, lakes, infrastructure
- **Format**: GeoJSON
- **Rate Limit**: Moderate
- **Use Case**: Supplementing database with geographic data

## Recommended Additional APIs

### Water Resources & Quality

#### 1. Global Water Watch API
- **URL**: `https://www.globalwaterwatch.org/api`
- **Data**: Real-time water quality, flow rates, satellite imagery
- **Update Frequency**: Real-time
- **Coverage**: Global
- **Use Case**: Water quality indices, flow rates

#### 2. World Bank Water Data API
- **URL**: `https://api.worldbank.org/v2/country/all/indicator`
- **Data**: Water access, sanitation, infrastructure investments
- **Indicators**: 
  - `SH.H2O.SAFE.ZS` - Access to safe water
  - `SH.STA.BASS.ZS` - Access to basic sanitation
  - `ER.H2O.INTR.PC` - Water withdrawals per capita
- **Update Frequency**: Annual
- **Use Case**: Economic and social metrics

#### 3. UNESCO Water Portal API
- **URL**: `https://www.unesco.org/water/wwap/api`
- **Data**: Water resources management, policy data
- **Update Frequency**: Quarterly
- **Use Case**: Policy and governance metrics

#### 4. USGS Water Services
- **URL**: `https://waterservices.usgs.gov/nwis/`
- **Data**: Real-time and historical water data (US)
- **Endpoints**:
  - `/iv/` - Instantaneous values
  - `/dv/` - Daily values
  - `/site/` - Site information
- **Update Frequency**: Real-time
- **Coverage**: United States
- **Use Case**: Detailed US water resource data

#### 5. NOAA Water Data
- **URL**: `https://api.tidesandcurrents.noaa.gov/api/prod/`
- **Data**: Tides, currents, water levels
- **Update Frequency**: Real-time
- **Coverage**: Coastal areas (US)
- **Use Case**: Coastal water resources

#### 6. European Environment Agency (EEA) Water API
- **URL**: `https://www.eea.europa.eu/data-and-maps/data/api`
- **Data**: European water quality, quantity, management
- **Update Frequency**: Annual/Quarterly
- **Coverage**: Europe
- **Use Case**: European water resources

#### 7. FAO AQUASTAT API
- **URL**: `https://www.fao.org/aquastat/en/data/api`
- **Data**: Global water statistics, irrigation, agriculture
- **Update Frequency**: Annual
- **Coverage**: Global
- **Use Case**: Agricultural water use, irrigation data

### News & Research APIs

#### 8. NewsAPI
- **URL**: `https://newsapi.org/v2/everything`
- **Data**: News articles about water, ecology, environment
- **Query**: `q=water OR ecology OR environment OR climate`
- **Update Frequency**: Real-time
- **Use Case**: News feed updates

#### 9. Google News RSS
- **URL**: `https://news.google.com/rss/search`
- **Data**: News articles
- **Query**: `q=water+resources+ecology`
- **Update Frequency**: Real-time
- **Use Case**: News aggregation

#### 10. ArXiv API (Research)
- **URL**: `https://export.arxiv.org/api/query`
- **Data**: Research papers on water resources, ecology
- **Query**: `search_query=cat:physics.ao-ph+OR+cat:q-bio+AND+water`
- **Update Frequency**: Daily
- **Use Case**: Research news and publications

#### 11. PubMed API (Research)
- **URL**: `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/`
- **Data**: Scientific publications
- **Query**: Water resources, ecology, environmental science
- **Update Frequency**: Daily
- **Use Case**: Scientific research news

### Satellite & Remote Sensing

#### 12. NASA Earthdata API
- **URL**: `https://earthdata.nasa.gov/api`
- **Data**: Satellite imagery, water body detection
- **Datasets**: MODIS, Landsat, GRACE
- **Update Frequency**: Daily
- **Use Case**: Satellite imagery, water body monitoring

#### 13. Sentinel Hub API
- **URL**: `https://services.sentinel-hub.com/api/v1/`
- **Data**: High-resolution satellite imagery
- **Update Frequency**: Weekly
- **Use Case**: Detailed water resource visualization

### IoT & Sensor Data

#### 14. ThingSpeak API
- **URL**: `https://api.thingspeak.com/channels/`
- **Data**: IoT sensor data (water quality, flow)
- **Update Frequency**: Real-time
- **Use Case**: Real-time sensor data integration

#### 15. OpenWeatherMap Water API
- **URL**: `https://api.openweathermap.org/data/2.5/`
- **Data**: Weather, precipitation, water-related weather data
- **Update Frequency**: Real-time
- **Use Case**: Weather impact on water resources

## Implementation Priority

### Phase 1 (Immediate)
1. World Bank Water Data API
2. NewsAPI for news feed
3. Global Water Watch API (if available)

### Phase 2 (Short-term)
4. USGS Water Services (for US data)
5. FAO AQUASTAT API
6. NASA Earthdata API

### Phase 3 (Long-term)
7. Sentinel Hub API
8. IoT sensor integrations
9. Custom data aggregation

## Data Caching Strategy

- **Real-time data**: Cache for 5 minutes
- **Daily updates**: Cache for 1 hour
- **Annual data**: Cache for 24 hours
- **Static data**: Cache indefinitely

## Error Handling

- Fallback to cached data on API failure
- Retry mechanism with exponential backoff
- User notification for stale data
- Offline mode with cached data
