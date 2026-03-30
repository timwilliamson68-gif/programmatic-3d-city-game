import * as THREE from 'three';

export function setupLighting(scene: THREE.Scene): void {
  // Dim ambient light — city isn't completely dark
  const ambient = new THREE.AmbientLight(0x0a0a1a, 0.4);
  scene.add(ambient);

  // Moonlight — cool directional from above-right
  const moon = new THREE.DirectionalLight(0x4466bb, 0.6);
  moon.position.set(800, 1200, 400);
  scene.add(moon);

  // Subtle hemisphere light for city glow
  const hemi = new THREE.HemisphereLight(0x0a0a2a, 0x101010, 0.2);
  scene.add(hemi);
}
