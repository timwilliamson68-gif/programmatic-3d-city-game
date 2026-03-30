import * as THREE from 'three';

export function setupLighting(scene: THREE.Scene): void {
  const ambient = new THREE.AmbientLight(0x1a1a3a, 0.6);
  scene.add(ambient);

  const moon = new THREE.DirectionalLight(0x6688cc, 0.8);
  moon.position.set(500, 800, -300);
  scene.add(moon);
}
