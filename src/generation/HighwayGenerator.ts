import * as THREE from 'three';

export function createHighways(scene: THREE.Scene): void {
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7, metalness: 0.2 });
  const laneMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.8 });

  const dummy = new THREE.Object3D();

  // Highway 1
  const h1Width = 18;
  const h1Z = 300;
  const h1Height = 16;
  const h1Geo = new THREE.BoxGeometry(2000, 1, h1Width);
  const h1 = new THREE.Mesh(h1Geo, roadMat);
  h1.position.set(0, h1Height, h1Z);
  scene.add(h1);

  // Highway 2
  const h2Width = 22;
  const h2X = -200;
  const h2Height = 16;
  const h2Geo = new THREE.BoxGeometry(h2Width, 1, 2000);
  const h2 = new THREE.Mesh(h2Geo, roadMat);
  h2.position.set(h2X, h2Height, 0);
  scene.add(h2);

  // Pillars
  const pillarGeo = new THREE.CylinderGeometry(1.5, 1.5, 22, 16);
  const pillars = new THREE.InstancedMesh(pillarGeo, pillarMat, 40);
  let pIdx = 0;

  // H1 Pillars
  for (let x = -1000; x <= 1000; x += 100) {
    dummy.position.set(x, 18 / 2, h1Z);
    dummy.scale.set(1, 18/22, 1); // Radius is correct, height adjusted via position and scale if needed, but let's just set height directly
    // Wait, requirement: radius 1.5m, height 18~22m
    // Let's adjust pillar height
    const h = 18;
    dummy.position.set(x, h / 2, h1Z);
    dummy.scale.set(1, h / 22, 1);
    dummy.updateMatrix();
    pillars.setMatrixAt(pIdx++, dummy.matrix);
  }

  // H2 Pillars
  for (let z = -1000; z <= 1000; z += 100) {
    const h = 22;
    dummy.position.set(h2X, h / 2, z);
    dummy.scale.set(1, h / 22, 1);
    dummy.updateMatrix();
    pillars.setMatrixAt(pIdx++, dummy.matrix);
  }
  pillars.count = pIdx;
  scene.add(pillars);

  // Lanes for H1
  const laneGeo = new THREE.PlaneGeometry(10, 0.5);
  const h1Lanes = new THREE.InstancedMesh(laneGeo, laneMat, 100);
  let lIdx = 0;
  for (let x = -1000; x <= 1000; x += 20) {
    dummy.position.set(x, h1Height + 0.51, h1Z);
    dummy.rotation.set(-Math.PI / 2, 0, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    h1Lanes.setMatrixAt(lIdx++, dummy.matrix);
  }
  h1Lanes.count = lIdx;
  scene.add(h1Lanes);

  // Lanes for H2
  const h2Lanes = new THREE.InstancedMesh(laneGeo, laneMat, 100);
  lIdx = 0;
  for (let z = -1000; z <= 1000; z += 20) {
    dummy.position.set(h2X, h2Height + 0.51, z);
    dummy.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    h2Lanes.setMatrixAt(lIdx++, dummy.matrix);
  }
  h2Lanes.count = lIdx;
  scene.add(h2Lanes);
}
