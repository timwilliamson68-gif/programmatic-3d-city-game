import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CITY_CONFIG } from './config/CityConfig';
import { setupScene } from './rendering/SceneSetup';
import { setupLighting } from './rendering/Lighting';
import { createSkybox } from './rendering/Skybox';
import { setupPostProcessing } from './rendering/PostProcessing';
import { createGround } from './generation/GroundGenerator';
import { createRoadNetwork } from './generation/RoadNetworkGenerator';
import { createBuildings } from './generation/BuildingGenerator';
import { createHighways } from './generation/HighwayGenerator';
import { createStreetLights } from './generation/StreetLightGenerator';
import { createVegetation } from './generation/VegetationGenerator';
import { createGiantNeonSigns } from './generation/GiantNeonSignGenerator';

export interface CityGeneratorResult {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls & { updateKeyboard: (delta: number) => void };
  composer: EffectComposer;
}

let currentRenderer: THREE.WebGLRenderer | null = null;

export function createCity(container: HTMLElement, configOverride?: Partial<typeof CITY_CONFIG>): CityGeneratorResult {
  if (configOverride) {
    Object.assign(CITY_CONFIG, configOverride);
  }

  if (currentRenderer) {
    currentRenderer.dispose();
    container.innerHTML = '';
  }

  const { renderer, scene, camera, controls } = setupScene(container);
  currentRenderer = renderer;

  setupLighting(scene);
  createSkybox(scene);

  createGround(scene);
  createRoadNetwork(scene);
  createHighways(scene);
  createBuildings(scene);
  createGiantNeonSigns(scene);
  createStreetLights(scene);
  createVegetation(scene);

  const composer = setupPostProcessing(renderer, scene, camera);

  return { renderer, scene, camera, controls, composer };
}
