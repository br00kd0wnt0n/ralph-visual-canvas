// AdvancedPresetGenerator.ts
// Advanced preset generation system leveraging enhanced AI components
// Generates 30 diverse, high-quality visual presets from image analysis

import { ContextAnalyzer } from './ContextAnalyzer';
import { ColorHarmonyEngine } from './ColorHarmonyEngine';
import { ParameterInterpolator } from './ParameterInterpolator';
import { getSafeIntegration } from '../utils/SafeIntegration';
import { ImageContext, EnhancedColorPalette } from '../types/ContextTypes';
import { 
  IMPROVED_PARAMETER_RANGES, 
  selectMovementPattern, 
  getEnabledFeatures,
  adjustForPerformance 
} from './ImprovedPresetParameters';
import { improvedColorPresetGenerator } from './ImprovedColorPresetGenerator';

// Core types for preset generation
export interface GeneratedPreset {
  id: string;
  name: string;
  strategy: GenerationStrategy;
  visualState: EnhancedVisualState;
  metadata: PresetMetadata;
  scores: PresetQualityScores;
  confidence: number;
}

export interface PresetMetadata {
  sourceContext: ImageContext;
  colorHarmony: EnhancedColorPalette;
  generationSeed: number;
  createdAt: Date;
  estimatedPerformance: PerformanceEstimate;
}

export interface PerformanceEstimate {
  fps: number;
  memoryUsage: number;
  complexity: number;
  renderTime: number;
}

export interface PresetQualityScores {
  colorHarmony: number;        // 0-100
  visualBalance: number;       // 0-100
  animationFlow: number;       // 0-100
  moodCoherence: number;       // 0-100
  creativity: number;          // 0-100
  performance: number;         // 0-100
  overall: number;             // weighted composite
}

export type GenerationStrategy = 
  | 'harmonic_emphasis'      // Focus on color harmony and balance
  | 'dynamic_movement'       // Emphasize animation and energy
  | 'atmospheric_mood'       // Environmental effects and atmosphere
  | 'geometric_balance'      // Shape relationships and composition
  | 'artistic_interpretation'; // Creative and experimental

// Enhanced visual state interface
export interface EnhancedVisualState {
  geometric: {
    spheres: GeometricShapeConfig;
    cubes: GeometricShapeConfig;
    toruses: GeometricShapeConfig;
    blobs: OrganicShapeConfig;
  };
  effects: {
    brightness: number;
    saturation: number;
    contrast: number;
    vignette: number;
    glow: number;
  };
  globalEffects: {
    atmosphericBlur?: {
      enabled: boolean;
      intensity: number;
      layers: number;
    };
    volumetric?: {
      enabled: boolean;
      fog: number;
      density: number;
      color: string;
    };
    distortion?: {
      enabled: boolean;
      wave: number;
      ripple: number;
      frequency: number;
    };
  };
  animation: {
    speed: number;
    organicness: number;
    complexity: number;
  };
}

export interface GeometricShapeConfig {
  count: number;
  color: string;
  size: number;
  speed: number;
  organicness: number;
  rotation?: number;
  scale?: number;
}

export interface OrganicShapeConfig {
  count: number;
  color: string;
  size: number;
  speed: number;
  organicness: number;
  complexity: number;
  flow: number;
}

// Main preset generator class
export class AdvancedPresetGenerator {
  private safeIntegration = getSafeIntegration();
  private contextAnalyzer: ContextAnalyzer;
  private colorHarmonyEngine: ColorHarmonyEngine;
  private parameterInterpolator: ParameterInterpolator<any>;
  private scoringEngine: AdvancedPresetScoring;

  constructor() {
    this.contextAnalyzer = new ContextAnalyzer();
    this.colorHarmonyEngine = new ColorHarmonyEngine();
    this.parameterInterpolator = new ParameterInterpolator<any>();
    this.scoringEngine = new AdvancedPresetScoring();
  }

  /**
   * Main preset generation method
   */
  async generatePresets(
    imageData: ImageData,
    count: number = 30
  ): Promise<GeneratedPreset[]> {
    console.log('🎨 Starting advanced preset generation...');
    
    try {
      // Step 1: Analyze image context
      const context = await this.contextAnalyzer.analyzeImage(imageData);
      console.log('📊 Image context analyzed:', context);
      
      // Step 2: Generate base color harmony
      const baseColorHarmony = this.colorHarmonyEngine.generatePalette(
        context.dominantColors[0],
        context.complexity
      );
      console.log('🎨 Base color harmony generated:', baseColorHarmony);
      
      // Step 3: Generate presets using different strategies
      const presets = await this.generateWithStrategies(context, baseColorHarmony, count);
      console.log(`✨ Generated ${presets.length} presets`);
      
      // Step 4: Score and rank presets
      const scoredPresets = await this.scorePresets(presets);
      console.log('📊 Presets scored and ranked');
      
      // Step 5: Apply quality filtering and final ranking
      const finalPresets = this.rankAndFilter(scoredPresets);
      console.log(`🏆 Final ${finalPresets.length} high-quality presets ready`);
      
      return finalPresets;
    } catch (error) {
      console.error('❌ Error in preset generation:', error);
      throw error;
    }
  }

  /**
   * Strategy-based generation
   */
  private async generateWithStrategies(
    context: ImageContext,
    baseColorHarmony: EnhancedColorPalette,
    totalCount: number
  ): Promise<GeneratedPreset[]> {
    const strategies: GenerationStrategy[] = [
      'harmonic_emphasis',
      'dynamic_movement', 
      'atmospheric_mood',
      'geometric_balance',
      'artistic_interpretation'
    ];
    
    const presetsPerStrategy = Math.floor(totalCount / strategies.length);
    const presets: GeneratedPreset[] = [];
    
    for (let i = 0; i < strategies.length; i++) {
      const strategy = strategies[i];
      console.log(`🎯 Generating presets with strategy: ${strategy}`);
      
      const strategyPresets = await this.generateWithStrategy(
        context,
        baseColorHarmony,
        strategy,
        presetsPerStrategy,
        i * presetsPerStrategy // seed offset
      );
      presets.push(...strategyPresets);
    }
    
    return presets;
  }

  /**
   * Individual strategy implementation
   */
  private async generateWithStrategy(
    context: ImageContext,
    baseColorHarmony: EnhancedColorPalette,
    strategy: GenerationStrategy,
    count: number,
    seedOffset: number
  ): Promise<GeneratedPreset[]> {
    const presets: GeneratedPreset[] = [];
    
    for (let i = 0; i < count; i++) {
      const seed = seedOffset + i;
      const preset = await this.generateSinglePreset(
        context,
        baseColorHarmony,
        strategy,
        seed
      );
      presets.push(preset);
    }
    
    return presets;
  }

  /**
   * Generate a single preset with specific strategy
   */
  private async generateSinglePreset(
    context: ImageContext,
    baseColorHarmony: EnhancedColorPalette,
    strategy: GenerationStrategy,
    seed: number
  ): Promise<GeneratedPreset> {
    const id = `preset_${strategy}_${seed}_${Date.now()}`;
    const name = this.generatePresetName(strategy, seed);
    
    // Generate visual state based on strategy
    const visualState = this.generateVisualStateByStrategy(
      context,
      baseColorHarmony,
      strategy,
      seed
    );
    
    // Create metadata
    const metadata: PresetMetadata = {
      sourceContext: context,
      colorHarmony: baseColorHarmony,
      generationSeed: seed,
      createdAt: new Date(),
      estimatedPerformance: this.estimatePerformance(visualState)
    };
    
    // Create initial preset
    const preset: GeneratedPreset = {
      id,
      name,
      strategy,
      visualState,
      metadata,
      scores: { colorHarmony: 0, visualBalance: 0, animationFlow: 0, moodCoherence: 0, creativity: 0, performance: 0, overall: 0 },
      confidence: 0
    };
    
    // Score the preset
    preset.scores = this.scoringEngine.scorePreset(preset);
    preset.confidence = this.calculateConfidence(preset);
    
    return preset;
  }

  /**
   * Generate visual state based on strategy
   */
  private generateVisualStateByStrategy(
    context: ImageContext,
    baseColorHarmony: EnhancedColorPalette,
    strategy: GenerationStrategy,
    seed: number
  ): EnhancedVisualState {
    switch (strategy) {
      case 'harmonic_emphasis':
        return this.generateHarmonicEmphasis(context, baseColorHarmony, seed);
      case 'dynamic_movement':
        return this.generateDynamicMovement(context, baseColorHarmony, seed);
      case 'atmospheric_mood':
        return this.generateAtmosphericMood(context, baseColorHarmony, seed);
      case 'geometric_balance':
        return this.generateGeometricBalance(context, baseColorHarmony, seed);
      case 'artistic_interpretation':
        return this.generateArtisticInterpretation(context, baseColorHarmony, seed);
      default:
        return this.generateHarmonicEmphasis(context, baseColorHarmony, seed);
    }
  }

  /**
   * Harmonic Emphasis Strategy
   */
  private generateHarmonicEmphasis(
    context: ImageContext,
    baseColorHarmony: EnhancedColorPalette,
    seed: number
  ): EnhancedVisualState {
    const harmonyMultiplier = 0.8 + (this.seededRandom(seed) * 0.4);
    const ranges = IMPROVED_PARAMETER_RANGES;
    const features = getEnabledFeatures('harmonic_emphasis');
    
    // Apply strong image color mapping
    const colorMapping = improvedColorPresetGenerator.generateColorMapping(context);
    
    const basePreset = {
      geometric: {
        spheres: {
          count: Math.floor(8 + context.complexity * 15), // Cloud preset inspired: 8-23 range
          color: colorMapping.shapes.primary, // Direct image color
          size: ranges.shapes.size.default + (this.seededRandom(seed + 1) * ranges.shapes.size.variation),
          speed: ranges.shapes.speed.default * harmonyMultiplier,
          organicness: ranges.shapes.organicness.smooth,
          movementPattern: selectMovementPattern('harmonic_emphasis', context.mood, harmonyMultiplier),
          distance: ranges.shapes.distance.default,
        },
        cubes: {
          count: Math.floor(5 + context.complexity * 12), // Cloud preset inspired: 5-17 range
          color: colorMapping.shapes.secondary, // Direct image color
          size: ranges.shapes.size.default * 0.9 + (this.seededRandom(seed + 4) * 1.0),
          speed: ranges.shapes.speed.calm * harmonyMultiplier,
          organicness: ranges.shapes.organicness.smooth * 0.5,
          movementPattern: 'orbit' as const,
          distance: ranges.shapes.distance.default * 0.9,
        },
        toruses: {
          count: Math.floor(4 + context.complexity * 8), // Cloud preset inspired: 4-12 range
          color: colorMapping.shapes.accent, // Direct image color
          size: ranges.shapes.size.default * 1.2 + (this.seededRandom(seed + 7) * 0.5),
          speed: ranges.shapes.speed.default * 0.8 * harmonyMultiplier,
          organicness: ranges.shapes.organicness.smooth * 1.5,
          movementPattern: 'verticalSine' as const,
          distance: ranges.shapes.distance.default * 1.1,
        },
        blobs: {
          count: Math.floor(3 + context.complexity * 6), // Cloud preset inspired: 3-9 range
          color: improvedColorPresetGenerator.adjustBrightness(colorMapping.shapes.primary, -0.3), // Darker variant
          size: ranges.shapes.size.default * 1.5 + (this.seededRandom(seed + 10) * 1.0),
          speed: ranges.shapes.speed.calm * harmonyMultiplier,
          organicness: ranges.shapes.organicness.chaotic,
          complexity: 0.7 + (this.seededRandom(seed + 12) * 0.3),
          flow: 0.5 + (this.seededRandom(seed + 13) * 0.3),
          movementPattern: 'verticalSine' as const,
          distance: ranges.shapes.distance.default,
        }
      },
      effects: {
        brightness: ranges.effects.brightness.balanced + (harmonyMultiplier * 0.1),
        saturation: ranges.effects.saturation.rich + (baseColorHarmony.harmonyScore * 0.3),
        contrast: ranges.effects.contrast.balanced + (this.seededRandom(seed + 14) * 0.2),
        vignette: ranges.effects.vignette.subtle,
        glow: ranges.effects.glow.subtle + (baseColorHarmony.harmonyScore * 0.3),
      },
      globalEffects: {
        atmosphericBlur: features.atmosphericBlur ? {
          enabled: true,
          intensity: ranges.globalEffects.atmosphericBlur.intensity.subtle,
          layers: ranges.globalEffects.atmosphericBlur.layers.min + 1,
        } : undefined,
        shapeGlow: features.shapeGlow ? {
          enabled: true,
          intensity: 0.4 + context.complexity * 0.3, // Enhanced intensity
          useObjectColor: true,
          pulsing: features.pulsing,
          pulseSpeed: 1.0,
        } : undefined,
        chromatic: {
          enabled: true,
          aberration: 3.0 + context.complexity * 3.0, // Cloud preset inspired: 3-6 range
          aberrationColors: colorMapping.effects.chromatic
        },
        trails: context.complexity > 0.5 ? {
          enabled: true,
          sphereTrails: { enabled: true, length: 150, opacity: 0.6 },
          cubeTrails: { enabled: true, length: 120, opacity: 0.5 },
          particleTrails: { enabled: true, length: 200, opacity: 0.4 }
        } : undefined,
      },
      animation: {
        speed: ranges.animation.globalSpeed.balanced * harmonyMultiplier,
        organicness: 0.4 + (this.seededRandom(seed + 16) * 0.3),
        complexity: 0.5 + (context.complexity * 0.3),
      },
      particles: {
        count: Math.floor(200 + context.complexity * 600), // Cloud preset inspired: 200-800
        color: colorMapping.particles, // Bright version of primary color
        size: 0.2 + (1 - context.complexity) * 1.5, // Smaller when more particles
        speed: ranges.shapes.speed.calm,
        opacity: ranges.shapes.opacity.glass,
        spread: ranges.particles.spread.balanced,
        movementPattern: 'random' as const,
        distance: ranges.shapes.distance.default,
      }
    };
    
    // Apply enhanced color mapping to complete preset
    return improvedColorPresetGenerator.applyColorsToPreset(basePreset, colorMapping, context);
  }

  /**
   * Dynamic Movement Strategy
   */
  private generateDynamicMovement(
    context: ImageContext,
    baseColorHarmony: EnhancedColorPalette,
    seed: number
  ): EnhancedVisualState {
    const energyMultiplier = 1.2 + (this.seededRandom(seed) * 0.6);
    
    return {
      geometric: {
        spheres: {
          count: Math.floor(12 + (context.complexity * 12)),
          color: baseColorHarmony.accent,
          size: 0.8 + (this.seededRandom(seed + 1) * 0.4),
          speed: (0.8 + (context.complexity * 0.4)) * energyMultiplier,
          organicness: 0.4 + (this.seededRandom(seed + 2) * 0.3),
        },
        cubes: {
          count: Math.floor(10 + (context.complexity * 10)),
          color: this.varyColor(baseColorHarmony.primary, 0.2, seed + 3),
          size: 0.6 + (this.seededRandom(seed + 4) * 0.5),
          speed: (1.0 + (context.complexity * 0.5)) * energyMultiplier,
          organicness: 0.2 + (this.seededRandom(seed + 5) * 0.2),
        },
        toruses: {
          count: Math.floor(8 + (context.complexity * 8)),
          color: this.varyColor(baseColorHarmony.secondary, 0.25, seed + 6),
          size: 1.0 + (this.seededRandom(seed + 7) * 0.4),
          speed: (0.9 + (context.complexity * 0.4)) * energyMultiplier,
          organicness: 0.5 + (this.seededRandom(seed + 8) * 0.3),
        },
        blobs: {
          count: Math.floor(6 + (context.complexity * 6)),
          color: this.varyColor(baseColorHarmony.accent, 0.3, seed + 9),
          size: 1.2 + (this.seededRandom(seed + 10) * 0.6),
          speed: (1.1 + (context.complexity * 0.5)) * energyMultiplier,
          organicness: 0.9 + (this.seededRandom(seed + 11) * 0.1),
          complexity: 0.8 + (this.seededRandom(seed + 12) * 0.2),
          flow: 0.8 + (this.seededRandom(seed + 13) * 0.2),
        }
      },
      effects: {
        brightness: 1.1 + (energyMultiplier * 0.3),
        saturation: 1.3 + (this.seededRandom(seed + 14) * 0.4),
        contrast: 1.2 + (energyMultiplier * 0.2),
        vignette: 0.2 + (this.seededRandom(seed + 15) * 0.3),
        glow: 0.5 + (energyMultiplier * 0.4),
      },
      globalEffects: {
        distortion: {
          enabled: true,
          wave: 0.3 + (this.seededRandom(seed + 16) * 0.4),
          ripple: 0.2 + (this.seededRandom(seed + 17) * 0.3),
          frequency: 1.0 + (energyMultiplier * 0.5),
        }
      },
      animation: {
        speed: 1.0 + (energyMultiplier * 0.3),
        organicness: 0.6 + (this.seededRandom(seed + 18) * 0.3),
        complexity: 0.7 + (context.complexity * 0.4),
      }
    };
  }

  /**
   * Atmospheric Mood Strategy
   */
  private generateAtmosphericMood(
    context: ImageContext,
    baseColorHarmony: EnhancedColorPalette,
    seed: number
  ): EnhancedVisualState {
    const atmosphericIntensity = 0.6 + (this.seededRandom(seed) * 0.4);
    
    return {
      geometric: {
        spheres: {
          count: Math.floor(6 + (context.complexity * 6)),
          color: this.varyColor(baseColorHarmony.primary, 0.3, seed),
          size: 1.5 + (this.seededRandom(seed + 1) * 0.5),
          speed: 0.3 + (context.complexity * 0.2),
          organicness: 0.6 + (this.seededRandom(seed + 2) * 0.3),
        },
        cubes: {
          count: Math.floor(4 + (context.complexity * 4)),
          color: this.varyColor(baseColorHarmony.secondary, 0.25, seed + 3),
          size: 1.2 + (this.seededRandom(seed + 4) * 0.4),
          speed: 0.2 + (context.complexity * 0.15),
          organicness: 0.4 + (this.seededRandom(seed + 5) * 0.2),
        },
        toruses: {
          count: Math.floor(3 + (context.complexity * 3)),
          color: this.varyColor(baseColorHarmony.accent, 0.35, seed + 6),
          size: 1.8 + (this.seededRandom(seed + 7) * 0.6),
          speed: 0.25 + (context.complexity * 0.2),
          organicness: 0.7 + (this.seededRandom(seed + 8) * 0.2),
        },
        blobs: {
          count: Math.floor(5 + (context.complexity * 5)),
          color: this.varyColor(baseColorHarmony.primary, 0.4, seed + 9),
          size: 2.0 + (this.seededRandom(seed + 10) * 0.8),
          speed: 0.4 + (context.complexity * 0.25),
          organicness: 0.9 + (this.seededRandom(seed + 11) * 0.1),
          complexity: 0.9 + (this.seededRandom(seed + 12) * 0.1),
          flow: 0.7 + (this.seededRandom(seed + 13) * 0.2),
        }
      },
      effects: {
        brightness: 0.9 + (atmosphericIntensity * 0.2),
        saturation: 1.1 + (this.seededRandom(seed + 14) * 0.3),
        contrast: 0.8 + (atmosphericIntensity * 0.3),
        vignette: 0.2 + (atmosphericIntensity * 0.3),
        glow: 0.4 + (atmosphericIntensity * 0.4),
      },
      globalEffects: {
        atmosphericBlur: {
          enabled: true,
          intensity: 0.4 + (atmosphericIntensity * 0.4),
          layers: Math.floor(3 + (atmosphericIntensity * 3)),
        },
        volumetric: {
          enabled: true,
          fog: 0.3 + (atmosphericIntensity * 0.4),
          density: 0.2 + (atmosphericIntensity * 0.3),
          color: this.varyColor(baseColorHarmony.primary, 0.2, seed),
        }
      },
      animation: {
        speed: 0.4 + (atmosphericIntensity * 0.2),
        organicness: 0.8 + (this.seededRandom(seed + 15) * 0.2),
        complexity: 0.6 + (context.complexity * 0.3),
      }
    };
  }

  /**
   * Geometric Balance Strategy
   */
  private generateGeometricBalance(
    context: ImageContext,
    baseColorHarmony: EnhancedColorPalette,
    seed: number
  ): EnhancedVisualState {
    const balanceMultiplier = 0.7 + (this.seededRandom(seed) * 0.6);
    
    return {
      geometric: {
        spheres: {
          count: Math.floor(10 + (context.complexity * 10)),
          color: baseColorHarmony.primary,
          size: 1.0 + (this.seededRandom(seed + 1) * 0.4),
          speed: 0.5 + (context.complexity * 0.3) * balanceMultiplier,
          organicness: 0.1 + (this.seededRandom(seed + 2) * 0.2),
        },
        cubes: {
          count: Math.floor(8 + (context.complexity * 8)),
          color: baseColorHarmony.secondary,
          size: 0.9 + (this.seededRandom(seed + 3) * 0.3),
          speed: 0.4 + (context.complexity * 0.25) * balanceMultiplier,
          organicness: 0.05 + (this.seededRandom(seed + 4) * 0.1),
        },
        toruses: {
          count: Math.floor(6 + (context.complexity * 6)),
          color: baseColorHarmony.accent,
          size: 1.1 + (this.seededRandom(seed + 5) * 0.3),
          speed: 0.45 + (context.complexity * 0.28) * balanceMultiplier,
          organicness: 0.2 + (this.seededRandom(seed + 6) * 0.15),
        },
        blobs: {
          count: Math.floor(4 + (context.complexity * 4)),
          color: this.varyColor(baseColorHarmony.primary, 0.2, seed + 7),
          size: 1.3 + (this.seededRandom(seed + 8) * 0.4),
          speed: 0.55 + (context.complexity * 0.32) * balanceMultiplier,
          organicness: 0.6 + (this.seededRandom(seed + 9) * 0.2),
          complexity: 0.5 + (this.seededRandom(seed + 10) * 0.3),
          flow: 0.4 + (this.seededRandom(seed + 11) * 0.3),
        }
      },
      effects: {
        brightness: 1.0 + (balanceMultiplier * 0.1),
        saturation: 1.1 + (this.seededRandom(seed + 12) * 0.2),
        contrast: 1.0 + (balanceMultiplier * 0.15),
        vignette: 0.1 + (this.seededRandom(seed + 13) * 0.15),
        glow: 0.2 + (balanceMultiplier * 0.2),
      },
      globalEffects: {},
      animation: {
        speed: 0.5 + (balanceMultiplier * 0.2),
        organicness: 0.2 + (this.seededRandom(seed + 14) * 0.2),
        complexity: 0.4 + (context.complexity * 0.25),
      }
    };
  }

  /**
   * Artistic Interpretation Strategy
   */
  private generateArtisticInterpretation(
    context: ImageContext,
    baseColorHarmony: EnhancedColorPalette,
    seed: number
  ): EnhancedVisualState {
    const creativityMultiplier = 1.0 + (this.seededRandom(seed) * 0.8);
    
    return {
      geometric: {
        spheres: {
          count: Math.floor(15 + (context.complexity * 15)),
          color: this.varyColor(baseColorHarmony.accent, 0.4, seed),
          size: 0.6 + (this.seededRandom(seed + 1) * 0.8),
          speed: 0.7 + (context.complexity * 0.5) * creativityMultiplier,
          organicness: 0.7 + (this.seededRandom(seed + 2) * 0.3),
        },
        cubes: {
          count: Math.floor(12 + (context.complexity * 12)),
          color: this.varyColor(baseColorHarmony.primary, 0.35, seed + 3),
          size: 0.5 + (this.seededRandom(seed + 4) * 0.9),
          speed: 0.8 + (context.complexity * 0.6) * creativityMultiplier,
          organicness: 0.5 + (this.seededRandom(seed + 5) * 0.4),
        },
        toruses: {
          count: Math.floor(10 + (context.complexity * 10)),
          color: this.varyColor(baseColorHarmony.secondary, 0.4, seed + 6),
          size: 0.8 + (this.seededRandom(seed + 7) * 0.7),
          speed: 0.9 + (context.complexity * 0.7) * creativityMultiplier,
          organicness: 0.8 + (this.seededRandom(seed + 8) * 0.2),
        },
        blobs: {
          count: Math.floor(8 + (context.complexity * 8)),
          color: this.varyColor(baseColorHarmony.accent, 0.5, seed + 9),
          size: 1.0 + (this.seededRandom(seed + 10) * 1.0),
          speed: 1.0 + (context.complexity * 0.8) * creativityMultiplier,
          organicness: 0.9 + (this.seededRandom(seed + 11) * 0.1),
          complexity: 0.9 + (this.seededRandom(seed + 12) * 0.1),
          flow: 0.9 + (this.seededRandom(seed + 13) * 0.1),
        }
      },
      effects: {
        brightness: 1.2 + (creativityMultiplier * 0.4),
        saturation: 1.4 + (this.seededRandom(seed + 14) * 0.5),
        contrast: 1.3 + (creativityMultiplier * 0.3),
        vignette: 0.3 + (this.seededRandom(seed + 15) * 0.4),
        glow: 0.6 + (creativityMultiplier * 0.5),
      },
      globalEffects: {
        distortion: {
          enabled: true,
          wave: 0.4 + (this.seededRandom(seed + 16) * 0.5),
          ripple: 0.3 + (this.seededRandom(seed + 17) * 0.4),
          frequency: 1.2 + (creativityMultiplier * 0.6),
        },
        atmosphericBlur: {
          enabled: true,
          intensity: 0.3 + (this.seededRandom(seed + 18) * 0.4),
          layers: Math.floor(4 + (creativityMultiplier * 3)),
        }
      },
      animation: {
        speed: 0.8 + (creativityMultiplier * 0.4),
        organicness: 0.9 + (this.seededRandom(seed + 19) * 0.1),
        complexity: 0.8 + (context.complexity * 0.5),
      }
    };
  }

  /**
   * Score all presets
   */
  private async scorePresets(presets: GeneratedPreset[]): Promise<GeneratedPreset[]> {
    console.log('📊 Scoring presets...');
    
    for (const preset of presets) {
      preset.scores = this.scoringEngine.scorePreset(preset);
      preset.confidence = this.calculateConfidence(preset);
    }
    
    return presets;
  }

  /**
   * Rank and filter presets by quality
   */
  private rankAndFilter(presets: GeneratedPreset[]): GeneratedPreset[] {
    console.log('🏆 Ranking and filtering presets...');
    
    // Sort by overall score (descending)
    const ranked = presets.sort((a, b) => b.scores.overall - a.scores.overall);
    
    // Filter out low-quality presets (overall score < 60)
    const filtered = ranked.filter(preset => preset.scores.overall >= 60);
    
    // Ensure we have at least 20 presets
    const finalCount = Math.max(20, Math.min(filtered.length, 30));
    
    return filtered.slice(0, finalCount);
  }

  /**
   * Generate preset name
   */
  private generatePresetName(strategy: GenerationStrategy, seed: number): string {
    const strategyNames = {
      harmonic_emphasis: 'Harmonic',
      dynamic_movement: 'Dynamic',
      atmospheric_mood: 'Atmospheric',
      geometric_balance: 'Geometric',
      artistic_interpretation: 'Artistic'
    };
    
    const baseName = strategyNames[strategy];
    const variation = seed % 100;
    return `${baseName} Vision ${variation}`;
  }

  /**
   * Estimate performance for a preset
   */
  private estimatePerformance(visualState: EnhancedVisualState): PerformanceEstimate {
    const totalShapes = 
      visualState.geometric.spheres.count +
      visualState.geometric.cubes.count +
      visualState.geometric.toruses.count +
      visualState.geometric.blobs.count;
    
    const complexity = Math.min(100, totalShapes * 2 + visualState.animation.complexity * 50);
    const fps = Math.max(30, 60 - (complexity * 0.3));
    const memoryUsage = totalShapes * 0.5 + visualState.animation.complexity * 10;
    const renderTime = complexity * 0.5;
    
    return { fps, memoryUsage, complexity, renderTime };
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(preset: GeneratedPreset): number {
    const { scores } = preset;
    const variance = Math.sqrt(
      Object.values(scores).reduce((sum, score) => sum + Math.pow(score - scores.overall, 2), 0) / 6
    );
    
    // Higher confidence for consistent scores and high overall score
    return Math.min(100, scores.overall * 0.8 + (100 - variance) * 0.2);
  }

  /**
   * Utility: Seeded random number generator
   */
  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  /**
   * Utility: Vary color with seed
   */
  private varyColor(baseColor: string, variation: number, seed: number): string {
    // Simple color variation - in a real implementation, this would use proper color theory
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const factor = 1 + (this.seededRandom(seed) - 0.5) * variation;
    const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
    const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
    const newB = Math.min(255, Math.max(0, Math.round(b * factor)));
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }
}

// Preset scoring engine
export interface PresetScoringEngine {
  scorePreset(preset: GeneratedPreset): PresetQualityScores;
}

export class AdvancedPresetScoring implements PresetScoringEngine {
  scorePreset(preset: GeneratedPreset): PresetQualityScores {
    const scores = {
      colorHarmony: this.scoreColorHarmony(preset),
      visualBalance: this.scoreVisualBalance(preset),
      animationFlow: this.scoreAnimationFlow(preset),
      moodCoherence: this.scoreMoodCoherence(preset),
      creativity: this.scoreCreativity(preset),
      performance: this.scorePerformance(preset),
      overall: 0
    };
    
    // Calculate weighted composite score
    scores.overall = (
      scores.colorHarmony * 0.20 +
      scores.visualBalance * 0.18 +
      scores.animationFlow * 0.17 +
      scores.moodCoherence * 0.15 +
      scores.creativity * 0.15 +
      scores.performance * 0.15
    );
    
    return scores;
  }
  
  private scoreColorHarmony(preset: GeneratedPreset): number {
    const { colorHarmony } = preset.metadata;
    const baseScore = colorHarmony.harmonyScore * 100;
    
    // Additional scoring based on color usage in visual state
    const colorConsistency = this.assessColorConsistency(preset.visualState, colorHarmony);
    
    return Math.min(100, baseScore * 0.7 + colorConsistency * 0.3);
  }
  
  private scoreVisualBalance(preset: GeneratedPreset): number {
    const { geometric } = preset.visualState;
    const totalShapes = geometric.spheres.count + geometric.cubes.count + geometric.toruses.count + geometric.blobs.count;
    
    // Balance score based on shape distribution and sizes
    const shapeBalance = this.calculateShapeBalance(geometric);
    const sizeBalance = this.calculateSizeBalance(geometric);
    
    return Math.min(100, (shapeBalance + sizeBalance) / 2);
  }
  
  private scoreAnimationFlow(preset: GeneratedPreset): number {
    const { animation } = preset.visualState;
    const { geometric } = preset.visualState;
    
    // Analyze animation coherence and rhythm
    const speedConsistency = this.calculateSpeedConsistency(geometric);
    const organicness = animation.organicness * 100;
    const complexity = animation.complexity * 100;
    
    return Math.min(100, (speedConsistency * 0.4 + organicness * 0.3 + complexity * 0.3));
  }
  
  private scoreMoodCoherence(preset: GeneratedPreset): number {
    const { strategy } = preset;
    const { effects, globalEffects } = preset.visualState;
    
    // Score based on how well effects match the strategy
    const strategyAlignment = this.calculateStrategyAlignment(strategy, effects, globalEffects);
    const atmosphericCoherence = this.calculateAtmosphericCoherence(effects, globalEffects);
    
    return Math.min(100, (strategyAlignment + atmosphericCoherence) / 2);
  }
  
  private scoreCreativity(preset: GeneratedPreset): number {
    const { strategy } = preset;
    const { geometric, effects, globalEffects } = preset.visualState;
    
    // Score based on uniqueness and creative combinations
    const uniqueness = this.calculateUniqueness(geometric, effects, globalEffects);
    const innovation = this.calculateInnovation(strategy, preset.visualState);
    
    return Math.min(100, (uniqueness + innovation) / 2);
  }
  
  private scorePerformance(preset: GeneratedPreset): number {
    const { estimatedPerformance } = preset.metadata;
    
    // Score based on performance metrics
    const fpsScore = Math.min(100, (estimatedPerformance.fps / 60) * 100);
    const memoryScore = Math.max(0, 100 - (estimatedPerformance.memoryUsage / 100));
    const complexityScore = Math.max(0, 100 - estimatedPerformance.complexity);
    
    return (fpsScore * 0.5 + memoryScore * 0.3 + complexityScore * 0.2);
  }
  
  // Helper methods for scoring
  private assessColorConsistency(visualState: EnhancedVisualState, colorHarmony: EnhancedColorPalette): number {
    // Simplified color consistency assessment
    return 85; // Placeholder
  }
  
  private calculateShapeBalance(geometric: EnhancedVisualState['geometric']): number {
    const counts = [geometric.spheres.count, geometric.cubes.count, geometric.toruses.count, geometric.blobs.count];
    const total = counts.reduce((sum, count) => sum + count, 0);
    const variance = counts.reduce((sum, count) => sum + Math.pow(count - total / 4, 2), 0) / 4;
    return Math.max(0, 100 - (variance / total) * 100);
  }
  
  private calculateSizeBalance(geometric: EnhancedVisualState['geometric']): number {
    const sizes = [geometric.spheres.size, geometric.cubes.size, geometric.toruses.size, geometric.blobs.size];
    const avgSize = sizes.reduce((sum, size) => sum + size, 0) / 4;
    const variance = sizes.reduce((sum, size) => sum + Math.pow(size - avgSize, 2), 0) / 4;
    return Math.max(0, 100 - (variance / avgSize) * 50);
  }
  
  private calculateSpeedConsistency(geometric: EnhancedVisualState['geometric']): number {
    const speeds = [geometric.spheres.speed, geometric.cubes.speed, geometric.toruses.speed, geometric.blobs.speed];
    const avgSpeed = speeds.reduce((sum, speed) => sum + speed, 0) / 4;
    const variance = speeds.reduce((sum, speed) => sum + Math.pow(speed - avgSpeed, 2), 0) / 4;
    return Math.max(0, 100 - (variance / avgSpeed) * 100);
  }
  
  private calculateStrategyAlignment(strategy: GenerationStrategy, effects: any, globalEffects: any): number {
    // Simplified strategy alignment scoring
    return 80; // Placeholder
  }
  
  private calculateAtmosphericCoherence(effects: any, globalEffects: any): number {
    // Simplified atmospheric coherence scoring
    return 75; // Placeholder
  }
  
  private calculateUniqueness(geometric: any, effects: any, globalEffects: any): number {
    // Simplified uniqueness scoring
    return 70; // Placeholder
  }
  
  private calculateInnovation(strategy: GenerationStrategy, visualState: EnhancedVisualState): number {
    // Simplified innovation scoring
    return 75; // Placeholder
  }
}

// Enhanced preset generation service with safe integration
export class EnhancedPresetGenerationService {
  private safeIntegration = getSafeIntegration();
  private generator: AdvancedPresetGenerator;

  constructor() {
    this.generator = new AdvancedPresetGenerator();
  }
  
  async generatePresetsWithEnhancedAI(
    imageFile: File
  ): Promise<GeneratedPreset[]> {
    return this.safeIntegration.safelyExecute(
      'enableAdvancedPresets' as any,
      async () => {
        console.log('🚀 Starting enhanced preset generation...');
        
        const imageData = await this.convertFileToImageData(imageFile);
        const presets = await this.generator.generatePresets(imageData, 30);
        
        console.log(`✨ Generated ${presets.length} enhanced presets`);
        return presets;
      },
      async () => {
        console.log('🔄 Falling back to basic preset generation...');
        return this.generateBasicPresets(imageFile);
      }
    );
  }

  private async convertFileToImageData(file: File): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          resolve(imageData);
        } else {
          reject(new Error('Failed to get image data'));
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  private async generateBasicPresets(imageFile: File): Promise<GeneratedPreset[]> {
    // Basic fallback preset generation
    const presets: GeneratedPreset[] = [];
    
    for (let i = 0; i < 10; i++) {
      presets.push({
        id: `basic_preset_${i}`,
        name: `Basic Preset ${i}`,
        strategy: 'harmonic_emphasis',
        visualState: this.createBasicVisualState(),
        metadata: {
          sourceContext: { dominantColors: ['#ff0000'], complexity: 0.5, mood: 'neutral' },
          colorHarmony: { primary: '#ff0000', secondary: '#00ff00', accent: '#0000ff', harmonyScore: 0.6 },
          generationSeed: i,
          createdAt: new Date(),
          estimatedPerformance: { fps: 60, memoryUsage: 50, complexity: 30, renderTime: 15 }
        },
        scores: { colorHarmony: 60, visualBalance: 60, animationFlow: 60, moodCoherence: 60, creativity: 60, performance: 80, overall: 63 },
        confidence: 70
      });
    }
    
    return presets;
  }

  private createBasicVisualState(): EnhancedVisualState {
    return {
      geometric: {
        spheres: { count: 5, color: '#ff0000', size: 1.0, speed: 0.5, organicness: 0.3 },
        cubes: { count: 3, color: '#00ff00', size: 0.8, speed: 0.4, organicness: 0.2 },
        toruses: { count: 2, color: '#0000ff', size: 1.2, speed: 0.6, organicness: 0.4 },
        blobs: { count: 1, color: '#ff0000', size: 1.5, speed: 0.7, organicness: 0.8, complexity: 0.6, flow: 0.5 }
      },
      effects: {
        brightness: 1.0, saturation: 1.1, contrast: 1.0, vignette: 0.1, glow: 0.2
      },
      globalEffects: {},
      animation: {
        speed: 0.5, organicness: 0.4, complexity: 0.3
      }
    };
  }
} 