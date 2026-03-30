import { createCity, CityGeneratorResult } from './CityGenerator';
import { updateSkybox } from './rendering/Skybox';
import { setupUI } from './ui/CityControls';

const container = document.getElementById('app') as HTMLElement;
if (!container) throw new Error('#app element not found');

let city: CityGeneratorResult;
let animationId: number;

function startCity() {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  city = createCity(container);

  function animate() {
    animationId = requestAnimationFrame(animate);
    city.controls.update();
    updateSkybox();
    city.composer.render();
  }

  animate();
}

setupUI(() => {
  startCity();
});

startCity();
