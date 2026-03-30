import { CITY_CONFIG } from '../config/CityConfig';

export function setupUI(onUpdate: () => void): void {
  const overlay = document.createElement('div');
  overlay.id = 'ui-overlay';
  overlay.style.position = 'absolute';
  overlay.style.top = '10px';
  overlay.style.right = '10px';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
  overlay.style.color = 'white';
  overlay.style.padding = '15px';
  overlay.style.borderRadius = '8px';
  overlay.style.fontFamily = 'Arial, sans-serif';
  overlay.style.zIndex = '1000';

  overlay.innerHTML = `
    <h3 style="margin-top: 0;">City Controls</h3>
    <div class="control-group" style="margin-bottom: 10px;">
      <label>Building Density: <span id="density-val">${CITY_CONFIG.buildingDensity}</span></label><br/>
      <input type="range" id="building-density" min="0.5" max="1.5" step="0.1" value="${CITY_CONFIG.buildingDensity}">
    </div>
    <div class="control-group" style="margin-bottom: 10px;">
      <label>Neon Intensity: <span id="neon-val">${CITY_CONFIG.neonIntensity}</span></label><br/>
      <input type="range" id="neon-intensity" min="1.0" max="6.0" step="0.5" value="${CITY_CONFIG.neonIntensity}">
    </div>
    <div class="control-group" style="margin-bottom: 10px;">
      <label>Terrain Amplitude: <span id="terrain-val">${CITY_CONFIG.terrainAmplitude}</span></label><br/>
      <input type="range" id="terrain-amplitude" min="0" max="15" step="1" value="${CITY_CONFIG.terrainAmplitude}">
    </div>
    <div class="control-group" style="margin-bottom: 10px;">
      <label><input type="checkbox" id="enable-giant-neon" ${CITY_CONFIG.enableGiantNeon ? 'checked' : ''}> Enable Giant Neon</label>
    </div>
    <div class="control-group" style="margin-bottom: 10px;">
      <label><input type="checkbox" id="enable-terrain" ${CITY_CONFIG.enableTerrain ? 'checked' : ''}> Enable Terrain</label>
    </div>
    <button id="regen-button" style="width: 100%; padding: 8px; cursor: pointer;">Regenerate City</button>
  `;

  document.body.appendChild(overlay);

  const densityInput = document.getElementById('building-density') as HTMLInputElement;
  const neonInput = document.getElementById('neon-intensity') as HTMLInputElement;
  const terrainInput = document.getElementById('terrain-amplitude') as HTMLInputElement;
  const giantNeonCheck = document.getElementById('enable-giant-neon') as HTMLInputElement;
  const terrainCheck = document.getElementById('enable-terrain') as HTMLInputElement;
  const regenButton = document.getElementById('regen-button') as HTMLButtonElement;

  densityInput.addEventListener('input', () => {
    CITY_CONFIG.buildingDensity = parseFloat(densityInput.value);
    document.getElementById('density-val')!.innerText = densityInput.value;
  });

  neonInput.addEventListener('input', () => {
    CITY_CONFIG.neonIntensity = parseFloat(neonInput.value);
    document.getElementById('neon-val')!.innerText = neonInput.value;
  });

  terrainInput.addEventListener('input', () => {
    CITY_CONFIG.terrainAmplitude = parseFloat(terrainInput.value);
    document.getElementById('terrain-val')!.innerText = terrainInput.value;
  });

  giantNeonCheck.addEventListener('change', () => {
    CITY_CONFIG.enableGiantNeon = giantNeonCheck.checked;
  });

  terrainCheck.addEventListener('change', () => {
    CITY_CONFIG.enableTerrain = terrainCheck.checked;
  });

  regenButton.addEventListener('click', () => {
    onUpdate();
  });
}
