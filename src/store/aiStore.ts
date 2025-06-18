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
      return JSON.stringify({
        aiResults: state.aiResults,
        weatherData: state.weatherData,
        activeOverrides: state.activeOverrides,
        performanceMetrics: state.performanceMetrics
      }, null, 2);
    },

    importAIState: (stateJson) => {
      try {
        const importedState = JSON.parse(stateJson);
        set((state) => ({
          ...state,
          aiResults: importedState.aiResults || null,
          weatherData: importedState.weatherData || null,
          activeOverrides: importedState.activeOverrides || {},
          performanceMetrics: importedState.performanceMetrics || state.performanceMetrics
        }));
      } catch (error) {
        console.error('Failed to import AI state:', error);
      }
    }
  }))
);

// Subscribe to parameter updates for external integrations
export const subscribeToParameterUpdates = (callback: (updates: ParameterUpdate[]) => void) => {
  return useAIStore.subscribe(
    (state) => state.parameterUpdates,
    (updates) => {
      if (updates.length > 0) {
        callback(updates);
      }
    }
  );
};

// Subscribe to AI results for external integrations
export const subscribeToAIResults = (callback: (results: ThemeAnalysis | null) => void) => {
  return useAIStore.subscribe(
    (state) => state.aiResults,
    callback
  );
};

// Subscribe to weather data for external integrations
export const subscribeToWeatherData = (callback: (data: WeatherData | null) => void) => {
  return useAIStore.subscribe(
    (state) => state.weatherData,
    callback
  );
};

// Subscribe to live mode changes
export const subscribeToLiveMode = (callback: (isLive: boolean) => void) => {
  return useAIStore.subscribe(
    (state) => state.isLiveMode,
    callback
  );
};

// Subscribe to performance metrics
export const subscribeToPerformanceMetrics = (callback: (metrics: AIState['performanceMetrics']) => void) => {
  return useAIStore.subscribe(
    (state) => state.performanceMetrics,
    callback
  );
};

// Utility function to get current state for external use
export const getAIState = () => useAIStore.getState();

// Utility function to apply parameter updates to visual store
export const applyParameterUpdatesToVisualStore = (updates: ParameterUpdate[]) => {
  const visualStore = useVisualStore.getState();
  
  updates.forEach(update => {
    try {
      // Parse the variable path (e.g., "geometric.spheres.color" -> ["geometric", "spheres", "color"])
      const pathParts = update.variable.split('.');
      const value = update.value;
      
      // Apply the update based on the path
      switch (pathParts[0]) {
        case 'background':
          if (pathParts[1] === 'color') {
            visualStore.updateBackground({ color: value });
          } else if (pathParts[1] === 'opacity') {
            visualStore.updateBackground({ opacity: value });
          }
          break;
          
        case 'geometric':
          if (pathParts[1] && pathParts[2]) {
            const shapeType = pathParts[1] as keyof typeof visualStore.geometric;
            const property = pathParts[2];
            const currentShape = visualStore.geometric[shapeType];
            
            if (currentShape && typeof currentShape === 'object') {
              visualStore.updateGeometric(shapeType, { [property]: value });
            }
          }
          break;
          
        case 'particles':
          if (pathParts[1]) {
            visualStore.updateParticles({ [pathParts[1]]: value });
          }
          break;
          
        case 'globalEffects':
          if (pathParts[1] && pathParts[2]) {
            const effectType = pathParts[1];
            const property = pathParts[2];
            const currentEffects = visualStore.globalEffects;
            
            if (currentEffects[effectType as keyof typeof currentEffects]) {
              visualStore.updateGlobalEffects({
                [effectType]: {
                  ...currentEffects[effectType as keyof typeof currentEffects],
                  [property]: value
                }
              });
            }
          }
          break;
          
        case 'effects':
          if (pathParts[1]) {
            visualStore.updateEffects({ [pathParts[1]]: value });
          }
          break;
          
        case 'camera':
          if (pathParts[1]) {
            visualStore.updateCamera({ [pathParts[1]]: value });
          }
          break;
      }
    } catch (error) {
      console.error(`Failed to apply update for ${update.variable}:`, error);
    }
  });
};

// NEW: Comprehensive AI-to-Visual mapping function
export const applyAIAnalysisToVisualStore = (analysis: ThemeAnalysis, weatherData?: WeatherData) => {
  const visualStore = useVisualStore.getState();
  const { colorPalette, visualCharacteristics, mood, atmosphere } = analysis;
  const globalDefaults = visualStore.getGlobalDefaults();
  
  console.log('🎨 Applying AI analysis to visual store:', { analysis, weatherData });
  
  // 1. Apply color palette
  const primaryColor = colorPalette.primary;
  const secondaryColor = colorPalette.secondary;
  const accentColor = colorPalette.accent;
  
  // Update background with primary color
  visualStore.updateBackground({
    color: primaryColor,
    opacity: 0.3 + (visualCharacteristics.brightness * 0.4) // 0.3-0.7 range
  });
  
  // 2. Apply visual characteristics to geometric shapes
  const energy = visualCharacteristics.energy;
  const speed = visualCharacteristics.speed;
  const density = visualCharacteristics.density;
  const saturation = visualCharacteristics.saturation;
  const turbulence = visualCharacteristics.turbulence;
  
  // Update spheres with energy and speed
  visualStore.updateGeometric('spheres', {
    color: secondaryColor,
    speed: speed * 2, // Scale 0-2 to 0-4
    opacity: 0.4 + (energy * 0.4), // 0.4-0.8 range
    count: Math.floor(10 + (density * 20)) // 10-30 range
  });
  
  // Update cubes with harmony and energy
  visualStore.updateGeometric('cubes', {
    color: accentColor,
    rotation: speed * 0.5,
    opacity: 0.3 + (energy * 0.5),
    count: Math.floor(5 + (density * 15))
  });
  
  // 3. Apply to particles
  visualStore.updateParticles({
    color: accentColor,
    speed: speed * 1.2,
    opacity: 0.6 + (energy * 0.3),
    count: Math.floor(50 + (density * 100)),
    size: 0.05 + (energy * 0.15)
  });
  
  // 4. Apply global effects based on mood and characteristics
  const isEnergetic = mood.some(m => ['energetic', 'dynamic', 'vibrant', 'intense'].includes(m.toLowerCase()));
  const isCalm = mood.some(m => ['calm', 'peaceful', 'serene', 'gentle'].includes(m.toLowerCase()));
  const isChaotic = mood.some(m => ['chaotic', 'wild', 'turbulent', 'explosive'].includes(m.toLowerCase()));
  const isOrganic = mood.some(m => ['organic', 'natural', 'biomass', 'living', 'growth'].includes(m.toLowerCase()));
  const isMagical = mood.some(m => ['magical', 'mystical', 'ethereal', 'dreamy', 'fantasy'].includes(m.toLowerCase()));
  
  // Atmospheric blur based on harmony
  visualStore.updateGlobalEffects({
    atmosphericBlur: {
      enabled: true,
      intensity: 0.1 + (visualCharacteristics.harmony * 0.3),
      layers: Math.floor(2 + (visualCharacteristics.harmony * 3))
    }
  });
  
  // Color blending based on saturation
  visualStore.updateGlobalEffects({
    colorBlending: {
      enabled: true,
      mode: saturation > 0.7 ? 'screen' : saturation > 0.4 ? 'overlay' : 'soft-light',
      intensity: saturation * 0.8
    }
  });
  
  // Shape glow based on energy
  visualStore.updateGlobalEffects({
    shapeGlow: {
      enabled: energy > 0.3,
      intensity: energy * 0.6,
      radius: 2 + (energy * 3),
      useObjectColor: true,
      customColor: '#ffffff',
      pulsing: isEnergetic,
      pulseSpeed: speed * 0.5
    }
  });
  
  // Distortion based on turbulence
  visualStore.updateGlobalEffects({
    distortion: {
      enabled: turbulence > 0.2,
      wave: turbulence * 0.3,
      ripple: turbulence * 0.2,
      noise: turbulence * 0.1,
      frequency: 0.5 + (turbulence * 1.5)
    }
  });
  
  // Particle interaction based on energy
  visualStore.updateGlobalEffects({
    particleInteraction: {
      enabled: energy > 0.4,
      magnetism: energy * 0.4,
      repulsion: (1 - energy) * 0.3,
      flowField: true,
      turbulence: turbulence * 0.5
    }
  });
  
  // 5. ENABLE AND CONFIGURE SPECIAL EFFECTS BASED ON MOOD AND CHARACTERISTICS
  
  // Wave Interference - Enable for organic/magical themes or high harmony
  const shouldEnableWaveInterference = isOrganic || isMagical || visualCharacteristics.harmony > 0.6;
  visualStore.updateGlobalEffects({
    waveInterference: {
      enabled: shouldEnableWaveInterference,
      speed: shouldEnableWaveInterference ? 0.3 + (speed * 0.4) : 0.5,
      amplitude: shouldEnableWaveInterference ? 0.3 + (energy * 0.4) : 0.5,
      contourLevels: shouldEnableWaveInterference ? Math.floor(3 + (density * 4)) : 5,
      edgeFade: {
        enabled: true,
        fadeStart: 0.3,
        fadeEnd: 0.5
      }
    }
  });
  
  // Update wave interference color in geometric
  if (shouldEnableWaveInterference) {
    visualStore.updateGeometric('waveInterference', {
      color: isOrganic ? '#00ff88' : isMagical ? '#ff00ff' : secondaryColor
    });
  }
  
  // Metamorphosis - Enable for chaotic/energetic themes or high turbulence
  const shouldEnableMetamorphosis = isChaotic || isEnergetic || turbulence > 0.5;
  visualStore.updateGlobalEffects({
    metamorphosis: {
      enabled: shouldEnableMetamorphosis,
      morphSpeed: shouldEnableMetamorphosis ? 0.3 + (speed * 0.6) : 0.5,
      rotationSpeed: shouldEnableMetamorphosis ? 0.4 + (energy * 0.8) : 0.5,
      wireframeOpacity: shouldEnableMetamorphosis ? 0.3 + (turbulence * 0.4) : 0.5,
      size: shouldEnableMetamorphosis ? 0.8 + (density * 0.4) : 1.0,
      blur: shouldEnableMetamorphosis ? turbulence * 0.3 : 0.0
    }
  });
  
  // Update metamorphosis color in geometric
  if (shouldEnableMetamorphosis) {
    visualStore.updateGeometric('metamorphosis', {
      color: isChaotic ? '#ff4444' : isEnergetic ? '#ffaa00' : accentColor
    });
  }
  
  // Fireflies - Enable for magical/calm themes or moderate energy
  const shouldEnableFireflies = isMagical || isCalm || (energy > 0.3 && energy < 0.8);
  visualStore.updateGlobalEffects({
    fireflies: {
      enabled: shouldEnableFireflies,
      count: shouldEnableFireflies ? Math.floor(50 + (density * 100)) : 100,
      speed: shouldEnableFireflies ? 0.3 + (speed * 0.4) : 0.5,
      glowIntensity: shouldEnableFireflies ? 0.4 + (energy * 0.4) : 0.5,
      swarmRadius: shouldEnableFireflies ? 15 + (turbulence * 10) : 20
    }
  });
  
  // Update fireflies color in geometric
  if (shouldEnableFireflies) {
    visualStore.updateGeometric('fireflies', {
      color: isMagical ? '#ffff00' : isCalm ? '#00ffff' : accentColor
    });
  }
  
  // Layered Sine Waves - Enable for calm/zen themes or high harmony
  const shouldEnableLayeredSineWaves = isCalm || visualCharacteristics.harmony > 0.7;
  visualStore.updateGlobalEffects({
    layeredSineWaves: {
      enabled: shouldEnableLayeredSineWaves,
      layers: shouldEnableLayeredSineWaves ? Math.floor(60 + (density * 40)) : 80,
      points: shouldEnableLayeredSineWaves ? Math.floor(150 + (density * 100)) : 200,
      waveAmplitude: shouldEnableLayeredSineWaves ? 30 + (energy * 20) : 40,
      speed: shouldEnableLayeredSineWaves ? 0.2 + (speed * 0.3) : 0.5,
      opacity: shouldEnableLayeredSineWaves ? 0.3 + (visualCharacteristics.harmony * 0.4) : 0.5,
      lineWidth: shouldEnableLayeredSineWaves ? 0.4 + (visualCharacteristics.turbulence * 0.3) : 0.6,
      size: shouldEnableLayeredSineWaves ? 0.8 + (visualCharacteristics.harmony * 0.4) : 1.0,
      width: shouldEnableLayeredSineWaves ? 80 + (density * 40) : 100,
      height: shouldEnableLayeredSineWaves ? 80 + (density * 40) : 100,
      edgeFade: {
        enabled: true,
        fadeStart: 0.3,
        fadeEnd: 0.5
      }
    }
  });
  
  // Update layered sine waves color in geometric
  if (shouldEnableLayeredSineWaves) {
    visualStore.updateGeometric('layeredSineWaves', {
      color: isCalm ? '#323232' : '#666666'
    });
  }
  
  // 6. Apply post-processing effects
  visualStore.updateEffects({
    ...globalDefaults.visual,
    // AI can override specific properties while keeping global defaults for others
    saturation: 0.5 + (saturation * 1.5), // 0.5-2.0 range
    contrast: 0.8 + (energy * 0.4), // 0.8-1.2 range
    brightness: 0.8 + (visualCharacteristics.brightness * 0.4), // 0.8-1.2 range
    glow: energy * 0.6,
    vignette: isCalm ? 0.3 : 0.1
  });
  
  // 7. Apply weather effects if available
  if (weatherData) {
    applyWeatherEffectsToVisualStore(weatherData, visualCharacteristics);
  }
  
  // 8. Apply camera adjustments based on atmosphere
  const cameraDistance = isCalm ? 15 : isEnergetic ? 8 : 12;
  const cameraFOV = isChaotic ? 75 : isCalm ? 45 : 60;
  
  visualStore.updateCamera({
    ...globalDefaults.camera,
    // AI can override specific camera properties while keeping global defaults for others
    distance: cameraDistance,
    fov: cameraFOV
  });
  
  console.log('✅ AI analysis successfully applied to visual store');
  console.log('🎭 Special effects enabled:', {
    waveInterference: shouldEnableWaveInterference,
    metamorphosis: shouldEnableMetamorphosis,
    fireflies: shouldEnableFireflies,
    layeredSineWaves: shouldEnableLayeredSineWaves
  });
  
  // Update artistic layout for proper layering
  updateArtisticLayoutForSpecialEffects({
    waveInterference: shouldEnableWaveInterference,
    metamorphosis: shouldEnableMetamorphosis,
    fireflies: shouldEnableFireflies
  });
};

// NEW: Weather effects integration
export const applyWeatherEffectsToVisualStore = (weatherData: WeatherData, baseCharacteristics: VisualCharacteristics) => {
  const visualStore = useVisualStore.getState();
  const globalDefaults = visualStore.getGlobalDefaults();
  
  console.log('🌤️ Applying weather effects to visual store:', weatherData);
  
  const { temperature, condition, windSpeed, humidity, timeOfDay } = weatherData;
  
  // Temperature effects
  const tempEffect = (temperature - 32) / 100; // Normalize to -1 to 1 range
  const isHot = temperature > 80;
  const isCold = temperature < 40;
  
  // Wind effects
  const windEffect = Math.min(windSpeed / 30, 1); // Normalize to 0-1
  
  // Time of day effects
  const timeEffects = {
    dawn: { brightness: 0.7, saturation: 0.8, warmth: 0.6 },
    day: { brightness: 1.0, saturation: 1.0, warmth: 1.0 },
    dusk: { brightness: 0.6, saturation: 1.2, warmth: 0.8 },
    night: { brightness: 0.3, saturation: 0.6, warmth: 0.4 }
  };
  
  const currentTimeEffect = timeEffects[timeOfDay];
  
  // Apply weather-based adjustments
  visualStore.updateEffects({
    brightness: currentTimeEffect.brightness,
    saturation: currentTimeEffect.saturation * (1 + (humidity - 50) / 100)
  });
  
  // Wind affects particle behavior
  visualStore.updateGlobalEffects({
    particleInteraction: {
      enabled: true,
      magnetism: baseCharacteristics.energy * 0.3,
      repulsion: windEffect * 0.4,
      flowField: true,
      turbulence: baseCharacteristics.turbulence + (windEffect * 0.3)
    }
  });
  
  // Temperature affects color temperature
  if (isHot) {
    visualStore.updateEffects({
      hue: 15, // Warm tint
      saturation: 1.1
    });
  } else if (isCold) {
    visualStore.updateEffects({
      hue: -15, // Cool tint
      saturation: 0.9
    });
  }
  
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
      // Enable metamorphosis for stormy weather
      visualStore.updateGlobalEffects({
        metamorphosis: {
          enabled: true,
          morphSpeed: 0.8,
          rotationSpeed: 1.2,
          wireframeOpacity: 0.6,
          size: 1.2,
          blur: 0.2
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
      
      // Update artistic layout for metamorphosis
      updateArtisticLayoutForSpecialEffects({
        metamorphosis: true
      });
      break;
      
    case 'snow':
      // Enable fireflies for snowy weather (like snowflakes)
      visualStore.updateGlobalEffects({
        fireflies: {
          enabled: true,
          count: 200,
          speed: 0.3,
          glowIntensity: 0.8,
          swarmRadius: 30
        },
        volumetric: {
          enabled: true,
          fog: 0.5,
          lightShafts: 0.2,
          density: 0.3,
          color: '#FFFFFF'
        },
        particleInteraction: {
          enabled: true,
          magnetism: 0.1,
          repulsion: 0.8,
          flowField: false,
          turbulence: 0.2
        }
      });
      
      // Update artistic layout for fireflies
      updateArtisticLayoutForSpecialEffects({
        fireflies: true
      });
      break;
      
    case 'fog':
    case 'mist':
      // Enable wave interference for foggy weather
      visualStore.updateGlobalEffects({
        waveInterference: {
          enabled: true,
          speed: 0.2,
          amplitude: 0.4,
          contourLevels: 8,
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
      
      // Update artistic layout for wave interference
      updateArtisticLayoutForSpecialEffects({
        waveInterference: true
      });
      break;
      
    case 'clear':
    case 'sunny':
      // Enable fireflies for clear night skies
      if (timeOfDay === 'night') {
        visualStore.updateGlobalEffects({
          fireflies: {
            enabled: true,
            count: 150,
            speed: 0.4,
            glowIntensity: 0.6,
            swarmRadius: 25
          }
        });
        
        // Update artistic layout for fireflies
        updateArtisticLayoutForSpecialEffects({
          fireflies: true
        });
      }
      break;
  }
  
  console.log('✅ Weather effects applied to visual store');
};

// NEW: Real-time integration system
export const initializeAIVisualIntegration = () => {
  console.log('🚀 Initializing AI-Visual integration system...');
  
  // Subscribe to AI results and automatically apply them
  const unsubscribeAIResults = subscribeToAIResults((results) => {
    if (results) {
      console.log('🎯 New AI results received, applying to visual store...');
      applyAIAnalysisToVisualStore(results);
    }
  });
  
  // Subscribe to weather data updates
  const unsubscribeWeather = subscribeToWeatherData((weatherData) => {
    if (weatherData) {
      const aiState = getAIState();
      if (aiState.aiResults) {
        console.log('🌤️ Weather data updated, applying weather effects...');
        applyWeatherEffectsToVisualStore(weatherData, aiState.aiResults.visualCharacteristics);
      }
    }
  });
  
  // Subscribe to parameter updates for manual overrides
  const unsubscribeParameters = subscribeToParameterUpdates((updates) => {
    if (updates.length > 0) {
      console.log('⚙️ Parameter updates received, applying to visual store...');
      applyParameterUpdatesToVisualStore(updates);
    }
  });
  
  // Return cleanup function
  return () => {
    unsubscribeAIResults();
    unsubscribeWeather();
    unsubscribeParameters();
    console.log('🛑 AI-Visual integration system cleaned up');
  };
};

// NEW: Utility function to manually enable special effects for testing
export const enableSpecialEffects = (effects: {
  waveInterference?: boolean;
  metamorphosis?: boolean;
  fireflies?: boolean;
  layeredSineWaves?: boolean;
}) => {
  const visualStore = useVisualStore.getState();
  
  console.log('🎭 Manually enabling special effects:', effects);
  
  if (effects.waveInterference !== undefined) {
    visualStore.updateGlobalEffects({
      waveInterference: {
        enabled: effects.waveInterference,
        speed: effects.waveInterference ? 0.5 : 0.5,
        amplitude: effects.waveInterference ? 0.5 : 0.5,
        contourLevels: effects.waveInterference ? 5 : 5,
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
        morphSpeed: effects.metamorphosis ? 0.5 : 0.5,
        rotationSpeed: effects.metamorphosis ? 0.5 : 0.5,
        wireframeOpacity: effects.metamorphosis ? 0.5 : 0.5,
        size: effects.metamorphosis ? 1.0 : 1.0,
        blur: effects.metamorphosis ? 0.0 : 0.0
      }
    });
  }
  
  if (effects.fireflies !== undefined) {
    visualStore.updateGlobalEffects({
      fireflies: {
        enabled: effects.fireflies,
        count: effects.fireflies ? 100 : 100,
        speed: effects.fireflies ? 0.5 : 0.5,
        glowIntensity: effects.fireflies ? 0.5 : 0.5,
        swarmRadius: effects.fireflies ? 20 : 20
      }
    });
  }
  
  if (effects.layeredSineWaves !== undefined) {
    visualStore.updateGlobalEffects({
      layeredSineWaves: {
        enabled: effects.layeredSineWaves,
        layers: effects.layeredSineWaves ? 80 : 80,
        points: effects.layeredSineWaves ? 200 : 200,
        waveAmplitude: effects.layeredSineWaves ? 40 : 40,
        speed: effects.layeredSineWaves ? 0.5 : 0.5,
        opacity: effects.layeredSineWaves ? 0.5 : 0.5,
        lineWidth: effects.layeredSineWaves ? 0.6 : 0.6,
        size: effects.layeredSineWaves ? 1.0 : 1.0,
        width: effects.layeredSineWaves ? 100 : 100,
        height: effects.layeredSineWaves ? 100 : 100,
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
  
  console.log('✅ Special effects manually updated');
};

// NEW: Function to update artistic layout for special effects
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
  
  console.log('🎨 Artistic layout updated for special effects');
};

// NEW: AI-to-Visual mapping function that respects global defaults
export const applyAIAnalysisToVisualStoreWithDefaults = (analysis: ThemeAnalysis, weatherData?: WeatherData) => {
  const visualStore = useVisualStore.getState();
  const { colorPalette, visualCharacteristics, mood, atmosphere } = analysis;
  const globalDefaults = visualStore.getGlobalDefaults();
  
  console.log('🎨 Applying AI analysis to visual store (with global defaults protection):', { analysis, weatherData });
  
  // 1. Apply color palette (AI can control colors)
  const primaryColor = colorPalette.primary;
  const secondaryColor = colorPalette.secondary;
  const accentColor = colorPalette.accent;
  
  // Update background with primary color
  visualStore.updateBackground({
    color: primaryColor,
    opacity: 0.3 + (visualCharacteristics.brightness * 0.4) // 0.3-0.7 range
  });
  
  // 2. Apply visual characteristics to geometric shapes (AI can control shapes)
  const energy = visualCharacteristics.energy;
  const speed = visualCharacteristics.speed;
  const density = visualCharacteristics.density;
  const saturation = visualCharacteristics.saturation;
  const turbulence = visualCharacteristics.turbulence;
  
  // Update spheres with energy and speed
  visualStore.updateGeometric('spheres', {
    color: secondaryColor,
    speed: speed * 2, // Scale 0-2 to 0-4
    opacity: 0.4 + (energy * 0.4), // 0.4-0.8 range
    count: Math.floor(10 + (density * 20)) // 10-30 range
  });
  
  // Update cubes with harmony and energy
  visualStore.updateGeometric('cubes', {
    color: accentColor,
    rotation: speed * 0.5,
    opacity: 0.3 + (energy * 0.5),
    count: Math.floor(5 + (density * 15))
  });
  
  // 3. Apply to particles (AI can control particles)
  visualStore.updateParticles({
    color: accentColor,
    speed: speed * 1.2,
    opacity: 0.6 + (energy * 0.3),
    count: Math.floor(50 + (density * 100)),
    size: 0.05 + (energy * 0.15)
  });
  
  // 4. Apply global effects based on mood and characteristics (AI can control effects)
  const isEnergetic = mood.some(m => ['energetic', 'dynamic', 'vibrant', 'intense'].includes(m.toLowerCase()));
  const isCalm = mood.some(m => ['calm', 'peaceful', 'serene', 'gentle'].includes(m.toLowerCase()));
  const isChaotic = mood.some(m => ['chaotic', 'wild', 'turbulent', 'explosive'].includes(m.toLowerCase()));
  const isOrganic = mood.some(m => ['organic', 'natural', 'biomass', 'living', 'growth'].includes(m.toLowerCase()));
  const isMagical = mood.some(m => ['magical', 'mystical', 'ethereal', 'dreamy', 'fantasy'].includes(m.toLowerCase()));
  
  // Atmospheric blur based on harmony
  visualStore.updateGlobalEffects({
    atmosphericBlur: {
      enabled: true,
      intensity: 0.1 + (visualCharacteristics.harmony * 0.3),
      layers: Math.floor(2 + (visualCharacteristics.harmony * 3))
    }
  });
  
  // Color blending based on saturation
  visualStore.updateGlobalEffects({
    colorBlending: {
      enabled: true,
      mode: saturation > 0.7 ? 'screen' : saturation > 0.4 ? 'overlay' : 'soft-light',
      intensity: saturation * 0.8
    }
  });
  
  // Shape glow based on energy
  visualStore.updateGlobalEffects({
    shapeGlow: {
      enabled: energy > 0.3,
      intensity: energy * 0.6,
      radius: 2 + (energy * 3),
      useObjectColor: true,
      customColor: '#ffffff',
      pulsing: isEnergetic,
      pulseSpeed: speed * 0.5
    }
  });
  
  // Distortion based on turbulence
  visualStore.updateGlobalEffects({
    distortion: {
      enabled: turbulence > 0.2,
      wave: turbulence * 0.3,
      ripple: turbulence * 0.2,
      noise: turbulence * 0.1,
      frequency: 0.5 + (turbulence * 1.5)
    }
  });
  
  // Particle interaction based on energy
  visualStore.updateGlobalEffects({
    particleInteraction: {
      enabled: energy > 0.4,
      magnetism: energy * 0.4,
      repulsion: (1 - energy) * 0.3,
      flowField: true,
      turbulence: turbulence * 0.5
    }
  });
  
  // 5. ENABLE AND CONFIGURE SPECIAL EFFECTS BASED ON MOOD AND CHARACTERISTICS
  
  // Wave Interference - Enable for organic/magical themes or high harmony
  const shouldEnableWaveInterference = isOrganic || isMagical || visualCharacteristics.harmony > 0.6;
  visualStore.updateGlobalEffects({
    waveInterference: {
      enabled: shouldEnableWaveInterference,
      speed: shouldEnableWaveInterference ? 0.3 + (speed * 0.4) : 0.5,
      amplitude: shouldEnableWaveInterference ? 0.3 + (energy * 0.4) : 0.5,
      contourLevels: shouldEnableWaveInterference ? Math.floor(3 + (density * 4)) : 5,
      edgeFade: {
        enabled: true,
        fadeStart: 0.3,
        fadeEnd: 0.5
      }
    }
  });
  
  // Update wave interference color in geometric
  if (shouldEnableWaveInterference) {
    visualStore.updateGeometric('waveInterference', {
      color: isOrganic ? '#00ff88' : isMagical ? '#ff00ff' : secondaryColor
    });
  }
  
  // Metamorphosis - Enable for chaotic/energetic themes or high turbulence
  const shouldEnableMetamorphosis = isChaotic || isEnergetic || turbulence > 0.5;
  visualStore.updateGlobalEffects({
    metamorphosis: {
      enabled: shouldEnableMetamorphosis,
      morphSpeed: shouldEnableMetamorphosis ? 0.3 + (speed * 0.6) : 0.5,
      rotationSpeed: shouldEnableMetamorphosis ? 0.4 + (energy * 0.8) : 0.5,
      wireframeOpacity: shouldEnableMetamorphosis ? 0.3 + (turbulence * 0.4) : 0.5,
      size: shouldEnableMetamorphosis ? 0.8 + (density * 0.4) : 1.0,
      blur: shouldEnableMetamorphosis ? turbulence * 0.3 : 0.0
    }
  });
  
  // Update metamorphosis color in geometric
  if (shouldEnableMetamorphosis) {
    visualStore.updateGeometric('metamorphosis', {
      color: isChaotic ? '#ff4444' : isEnergetic ? '#ffaa00' : accentColor
    });
  }
  
  // Fireflies - Enable for magical/calm themes or moderate energy
  const shouldEnableFireflies = isMagical || isCalm || (energy > 0.3 && energy < 0.8);
  visualStore.updateGlobalEffects({
    fireflies: {
      enabled: shouldEnableFireflies,
      count: shouldEnableFireflies ? Math.floor(50 + (density * 100)) : 100,
      speed: shouldEnableFireflies ? 0.3 + (speed * 0.4) : 0.5,
      glowIntensity: shouldEnableFireflies ? 0.4 + (energy * 0.4) : 0.5,
      swarmRadius: shouldEnableFireflies ? 15 + (turbulence * 10) : 20
    }
  });
  
  // Update fireflies color in geometric
  if (shouldEnableFireflies) {
    visualStore.updateGeometric('fireflies', {
      color: isMagical ? '#ffff00' : isCalm ? '#00ffff' : accentColor
    });
  }
  
  // Layered Sine Waves - Enable for calm/zen themes or high harmony
  const shouldEnableLayeredSineWaves = isCalm || visualCharacteristics.harmony > 0.7;
  visualStore.updateGlobalEffects({
    layeredSineWaves: {
      enabled: shouldEnableLayeredSineWaves,
      layers: shouldEnableLayeredSineWaves ? Math.floor(60 + (density * 40)) : 80,
      points: shouldEnableLayeredSineWaves ? Math.floor(150 + (density * 100)) : 200,
      waveAmplitude: shouldEnableLayeredSineWaves ? 30 + (energy * 20) : 40,
      speed: shouldEnableLayeredSineWaves ? 0.2 + (speed * 0.3) : 0.5,
      opacity: shouldEnableLayeredSineWaves ? 0.3 + (visualCharacteristics.harmony * 0.4) : 0.5,
      lineWidth: shouldEnableLayeredSineWaves ? 0.4 + (visualCharacteristics.turbulence * 0.3) : 0.6,
      size: shouldEnableLayeredSineWaves ? 0.8 + (visualCharacteristics.harmony * 0.4) : 1.0,
      width: shouldEnableLayeredSineWaves ? 80 + (density * 40) : 100,
      height: shouldEnableLayeredSineWaves ? 80 + (density * 40) : 100,
      edgeFade: {
        enabled: true,
        fadeStart: 0.3,
        fadeEnd: 0.5
      }
    }
  });
  
  // Update layered sine waves color in geometric
  if (shouldEnableLayeredSineWaves) {
    visualStore.updateGeometric('layeredSineWaves', {
      color: isCalm ? '#323232' : '#666666'
    });
  }
  
  // 6. Apply post-processing effects
  visualStore.updateEffects({
    ...globalDefaults.visual,
    // AI can override specific properties while keeping global defaults for others
    saturation: 0.5 + (saturation * 1.5), // 0.5-2.0 range
    contrast: 0.8 + (energy * 0.4), // 0.8-1.2 range
    brightness: 0.8 + (visualCharacteristics.brightness * 0.4), // 0.8-1.2 range
    glow: energy * 0.6,
    vignette: isCalm ? 0.3 : 0.1
  });
  
  // 7. Apply weather effects if available
  if (weatherData) {
    applyWeatherEffectsToVisualStoreWithDefaults(weatherData, visualCharacteristics);
  }
  
  // 8. Apply camera adjustments based on atmosphere
  const cameraDistance = isCalm ? 15 : isEnergetic ? 8 : 12;
  const cameraFOV = isChaotic ? 75 : isCalm ? 45 : 60;
  
  visualStore.updateCamera({
    ...globalDefaults.camera,
    // AI can override specific camera properties while keeping global defaults for others
    distance: cameraDistance,
    fov: cameraFOV
  });
  
  console.log('✅ AI analysis successfully applied to visual store (with global defaults protection)');
  console.log('🎭 Special effects enabled:', {
    waveInterference: shouldEnableWaveInterference,
    metamorphosis: shouldEnableMetamorphosis,
    fireflies: shouldEnableFireflies,
    layeredSineWaves: shouldEnableLayeredSineWaves
  });
  console.log('🛡️ Global defaults protected for camera and visual effects');
  
  // Update artistic layout for proper layering
  updateArtisticLayoutForSpecialEffects({
    waveInterference: shouldEnableWaveInterference,
    metamorphosis: shouldEnableMetamorphosis,
    fireflies: shouldEnableFireflies
  });
};

// NEW: Weather effects function that respects global defaults
export const applyWeatherEffectsToVisualStoreWithDefaults = (weatherData: WeatherData, baseCharacteristics: VisualCharacteristics) => {
  const visualStore = useVisualStore.getState();
  const globalDefaults = visualStore.getGlobalDefaults();
  
  console.log('🌤️ Applying weather effects (with global defaults protection):', weatherData);
  
  const { temperature, humidity, windSpeed, condition } = weatherData;
  
  // Temperature effects (AI can control temperature-based changes)
  const tempEffect = Math.max(0, Math.min(1, (temperature - 32) / 68)); // 32-100°F to 0-1
  
  // Wind effects (AI can control wind-based changes)
  const windEffect = Math.min(1, windSpeed / 30); // 0-30mph to 0-1
  
  // Humidity effects (AI can control humidity-based changes)
  const humidityEffect = humidity / 100; // 0-100% to 0-1
  
  // Apply temperature-based color shifts
  const tempHueShift = temperature > 70 ? 30 : temperature < 40 ? -30 : 0;
  const tempSaturation = temperature > 80 ? 1.2 : temperature < 50 ? 0.8 : 1.0;
  
  // Apply wind-based movement effects
  const windSpeedMultiplier = 1 + (windEffect * 0.5); // 1.0-1.5x
  const windTurbulence = windEffect * 0.8; // 0-0.8
  
 // Apply humidity-based atmospheric effects
  const humidityFog = humidityEffect * 0.6; // 0-0.6
  const humidityBlur = humidityEffect * 0.4; // 0-0.4
  
  // Update particles with weather effects
  visualStore.updateParticles({
    speed: baseCharacteristics.speed * windSpeedMultiplier,
    spread: 1 + (windEffect * 0.5)
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
      // Enable metamorphosis for stormy weather
      visualStore.updateGlobalEffects({
        metamorphosis: {
          enabled: true,
          morphSpeed: 0.8,
          rotationSpeed: 1.2,
          wireframeOpacity: 0.6,
          size: 1.2,
          blur: 0.2
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
      
      // Update artistic layout for metamorphosis
      updateArtisticLayoutForSpecialEffects({
        metamorphosis: true
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
  
  // CRITICAL: Apply weather-based visual effects BUT RESPECT GLOBAL DEFAULTS
  const weatherVisualEffects = {
    saturation: tempSaturation,
    brightness: temperature > 80 ? 1.2 : temperature < 40 ? 0.8 : 1.0,
    contrast: humidityEffect > 0.7 ? 0.9 : 1.1
  };
  
  // Apply weather effects but ensure global defaults are respected
  visualStore.updateEffects({
    ...weatherVisualEffects,
    // Ensure global defaults are applied for critical visual parameters
    ...globalDefaults.visual
  });
  
  console.log('✅ Weather effects applied (with global defaults protection)');
  console.log('🛡️ Global defaults protected for visual effects');
}; 