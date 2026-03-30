import * as THREE from 'three';
import { CITY_CONFIG } from '../config/CityConfig';
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

const rng = makeRNG(CITY_CONFIG.seed);

export function createRoadNetwork(scene: THREE.Scene): void {
  const { mapSize, gridSize, roadWidth } = CITY_CONFIG;
  const half = mapSize / 2;
  const cellSize = mapSize / gridSize;

  // --- Ground plane ---
  const groundGeo = new THREE.PlaneGeometry(mapSize, mapSize, 1, 1);
  groundGeo.rotateX(-Math.PI / 2);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    roughness: 0.9,
    metalness: 0.1,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = -0.1;
  scene.add(ground);

  // --- Main road grid (horizontal + vertical lines) ---
  const roadMat = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a,
    roughness: 0.7,
    metalness: 0.2,
  });

  for (let i = 0; i <= gridSize; i++) {
    const offset = -half + i * cellSize;

    // Vertical road
    const vRoad = new THREE.Mesh(
      new THREE.PlaneGeometry(roadWidth, mapSize),
      roadMat
    );
    vRoad.rotation.x = -Math.PI / 2;
    vRoad.position.set(offset, 0.01, 0);
    scene.add(vRoad);

    // Horizontal road
    const hRoad = new THREE.Mesh(
      new THREE.PlaneGeometry(mapSize, roadWidth),
      roadMat
    );
    hRoad.rotation.x = -Math.PI / 2;
    hRoad.position.set(0, 0.01, offset);
    scene.add(hRoad);
  }

  // --- Road markings (center lines) ---
  const lineMat = new THREE.MeshBasicMaterial({ color: 0x555533 });

  for (let i = 0; i <= gridSize; i++) {
    const offset = -half + i * cellSize;

    // Vertical center line
    const vLine = new THREE.Mesh(
      new THREE.PlaneGeometry(1, mapSize),
      lineMat
    );
    vLine.rotation.x = -Math.PI / 2;
    vLine.position.set(offset, 0.02, 0);
    scene.add(vLine);

    // Horizontal center line
    const hLine = new THREE.Mesh(
      new THREE.PlaneGeometry(mapSize, 1),
      lineMat
    );
    hLine.rotation.x = -Math.PI / 2;
    hLine.position.set(0, 0.02, offset);
    scene.add(hLine);
  }

  // --- Sub-roads (random minor roads within each cell) ---
  const subMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.8,
    metalness: 0.1,
  });

  for (let gi = 0; gi < gridSize; gi++) {
    for (let gj = 0; gj < gridSize; gj++) {
      const cellX = -half + gi * cellSize + cellSize / 2;
      const cellZ = -half + gj * cellSize + cellSize / 2;

      // 1–3 sub-roads per cell using noise-derived seed
      const subCount = Math.floor(simplex2D(gi * 3.1, gj * 2.7) * 2 + 2.5);

      for (let k = 0; k < subCount; k++) {
        const isHorizontal = rng() > 0.5;
        const spread = rng() * cellSize * 0.4;

        if (isHorizontal) {
          const road = new THREE.Mesh(
            new THREE.PlaneGeometry(cellSize * 0.8, CITY_CONFIG.subRoadWidth),
            subMat
          );
          road.rotation.x = -Math.PI / 2;
          road.position.set(cellX + (rng() - 0.5) * cellSize * 0.4, 0.02, cellZ + spread);
          scene.add(road);
        } else {
          const road = new THREE.Mesh(
            new THREE.PlaneGeometry(CITY_CONFIG.subRoadWidth, cellSize * 0.8),
            subMat
          );
          road.rotation.x = -Math.PI / 2;
          road.position.set(cellX + spread, 0.02, cellZ + (rng() - 0.5) * cellSize * 0.4);
          scene.add(road);
        }
      }
    }
  }
}
