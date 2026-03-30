import * as THREE from 'three';
import { CITY_CONFIG } from '../config/CityConfig';
import { MATERIALS } from '../rendering/Materials';
import { getRoadLayout } from '../utils/RoadLayout';

export function createRoadNetwork(scene: THREE.Scene): void {
  const { mapSize } = CITY_CONFIG;
  const half = mapSize / 2;

  const roadMat = MATERIALS.wetRoad;
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });

  const roads = getRoadLayout();
  const segmentLength = 50;

  let totalRoadSegments = 0;
  roads.forEach(road => {
    totalRoadSegments += Math.ceil(road.length / segmentLength);
  });

  const roadGeo = new THREE.PlaneGeometry(1, 1);
  roadGeo.rotateX(-Math.PI / 2);
  const instancedRoads = new THREE.InstancedMesh(roadGeo, roadMat, totalRoadSegments);
  let roadIdx = 0;

  const lineDashLength = 10;
  const lineGapLength = 10;
  const lineCycle = lineDashLength + lineGapLength;

  let totalDashes = 0;
  roads.forEach(road => {
    if (road.length === mapSize) {
      totalDashes += Math.ceil(road.length / lineCycle);
    }
  });

  const dashGeo = new THREE.PlaneGeometry(0.5, lineDashLength);
  dashGeo.rotateX(-Math.PI / 2);
  const instancedDashes = new THREE.InstancedMesh(dashGeo, lineMat, totalDashes);
  let dashIdx = 0;

  const dummy = new THREE.Object3D();

  roads.forEach(road => {
    const numSegments = Math.ceil(road.length / segmentLength);
    const actualSegmentLen = road.length / numSegments;

    for (let i = 0; i < numSegments; i++) {
      const posOffset = -road.length / 2 + (i + 0.5) * actualSegmentLen;

      if (road.isHorizontal) {
        dummy.position.set(road.x + posOffset, 0.01, road.z);
        dummy.scale.set(actualSegmentLen, 1, road.width);
        dummy.rotation.set(0, 0, 0);
      } else {
        dummy.position.set(road.x, 0.01, road.z + posOffset);
        dummy.scale.set(road.width, 1, actualSegmentLen);
        dummy.rotation.set(0, 0, 0);
      }
      dummy.updateMatrix();
      instancedRoads.setMatrixAt(roadIdx++, dummy.matrix);
    }

    if (road.length === mapSize) {
      const numDashes = Math.ceil(road.length / lineCycle);
      for (let j = 0; j < numDashes; j++) {
        const linePos = -half + j * lineCycle + lineDashLength / 2;
        if (road.isHorizontal) {
          dummy.position.set(linePos, 0.02, road.z);
          dummy.rotation.set(0, Math.PI / 2, 0);
        } else {
          dummy.position.set(road.x, 0.02, linePos);
          dummy.rotation.set(0, 0, 0);
        }
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        instancedDashes.setMatrixAt(dashIdx++, dummy.matrix);
      }
    }
  });

  instancedRoads.count = roadIdx;
  scene.add(instancedRoads);

  instancedDashes.count = dashIdx;
  scene.add(instancedDashes);
}
