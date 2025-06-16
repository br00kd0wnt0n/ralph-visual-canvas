import { create } from 'zustand';
import type { StateCreator } from 'zustand';

export interface VisualState {
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
    };
    cubes: {
      count: number;
      size: number;
      color: string;
      rotation: number;
      opacity: number;
    };
    toruses: {
      count: number;
      size: number;
      color: string;
      speed: number;
      opacity: number;
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
    },
    cubes: {
      count: 5,
      size: 0.8,
      color: '#4169e1',
      rotation: 1.0,
      opacity: 0.6,
    },
    toruses: {
      count: 3,
      size: 1.2,
      color: '#ffa500',
      speed: 0.8,
      opacity: 0.5,
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

export const useVisualStore = create<Store>((set, get) => {
  console.log('=== STORE INITIALIZATION ===');
  console.log('Creating store with default state:', defaultState);
  
  const store = {
    ...defaultState,
    
    updateBackground: (updates: Partial<VisualState['background']>) => {
      console.log('Updating background:', updates);
      set((state: VisualState) => ({
        background: { ...state.background, ...updates },
      }));
    },
    
    updateGeometric: (shape: keyof VisualState['geometric'], updates: Partial<VisualState['geometric'][keyof VisualState['geometric']]>) => {
      console.log('Updating geometric shape:', shape, updates);
      set((state: VisualState) => ({
        geometric: {
          ...state.geometric,
          [shape]: { ...state.geometric[shape], ...updates },
        },
      }));
    },
    
    updateParticles: (updates: Partial<VisualState['particles']>) =>
      set((state: VisualState) => ({
        particles: { ...state.particles, ...updates },
      })),
    
    updateGlobalEffects: (updates: Partial<VisualState['globalEffects']>) =>
      set((state: VisualState) => ({
        globalEffects: { ...state.globalEffects, ...updates },
      })),
    
    updateEffects: (updates: Partial<VisualState['effects']>) =>
      set((state: VisualState) => ({
        effects: { ...state.effects, ...updates },
      })),
    
    updateCamera: (updates: Partial<VisualState['camera']>) =>
      set((state: VisualState) => ({
        camera: { ...state.camera, ...updates },
      })),
    
    resetToDefaults: () => set(defaultState),
    
    savePreset: (name: string) => {
      const state = get();
      const preset: VisualPreset = {
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
        console.log('Preset saved:', name, preset);
      } catch (error) {
        console.error('Error saving preset:', error);
      }
    },
    
    loadPreset: (name: string) => {
      try {
        const presets = JSON.parse(localStorage.getItem('visualPresets') || '{}') as PresetStorage;
        if (presets[name]) {
          const preset = presets[name];
          
          set((state) => ({
            ...state,
            background: { ...state.background, ...preset.background },
            geometric: { ...state.geometric, ...preset.geometric },
            particles: { ...state.particles, ...preset.particles },
            globalEffects: { ...state.globalEffects, ...preset.globalEffects },
            effects: { ...state.effects, ...preset.effects },
            camera: { ...state.camera, ...preset.camera },
          }));
          
          console.log('Preset loaded:', name, preset);
        } else {
          console.warn('Preset not found:', name);
        }
      } catch (error) {
        console.error('Error loading preset:', error);
      }
    },

    getAvailablePresets: () => {
      try {
        const presets = JSON.parse(localStorage.getItem('visualPresets') || '{}') as PresetStorage;
        return Object.keys(presets).sort();
      } catch (error) {
        console.error('Error getting presets:', error);
        return [];
      }
    },

    deletePreset: (name: string) => {
      try {
        const presets = JSON.parse(localStorage.getItem('visualPresets') || '{}') as PresetStorage;
        delete presets[name];
        localStorage.setItem('visualPresets', JSON.stringify(presets));
        console.log('Preset deleted:', name);
      } catch (error) {
        console.error('Error deleting preset:', error);
      }
    },
  };

  console.log('Store created with initial state:', store);
  return store;
}); 