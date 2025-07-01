import { create } from 'zustand';
import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  ThemeAnalysis, 
  VisualCharacteristics, 
  WeatherData, 
  WeatherMappings,
  EnhancedColorPalette, 
  ColorHarmonyConfig,
  PerformanceMetrics 
} from '../types/unified';

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
  
  // Logo configuration
  logo: {
    enabled: boolean;
    size: number;
    position: {
      x: 'left' | 'center' | 'right';
      y: 'top' | 'center' | 'bottom';
    };
    offset: {
      x: number;
      y: number;
    };
    opacity: number;
    animation: {
      enabled: boolean;
      type: 'pulse' | 'float' | 'rotate' | 'none';
      speed: number;
    };
  };
  
  // Geometric Shapes Layer
  geometric: {
    spheres: {
      count: number;
      size: number;
      color: string;
      speed: number;
      rotation: number;
      opacity: number;
      organicness: number;
      movementPattern: 'orbit' | 'verticalSine' | 'static' | 'random';
      distance: number;
      pulseEnabled: boolean;
      pulseSize: number;
    };
    cubes: {
      count: number;
      size: number;
      color: string;
      rotation: number;
      speed: number;
      opacity: number;
      organicness: number;
      movementPattern: 'orbit' | 'verticalSine' | 'static' | 'random';
      distance: number;
      pulseEnabled: boolean;
      pulseSize: number;
    };
    toruses: {
      count: number;
      size: number;
      color: string;
      speed: number;
      rotation: number;
      opacity: number;
      organicness: number;
      movementPattern: 'orbit' | 'verticalSine' | 'static' | 'random';
      distance: number;
      pulseEnabled: boolean;
      pulseSize: number;
    };
    blobs: {
      count: number;
      size: number;
      color: string;
      speed: number;
      opacity: number;
      organicness: number;
      movementPattern: 'orbit' | 'verticalSine' | 'static' | 'random';
      distance: number;
      pulseEnabled: boolean;
      pulseSize: number;
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
    movementPattern: 'orbit' | 'verticalSine' | 'static' | 'random';
    distance: number;
    pulseEnabled: boolean;
    pulseSize: number;
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
      torusTrails: {
        enabled: boolean;
        length: number;
        opacity: number;
        width: number;
        fadeRate: number;
      };
      particleTrails: {
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
      preset: number; // 1-4 for different wave interference patterns
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
      intensity: number;
      layers: number;
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
      intensity: number;
      layerCount: number;
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
    // Auto-pan system for cinematic lookaround
    autoPan: {
      enabled: boolean;
      speed: number;
      radius: number;
      height: number;
      easing: number;
      currentAngle: number;
    };
    // Depth of Field settings
    depthOfField: {
      enabled: boolean;
      focusDistance: number;
      focalLength: number;
      bokehScale: number;
      blur: number;
    };
  };
  
  // Global animation speed multiplier
  globalAnimationSpeed: number;

  // Global blend mode overlay
  globalBlendMode: {
    mode: string; // Allow any string for blend mode
    opacity: number; // Allow any number for opacity
  },

  // AI Integration (optional - doesn't break existing functionality)
  ai?: {
    enabled: boolean;
    
    // Core AI System Integration
    analysis?: {
      theme: string;
      mood: string[];
      confidence: number;
      weatherData?: WeatherData;
      visualCharacteristics: VisualCharacteristics;
      lastUpdated: Date;
    };
    
    // Enhanced AI System Integration
    colorHarmony?: {
      palette: EnhancedColorPalette;
      harmonyConfig: ColorHarmonyConfig;
      lastGenerated: Date;
      performanceMetrics: PerformanceMetrics;
    };
    
    // Weather Integration
    weatherIntegration?: {
      enabled: boolean;
      currentWeather: WeatherData;
      weatherMappings: WeatherMappings;
      lastUpdated: Date;
    };
    
    // AI System Status
    status: {
      coreAI: 'idle' | 'analyzing' | 'error';
      enhancedAI: 'idle' | 'generating' | 'error';
      weatherService: 'idle' | 'fetching' | 'error';
    };
    
    // Feature Flags
    features: {
      weatherIntegration: boolean;
      colorHarmony: boolean;
      themeAnalysis: boolean;
      parameterInterpolation: boolean;
    };
  };

  location: string;
  error?: Error | null;
}

export interface VisualActions {
  // UI Actions
  toggleDashboards: () => void;
  setDashboardsVisible: (visible: boolean) => void;
  toggleCameraPositioningMode: () => void; // NEW: Enable direct camera control on live view
  setCameraPositioningMode: (enabled: boolean) => void; // NEW: Set camera positioning mode
  toggleAutoPan: () => void; // NEW: Toggle auto-pan cinematic movement
  
  updateBackground: (updates: Partial<VisualState['background']>) => void;
  updateGeometric: (shape: keyof VisualState['geometric'], updates: Partial<VisualState['geometric'][keyof VisualState['geometric']]>) => void;
  updateParticles: (updates: Partial<VisualState['particles']>) => void;
  updateGlobalEffects: (updates: Partial<VisualState['globalEffects']>) => void;
  updateEffects: (updates: Partial<VisualState['effects']>) => void;
  updateCamera: (updates: Partial<VisualState['camera']>) => void;
  updateGlobalAnimationSpeed: (speed: number) => void; // NEW: Update global animation speed
  resetToDefaults: () => void;
  savePreset: (name: string) => void;
  loadPreset: (name: string) => void;
  loadPresetData: (presetData: Partial<VisualPreset>) => void; // NEW: Load preset data directly
  transitionPreset: (name: string, duration?: number) => Promise<void>; // NEW: Smooth transition to preset
  getAvailablePresets: () => string[];
  deletePreset: (name: string) => void;
  updateBackgroundConfig: (updates: Partial<VisualState['backgroundConfig']>) => void;
  resetToGlobalDefaults: () => void;
  resetCameraToDefaults: () => void;
  resetVisualEffectsToDefaults: () => void;
  updateGlobalDefaults: (category: keyof typeof GLOBAL_DEFAULTS, updates: any) => void;
  forceApplyGlobalDefaults: () => void;
  getGlobalDefaults: () => typeof GLOBAL_DEFAULTS;
  clearCachedDefaults: () => void;
  setLocation: (location: string) => void;
  setCanvasError: (error: Error | null) => void;
  clearCanvasError: () => void;
  updateAutoPanAngle: (newAngle: number) => void; // NEW: Function to update only auto-pan angle without affecting enabled state

  // AI Integration Actions
  toggleAI: () => void;
  setAIEnabled: (enabled: boolean) => void;
  updateAIAnalysis: (analysis: NonNullable<VisualState['ai']>['analysis']) => void;
  updateAIColorHarmony: (colorHarmony: NonNullable<VisualState['ai']>['colorHarmony']) => void;
  updateAIWeatherIntegration: (weatherIntegration: NonNullable<VisualState['ai']>['weatherIntegration']) => void;
  updateAIStatus: (status: NonNullable<VisualState['ai']>['status']) => void;
  updateAIFeatures: (features: NonNullable<VisualState['ai']>['features']) => void;
  applyAIThemeAnalysis: (themeAnalysis: ThemeAnalysis) => void;
  applyEnhancedColorPalette: (colorPalette: EnhancedColorPalette) => void;
  clearAIAnalysis: () => void;
  clearAIColorHarmony: () => void;
  clearAIWeatherIntegration: () => void;
}

// Update the VisualPreset type to use VisualState
type VisualPreset = Omit<VisualState, 'updateBackground' | 'updateGeometric' | 'updateParticles' | 'updateGlobalEffects' | 'updateEffects' | 'updateCamera' | 'updateGlobalAnimationSpeed' | 'resetToDefaults' | 'savePreset' | 'loadPreset' | 'getAvailablePresets' | 'deletePreset' | 'updateBackgroundConfig' | 'resetToGlobalDefaults' | 'resetCameraToDefaults' | 'resetVisualEffectsToDefaults' | 'updateGlobalDefaults' | 'forceApplyGlobalDefaults' | 'getGlobalDefaults'> & {
  savedAt: string;
  version: string;
  location: string;
  globalAnimationSpeed: number; // Explicitly include this
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
    maxPolarAngle: Math.PI,
    autoPan: {
      enabled: false,
      speed: 0.15,
      radius: 15,
      height: 3,
      easing: 0.015,
      currentAngle: 0,
    },
    depthOfField: {
      enabled: false,
      focusDistance: 10,
      focalLength: 50,
      bokehScale: 1,
      blur: 0.5
    }
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
  },
  
  // Logo defaults
  logo: {
    enabled: false,
    size: 800,
    position: {
      x: 'center' as const, // 'left', 'center', 'right'
      y: 'center' as const     // 'top', 'center', 'bottom'
    },
    offset: {
      x: 0,
      y: 0
    },
    opacity: 1.0,
    animation: {
      enabled: false,
      type: 'none' as const, // 'pulse', 'float', 'rotate', 'none'
      speed: 1.0
    }
  },
  
  globalBlendMode: {
    mode: 'normal',
    opacity: 0.5
  },
  location: 'New York City',
  geometric: {
    spheres: {
      count: 12,
      size: 1.5,
      color: '#00ff88',
      speed: 1.5,
      rotation: 0,
      opacity: 0.9,
      organicness: 0.8,
      movementPattern: 'verticalSine' as const,
      distance: 2.0,
      pulseEnabled: false,
      pulseSize: 1.0,
    },
    cubes: {
      count: 10,
      size: 1.2,
      color: '#ff00cc',
      rotation: 1.2,
      speed: 1.0,
      opacity: 0.8,
      organicness: 0.6,
      movementPattern: 'orbit' as const,
      distance: 2.5,
      pulseEnabled: false,
      pulseSize: 1.0,
    },
    toruses: {
      count: 8,
      size: 1.8,
      color: '#ffa500',
      speed: 1.2,
      rotation: 0,
      opacity: 0.7,
      organicness: 1.0,
      movementPattern: 'verticalSine' as const,
      distance: 2.0,
      pulseEnabled: false,
      pulseSize: 1.0,
    },
    blobs: {
      count: 6,
      size: 1.8,
      color: '#9370db',
      speed: 1.0,
      opacity: 1.0,
      organicness: 1.5,
      movementPattern: 'orbit' as const,
      distance: 3.0,
      pulseEnabled: false,
      pulseSize: 1.0,
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
    movementPattern: 'random' as const,
    distance: 1.5,
    pulseEnabled: false,
    pulseSize: 1.0,
  },
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
  logo: {
    enabled: GLOBAL_DEFAULTS.logo.enabled,
    size: GLOBAL_DEFAULTS.logo.size,
    position: GLOBAL_DEFAULTS.logo.position,
    offset: GLOBAL_DEFAULTS.logo.offset,
    opacity: GLOBAL_DEFAULTS.logo.opacity,
    animation: GLOBAL_DEFAULTS.logo.animation,
  },
  geometric: {
    spheres: {
      count: GLOBAL_DEFAULTS.geometric.spheres.count,
      size: GLOBAL_DEFAULTS.geometric.spheres.size,
      color: GLOBAL_DEFAULTS.geometric.spheres.color,
      speed: GLOBAL_DEFAULTS.geometric.spheres.speed,
      rotation: GLOBAL_DEFAULTS.geometric.spheres.rotation,
      opacity: GLOBAL_DEFAULTS.geometric.spheres.opacity,
      organicness: GLOBAL_DEFAULTS.geometric.spheres.organicness,
      movementPattern: GLOBAL_DEFAULTS.geometric.spheres.movementPattern,
      distance: GLOBAL_DEFAULTS.geometric.spheres.distance,
      pulseEnabled: GLOBAL_DEFAULTS.geometric.spheres.pulseEnabled,
      pulseSize: GLOBAL_DEFAULTS.geometric.spheres.pulseSize,
    },
    cubes: {
      count: GLOBAL_DEFAULTS.geometric.cubes.count,
      size: GLOBAL_DEFAULTS.geometric.cubes.size,
      color: GLOBAL_DEFAULTS.geometric.cubes.color,
      rotation: GLOBAL_DEFAULTS.geometric.cubes.rotation,
      speed: GLOBAL_DEFAULTS.geometric.cubes.speed,
      opacity: GLOBAL_DEFAULTS.geometric.cubes.opacity,
      organicness: GLOBAL_DEFAULTS.geometric.cubes.organicness,
      movementPattern: GLOBAL_DEFAULTS.geometric.cubes.movementPattern,
      distance: GLOBAL_DEFAULTS.geometric.cubes.distance,
      pulseEnabled: GLOBAL_DEFAULTS.geometric.cubes.pulseEnabled,
      pulseSize: GLOBAL_DEFAULTS.geometric.cubes.pulseSize,
    },
    toruses: {
      count: GLOBAL_DEFAULTS.geometric.toruses.count,
      size: GLOBAL_DEFAULTS.geometric.toruses.size,
      color: GLOBAL_DEFAULTS.geometric.toruses.color,
      speed: GLOBAL_DEFAULTS.geometric.toruses.speed,
      rotation: GLOBAL_DEFAULTS.geometric.toruses.rotation,
      opacity: GLOBAL_DEFAULTS.geometric.toruses.opacity,
      organicness: GLOBAL_DEFAULTS.geometric.toruses.organicness,
      movementPattern: GLOBAL_DEFAULTS.geometric.toruses.movementPattern,
      distance: GLOBAL_DEFAULTS.geometric.toruses.distance,
      pulseEnabled: GLOBAL_DEFAULTS.geometric.toruses.pulseEnabled,
      pulseSize: GLOBAL_DEFAULTS.geometric.toruses.pulseSize,
    },
    blobs: {
      count: GLOBAL_DEFAULTS.geometric.blobs.count,
      size: GLOBAL_DEFAULTS.geometric.blobs.size,
      color: GLOBAL_DEFAULTS.geometric.blobs.color,
      speed: GLOBAL_DEFAULTS.geometric.blobs.speed,
      opacity: GLOBAL_DEFAULTS.geometric.blobs.opacity,
      organicness: GLOBAL_DEFAULTS.geometric.blobs.organicness,
      movementPattern: GLOBAL_DEFAULTS.geometric.blobs.movementPattern,
      distance: GLOBAL_DEFAULTS.geometric.blobs.distance,
      pulseEnabled: GLOBAL_DEFAULTS.geometric.blobs.pulseEnabled,
      pulseSize: GLOBAL_DEFAULTS.geometric.blobs.pulseSize,
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
    count: GLOBAL_DEFAULTS.particles.count,
    size: GLOBAL_DEFAULTS.particles.size,
    color: GLOBAL_DEFAULTS.particles.color,
    speed: GLOBAL_DEFAULTS.particles.speed,
    opacity: GLOBAL_DEFAULTS.particles.opacity,
    spread: GLOBAL_DEFAULTS.particles.spread,
    movementPattern: GLOBAL_DEFAULTS.particles.movementPattern,
    distance: GLOBAL_DEFAULTS.particles.distance,
    pulseEnabled: GLOBAL_DEFAULTS.particles.pulseEnabled,
    pulseSize: GLOBAL_DEFAULTS.particles.pulseSize,
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
        enabled: true,
        length: 150,
        opacity: 0.6,
        width: 0.8,
        fadeRate: 0.3,
      },
      cubeTrails: {
        enabled: true,
        length: 120,
        opacity: 0.5,
        width: 0.7,
        fadeRate: 0.4,
      },
      blobTrails: {
        enabled: true,
        length: 200,
        opacity: 0.7,
        width: 0.9,
        fadeRate: 0.2,
      },
      torusTrails: {
        enabled: true,
        length: 100,
        opacity: 0.5,
        width: 0.6,
        fadeRate: 0.5,
      },
      particleTrails: {
        enabled: true,
        length: 300,
        opacity: 0.8,
        width: 0.3,
        fadeRate: 0.1,
      },
    },
    waveInterference: {
      enabled: false,
      speed: 0.5,
      amplitude: 0.5,
      contourLevels: 5,
      preset: 1,
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
      intensity: 1.0,
      layers: 1,
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
      intensity: 1.0,
      layerCount: 1,
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
  globalBlendMode: {
    mode: 'normal',
    opacity: 0.5
  },
  location: GLOBAL_DEFAULTS.location,
  error: null,
};

type Store = VisualState & VisualActions;

export const useVisualStore = create<Store>()(
  persist(
    (set, get) => ({
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

      toggleAutoPan: () => {
        set((state) => {
          const newEnabled = !state.camera.autoPan.enabled;
          return {
            camera: {
              ...state.camera,
              autoPan: {
                ...state.camera.autoPan,
                enabled: newEnabled
              }
            }
          };
        });
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
          camera: { 
            ...state.camera, 
            ...updates,
            // Deep merge for nested objects like autoPan
            autoPan: updates.autoPan ? { ...state.camera.autoPan, ...updates.autoPan } : state.camera.autoPan,
            depthOfField: updates.depthOfField ? { ...state.camera.depthOfField, ...updates.depthOfField } : state.camera.depthOfField
          }
        }));
      },

      updateGlobalAnimationSpeed: (speed: number) => {
        set((state) => {
          const clampedSpeed = clampAnimationSpeed(speed);
          return {
            globalAnimationSpeed: clampedSpeed
          };
        });
      },

      resetToDefaults: () => set(defaultState),

      savePreset: (name) => {
        const state = get();
        const preset: VisualPreset = {
          ui: state.ui,
          background: state.background,
          backgroundConfig: state.backgroundConfig,
          logo: state.logo,
          geometric: state.geometric,
          particles: state.particles,
          globalEffects: state.globalEffects,
          effects: state.effects,
          camera: state.camera,
          globalAnimationSpeed: state.globalAnimationSpeed,
          globalBlendMode: state.globalBlendMode,
          location: state.location,
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
            
            set((state) => {
              // Deep merge for globalEffects to ensure all nested properties are preserved
              const mergedGlobalEffects = {
                ...state.globalEffects,
                ...(isPlainObject(preset.globalEffects) ? preset.globalEffects : {}),
                // Ensure trails object is properly merged with all required properties
                trails: {
                  ...state.globalEffects.trails,
                  ...(isPlainObject(preset.globalEffects && preset.globalEffects.trails) ? preset.globalEffects.trails : {}),
                  // Ensure all trail types have required properties
                  sphereTrails: {
                    ...state.globalEffects.trails.sphereTrails,
                    ...(isPlainObject(preset.globalEffects && preset.globalEffects.trails && preset.globalEffects.trails.sphereTrails) ? preset.globalEffects.trails.sphereTrails : {})
                  },
                  cubeTrails: {
                    ...state.globalEffects.trails.cubeTrails,
                    ...(isPlainObject(preset.globalEffects && preset.globalEffects.trails && preset.globalEffects.trails.cubeTrails) ? preset.globalEffects.trails.cubeTrails : {})
                  },
                  blobTrails: {
                    ...state.globalEffects.trails.blobTrails,
                    ...(isPlainObject(preset.globalEffects && preset.globalEffects.trails && preset.globalEffects.trails.blobTrails) ? preset.globalEffects.trails.blobTrails : {})
                  },
                  torusTrails: {
                    ...state.globalEffects.trails.torusTrails,
                    ...(isPlainObject(preset.globalEffects && preset.globalEffects.trails && preset.globalEffects.trails.torusTrails) ? preset.globalEffects.trails.torusTrails : {})
                  },
                  particleTrails: {
                    ...state.globalEffects.trails.particleTrails,
                    ...(isPlainObject(preset.globalEffects && preset.globalEffects.trails && preset.globalEffects.trails.particleTrails) ? preset.globalEffects.trails.particleTrails : {})
                  }
                }
              };

              const newGlobalAnimationSpeed = typeof preset.globalAnimationSpeed === 'number' ? preset.globalAnimationSpeed : state.globalAnimationSpeed;

              // Deep merge camera settings including DoF
              const mergedCamera = {
                ...state.camera,
                ...(isPlainObject(preset.camera) ? preset.camera : {}),
                depthOfField: {
                  ...state.camera.depthOfField,
                  ...(isPlainObject(preset.camera && preset.camera.depthOfField) ? preset.camera.depthOfField : {})
                }
              };
              
              return {
                ...state,
                // Don't override UI state from preset data - keep panels closed by default
                ui: { ...state.ui },
                background: { ...state.background, ...(isPlainObject(preset.background) ? preset.background : {}) },
                backgroundConfig: { ...state.backgroundConfig, ...(isPlainObject(preset.backgroundConfig) ? preset.backgroundConfig : {}) },
                logo: { ...state.logo, ...(isPlainObject(preset.logo) ? preset.logo : {}) },
                geometric: { ...state.geometric, ...(isPlainObject(preset.geometric) ? preset.geometric : {}) },
                particles: { ...state.particles, ...(isPlainObject(preset.particles) ? preset.particles : {}) },
                globalEffects: mergedGlobalEffects,
                effects: { ...state.effects, ...(isPlainObject(preset.effects) ? preset.effects : {}) },
                camera: mergedCamera,
                globalAnimationSpeed: newGlobalAnimationSpeed,
                globalBlendMode: isPlainObject(preset.globalBlendMode) ? preset.globalBlendMode : state.globalBlendMode,
                location: typeof preset.location === 'string' ? preset.location : state.location,
              };
            });
          } else {
          }
        } catch (error) {
        }
      },

      loadPresetData: (presetData: Partial<VisualPreset>) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('🎨 loadPresetData called with:', presetData);
        }
        
        set((state) => {
          // Ensure globalAnimationSpeed is properly set
          const newGlobalAnimationSpeed = presetData.globalAnimationSpeed ?? state.globalAnimationSpeed;
          
          // Ensure camera settings are properly merged
          const mergedCamera = {
            ...state.camera,
            ...presetData.camera
          };
          
          // Properly merge globalEffects to prevent undefined properties
          const mergedGlobalEffects = {
            ...state.globalEffects,
            ...(isPlainObject(presetData.globalEffects) ? presetData.globalEffects : {})
          };

          // Debug: Check what geometric data we're receiving
          if (process.env.NODE_ENV === 'development') {
            console.log('🎨 Preset geometric data:', presetData.geometric);
            console.log('🎨 Current geometric state:', state.geometric);
          }
          
          // Debug: Check specific sphere and cube data
          if (presetData.geometric) {
            if (process.env.NODE_ENV === 'development') {
              console.log('🎨 Preset spheres data:', presetData.geometric.spheres);
              console.log('🎨 Preset cubes data:', presetData.geometric.cubes);
              console.log('🎨 Current spheres data:', state.geometric.spheres);
              console.log('🎨 Current cubes data:', state.geometric.cubes);
            }
          }
          
          // Properly merge geometric shapes with deep merging
          const mergedGeometric = presetData.geometric ? {
            ...state.geometric,
            spheres: { ...state.geometric.spheres, ...presetData.geometric.spheres },
            cubes: { ...state.geometric.cubes, ...presetData.geometric.cubes },
            toruses: { ...state.geometric.toruses, ...presetData.geometric.toruses },
            blobs: { ...state.geometric.blobs, ...presetData.geometric.blobs },
            crystals: { ...state.geometric.crystals, ...presetData.geometric.crystals },
            waveInterference: { ...state.geometric.waveInterference, ...presetData.geometric.waveInterference },
            metamorphosis: { ...state.geometric.metamorphosis, ...presetData.geometric.metamorphosis },
            fireflies: { ...state.geometric.fireflies, ...presetData.geometric.fireflies },
            layeredSineWaves: { ...state.geometric.layeredSineWaves, ...presetData.geometric.layeredSineWaves }
          } : state.geometric;
          
          // Debug: Check the merged geometric data
          if (process.env.NODE_ENV === 'development') {
            console.log('🎨 Merged geometric data:', mergedGeometric);
          }

          // Properly merge particles
          const mergedParticles = {
            ...state.particles,
            ...(presetData.particles || {})
          };

          // Properly merge effects
          const mergedEffects = {
            ...state.effects,
            ...(presetData.effects || {})
          };
          
          // Properly merge AI state if it exists
          const mergedAI = presetData.ai ? {
            ...state.ai,
            ...presetData.ai
          } : state.ai;
          
          // Destructure presetData to exclude properties we handle separately
          const { geometric: presetGeometric, globalEffects: presetGlobalEffects, particles: presetParticles, effects: presetEffects, camera: presetCamera, globalAnimationSpeed: presetGlobalAnimationSpeed, ai: presetAI, ...otherPresetData } = presetData;
          
          const newState = {
            ...state,
            ...otherPresetData,
            geometric: mergedGeometric,
            globalAnimationSpeed: newGlobalAnimationSpeed,
            camera: mergedCamera,
            globalEffects: mergedGlobalEffects,
            particles: mergedParticles,
            effects: mergedEffects,
            ai: mergedAI,
            // Add a timestamp to force re-renders
            _lastUpdate: Date.now()
          };
          
          if (process.env.NODE_ENV === 'development') {
            console.log('🎨 New visual store state:', newState);
            console.log('🎨 Geometric shapes updated:', {
              spheres: newState.geometric.spheres,
              cubes: newState.geometric.cubes,
              toruses: newState.geometric.toruses,
              blobs: newState.geometric.blobs,
              crystals: newState.geometric.crystals
            });
          }
          
          // Add specific count debugging
          if (process.env.NODE_ENV === 'development') {
            console.log('🎨 Count values after merge:');
            console.log('  - Spheres count:', newState.geometric.spheres.count);
            console.log('  - Cubes count:', newState.geometric.cubes.count);
            console.log('  - Particles count:', newState.particles.count);
          }
          
          // Force a store update to ensure all subscribers are notified
          if (process.env.NODE_ENV === 'development') {
            console.log('🎨 Forcing store update...');
          }
          
          return newState;
        });
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
      updateGlobalDefaults: (category: keyof typeof GLOBAL_DEFAULTS, updates: any) => {
        // Update the global defaults (this affects future resets)
        Object.assign(GLOBAL_DEFAULTS[category], updates);
        
        // If updating camera defaults, also update current camera if it matches old defaults
        if (category === 'camera') {
          set((state) => ({
            camera: { 
              ...state.camera, 
              ...updates,
              // Ensure depthOfField is properly merged if it's being updated
              depthOfField: updates.depthOfField 
                ? { ...state.camera.depthOfField, ...updates.depthOfField }
                : state.camera.depthOfField
            }
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
        
        // If updating globalBlendMode defaults, also update current globalBlendMode
        if (category === 'globalBlendMode') {
          set((state) => ({
            globalBlendMode: { ...state.globalBlendMode, ...updates }
          }));
        }
        
        // If updating logo defaults, also update current logo
        if (category === 'logo') {
          set((state) => ({
            logo: { ...state.logo, ...updates }
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

      setLocation: (location: string) => set({ location }),

      setCanvasError: (error) => set({ error }),
      clearCanvasError: () => set({ error: null }),

      // NEW: Function to update only auto-pan angle without affecting enabled state
      updateAutoPanAngle: (newAngle: number) => {
        set((state) => ({
          camera: {
            ...state.camera,
            autoPan: {
              ...state.camera.autoPan,
              currentAngle: newAngle
            }
          }
        }));
      },

      transitionPreset: async (name, duration = 2500) => {
        try {
          const presets = JSON.parse(localStorage.getItem('visualPresets') || '{}') as PresetStorage;
          if (!presets[name]) {
            return;
          }

          const targetPreset = presets[name];
          
          // Get current state
          const currentState = get();
          
          // Create a promise that resolves when transition is complete
          return new Promise<void>((resolve) => {
            const startTime = Date.now();
            
            const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              // Easing function for smooth transition
              const easeInOutCubic = (t: number) => 
                t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
              
              const easedProgress = easeInOutCubic(progress);
              
              // Interpolate between current and target values
              const interpolate = (start: number, end: number, t: number) => 
                start + (end - start) * t;
              
              const interpolateColor = (start: string, end: string, t: number) => {
                // Simple color interpolation - convert to RGB and interpolate
                const startRGB = hexToRgb(start);
                const endRGB = hexToRgb(end);
                
                const r = Math.round(interpolate(startRGB.r, endRGB.r, t));
                const g = Math.round(interpolate(startRGB.g, endRGB.g, t));
                const b = Math.round(interpolate(startRGB.b, endRGB.b, t));
                
                return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
              };
              
              // Create interpolated state
              const interpolatedState: Partial<VisualState> = {};
              
              // Interpolate geometric shapes
              if (targetPreset.geometric) {
                interpolatedState.geometric = { ...currentState.geometric };
                
                // Interpolate spheres
                if (targetPreset.geometric.spheres) {
                  interpolatedState.geometric.spheres = {
                    ...currentState.geometric.spheres,
                    count: Math.round(interpolate(currentState.geometric.spheres.count, targetPreset.geometric.spheres.count, easedProgress)),
                    size: interpolate(currentState.geometric.spheres.size, targetPreset.geometric.spheres.size, easedProgress),
                    color: interpolateColor(currentState.geometric.spheres.color, targetPreset.geometric.spheres.color, easedProgress),
                    speed: interpolate(currentState.geometric.spheres.speed, targetPreset.geometric.spheres.speed, easedProgress),
                    rotation: interpolate(currentState.geometric.spheres.rotation, targetPreset.geometric.spheres.rotation, easedProgress),
                    opacity: interpolate(currentState.geometric.spheres.opacity, targetPreset.geometric.spheres.opacity, easedProgress),
                    organicness: interpolate(currentState.geometric.spheres.organicness, targetPreset.geometric.spheres.organicness, easedProgress),
                    distance: interpolate(currentState.geometric.spheres.distance, targetPreset.geometric.spheres.distance, easedProgress),
                    pulseSize: interpolate(currentState.geometric.spheres.pulseSize, targetPreset.geometric.spheres.pulseSize, easedProgress)
                  };
                }
                
                // Interpolate cubes
                if (targetPreset.geometric.cubes) {
                  interpolatedState.geometric.cubes = {
                    ...currentState.geometric.cubes,
                    count: Math.round(interpolate(currentState.geometric.cubes.count, targetPreset.geometric.cubes.count, easedProgress)),
                    size: interpolate(currentState.geometric.cubes.size, targetPreset.geometric.cubes.size, easedProgress),
                    color: interpolateColor(currentState.geometric.cubes.color, targetPreset.geometric.cubes.color, easedProgress),
                    speed: interpolate(currentState.geometric.cubes.speed, targetPreset.geometric.cubes.speed, easedProgress),
                    rotation: interpolate(currentState.geometric.cubes.rotation, targetPreset.geometric.cubes.rotation, easedProgress),
                    opacity: interpolate(currentState.geometric.cubes.opacity, targetPreset.geometric.cubes.opacity, easedProgress),
                    organicness: interpolate(currentState.geometric.cubes.organicness, targetPreset.geometric.cubes.organicness, easedProgress),
                    distance: interpolate(currentState.geometric.cubes.distance, targetPreset.geometric.cubes.distance, easedProgress),
                    pulseSize: interpolate(currentState.geometric.cubes.pulseSize, targetPreset.geometric.cubes.pulseSize, easedProgress)
                  };
                }
                
                // Interpolate toruses
                if (targetPreset.geometric.toruses) {
                  interpolatedState.geometric.toruses = {
                    ...currentState.geometric.toruses,
                    count: Math.round(interpolate(currentState.geometric.toruses.count, targetPreset.geometric.toruses.count, easedProgress)),
                    size: interpolate(currentState.geometric.toruses.size, targetPreset.geometric.toruses.size, easedProgress),
                    color: interpolateColor(currentState.geometric.toruses.color, targetPreset.geometric.toruses.color, easedProgress),
                    speed: interpolate(currentState.geometric.toruses.speed, targetPreset.geometric.toruses.speed, easedProgress),
                    rotation: interpolate(currentState.geometric.toruses.rotation, targetPreset.geometric.toruses.rotation, easedProgress),
                    opacity: interpolate(currentState.geometric.toruses.opacity, targetPreset.geometric.toruses.opacity, easedProgress),
                    organicness: interpolate(currentState.geometric.toruses.organicness, targetPreset.geometric.toruses.organicness, easedProgress),
                    distance: interpolate(currentState.geometric.toruses.distance, targetPreset.geometric.toruses.distance, easedProgress),
                    pulseSize: interpolate(currentState.geometric.toruses.pulseSize, targetPreset.geometric.toruses.pulseSize, easedProgress)
                  };
                }
                
                // Interpolate blobs
                if (targetPreset.geometric.blobs) {
                  interpolatedState.geometric.blobs = {
                    ...currentState.geometric.blobs,
                    count: Math.round(interpolate(currentState.geometric.blobs.count, targetPreset.geometric.blobs.count, easedProgress)),
                    size: interpolate(currentState.geometric.blobs.size, targetPreset.geometric.blobs.size, easedProgress),
                    color: interpolateColor(currentState.geometric.blobs.color, targetPreset.geometric.blobs.color, easedProgress),
                    speed: interpolate(currentState.geometric.blobs.speed, targetPreset.geometric.blobs.speed, easedProgress),
                    opacity: interpolate(currentState.geometric.blobs.opacity, targetPreset.geometric.blobs.opacity, easedProgress),
                    organicness: interpolate(currentState.geometric.blobs.organicness, targetPreset.geometric.blobs.organicness, easedProgress),
                    distance: interpolate(currentState.geometric.blobs.distance, targetPreset.geometric.blobs.distance, easedProgress),
                    pulseSize: interpolate(currentState.geometric.blobs.pulseSize, targetPreset.geometric.blobs.pulseSize, easedProgress)
                  };
                }
              }
              
              // Interpolate particles
              if (targetPreset.particles) {
                interpolatedState.particles = {
                  ...currentState.particles,
                  count: Math.round(interpolate(currentState.particles.count, targetPreset.particles.count, easedProgress)),
                  size: interpolate(currentState.particles.size, targetPreset.particles.size, easedProgress),
                  color: interpolateColor(currentState.particles.color, targetPreset.particles.color, easedProgress),
                  speed: interpolate(currentState.particles.speed, targetPreset.particles.speed, easedProgress),
                  opacity: interpolate(currentState.particles.opacity, targetPreset.particles.opacity, easedProgress),
                  spread: interpolate(currentState.particles.spread, targetPreset.particles.spread, easedProgress),
                  distance: interpolate(currentState.particles.distance, targetPreset.particles.distance, easedProgress),
                  pulseSize: interpolate(currentState.particles.pulseSize, targetPreset.particles.pulseSize, easedProgress)
                };
              }
              
              // Interpolate effects
              if (targetPreset.effects) {
                interpolatedState.effects = {
                  ...currentState.effects,
                  glow: interpolate(currentState.effects.glow, targetPreset.effects.glow, easedProgress),
                  contrast: interpolate(currentState.effects.contrast, targetPreset.effects.contrast, easedProgress),
                  saturation: interpolate(currentState.effects.saturation, targetPreset.effects.saturation, easedProgress),
                  brightness: interpolate(currentState.effects.brightness, targetPreset.effects.brightness, easedProgress),
                  vignette: interpolate(currentState.effects.vignette, targetPreset.effects.vignette, easedProgress),
                  hue: interpolate(currentState.effects.hue, targetPreset.effects.hue, easedProgress)
                };
              }
              
              // Interpolate global animation speed
              if (typeof targetPreset.globalAnimationSpeed === 'number') {
                interpolatedState.globalAnimationSpeed = interpolate(
                  currentState.globalAnimationSpeed, 
                  targetPreset.globalAnimationSpeed, 
                  easedProgress
                );
              }
              
              // Apply interpolated state
              set((state) => ({
                ...state,
                ...interpolatedState
              }));
              
              // Continue animation if not complete
              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                resolve();
              }
            };
            
            animate();
          });
        } catch (error) {
          console.error('Error during preset transition:', error);
        }
      },

      // AI Integration Actions
      toggleAI: () => {
        set((state) => {
          const currentAI = state.ai;
          const newEnabled = !(currentAI?.enabled ?? false);
          
          return {
            ai: buildAIState(
              newEnabled,
              currentAI?.status ?? {
                coreAI: 'idle',
                enhancedAI: 'idle',
                weatherService: 'idle'
              },
              currentAI?.features ?? {
                weatherIntegration: false,
                colorHarmony: false,
                themeAnalysis: false,
                parameterInterpolation: false
              },
              currentAI?.analysis,
              currentAI?.colorHarmony,
              currentAI?.weatherIntegration
            )
          };
        });
      },

      setAIEnabled: (enabled: boolean) => {
        set((state) => {
          const currentAI = state.ai;
          
          return {
            ai: buildAIState(
              enabled,
              currentAI?.status ?? {
                coreAI: 'idle',
                enhancedAI: 'idle',
                weatherService: 'idle'
              },
              currentAI?.features ?? {
                weatherIntegration: false,
                colorHarmony: false,
                themeAnalysis: false,
                parameterInterpolation: false
              },
              currentAI?.analysis,
              currentAI?.colorHarmony,
              currentAI?.weatherIntegration
            )
          };
        });
      },

      updateAIAnalysis: (analysis: NonNullable<VisualState['ai']>['analysis']) => {
        set((state) => {
          const currentAI = state.ai;
          
          return {
            ai: buildAIState(
              currentAI?.enabled ?? false,
              currentAI?.status ?? {
                coreAI: 'idle',
                enhancedAI: 'idle',
                weatherService: 'idle'
              },
              currentAI?.features ?? {
                weatherIntegration: false,
                colorHarmony: false,
                themeAnalysis: false,
                parameterInterpolation: false
              },
              analysis,
              currentAI?.colorHarmony,
              currentAI?.weatherIntegration
            )
          };
        });
      },

      updateAIColorHarmony: (colorHarmony: NonNullable<VisualState['ai']>['colorHarmony']) => {
        set((state) => {
          const currentAI = state.ai;
          
          return {
            ai: buildAIState(
              currentAI?.enabled ?? false,
              currentAI?.status ?? {
                coreAI: 'idle',
                enhancedAI: 'idle',
                weatherService: 'idle'
              },
              currentAI?.features ?? {
                weatherIntegration: false,
                colorHarmony: false,
                themeAnalysis: false,
                parameterInterpolation: false
              },
              currentAI?.analysis,
              colorHarmony,
              currentAI?.weatherIntegration
            )
          };
        });
      },

      updateAIWeatherIntegration: (weatherIntegration: NonNullable<VisualState['ai']>['weatherIntegration']) => {
        set((state) => {
          const currentAI = state.ai;
          
          return {
            ai: buildAIState(
              currentAI?.enabled ?? false,
              currentAI?.status ?? {
                coreAI: 'idle',
                enhancedAI: 'idle',
                weatherService: 'idle'
              },
              currentAI?.features ?? {
                weatherIntegration: false,
                colorHarmony: false,
                themeAnalysis: false,
                parameterInterpolation: false
              },
              currentAI?.analysis,
              currentAI?.colorHarmony,
              weatherIntegration
            )
          };
        });
      },

      updateAIStatus: (status: NonNullable<VisualState['ai']>['status']) => {
        set((state) => {
          const currentAI = state.ai;
          
          return {
            ai: buildAIState(
              currentAI?.enabled ?? false,
              status,
              currentAI?.features ?? {
                weatherIntegration: false,
                colorHarmony: false,
                themeAnalysis: false,
                parameterInterpolation: false
              },
              currentAI?.analysis,
              currentAI?.colorHarmony,
              currentAI?.weatherIntegration
            )
          };
        });
      },

      updateAIFeatures: (features: NonNullable<VisualState['ai']>['features']) => {
        set((state) => {
          const currentAI = state.ai;
          
          return {
            ai: buildAIState(
              currentAI?.enabled ?? false,
              currentAI?.status ?? {
                coreAI: 'idle',
                enhancedAI: 'idle',
                weatherService: 'idle'
              },
              features,
              currentAI?.analysis,
              currentAI?.colorHarmony,
              currentAI?.weatherIntegration
            )
          };
        });
      },

      applyAIThemeAnalysis: (themeAnalysis: ThemeAnalysis) => {
        set((state) => {
          const currentAI = state.ai;
          
          return {
            ai: buildAIState(
              currentAI?.enabled ?? false,
              currentAI?.status ?? {
                coreAI: 'idle',
                enhancedAI: 'idle',
                weatherService: 'idle'
              },
              currentAI?.features ?? {
                weatherIntegration: false,
                colorHarmony: false,
                themeAnalysis: false,
                parameterInterpolation: false
              },
              { 
                theme: themeAnalysis.theme,
                mood: themeAnalysis.mood,
                confidence: themeAnalysis.confidence,
                weatherData: undefined,
                visualCharacteristics: themeAnalysis.visualCharacteristics,
                lastUpdated: new Date()
              },
              currentAI?.colorHarmony,
              currentAI?.weatherIntegration
            )
          };
        });
      },

      applyEnhancedColorPalette: (colorPalette: EnhancedColorPalette) => {
        set((state) => {
          const currentAI = state.ai;
          
          return {
            ai: buildAIState(
              currentAI?.enabled ?? false,
              currentAI?.status ?? {
                coreAI: 'idle',
                enhancedAI: 'idle',
                weatherService: 'idle'
              },
              currentAI?.features ?? {
                weatherIntegration: false,
                colorHarmony: false,
                themeAnalysis: false,
                parameterInterpolation: false
              },
              currentAI?.analysis,
              { 
                palette: colorPalette,
                harmonyConfig: {
                  baseColor: colorPalette.primary,
                  harmonyLevel: 0.5,
                  targetMood: [],
                  targetTemperature: 'neutral',
                  targetSaturation: 0.5,
                  targetBrightness: 0.5,
                  accessibilityMode: false,
                  maxSupportingColors: 5
                },
                lastGenerated: new Date(),
                performanceMetrics: {
                  generationTime: 0,
                  memoryUsage: 0,
                  cacheHitRate: 0,
                  validationTime: 0
                }
              },
              currentAI?.weatherIntegration
            )
          };
        });
      },

      clearAIAnalysis: () => {
        set((state) => {
          const currentAI = state.ai;
          
          return {
            ai: buildAIState(
              currentAI?.enabled ?? false,
              currentAI?.status ?? {
                coreAI: 'idle',
                enhancedAI: 'idle',
                weatherService: 'idle'
              },
              currentAI?.features ?? {
                weatherIntegration: false,
                colorHarmony: false,
                themeAnalysis: false,
                parameterInterpolation: false
              },
              undefined,
              currentAI?.colorHarmony,
              currentAI?.weatherIntegration
            )
          };
        });
      },

      clearAIColorHarmony: () => {
        set((state) => {
          const currentAI = state.ai;
          
          return {
            ai: buildAIState(
              currentAI?.enabled ?? false,
              currentAI?.status ?? {
                coreAI: 'idle',
                enhancedAI: 'idle',
                weatherService: 'idle'
              },
              currentAI?.features ?? {
                weatherIntegration: false,
                colorHarmony: false,
                themeAnalysis: false,
                parameterInterpolation: false
              },
              currentAI?.analysis,
              undefined,
              currentAI?.weatherIntegration
            )
          };
        });
      },

      clearAIWeatherIntegration: () => {
        set((state) => {
          const currentAI = state.ai;
          
          return {
            ai: buildAIState(
              currentAI?.enabled ?? false,
              currentAI?.status ?? {
                coreAI: 'idle',
                enhancedAI: 'idle',
                weatherService: 'idle'
              },
              currentAI?.features ?? {
                weatherIntegration: false,
                colorHarmony: false,
                themeAnalysis: false,
                parameterInterpolation: false
              },
              currentAI?.analysis,
              currentAI?.colorHarmony,
              undefined
            )
          };
        });
      },
    }),
    {
      name: 'visual-store', // unique name for localStorage key
      partialize: (state) => ({
        // Only persist the visual state, not the actions
        ui: state.ui,
        background: state.background,
        backgroundConfig: state.backgroundConfig,
        logo: state.logo,
        geometric: state.geometric,
        particles: state.particles,
        globalEffects: state.globalEffects,
        effects: state.effects,
        camera: state.camera,
        globalAnimationSpeed: state.globalAnimationSpeed,
        globalBlendMode: state.globalBlendMode,
        location: state.location
      }),
      // Temporarily disable persistence to test if it's causing the issue
      skipHydration: true
    }
  )
);

function isPlainObject(obj: any): obj is object {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
}

// Utility function for color conversion
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

// Helper function to build AI state safely
function buildAIState(
  enabled: boolean,
  status: VisualState['ai']['status'],
  features: VisualState['ai']['features'],
  analysis?: VisualState['ai']['analysis'],
  colorHarmony?: VisualState['ai']['colorHarmony'],
  weatherIntegration?: VisualState['ai']['weatherIntegration']
): VisualState['ai'] {
  const result: VisualState['ai'] = {
    enabled,
    status,
    features
  };
  
  if (analysis) {
    result.analysis = analysis;
  }
  if (colorHarmony) {
    result.colorHarmony = colorHarmony;
  }
  if (weatherIntegration) {
    result.weatherIntegration = weatherIntegration;
  }
  
  return result;
} 