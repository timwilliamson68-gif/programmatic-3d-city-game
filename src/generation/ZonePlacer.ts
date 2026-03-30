import { simplex2D } from '../utils/Noise';
import { CITY_CONFIG, ZoneType, ZONE_TYPES } from '../config/CityConfig';

export class ZonePlacer {
  private static seed: number = CITY_CONFIG.seed;

  public static getZoneType(x: number, z: number): ZoneType {
    const noise = (simplex2D(x * 0.5, z * 0.5) + 1) / 2; // Normalize to [0, 1]
    
    let cumulative = 0;
    const distribution = CITY_CONFIG.zoneDistribution;
    
    if (noise < (cumulative += distribution.commercial)) return 'commercial';
    if (noise < (cumulative += distribution.residential)) return 'residential';
    if (noise < (cumulative += distribution.industrial)) return 'industrial';
    return 'park';
  }
}
