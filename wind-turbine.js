/**
 * CASE STUDY 1: OWL-INSPIRED SILENT WIND TURBINES
 * Technology: Three.js r128 + 2D Canvas Oscilloscope
 * Features:
 * - 3D Industrial Wind Turbine (Nacelle, Tower, Hub, 3 Aero Blades)
 * - Blade toggle: Smooth Blade (Traditional) vs Owl-Serrated Blade (Bio-Inspired)
 * - Particle Airflow: Chaotic crimson vortex shedding vs smooth green micro-vortices
 * - Realtime Decibel Gauge (104.5 dB -> 92.2 dB, -12.3 dB reduction)
 * - Acoustic Oscilloscope waveform canvas responding to aerodynamic shear
 * - Owl wing feature inspectable tabs (Leading-edge combs, fringed trailing edge, velvety texture)
 */

(function() {
  'use strict';

  let scene, camera, renderer, container;
  let turbineGroup, rotorHub, blades = [];
  let airflowParticles;
  let particleCount = 260;
  let particlePositions, particleVelocities, particleColors;
  let clock = new THREE.Clock();
  let isRunning = false;

  // State
  let currentMode = 'serrated'; // 'smooth' or 'serrated'
  let targetDb = 92.2;
  let currentDb = 92.2;
  let rotorSpeed = 0.035;

  // Oscilloscope
  let oscCanvas, oscCtx;
  let oscPhase = 0;

  function initWindTurbine() {
    container = document.getElementById('turbine-three-container');
    if (!container) return;

    const width = container.clientWidth || 560;
    const height = container.clientHeight || 320;

    // 1. Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060607, 0.05);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4.8, 3.2, 7.5);
    camera.lookAt(0, 1.8, 0);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x27272A, 2.0);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xFFFFFF, 1.8);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const accentLight = new THREE.DirectionalLight(0x22C55E, 1.5);
    accentLight.position.set(-6, 2, 4);
    scene.add(accentLight);

    // 5. Build 3D Wind Turbine
    buildTurbineModel();

    // 6. Build Airflow Particle System
    createAirflowParticles();

    // 7. Setup Oscilloscope Canvas
    initOscilloscope();

    // 8. Setup Mode Toggle Listeners
    setupModeControls();

    // 9. Setup Feature Inspector Items
    setupFeatureClicks();

    // Resize
    window.addEventListener('resize', onResize);

    isRunning = true;
    animate();
  }

  function buildTurbineModel() {
    turbineGroup = new THREE.Group();

    // Tower
    const towerGeo = new THREE.CylinderGeometry(0.18, 0.35, 4.6, 20);
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0x27272A,
      roughness: 0.5,
      metalness: 0.4
    });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.y = 1.0;
    turbineGroup.add(tower);

    // Nacelle (Housing unit atop tower)
    const nacelleGeo = new THREE.BoxGeometry(0.7, 0.45, 1.3);
    const nacelleMat = new THREE.MeshStandardMaterial({
      color: 0x3F3F46,
      roughness: 0.4,
      metalness: 0.6
    });
    const nacelle = new THREE.Mesh(nacelleGeo, nacelleMat);
    nacelle.position.set(0, 3.25, 0);
    turbineGroup.add(nacelle);

    // Rotor Hub (Nose cone)
    const hubGeo = new THREE.ConeGeometry(0.35, 0.65, 16);
    hubGeo.rotateX(Math.PI / 2);
    const hubMat = new THREE.MeshStandardMaterial({
      color: 0x52525B,
      roughness: 0.3,
      metalness: 0.8
    });
    rotorHub = new THREE.Mesh(hubGeo, hubMat);
    rotorHub.position.set(0, 3.25, 0.7);

    // 3 Aerodynamic Blades
    blades = [];
    for (let i = 0; i < 3; i++) {
      const bladePivot = new THREE.Group();
      bladePivot.rotation.z = (i * Math.PI * 2) / 3;

      const bladeMesh = createBladeMesh(currentMode === 'serrated');
      bladeMesh.position.y = 1.45; // center along blade span
      bladePivot.add(bladeMesh);

      rotorHub.add(bladePivot);
      blades.push(bladeMesh);
    }

    turbineGroup.add(rotorHub);
    turbineGroup.position.set(0, -0.6, 0);
    scene.add(turbineGroup);
  }

  function createBladeMesh(isSerrated) {
    const bladeGroup = new THREE.Group();

    // Main airfoil blade body
    const mainGeo = new THREE.BoxGeometry(0.24, 2.7, 0.06);
    const mainMat = new THREE.MeshStandardMaterial({
      color: 0xD4D4D8,
      roughness: 0.25,
      metalness: 0.3
    });
    const mainBody = new THREE.Mesh(mainGeo, mainMat);
    bladeGroup.add(mainBody);

    // Leading edge serrations (comb teeth)
    if (isSerrated) {
      const teethCount = 18;
      const toothGeo = new THREE.ConeGeometry(0.04, 0.08, 4);
      toothGeo.rotateZ(Math.PI / 2);
      const toothMat = new THREE.MeshBasicMaterial({ color: 0x22C55E });

      for (let t = 0; t < teethCount; t++) {
        const tooth = new THREE.Mesh(toothGeo, toothMat);
        tooth.position.set(-0.14, -1.2 + (t * 0.14), 0);
        bladeGroup.add(tooth);
      }

      // Porous trailing edge fringe accent line
      const fringeGeo = new THREE.PlaneGeometry(0.06, 2.6);
      const fringeMat = new THREE.MeshBasicMaterial({
        color: 0x4ADE80,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65
      });
      const fringe = new THREE.Mesh(fringeGeo, fringeMat);
      fringe.position.set(0.14, 0, 0);
      bladeGroup.add(fringe);
    }

    return bladeGroup;
  }

  function updateBladeGeometry() {
    if (!rotorHub) return;

    // Clear existing blades from hub
    while (rotorHub.children.length > 0) {
      rotorHub.remove(rotorHub.children[0]);
    }

    // Rebuild blades with updated mode
    blades = [];
    for (let i = 0; i < 3; i++) {
      const bladePivot = new THREE.Group();
      bladePivot.rotation.z = (i * Math.PI * 2) / 3;

      const bladeMesh = createBladeMesh(currentMode === 'serrated');
      bladeMesh.position.y = 1.45;
      bladePivot.add(bladeMesh);

      rotorHub.add(bladePivot);
      blades.push(bladeMesh);
    }
  }

  function createAirflowParticles() {
    const geometry = new THREE.BufferGeometry();
    particlePositions = new Float32Array(particleCount * 3);
    particleVelocities = [];
    particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      resetParticle(i);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.11,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    airflowParticles = new THREE.Points(geometry, material);
    scene.add(airflowParticles);
  }

  function resetParticle(i) {
    const i3 = i * 3;
    // Spawn upstream of turbine
    particlePositions[i3] = (Math.random() - 0.5) * 3.8;
    particlePositions[i3 + 1] = Math.random() * 4.2 + 0.5;
    particlePositions[i3 + 2] = 4.2 + Math.random() * 1.5;

    particleVelocities[i] = {
      vx: 0,
      vy: 0,
      vz: -0.06 - Math.random() * 0.04,
      rotOffset: Math.random() * Math.PI * 2
    };

    updateParticleColor(i);
  }

  function updateParticleColor(i) {
    const i3 = i * 3;
    if (currentMode === 'serrated') {
      // Vivid Green laminar ribbon
      particleColors[i3] = 0.13;
      particleColors[i3 + 1] = 0.77;
      particleColors[i3 + 2] = 0.37;
    } else {
      // Crimson turbulent vortex
      particleColors[i3] = 0.86;
      particleColors[i3 + 1] = 0.08;
      particleColors[i3 + 2] = 0.24;
    }
  }

  function setupModeControls() {
    const btnSmooth = document.getElementById('btn-smooth-blade');
    const btnSerrated = document.getElementById('btn-serrated-blade');
    const hudAir = document.getElementById('hud-air-status');
    const dbTag = document.getElementById('db-delta-tag');
    const dbMeter = document.getElementById('db-meter-val');

    function applyMode(mode) {
      currentMode = mode;
      if (mode === 'smooth') {
        targetDb = 104.5;
        if (btnSmooth) btnSmooth.classList.add('active');
        if (btnSerrated) btnSerrated.classList.remove('active');
        if (hudAir) {
          hudAir.textContent = 'TURBULENT WAKE & VORTICES';
          hudAir.style.color = 'var(--crimson-main)';
        }
        if (dbTag) {
          dbTag.textContent = '▲ High Boundary Turbulence';
          dbTag.style.color = 'var(--crimson-main)';
        }
        if (dbMeter) {
          dbMeter.style.color = 'var(--crimson-main)';
        }
      } else {
        targetDb = 92.2;
        if (btnSerrated) btnSerrated.classList.add('active');
        if (btnSmooth) btnSmooth.classList.remove('active');
        if (hudAir) {
          hudAir.textContent = 'LAMINAR MICRO-VORTICES';
          hudAir.style.color = 'var(--green-main)';
        }
        if (dbTag) {
          dbTag.textContent = '▼ 12.3 dB Noise Reduction';
          dbTag.style.color = 'var(--green-main)';
        }
        if (dbMeter) {
          dbMeter.style.color = 'var(--green-main)';
        }
      }

      updateBladeGeometry();

      // Recolor particles
      for (let i = 0; i < particleCount; i++) {
        updateParticleColor(i);
      }
      airflowParticles.geometry.attributes.color.needsUpdate = true;
    }

    if (btnSmooth) btnSmooth.addEventListener('click', () => applyMode('smooth'));
    if (btnSerrated) btnSerrated.addEventListener('click', () => applyMode('serrated'));

    // Expose toggle globally for keyboard shortcut 'T'
    window.toggleTurbineBladeMode = function() {
      applyMode(currentMode === 'serrated' ? 'smooth' : 'serrated');
    };
  }

  function setupFeatureClicks() {
    const items = document.querySelectorAll('.feature-item');
    items.forEach((item) => {
      item.addEventListener('click', () => {
        items.forEach(el => el.classList.remove('active'));
        item.classList.add('active');
      });
    });
  }

  function initOscilloscope() {
    oscCanvas = document.getElementById('soundwave-canvas');
    if (!oscCanvas) return;
    oscCtx = oscCanvas.getContext('2d');
  }

  function renderOscilloscope() {
    if (!oscCtx || !oscCanvas) return;
    const w = oscCanvas.width;
    const h = oscCanvas.height;
    oscCtx.clearRect(0, 0, w, h);

    oscCtx.fillStyle = '#09090B';
    oscCtx.fillRect(0, 0, w, h);

    // Center grid line
    oscCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    oscCtx.lineWidth = 1;
    oscCtx.beginPath();
    oscCtx.moveTo(0, h / 2);
    oscCtx.lineTo(w, h / 2);
    oscCtx.stroke();

    oscPhase += 0.12;

    const isSmooth = (currentMode === 'smooth');
    const amplitude = isSmooth ? (h * 0.42) : (h * 0.14);
    const strokeColor = isSmooth ? '#DC143C' : '#22C55E';
    const shadowColor = isSmooth ? 'rgba(220, 20, 60, 0.6)' : 'rgba(34, 197, 94, 0.6)';

    oscCtx.save();
    oscCtx.strokeStyle = strokeColor;
    oscCtx.shadowColor = shadowColor;
    oscCtx.shadowBlur = 8;
    oscCtx.lineWidth = 2;
    oscCtx.beginPath();

    for (let x = 0; x < w; x++) {
      let y;
      if (isSmooth) {
        // High harmonic turbulence noise wave
        y = (h / 2) +
          Math.sin(x * 0.08 + oscPhase) * (amplitude * 0.6) +
          Math.cos(x * 0.22 - oscPhase * 1.5) * (amplitude * 0.3) +
          (Math.random() - 0.5) * 4;
      } else {
        // Smooth attenuated fundamental wave
        y = (h / 2) + Math.sin(x * 0.05 + oscPhase) * amplitude;
      }

      if (x === 0) oscCtx.moveTo(x, y);
      else oscCtx.lineTo(x, y);
    }
    oscCtx.stroke();
    oscCtx.restore();

    // Update footer telemetry
    const oscFooter = document.getElementById('osc-footer-text');
    if (oscFooter) {
      if (isSmooth) {
        oscFooter.textContent = 'Peak Amplitude: -3.8 dB // Severe Boundary Shear';
        oscFooter.style.color = 'var(--crimson-main)';
      } else {
        oscFooter.textContent = 'Peak Amplitude: -18.4 dB // Power: 100% Retained';
        oscFooter.style.color = 'var(--green-main)';
      }
    }
  }

  function onResize() {
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate() {
    if (!isRunning) return;
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // Rotate Turbine Rotor Hub
    if (rotorHub) {
      rotorHub.rotation.z += rotorSpeed;
    }

    // Gentle yaw sway of nacelle
    if (turbineGroup) {
      turbineGroup.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.12;
    }

    // Animate Airflow Particles
    if (airflowParticles) {
      const isSmooth = (currentMode === 'smooth');
      const positions = airflowParticles.geometry.attributes.position.array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const vel = particleVelocities[i];

        positions[i3 + 2] += vel.vz;

        // When particles pass through turbine blade disc (Z around 0.5 to -2)
        if (positions[i3 + 2] < 1.0) {
          if (isSmooth) {
            // Chaotic large vortex eddies (crimson mode)
            positions[i3] += Math.sin(positions[i3 + 2] * 4 + vel.rotOffset) * 0.045;
            positions[i3 + 1] += Math.cos(positions[i3 + 2] * 3 + vel.rotOffset) * 0.045;
          } else {
            // Tight streamlined micro-vortices (owl serrated mode)
            positions[i3] += Math.sin(positions[i3 + 2] * 12 + vel.rotOffset) * 0.012;
            positions[i3 + 1] += Math.cos(positions[i3 + 2] * 12 + vel.rotOffset) * 0.008;
          }
        }

        // Loop particles when out of view
        if (positions[i3 + 2] < -4.5) {
          resetParticle(i);
        }
      }

      airflowParticles.geometry.attributes.position.needsUpdate = true;
    }

    // Lerp Decibel Value
    currentDb += (targetDb - currentDb) * 0.08;
    const dbMeter = document.getElementById('db-meter-val');
    if (dbMeter) {
      dbMeter.textContent = currentDb.toFixed(1);
    }

    // Render soundwave oscilloscope
    renderOscilloscope();

    renderer.render(scene, camera);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWindTurbine);
  } else {
    initWindTurbine();
  }

  window.initWindTurbine = initWindTurbine;
})();

