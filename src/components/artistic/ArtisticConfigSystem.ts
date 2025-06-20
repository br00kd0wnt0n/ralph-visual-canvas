import { 
  ArtisticCanvasConfig, 
  PaintingBehavior, 
  BlendMode,
  WeatherData,
  AIData
} from '../../types/artistic';

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
        stampSize: 12,
        stampShape: 'star',
        stampInterval: 30,
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
      particles: {
        enabled: true,
        type: 'splatter',
        brushSize: 3,
        opacity: 0.3,
        color: 'rainbow',
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
    },
    overlayEffects: {
      textureOverlay: {
        enabled: true,
        layers: [
          {
            texture: 'watercolor',
            opacity: 0.1,
            blendMode: 'overlay',
            scale: 1.5,
            movement: { x: 0.1, y: 0.05 }
          },
          {
            texture: 'noise',
            opacity: 0.08,
            blendMode: 'soft-light',
            scale: 3,
            movement: { x: -0.05, y: 0.02 }
          }
        ]
      },
      blendingLayer: {
        enabled: true,
        globalBlendMode: 'screen',
        colorGrading: {
          saturation: 1.3,
          contrast: 1.2,
          brightness: 1.1,
          temperature: 0.1,
          tint: 0.05,
        },
        cohesionBlur: 0.3,
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
        connectionLines: { enabled: true, maxDistance: 40, opacity: 0.2, thickness: 2, color: 'temperature' },
        fieldEffects: { enabled: true, strength: 0.2, range: 25, visualizeField: false },
        ambientGlow: { enabled: true, intensity: 0.3, radius: 80, color: 'auto' },
      },
    },
  } as ArtisticCanvasConfig,

  // Minimal, zen-like aesthetic
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
      activeBlendMode: 'normal' as BlendMode,
    },
    objectBehaviors: {
      spheres: {
        enabled: true,
        type: 'brush',
        brushSize: 8,
        opacity: 0.15,
        color: 'object',
        brushTexture: 'soft',
        pressure: 0.5,
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
        brushSize: 6,
        opacity: 0.2,
        color: 'object',
        trailLength: 20,
        trailWidth: 2,
        trailFade: 0.9,
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
      blobs: {
        enabled: false,
        type: 'glow',
        brushSize: 15,
        opacity: 0.1,
        color: 'temperature',
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
      ribbons: {
        enabled: false,
        type: 'trail',
        brushSize: 3,
        opacity: 0.25,
        color: 'object',
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
      crystals: {
        enabled: true,
        type: 'ripple',
        brushSize: 5,
        opacity: 0.15,
        color: 'object',
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
      particles: {
        enabled: false,
        type: 'brush',
        brushSize: 1,
        opacity: 0.05,
        color: 'object',
        interactions: { withOtherObjects: false }
      } as PaintingBehavior,
    },
    overlayEffects: {
      textureOverlay: {
        enabled: true,
        layers: [
          {
            texture: 'paper',
            opacity: 0.03,
            blendMode: 'multiply',
            scale: 1,
            movement: { x: 0, y: 0 }
          }
        ]
      },
      blendingLayer: {
        enabled: true,
        globalBlendMode: 'normal',
        colorGrading: {
          saturation: 0.9,
          contrast: 1.0,
          brightness: 1.0,
          temperature: -0.1,
          tint: 0,
        },
        cohesionBlur: 0.8,
      },
      paintingTrails: {
        enabled: true,
        maxTrails: 50,
        trailQuality: 'low',
        velocityInfluence: 0.2,
        temperatureMapping: false,
      },
      cohesionEffects: {
        enabled: false,
        connectionLines: { enabled: false, maxDistance: 30, opacity: 0.05, thickness: 1, color: 'auto' },
        fieldEffects: { enabled: false, strength: 0.05, range: 20, visualizeField: false },
        ambientGlow: { enabled: false, intensity: 0.1, radius: 50, color: 'auto' },
      },
    },
  } as ArtisticCanvasConfig,
};

// Configuration builder with fluent API
export class ArtisticConfigBuilder {
  private config: ArtisticCanvasConfig;

  constructor(basePreset?: keyof typeof ArtisticPresets) {
    if (basePreset && ArtisticPresets[basePreset]) {
      this.config = JSON.parse(JSON.stringify(ArtisticPresets[basePreset]));
    } else {
      this.config = JSON.parse(JSON.stringify(ArtisticPresets.subtle_flow));
    }
  }

  setAquariumView(distance: number = 25, fov: number = 50) {
    this.config.cameraConstraint.position = [0, 0, distance];
    this.config.cameraConstraint.fov = fov;
    return this;
  }

  setPaintingResolution(width: number, height: number) {
    this.config.paintingSystem.canvasResolution = [width, height];
    return this;
  }

  setFadeRate(rate: number) {
    this.config.paintingSystem.fadeRate = Math.max(0, Math.min(1, rate));
    return this;
  }

  setBlendMode(mode: BlendMode) {
    this.config.paintingSystem.activeBlendMode = mode;
    if (!this.config.paintingSystem.blendModes.includes(mode)) {
      this.config.paintingSystem.blendModes.push(mode);
    }
    return this;
  }

  setObjectBehavior(objectType: keyof ArtisticCanvasConfig['objectBehaviors'], behavior: Partial<PaintingBehavior>) {
    this.config.objectBehaviors[objectType] = {
      ...this.config.objectBehaviors[objectType],
      ...behavior
    };
    return this;
  }

  enableTrails(objectTypes: (keyof ArtisticCanvasConfig['objectBehaviors'])[], trailConfig?: Partial<PaintingBehavior>) {
    const defaultTrailConfig: Partial<PaintingBehavior> = {
      type: 'trail',
      trailLength: 30,
      trailWidth: 3,
      trailFade: 0.95,
      ...trailConfig
    };

    objectTypes.forEach(type => {
      this.setObjectBehavior(type, defaultTrailConfig);
    });
    return this;
  }

  enableGlow(objectTypes: (keyof ArtisticCanvasConfig['objectBehaviors'])[], glowConfig?: Partial<PaintingBehavior>) {
    const defaultGlowConfig: Partial<PaintingBehavior> = {
      type: 'glow',
      glowIntensity: 1,
      glowRadius: 20,
      ...glowConfig
    };

    objectTypes.forEach(type => {
      this.setObjectBehavior(type, defaultGlowConfig);
    });
    return this;
  }

  addTextureLayer(texture: 'noise' | 'grain' | 'watercolor' | 'canvas' | 'paper', config: {
    opacity?: number;
    blendMode?: BlendMode;
    scale?: number;
    movement?: { x: number; y: number };
  } = {}) {
    const layer = {
      texture,
      opacity: config.opacity || 0.1,
      blendMode: config.blendMode || 'overlay',
      scale: config.scale || 1,
      movement: config.movement || { x: 0, y: 0 }
    };

    this.config.overlayEffects.textureOverlay.layers.push(layer);
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
    this.config.overlayEffects.cohesionEffects.enabled = true;
    if (config) {
      this.config.overlayEffects.cohesionEffects = {
        ...this.config.overlayEffects.cohesionEffects,
        ...config
      };
    }
    return this;
  }

  makeWeatherResponsive() {
    // Add weather-responsive behaviors
    this.setObjectBehavior('blobs', { color: 'temperature' });
    this.setObjectBehavior('toruses', { color: 'temperature' });
    this.config.overlayEffects.paintingTrails.temperatureMapping = true;
    this.config.overlayEffects.cohesionEffects.connectionLines.color = 'temperature';
    this.config.overlayEffects.cohesionEffects.ambientGlow.color = 'temperature';
    return this;
  }

  makeAIResponsive() {
    // Add AI-responsive behaviors
    this.setObjectBehavior('spheres', { color: 'rainbow' });
    this.setObjectBehavior('particles', { color: 'rainbow' });
    this.config.overlayEffects.cohesionEffects.connectionLines.color = 'auto';
    this.config.overlayEffects.cohesionEffects.ambientGlow.color = 'auto';
    return this;
  }

  optimizeForPerformance() {
    // Reduce complexity for better performance
    this.config.paintingSystem.canvasResolution = [1280, 720];
    this.config.paintingSystem.fadeRate = 0.03;
    this.config.overlayEffects.paintingTrails.maxTrails = 50;
    this.config.overlayEffects.paintingTrails.trailQuality = 'low';
    this.config.overlayEffects.cohesionEffects.enabled = false;
    return this;
  }

  optimizeForQuality() {
    // Increase quality settings
    this.config.paintingSystem.canvasResolution = [2560, 1440];
    this.config.paintingSystem.fadeRate = 0.005;
    this.config.overlayEffects.paintingTrails.maxTrails = 300;
    this.config.overlayEffects.paintingTrails.trailQuality = 'high';
    this.config.overlayEffects.cohesionEffects.enabled = true;
    return this;
  }

  build(): ArtisticCanvasConfig {
    return this.config;
  }

  export(): string {
    return JSON.stringify(this.config, null, 2);
  }

  import(configJson: string): ArtisticConfigBuilder {
    try {
      this.config = JSON.parse(configJson);
    } catch (error) {
      console.error('Failed to import config:', error);
    }
    return this;
  }
}

// Parameter integration for AI and weather data
export class ParameterIntegration {
  static mapAIToArtistic(
    aiResults: AIData,
    baseConfig: ArtisticCanvasConfig
  ): ArtisticCanvasConfig {
    const config = JSON.parse(JSON.stringify(baseConfig));

    // Map AI theme to color palette
    if (aiResults.theme === 'energetic') {
      config.paintingSystem.activeBlendMode = 'screen';
      config.overlayEffects.blendingLayer.colorGrading.saturation = 1.4;
      config.overlayEffects.blendingLayer.colorGrading.contrast = 1.3;
    } else if (aiResults.theme === 'calm') {
      config.paintingSystem.activeBlendMode = 'soft-light';
      config.overlayEffects.blendingLayer.colorGrading.saturation = 0.8;
      config.overlayEffects.blendingLayer.colorGrading.contrast = 0.9;
    }

    // Map complexity to object behaviors
    const complexity = Math.max(0, Math.min(1, aiResults.complexity));
    config.objectBehaviors.spheres.opacity *= (0.5 + complexity * 0.5);
    config.objectBehaviors.cubes.opacity *= (0.5 + complexity * 0.5);
    config.objectBehaviors.toruses.opacity *= (0.5 + complexity * 0.5);

    // Map energy to painting intensity
    const energy = Math.max(0, Math.min(1, aiResults.energy));
    config.paintingSystem.fadeRate *= (1 - energy * 0.5);
    config.overlayEffects.paintingTrails.velocityInfluence *= (1 + energy * 0.5);

    return config;
  }

  static mapWeatherToArtistic(
    weatherData: WeatherData,
    baseConfig: ArtisticCanvasConfig
  ): ArtisticCanvasConfig {
    const config = JSON.parse(JSON.stringify(baseConfig));

    // Map temperature to color grading
    const tempNormalized = Math.max(-20, Math.min(40, weatherData.temperature));
    const tempFactor = (tempNormalized + 20) / 60; // 0 to 1
    
    config.overlayEffects.blendingLayer.colorGrading.temperature = (tempFactor - 0.5) * 2; // -1 to 1

    // Map humidity to opacity
    const humidity = Math.max(0, Math.min(100, weatherData.humidity));
    const humidityFactor = humidity / 100;
    
    config.objectBehaviors.spheres.opacity *= (0.7 + humidityFactor * 0.6);
    config.objectBehaviors.blobs.opacity *= (0.7 + humidityFactor * 0.6);

    // Map wind speed to movement
    const windSpeed = Math.max(0, Math.min(50, weatherData.windSpeed));
    const windFactor = windSpeed / 50;
    
    config.overlayEffects.textureOverlay.layers.forEach((layer: any) => {
      layer.movement.x = windFactor * 0.2;
      layer.movement.y = windFactor * 0.1;
    });

    // Map visibility to fade rate
    const visibility = Math.max(0, Math.min(10, weatherData.visibility));
    const visibilityFactor = visibility / 10;
    
    config.paintingSystem.fadeRate *= (1 - visibilityFactor * 0.5);

    return config;
  }

  static createDynamicUpdater(
    updateCallback: (config: ArtisticCanvasConfig) => void
  ) {
    return {
      updateFromAI: (aiData: AIData, baseConfig: ArtisticCanvasConfig) => {
        const newConfig = this.mapAIToArtistic(aiData, baseConfig);
        updateCallback(newConfig);
      },
      updateFromWeather: (weatherData: WeatherData, baseConfig: ArtisticCanvasConfig) => {
        const newConfig = this.mapWeatherToArtistic(weatherData, baseConfig);
        updateCallback(newConfig);
      }
    };
  }
} 