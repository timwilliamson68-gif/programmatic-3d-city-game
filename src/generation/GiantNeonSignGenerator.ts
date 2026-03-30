import * as THREE from 'three';
import { CITY_CONFIG } from '../config/CityConfig';
import { NEON_COLORS } from '../utils/ColorPalette';
import { MATERIALS } from '../rendering/Materials';

export function createGiantNeonSigns(scene: THREE.Scene): void {
  if (!CITY_CONFIG.enableGiantNeon) return;

  const signPositions = [
    [-600, 0, -600],
    [600, 0, -600],
    [-600, 0, 600],
    [600, 0, 600],
    [0, 0, -600],
    [0, 0, 600]
  ];

  const signHeight = 6;
  const signGeometry = new THREE.BoxGeometry(15, signHeight, 0.5);
  const dummy = new THREE.Object3D();

  const neonMeshes: Record<string, THREE.InstancedMesh> = {};
  const neonCounts: Record<string, number> = {};

  NEON_COLORS.forEach(color => {
    const mat = MATERIALS.neonSign(color);
    mat.emissiveIntensity = 5.0;
    neonMeshes[color] = new THREE.InstancedMesh(signGeometry, mat, signPositions.length);
    neonCounts[color] = 0;
    scene.add(neonMeshes[color]);
  });

  signPositions.forEach((pos, index) => {
    const color = NEON_COLORS[index % NEON_COLORS.length];
    dummy.position.set(pos[0], 12 + signHeight / 2, pos[2]);
    dummy.rotation.set(0, (index % 2) * Math.PI / 2, 0);
    dummy.updateMatrix();
    neonMeshes[color].setMatrixAt(neonCounts[color]++, dummy.matrix);
  });

  NEON_COLORS.forEach(color => {
    neonMeshes[color].count = neonCounts[color];
  });
}
