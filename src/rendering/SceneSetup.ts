import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface SceneSetupResult {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
}

export function setupScene(container: HTMLElement): SceneSetupResult {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.8;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050510);
  scene.fog = new THREE.FogExp2(0x050510, 0.0008);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  camera.position.set(-500, 300, 500);
  camera.lookAt(0, 50, 0);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 50, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2.1;
  controls.minDistance = 50;
  controls.maxDistance = 5000;

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  // WASD / arrow-key fly camera movement
  const keys = new Set<string>();
  window.addEventListener('keydown', (e) => keys.add(e.code));
  window.addEventListener('keyup', (e) => keys.delete(e.code));

  const moveSpeed = 50; // units per second

  controls.updateKeyboard = (delta: number): void => {
    const speed = moveSpeed * delta;
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    if (keys.has('KeyW') || keys.has('ArrowUp')) {
      camera.position.addScaledVector(forward, speed);
    }
    if (keys.has('KeyS') || keys.has('ArrowDown')) {
      camera.position.addScaledVector(forward, -speed);
    }
    if (keys.has('KeyA') || keys.has('ArrowLeft')) {
      camera.position.addScaledVector(right, -speed);
    }
    if (keys.has('KeyD') || keys.has('ArrowRight')) {
      camera.position.addScaledVector(right, speed);
    }
    if (keys.has('KeyQ')) {
      camera.position.y -= speed;
    }
    if (keys.has('KeyE')) {
      camera.position.y += speed;
    }
  };

  return { renderer, scene, camera, controls };
}
