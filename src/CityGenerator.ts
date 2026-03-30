import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CITY_CONFIG } from './config/CityConfig';
import { setupScene } from './rendering/SceneSetup';
import { setupLighting } from './rendering/Lighting';
import { createSkybox } from './rendering/Skybox';
import { setupPostProcessing } from './rendering/PostProcessing';
import { createRoadNetwork } from './generation/RoadNetworkGenerator';
import { createBuildings } from './generation/BuildingGenerator';

export interface CityGeneratorResult {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  composer: EffectComposer;
}

export function createCity(container: HTMLElement): CityGeneratorResult {
  // Scene + camera + renderer + controls
  const { renderer, scene, camera, controls } = setupScene(container);

  // Lighting
  setupLighting(scene);

  // Night sky + stars
  createSkybox(scene);

  // Roads + ground
  createRoadNetwork(scene);

  // Buildings + neon signs
  createBuildings(scene);

  // Post-processing bloom
  const composer = setupPostProcessing(renderer, scene, camera);

  return { renderer, scene, camera, controls, composer };
}
