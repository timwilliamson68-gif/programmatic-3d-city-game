import * as THREE from 'three';

export function setupLighting(scene: THREE.Scene): void {
  const ambient = new THREE.AmbientLight(0x1a1a3a, 0.15);
  scene.add(ambient);

  const moon = new THREE.DirectionalLight(0x6688cc, 0.3);
  moon.position.set(500, 800, -300);
  scene.add(moon);
}
