import { create } from 'zustand';

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
  
  // Post-Processing Effects
  effects: {
    glow: number;
    contrast: number;
    saturation: number;
    hue: number;
  };
}

export interface VisualActions {
  updateBackground: (updates: Partial<VisualState['background']>) => void;
  updateGeometric: (shape: keyof VisualState['geometric'], updates: Partial<VisualState['geometric'][keyof VisualState['geometric']]>) => void;
  updateParticles: (updates: Partial<VisualState['particles']>) => void;
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
    count: 200,
    size: 0.1,
    color: '#ff1493',
    speed: 1.5,
    opacity: 0.8,
    spread: 10,
  },
  effects: {
    glow: 0.3,
    contrast: 1.0,
    saturation: 1.2,
    hue: 0,
  },
};

export const useVisualStore = create<VisualState & VisualActions>((set, get) => ({
  ...defaultState,
  
  updateBackground: (updates) =>
    set((state) => ({
      background: { ...state.background, ...updates },
    })),
  
  updateGeometric: (shape, updates) =>
    set((state) => ({
      geometric: {
        ...state.geometric,
        [shape]: { ...state.geometric[shape], ...updates },
      },
    })),
  
  updateParticles: (updates) =>
    set((state) => ({
      particles: { ...state.particles, ...updates },
    })),
  
  updateEffects: (updates) =>
    set((state) => ({
      effects: { ...state.effects, ...updates },
    })),
  
  resetToDefaults: () => set(defaultState),
  
  savePreset: (name) => {
    const state = get();
    const presets = JSON.parse(localStorage.getItem('visualPresets') || '{}');
    presets[name] = {
      background: state.background,
      geometric: state.geometric,
      particles: state.particles,
      effects: state.effects,
    };
    localStorage.setItem('visualPresets', JSON.stringify(presets));
  },
  
  loadPreset: (name) => {
    const presets = JSON.parse(localStorage.getItem('visualPresets') || '{}');
    if (presets[name]) {
      set((state) => ({ ...state, ...presets[name] }));
    }
  },
})); 