import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { setupScene } from './rendering/SceneSetup';
import { setupLighting } from './rendering/Lighting';
import { createSkybox } from './rendering/Skybox';
import { setupPostProcessing } from './rendering/PostProcessing';
import { createRoadNetwork } from './generation/RoadNetworkGenerator';
import { createBuildings } from './generation/BuildingGenerator';
import { createHighways } from './generation/HighwayGenerator';
import { createStreetLights } from './generation/StreetLightGenerator';
import { createVegetation } from './generation/VegetationGenerator';

export interface CityGeneratorResult {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  composer: EffectComposer;
}

export function createCity(container: HTMLElement): CityGeneratorResult {
  // 1. SceneSetup + Lighting + Skybox
  const { renderer, scene, camera, controls } = setupScene(container);
  setupLighting(scene);
  createSkybox(scene);

  // 2. RoadNetworkGenerator
  createRoadNetwork(scene);

  // 3. HighwayGenerator
  createHighways(scene);

  // 4. BuildingGenerator
  createBuildings(scene);

  // 5. StreetLightGenerator
  createStreetLights(scene);

  // 6. VegetationGenerator
  createVegetation(scene);

  // 7. Post-processing bloom
  const composer = setupPostProcessing(renderer, scene, camera);

  return { renderer, scene, camera, controls, composer };
}
