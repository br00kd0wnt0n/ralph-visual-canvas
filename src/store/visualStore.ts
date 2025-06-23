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
      speed: 0.3,
      radius: 15,
      height: 3,
      easing: 0.02,
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

  toggleAutoPan: () => {
    set((state) => ({
      camera: {
        ...state.camera,
        autoPan: {
          ...state.camera.autoPan,
          enabled: !state.camera.autoPan.enabled
        }
      }
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

  updateGlobalAnimationSpeed: (speed: number) => {
    console.log(`🎛️ updateGlobalAnimationSpeed called with:`, speed);
    set((state) => {
      const clampedSpeed = clampAnimationSpeed(speed);
      console.log(`🎛️ Setting globalAnimationSpeed from ${state.globalAnimationSpeed} to ${clampedSpeed}`);
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
    
    console.log(`💾 Saving preset "${name}" with globalAnimationSpeed:`, state.globalAnimationSpeed);
    console.log(`💾 Saving preset "${name}" with DoF settings:`, state.camera.depthOfField);
    console.log(`💾 Full preset object:`, preset);
    
    try {
      const presets = JSON.parse(localStorage.getItem('visualPresets') || '{}') as PresetStorage;
      presets[name] = preset;
      localStorage.setItem('visualPresets', JSON.stringify(presets));
      console.log(`✅ Preset "${name}" saved successfully`);
      
      // Verify what was actually saved
      const savedPresets = JSON.parse(localStorage.getItem('visualPresets') || '{}') as PresetStorage;
      console.log(`🔍 Verification - saved preset globalAnimationSpeed:`, savedPresets[name]?.globalAnimationSpeed);
      console.log(`🔍 Verification - saved preset DoF settings:`, savedPresets[name]?.camera?.depthOfField);
    } catch (error) {
      console.error('❌ Error saving preset:', error);
    }
  },

  loadPreset: (name) => {
    try {
      const presets = JSON.parse(localStorage.getItem('visualPresets') || '{}') as PresetStorage;
      if (presets[name]) {
        const preset = presets[name];
        
        console.log(`📂 Loading preset "${name}" with globalAnimationSpeed:`, preset.globalAnimationSpeed);
        console.log(`📂 Loading preset "${name}" with DoF settings:`, preset.camera?.depthOfField);
        console.log(`📂 Full preset object:`, preset);
        
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
          console.log(`🔄 Setting globalAnimationSpeed from ${state.globalAnimationSpeed} to ${newGlobalAnimationSpeed}`);
          console.log(`🔄 Type check - preset.globalAnimationSpeed:`, typeof preset.globalAnimationSpeed, preset.globalAnimationSpeed);

          // Deep merge camera settings including DoF
          const mergedCamera = {
            ...state.camera,
            ...(isPlainObject(preset.camera) ? preset.camera : {}),
            depthOfField: {
              ...state.camera.depthOfField,
              ...(isPlainObject(preset.camera && preset.camera.depthOfField) ? preset.camera.depthOfField : {})
            }
          };
          
          console.log(`🔄 Setting DoF from:`, state.camera.depthOfField, `to:`, mergedCamera.depthOfField);

          return {
            ...state,
            ui: { ...state.ui, ...(isPlainObject(preset.ui) ? preset.ui : {}) },
            background: { ...state.background, ...(isPlainObject(preset.background) ? preset.background : {}) },
            backgroundConfig: { ...state.backgroundConfig, ...(isPlainObject(preset.backgroundConfig) ? preset.backgroundConfig : {}) },
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
        
        console.log(`✅ Preset "${name}" loaded successfully`);
      } else {
        console.warn(`Preset "${name}" not found`);
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
    
    // If updating globalBlendMode defaults, also update current globalBlendMode
    if (category === 'globalBlendMode') {
      set((state) => ({
        globalBlendMode: { ...state.globalBlendMode, ...updates }
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
}));

function isPlainObject(obj: any): obj is object {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
} 