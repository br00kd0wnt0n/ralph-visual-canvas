// Unified Type System for Visual Canvas Lab
// Merges AI system, Enhanced AI system, and Visual Store types
// Provides seamless integration between all three systems

import type { VisualState } from '../store/visualStore';

// ============================================================================
// CORE AI SYSTEM TYPES (from src/ai-system/types/AITypes.ts)
// ============================================================================

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  referenceImage?: File;
  location: string;
  evolutionPeriod: '1hour' | '1day' | '1week';
  createdAt: Date;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  supporting: string[];
}

export interface VisualCharacteristics {
  saturation: number;     // 0-1
  turbulence: number;     // 0-1 (chaos level)
  harmony: number;        // 0-1 (synchronization)
  energy: number;         // 0-1 (intensity)
  speed: number;          // 0-2 (animation speed)
  density: number;        // 0-2 (object density)
  brightness: number;     // 0-2 (overall brightness)
}

export interface WeatherData {
  temperature: number;    // °F
  condition: string;      // sunny, cloudy, rain, storm, etc.
  windSpeed: number;      // mph
  windDirection: number;  // degrees
  humidity: number;       // %
  pressure: number;       // inHg
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
  dataSource?: string;    // API source (OpenWeather, wttr.in, mock)
  lastUpdated?: string;   // ISO timestamp
  location?: string;      // Location name
  verification?: {
    apiProvider: string;
    coordinates?: { lat: number; lon: number };
    rawData?: any;
  };
}

export interface ThemeAnalysis {
  theme: string;
  colorPalette: ColorPalette;
  mood: string[];
  atmosphere: string;
  visualCharacteristics: VisualCharacteristics;
  weatherMappings: WeatherMappings;
  confidence: number;     // 0-1 AI confidence score
}

export interface WeatherMappings {
  temperature: {
    hueShift: (temp: number) => number;
    speedMultiplier: (temp: number) => number;
    energyModifier: (temp: number) => number;
  };
  wind: {
    turbulence: (speed: number) => number;
    flowDirection: (direction: number) => number;
    density: (speed: number) => number;
  };
  conditions: Record<string, Partial<VisualCharacteristics>>;
}

export interface GeneratedParameters {
  timestamp: Date;
  theme: string;
  weather: WeatherData;
  computed: VisualCharacteristics & {
    primaryHue: number;
    secondaryHue: number;
    brightness: number;
  };
  reasoning: string[];    // AI explanation of decisions
}

// ============================================================================
// ENHANCED AI SYSTEM TYPES (from src/ai-enhanced/types/EnhancedAITypes.ts)
// ============================================================================

export interface EnhancedColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  supporting: string[];
  harmonyType: 'complementary' | 'triadic' | 'analogous' | 'monochromatic' | 'split-complementary' | 'tetradic';
  harmonyScore: number; // 0-1, how well colors work together
  contrastRatio: number; // WCAG contrast ratio
  saturation: number; // 0-1, overall saturation level
  brightness: number; // 0-1, overall brightness level
  temperature: 'warm' | 'cool' | 'neutral'; // color temperature
  mood: string[]; // emotional associations
  accessibility: {
    wcagAA: boolean; // meets WCAG AA standards
    wcagAAA: boolean; // meets WCAG AAA standards
    colorBlindFriendly: boolean;
  };
}

export interface ColorHarmonyConfig {
  baseColor: string;
  harmonyLevel: number; // 0-1, how much to apply harmony rules
  targetMood: string[];
  targetTemperature: 'warm' | 'cool' | 'neutral';
  targetSaturation: number; // 0-1
  targetBrightness: number; // 0-1
  accessibilityMode: boolean;
  maxSupportingColors: number;
}

export interface ColorAnalysis {
  hue: number; // 0-360 degrees
  saturation: number; // 0-100%
  lightness: number; // 0-100%
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  hex: string;
  temperature: 'warm' | 'cool' | 'neutral';
  brightness: number; // 0-1
  contrast: number; // 0-1
}

export interface HarmonyRule {
  type: 'complementary' | 'triadic' | 'analogous' | 'monochromatic' | 'split-complementary' | 'tetradic';
  description: string;
  angleOffsets: number[]; // hue angle offsets from base color
  saturationMultiplier: number;
  lightnessMultiplier: number;
  moodAssociations: string[];
  useCases: string[];
}

export interface TestResults {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  testDetails: TestDetail[];
  performanceMetrics: {
    averageGenerationTime: number;
    memoryUsage: number;
    paletteQualityScore: number;
  };
}

export interface TestDetail {
  testName: string;
  passed: boolean;
  expected: any;
  actual: any;
  error?: string;
  executionTime: number;
}

export interface ColorValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  accessibilityScore: number;
  harmonyScore: number;
}

export interface IntegrationAdapter {
  // Future integration with existing AI system
  convertToLegacyFormat(palette: EnhancedColorPalette): any;
  convertFromLegacyFormat(legacyPalette: any): EnhancedColorPalette;
  validateIntegration(): boolean;
}

export interface PerformanceMetrics {
  generationTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  validationTime: number;
}

export interface ColorCache {
  [key: string]: {
    palette: EnhancedColorPalette;
    timestamp: number;
    usageCount: number;
  };
}

// Utility types for internal use
export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsv';
export type HarmonyAlgorithm = 'classic' | 'modern' | 'adaptive' | 'mood-based';
export type ValidationLevel = 'basic' | 'standard' | 'strict' | 'accessibility';

// ============================================================================
// UNIFIED VISUAL STATE (extends VisualState with AI capabilities)
// ============================================================================

export interface UnifiedVisualState extends VisualState {
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
}

// ============================================================================
// MAPPING FUNCTIONS (for converting between different type systems)
// ============================================================================

export class TypeMapper {
  /**
   * Convert EnhancedColorPalette to legacy ColorPalette
   */
  static enhancedToLegacyPalette(enhanced: EnhancedColorPalette): ColorPalette {
    return {
      primary: enhanced.primary,
      secondary: enhanced.secondary,
      accent: enhanced.accent,
      supporting: enhanced.supporting
    };
  }

  /**
   * Convert legacy ColorPalette to EnhancedColorPalette
   */
  static legacyToEnhancedPalette(legacy: ColorPalette): EnhancedColorPalette {
    return {
      primary: legacy.primary,
      secondary: legacy.secondary,
      accent: legacy.accent,
      supporting: legacy.supporting,
      harmonyType: 'complementary', // Default
      harmonyScore: 0.5, // Default
      contrastRatio: 4.5, // Default WCAG AA
      saturation: 0.5, // Default
      brightness: 0.5, // Default
      temperature: 'neutral', // Default
      mood: [], // Empty default
      accessibility: {
        wcagAA: true,
        wcagAAA: false,
        colorBlindFriendly: false
      }
    };
  }

  /**
   * Map VisualCharacteristics to store properties
   */
  static characteristicsToStore(characteristics: VisualCharacteristics): Partial<VisualState> {
    return {
      globalAnimationSpeed: characteristics.speed,
      effects: {
        saturation: characteristics.saturation,
        brightness: characteristics.brightness,
        glow: characteristics.energy * 0.5, // Map energy to glow
        contrast: 1 + (characteristics.harmony * 0.2), // Map harmony to contrast
        hue: 0, // Default
        vignette: 0 // Default
      },
      geometric: {
        spheres: {
          count: Math.floor(characteristics.density * 50), // Map density to count
          speed: characteristics.speed,
          opacity: 0.5 + (characteristics.harmony * 0.5), // Map harmony to opacity
          size: 1 + (characteristics.energy * 0.5), // Map energy to size
          color: '#ffffff', // Default
          rotation: 0, // Default
          organicness: characteristics.turbulence, // Map turbulence to organicness
          movementPattern: 'random', // Default
          distance: 1.5, // Default
          pulseEnabled: false, // Default
          pulseSize: 1 // Default
        },
        cubes: {
          count: Math.floor(characteristics.density * 40), // Map density to count
          speed: characteristics.speed,
          opacity: 0.5 + (characteristics.harmony * 0.5), // Map harmony to opacity
          size: 1 + (characteristics.energy * 0.5), // Map energy to size
          color: '#ffffff', // Default
          rotation: 0, // Default
          organicness: characteristics.turbulence, // Map turbulence to organicness
          movementPattern: 'random', // Default
          distance: 1.5, // Default
          pulseEnabled: false, // Default
          pulseSize: 1 // Default
        },
        toruses: {
          count: Math.floor(characteristics.density * 30), // Map density to count
          speed: characteristics.speed,
          opacity: 0.5 + (characteristics.harmony * 0.5), // Map harmony to opacity
          size: 1 + (characteristics.energy * 0.5), // Map energy to size
          color: '#ffffff', // Default
          rotation: 0, // Default
          organicness: characteristics.turbulence, // Map turbulence to organicness
          movementPattern: 'random', // Default
          distance: 1.5, // Default
          pulseEnabled: false, // Default
          pulseSize: 1 // Default
        },
        blobs: {
          count: Math.floor(characteristics.density * 20), // Map density to count
          speed: characteristics.speed,
          opacity: 0.5 + (characteristics.harmony * 0.5), // Map harmony to opacity
          size: 1 + (characteristics.energy * 0.5), // Map energy to size
          color: '#ffffff', // Default
          organicness: characteristics.turbulence, // Map turbulence to organicness
          movementPattern: 'random', // Default
          distance: 1.5, // Default
          pulseEnabled: false, // Default
          pulseSize: 1 // Default
        },
        crystals: {
          count: 0, // Default
          size: 1, // Default
          color: '#ffffff', // Default
          rotation: 0, // Default
          opacity: 1, // Default
          complexity: 1, // Default
          organicness: 0 // Default
        },
        waveInterference: {
          color: '#ffffff' // Default
        },
        metamorphosis: {
          color: '#ffffff' // Default
        },
        fireflies: {
          color: '#ffffff' // Default
        },
        layeredSineWaves: {
          color: '#ffffff' // Default
        }
      },
      particles: {
        count: Math.floor(characteristics.density * 100), // Map density to count
        speed: characteristics.speed,
        opacity: 0.5 + (characteristics.harmony * 0.5), // Map harmony to opacity
        size: 0.5 + (characteristics.energy * 0.5), // Map energy to size
        color: '#ffffff', // Default
        spread: 50, // Default
        movementPattern: 'random', // Default
        distance: 1.5, // Default
        pulseEnabled: false, // Default
        pulseSize: 1 // Default
      }
    };
  }

  /**
   * Map store properties to VisualCharacteristics
   */
  static storeToCharacteristics(store: VisualState): VisualCharacteristics {
    return {
      saturation: store.effects.saturation,
      turbulence: (store.geometric.spheres.organicness + store.geometric.cubes.organicness) / 2,
      harmony: (store.effects.contrast - 1) / 0.2, // Reverse map contrast to harmony
      energy: store.effects.glow * 2, // Reverse map glow to energy
      speed: store.globalAnimationSpeed,
      density: (store.geometric.spheres.count + store.geometric.cubes.count + store.geometric.toruses.count) / 120, // Normalize count to density
      brightness: store.effects.brightness
    };
  }
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export class TypeValidator {
  /**
   * Validate VisualCharacteristics
   */
  static validateVisualCharacteristics(characteristics: VisualCharacteristics): boolean {
    return (
      characteristics.saturation >= 0 && characteristics.saturation <= 1 &&
      characteristics.turbulence >= 0 && characteristics.turbulence <= 1 &&
      characteristics.harmony >= 0 && characteristics.harmony <= 1 &&
      characteristics.energy >= 0 && characteristics.energy <= 1 &&
      characteristics.speed >= 0 && characteristics.speed <= 2 &&
      characteristics.density >= 0 && characteristics.density <= 2 &&
      characteristics.brightness >= 0 && characteristics.brightness <= 2
    );
  }

  /**
   * Validate EnhancedColorPalette
   */
  static validateEnhancedColorPalette(palette: EnhancedColorPalette): boolean {
    return (
      palette.primary && palette.secondary && palette.accent &&
      palette.harmonyScore >= 0 && palette.harmonyScore <= 1 &&
      palette.contrastRatio > 0 &&
      palette.saturation >= 0 && palette.saturation <= 1 &&
      palette.brightness >= 0 && palette.brightness <= 1
    );
  }

  /**
   * Validate WeatherData
   */
  static validateWeatherData(weather: WeatherData): boolean {
    return (
      typeof weather.temperature === 'number' &&
      typeof weather.condition === 'string' &&
      typeof weather.windSpeed === 'number' &&
      typeof weather.windDirection === 'number' &&
      typeof weather.humidity === 'number' &&
      typeof weather.pressure === 'number' &&
      ['dawn', 'day', 'dusk', 'night'].includes(weather.timeOfDay)
    );
  }
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const HARMONY_RULES: Record<string, HarmonyRule> = {
  complementary: {
    type: 'complementary',
    description: 'Colors opposite on the color wheel',
    angleOffsets: [180],
    saturationMultiplier: 1.0,
    lightnessMultiplier: 1.0,
    moodAssociations: ['bold', 'contrasting', 'energetic'],
    useCases: ['high-contrast', 'attention-grabbing', 'modern']
  },
  triadic: {
    type: 'triadic',
    description: 'Three colors equally spaced on the color wheel',
    angleOffsets: [120, 240],
    saturationMultiplier: 0.9,
    lightnessMultiplier: 0.95,
    moodAssociations: ['balanced', 'vibrant', 'harmonious'],
    useCases: ['balanced-design', 'creative', 'playful']
  },
  analogous: {
    type: 'analogous',
    description: 'Colors adjacent on the color wheel',
    angleOffsets: [30, 60],
    saturationMultiplier: 0.8,
    lightnessMultiplier: 0.9,
    moodAssociations: ['calm', 'cohesive', 'natural'],
    useCases: ['subtle', 'nature-inspired', 'minimalist']
  },
  monochromatic: {
    type: 'monochromatic',
    description: 'Variations of the same hue',
    angleOffsets: [0, 0, 0],
    saturationMultiplier: 0.7,
    lightnessMultiplier: 0.8,
    moodAssociations: ['elegant', 'sophisticated', 'unified'],
    useCases: ['elegant', 'professional', 'minimal']
  },
  'split-complementary': {
    type: 'split-complementary',
    description: 'Base color plus two colors adjacent to its complement',
    angleOffsets: [150, 210],
    saturationMultiplier: 0.85,
    lightnessMultiplier: 0.9,
    moodAssociations: ['creative', 'balanced', 'dynamic'],
    useCases: ['creative', 'balanced-contrast', 'modern']
  },
  tetradic: {
    type: 'tetradic',
    description: 'Two pairs of complementary colors',
    angleOffsets: [90, 180, 270],
    saturationMultiplier: 0.75,
    lightnessMultiplier: 0.85,
    moodAssociations: ['rich', 'complex', 'diverse'],
    useCases: ['complex-designs', 'artistic', 'diverse']
  }
};

export const COLOR_TEMPERATURES = {
  warm: {
    hueRanges: [[0, 60], [300, 360]],
    description: 'Reds, oranges, yellows, warm purples',
    moodAssociations: ['energetic', 'passionate', 'comforting', 'exciting']
  },
  cool: {
    hueRanges: [[180, 240]],
    description: 'Blues, cyans, cool greens',
    moodAssociations: ['calm', 'peaceful', 'professional', 'trustworthy']
  },
  neutral: {
    hueRanges: [[60, 180], [240, 300]],
    description: 'Greens, neutral purples, balanced colors',
    moodAssociations: ['balanced', 'natural', 'stable', 'harmonious']
  }
};

export const ACCESSIBILITY_STANDARDS = {
  WCAG_AA: {
    normalText: 4.5,
    largeText: 3.0,
    uiComponents: 3.0
  },
  WCAG_AAA: {
    normalText: 7.0,
    largeText: 4.5,
    uiComponents: 4.5
  }
};

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export type {
  VisualState,
  VisualCharacteristics,
  EnhancedColorPalette,
  ColorHarmonyConfig,
  WeatherData,
  ThemeAnalysis,
  GeneratedParameters,
  ColorAnalysis,
  HarmonyRule,
  TestResults,
  TestDetail,
  ColorValidationResult,
  IntegrationAdapter,
  PerformanceMetrics,
  ColorCache,
  ColorFormat,
  HarmonyAlgorithm,
  ValidationLevel
}; 