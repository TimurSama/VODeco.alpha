# VODeco API Integration Guide

## Current Data Sources

### 1. Internal Database (Primary)
- **Type**: PostgreSQL
- **Data**: User-generated water resources, projects, staking, news
- **Update**: Real-time via Prisma ORM
- **Endpoints**: `/api/water-resources`, `/api/projects`, `/api/news`, `/api/wallet`

### 2. OpenStreetMap Overpass API
- **URL**: `https://overpass-api.de/api/interpreter`
- **Data**: Water bodies, rivers, lakes, infrastructure
- **Status**: ✅ Integrated
- **Use Case**: Geographic data supplementation

## External APIs (Ready for Integration)

### Water Resources & Quality

#### World Bank Water Data API
- **URL**: `https://api.worldbank.org/v2/country/{country}/indicator/{indicator}`
- **Indicators**:
  - `SH.H2O.SAFE.ZS` - Access to safe water
  - `SH.STA.BASS.ZS` - Access to basic sanitation
  - `ER.H2O.INTR.PC` - Water withdrawals per capita
- **Status**: 🔄 Ready for integration
- **Implementation**: `src/lib/api/water-data-sources.ts`

#### USGS Water Services
- **URL**: `https://waterservices.usgs.gov/nwis/`
- **Endpoints**:
  - `/iv/` - Instantaneous values
  - `/dv/` - Daily values
  - `/site/` - Site information
- **Status**: 🔄 Ready for integration
- **Coverage**: United States

#### Global Water Watch API
- **URL**: `https://www.globalwaterwatch.org/api`
- **Data**: Real-time water quality, flow rates
- **Status**: 📋 Planned

### News & Research

#### NewsAPI
- **URL**: `https://newsapi.org/v2/everything`
- **Query**: `q=water OR ecology OR environment`
- **Status**: ✅ Integrated in `src/lib/api/water-data-sources.ts`
- **API Key**: Set `NEWS_API_KEY` in `.env`

#### Google News RSS
- **URL**: `https://news.google.com/rss/search`
- **Status**: ✅ Fallback implemented
- **Use Case**: News feed when NewsAPI unavailable

### Satellite & Remote Sensing

#### NASA Earthdata API
- **URL**: `https://earthdata.nasa.gov/api`
- **Datasets**: MODIS, Landsat, GRACE
- **Status**: 📋 Planned

## Implementation Status

### ✅ Completed
- OpenStreetMap integration
- NewsAPI integration (with RSS fallback)
- Database API routes
- News seeding with 2026 articles

### 🔄 In Progress
- World Bank API integration
- USGS Water Services integration
- Real-time data updates

### 📋 Planned
- NASA Earthdata integration
- FAO AQUASTAT API
- Sentinel Hub API
- IoT sensor data integration

## Environment Variables

Add to `.env.local`:
```env
NEWS_API_KEY=your_newsapi_key_here
```

## Data Caching

- **Real-time data**: 5 minutes cache
- **Daily updates**: 1 hour cache
- **Annual data**: 24 hours cache
- **Static data**: Indefinite cache

## Error Handling

- Automatic fallback to cached data
- Retry with exponential backoff
- User notification for stale data
- Offline mode support
