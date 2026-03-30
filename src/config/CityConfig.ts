export type ZoneType = 'commercial' | 'residential' | 'industrial' | 'park';

export const CITY_CONFIG = {
  mapSize: 2000,
  gridSize: 5,
  roadWidth: 20,
  subRoadWidth: 10,
  seed: 42,
  zoneDistribution: {
    commercial: 0.35,
    residential: 0.30,
    industrial: 0.20,
    park: 0.15,
  },
  buildingHeights: {
    commercial: { min: 80, max: 200 },
    residential: { min: 30, max: 80 },
    industrial: { min: 10, max: 30 },
    park: { min: 0, max: 0 },
  },
};

export const ZONE_TYPES: ZoneType[] = ['commercial', 'residential', 'industrial', 'park'];
