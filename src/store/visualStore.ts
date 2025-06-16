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
    
    // Glow & Light Interaction
    glowSystem: {
      enabled: boolean;
      intensity: number;
      radius: number;
      color: string;
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
    filmGrain: number;
    scanlines: number;
  };
}

export interface VisualActions {
  updateBackground: (updates: Partial<VisualState['background']>) => void;
  updateGeometric: (shape: keyof VisualState['geometric'], updates: Partial<VisualState['geometric'][keyof VisualState['geometric']]>) => void;
  updateParticles: (updates: Partial<VisualState['particles']>) => void;
  updateGlobalEffects: (updates: Partial<VisualState['globalEffects']>) => void;
  updateEffects: (updates: Partial<VisualState['effects']>) => void;
  resetToDefaults: () => void;
  savePreset: (name: string) => void;
  loadPreset: (name: string) => void;
}

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
    glowSystem: {
      enabled: false,
      intensity: 0.4,
      radius: 20,
      color: '#ffffff',
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
    filmGrain: 0,
    scanlines: 0,
  },
};

type Store = VisualState & VisualActions;

export const useVisualStore = create<Store>((set, get) => ({
  ...defaultState,
  
  updateBackground: (updates: Partial<VisualState['background']>) =>
    set((state: VisualState) => ({
      background: { ...state.background, ...updates },
    })),
  
  updateGeometric: (shape: keyof VisualState['geometric'], updates: Partial<VisualState['geometric'][keyof VisualState['geometric']]>) =>
    set((state: VisualState) => ({
      geometric: {
        ...state.geometric,
        [shape]: { ...state.geometric[shape], ...updates },
      },
    })),
  
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
  
  resetToDefaults: () => set(defaultState),
  
  savePreset: (name: string) => {
    const state = get();
    const presets: Record<string, Partial<VisualState>> = JSON.parse(localStorage.getItem('visualPresets') || '{}');
    presets[name] = {
      background: state.background,
      geometric: state.geometric,
      particles: state.particles,
      globalEffects: state.globalEffects,
      effects: state.effects,
    };
    localStorage.setItem('visualPresets', JSON.stringify(presets));
  },
  
  loadPreset: (name: string) => {
    const presets: Record<string, Partial<VisualState>> = JSON.parse(localStorage.getItem('visualPresets') || '{}');
    if (presets[name]) {
      set((state: VisualState) => ({ ...state, ...presets[name] }));
    }
  },
})); 