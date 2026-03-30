export const CITY_CONFIG = {
  mapSize: 2000, // 地图边长（米）
  gridSize: 10, // 主干道网格数
  roadWidth: 20, // 主干道宽度
  subRoadWidth: 10, // 辅路宽度
  buildingZoneTypes: ['commercial', 'residential', 'industrial', 'park'] as const,
  seed: 42,
};
