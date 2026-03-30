import * as THREE from 'three';

export function createSkybox(scene: THREE.Scene): void {
  // Deep dark sky background via scene.fog + color already set in SceneSetup

  // Stars (Points) for distant sky
  const starCount = 4000;
  const positions = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 4000 + Math.random() * 1000;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 200; // keep above horizon
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    sizes[i] = Math.random() * 2 + 0.5;
  }

  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.5,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.7,
  });

  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // A dim horizon glow — subtle large sphere
  const glowGeo = new THREE.SphereGeometry(4500, 16, 16);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x001030,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.4,
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  scene.add(glow);
}
