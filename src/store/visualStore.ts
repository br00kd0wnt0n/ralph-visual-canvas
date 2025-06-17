import { create } from 'zustand';
import type { StateCreator } from 'zustand';

export interface VisualState {
  // UI State
  ui: {
    showDashboards: boolean;
  };
  
  // Background Layer
  background: {
    opacity: number;
    blur: number;
    color: string;
    gradient: boolean;
  };
  
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
    ribbons: {
      count: number;
      length: number;
      width: number;
      color: string;
      speed: number;
      opacity: number;
      flow: number;
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
    radialGrowth: {
      color: string;
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
    
    // Depth of Field
    depthOfField: {
      enabled: boolean;
      focusDistance: number;
      blurRadius: number;
      bokehEffect: boolean;
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
      ribbonTrails: {
        enabled: boolean;
        length: number;
        opacity: number;
        width: number;
        fadeRate: number;
      };
    };

    // Radial Growth System
    radialGrowth: {
      enabled: boolean;
      maxRadiators: number;
      spawnRate: number;
      growthSpeed: number;
    };

    // Wave Interference System
    waveInterference: {
      enabled: boolean;
      speed: number;
      amplitude: number;
      contourLevels: number;
    };

    // Metamorphosis System
    metamorphosis: {
      enabled: boolean;
      morphSpeed: number;
      rotationSpeed: number;
      wireframeOpacity: number;
    };

    // Fireflies System
    fireflies: {
      enabled: boolean;
      count: number;
      speed: number;
      glowIntensity: number;
      swarmRadius: number;
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
  };
}

export interface VisualActions {
  // UI Actions
  toggleDashboards: () => void;
  setDashboardsVisible: (visible: boolean) => void;
  
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
}

// Update the VisualPreset type to use VisualState
type VisualPreset = Omit<VisualState, 'updateBackground' | 'updateGeometric' | 'updateParticles' | 'updateGlobalEffects' | 'updateEffects' | 'updateCamera' | 'resetToDefaults' | 'savePreset' | 'loadPreset' | 'getAvailablePresets' | 'deletePreset'> & {
  savedAt: string;
  version: string;
};

type PresetStorage = {
  [key: string]: VisualPreset;
};

const defaultState: VisualState = {
  ui: {
    showDashboards: true,
  },
  background: {
    opacity: 0.8,
    blur: 2,
    color: '#000011',
    gradient: true,
  },
  geometric: {
    spheres: {
      count: 8,
      size: 1.0,
      color: '#00ff88',
      speed: 1.0,
      opacity: 0.7,
      organicness: 0,
    },
    cubes: {
      count: 5,
      size: 0.8,
      color: '#4169e1',
      rotation: 1.0,
      opacity: 0.6,
      organicness: 0,
    },
    toruses: {
      count: 3,
      size: 1.2,
      color: '#ffa500',
      speed: 0.8,
      opacity: 0.5,
      organicness: 0,
    },
    blobs: {
      count: 4,
      size: 1.5,
      color: '#9370db',
      speed: 0.6,
      opacity: 0.8,
      organicness: 0.7,
    },
    ribbons: {
      count: 3,
      length: 8,
      width: 0.3,
      color: '#ff6b6b',
      speed: 1.2,
      opacity: 0.6,
      flow: 0.8,
      organicness: 0,
    },
    crystals: {
      count: 6,
      size: 0.8,
      color: '#4ecdc4',
      rotation: 1.5,
      opacity: 0.7,
      complexity: 12,
      organicness: 0,
    },
    radialGrowth: {
      color: '#ff0000',
    },
    waveInterference: {
      color: '#ff0000',
    },
    metamorphosis: {
      color: '#ff0000',
    },
    fireflies: {
      color: '#ff0000',
    },
  },
  particles: {
    count: 500,
    size: 0.2,
    color: '#ff1493',
    speed: 1.0,
    opacity: 0.9,
    spread: 15,
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
    depthOfField: {
      enabled: false,
      focusDistance: 15,
      blurRadius: 5,
      bokehEffect: true,
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
      ribbonTrails: {
        enabled: false,
        length: 30,
        opacity: 0.8,
        width: 0.15,
        fadeRate: 0.97,
      },
    },
    radialGrowth: {
      enabled: false,
      maxRadiators: 10,
      spawnRate: 0.5,
      growthSpeed: 0.1,
    },
    waveInterference: {
      enabled: false,
      speed: 0.5,
      amplitude: 0.5,
      contourLevels: 5,
    },
    metamorphosis: {
      enabled: false,
      morphSpeed: 0.5,
      rotationSpeed: 0.5,
      wireframeOpacity: 0.5,
    },
    fireflies: {
      enabled: false,
      count: 100,
      speed: 0.5,
      glowIntensity: 0.5,
      swarmRadius: 20,
    },
  },
  effects: {
    glow: 0.3,
    contrast: 1.0,
    saturation: 1.2,
    hue: 0,
    brightness: 1.0,
    vignette: 0,
  },
  camera: {
    distance: 25,
    height: 0,
    fov: 60,
  },
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
      geometric: state.geometric,
      particles: state.particles,
      globalEffects: state.globalEffects,
      effects: state.effects,
      camera: state.camera,
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
})); 