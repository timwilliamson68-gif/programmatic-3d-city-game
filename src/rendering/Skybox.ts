import * as THREE from 'three';

let stars: THREE.Points;

export function createSkybox(scene: THREE.Scene): void {
  const starCount = 4000;
  const positions = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 3000 + Math.random() * 2000;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 100;
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    sizes[i] = Math.random() * 2 + 0.5;
  }

  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2.0,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.8,
  });

  stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  const glowGeo = new THREE.SphereGeometry(6000, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x050515,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.3,
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  scene.add(glow);
}

export function updateSkybox(): void {
  if (stars) {
    stars.rotation.y += 0.0001;
  }
}
