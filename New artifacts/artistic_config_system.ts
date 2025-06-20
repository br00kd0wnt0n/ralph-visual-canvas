// ArtisticConfigSystem.ts - Configuration and presets for the artistic canvas

import { ArtisticCanvasConfig, PaintingBehavior, BlendMode } from './ArtisticCanvasSystem';

// Preset configurations for different artistic styles
export const ArtisticPresets = {
  // Calm, flowing background suitable for websites
  subtle_flow: {
    cameraConstraint: {
      enabled: true,
      position: [0, 0, 25] as [number, number, number],
      lookAt: [0, 0, 0] as [number, number, number],
      fov: 50,
      near: 1,
      far: 100,
    },
    paintingSystem: {
      enabled: true,
      canvasResolution: [1920, 1080] as [number, number],
      fadeRate: 0.02,
      blendModes: ['soft-light', 'overlay', 'screen'] as BlendMode[],
      activeBlendMode: 'soft-light' as BlendMode,
    },
    objectBehaviors: {
      spheres: {
        enabled: true,
        type: 'trail',
        brushSize: 15,
        opacity: 0.3,
        color: 'object',
        trailLength: 30,
        trailWidth: 3,
        trailFade: 0.95,
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
      cubes: {
        enabled: true,
        type: 'stamp',
        brushSize: 8,
        opacity: 0.2,
        color: 'object',
        stampSize: 6,
        stampShape: 'square',
        stampInterval: 60,
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
      toruses: {
        enabled: true,
        type: 'brush',
        brushSize: 12,
        opacity: 0.25,
        color: 'object',
        brushTexture: 'soft',
        pressure: 0.7,
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
      blobs: {
        enabled: true,
        type: 'glow',
        brushSize: 20,
        opacity: 0.15,
        color: 'temperature',
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
      ribbons: {
        enabled: false,
        type: 'trail',
        brushSize: 5,
        opacity: 0.4,
        color: 'rainbow',
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
      crystals: {
        enabled: true,
        type: 'ripple',
        brushSize: 10,
        opacity: 0.2,
        color: 'object',
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
      particles: {
        enabled: true,
        type: 'brush',
        brushSize: 2,
        opacity: 0.1,
        color: 'object',
        brushTexture: 'soft',
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
    },
    overlayEffects: {
      textureOverlay: {
        enabled: true,
        layers: [
          {
            texture: 'noise',
            opacity: 0.05,
            blendMode: 'overlay',
            scale: 2,
            movement: { x: 0, y: 0 }
          }
        ]
      },
      blendingLayer: {
        enabled: true,
        globalBlendMode: 'normal',
        colorGrading: {
          saturation: 1.1,
          contrast: 1.05,
          brightness: 1.0,
          temperature: 0,
          tint: 0,
        },
        cohesionBlur: 0.5,
      },
      paintingTrails: {
        enabled: true,
        maxTrails: 100,
        trailQuality: 'medium',
        velocityInfluence: 0.5,
        temperatureMapping: true,
      },
      cohesionEffects: {
        enabled: false,
        connectionLines: { enabled: false, maxDistance: 50, opacity: 0.1, thickness: 1, color: 'auto' },
        fieldEffects: { enabled: false, strength: 0.1, range: 30, visualizeField: false },
        ambientGlow: { enabled: false, intensity: 0.2, radius: 100, color: 'auto' },
      },
    },
  } as ArtisticCanvasConfig,

  // More energetic, artistic expression
  dynamic_painting: {
    cameraConstraint: {
      enabled: true,
      position: [0, 0, 30] as [number, number, number],
      lookAt: [0, 0, 0] as [number, number, number],
      fov: 60,
      near: 1,
      far: 100,
    },
    paintingSystem: {
      enabled: true,
      canvasResolution: [1920, 1080] as [number, number],
      fadeRate: 0.005,
      blendModes: ['screen', 'color-dodge', 'overlay'] as BlendMode[],
      activeBlendMode: 'screen' as BlendMode,
    },
    objectBehaviors: {
      spheres: {
        enabled: true,
        type: 'brush',
        brushSize: 25,
        opacity: 0.4,
        color: 'rainbow',
        brushTexture: 'watercolor',
        pressure: 1.0,
        interactions: { withOtherObjects: true, attractionRadius: 20 }
      } as PaintingBehavior,
      cubes: {
        enabled: true,
        type: 'splatter',
        brushSize: 15,
        opacity: 0.6,
        color: 'object',
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
      toruses: {
        enabled: true,
        type: 'trail',
        brushSize: 20,
        opacity: 0.5,
        color: 'temperature',
        trailLength: 50,
        trailWidth: 8,
        trailFade: 0.98,
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
      blobs: {
        enabled: true,
        type: 'glow',
        brushSize: 35,
        opacity: 0.3,
        color: 'rainbow',
        interactions: { withOtherObjects: true, attractionRadius: 30 }
      } as PaintingBehavior,
      ribbons: {
        enabled: true,
        type: 'trail',
        brushSize: 12,
        opacity: 0.7,
        color: 'rainbow',
        trailLength: 80,
        trailWidth: 6,
        trailFade: 0.99,
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
      crystals: {
        enabled: true,
        type: 'stamp',
        brushSize: 18,
        opacity: 0.4,
        color: 'object',
        stampSize: 15,
        stampShape: 'star',
        stampInterval: 30,
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
      particles: {
        enabled: true,
        type: 'brush',
        brushSize: 3,
        opacity: 0.2,
        color: 'rainbow',
        brushTexture: 'stipple',
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
    },
    overlayEffects: {
      textureOverlay: {
        enabled: true,
        layers: [
          {
            texture: 'watercolor',
            opacity: 0.15,
            blendMode: 'multiply',
            scale: 1.5,
            movement: { x: 1, y: 0.5 }
          },
          {
            texture: 'grain',
            opacity: 0.08,
            blendMode: 'overlay',
            scale: 3,
            movement: { x: 0, y: 0 }
          }
        ]
      },
      blendingLayer: {
        enabled: true,
        globalBlendMode: 'soft-light',
        colorGrading: {
          saturation: 1.3,
          contrast: 1.15,
          brightness: 1.1,
          temperature: 10,
          tint: -5,
        },
        cohesionBlur: 1.0,
      },
      paintingTrails: {
        enabled: true,
        maxTrails: 200,
        trailQuality: 'high',
        velocityInfluence: 0.8,
        temperatureMapping: true,
      },
      cohesionEffects: {
        enabled: true,
        connectionLines: { 
          enabled: true, 
          maxDistance: 80, 
          opacity: 0.15, 
          thickness: 2, 
          color: 'auto' 
        },
        fieldEffects: { 
          enabled: true, 
          strength: 0.3, 
          range: 50, 
          visualizeField: false 
        },
        ambientGlow: { 
          enabled: true, 
          intensity: 0.4, 
          radius: 120, 
          color: 'auto' 
        },
      },
    },
  } as ArtisticCanvasConfig,

  // Minimal, clean aesthetic
  minimal_zen: {
    cameraConstraint: {
      enabled: true,
      position: [0, 0, 20] as [number, number, number],
      lookAt: [0, 0, 0] as [number, number, number],
      fov: 45,
      near: 1,
      far: 100,
    },
    paintingSystem: {
      enabled: true,
      canvasResolution: [1920, 1080] as [number, number],
      fadeRate: 0.01,
      blendModes: ['normal', 'multiply', 'soft-light'] as BlendMode[],
      activeBlendMode: 'multiply' as BlendMode,
    },
    objectBehaviors: {
      spheres: {
        enabled: true,
        type: 'glow',
        brushSize: 30,
        opacity: 0.1,
        color: 'object',
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
      cubes: {
        enabled: false,
        type: 'stamp',
        brushSize: 5,
        opacity: 0.1,
        color: 'object',
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
      toruses: {
        enabled: true,
        type: 'trail',
        brushSize: 8,
        opacity: 0.15,
        color: 'object',
        trailLength: 60,
        trailWidth: 2,
        trailFade: 0.99,
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
      blobs: {
        enabled: false,
        type: 'brush',
        brushSize: 10,
        opacity: 0.1,
        color: 'object',
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
      ribbons: {
        enabled: false,
        type: 'trail',
        brushSize: 5,
        opacity: 0.2,
        color: 'object',
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
      crystals: {
        enabled: false,
        type: 'stamp',
        brushSize: 5,
        opacity: 0.1,
        color: 'object',
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
      particles: {
        enabled: true,
        type: 'brush',
        brushSize: 1,
        opacity: 0.05,
        color: 'object',
        brushTexture: 'soft',
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
    },
    overlayEffects: {
      textureOverlay: {
        enabled: false,
        layers: []
      },
      blendingLayer: {
        enabled: true,
        globalBlendMode: 'normal',
        colorGrading: {
          saturation: 0.8,
          contrast: 0.95,
          brightness: 1.0,
          temperature: 0,
          tint: 0,
        },
        cohesionBlur: 0.2,
      },
      paintingTrails: {
        enabled: true,
        maxTrails: 50,
        trailQuality: 'high',
        velocityInfluence: 0.3,
        temperatureMapping: false,
      },
      cohesionEffects: {
        enabled: false,
        connectionLines: { enabled: false, maxDistance: 30, opacity: 0.05, thickness: 1, color: 'auto' },
        fieldEffects: { enabled: false, strength: 0.1, range: 20, visualizeField: false },
        ambientGlow: { enabled: false, intensity: 0.1, radius: 80, color: 'auto' },
      },
    },
  } as ArtisticCanvasConfig,
};

// Configuration builder for easy customization
export class ArtisticConfigBuilder {
  private config: ArtisticCanvasConfig;

  constructor(basePreset?: keyof typeof ArtisticPresets) {
    this.config = basePreset ? 
      JSON.parse(JSON.stringify(ArtisticPresets[basePreset])) : 
      JSON.parse(JSON.stringify(ArtisticPresets.subtle_flow));
  }

  // Camera configuration
  setAquariumView(distance: number = 25, fov: number = 50) {
    this.config.cameraConstraint = {
      enabled: true,
      position: [0, 0, distance],
      lookAt: [0, 0, 0],
      fov,
      near: 1,
      far: distance * 4,
    };
    return this;
  }

  // Painting system configuration
  setPaintingResolution(width: number, height: number) {
    this.config.paintingSystem.canvasResolution = [width, height];
    return this;
  }

  setFadeRate(rate: number) {
    this.config.paintingSystem.fadeRate = Math.max(0.001, Math.min(0.1, rate));
    return this;
  }

  setBlendMode(mode: BlendMode) {
    this.config.paintingSystem.activeBlendMode = mode;
    return this;
  }

  // Object behavior configuration
  setObjectBehavior(objectType: keyof ArtisticCanvasConfig['objectBehaviors'], behavior: Partial<PaintingBehavior>) {
    this.config.objectBehaviors[objectType] = {
      ...this.config.objectBehaviors[objectType],
      ...behavior
    };
    return this;
  }

  enableTrails(objectTypes: (keyof ArtisticCanvasConfig['objectBehaviors'])[], trailConfig?: Partial<PaintingBehavior>) {
    objectTypes.forEach(type => {
      this.config.objectBehaviors[type] = {
        ...this.config.objectBehaviors[type],
        enabled: true,
        type: 'trail',
        trailLength: 40,
        trailWidth: 4,
        trailFade: 0.96,
        ...trailConfig
      };
    });
    return this;
  }

  enableGlow(objectTypes: (keyof ArtisticCanvasConfig['objectBehaviors'])[], glowConfig?: Partial<PaintingBehavior>) {
    objectTypes.forEach(type => {
      this.config.objectBehaviors[type] = {
        ...this.config.objectBehaviors[type],
        enabled: true,
        type: 'glow',
        brushSize: 25,
        opacity: 0.2,
        ...glowConfig
      };
    });
    return this;
  }

  // Overlay effects configuration
  addTextureLayer(texture: 'noise' | 'grain' | 'watercolor' | 'canvas' | 'paper', config: {
    opacity?: number;
    blendMode?: BlendMode;
    scale?: number;
    movement?: { x: number; y: number };
  } = {}) {
    this.config.overlayEffects.textureOverlay.enabled = true;
    this.config.overlayEffects.textureOverlay.layers.push({
      texture,
      opacity: config.opacity || 0.1,
      blendMode: config.blendMode || 'overlay',
      scale: config.scale || 1,
      movement: config.movement || { x: 0, y: 0 }
    });
    return this;
  }

  setColorGrading(grading: Partial<ArtisticCanvasConfig['overlayEffects']['blendingLayer']['colorGrading']>) {
    this.config.overlayEffects.blendingLayer.colorGrading = {
      ...this.config.overlayEffects.blendingLayer.colorGrading,
      ...grading
    };
    return this;
  }

  enableCohesionEffects(config?: Partial<ArtisticCanvasConfig['overlayEffects']['cohesionEffects']>) {
    this.config.overlayEffects.cohesionEffects = {
      ...this.config.overlayEffects.cohesionEffects,
      enabled: true,
      ...config
    };
    return this;
  }

  // Weather and AI responsiveness
  makeWeatherResponsive() {
    // Enable weather-responsive painting behaviors
    Object.keys(this.config.objectBehaviors).forEach(key => {
      const objectType = key as keyof ArtisticCanvasConfig['objectBehaviors'];
      this.config.objectBehaviors[objectType].color = 'temperature';
    });
    
    this.config.overlayEffects.paintingTrails.temperatureMapping = true;
    return this;
  }

  makeAIResponsive() {
    // Enable AI-responsive color and intensity
    Object.keys(this.config.objectBehaviors).forEach(key => {
      const objectType = key as keyof ArtisticCanvasConfig['objectBehaviors'];
      if (this.config.objectBehaviors[objectType].enabled) {
        this.config.objectBehaviors[objectType].interactions.withOtherObjects = true;
      }
    });
    return this;
  }

  // Performance optimization
  optimizeForPerformance() {
    // Reduce resolution and complexity for better performance
    this.config.paintingSystem.canvasResolution = [1280, 720];
    this.config.overlayEffects.paintingTrails.maxTrails = 50;
    this.config.overlayEffects.paintingTrails.trailQuality = 'low';
    
    // Disable expensive effects
    this.config.overlayEffects.cohesionEffects.enabled = false;
    this.config.overlayEffects.textureOverlay.layers = 
      this.config.overlayEffects.textureOverlay.layers.slice(0, 1);
    
    return this;
  }

  optimizeForQuality() {
    // Maximize visual quality
    this.config.paintingSystem.canvasResolution = [2560, 1440];
    this.config.overlayEffects.paintingTrails.maxTrails = 300;
    this.config.overlayEffects.paintingTrails.trailQuality = 'high';
    
    return this;
  }

  // Build final configuration
  build(): ArtisticCanvasConfig {
    return JSON.parse(JSON.stringify(this.config));
  }

  // Export/import configurations
  export(): string {
    return JSON.stringify(this.config, null, 2);
  }

  import(configJson: string): ArtisticConfigBuilder {
    try {
      this.config = JSON.parse(configJson);
    } catch (error) {
      console.error('Failed to import configuration:', error);
    }
    return this;
  }
}

// Integration helpers for connecting to existing parameter system
export class ParameterIntegration {
  static mapAIToArtistic(
    aiResults: any,
    baseConfig: ArtisticCanvasConfig
  ): ArtisticCanvasConfig {
    const config = JSON.parse(JSON.stringify(baseConfig));
    
    // Map AI color palette to object colors
    if (aiResults.colorPalette) {
      Object.keys(config.objectBehaviors).forEach(key => {
        const objectType = key as keyof ArtisticCanvasConfig['objectBehaviors'];
        if (config.objectBehaviors[objectType].color === 'object') {
          config.objectBehaviors[objectType].customColor = aiResults.colorPalette.primary;
        }
      });
    }

    // Map AI energy to painting intensity
    if (aiResults.visualCharacteristics?.energy) {
      const energyMultiplier = aiResults.visualCharacteristics.energy;
      Object.keys(config.objectBehaviors).forEach(key => {
        const objectType = key as keyof ArtisticCanvasConfig['objectBehaviors'];
        config.objectBehaviors[objectType].opacity *= (0.5 + energyMultiplier * 0.5);
        config.objectBehaviors[objectType].brushSize *= (0.7 + energyMultiplier * 0.6);
      });
    }

    // Map AI turbulence to trail behavior
    if (aiResults.visualCharacteristics?.turbulence) {
      const turbulence = aiResults.visualCharacteristics.turbulence;
      Object.keys(config.objectBehaviors).forEach(key => {
        const objectType = key as keyof ArtisticCanvasConfig['objectBehaviors'];
        if (config.objectBehaviors[objectType].type === 'trail') {
          config.objectBehaviors[objectType].trailLength = Math.round(20 + turbulence * 60);
          config.objectBehaviors[objectType].trailWidth = 2 + turbulence * 6;
        }
      });
    }

    return config;
  }

  static mapWeatherToArtistic(
    weatherData: any,
    baseConfig: ArtisticCanvasConfig
  ): ArtisticCanvasConfig {
    const config = JSON.parse(JSON.stringify(baseConfig));
    
    // Map weather condition to blend modes and effects
    if (weatherData.condition) {
      const condition = weatherData.condition.toLowerCase();
      
      if (condition.includes('rain') || condition.includes('storm')) {
        config.paintingSystem.activeBlendMode = 'multiply';
        config.overlayEffects.blendingLayer.colorGrading.saturation = 0.8;
        config.overlayEffects.cohesionEffects.connectionLines.enabled = true;
      } else if (condition.includes('sunny') || condition.includes('clear')) {
        config.paintingSystem.activeBlendMode = 'screen';
        config.overlayEffects.blendingLayer.colorGrading.brightness = 1.2;
      } else if (condition.includes('cloud')) {
        config.paintingSystem.activeBlendMode = 'soft-light';
        config.overlayEffects.blendingLayer.cohesionBlur = 2.0;
      }
    }

    // Map temperature to color warmth
    if (weatherData.temperature) {
      const temp = weatherData.temperature;
      const warmth = Math.max(-50, Math.min(50, (temp - 60) / 40 * 50));
      config.overlayEffects.blendingLayer.colorGrading.temperature = warmth;
    }

    // Map wind to motion and trails
    if (weatherData.windSpeed) {
      const windIntensity = Math.min(weatherData.windSpeed / 20, 2);
      Object.keys(config.objectBehaviors).forEach(key => {
        const objectType = key as keyof ArtisticCanvasConfig['objectBehaviors'];
        if (config.objectBehaviors[objectType].type === 'trail') {
          config.objectBehaviors[objectType].trailLength = Math.round(
            (config.objectBehaviors[objectType].trailLength || 30) * (1 + windIntensity)
          );
        }
      });
    }

    return config;
  }

  // Dynamic parameter updates that can be called in real-time
  static createDynamicUpdater(
    updateCallback: (config: ArtisticCanvasConfig) => void
  ) {
    return {
      updateFromAI: (aiResults: any, baseConfig: ArtisticCanvasConfig) => {
        const newConfig = ParameterIntegration.mapAIToArtistic(aiResults, baseConfig);
        updateCallback(newConfig);
      },
      
      updateFromWeather: (weatherData: any, baseConfig: ArtisticCanvasConfig) => {
        const newConfig = ParameterIntegration.mapWeatherToArtistic(weatherData, baseConfig);
        updateCallback(newConfig);
      },
      
      updateFromTime: (timeData: any, baseConfig: ArtisticCanvasConfig) => {
        // Implement time-based updates (day/night cycles, etc.)
        const config = JSON.parse(JSON.stringify(baseConfig));
        
        if (timeData.hour < 6 || timeData.hour > 20) {
          // Night mode - darker, more mysterious
          config.paintingSystem.activeBlendMode = 'multiply';
          config.overlayEffects.blendingLayer.colorGrading.brightness = 0.8;
          Object.keys(config.objectBehaviors).forEach(key => {
            const objectType = key as keyof ArtisticCanvasConfig['objectBehaviors'];
            config.objectBehaviors[objectType].opacity *= 0.7;
          });
        }
        
        updateCallback(config);
      }
    };
  }
}

// Export everything
export {
  ArtisticConfigBuilder,
  ParameterIntegration,
  type ArtisticCanvasConfig,
  type PaintingBehavior
};