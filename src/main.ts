import { createCity } from './CityGenerator';
import { updateSkybox } from './rendering/Skybox';

const container = document.getElementById('app') as HTMLElement;
if (!container) throw new Error('#app element not found');

const { renderer, scene, camera, controls, composer } = createCity(container);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  updateSkybox();
  composer.render();
}

animate();
