# Project Structure

```
visual-canvas-lab/
├── .git/
├── .next/
├── New artifacts/
├── node_modules/
├── public/
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   ├── window.svg
│   └── file.svg
├── scripts/
│   ├── seed-production.js
│   ├── seed-presets.js
│   ├── build-docker.sh
│   └── validate-config.js
├── src/
│   ├── ai-system/
│   │   ├── components/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── README.md
│   │   └── index.ts
│   ├── app/
│   │   ├── api/
│   │   ├── globals.css
│   │   ├── page.tsx
│   │   ├── page.module.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── EnhancedVisualCanvas.tsx
│   │   ├── GlobalDefaultsManager.tsx
│   │   ├── Scene.tsx
│   │   ├── Cubes.tsx
│   │   ├── ShapeParticleDashboard.tsx
│   │   ├── TrailObject.tsx
│   │   ├── TrailControlPanel.tsx
│   │   ├── Blobs.tsx
│   │   ├── BottomButtonBar.tsx
│   │   ├── TrailToggle.tsx
│   │   ├── artistic/
│   │   ├── Metamorphosis.tsx
│   │   ├── LayeredSineWaves.tsx
│   │   ├── AIToggle.module.css
│   │   ├── GlobalDefaultsToggle.module.css
│   │   ├── DashboardToggle.module.css
│   │   ├── AIToggle.tsx
│   │   ├── PresetControls.tsx
│   │   ├── PresetManager.tsx
│   │   ├── Particles.tsx
│   │   ├── Fireflies.tsx
│   │   ├── WaveInterference.tsx
│   │   ├── Toruses.tsx
│   │   ├── Spheres.tsx
│   │   ├── EnhancedVisualCanvas.module.css
│   │   ├── GlobalEffectsDashboard.tsx
│   │   ├── PerformanceIndicator.module.css
│   │   ├── PerformanceIndicator.tsx
│   │   ├── GlobalDefaultsToggle.tsx
│   │   ├── DashboardToggle.tsx
│   │   ├── ShapeParticleDashboard.module.css
│   │   ├── ObjectTrails.tsx
│   │   ├── GlobalEffectsDashboard.module.css
│   │   ├── ToggleControl.tsx
│   │   └── SliderControl.tsx
│   ├── lib/
│   │   ├── mongodb.ts
│   │   ├── presetService.ts
│   │   └── presetClient.ts
│   ├── store/
│   │   ├── visualStore.ts
│   │   └── aiStore.ts
│   ├── styles/
│   │   └── Home.module.css
│   ├── types/
│   │   ├── react-three-postprocessing.d.ts
│   │   ├── artistic.ts
│   │   └── preset.ts
│   └── utils/
│       ├── globalDefaults.ts
│       ├── performanceOptimizer.ts
│       ├── performanceMonitor.ts
│       └── backgroundLayout.ts
├── .dockerignore
├── Dockerfile
├── MONGODB_SETUP.md
├── README.md
├── DEBUG_GUIDE.md
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── parameter_mapping.ts
├── next-env.d.ts
├── next.config.js
├── next.config.ts
├── railway.toml
├── .eslintrc.json
├── .gitignore
├── tsconfig.json
├── tsconfig.tsbuildinfo
├── eslint.config.mjs
``` 