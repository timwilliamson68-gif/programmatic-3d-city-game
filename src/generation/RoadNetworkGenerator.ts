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

export function createRoadNetwork(scene: THREE.Scene): void {
  const rng = makeRNG(CITY_CONFIG.seed);
  const { mapSize, gridSize, roadWidth, subRoadWidth } = CITY_CONFIG;
  const half = mapSize / 2;
  const cellSize = mapSize / gridSize;

  const groundGeo = new THREE.PlaneGeometry(mapSize, mapSize, 1, 1);
  groundGeo.rotateX(-Math.PI / 2);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.9,
    metalness: 0.1,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = -0.05;
  scene.add(ground);

  const roadMat = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.7,
    metalness: 0.2,
  });

  const lineMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });

  const lineDashLength = 10;
  const lineGapLength = 10;
  const dashesPerRoad = Math.ceil(mapSize / (lineDashLength + lineGapLength));
  const totalDashes = (gridSize + 1) * 2 * dashesPerRoad;

  const instancedDashes = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(0.5, lineDashLength),
    lineMat,
    totalDashes
  );
  let dashIdx = 0;
  const dummy = new THREE.Object3D();

  for (let i = 0; i <= gridSize; i++) {
    const offset = -half + i * cellSize;

    const vRoad = new THREE.Mesh(new THREE.PlaneGeometry(roadWidth, mapSize), roadMat);
    vRoad.rotation.x = -Math.PI / 2;
    vRoad.position.set(offset, 0.01, 0);
    scene.add(vRoad);

    const hRoad = new THREE.Mesh(new THREE.PlaneGeometry(mapSize, roadWidth), roadMat);
    hRoad.rotation.x = -Math.PI / 2;
    hRoad.position.set(0, 0.01, offset);
    scene.add(hRoad);

    for (let j = 0; j < dashesPerRoad; j++) {
      const linePos = -half + j * (lineDashLength + lineGapLength) + lineDashLength / 2;

      dummy.position.set(offset, 0.02, linePos);
      dummy.rotation.set(-Math.PI / 2, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      instancedDashes.setMatrixAt(dashIdx++, dummy.matrix);

      dummy.position.set(linePos, 0.02, offset);
      dummy.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
      dummy.updateMatrix();
      instancedDashes.setMatrixAt(dashIdx++, dummy.matrix);
    }
  }
  instancedDashes.count = dashIdx;
  scene.add(instancedDashes);

  const subMat = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.8,
    metalness: 0.1,
  });

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
          const road = new THREE.Mesh(new THREE.PlaneGeometry(length, actualWidth), subMat);
          road.rotation.x = -Math.PI / 2;
          road.position.set(cellX, 0.015, cellZ + spread);
          scene.add(road);
        } else {
          const road = new THREE.Mesh(new THREE.PlaneGeometry(actualWidth, length), subMat);
          road.rotation.x = -Math.PI / 2;
          road.position.set(cellX + spread, 0.015, cellZ);
          scene.add(road);
        }
      }
    }
  }
}
