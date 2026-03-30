import * as THREE from 'three';
import { CITY_CONFIG } from '../config/CityConfig';

export function createStreetLights(scene: THREE.Scene): void {
  const cellSize = CITY_CONFIG.mapSize / CITY_CONFIG.gridSize;
  const { mapSize, gridSize, roadWidth } = CITY_CONFIG;
  const half = mapSize / 2;
  const poleHeight = 8;
  const poleGeo = new THREE.CylinderGeometry(0.3, 0.3, poleHeight, 8);
  const armGeo = new THREE.BoxGeometry(2, 0.5, 0.5);
  const lightMat = new THREE.MeshStandardMaterial({ color: 0xffcc77, emissive: 0xffcc77, emissiveIntensity: 2.5 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x333333 });

  const numRoads = gridSize + 1;
  const numLightsPerRoad = Math.floor(mapSize / 30);
  const totalLights = numRoads * 2 * numLightsPerRoad;

  const poles = new THREE.InstancedMesh(poleGeo, metalMat, totalLights);
  const arms = new THREE.InstancedMesh(armGeo, metalMat, totalLights);
  const heads = new THREE.InstancedMesh(new THREE.BoxGeometry(0.5, 0.2, 0.5), lightMat, totalLights);

  let idx = 0;
  const dummy = new THREE.Object3D();

  for (let i = 0; i < numRoads; i++) {
    const offset = -half + i * cellSize;

    for (let j = 0; j < numLightsPerRoad; j++) {
      const pos = -half + j * 30 + 15;

      // V Road
      dummy.position.set(offset + roadWidth / 2 + 1, poleHeight / 2, pos);
      dummy.scale.set(1, 1, 1);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      poles.setMatrixAt(idx, dummy.matrix);

      dummy.position.set(offset + roadWidth / 2 + 1 - 0.7, poleHeight, pos);
      dummy.updateMatrix();
      arms.setMatrixAt(idx, dummy.matrix);

      dummy.position.set(offset + roadWidth / 2 + 1 - 1.5, poleHeight - 0.2, pos);
      dummy.updateMatrix();
      heads.setMatrixAt(idx, dummy.matrix);

      idx++;

      // H Road
      dummy.position.set(pos, poleHeight / 2, offset + roadWidth / 2 + 1);
      dummy.scale.set(1, 1, 1);
      dummy.rotation.set(0, Math.PI / 2, 0);
      dummy.updateMatrix();
      poles.setMatrixAt(idx, dummy.matrix);

      dummy.position.set(pos, poleHeight, offset + roadWidth / 2 + 1 - 0.7);
      dummy.updateMatrix();
      arms.setMatrixAt(idx, dummy.matrix);

      dummy.position.set(pos, poleHeight - 0.2, offset + roadWidth / 2 + 1 - 1.5);
      dummy.updateMatrix();
      heads.setMatrixAt(idx, dummy.matrix);

      idx++;
    }
  }

  poles.count = idx;
  arms.count = idx;
  heads.count = idx;
  scene.add(poles);
  scene.add(arms);
  scene.add(heads);
}
