import * as THREE from 'three';

export const MATERIALS = {
  glassWall: new THREE.MeshPhysicalMaterial({
    color: 0x223344,
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.85,
    envMapIntensity: 1.0,
  }),
  concrete: new THREE.MeshStandardMaterial({
    color: 0x555555,
    roughness: 0.9,
    metalness: 0.1,
  }),
  industrial: new THREE.MeshStandardMaterial({
    color: 0x8B4513,
    roughness: 0.7,
    metalness: 0.5,
  }),
  asphalt: new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.95,
    metalness: 0.0,
  }),
  neonSign: (color: string) => new THREE.MeshStandardMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: 4.0,
    roughness: 0.3,
  }),
  wetRoad: new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.3,
    metalness: 0.8,
  }),
};
