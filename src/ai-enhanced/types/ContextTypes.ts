// ContextTypes.ts
// Type definitions for the isolated image context analyzer
// Standalone image analysis with no dependencies on existing AI system

export interface ImageContext {
  dominantColors: string[];
  imageType: 'landscape' | 'portrait' | 'abstract' | 'geometric' | 'organic' | 'mixed';
  complexity: number; // 0-1
  mood: string[];
  timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night';
  weatherSuggestion?: string;
  artStyle?: 'realistic' | 'surreal' | 'minimalist' | 'detailed' | 'impressionist' | 'expressionist';
  confidence: number; // 0-1
  analysisTime: number; // processing time in ms
  metadata: {
    width: number;
    height: number;
    aspectRatio: number;
    totalPixels: number;
    processingSteps: string[];
  };
}

export interface ColorAnalysis {
  dominantColors: string[];
  colorVariance: number; // 0-1, how varied the colors are
  brightnessLevel: number; // 0-1, overall brightness
  saturationLevel: number; // 0-1, overall saturation
  warmth: number; // -1 (cool) to 1 (warm)
  colorDistribution: {
    red: number;
    green: number;
    blue: number;
    warm: number;
    cool: number;
    neutral: number;
  };
  colorHarmony: {
    type: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'mixed';
    score: number; // 0-1, how harmonious the colors are
  };
}

export interface CompositionAnalysis {
  symmetry: number; // 0-1, how symmetrical the image is
  balance: number; // 0-1, visual balance
  complexity: number; // 0-1, visual complexity
  focusPoints: number; // number of distinct focal points
  ruleOfThirds: number; // 0-1, adherence to rule of thirds
  depth: number; // 0-1, perceived depth
  texture: number; // 0-1, texture complexity
  edges: {
    horizontal: number;
    vertical: number;
    diagonal: number;
    total: number;
  };
}

export interface TextureAnalysis {
  roughness: number; // 0-1, surface roughness
  pattern: 'uniform' | 'varied' | 'repetitive' | 'random';
  density: number; // 0-1, texture density
  directionality: number; // 0-1, directional texture patterns
}

export interface LightingAnalysis {
  intensity: number; // 0-1, overall light intensity
  direction: 'top' | 'side' | 'bottom' | 'diffuse' | 'mixed';
  shadows: number; // 0-1, shadow presence
  highlights: number; // 0-1, highlight presence
  contrast: number; // 0-1, light-dark contrast
}

export interface MoodAnalysis {
  primaryMood: string;
  secondaryMoods: string[];
  emotionalIntensity: number; // 0-1
  moodConfidence: number; // 0-1
  moodFactors: {
    color: number;
    composition: number;
    lighting: number;
    texture: number;
  };
}

export interface TimeOfDayAnalysis {
  detectedTime: 'dawn' | 'day' | 'dusk' | 'night' | 'unknown';
  confidence: number; // 0-1
  indicators: {
    brightness: number;
    colorTemperature: number;
    shadowLength: number;
    skyColor: number;
  };
}

export interface WeatherAnalysis {
  suggestedWeather: string;
  confidence: number; // 0-1
  indicators: {
    cloudCover: number;
    precipitation: number;
    wind: number;
    visibility: number;
  };
}

export interface ArtStyleAnalysis {
  detectedStyle: 'realistic' | 'surreal' | 'minimalist' | 'detailed' | 'impressionist' | 'expressionist' | 'mixed';
  confidence: number; // 0-1
  styleCharacteristics: {
    detailLevel: number;
    abstraction: number;
    colorUse: number;
    brushwork: number;
  };
}

export interface AnalysisResult {
  imageContext: ImageContext;
  colorAnalysis: ColorAnalysis;
  compositionAnalysis: CompositionAnalysis;
  textureAnalysis: TextureAnalysis;
  lightingAnalysis: LightingAnalysis;
  moodAnalysis: MoodAnalysis;
  timeOfDayAnalysis: TimeOfDayAnalysis;
  weatherAnalysis: WeatherAnalysis;
  artStyleAnalysis: ArtStyleAnalysis;
  processingMetrics: {
    totalTime: number;
    stepTimes: Record<string, number>;
    memoryUsage: number;
    accuracy: number;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  accuracy: number; // 0-1
  confidence: number; // 0-1
  performance: {
    analysisTime: number;
    memoryUsage: number;
    complexity: number;
  };
}

export interface TestResults {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  testDetails: TestDetail[];
  performanceMetrics: {
    averageAnalysisTime: number;
    memoryUsage: number;
    accuracyScore: number;
    confidenceScore: number;
  };
  testScenarios: TestScenario[];
}

export interface TestDetail {
  testName: string;
  passed: boolean;
  expected: any;
  actual: any;
  error?: string;
  executionTime: number;
  accuracy: number;
}

export interface TestScenario {
  name: string;
  description: string;
  mockImageData: MockImageData;
  expectedContext: Partial<ImageContext>;
  complexity: number;
}

export interface MockImageData {
  width: number;
  height: number;
  data: Uint8ClampedArray;
  type: 'landscape' | 'portrait' | 'abstract' | 'geometric' | 'organic';
  mood: string[];
  timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night';
  artStyle?: string;
  seed?: number;
}

export interface PerformanceMetrics {
  analysisTime: number;
  memoryUsage: number;
  throughput: number; // images per second
  accuracy: number;
  confidence: number;
  complexity: number;
}

export interface AIIntegrationAdapter {
  // Future integration with existing AI system
  combineWithExistingAnalysis(
    existingAnalysis: any, 
    contextAnalysis: ImageContext
  ): EnhancedAnalysis;
  
  // Test integration without affecting existing system
  testIntegrationWithMockData(): TestResults;
  
  // Validate integration compatibility
  validateIntegrationCompatibility(): ValidationResult;
  
  // Get integration status
  getIntegrationStatus(): {
    ready: boolean;
    compatibility: number;
    requirements: string[];
  };
}

export interface EnhancedAnalysis {
  originalAnalysis: any;
  contextAnalysis: ImageContext;
  combinedInsights: {
    enhancedMood: string[];
    improvedConfidence: number;
    additionalContext: Record<string, any>;
  };
  integrationMetrics: {
    enhancementScore: number;
    compatibilityScore: number;
    processingTime: number;
  };
}

// Feature flags for controlled activation
export interface FeatureFlags {
  enableColorAnalysis: boolean;
  enableCompositionAnalysis: boolean;
  enableTextureAnalysis: boolean;
  enableLightingAnalysis: boolean;
  enableMoodAnalysis: boolean;
  enableTimeOfDayAnalysis: boolean;
  enableWeatherAnalysis: boolean;
  enableArtStyleAnalysis: boolean;
  enablePerformanceOptimization: boolean;
  enableDetailedLogging: boolean;
  enableValidation: boolean;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  enableColorAnalysis: true,
  enableCompositionAnalysis: true,
  enableTextureAnalysis: true,
  enableLightingAnalysis: true,
  enableMoodAnalysis: true,
  enableTimeOfDayAnalysis: true,
  enableWeatherAnalysis: true,
  enableArtStyleAnalysis: true,
  enablePerformanceOptimization: true,
  enableDetailedLogging: true,
  enableValidation: true
};

// Mock data generation types
export interface MockDataGenerator {
  generateMockImageData(type: string, seed?: number): MockImageData;
  generateMockContext(seed?: number): ImageContext;
  generateTestScenarios(): TestScenario[];
}

// Analysis configuration
export interface AnalysisConfig {
  colorAnalysisDepth: 'basic' | 'detailed' | 'comprehensive';
  compositionAnalysisDepth: 'basic' | 'detailed' | 'comprehensive';
  moodAnalysisSensitivity: number; // 0-1
  timeOfDaySensitivity: number; // 0-1
  weatherAnalysisSensitivity: number; // 0-1;
  artStyleAnalysisSensitivity: number; // 0-1;
  performanceMode: 'fast' | 'balanced' | 'accurate';
  maxProcessingTime: number; // milliseconds
}

export const DEFAULT_ANALYSIS_CONFIG: AnalysisConfig = {
  colorAnalysisDepth: 'detailed',
  compositionAnalysisDepth: 'detailed',
  moodAnalysisSensitivity: 0.7,
  timeOfDaySensitivity: 0.6,
  weatherAnalysisSensitivity: 0.5,
  artStyleAnalysisSensitivity: 0.6,
  performanceMode: 'balanced',
  maxProcessingTime: 100
};

// Utility types
export type ImageType = 'landscape' | 'portrait' | 'abstract' | 'geometric' | 'organic' | 'mixed';
export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';
export type ArtStyle = 'realistic' | 'surreal' | 'minimalist' | 'detailed' | 'impressionist' | 'expressionist';
export type MoodType = 'calm' | 'energetic' | 'mysterious' | 'cheerful' | 'melancholic' | 'dramatic' | 'peaceful' | 'intense';

// Analysis step types
export type AnalysisStep = 
  | 'color_analysis'
  | 'composition_analysis'
  | 'texture_analysis'
  | 'lighting_analysis'
  | 'mood_analysis'
  | 'time_of_day_analysis'
  | 'weather_analysis'
  | 'art_style_analysis'
  | 'context_synthesis';

// Error types
export interface AnalysisError {
  type: 'validation_error' | 'processing_error' | 'timeout_error' | 'memory_error';
  message: string;
  step: AnalysisStep;
  timestamp: number;
  recoverable: boolean;
} 