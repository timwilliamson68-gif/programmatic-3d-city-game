import * as THREE from 'three';
import { CITY_CONFIG, ZoneType } from '../config/CityConfig';
import { NEON_COLORS } from '../utils/ColorPalette';
import { ZonePlacer } from './ZonePlacer';

function makeRNG(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
    s ^= s >>> 16;
    return (s >>> 0) / 0xffffffff;
  };
}

export function createBuildings(scene: THREE.Scene): void {
  const rng = makeRNG(CITY_CONFIG.seed + 1);
  const { mapSize, gridSize, roadWidth } = CITY_CONFIG;
  const half = mapSize / 2;
  const cellSize = mapSize / gridSize;

  const buildingCount = 200;

  const materials: Record<Exclude<ZoneType, 'park'>, THREE.MeshStandardMaterial> = {
    commercial: new THREE.MeshStandardMaterial({ color: 0x444466, metalness: 0.8, roughness: 0.2 }),
    residential: new THREE.MeshStandardMaterial({ color: 0x664444, metalness: 0.1, roughness: 0.9 }),
    industrial: new THREE.MeshStandardMaterial({ color: 0x446644, metalness: 0.4, roughness: 0.6 }),
  };

  const instancedMeshes: Record<Exclude<ZoneType, 'park'>, THREE.InstancedMesh> = {
    commercial: new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), materials.commercial, buildingCount),
    residential: new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), materials.residential, buildingCount),
    industrial: new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), materials.industrial, buildingCount),
  };

  const counts: Record<Exclude<ZoneType, 'park'>, number> = {
    commercial: 0,
    residential: 0,
    industrial: 0,
  };

  const maxWindows = buildingCount * 40;
  const windowMat = new THREE.MeshStandardMaterial({
    color: 0x334455,
    emissive: 0x334455,
    emissiveIntensity: 1.0,
  });
  const instancedWindows = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(1, 1),
    windowMat,
    maxWindows
  );

  const neonMeshes: Record<string, THREE.InstancedMesh> = {};
  const neonCounts: Record<string, number> = {};
  const maxSignsPerColor = buildingCount * 5;

  NEON_COLORS.forEach(color => {
    const mat = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 3.0,
    });
    neonMeshes[color] = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(1, 1),
      mat,
      maxSignsPerColor
    );
    neonCounts[color] = 0;
    scene.add(neonMeshes[color]);
  });

  const dummy = new THREE.Object3D();
  let windowIdx = 0;

  for (let i = 0; i < buildingCount; i++) {
    const gi = Math.floor(rng() * gridSize);
    const gj = Math.floor(rng() * gridSize);
    const zone = ZonePlacer.getZoneType(gi, gj);

    if (zone === 'park') continue;

    const cellX = -half + gi * cellSize + cellSize / 2;
    const cellZ = -half + gj * cellSize + cellSize / 2;

    const x = cellX + (rng() - 0.5) * (cellSize - roadWidth - 20);
    const z = cellZ + (rng() - 0.5) * (cellSize - roadWidth - 20);

    const heightRange = CITY_CONFIG.buildingHeights[zone];
    const height = heightRange.min + rng() * (heightRange.max - heightRange.min);
    const width = 15 + rng() * 25;
    const depth = 15 + rng() * 25;

    dummy.position.set(x, height / 2, z);
    dummy.scale.set(width, height, depth);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    instancedMeshes[zone].setMatrixAt(counts[zone]++, dummy.matrix);

    const windowCount = 10 + Math.floor(rng() * 20);
    for (let w = 0; w < windowCount; w++) {
      if (windowIdx >= maxWindows) break;
      const face = Math.floor(rng() * 4);
      const hLevel = 0.1 + rng() * 0.8;
      const sidePos = (rng() - 0.5) * 0.8;

      dummy.scale.set(1.5, 1, 1);
      if (face === 0) {
        dummy.position.set(x + sidePos * width, height * hLevel, z + depth / 2 + 0.1);
        dummy.rotation.set(0, 0, 0);
      } else if (face === 1) {
        dummy.position.set(x + sidePos * width, height * hLevel, z - depth / 2 - 0.1);
        dummy.rotation.set(0, Math.PI, 0);
      } else if (face === 2) {
        dummy.position.set(x + width / 2 + 0.1, height * hLevel, z + sidePos * depth);
        dummy.rotation.set(0, Math.PI / 2, 0);
      } else {
        dummy.position.set(x - width / 2 - 0.1, height * hLevel, z + sidePos * depth);
        dummy.rotation.set(0, -Math.PI / 2, 0);
      }
      dummy.updateMatrix();
      instancedWindows.setMatrixAt(windowIdx++, dummy.matrix);
    }

    if (zone === 'commercial') {
      const neonCount = 2 + Math.floor(rng() * 3);
      for (let n = 0; n < neonCount; n++) {
        const color = NEON_COLORS[Math.floor(rng() * NEON_COLORS.length)];
        if (neonCounts[color] >= maxSignsPerColor) continue;

        const signW = 5 + rng() * 10;
        const signH = 1 + rng() * 2;
        const face = Math.floor(rng() * 4);
        const sy = rng() * height;
        const offset = (rng() - 0.5) * 0.6;

        dummy.scale.set(signW, signH, 1);
        if (face === 0) {
          dummy.position.set(x + offset * width, sy, z + depth / 2 + 0.2);
          dummy.rotation.set(0, 0, 0);
        } else if (face === 1) {
          dummy.position.set(x + offset * width, sy, z - depth / 2 - 0.2);
          dummy.rotation.set(0, Math.PI, 0);
        } else if (face === 2) {
          dummy.position.set(x + width / 2 + 0.2, sy, z + offset * depth);
          dummy.rotation.set(0, Math.PI / 2, 0);
        } else {
          dummy.position.set(x - width / 2 - 0.2, sy, z + offset * depth);
          dummy.rotation.set(0, -Math.PI / 2, 0);
        }
        dummy.updateMatrix();
        neonMeshes[color].setMatrixAt(neonCounts[color]++, dummy.matrix);
      }
    }
  }

  instancedWindows.count = windowIdx;
  NEON_COLORS.forEach(color => {
    neonMeshes[color].count = neonCounts[color];
  });

  Object.keys(instancedMeshes).forEach(key => {
    const k = key as Exclude<ZoneType, 'park'>;
    instancedMeshes[k].count = counts[k];
    scene.add(instancedMeshes[k]);
  });
  scene.add(instancedWindows);
}
