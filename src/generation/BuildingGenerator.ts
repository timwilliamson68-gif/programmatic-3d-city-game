import * as THREE from 'three';
import { CITY_CONFIG } from '../config/CityConfig';
import { NEON_COLORS } from '../utils/ColorPalette';
import { randomRange } from '../utils/MathUtils';
import { simplex2D } from '../utils/Noise';

function makeRNG(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
    s ^= s >>> 16;
    return (s >>> 0) / 0xffffffff;
  };
}

const rng = makeRNG(CITY_CONFIG.seed + 1);

function randomNeon(): string {
  return NEON_COLORS[Math.floor(rng() * NEON_COLORS.length)];
}

function hexToInt(hex: string): number {
  return parseInt(hex.replace('#', ''), 16);
}

export function createBuildings(scene: THREE.Scene): void {
  const { mapSize, gridSize, roadWidth } = CITY_CONFIG;
  const half = mapSize / 2;
  const cellSize = mapSize / gridSize;

  const buildingMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a22,
    roughness: 0.6,
    metalness: 0.4,
  });

  const windowMat = new THREE.MeshStandardMaterial({
    color: 0x334455,
    roughness: 0.3,
    metalness: 0.8,
    emissive: 0x112233,
    emissiveIntensity: 0.3,
  });

  // Buildings placed along main roads (both sides)
  const buildings: THREE.Mesh[] = [];

  for (let i = 0; i <= gridSize; i++) {
    const roadPos = -half + i * cellSize;
    const sideOffset = roadWidth / 2 + 5;

    // How many buildings along this road strip
    const numBuildings = Math.floor(6 + rng() * 8);

    for (let b = 0; b < numBuildings; b++) {
      // Position along the road (spread across map)
      const alongRoad = -half + (b / numBuildings) * mapSize;

      // Left side
      const height = randomRange(40, 100);
      const width = randomRange(12, 30);
      const depth = randomRange(12, 30);

      const buildingGeo = new THREE.BoxGeometry(width, height, depth);

      // Mix of building and window materials
      const useWindow = rng() > 0.5;
      const mat = useWindow ? windowMat.clone() : buildingMat.clone();
      if (useWindow) {
        (mat as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x112244);
        (mat as THREE.MeshStandardMaterial).emissiveIntensity = 0.3;
      }

      const building = new THREE.Mesh(buildingGeo, mat);
      const xPos = roadPos - sideOffset - width / 2 - rng() * 5;
      building.position.set(xPos, height / 2, alongRoad + (rng() - 0.5) * 20);
      scene.add(building);
      buildings.push(building);

      // Add neon signs (3–5 layers on the building face)
      const numSigns = Math.floor(randomRange(3, 6));
      for (let s = 0; s < numSigns; s++) {
        const signColor = randomNeon();
        const signMat = new THREE.MeshStandardMaterial({
          color: signColor,
          emissive: new THREE.Color(hexToInt(signColor)),
          emissiveIntensity: 2.0,
          roughness: 0.2,
          metalness: 0.1,
        });

        const signW = randomRange(width * 0.4, width * 0.9);
        const signH = 1.5;
        const signGeo = new THREE.PlaneGeometry(signW, signH);
        const sign = new THREE.Mesh(signGeo, signMat);

        // Place on the front face (facing +z or -z randomly)
        const faceSide = rng() > 0.5 ? 1 : -1;
        const signY = randomRange(5, height - 5);
        sign.position.set(
          building.position.x + (rng() - 0.5) * width * 0.5,
          signY,
          building.position.z + faceSide * (depth / 2 + 0.1)
        );
        scene.add(sign);
      }

      // Right side
      const height2 = randomRange(40, 100);
      const width2 = randomRange(12, 30);
      const depth2 = randomRange(12, 30);

      const building2 = new THREE.Mesh(
        new THREE.BoxGeometry(width2, height2, depth2),
        rng() > 0.5 ? windowMat.clone() : buildingMat.clone()
      );
      const xPos2 = roadPos + sideOffset + width2 / 2 + rng() * 5;
      building2.position.set(xPos2, height2 / 2, alongRoad + (rng() - 0.5) * 20);
      scene.add(building2);

      // Neon signs on right side building
      const numSigns2 = Math.floor(randomRange(3, 6));
      for (let s = 0; s < numSigns2; s++) {
        const signColor = randomNeon();
        const signMat = new THREE.MeshStandardMaterial({
          color: signColor,
          emissive: new THREE.Color(hexToInt(signColor)),
          emissiveIntensity: 2.0,
          roughness: 0.2,
          metalness: 0.1,
        });

        const signW = randomRange(width2 * 0.4, width2 * 0.9);
        const signGeo = new THREE.PlaneGeometry(signW, 1.5);
        const sign = new THREE.Mesh(signGeo, signMat);
        const faceSide = rng() > 0.5 ? 1 : -1;
        sign.position.set(
          building2.position.x + (rng() - 0.5) * width2 * 0.5,
          randomRange(5, height2 - 5),
          building2.position.z + faceSide * (depth2 / 2 + 0.1)
        );
        scene.add(sign);
      }
    }
  }
}
