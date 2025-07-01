// aiStore.ts
// Zustand store for AI analysis and parameter mapping functionality

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { ThemeAnalysis, WeatherData, VisualCharacteristics } from '../ai-system/types/AITypes';
import { ParameterUpdate } from '../ai-system/services/ParameterMappingEngine';
import { useVisualStore } from './visualStore';

export interface AIState {
  // AI Analysis Results
  aiResults: ThemeAnalysis | null;
  weatherData: WeatherData | null;
  
  // Parameter Mapping
  parameterUpdates: ParameterUpdate[];
  lastUpdateTime: Date | null;
  
  // Mapping Engine State
  isLiveMode: boolean;
  activeOverrides: Record<string, any>;
  mappingEngineStatus: 'idle' | 'active' | 'error';
  
  // Performance Metrics
  performanceMetrics: {
    fps: number;
    memoryUsage?: {
      used: number;
      total: number;
      percentage: number;
    };
    updateFrequency: number; // updates per second
  };
  
  // UI State
  showParameterTester: boolean;
  selectedVariable: string;
}

export interface AIActions {
  // AI Results Management
  setAIResults: (results: ThemeAnalysis) => void;
  setWeatherData: (data: WeatherData) => void;
  clearAIResults: () => void;
  
  // Parameter Mapping
  addParameterUpdate: (update: ParameterUpdate) => void;
  addParameterUpdates: (updates: ParameterUpdate[]) => void;
  clearParameterUpdates: () => void;
  setLastUpdateTime: (time: Date) => void;
  
  // Live Mode Control
  setLiveMode: (enabled: boolean) => void;
  toggleLiveMode: () => void;
  
  // Override Management
  setOverride: (variable: string, value: any) => void;
  clearOverride: (variable: string) => void;
  clearAllOverrides: () => void;
  
  // Engine Status
  setMappingEngineStatus: (status: AIState['mappingEngineStatus']) => void;
  
  // Performance Monitoring
  updatePerformanceMetrics: (metrics: Partial<AIState['performanceMetrics']>) => void;
  
  // UI Controls
  setShowParameterTester: (show: boolean) => void;
  setSelectedVariable: (variable: string) => void;
  
  // Utility Actions
  resetAIState: () => void;
  exportAIState: () => string;
  importAIState: (stateJson: string) => void;
}

const defaultAIState: AIState = {
  aiResults: null,
  weatherData: null,
  parameterUpdates: [],
  lastUpdateTime: null,
  isLiveMode: true,
  activeOverrides: {},
  mappingEngineStatus: 'idle',
  performanceMetrics: {
    fps: 0,
    updateFrequency: 0
  },
  showParameterTester: false,
  selectedVariable: ''
};

type AIStore = AIState & AIActions;

export const useAIStore = create<AIStore>()(
  subscribeWithSelector((set, get) => ({
    ...defaultAIState,

    // AI Results Management
    setAIResults: (results) => {
      set({ aiResults: results });
    },

    setWeatherData: (data) => {
      set({ weatherData: data });
    },

    clearAIResults: () => {
      set({ 
        aiResults: null, 
        weatherData: null,
        parameterUpdates: [],
        lastUpdateTime: null
      });
    },

    // Parameter Mapping
    addParameterUpdate: (update) => {
      set((state) => ({
        parameterUpdates: [...state.parameterUpdates.slice(-99), update], // Keep last 100 updates
        lastUpdateTime: new Date()
      }));
    },

    addParameterUpdates: (updates) => {
      set((state) => ({
        parameterUpdates: [...state.parameterUpdates.slice(-99), ...updates], // Keep last 100 updates
        lastUpdateTime: new Date()
      }));
    },

    clearParameterUpdates: () => {
      set({ parameterUpdates: [], lastUpdateTime: null });
    },

    setLastUpdateTime: (time) => {
      set({ lastUpdateTime: time });
    },

    // Live Mode Control
    setLiveMode: (enabled) => {
      set({ isLiveMode: enabled });
    },

    toggleLiveMode: () => {
      set((state) => ({ isLiveMode: !state.isLiveMode }));
    },

    // Override Management
    setOverride: (variable, value) => {
      set((state) => ({
        activeOverrides: {
          ...state.activeOverrides,
          [variable]: value
        }
      }));
    },

    clearOverride: (variable) => {
      set((state) => {
        const newOverrides = { ...state.activeOverrides };
        delete newOverrides[variable];
        return { activeOverrides: newOverrides };
      });
    },

    clearAllOverrides: () => {
      set({ activeOverrides: {} });
    },

    // Engine Status
    setMappingEngineStatus: (status) => {
      set({ mappingEngineStatus: status });
    },

    // Performance Monitoring
    updatePerformanceMetrics: (metrics) => {
      set((state) => ({
        performanceMetrics: {
          ...state.performanceMetrics,
          ...metrics
        }
      }));
    },

    // UI Controls
    setShowParameterTester: (show) => {
      set({ showParameterTester: show });
    },

    setSelectedVariable: (variable) => {
      set({ selectedVariable: variable });
    },

    // Utility Actions
    resetAIState: () => {
      set(defaultAIState);
    },

    exportAIState: () => {
      const state = get();
      return JSON.stringify(state);
    },

    importAIState: (stateJson) => {
      try {
        const importedState = JSON.parse(stateJson);
        set(importedState);
      } catch (error) {
        console.error('Failed to import AI state:', error);
      }
    }
  }))
);

// Subscription functions for real-time updates
export const subscribeToParameterUpdates = (callback: (updates: ParameterUpdate[]) => void) => {
  return useAIStore.subscribe(
    (state) => state.parameterUpdates,
    callback
  );
};

export const subscribeToAIResults = (callback: (results: ThemeAnalysis | null) => void) => {
  return useAIStore.subscribe(
    (state) => state.aiResults,
    callback
  );
};

export const subscribeToWeatherData = (callback: (data: WeatherData | null) => void) => {
  return useAIStore.subscribe(
    (state) => state.weatherData,
    callback
  );
};

export const subscribeToLiveMode = (callback: (isLive: boolean) => void) => {
  return useAIStore.subscribe(
    (state) => state.isLiveMode,
    callback
  );
};

export const subscribeToPerformanceMetrics = (callback: (metrics: AIState['performanceMetrics']) => void) => {
  return useAIStore.subscribe(
    (state) => state.performanceMetrics,
    callback
  );
};

// Utility function to get current AI state
export const getAIState = () => useAIStore.getState();

// Apply parameter updates to visual store
export const applyParameterUpdatesToVisualStore = (updates: ParameterUpdate[]) => {
  const visualStore = useVisualStore.getState();
  
  updates.forEach(update => {
    const { variable, value } = update;
    
    // Parse nested variable paths (e.g., "geometric.spheres.count")
    const pathParts = variable.split('.');
    
    if (pathParts.length === 1) {
      // Top-level property
      switch (variable) {
        case 'globalAnimationSpeed':
          visualStore.updateGlobalAnimationSpeed(value);
          break;
        case 'background':
          visualStore.updateBackground(value);
          break;
        case 'particles':
          visualStore.updateParticles(value);
          break;
        case 'globalEffects':
          visualStore.updateGlobalEffects(value);
          break;
        case 'effects':
          visualStore.updateEffects(value);
          break;
        case 'camera':
          visualStore.updateCamera(value);
          break;
        case 'backgroundConfig':
          visualStore.updateBackgroundConfig(value);
          break;
      }
    } else if (pathParts.length === 2) {
      // Two-level property (e.g., "geometric.spheres")
      const [category, subcategory] = pathParts;
      
      switch (category) {
        case 'geometric':
          if (subcategory in visualStore.geometric) {
            visualStore.updateGeometric(subcategory as keyof typeof visualStore.geometric, value);
          }
          break;
        case 'particles':
          visualStore.updateParticles({ [subcategory]: value });
          break;
        case 'globalEffects':
          visualStore.updateGlobalEffects({ [subcategory]: value });
          break;
        case 'effects':
          visualStore.updateEffects({ [subcategory]: value });
          break;
        case 'camera':
          visualStore.updateCamera({ [subcategory]: value });
          break;
        case 'background':
          visualStore.updateBackground({ [subcategory]: value });
          break;
      }
    } else if (pathParts.length === 3) {
      // Three-level property (e.g., "geometric.spheres.count")
      const [category, subcategory, property] = pathParts;
      
      switch (category) {
        case 'geometric':
          if (subcategory in visualStore.geometric) {
            const currentValue = visualStore.geometric[subcategory as keyof typeof visualStore.geometric];
            visualStore.updateGeometric(subcategory as keyof typeof visualStore.geometric, {
              ...currentValue,
              [property]: value
            });
          }
          break;
        case 'globalEffects':
          const currentGlobalEffects = visualStore.globalEffects;
          if (subcategory in currentGlobalEffects) {
            const currentSubcategory = currentGlobalEffects[subcategory as keyof typeof currentGlobalEffects];
            visualStore.updateGlobalEffects({
              [subcategory]: {
                ...currentSubcategory,
                [property]: value
              }
            });
          }
          break;
        case 'camera':
          const currentCamera = visualStore.camera;
          if (subcategory in currentCamera) {
            const currentSubcategory = currentCamera[subcategory as keyof typeof currentCamera] as Record<string, any>;
            visualStore.updateCamera({
              [subcategory]: {
                ...currentSubcategory,
                [property]: value
              }
            });
          }
          break;
      }
    }
  });
};

// Apply AI analysis to visual store with comprehensive variable mapping
export const applyAIAnalysisToVisualStore = (analysis: ThemeAnalysis, weatherData?: WeatherData) => {
  const visualStore = useVisualStore.getState();
  const { colorPalette, visualCharacteristics, mood, atmosphere } = analysis;
  
  // Extract characteristics
  const { energy, speed, density, saturation, turbulence, harmony, brightness } = visualCharacteristics;
  
  // 1. Apply color palette to all available color properties
  visualStore.updateBackground({
    color: colorPalette.primary,
    opacity: 0.3 + (brightness * 0.4)
  });
  
  // Update geometric shape colors
  visualStore.updateGeometric('spheres', {
    color: colorPalette.primary,
    opacity: 0.6 + (saturation * 0.4),
    speed: speed * 0.5,
    count: Math.floor(5 + (density * 10)),
    size: 0.5 + (energy * 0.5),
    organicness: turbulence * 0.8,
    pulseEnabled: energy > 0.7,
    pulseSize: energy * 0.3
  });
  
  visualStore.updateGeometric('cubes', {
    color: colorPalette.secondary,
    opacity: 0.6 + (saturation * 0.4),
    speed: speed * 0.4,
    count: Math.floor(3 + (density * 8)),
    size: 0.4 + (energy * 0.6),
    organicness: turbulence * 0.6,
    pulseEnabled: energy > 0.6,
    pulseSize: energy * 0.2
  });
  
  visualStore.updateGeometric('toruses', {
    color: colorPalette.accent,
    opacity: 0.7 + (saturation * 0.3),
    speed: speed * 0.6,
    count: Math.floor(2 + (density * 6)),
    size: 0.3 + (energy * 0.7),
    organicness: turbulence * 0.7,
    pulseEnabled: energy > 0.5,
    pulseSize: energy * 0.25
  });
  
  visualStore.updateGeometric('blobs', {
    color: colorPalette.supporting[0] || colorPalette.primary,
    opacity: 0.5 + (saturation * 0.5),
    speed: speed * 0.3,
    count: Math.floor(4 + (density * 12)),
    size: 0.6 + (energy * 0.4),
    organicness: turbulence * 0.9,
    pulseEnabled: energy > 0.8,
    pulseSize: energy * 0.4
  });
  
  visualStore.updateGeometric('crystals', {
    color: colorPalette.supporting[1] || colorPalette.secondary,
    opacity: 0.8 + (saturation * 0.2),
    count: Math.floor(2 + (density * 4)),
    size: 0.4 + (energy * 0.6),
    complexity: turbulence * 0.8,
    organicness: harmony * 0.5
  });
  
  // Update special effect colors
  visualStore.updateGeometric('waveInterference', {
    color: colorPalette.primary
  });
  
  visualStore.updateGeometric('metamorphosis', {
    color: colorPalette.accent
  });
  
  visualStore.updateGeometric('fireflies', {
    color: colorPalette.supporting[2] || colorPalette.primary
  });
  
  visualStore.updateGeometric('layeredSineWaves', {
    color: colorPalette.secondary
  });
  
  // 2. Apply particles with AI characteristics
  visualStore.updateParticles({
    color: energy > 0.7 ? colorPalette.accent : colorPalette.primary,
    count: Math.floor(100 + (density * 300)),
    size: 0.3 + (energy * 0.7),
    speed: speed * 0.8,
    opacity: 0.6 + (saturation * 0.4),
    spread: 20 + (turbulence * 30),
    pulseEnabled: energy > 0.6,
    pulseSize: energy * 0.3
  });
  
  // 3. Apply global effects based on AI characteristics
  visualStore.updateGlobalEffects({
    // Atmospheric effects
    atmosphericBlur: {
      enabled: turbulence > 0.3,
      intensity: turbulence * 0.8,
      layers: Math.floor(2 + (turbulence * 4))
    },
    
    // Color blending
    colorBlending: {
      enabled: harmony > 0.5,
      mode: harmony > 0.7 ? 'soft-light' : 'overlay',
      intensity: harmony * 0.6
    },
    
    // Shape glow
    shapeGlow: {
      enabled: energy > 0.6,
      intensity: energy * 0.8,
      radius: 3 + (energy * 4),
      useObjectColor: true,
      customColor: colorPalette.primary,
      pulsing: energy > 0.8,
      pulseSpeed: speed * 0.5
    },
    
    // Chromatic effects
    chromatic: {
      enabled: turbulence > 0.4,
      aberration: turbulence * 0.3,
      aberrationColors: {
        red: colorPalette.primary,
        green: colorPalette.secondary,
        blue: colorPalette.accent
      },
      rainbow: {
        enabled: saturation > 0.7,
        intensity: saturation * 0.5,
        speed: speed * 0.3,
        rotation: 0,
        blendMode: 'screen',
        colors: colorPalette.supporting,
        opacity: saturation * 0.6
      },
      prism: turbulence * 0.2
    },
    
    // Distortion effects
    distortion: {
      enabled: turbulence > 0.2,
      wave: turbulence * 0.4,
      ripple: turbulence * 0.3,
      noise: turbulence * 0.2,
      frequency: 0.5 + (turbulence * 1.5)
    },
    
    // Particle interaction
    particleInteraction: {
      enabled: harmony > 0.4,
      magnetism: harmony * 0.7,
      repulsion: (1 - harmony) * 0.5,
      flowField: harmony > 0.6,
      turbulence: turbulence * 0.6
    },
    
    // Volumetric effects
    volumetric: {
      enabled: density > 0.6,
      fog: density * 0.4,
      lightShafts: energy * 0.3,
      density: 0.2 + (density * 0.3),
      color: colorPalette.primary
    },
    
    // Trails system
    trails: {
      enabled: speed > 0.7,
      sphereTrails: {
        enabled: speed > 0.6,
        length: Math.floor(5 + (speed * 10)),
        opacity: 0.3 + (speed * 0.4),
        width: 0.5 + (speed * 0.5),
        fadeRate: 0.1 + (speed * 0.2)
      },
      cubeTrails: {
        enabled: speed > 0.5,
        length: Math.floor(4 + (speed * 8)),
        opacity: 0.2 + (speed * 0.3),
        width: 0.4 + (speed * 0.4),
        fadeRate: 0.1 + (speed * 0.15)
      },
      blobTrails: {
        enabled: speed > 0.8,
        length: Math.floor(6 + (speed * 12)),
        opacity: 0.4 + (speed * 0.5),
        width: 0.6 + (speed * 0.6),
        fadeRate: 0.1 + (speed * 0.25)
      },
      torusTrails: {
        enabled: speed > 0.6,
        length: Math.floor(5 + (speed * 9)),
        opacity: 0.3 + (speed * 0.4),
        width: 0.5 + (speed * 0.5),
        fadeRate: 0.1 + (speed * 0.2)
      },
      particleTrails: {
        enabled: speed > 0.7,
        length: Math.floor(3 + (speed * 7)),
        opacity: 0.2 + (speed * 0.3),
        width: 0.3 + (speed * 0.4),
        fadeRate: 0.1 + (speed * 0.1)
      }
    },
    
    // Special effects based on mood and atmosphere
    waveInterference: {
      enabled: atmosphere.includes('flowing') || atmosphere.includes('organic'),
      speed: speed * 0.4,
      amplitude: energy * 0.6,
      contourLevels: Math.floor(3 + (density * 5)),
      preset: Math.floor(1 + (turbulence * 3)),
      edgeFade: {
        enabled: true,
        fadeStart: 0.3,
        fadeEnd: 0.5
      }
    },
    
    metamorphosis: {
      enabled: atmosphere.includes('transforming') || atmosphere.includes('evolving'),
      morphSpeed: speed * 0.6,
      rotationSpeed: turbulence * 0.8,
      wireframeOpacity: 0.4 + (energy * 0.4),
      size: 0.8 + (energy * 0.4),
      blur: turbulence * 0.3,
      intensity: energy * 0.7,
      layers: Math.floor(2 + (density * 4))
    },
    
    fireflies: {
      enabled: atmosphere.includes('magical') || atmosphere.includes('ethereal'),
      count: Math.floor(50 + (density * 150)),
      speed: speed * 0.5,
      glowIntensity: energy * 0.8,
      swarmRadius: 15 + (turbulence * 25)
    },
    
    layeredSineWaves: {
      enabled: atmosphere.includes('rhythmic') || atmosphere.includes('harmonic'),
      layers: Math.floor(40 + (harmony * 40)),
      points: Math.floor(100 + (density * 100)),
      waveAmplitude: 20 + (energy * 40),
      speed: speed * 0.3,
      opacity: 0.4 + (saturation * 0.4),
      lineWidth: 0.3 + (energy * 0.4),
      size: 0.8 + (energy * 0.4),
      width: 80 + (density * 40),
      height: 80 + (density * 40),
      intensity: energy * 0.6,
      layerCount: Math.floor(3 + (harmony * 5)),
      edgeFade: {
        enabled: true,
        fadeStart: 0.3,
        fadeEnd: 0.5
      }
    }
  });
  
  // 4. Apply post-processing effects
  visualStore.updateEffects({
    glow: energy * 0.6,
    contrast: 1.0 + (saturation * 0.2),
    saturation: 0.8 + (saturation * 0.4),
    hue: 0,
    brightness: 0.8 + (brightness * 0.4),
    vignette: turbulence * 0.3
  });
  
  // 5. Apply camera adjustments based on mood
  const cameraDistance = atmosphere.includes('intimate') ? 8 : atmosphere.includes('epic') ? 15 : 12;
  const cameraFOV = atmosphere.includes('wide') ? 75 : atmosphere.includes('focused') ? 45 : 60;
  
  visualStore.updateCamera({
    distance: cameraDistance,
    fov: cameraFOV,
    autoRotate: atmosphere.includes('dynamic'),
    autoRotateSpeed: speed * 0.3,
    autoPan: {
      enabled: atmosphere.includes('cinematic'),
      speed: speed * 0.2,
      radius: 5 + (turbulence * 5),
      height: 2 + (energy * 3),
      easing: 0.1 + (harmony * 0.2),
      currentAngle: 0
    }
  });
  
  // 6. Apply global animation speed
  visualStore.updateGlobalAnimationSpeed(speed);
  
  // 7. Apply global blend mode based on mood
  let blendMode = 'normal';
  let blendOpacity = 0.5;
  
  if (mood.includes('dreamy')) {
    blendMode = 'soft-light';
    blendOpacity = 0.3;
  } else if (mood.includes('intense')) {
    blendMode = 'overlay';
    blendOpacity = 0.4;
  } else if (mood.includes('mysterious')) {
    blendMode = 'multiply';
    blendOpacity = 0.2;
  } else if (mood.includes('ethereal')) {
    blendMode = 'screen';
    blendOpacity = 0.3;
  }
  
  // Note: globalBlendMode is not directly updatable through the store interface
  // This would need to be handled at the component level
};

// Apply weather effects to visual store
export const applyWeatherEffectsToVisualStore = (weatherData: WeatherData, baseCharacteristics: VisualCharacteristics) => {
  const visualStore = useVisualStore.getState();
  const { temperature, humidity, windSpeed, condition } = weatherData;
  
  // Temperature effects
  const tempEffect = Math.max(0, Math.min(1, (temperature - 32) / 68));
  
  // Wind effects
  const windEffect = Math.min(1, windSpeed / 30);
  
  // Humidity effects
  const humidityEffect = humidity / 100;
  
  // Apply temperature-based color shifts
  const tempHueShift = temperature > 70 ? 30 : temperature < 40 ? -30 : 0;
  const tempSaturation = temperature > 80 ? 1.2 : temperature < 50 ? 0.8 : 1.0;
  
  // Apply wind-based movement effects
  const windSpeedMultiplier = 1 + (windEffect * 0.5);
  const windTurbulence = windEffect * 0.8;
  
  // Apply humidity-based atmospheric effects
  const humidityFog = humidityEffect * 0.6;
  const humidityBlur = humidityEffect * 0.4;
  
  // Update particles with weather effects
  visualStore.updateParticles({
    speed: baseCharacteristics.speed * windSpeedMultiplier,
    spread: 20 + (windEffect * 30)
  });
  
  // Update global effects with weather
  visualStore.updateGlobalEffects({
    atmosphericBlur: {
      enabled: true,
      intensity: 0.1 + humidityBlur,
      layers: Math.floor(2 + (humidityEffect * 3))
    },
    distortion: {
      enabled: windEffect > 0.1,
      wave: windTurbulence * 0.3,
      ripple: windTurbulence * 0.2,
      noise: windTurbulence * 0.1,
      frequency: 0.5 + (windTurbulence * 1.5)
    },
    volumetric: {
      enabled: humidityEffect > 0.3,
      fog: humidityFog,
      lightShafts: humidityEffect * 0.2,
      density: 0.2 + (humidityEffect * 0.3),
      color: temperature > 70 ? '#ffaa00' : temperature < 40 ? '#87CEEB' : '#ffffff'
    }
  });
  
  // Weather condition specific effects
  switch (condition.toLowerCase()) {
    case 'rain':
    case 'drizzle':
      visualStore.updateGlobalEffects({
        atmosphericBlur: {
          enabled: true,
          intensity: 0.4,
          layers: 4
        },
        volumetric: {
          enabled: true,
          fog: 0.3,
          lightShafts: 0.1,
          density: 0.2,
          color: '#87CEEB'
        }
      });
      break;
      
    case 'storm':
    case 'thunderstorm':
      visualStore.updateGlobalEffects({
        metamorphosis: {
          enabled: true,
          morphSpeed: 0.8,
          rotationSpeed: 1.2,
          wireframeOpacity: 0.6,
          size: 1.2,
          blur: 0.2,
          intensity: 0.8,
          layers: 3
        },
        distortion: {
          enabled: true,
          wave: 0.4,
          ripple: 0.3,
          noise: 0.2,
          frequency: 2.0
        },
        chromatic: {
          enabled: true,
          aberration: 0.3,
          aberrationColors: {
            red: '#ff0000',
            green: '#00ff00',
            blue: '#0000ff'
          },
          rainbow: {
            enabled: true,
            intensity: 0.2,
            speed: 1.5,
            rotation: 0,
            blendMode: 'screen',
            colors: ['#ff0000', '#00ff00', '#0000ff'],
            opacity: 0.8
          },
          prism: 0.1
        }
      });
      break;
      
    case 'snow':
      visualStore.updateGlobalEffects({
        atmosphericBlur: {
          enabled: true,
          intensity: 0.6,
          layers: 6
        },
        volumetric: {
          enabled: true,
          fog: 0.5,
          lightShafts: 0.3,
          density: 0.4,
          color: '#ffffff'
        }
      });
      break;
      
    case 'fog':
    case 'mist':
      visualStore.updateGlobalEffects({
        waveInterference: {
          enabled: true,
          speed: 0.2,
          amplitude: 0.4,
          contourLevels: 8,
          preset: 2,
          edgeFade: {
            enabled: true,
            fadeStart: 0.3,
            fadeEnd: 0.5
          }
        },
        atmosphericBlur: {
          enabled: true,
          intensity: 0.6,
          layers: 6
        },
        volumetric: {
          enabled: true,
          fog: 0.7,
          lightShafts: 0.05,
          density: 0.4,
          color: '#D3D3D3'
        }
      });
      break;
      
    case 'clear':
    case 'sunny':
      visualStore.updateGlobalEffects({
        shapeGlow: {
          enabled: true,
          intensity: 0.8,
          radius: 5,
          useObjectColor: true,
          customColor: '#ffffff',
          pulsing: false,
          pulseSpeed: 1.0
        }
      });
      break;
  }
  
  // Apply weather-based visual effects
  const weatherVisualEffects = {
    saturation: tempSaturation,
    brightness: temperature > 80 ? 1.2 : temperature < 40 ? 0.8 : 1.0,
    contrast: humidityEffect > 0.7 ? 0.9 : 1.1
  };
  
  visualStore.updateEffects(weatherVisualEffects);
};

// Real-time integration system
export const initializeAIVisualIntegration = () => {
  // Subscribe to AI results and automatically apply them
  const unsubscribeAIResults = subscribeToAIResults((results) => {
    if (results) {
      applyAIAnalysisToVisualStore(results);
    }
  });
  
  // Subscribe to weather data updates
  const unsubscribeWeather = subscribeToWeatherData((weatherData) => {
    if (weatherData) {
      const aiState = getAIState();
      if (aiState.aiResults) {
        applyWeatherEffectsToVisualStore(weatherData, aiState.aiResults.visualCharacteristics);
      }
    }
  });
  
  // Subscribe to parameter updates for manual overrides
  const unsubscribeParameters = subscribeToParameterUpdates((updates) => {
    if (updates.length > 0) {
      applyParameterUpdatesToVisualStore(updates);
    }
  });
  
  // Return cleanup function
  return () => {
    unsubscribeAIResults();
    unsubscribeWeather();
    unsubscribeParameters();
  };
};

// Utility function to manually enable special effects for testing
export const enableSpecialEffects = (effects: {
  waveInterference?: boolean;
  metamorphosis?: boolean;
  fireflies?: boolean;
  layeredSineWaves?: boolean;
}) => {
  const visualStore = useVisualStore.getState();
  
  if (effects.waveInterference !== undefined) {
    visualStore.updateGlobalEffects({
      waveInterference: {
        enabled: effects.waveInterference,
        speed: 0.5,
        amplitude: 0.5,
        contourLevels: 5,
        preset: 1,
        edgeFade: {
          enabled: true,
          fadeStart: 0.3,
          fadeEnd: 0.5
        }
      }
    });
  }
  
  if (effects.metamorphosis !== undefined) {
    visualStore.updateGlobalEffects({
      metamorphosis: {
        enabled: effects.metamorphosis,
        morphSpeed: 0.5,
        rotationSpeed: 0.5,
        wireframeOpacity: 0.5,
        size: 1.0,
        blur: 0.0,
        intensity: 0.5,
        layers: 2
      }
    });
  }
  
  if (effects.fireflies !== undefined) {
    visualStore.updateGlobalEffects({
      fireflies: {
        enabled: effects.fireflies,
        count: 100,
        speed: 0.5,
        glowIntensity: 0.5,
        swarmRadius: 20
      }
    });
  }
  
  if (effects.layeredSineWaves !== undefined) {
    visualStore.updateGlobalEffects({
      layeredSineWaves: {
        enabled: effects.layeredSineWaves,
        layers: 80,
        points: 200,
        waveAmplitude: 40,
        speed: 0.5,
        opacity: 0.5,
        lineWidth: 0.6,
        size: 1.0,
        width: 100,
        height: 100,
        intensity: 0.5,
        layerCount: 5,
        edgeFade: {
          enabled: true,
          fadeStart: 0.3,
          fadeEnd: 0.5
        }
      }
    });
  }
  
  // Update artistic layout to ensure proper layering
  updateArtisticLayoutForSpecialEffects(effects);
};

// Function to update artistic layout for special effects
export const updateArtisticLayoutForSpecialEffects = (effects: {
  waveInterference?: boolean;
  metamorphosis?: boolean;
  fireflies?: boolean;
  layeredSineWaves?: boolean;
}) => {
  const visualStore = useVisualStore.getState();
  const currentLayout = visualStore.backgroundConfig.artisticLayout;
  
  // Create new layer configuration
  const newLayers = {
    deepBackground: {
      zPosition: -80,
      objects: effects.metamorphosis ? ['metamorphosis'] : [],
      opacity: 0.6,
      movement: 'minimal' as const
    },
    farBackground: {
      zPosition: -50,
      objects: effects.waveInterference ? ['waveInterference'] : [],
      opacity: 0.8,
      movement: 'slow' as const
    },
    midBackground: {
      zPosition: -30,
      objects: effects.layeredSineWaves ? ['layeredSineWaves'] : [],
      opacity: 0.7,
      movement: 'slow' as const
    },
    nearBackground: {
      ...currentLayout.layers.nearBackground
    },
    foreground: {
      zPosition: 5,
      objects: effects.fireflies ? ['fireflies'] : [],
      opacity: 1.0,
      movement: 'active' as const
    }
  };
  
  // Update the artistic layout
  visualStore.updateBackgroundConfig({
    artisticLayout: {
      ...currentLayout,
      layers: newLayers
    }
  });
};

// AI-to-Visual mapping function that respects global defaults
export const applyAIAnalysisToVisualStoreWithDefaults = (analysis: ThemeAnalysis, weatherData?: WeatherData) => {
  const visualStore = useVisualStore.getState();
  const { colorPalette, visualCharacteristics, mood, atmosphere } = analysis;
  const globalDefaults = visualStore.getGlobalDefaults();
  
  // Apply AI analysis with global defaults protection
  applyAIAnalysisToVisualStore(analysis, weatherData);
  
  // Ensure critical parameters respect global defaults
  if (globalDefaults.camera) {
    visualStore.updateCamera({
      ...globalDefaults.camera,
      // AI can override specific camera properties while keeping global defaults for others
      distance: visualStore.camera.distance,
      fov: visualStore.camera.fov
    });
  }
  
  // Update artistic layout for proper layering
  updateArtisticLayoutForSpecialEffects({
    waveInterference: visualStore.globalEffects.waveInterference.enabled,
    metamorphosis: visualStore.globalEffects.metamorphosis.enabled,
    fireflies: visualStore.globalEffects.fireflies.enabled,
    layeredSineWaves: visualStore.globalEffects.layeredSineWaves.enabled
  });
};

// Weather effects with global defaults protection
export const applyWeatherEffectsToVisualStoreWithDefaults = (weatherData: WeatherData, baseCharacteristics: VisualCharacteristics) => {
  const visualStore = useVisualStore.getState();
  const globalDefaults = visualStore.getGlobalDefaults();
  
  // Apply weather effects
  applyWeatherEffectsToVisualStore(weatherData, baseCharacteristics);
  
  // Ensure global defaults are respected for critical parameters
  if (globalDefaults.visual) {
    visualStore.updateEffects({
      ...visualStore.effects,
      // Ensure global defaults are applied for critical visual parameters
      glow: globalDefaults.visual.glow,
      contrast: globalDefaults.visual.contrast,
      saturation: globalDefaults.visual.saturation,
      brightness: globalDefaults.visual.brightness,
      vignette: globalDefaults.visual.vignette
    });
  }
}; 