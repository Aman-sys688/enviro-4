/**
 * BIO-INSPIRED SUSTAINABILITY & ENVIRONMENTAL TECHNOLOGIES
 * Master Application Coordinator & Presentation Engine
 * Presenters: Kamaksha Sharma & Mahim Jain (MBA Tech)
 */

(function() {
  'use strict';

  // State
  let currentSlideIndex = 0;
  const totalSlides = 6;
  const slideElements = [];
  const slideLabels = [
    '01 // HERO OVERVIEW',
    '02 // BIOMIMICRY FOUNDATIONS',
    '03 // WHY BIO-SUSTAINABILITY',
    '04 // CASE STUDY: OWL TURBINES',
    '05 // CASE STUDY: DIATOM FILTERS',
    '06 // IMPACT & MBA TECH VISION'
  ];

  // Speaker Notes Content tailored for Kamaksha & Mahim
  const speakerNotesData = [
    {
      slide: '01 // Hero Overview',
      speaker: 'Kamaksha Sharma & Mahim Jain',
      notes: [
        'Welcome the professors and audience. State title clearly: "Bio-Inspired Sustainability and Environmental Technologies: Learning Sustainable Solutions from Nature".',
        'Frame the core thesis: Over 3.8 billion years of evolution, nature has resolved complex aerodynamic, hydraulic, and material challenges using minimal energy and zero waste.',
        'Point to the rotating 3D bio-model representing our multidisciplinary focus: Photosynthesis, Biomechanics, DNA Synthesis, Hydrology, and Aerodynamics.'
      ]
    },
    {
      slide: '02 // Biomimicry Strategy & Benchmark Cases',
      speaker: 'Kamaksha Sharma',
      notes: [
        'Clarify the definition: Biomimicry is NOT copying form blindly—it is translating underlying physical and chemical strategies.',
        'Walk through the 3-Step Flow: (1) Observe Nature, (2) Understand Strategy, (3) Adapt & Create into scalable engineering.',
        'Cite the benchmark cases: Kingfisher beak eliminating bullet train sonic booms; Sharkskin riblets reducing aircraft drag; Termite mounds cutting building HVAC energy by 90%.'
      ]
    },
    {
      slide: '03 // Why Bio-Inspired Sustainability',
      speaker: 'Mahim Jain',
      notes: [
        'Contrast conventional industrial manufacturing ("Heat, Beat, and Treat") against biological systems ("Ambient, Solar, Closed-Loop").',
        'Highlight the 4 pillars: Energy Overconsumption, Water Scarcity, Pollution & Waste, and Climate Change.',
        'Demo the Regenerative Resilience simulation slider: Drag it to show how damaged ecosystems heal through interconnected root and canopy networks.'
      ]
    },
    {
      slide: '04 // Case Study 1: Owl-Inspired Silent Wind Turbines',
      speaker: 'Kamaksha Sharma',
      notes: [
        'Introduce the problem: Aerodynamic trailing turbulence limits where wind farms can be built near human communities.',
        'Reveal nature’s blueprint: Barn Owls (Tyto alba) hunt silently using leading-edge serrations, fringed trailing edges, and velvety down.',
        'LIVE DEMO: Toggle from Smooth Blade to Owl-Serrated Blade. Point out the live noise meter dropping from 104.5 dB to 92.2 dB (a massive 12.3 dB reduction).',
        'Emphasize the business ROI: Lift-to-drag ratio is 99.8% preserved—meaning full electrical output with 65% closer community setback permits.'
      ]
    },
    {
      slide: '05 // Case Study 2: Diatom Water Filtration',
      speaker: 'Mahim Jain',
      notes: [
        'Introduce Diatoms: Microscopic single-celled algae with amorphous silica frustules featuring hierarchical nanoscale straight pores.',
        'Highlight the engineering breakthrough: Traditional Reverse Osmosis membranes require immense pumping power and foul quickly.',
        'LIVE DEMO: Toggle between 3D Frustule shell and Nanoscale Cross-Section. Show how heavy metals, toxic dyes, and microplastics are rejected while pure H2O passes straight through.',
        'Quantify the numbers: 99.94% contaminant rejection and 41.8% energy reduction compared to standard polyamide membranes.'
      ]
    },
    {
      slide: '06 // Strategic Horizon & MBA Tech Vision',
      speaker: 'Kamaksha Sharma & Mahim Jain',
      notes: [
        'Synthesize the 3 Pillars: Passive geometry over brute energy, hierarchical room-temperature self-assembly, and closed-loop circular business models.',
        'Conclude with the MBA Tech takeaway: Sustainability is a driver of competitive advantage and operational efficiency.',
        'Invite questions from the panel and offer to replay any of the 3D models or simulations.'
      ]
    }
  ];

  // Benchmark tabs data for Slide 2
  const benchmarkData = {
    kingfisher: '<strong>Kingfisher Beak to Shinkansen Train:</strong> Eiji Nakatsu modeled the train nose after the kingfisher beak, which transitions between air and water with zero splash. Result: 10% faster, 15% less power consumption, and completely eliminated sonic boom shockwaves in tunnels.',
    shark: '<strong>Shark Denticles to Riblet Aerodynamics:</strong> Microscopic dermal denticles on fast-swimming sharks channel boundary layer fluid, delaying vortex detachment. Applied to aircraft wings and wind blades, riblet films reduce aerodynamic drag by 6–8% and prevent marine bio-fouling.',
    termite: '<strong>Termite Mounds to Passive HVAC Architecture:</strong> Mick Pearce modeled Zimbabwe’s Eastgate Centre after macrotermes termite mounds, which use chimney convection and thermal mass to maintain constant 30°C interior temperatures. Result: 90% less air conditioning energy than conventional buildings.'
  };

  // Sound Engine (Web Audio API)
  let audioCtx = null;
  let audioEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.08) {
    if (!audioEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  function playSlideChime() {
    playTone(523.25, 'sine', 0.12, 0.05); // C5
    setTimeout(() => playTone(659.25, 'sine', 0.18, 0.04), 60); // E5
  }

  function playToggleChime() {
    playTone(440, 'triangle', 0.1, 0.06);
    setTimeout(() => playTone(880, 'sine', 0.15, 0.05), 50);
  }

  // --------------------------------------------------------------------------
  // Initialization
  // --------------------------------------------------------------------------
  function initApp() {
    // Collect slide DOM nodes
    for (let i = 0; i < totalSlides; i++) {
      const el = document.getElementById(getSlideIdByIndex(i));
      if (el) slideElements.push(el);
    }

    setupSlideNavigation();
    setupModals();
    setupHUDButtons();
    setupSlide2BenchmarkTabs();
    initAmbientParticles();

    // Initial update
    goToSlide(0, false);
  }

  function getSlideIdByIndex(idx) {
    switch (idx) {
      case 0: return 'slide-hero';
      case 1: return 'slide-what';
      case 2: return 'slide-why';
      case 3: return 'slide-owl';
      case 4: return 'slide-diatom';
      case 5: return 'slide-summary';
      default: return 'slide-hero';
    }
  }

  // --------------------------------------------------------------------------
  // Slide Transitions & State
  // --------------------------------------------------------------------------
  function goToSlide(targetIndex, playSound = true) {
    if (targetIndex < 0 || targetIndex >= totalSlides) return;
    if (targetIndex === currentSlideIndex && playSound) return;

    // Deactivate previous slide
    slideElements.forEach((s, idx) => {
      s.classList.remove('active');
    });

    // Activate target slide
    currentSlideIndex = targetIndex;
    const targetSlide = slideElements[currentSlideIndex];
    if (targetSlide) {
      targetSlide.classList.add('active');
    }

    // Update Progress Bar
    const progressBar = document.getElementById('presentation-progress-bar');
    if (progressBar) {
      const pct = ((currentSlideIndex + 1) / totalSlides) * 100;
      progressBar.style.width = `${pct}%`;
    }

    // Update HUD Slide Indicators
    const labelPill = document.getElementById('current-slide-label');
    if (labelPill) {
      labelPill.textContent = slideLabels[currentSlideIndex];
    }

    const slideNumDisplay = document.getElementById('current-slide-num');
    if (slideNumDisplay) {
      slideNumDisplay.textContent = `0${currentSlideIndex + 1}`;
    }

    // Update Floating Nav Dots
    const dots = document.querySelectorAll('.nav-dot');
    dots.forEach((dot, idx) => {
      if (idx === currentSlideIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update Notes Content if open
    updateNotesContent();

    if (playSound) {
      playSlideChime();
    }
  }

  function nextSlide() {
    if (currentSlideIndex < totalSlides - 1) {
      goToSlide(currentSlideIndex + 1);
    }
  }

  function prevSlide() {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1);
    }
  }

  // --------------------------------------------------------------------------
  // Navigation Event Listeners (Keyboard + Clicks)
  // --------------------------------------------------------------------------
  function setupSlideNavigation() {
    // Bottom Controls
    const btnNext = document.getElementById('btn-next-slide');
    const btnPrev = document.getElementById('btn-prev-slide');
    if (btnNext) btnNext.addEventListener('click', nextSlide);
    if (btnPrev) btnPrev.addEventListener('click', prevSlide);

    // Hero Start Button
    const btnHeroStart = document.getElementById('btn-hero-start');
    if (btnHeroStart) btnHeroStart.addEventListener('click', () => goToSlide(1));

    // Summary Slide Jump Buttons
    const btnReplay = document.getElementById('btn-replay-deck');
    const btnJumpOwl = document.getElementById('btn-jump-owl');
    const btnJumpDiatom = document.getElementById('btn-jump-diatom');

    if (btnReplay) btnReplay.addEventListener('click', () => goToSlide(0));
    if (btnJumpOwl) btnJumpOwl.addEventListener('click', () => goToSlide(3));
    if (btnJumpDiatom) btnJumpDiatom.addEventListener('click', () => goToSlide(4));

    // Floating Nav Dots
    const dots = document.querySelectorAll('.nav-dot');
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const slideIdx = parseInt(dot.getAttribute('data-slide'), 10);
        goToSlide(slideIdx);
      });
    });

    // Global Keyboard Navigation
    document.addEventListener('keydown', (e) => {
      // Don't intercept if an input is focused
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          nextSlide();
          break;

        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          prevSlide();
          break;

        case 'Home':
          goToSlide(0);
          break;

        case 'End':
          goToSlide(totalSlides - 1);
          break;

        case 'f':
        case 'F':
          toggleFullscreen();
          break;

        case 'n':
        case 'N':
          toggleNotesModal();
          break;

        case '?':
          toggleHelpModal();
          break;

        case 'm':
        case 'M':
          toggleReducedMotion();
          break;

        case 't':
        case 'T':
          if (window.toggleTurbineBladeMode && currentSlideIndex === 3) {
            window.toggleTurbineBladeMode();
            playToggleChime();
          }
          break;

        case 'z':
        case 'Z':
          if (window.toggleDiatomZoom && currentSlideIndex === 4) {
            window.toggleDiatomZoom();
            playToggleChime();
          }
          break;

        case 'Escape':
          closeAllModals();
          break;

        default:
          // Check digit keys 1 through 6
          const num = parseInt(e.key, 10);
          if (!isNaN(num) && num >= 1 && num <= totalSlides) {
            goToSlide(num - 1);
          }
          break;
      }
    });
  }

  // --------------------------------------------------------------------------
  // Top HUD Bar Actions
  // --------------------------------------------------------------------------
  function setupHUDButtons() {
    // Fullscreen
    const btnFs = document.getElementById('btn-fullscreen');
    if (btnFs) btnFs.addEventListener('click', toggleFullscreen);

    // Reduced Motion
    const btnMotion = document.getElementById('btn-reduced-motion');
    if (btnMotion) btnMotion.addEventListener('click', toggleReducedMotion);

    // Audio SFX Toggle
    const btnAudio = document.getElementById('btn-audio');
    const iconAudioOn = document.getElementById('icon-audio-on');
    const iconAudioOff = document.getElementById('icon-audio-off');

    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        audioEnabled = !audioEnabled;
        if (audioEnabled) {
          iconAudioOn.classList.remove('hidden');
          iconAudioOff.classList.add('hidden');
          playToggleChime();
        } else {
          iconAudioOn.classList.add('hidden');
          iconAudioOff.classList.remove('hidden');
        }
      });
    }

    // Notes Toggle
    const btnNotes = document.getElementById('btn-notes');
    if (btnNotes) btnNotes.addEventListener('click', toggleNotesModal);

    // Help Toggle
    const btnHelp = document.getElementById('btn-help');
    if (btnHelp) btnHelp.addEventListener('click', toggleHelpModal);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Fullscreen request failed: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  function toggleReducedMotion() {
    document.body.classList.toggle('reduced-motion');
    const isReduced = document.body.classList.contains('reduced-motion');
    playTone(isReduced ? 300 : 600, 'sine', 0.1, 0.05);
  }

  // --------------------------------------------------------------------------
  // Modals (Speaker Notes & Keyboard Help)
  // --------------------------------------------------------------------------
  function setupModals() {
    const modalNotes = document.getElementById('modal-notes');
    const btnCloseNotes = document.getElementById('btn-close-notes');
    if (btnCloseNotes) btnCloseNotes.addEventListener('click', () => modalNotes.classList.add('hidden'));

    const modalHelp = document.getElementById('modal-help');
    const btnCloseHelp = document.getElementById('btn-close-help');
    if (btnCloseHelp) btnCloseHelp.addEventListener('click', () => modalHelp.classList.add('hidden'));

    // Click backdrop to dismiss
    [modalNotes, modalHelp].forEach((m) => {
      if (m) {
        m.addEventListener('click', (e) => {
          if (e.target === m) m.classList.add('hidden');
        });
      }
    });
  }

  function toggleNotesModal() {
    const modal = document.getElementById('modal-notes');
    if (modal) {
      modal.classList.toggle('hidden');
      if (!modal.classList.contains('hidden')) {
        updateNotesContent();
      }
    }
  }

  function toggleHelpModal() {
    const modal = document.getElementById('modal-help');
    if (modal) modal.classList.toggle('hidden');
  }

  function closeAllModals() {
    const modalNotes = document.getElementById('modal-notes');
    const modalHelp = document.getElementById('modal-help');
    if (modalNotes) modalNotes.classList.add('hidden');
    if (modalHelp) modalHelp.classList.add('hidden');
  }

  function updateNotesContent() {
    const container = document.getElementById('notes-content');
    if (!container) return;

    const data = speakerNotesData[currentSlideIndex] || speakerNotesData[0];
    let html = `
      <div class="notes-section">
        <div class="notes-speaker">${data.speaker} // ${data.slide}</div>
        <ul class="notes-points">
    `;
    data.notes.forEach((pt) => {
      html += `<li>${pt}</li>`;
    });
    html += `
        </ul>
      </div>
    `;
    container.innerHTML = html;
  }

  // --------------------------------------------------------------------------
  // Slide 2: Benchmark Tabs Switcher
  // --------------------------------------------------------------------------
  function setupSlide2BenchmarkTabs() {
    const tabs = document.querySelectorAll('.b-tab');
    const display = document.getElementById('benchmark-display-content');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const caseKey = tab.getAttribute('data-case');
        if (display && benchmarkData[caseKey]) {
          display.innerHTML = benchmarkData[caseKey];
          playTone(550, 'triangle', 0.08, 0.04);
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // Ambient Global Background Particles (Projector Atmosphere)
  // --------------------------------------------------------------------------
  function initAmbientParticles() {
    const canvas = document.getElementById('ambient-particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const particles = [];
    const count = 40;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        color: (i % 4 === 0) ? '#22C55E' : '#9CA3AF'
      });
    }

    function renderAmbient() {
      requestAnimationFrame(renderAmbient);
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;
    }

    window.addEventListener('resize', () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    renderAmbient();
  }

  // Bootstrap when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();

