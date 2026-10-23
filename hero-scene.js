/**
 * HERO 3D SCENE: Bio-Sapling & Rotating Hex Icon Ring
 * Technology: Three.js r128
 * Features:
 * - Glowing procedural sapling with emerald bioluminescent leaves
 * - Geometric textured dark soil disc with subtle particle moss
 * - Floating ambient spores and leaf embers
 * - Slow-orbiting holographic hex ring with 5 biomimetic node beacons (Leaf, Gear, DNA, Water Drop, Wind Turbine)
 * - Mouse parallax tilt for projector/pointer depth
 */

(function() {
  'use strict';

  let scene, camera, renderer, container;
  let saplingGroup, hexRingGroup, leafParticles;
  let mouseX = 0, mouseY = 0;
  let targetRotationX = 0, targetRotationY = 0;
  let isRunning = false;
  let clock = new THREE.Clock();

  function initHeroScene() {
    container = document.getElementById('hero-three-container');
    if (!container) return;

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 480;

    // 1. Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0B0B0C, 0.04);

    // 2. Camera setup
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.8, 9.2);
    camera.lookAt(0, 1.2, 0);

    // 3. Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x1F2937, 1.8);
    scene.add(ambientLight);

    const greenKeyLight = new THREE.DirectionalLight(0x22C55E, 2.2);
    greenKeyLight.position.set(4, 7, 5);
    scene.add(greenKeyLight);

    const crimsonRimLight = new THREE.DirectionalLight(0xDC143C, 1.4);
    crimsonRimLight.position.set(-5, 4, -4);
    scene.add(crimsonRimLight);

    const corePointLight = new THREE.PointLight(0x4ADE80, 2.5, 8);
    corePointLight.position.set(0, 2.2, 0.5);
    scene.add(corePointLight);

    // 5. Build Soil Disc
    createSoilBase();

    // 6. Build Procedural Sapling
    createSaplingTree();

    // 7. Build Rotating Hex Ring with 5 Biomimetic Nodes
    createHexRing();

    // 8. Floating Bioluminescent Leaf/Spore Particles
    createFloatingSpores();

    // Event listeners
    window.addEventListener('resize', onWindowResize, false);
    container.addEventListener('mousemove', onMouseMove, false);
    container.addEventListener('mouseleave', onMouseLeave, false);

    isRunning = true;
    animate();
  }

  function createSoilBase() {
    const soilGroup = new THREE.Group();

    // Primary dark soil disc
    const soilGeo = new THREE.CylinderGeometry(3.2, 3.5, 0.45, 32);
    const soilMat = new THREE.MeshStandardMaterial({
      color: 0x141416,
      roughness: 0.85,
      metalness: 0.15,
      flatShading: true
    });
    const soilMesh = new THREE.Mesh(soilGeo, soilMat);
    soilMesh.position.y = -0.22;
    soilGroup.add(soilMesh);

    // Subtle luminous concentric techno-roots / wireframe ring
    const rootRingGeo = new THREE.RingGeometry(2.4, 3.2, 32);
    const rootRingMat = new THREE.MeshBasicMaterial({
      color: 0x0F7A3D,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const rootRing = new THREE.Mesh(rootRingGeo, rootRingMat);
    rootRing.rotation.x = -Math.PI / 2;
    rootRing.position.y = 0.02;
    soilGroup.add(rootRing);

    scene.add(soilGroup);
  }

  function createSaplingTree() {
    saplingGroup = new THREE.Group();

    // Main Trunk (Smooth curved cylinder)
    const trunkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.08, 0.8, 0.05),
      new THREE.Vector3(-0.06, 1.6, -0.04),
      new THREE.Vector3(0.04, 2.3, 0.06),
      new THREE.Vector3(0, 3.0, 0)
    ]);

    const trunkGeo = new THREE.TubeGeometry(trunkCurve, 24, 0.16, 12, false);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x1E293B,
      roughness: 0.6,
      metalness: 0.3,
      emissive: 0x064E3B,
      emissiveIntensity: 0.25
    });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    saplingGroup.add(trunk);

    // Glowing Bio-Leaves
    const leafGeo = new THREE.SphereGeometry(0.35, 12, 8);
    leafGeo.scale(1.8, 0.35, 0.7);

    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x22C55E,
      emissive: 0x22C55E,
      emissiveIntensity: 0.7,
      roughness: 0.3,
      metalness: 0.2,
      transparent: true,
      opacity: 0.95
    });

    const leafPositions = [
      { pos: [0.6, 1.4, 0.3], rot: [0.3, 0.4, 0.6] },
      { pos: [-0.65, 1.8, -0.2], rot: [-0.2, -0.5, -0.7] },
      { pos: [0.45, 2.2, -0.4], rot: [0.4, -0.6, 0.5] },
      { pos: [-0.5, 2.5, 0.35], rot: [-0.3, 0.6, -0.6] },
      { pos: [0.15, 3.1, 0.1], rot: [0.1, 0.2, 0.2] },
      { pos: [-0.2, 3.2, -0.15], rot: [-0.2, -0.3, -0.4] }
    ];

    leafPositions.forEach((item) => {
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(...item.pos);
      leaf.rotation.set(...item.rot);
      saplingGroup.add(leaf);
    });

    scene.add(saplingGroup);
  }

  function createHexRing() {
    hexRingGroup = new THREE.Group();

    // Holographic Torus Ring
    const ringRadius = 3.6;
    const ringGeo = new THREE.TorusGeometry(ringRadius, 0.025, 8, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x22C55E,
      transparent: true,
      opacity: 0.65,
      wireframe: false
    });
    const mainRing = new THREE.Mesh(ringGeo, ringMat);
    mainRing.rotation.x = Math.PI / 2;
    hexRingGroup.add(mainRing);

    // Secondary dashed outer orbit
    const outerRingGeo = new THREE.RingGeometry(3.9, 3.98, 48);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x4ADE80,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = Math.PI / 2;
    hexRingGroup.add(outerRing);

    // 5 Hex Beacon Nodes positioned along the perimeter
    const nodeCount = 5;
    const beaconGeo = new THREE.OctahedronGeometry(0.24, 0);

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const x = Math.cos(angle) * ringRadius;
      const z = Math.sin(angle) * ringRadius;

      const beaconMat = new THREE.MeshStandardMaterial({
        color: (i % 2 === 0) ? 0x22C55E : 0x4ADE80,
        emissive: 0x22C55E,
        emissiveIntensity: 0.85,
        roughness: 0.2,
        metalness: 0.8
      });

      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(x, 0, z);
      beacon.userData = { initialY: 0, index: i, angle: angle };
      hexRingGroup.add(beacon);
    }

    hexRingGroup.position.y = 1.7;
    scene.add(hexRingGroup);
  }

  function createFloatingSpores() {
    const particleCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 6;
      positions[i3 + 1] = Math.random() * 5 + 0.2;
      positions[i3 + 2] = (Math.random() - 0.5) * 6;
      scales[i] = Math.random() * 0.8 + 0.4;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Particle Material
    const material = new THREE.PointsMaterial({
      color: 0x4ADE80,
      size: 0.12,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    leafParticles = new THREE.Points(geometry, material);
    scene.add(leafParticles);
  }

  function onMouseMove(event) {
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    mouseX = (x / rect.width) * 2 - 1;
    mouseY = -(y / rect.height) * 2 + 1;

    targetRotationY = mouseX * 0.45;
    targetRotationX = -mouseY * 0.25;
  }

  function onMouseLeave() {
    targetRotationX = 0;
    targetRotationY = 0;
  }

  function onWindowResize() {
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

    const elapsed = clock.getElapsedTime();

    // Rotate Hex Ring slowly
    if (hexRingGroup) {
      hexRingGroup.rotation.y = elapsed * 0.22;
      hexRingGroup.position.y = 1.7 + Math.sin(elapsed * 1.5) * 0.08;

      // Pulse beacon nodes
      hexRingGroup.children.forEach((child) => {
        if (child.userData && child.userData.index !== undefined) {
          child.rotation.x += 0.02;
          child.rotation.y += 0.03;
        }
      });
    }

    // Subtle breathing breeze on sapling
    if (saplingGroup) {
      saplingGroup.rotation.y = Math.sin(elapsed * 0.4) * 0.08;
      saplingGroup.rotation.z = Math.sin(elapsed * 0.6) * 0.03;
    }

    // Swirling ambient spore particles
    if (leafParticles) {
      const positions = leafParticles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += 0.006;
        positions[i] += Math.sin(elapsed + positions[i + 1]) * 0.002;
        if (positions[i + 1] > 5.5) {
          positions[i + 1] = 0.2;
        }
      }
      leafParticles.geometry.attributes.position.needsUpdate = true;
    }

    // Smooth camera mouse parallax lerp
    camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.05;
    camera.position.y += (3.8 + mouseY * 0.8 - camera.position.y) * 0.05;
    camera.lookAt(0, 1.4, 0);

    renderer.render(scene, camera);
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroScene);
  } else {
    initHeroScene();
  }

  window.initHeroScene = initHeroScene;
})();

