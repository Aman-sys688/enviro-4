# Bio-Inspired Sustainability and Environmental Technologies
### Learning Sustainable Solutions from Nature

[![60 FPS](https://img.shields.io/badge/Performance-60_FPS-22C55E?style=for-the-badge&logo=speedtest&logoColor=white)](#)
[![Three.js](https://img.shields.io/badge/Three.js-r128-black?style=for-the-badge&logo=three.dot.js&logoColor=white)](#)
[![Zero Build Step](https://img.shields.io/badge/Architecture-Vanilla_Web_Stack-DC143C?style=for-the-badge)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](#)

A sleek, cinematic, projector-optimized interactive single-page presentation web app created for:
**"Bio-Inspired Sustainability and Environmental Technologies: Learning Sustainable Solutions from Nature"**  
**Presenters**: **Kamaksha Sharma** & **Mahim Jain** (MBA Tech)

---

## 🌟 Live Demo & Presentation Highlights

- **Zero Build Step**: Built entirely in vanilla HTML5, CSS3, and JavaScript with CDN dependencies. Runs immediately in any browser or GitHub Pages.
- **Projector Design Language**: Matte black base (`#0B0B0C`, `#141416`), dual accents (Crimson `#DC143C` for problems & turbulence, Vivid Green `#22C55E` for biomimicry & laminar efficiency), subtle noise grain, and glassmorphism.
- **Three.js 3D Bio-Sapling & Hex Ring**: Interactive growing sapling with bioluminescent leaves and slow-rotating hex icon ring (Leaf, Gear, DNA, Water Drop, Wind Turbine).
- **Interactive Case Study 1 — Owl-Inspired Wind Turbines**:
  - Live 3D turbine model with real-time toggle between **Smooth Blade** and **Owl-Serrated Blade**.
  - Airflow particle physics: chaotic crimson turbulence vs. smooth green micro-vortices.
  - Live decibel gauge showing **104.5 dB $\rightarrow$ 92.2 dB (-12.3 dB noise reduction)** and acoustic oscilloscope waveform.
  - Performance telemetry: Lift-to-drag ratio 99.8% preserved.
- **Interactive Case Study 2 — Diatom-Inspired Water Filtration**:
  - Multi-scale zoom: 3D Frustule shell $\leftrightarrow$ Nanoscale straight-through pore cross-section.
  - Multi-contaminant particle sieving simulation (heavy metals, dyes, microplastics, pathogens, and pure $H_2O$).
  - Dynamic pore cutoff slider (5nm – 50nm) and retentate flush trigger.
- **Built-in Speaker Tools**: Integrated Speaker Notes drawer (<kbd>N</kbd>) with slide-by-slide cues for Kamaksha and Mahim, fullscreen toggle (<kbd>F</kbd>), and Web Audio API synthesizer SFX.

---

## 🚀 Quick Start / Local Run

### Method 1: Python Built-in Server
```bash
# Clone the repository
git clone https://github.com/<your-username>/bio-inspired-sustainability.git
cd bio-inspired-sustainability

# Start local server
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### Method 2: Node npx serve
```bash
npx serve -l 8000
```

### Method 3: Direct File
Simply double-click `index.html` to open it in Google Chrome, Microsoft Edge, or Firefox.

---

## 🌐 Deploying to GitHub Pages (Free Instant Hosting)

1. Push this repository to GitHub.
2. Go to **Settings** > **Pages** in your GitHub repository.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save**.
5. Your presentation is now live worldwide at `https://<your-username>.github.io/<repo-name>/`!

---

## ⌨️ Presentation Keyboard Shortcuts

| Shortcut | Description |
| :--- | :--- |
| <kbd>→</kbd> / <kbd>Space</kbd> / <kbd>PageDown</kbd> | Next slide |
| <kbd>←</kbd> / <kbd>PageUp</kbd> | Previous slide |
| <kbd>F</kbd> | Toggle Fullscreen Projector Mode |
| <kbd>N</kbd> | Open / Close Speaker Speaking Notes (Kamaksha & Mahim) |
| <kbd>T</kbd> | Toggle Wind Turbine Blade (Smooth vs. Owl Serrated) |
| <kbd>Z</kbd> | Toggle Diatom Scale View (Nano Pores vs. 3D Frustule) |
| <kbd>M</kbd> | Toggle Reduced Motion Mode |
| <kbd>?</kbd> | Open Projector Help Modal |
| <kbd>1</kbd> – <kbd>6</kbd> | Jump directly to Slide 1 through 6 |

---

## 📁 Repository Structure

```
├── index.html              # Core single-page slide deck & DOM structure
├── style.css               # Matte black & dual-accent styling, typography, HUD
├── script.js               # Presentation engine, Web Audio synth, speaker notes
├── js/
│   ├── hero-scene.js       # Three.js 3D glowing sapling & rotating hex ring
│   ├── why-visual.js       # Dynamic cracked earth to living sprout canvas
│   ├── wind-turbine.js     # 3D wind turbine, airflow particle simulation, dB meter
│   └── diatom-filter.js    # Multi-scale diatom frustule & molecular sieve engine
├── .nojekyll               # Ensures raw asset serving on GitHub Pages
├── .gitignore              # Standard git exclusion rules
└── README.md               # Documentation and presentation guide
```

---

## 👥 Authors & Credits

- **Kamaksha Sharma** — MBA Tech
- **Mahim Jain** — MBA Tech

*Topic: Bio-Inspired Sustainability and Environmental Technologies: Learning Sustainable Solutions from Nature*

