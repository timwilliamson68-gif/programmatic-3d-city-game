import * as THREE from 'three';
import { CITY_CONFIG } from '../config/CityConfig';
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

export function createVegetation(scene: THREE.Scene): void {
  const rng = makeRNG(CITY_CONFIG.seed + 2);
  const { mapSize, gridSize, roadWidth } = CITY_CONFIG;
  const half = mapSize / 2;
  const cellSize = mapSize / gridSize;

  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2b1f });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x1a3a1a, emissive: 0x1a3a1a, emissiveIntensity: 0.2 });
  const emissiveLeafMat = new THREE.MeshStandardMaterial({ color: 0x2a5a2a, emissive: 0x2a5a2a, emissiveIntensity: 1.5 });

  const treeCount = 500;
  const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.5, 0.7, 1, 8), trunkMat, treeCount);
  const foliage = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 8), leafMat, treeCount);
  const emissiveFoliage = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 8), emissiveLeafMat, treeCount);

  let tIdx = 0;
  let fIdx = 0;
  let efIdx = 0;
  const dummy = new THREE.Object3D();

  const grassMat = new THREE.MeshStandardMaterial({ color: 0x1a3a1a, roughness: 1.0 });

  for (let gi = 0; gi < gridSize; gi++) {
    for (let gj = 0; gj < gridSize; gj++) {
      const zone = ZonePlacer.getZoneType(gi, gj);
      if (zone !== 'park') continue;

      const cellX = -half + gi * cellSize + cellSize / 2;
      const cellZ = -half + gj * cellSize + cellSize / 2;

      const grassGeo = new THREE.PlaneGeometry(cellSize - roadWidth, cellSize - roadWidth);
      const grass = new THREE.Mesh(grassGeo, grassMat);
      grass.rotation.x = -Math.PI / 2;
      grass.position.set(cellX, 0.02, cellZ);
      scene.add(grass);

      const numTrees = 20 + Math.floor(rng() * 20);
      for (let t = 0; t < numTrees; t++) {
        const tx = cellX + (rng() - 0.5) * (cellSize - roadWidth - 10);
        const tz = cellZ + (rng() - 0.5) * (cellSize - roadWidth - 10);
        const th = 5 + rng() * 10;
        const radius = 2 + rng() * 3;

        dummy.position.set(tx, th / 2, tz);
        dummy.scale.set(1, th, 1);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        trunks.setMatrixAt(tIdx++, dummy.matrix);

        dummy.position.set(tx, th, tz);
        dummy.scale.set(radius, radius, radius);
        dummy.updateMatrix();

        if (rng() < 0.1) {
          emissiveFoliage.setMatrixAt(efIdx++, dummy.matrix);
        } else {
          foliage.setMatrixAt(fIdx++, dummy.matrix);
        }
      }
    }
  }

  trunks.count = tIdx;
  foliage.count = fIdx;
  emissiveFoliage.count = efIdx;
  scene.add(trunks);
  scene.add(foliage);
  scene.add(emissiveFoliage);
}
