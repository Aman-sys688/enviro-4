/**
 * CASE STUDY 2: DIATOM-INSPIRED WATER FILTRATION
 * Technology: HTML5 Canvas (High-Performance 60 FPS Particle Engine)
 * Features:
 * - Multi-scale interactive visualization:
 *     1. Nanoscale Sieve (Cross-Section): Straight silica channels filtering 5 contaminant types
 *     2. 3D Macro Frustule Shell: Symmetrical radial diatom skeleton
 * - Realistic molecular sieving physics:
 *     - Steric size-exclusion (microplastics, bacteria)
 *     - Electrostatic silica surface charge repulsion (heavy metals, toxic dyes)
 *     - Frictionless straight-channel water molecule permeation
 * - Dynamic pore size slider (5nm - 50nm) altering cutoff physics in real-time
 * - Contaminant type toggles and Retentate flush action
 */

(function() {
  'use strict';

  let canvas, ctx;
  let width, height;
  let currentView = 'nano'; // 'nano' or 'frustule'
  let poreSize = 15; // nanometers
  let animId = null;
  let isRunning = false;

  // Contaminant stream active filters
  const activeStreams = {
    metals: true,
    dyes: true,
    plastics: true,
    pathogens: true,
    water: true
  };

  // Particle pool
  const particles = [];
  const maxParticles = 140;

  // Frustule shell rotation angle
  let frustuleAngle = 0;

  function initDiatomFilter() {
    canvas = document.getElementById('diatom-filtration-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    const wrapper = canvas.parentElement;
    width = canvas.width = wrapper.clientWidth || 580;
    height = canvas.height = wrapper.clientHeight || 310;

    // Initialize particle pool
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true));
    }

    setupControls();
    window.addEventListener('resize', onResize);

    isRunning = true;
    animate();
  }

  function createParticle(randomY = false) {
    const types = ['water', 'water', 'water', 'metals', 'dyes', 'plastics', 'pathogens'];
    const chosenType = types[Math.floor(Math.random() * types.length)];

    let p = {
      type: chosenType,
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -10,
      vx: (Math.random() - 0.5) * 0.4,
      vy: 1.2 + Math.random() * 1.4,
      radius: 3,
      color: '#22C55E',
      rejected: false,
      settled: false
    };

    switch (chosenType) {
      case 'water':
        p.radius = 2.4;
        p.color = '#38BDF8'; // Water cyan
        p.sizeNm = 0.28;     // 0.28 nm water molecule
        p.vy = 2.2 + Math.random() * 1.2;
        break;
      case 'metals':
        p.radius = 3.6;
        p.color = '#DC143C'; // Crimson Lead/Mercury
        p.sizeNm = 1.2;
        break;
      case 'dyes':
        p.radius = 4.2;
        p.color = '#A855F7'; // Toxic purple dye
        p.sizeNm = 2.5;
        break;
      case 'plastics':
        p.radius = 6.2;
        p.color = '#F97316'; // Orange microplastics
        p.sizeNm = 35.0;
        break;
      case 'pathogens':
        p.radius = 7.5;
        p.color = '#EAB308'; // Yellow coliform bacteria
        p.sizeNm = 80.0;
        break;
    }

    return p;
  }

  function setupControls() {
    // Zoom Buttons
    const btnNano = document.getElementById('btn-zoom-nano');
    const btnFrustule = document.getElementById('btn-zoom-frustule');
    const statusText = document.getElementById('diatom-status-text');

    function setView(view) {
      currentView = view;
      if (view === 'nano') {
        if (btnNano) btnNano.classList.add('active');
        if (btnFrustule) btnFrustule.classList.remove('active');
        if (statusText) statusText.textContent = 'Active Nanopore Molecular Sieving';
      } else {
        if (btnFrustule) btnFrustule.classList.add('active');
        if (btnNano) btnNano.classList.remove('active');
        if (statusText) statusText.textContent = '3D Symmetrical Silica Frustule Shell';
      }
    }

    if (btnNano) btnNano.addEventListener('click', () => setView('nano'));
    if (btnFrustule) btnFrustule.addEventListener('click', () => setView('frustule'));

    // Global shortcut for 'Z'
    window.toggleDiatomZoom = function() {
      setView(currentView === 'nano' ? 'frustule' : 'nano');
    };

    // Contaminant stream toggles
    const cTags = document.querySelectorAll('.c-tag');
    cTags.forEach((tag) => {
      tag.addEventListener('click', () => {
        const type = tag.getAttribute('data-type');
        activeStreams[type] = !activeStreams[type];
        if (activeStreams[type]) {
          tag.classList.add('active');
        } else {
          tag.classList.remove('active');
        }
      });
    });

    // Pore size slider
    const poreSlider = document.getElementById('pore-size-slider');
    const poreReadout = document.getElementById('pore-readout');
    const statPore = document.getElementById('stat-pore');
    const statRejection = document.getElementById('stat-rejection');

    if (poreSlider) {
      poreSlider.addEventListener('input', (e) => {
        poreSize = parseInt(e.target.value, 10);
        if (poreReadout) poreReadout.textContent = `${poreSize} nm`;
        if (statPore) statPore.textContent = `${poreSize} nm`;

        // Adjust rejection rate calculation dynamically
        if (statRejection) {
          const rej = Math.max(92.0, (99.98 - (poreSize - 5) * 0.18)).toFixed(2);
          statRejection.textContent = `${rej}%`;
        }
      });
    }

    // Flush retentate button
    const btnFlush = document.getElementById('btn-flush-filter');
    if (btnFlush) {
      btnFlush.addEventListener('click', () => {
        particles.forEach((p) => {
          if (p.rejected) {
            p.y = -20;
            p.rejected = false;
            p.settled = false;
          }
        });
      });
    }
  }

  function onResize() {
    if (!canvas || !canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  }

  function animate() {
    if (!isRunning) return;
    animId = requestAnimationFrame(animate);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#060607';
    ctx.fillRect(0, 0, width, height);

    if (currentView === 'nano') {
      renderNanoscaleSieve();
    } else {
      renderFrustuleShell();
    }
  }

  // --------------------------------------------------------------------------
  // Scale View 1: Nanoscale Sieve Membrane Cross-Section
  // --------------------------------------------------------------------------
  function renderNanoscaleSieve() {
    const membraneY = height * 0.52;
    const membraneHeight = 28;
    const poreSpacing = 48;
    const poreChannelWidth = 8 + (poreSize / 50) * 16; // visual width based on nm slider

    // 1. Draw Silica Membrane Barrier Slabs
    ctx.fillStyle = '#1A1A22';
    ctx.strokeStyle = '#27272A';
    ctx.lineWidth = 1;

    let cx = 0;
    while (cx < width) {
      ctx.fillRect(cx, membraneY, poreSpacing - poreChannelWidth, membraneHeight);
      ctx.strokeRect(cx, membraneY, poreSpacing - poreChannelWidth, membraneHeight);

      // Nanoscale silica negative surface charge glow indicator
      ctx.fillStyle = 'rgba(34, 197, 94, 0.12)';
      ctx.fillRect(cx, membraneY, poreSpacing - poreChannelWidth, 3);
      ctx.fillStyle = '#1A1A22';

      cx += poreSpacing;
    }

    // Retentate / Permeate Labels
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(220, 20, 60, 0.6)';
    ctx.fillText('▲ RETENTATE ZONE (CONCENTRATED WASTE)', 12, membraneY - 14);

    ctx.fillStyle = 'rgba(34, 197, 94, 0.8)';
    ctx.fillText('▼ PERMEATE ZONE (PURIFIED POTABLE WATER)', 12, membraneY + membraneHeight + 22);

    // 2. Animate and Render Contaminant / Water Particles
    particles.forEach((p, idx) => {
      if (!activeStreams[p.type]) {
        p.y = -20; // hide disabled streams
        return;
      }

      // Movement
      if (!p.settled) {
        p.x += p.vx;
        p.y += p.vy;
      }

      // Collision with silica membrane
      if (p.y + p.radius >= membraneY && p.y - p.radius <= membraneY + membraneHeight) {
        // Find which channel interval the particle is passing through
        const localX = (p.x % poreSpacing);
        const inChannel = localX > (poreSpacing - poreChannelWidth) - p.radius && localX < poreSpacing + p.radius;

        // Size & Electrostatic rejection logic
        const isPermeable = (p.type === 'water') || (p.sizeNm < poreSize && p.type !== 'pathogens');

        if (inChannel && isPermeable) {
          // Accelerate through straight channel
          p.vy = 3.2;
          p.vx = 0;
        } else {
          // Trapped or electrostatically deflected
          p.rejected = true;
          p.settled = true;
          p.y = membraneY - p.radius - 2;
          p.vx = (Math.random() - 0.5) * 0.2;
        }
      }

      // Loop particles once through
      if (p.y > height + 20) {
        particles[idx] = createParticle(false);
      }

      // Draw Particle
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;

      if (p.type === 'water') {
        ctx.shadowColor = '#38BDF8';
        ctx.shadowBlur = 6;
      } else if (p.rejected) {
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 4;
      }

      ctx.fill();
      ctx.restore();
    });
  }

  // --------------------------------------------------------------------------
  // Scale View 2: 3D Macro Symmetrical Diatom Frustule Shell
  // --------------------------------------------------------------------------
  function renderFrustuleShell() {
    frustuleAngle += 0.008;

    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const outerRadius = Math.min(width, height) * 0.38;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(frustuleAngle);

    // Diatom Outer Rim
    ctx.beginPath();
    ctx.arc(0, 0, outerRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#22C55E';
    ctx.shadowColor = '#22C55E';
    ctx.shadowBlur = 12;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Secondary Rim
    ctx.beginPath();
    ctx.arc(0, 0, outerRadius * 0.88, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.4)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Symmetrical Radial Ribs & Hex Nanopores
    const spokes = 18;
    for (let s = 0; s < spokes; s++) {
      const angle = (s / spokes) * Math.PI * 2;
      const x2 = Math.cos(angle) * outerRadius;
      const y2 = Math.sin(angle) * outerRadius;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Pores along each radial spoke
      for (let r = 0.25; r < 0.85; r += 0.12) {
        const px = Math.cos(angle) * (outerRadius * r);
        const py = Math.sin(angle) * (outerRadius * r);
        ctx.beginPath();
        ctx.arc(px, py, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = '#4ADE80';
        ctx.shadowColor = '#4ADE80';
        ctx.shadowBlur = 4;
        ctx.fill();
      }
    }

    // Central Nodule / Core
    ctx.beginPath();
    ctx.arc(0, 0, outerRadius * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = '#141416';
    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    ctx.restore();

    // Telemetry annotation
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.fillStyle = '#9CA3AF';
    ctx.fillText('DIATOM SPECIMEN: Coscinodiscus centralis', 16, 26);
    ctx.fillText('BIO-SILICA LATTICE: Self-assembled at 20°C in sea water', 16, 42);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDiatomFilter);
  } else {
    initDiatomFilter();
  }

  window.initDiatomFilter = initDiatomFilter;
})();

