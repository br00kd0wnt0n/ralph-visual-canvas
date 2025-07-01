// EnhancedAITypes.ts
// Isolated type definitions for enhanced AI system with color harmony
// No dependencies on existing ai-system types

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

// Constants for color harmony
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

// Color temperature definitions
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

// Accessibility standards
export const ACCESSIBILITY_STANDARDS = {
  WCAG_AA: {
    normalText: 4.5,
    largeText: 3.0,
    uiComponents: 3.0
  },
  WCAG_AAA: {
    normalText: 7.0,
    largeText: 4.5,
    uiComponents: 3.0
  }
}; 