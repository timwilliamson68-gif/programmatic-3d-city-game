import { CITY_CONFIG } from '../config/CityConfig';
import { simplex2D } from './Noise';

export interface RoadInfo {
  x: number;
  z: number;
  width: number;
  length: number;
  isHorizontal: boolean;
}

function makeRNG(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
    s ^= s >>> 16;
    return (s >>> 0) / 0xffffffff;
  };
}

let cachedRoads: RoadInfo[] | null = null;
let lastSeed: number | null = null;

export function getRoadLayout(): RoadInfo[] {
  if (cachedRoads && lastSeed === CITY_CONFIG.seed) {
    return cachedRoads;
  }

  const roads: RoadInfo[] = [];
  const { mapSize, gridSize, roadWidth } = CITY_CONFIG;
  const half = mapSize / 2;
  const cellSize = mapSize / gridSize;
  const rng = makeRNG(CITY_CONFIG.seed);
  lastSeed = CITY_CONFIG.seed;

  for (let i = 0; i <= gridSize; i++) {
    const offset = -half + i * cellSize;
    roads.push({ x: offset, z: 0, width: roadWidth, length: mapSize, isHorizontal: false });
    roads.push({ x: 0, z: offset, width: roadWidth, length: mapSize, isHorizontal: true });
  }

  for (let gi = 0; gi < gridSize; gi++) {
    for (let gj = 0; gj < gridSize; gj++) {
      const cellX = -half + gi * cellSize + cellSize / 2;
      const cellZ = -half + gj * cellSize + cellSize / 2;
      const subCount = Math.floor(simplex2D(gi * 0.5, gj * 0.5) + 2.5);

      for (let k = 0; k < subCount; k++) {
        const isHorizontal = rng() > 0.5;
        const spread = (rng() - 0.5) * cellSize * 0.6;
        const length = cellSize * 0.8;
        const actualWidth = 15 + rng() * 10;

        if (isHorizontal) {
          roads.push({ x: cellX, z: cellZ + spread, width: actualWidth, length: length, isHorizontal: true });
        } else {
          roads.push({ x: cellX + spread, z: cellZ, width: actualWidth, length: length, isHorizontal: false });
        }
      }
    }
  }

  cachedRoads = roads;
  return roads;
}

export function isOnRoad(x: number, z: number): boolean {
  const roads = getRoadLayout();
  for (const road of roads) {
    if (road.isHorizontal) {
      if (Math.abs(z - road.z) < road.width / 2 && Math.abs(x - road.x) < road.length / 2) {
        return true;
      }
    } else {
      if (Math.abs(x - road.x) < road.width / 2 && Math.abs(z - road.z) < road.length / 2) {
        return true;
      }
    }
  }
  return false;
}
