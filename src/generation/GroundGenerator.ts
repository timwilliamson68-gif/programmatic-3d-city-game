import * as THREE from 'three';
import { CITY_CONFIG } from '../config/CityConfig';
import { simplex2D } from '../utils/Noise';
import { MATERIALS } from '../rendering/Materials';
import { isOnRoad } from '../utils/RoadLayout';

export function createGround(scene: THREE.Scene): void {
  const { mapSize, terrainAmplitude, enableTerrain } = CITY_CONFIG;
  const segments = 128;
  const geometry = new THREE.PlaneGeometry(mapSize, mapSize, segments, segments);
  geometry.rotateX(-Math.PI / 2);

  const vertices = geometry.attributes.position.array as Float32Array;

  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const z = vertices[i + 2];

    if (enableTerrain) {
      if (isOnRoad(x, z)) {
        vertices[i + 1] = 0;
      } else {
        const noise = simplex2D(x * 0.002, z * 0.002);
        vertices[i + 1] = Math.max(0, noise * terrainAmplitude);
      }
    } else {
      vertices[i + 1] = 0;
    }
  }

  geometry.computeVertexNormals();
  const ground = new THREE.Mesh(geometry, MATERIALS.asphalt);
  ground.position.y = -0.01;
  scene.add(ground);
}

export function getGroundHeight(x: number, z: number): number {
  if (!CITY_CONFIG.enableTerrain) return 0;
  const { terrainAmplitude } = CITY_CONFIG;
  if (isOnRoad(x, z)) return 0;
  const noise = simplex2D(x * 0.002, z * 0.002);
  return Math.max(0, noise * terrainAmplitude);
}
