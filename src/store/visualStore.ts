import { create } from 'zustand';
import type { StateCreator } from 'zustand';

// Add new interface (doesn't break existing code)
interface BackgroundConfig {
  enabled: boolean;
  mode: 'full3D' | 'modalFriendly';
  viewport: {
    bounds: {
      x: [number, number];
      y: [number, number]; 
      z: [number, number];
    };
    safeZone: number;
  };
  timeScale: number;
  camera: {
    fixed: boolean;
    position: [number, number, number];
    target: [number, number, number];
  };
  // REDESIGNED: Artistic layout system for living digital artpiece
  artisticLayout: {
    layers: {
      deepBackground: {
        zPosition: number;
        objects: string[];
        opacity: number;
        movement: 'minimal' | 'slow' | 'normal' | 'active';
      };
      farBackground: {
        zPosition: number;
        objects: string[];
        opacity: number;
        movement: 'minimal' | 'slow' | 'normal' | 'active';
      };
      midBackground: {
        zPosition: number;
        objects: string[];
        opacity: number;
        movement: 'minimal' | 'slow' | 'normal' | 'active';
      };
      nearBackground: {
        zPosition: number;
        objects: string[];
        opacity: number;
        movement: 'minimal' | 'slow' | 'normal' | 'active';
      };
      foreground: {
        zPosition: number;
        objects: string[];
        opacity: number;
        movement: 'minimal' | 'slow' | 'normal' | 'active';
      };
    };
    camera: {
      position: [number, number, number];
      target: [number, number, number];
      fov: number;
    };
    viewport: {
      bounds: {
        x: [number, number];
        y: [number, number];
        z: [number, number];
      };
    };
  };
}

export interface VisualState {
  // UI State
  ui: {
    showDashboards: boolean;
    cameraPositioningMode: boolean; // NEW: Enable direct camera control on live view
  };
  
  // Background Layer
  background: {
    opacity: number;
    blur: number;
    color: string;
    gradient: boolean;
  };
  
  // NEW: Background configuration (starts disabled)
  backgroundConfig: BackgroundConfig;
  
  // Geometric Shapes Layer
  geometric: {
    spheres: {
      count: number;
      size: number;
      color: string;
      speed: number;
      opacity: number;
      organicness: number;
    };
    cubes: {
      count: number;
      size: number;
      color: string;
      rotation: number;
      opacity: number;
      organicness: number;
    };
    toruses: {
      count: number;
      size: number;
      color: string;
      speed: number;
      opacity: number;
      organicness: number;
    };
    blobs: {
      count: number;
      size: number;
      color: string;
      speed: number;
      opacity: number;
      organicness: number;
    };
    crystals: {
      count: number;
      size: number;
      color: string;
      rotation: number;
      opacity: number;
      complexity: number;
      organicness: number;
    };
    waveInterference: {
      color: string;
    };
    metamorphosis: {
      color: string;
    };
    fireflies: {
      color: string;
    };
    layeredSineWaves: {
      color: string;
    };
  };
  
  // Particles Layer
  particles: {
    count: number;
    size: number;
    color: string;
    speed: number;
    opacity: number;
    spread: number;
  };
  
  // ENHANCED: Global Effects System
  globalEffects: {
    // Layered Blur System
    atmosphericBlur: {
      enabled: boolean;
      intensity: number;
      layers: number;
    };
    
    // Color Blending & Interaction
    colorBlending: {
      enabled: boolean;
      mode: 'screen' | 'multiply' | 'overlay' | 'soft-light' | 'hard-light' | 'color-dodge';
      intensity: number;
    };
    
    // Shape Glow System (renamed from glowSystem)
    shapeGlow: {
      enabled: boolean;
      intensity: number;
      radius: number;
      useObjectColor: boolean; // When true, uses the object's color for glow
      customColor: string; // Used when useObjectColor is false
      pulsing: boolean;
      pulseSpeed: number;
    };
    
    // Chromatic Effects
    chromatic: {
      enabled: boolean;
      aberration: number;
      aberrationColors: {
        red: string;
        green: string;
        blue: string;
      };
      rainbow: {
        enabled: boolean;
        intensity: number;
        speed: number;
        rotation: number;
        blendMode: 'normal' | 'screen' | 'overlay' | 'soft-light' | 'hard-light' | 'color-dodge' | 'color-burn' | 'difference' | 'exclusion';
        colors: string[];
        opacity: number;
      };
      prism: number;
    };
    
    // Distortion Effects
    distortion: {
      enabled: boolean;
      wave: number;
      ripple: number;
      noise: number;
      frequency: number;
    };
    
    // Particle Interaction
    particleInteraction: {
      enabled: boolean;
      magnetism: number;
      repulsion: number;
      flowField: boolean;
      turbulence: number;
    };
    
    // Volumetric Effects
    volumetric: {
      enabled: boolean;
      fog: number;
      lightShafts: number;
      density: number;
      color: string;
    };

    // Object Trail System
    trails: {
      enabled: boolean;
      sphereTrails: {
        enabled: boolean;
        length: number;      // Trail length (number of trail points)
        opacity: number;     // Trail opacity
        width: number;       // Trail thickness
        fadeRate: number;    // How quickly trail fades
      };
      cubeTrails: {
        enabled: boolean;
        length: number;
        opacity: number;
        width: number;
        fadeRate: number;
      };
      blobTrails: {
        enabled: boolean;
        length: number;
        opacity: number;
        width: number;
        fadeRate: number;
      };
    };

    // Wave Interference System
    waveInterference: {
      enabled: boolean;
      speed: number;
      amplitude: number;
      contourLevels: number;
      edgeFade: {
        enabled: boolean;
        fadeStart: number; // Start fading at this distance from center (0-1)
        fadeEnd: number;   // Complete fade at this distance from center (0-1)
      };
    };

    // Metamorphosis System
    metamorphosis: {
      enabled: boolean;
      morphSpeed: number;
      rotationSpeed: number;
      wireframeOpacity: number;
      size: number;
      blur: number;
    };

    // Fireflies System
    fireflies: {
      enabled: boolean;
      count: number;
      speed: number;
      glowIntensity: number;
      swarmRadius: number;
    };

    // Layered Sine Waves System
    layeredSineWaves: {
      enabled: boolean;
      layers: number;
      points: number;
      waveAmplitude: number;
      speed: number;
      opacity: number;
      lineWidth: number;
      size: number; // Overall size multiplier
      width: number; // Width of the wave field
      height: number; // Height of the wave field
      edgeFade: {
        enabled: boolean;
        fadeStart: number; // Start fading at this distance from center (0-1)
        fadeEnd: number;   // Complete fade at this distance from center (0-1)
      };
    };
  };
  
  // Post-Processing Effects (Enhanced)
  effects: {
    glow: number;
    contrast: number;
    saturation: number;
    hue: number;
    brightness: number;
    vignette: number;
  };

  // Camera state
  camera: {
    distance: number;
    height: number;
    fov: number;
    position: [number, number, number];
    target: [number, number, number];
    rotation: {
      x: number;
      y: number;
      z: number;
    };
    autoRotate: boolean;
    autoRotateSpeed: number;
    damping: number;
    enableZoom: boolean;
    enablePan: boolean;
    enableRotate: boolean;
    minDistance: number;
    maxDistance: number;
    minPolarAngle: number;
    maxPolarAngle: number;
  };
  
  // Global animation speed multiplier
  globalAnimationSpeed: number;
}

export interface VisualActions {
  // UI Actions
  toggleDashboards: () => void;
  setDashboardsVisible: (visible: boolean) => void;
  toggleCameraPositioningMode: () => void; // NEW: Toggle camera positioning mode
  setCameraPositioningMode: (enabled: boolean) => void; // NEW: Set camera positioning mode
  
  updateBackground: (updates: Partial<VisualState['background']>) => void;
  updateGeometric: (shape: keyof VisualState['geometric'], updates: Partial<VisualState['geometric'][keyof VisualState['geometric']]>) => void;
  updateParticles: (updates: Partial<VisualState['particles']>) => void;
  updateGlobalEffects: (updates: Partial<VisualState['globalEffects']>) => void;
  updateEffects: (updates: Partial<VisualState['effects']>) => void;
  updateCamera: (updates: Partial<VisualState['camera']>) => void;
  resetToDefaults: () => void;
  savePreset: (name: string) => void;
  loadPreset: (name: string) => void;
  getAvailablePresets: () => string[];
  deletePreset: (name: string) => void;
  updateBackgroundConfig: (updates: Partial<VisualState['backgroundConfig']>) => void;
  resetToGlobalDefaults: () => void;
  resetCameraToDefaults: () => void;
  resetVisualEffectsToDefaults: () => void;
  updateGlobalDefaults: (category: keyof typeof GLOBAL_DEFAULTS, updates: Partial<typeof GLOBAL_DEFAULTS[keyof typeof GLOBAL_DEFAULTS]>) => void;
  forceApplyGlobalDefaults: () => void;
  getGlobalDefaults: () => typeof GLOBAL_DEFAULTS;
  clearCachedDefaults: () => void;
}

// Update the VisualPreset type to use VisualState
type VisualPreset = Omit<VisualState, 'updateBackground' | 'updateGeometric' | 'updateParticles' | 'updateGlobalEffects' | 'updateEffects' | 'updateCamera' | 'resetToDefaults' | 'savePreset' | 'loadPreset' | 'getAvailablePresets' | 'deletePreset' | 'updateBackgroundConfig' | 'resetToGlobalDefaults' | 'resetCameraToDefaults' | 'resetVisualEffectsToDefaults' | 'updateGlobalDefaults' | 'forceApplyGlobalDefaults' | 'getGlobalDefaults'> & {
  savedAt: string;
  version: string;
};

type PresetStorage = {
  [key: string]: VisualPreset;
};

// Global Defaults Configuration
export const GLOBAL_DEFAULTS = {
  // Camera defaults
  camera: {
    distance: 12,
    height: 2,
    fov: 60,
    position: [0, 2, 12] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
    rotation: { x: 0, y: 0, z: 0 },
    autoRotate: false,
    autoRotateSpeed: 0.5,
    damping: 0.05,
    enableZoom: true,
    enablePan: true,
    enableRotate: true,
    minDistance: 5,
    maxDistance: 50,
    minPolarAngle: 0,
    maxPolarAngle: Math.PI
  },
  
  // Performance defaults
  performance: {
    targetFPS: 60,
    enableVSync: true,
    maxParticles: 1000,
    maxShapes: 100,
    enableFrustumCulling: true,
    enableLOD: true
  },
  
  // Quality defaults
  quality: {
    antialiasing: true,
    shadows: true,
    reflections: true,
    postProcessing: true,
    bloom: true,
    motionBlur: false
  },
  
  // Animation defaults
  animation: {
    defaultSpeed: 1.0,
  },
  
  // Visual/Post-processing defaults
  visual: {
    vignette: 0.15,
    glow: 0.6,
    contrast: 1.2,
    saturation: 1.5,
    brightness: 1.1,
    bloom: false,
    chromaticAberration: 0,
    motionBlur: false,
  }
};

// Safety function to clamp animation speed to prevent crashes
const clampAnimationSpeed = (speed: number): number => {
  return Math.max(0.01, Math.min(5.0, speed)); // Limit between 0.01x and 5.0x
};

// Safety function to clamp timeScale to prevent crashes
const clampTimeScale = (timeScale: number): number => {
  return Math.max(0.01, Math.min(10.0, timeScale)); // Limit between 0.01x and 10.0x
};

// Default state for the visual store
const defaultState: VisualState = {
  ui: {
    showDashboards: false,
    cameraPositioningMode: false,
  },
  background: {
    opacity: 0.8,
    blur: 2,
    color: '#000011',
    gradient: true,
  },
  backgroundConfig: {
    enabled: false,
    mode: 'full3D',
    viewport: {
      bounds: {
        x: [-60, 60],
        y: [-35, 35],
        z: [-80, 20]
      },
      safeZone: 0.8
    },
    timeScale: clampTimeScale(1.0),
    camera: {
      fixed: false,
      position: [0, 0, 60],
      target: [0, 0, 0]
    },
    artisticLayout: {
      layers: {
        deepBackground: {
          zPosition: -80,
          objects: ['metamorphosis'],
          opacity: 0.6,
          movement: 'minimal'
        },
        farBackground: {
          zPosition: -50,
          objects: ['waveInterference'],
          opacity: 0.8,
          movement: 'slow'
        },
        midBackground: {
          zPosition: -20,
          objects: [],
          opacity: 0.9,
          movement: 'normal'
        },
        nearBackground: {
          zPosition: -5,
          objects: ['blobs', 'spheres', 'cubes'],
          opacity: 1.0,
          movement: 'normal'
        },
        foreground: {
          zPosition: 5,
          objects: ['fireflies'],
          opacity: 1.0,
          movement: 'active'
        }
      },
      camera: {
        position: [0, 0, 60],
        target: [0, 0, 0],
        fov: 75
      },
      viewport: {
        bounds: {
          x: [-60, 60],
          y: [-35, 35],
          z: [-80, 20]
        }
      }
    }
  },
  geometric: {
    spheres: {
      count: 12,
      size: 1.2,
      color: '#00ff88',
      speed: 1.5,
      opacity: 0.9,
      organicness: 0.3,
    },
    cubes: {
      count: 8,
      size: 1.0,
      color: '#4169e1',
      rotation: 1.5,
      opacity: 0.8,
      organicness: 0.2,
    },
    toruses: {
      count: 5,
      size: 1.5,
      color: '#ffa500',
      speed: 1.2,
      opacity: 0.7,
      organicness: 0.4,
    },
    blobs: {
      count: 6,
      size: 1.8,
      color: '#9370db',
      speed: 1.0,
      opacity: 1.0,
      organicness: 0.8,
    },
    crystals: {
      count: 8,
      size: 1.0,
      color: '#4ecdc4',
      rotation: 2.0,
      opacity: 0.9,
      complexity: 16,
      organicness: 0.2,
    },
    waveInterference: {
      color: '#00ffff',
    },
    metamorphosis: {
      color: '#00ffff',
    },
    fireflies: {
      color: '#ffff00',
    },
    layeredSineWaves: {
      color: '#ffff00',
    },
  },
  particles: {
    count: 800,
    size: 0.1,
    color: '#ff1493',
    speed: 1.5,
    opacity: 1.0,
    spread: 40,
  },
  globalEffects: {
    atmosphericBlur: {
      enabled: false,
      intensity: 0.5,
      layers: 5,
    },
    colorBlending: {
      enabled: false,
      mode: 'screen',
      intensity: 0.5,
    },
    shapeGlow: {
      enabled: false,
      intensity: 0.4,
      radius: 20,
      useObjectColor: true,
      customColor: '#ffffff',
      pulsing: false,
      pulseSpeed: 1.0,
    },
    chromatic: {
      enabled: false,
      aberration: 0,
      aberrationColors: {
        red: '#ff0000',
        green: '#00ff00',
        blue: '#0000ff',
      },
      rainbow: {
        enabled: false,
        intensity: 0,
        speed: 1,
        rotation: 0,
        blendMode: 'screen',
        colors: [
          '#ff0000',
          '#ff7f00',
          '#ffff00',
          '#00ff00',
          '#0000ff',
          '#4b0082',
          '#9400d3'
        ],
        opacity: 0.3
      },
      prism: 0,
    },
    distortion: {
      enabled: false,
      wave: 0,
      ripple: 0,
      noise: 0,
      frequency: 1,
    },
    particleInteraction: {
      enabled: false,
      magnetism: 0,
      repulsion: 0,
      flowField: false,
      turbulence: 0,
    },
    volumetric: {
      enabled: false,
      fog: 0,
      lightShafts: 0,
      density: 0.5,
      color: '#4169e1',
    },
    trails: {
      enabled: true,
      sphereTrails: {
        enabled: false,
        length: 20,
        opacity: 0.6,
        width: 0.1,
        fadeRate: 0.95,
      },
      cubeTrails: {
        enabled: false,
        length: 15,
        opacity: 0.5,
        width: 0.08,
        fadeRate: 0.94,
      },
      blobTrails: {
        enabled: false,
        length: 25,
        opacity: 0.7,
        width: 0.12,
        fadeRate: 0.96,
      },
    },
    waveInterference: {
      enabled: false,
      speed: 0.5,
      amplitude: 0.5,
      contourLevels: 5,
      edgeFade: {
        enabled: true,
        fadeStart: 0.3,
        fadeEnd: 0.5,
      },
    },
    metamorphosis: {
      enabled: true,
      morphSpeed: 0.5,
      rotationSpeed: 0.5,
      wireframeOpacity: 0.8,
      size: 1.5,
      blur: 0.0,
    },
    fireflies: {
      enabled: false,
      count: 100,
      speed: 0.5,
      glowIntensity: 0.5,
      swarmRadius: 20,
    },
    layeredSineWaves: {
      enabled: false,
      layers: 80,
      points: 200,
      waveAmplitude: 40,
      speed: 0.5,
      opacity: 0.5,
      lineWidth: 0.6,
      size: 1.0,
      width: 100,
      height: 100,
      edgeFade: {
        enabled: true,
        fadeStart: 0.3,
        fadeEnd: 0.5,
      },
    },
  },
  effects: {
    glow: GLOBAL_DEFAULTS.visual.glow,
    contrast: GLOBAL_DEFAULTS.visual.contrast,
    saturation: GLOBAL_DEFAULTS.visual.saturation,
    hue: 0,
    brightness: GLOBAL_DEFAULTS.visual.brightness,
    vignette: GLOBAL_DEFAULTS.visual.vignette,
  },
  camera: {
    ...GLOBAL_DEFAULTS.camera
  },
  globalAnimationSpeed: clampAnimationSpeed(GLOBAL_DEFAULTS.animation.defaultSpeed),
};

type Store = VisualState & VisualActions;

export const useVisualStore = create<Store>((set, get) => ({
  ...defaultState,

  toggleDashboards: () => {
    set((state) => ({
      ui: { ...state.ui, showDashboards: !state.ui.showDashboards }
    }));
  },

  setDashboardsVisible: (visible: boolean) => {
    set((state) => ({
      ui: { ...state.ui, showDashboards: visible }
    }));
  },

  toggleCameraPositioningMode: () => {
    set((state) => ({
      ui: { ...state.ui, cameraPositioningMode: !state.ui.cameraPositioningMode }
    }));
  },

  setCameraPositioningMode: (enabled: boolean) => {
    set((state) => ({
      ui: { ...state.ui, cameraPositioningMode: enabled }
    }));
  },

  updateBackground: (updates) => {
    set((state) => ({
      background: { ...state.background, ...updates }
    }));
  },

  updateGeometric: (shape, updates) => {
    set((state) => ({
      geometric: {
        ...state.geometric,
        [shape]: { ...state.geometric[shape], ...updates }
      }
    }));
  },

  updateParticles: (updates) => {
    set((state) => ({
      particles: { ...state.particles, ...updates }
    }));
  },

  updateGlobalEffects: (updates) => {
    set((state) => ({
      globalEffects: { ...state.globalEffects, ...updates }
    }));
  },

  updateEffects: (updates) => {
    set((state) => ({
      effects: { ...state.effects, ...updates }
    }));
  },

  updateCamera: (updates) => {
    set((state) => ({
      camera: { ...state.camera, ...updates }
    }));
  },

  resetToDefaults: () => set(defaultState),

  savePreset: (name) => {
    const state = get();
    const preset: VisualPreset = {
      ui: state.ui,
      background: state.background,
      backgroundConfig: state.backgroundConfig,
      geometric: state.geometric,
      particles: state.particles,
      globalEffects: state.globalEffects,
      effects: state.effects,
      camera: state.camera,
      globalAnimationSpeed: state.globalAnimationSpeed,
      savedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    try {
      const presets = JSON.parse(localStorage.getItem('visualPresets') || '{}') as PresetStorage;
      presets[name] = preset;
      localStorage.setItem('visualPresets', JSON.stringify(presets));
    } catch (error) {
    }
  },

  loadPreset: (name) => {
    try {
      const presets = JSON.parse(localStorage.getItem('visualPresets') || '{}') as PresetStorage;
      if (presets[name]) {
        const preset = presets[name];
        
        set((state) => ({
          ...state,
          ui: { ...state.ui, ...preset.ui },
          background: { ...state.background, ...preset.background },
          backgroundConfig: { ...state.backgroundConfig, ...preset.backgroundConfig },
          geometric: { ...state.geometric, ...preset.geometric },
          particles: { ...state.particles, ...preset.particles },
          globalEffects: { ...state.globalEffects, ...preset.globalEffects },
          effects: { ...state.effects, ...preset.effects },
          camera: { ...state.camera, ...preset.camera },
        }));
      } else {
      }
    } catch (error) {
    }
  },

  getAvailablePresets: () => {
    try {
      const presets = JSON.parse(localStorage.getItem('visualPresets') || '{}') as PresetStorage;
      return Object.keys(presets).sort();
    } catch (error) {
      return [];
    }
  },

  deletePreset: (name) => {
    try {
      const presets = JSON.parse(localStorage.getItem('visualPresets') || '{}') as PresetStorage;
      delete presets[name];
      localStorage.setItem('visualPresets', JSON.stringify(presets));
    } catch (error) {
    }
  },

  updateBackgroundConfig: (updates) => {
    // Safety check: clamp timeScale if it's being updated
    if (updates.timeScale !== undefined) {
      updates.timeScale = clampTimeScale(updates.timeScale);
    }
    
    set((state) => ({
      backgroundConfig: { ...state.backgroundConfig, ...updates }
    }));
  },

  // Global defaults management
  updateGlobalDefaults: (category: keyof typeof GLOBAL_DEFAULTS, updates: Partial<typeof GLOBAL_DEFAULTS[keyof typeof GLOBAL_DEFAULTS]>) => {
    // Update the global defaults (this affects future resets)
    Object.assign(GLOBAL_DEFAULTS[category], updates);
    
    // If updating camera defaults, also update current camera if it matches old defaults
    if (category === 'camera') {
      set((state) => ({
        camera: { ...state.camera, ...updates }
      }));
    }
    
    // If updating visual defaults, also update current effects
    if (category === 'visual') {
      const newEffects = {
        glow: GLOBAL_DEFAULTS.visual.glow,
        contrast: GLOBAL_DEFAULTS.visual.contrast,
        saturation: GLOBAL_DEFAULTS.visual.saturation,
        brightness: GLOBAL_DEFAULTS.visual.brightness,
        vignette: GLOBAL_DEFAULTS.visual.vignette,
      };
      
      set((state) => ({
        effects: {
          ...state.effects,
          ...newEffects
        }
      }));
    }
    
    // If updating animation defaults, also update current global animation speed
    if (category === 'animation') {
      const safeSpeed = clampAnimationSpeed(GLOBAL_DEFAULTS.animation.defaultSpeed);
      set((state) => ({
        globalAnimationSpeed: safeSpeed
      }));
    }
  },

  resetToGlobalDefaults: () => {
    set((state) => ({
      ...state,
      camera: { ...GLOBAL_DEFAULTS.camera },
      effects: {
        ...state.effects,
        glow: GLOBAL_DEFAULTS.visual.glow,
        contrast: GLOBAL_DEFAULTS.visual.contrast,
        saturation: GLOBAL_DEFAULTS.visual.saturation,
        brightness: GLOBAL_DEFAULTS.visual.brightness,
        vignette: GLOBAL_DEFAULTS.visual.vignette,
      }
    }));
  },

  resetCameraToDefaults: () => {
    set((state) => ({
      camera: { ...GLOBAL_DEFAULTS.camera }
    }));
  },

  resetVisualEffectsToDefaults: () => {
    set((state) => ({
      effects: {
        ...state.effects,
        glow: GLOBAL_DEFAULTS.visual.glow,
        contrast: GLOBAL_DEFAULTS.visual.contrast,
        saturation: GLOBAL_DEFAULTS.visual.saturation,
        brightness: GLOBAL_DEFAULTS.visual.brightness,
        vignette: GLOBAL_DEFAULTS.visual.vignette,
      }
    }));
  },

  forceApplyGlobalDefaults: () => {
    set((state) => ({
      ...state,
      camera: { ...GLOBAL_DEFAULTS.camera },
      effects: {
        ...state.effects,
        glow: GLOBAL_DEFAULTS.visual.glow,
        contrast: GLOBAL_DEFAULTS.visual.contrast,
        saturation: GLOBAL_DEFAULTS.visual.saturation,
        brightness: GLOBAL_DEFAULTS.visual.brightness,
        vignette: GLOBAL_DEFAULTS.visual.vignette,
      }
    }));
  },

  getGlobalDefaults: () => {
    return GLOBAL_DEFAULTS;
  },

  // Clear cached defaults and force refresh
  clearCachedDefaults: () => {
    try {
      localStorage.removeItem('globalDefaults');
    } catch (error) {
    }
  },
})); 