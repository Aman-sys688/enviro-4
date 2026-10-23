/**
 * WHY BIO-SUSTAINABILITY: Cracked Earth to Living Sprout Visual
 * Interactive 2D Canvas Simulation
 * - Procedural cracked arid drought soil with glowing crimson fissures
 * - Healing root network and bioluminescent emerald sprouts that expand as regeneration increases
 * - Interactive slider and mouse-proximity luminescence
 */

(function() {
  'use strict';

  let canvas, ctx;
  let width, height;
  let regenerationLevel = 0.7; // default 70%
  let mouse = { x: -100, y: -100, active: false };
  let cracks = [];
  let roots = [];
  let spores = [];
  let animId = null;

  function initWhyVisual() {
    canvas = document.getElementById('why-regeneration-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    width = canvas.width = 460;
    height = canvas.height = 460;

    // Generate baseline cracks
    createCracks();

    // Generate botanical root branches
    createRoots();

    // Generate ambient spores
    createSpores();

    // Slider listener
    const slider = document.getElementById('regeneration-slider');
    const readout = document.getElementById('regeneration-readout');

    if (slider) {
      slider.addEventListener('input', (e) => {
        regenerationLevel = parseInt(e.target.value, 10) / 100;
        if (readout) {
          readout.textContent = `${e.target.value}% Reborn`;
        }
      });
    }

    // Canvas Mouse interaction
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * (width / rect.width);
      mouse.y = (e.clientY - rect.top) * (height / rect.height);
      mouse.active = true;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    render();
  }

  function createCracks() {
    cracks = [];
    const crackCount = 18;
    for (let i = 0; i < crackCount; i++) {
      const startX = width * 0.5 + (Math.random() - 0.5) * 80;
      const startY = height * 0.75 + (Math.random() - 0.5) * 60;
      const points = [{ x: startX, y: startY }];
      let currX = startX;
      let currY = startY;
      const segments = Math.floor(Math.random() * 8) + 6;

      for (let s = 0; s < segments; s++) {
        currX += (Math.random() - 0.5) * 60;
        currY += (Math.random() - 0.25) * 45;
        points.push({ x: currX, y: currY });
      }
      cracks.push({ points, width: Math.random() * 3 + 1.5 });
    }
  }

  function createRoots() {
    roots = [];
    const rootCount = 28;
    for (let i = 0; i < rootCount; i++) {
      const angle = (i / rootCount) * Math.PI * 2;
      const length = Math.random() * 160 + 80;
      const originX = width * 0.5;
      const originY = height * 0.62;

      const segments = [];
      let cx = originX;
      let cy = originY;
      const steps = 14;

      for (let s = 0; s < steps; s++) {
        const stepDist = length / steps;
        const curAngle = angle + (Math.random() - 0.5) * 0.55;
        cx += Math.cos(curAngle) * stepDist;
        cy += Math.sin(curAngle) * stepDist + (s * 0.8); // bias downwards
        segments.push({ x: cx, y: cy });
      }
      roots.push({ segments, length, angle });
    }
  }

  function createSpores() {
    spores = [];
    for (let i = 0; i < 45; i++) {
      spores.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -Math.random() * 0.8 - 0.2,
        size: Math.random() * 2.5 + 1.2,
        alpha: Math.random() * 0.6 + 0.3
      });
    }
  }

  function render() {
    animId = requestAnimationFrame(render);
    ctx.clearRect(0, 0, width, height);

    // 1. Dark background
    ctx.fillStyle = '#060607';
    ctx.fillRect(0, 0, width, height);

    // 2. Arid cracked drought ground (Dominates when regenerationLevel is low)
    const droughtAlpha = Math.max(0, 1 - regenerationLevel * 1.2);
    if (droughtAlpha > 0.05) {
      ctx.save();
      ctx.strokeStyle = `rgba(220, 20, 60, ${droughtAlpha * 0.75})`;
      ctx.shadowColor = 'rgba(220, 20, 60, 0.4)';
      ctx.shadowBlur = 6;

      cracks.forEach((c) => {
        ctx.beginPath();
        ctx.lineWidth = c.width * droughtAlpha;
        c.points.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
      });
      ctx.restore();
    }

    // 3. Living bioluminescent root web (Expands with regenerationLevel)
    const bioAlpha = regenerationLevel;
    if (bioAlpha > 0.02) {
      ctx.save();
      ctx.shadowColor = 'rgba(34, 197, 94, 0.65)';
      ctx.shadowBlur = 12 * bioAlpha;

      roots.forEach((root) => {
        const visibleCount = Math.floor(root.segments.length * bioAlpha);
        if (visibleCount < 2) return;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(34, 197, 94, ${0.4 + bioAlpha * 0.55})`;
        ctx.lineWidth = (1 + bioAlpha * 2);

        ctx.moveTo(width * 0.5, height * 0.62);
        for (let j = 0; j < visibleCount; j++) {
          const pt = root.segments[j];
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();

        // Node buds
        if (visibleCount > 4) {
          const tip = root.segments[visibleCount - 1];
          ctx.beginPath();
          ctx.arc(tip.x, tip.y, 2.5 * bioAlpha, 0, Math.PI * 2);
          ctx.fillStyle = '#4ADE80';
          ctx.fill();
        }
      });
      ctx.restore();
    }

    // 4. Center Emerald Sprout
    const sproutScale = Math.max(0.1, regenerationLevel);
    ctx.save();
    ctx.translate(width * 0.5, height * 0.62);
    ctx.scale(sproutScale, sproutScale);

    // Stem
    ctx.beginPath();
    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#22C55E';
    ctx.shadowBlur = 14;
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(8, -40, 0, -85);
    ctx.stroke();

    // Left Leaf
    ctx.beginPath();
    ctx.fillStyle = '#22C55E';
    ctx.moveTo(0, -60);
    ctx.quadraticCurveTo(-35, -80, -45, -55);
    ctx.quadraticCurveTo(-25, -45, 0, -60);
    ctx.fill();

    // Right Leaf
    ctx.beginPath();
    ctx.fillStyle = '#4ADE80';
    ctx.moveTo(0, -75);
    ctx.quadraticCurveTo(35, -95, 45, -70);
    ctx.quadraticCurveTo(25, -60, 0, -75);
    ctx.fill();

    ctx.restore();

    // 5. Bioluminescent Floating Spores
    ctx.save();
    spores.forEach((s) => {
      s.x += s.vx;
      s.y += s.vy;

      if (s.y < 0) {
        s.y = height;
        s.x = Math.random() * width;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * sproutScale, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(74, 222, 128, ${s.alpha * sproutScale})`;
      ctx.shadowColor = '#4ADE80';
      ctx.shadowBlur = 8;
      ctx.fill();
    });
    ctx.restore();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhyVisual);
  } else {
    initWhyVisual();
  }

  window.initWhyVisual = initWhyVisual;
})();

