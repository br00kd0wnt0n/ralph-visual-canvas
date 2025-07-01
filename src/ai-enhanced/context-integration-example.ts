// context-integration-example.ts
// Comprehensive integration example for ContextAnalyzer with existing AI system

import { ContextAnalyzer } from './services/ContextAnalyzer';
import { ColorHarmonyEngine } from './services/ColorHarmonyEngine';
import { ParameterInterpolator } from './services/ParameterInterpolator';

interface EnhancedVisualParameters {
  // Color parameters
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  colorHarmony: string;
  saturation: number;
  brightness: number;
  
  // Composition parameters
  complexity: number;
  symmetry: number;
  balance: number;
  focusPoints: number;
  
  // Mood parameters
  mood: string[];
  emotionalIntensity: number;
  timeOfDay: string;
  weather: string;
  
  // Style parameters
  artStyle: string;
  textureLevel: number;
  detailLevel: number;
  
  // Animation parameters
  animationSpeed: number;
  particleCount: number;
  waveFrequency: number;
  
  // Performance parameters
  qualityLevel: number;
  optimizationMode: string;
}

class EnhancedAIIntegration {
  private contextAnalyzer: ContextAnalyzer;
  private colorEngine: ColorHarmonyEngine;
  private parameterInterpolator: ParameterInterpolator<Record<string, number>>;
  
  constructor() {
    this.contextAnalyzer = new ContextAnalyzer({
      enableDetailedLogging: true,
      enableValidation: true
    });
    
    this.colorEngine = new ColorHarmonyEngine();
    this.parameterInterpolator = new ParameterInterpolator<Record<string, number>>();
    
    console.log('🎨 Enhanced AI Integration initialized');
  }

  /**
   * Main integration method - analyzes image context and generates enhanced visual parameters
   */
  async analyzeAndEnhance(imageData: ImageData): Promise<EnhancedVisualParameters> {
    console.log('\n🚀 Starting Enhanced AI Analysis and Integration');
    console.log('=' .repeat(60));
    
    const startTime = performance.now();
    
    try {
      // Step 1: Context Analysis
      console.log('📋 Step 1: Image Context Analysis');
      const imageContext = await this.contextAnalyzer.analyzeImage(imageData);
      
      // Step 2: Color Harmony Enhancement
      console.log('📋 Step 2: Color Harmony Enhancement');
      const enhancedColors = this.enhanceColorPalette(imageContext);
      
      // Step 3: Parameter Mapping
      console.log('📋 Step 3: Parameter Mapping and Optimization');
      const visualParameters = this.mapToVisualParameters(imageContext, enhancedColors);
      
      // Step 4: Animation Enhancement
      console.log('📋 Step 4: Animation and Performance Optimization');
      const enhancedParameters = this.enhanceAnimationParameters(visualParameters, imageContext);
      
      const totalTime = performance.now() - startTime;
      
      console.log('\n✅ Enhanced Analysis Complete');
      console.log(`⏱️ Total Processing Time: ${totalTime.toFixed(2)}ms`);
      console.log(`🎯 Confidence: ${imageContext.confidence.toFixed(2)}`);
      console.log(`🎨 Color Harmony: ${enhancedColors.harmonyType}`);
      console.log(`🎭 Mood: [${enhancedParameters.mood.join(', ')}]`);
      console.log(`⚡ Performance Mode: ${enhancedParameters.optimizationMode}`);
      
      return enhancedParameters;
      
    } catch (error) {
      console.error('❌ Enhanced analysis failed:', error);
      throw error;
    }
  }

  /**
   * Enhance color palette using ColorHarmonyEngine
   */
  private enhanceColorPalette(imageContext: any): any {
    const dominantColors = imageContext.dominantColors;
    
    // Generate enhanced color harmony using the first dominant color
    const harmonyResult = this.colorEngine.generatePalette(dominantColors[0], 0.8);
    
    // Create enhanced color palette
    const enhancedPalette = {
      primaryColor: harmonyResult.primary,
      secondaryColor: harmonyResult.secondary,
      accentColor: harmonyResult.accent,
      harmonyType: harmonyResult.harmonyType,
      accessibilityScore: harmonyResult.accessibility.wcagAA ? 1 : 0.5,
      performanceScore: 0.9
    };
    
    console.log(`  🎨 Enhanced Colors: ${enhancedPalette.primaryColor}, ${enhancedPalette.secondaryColor}, ${enhancedPalette.accentColor}`);
    console.log(`  🔗 Harmony Type: ${enhancedPalette.harmonyType} (${enhancedPalette.accessibilityScore.toFixed(2)} accessibility)`);
    
    return enhancedPalette;
  }

  /**
   * Map image context to visual parameters
   */
  private mapToVisualParameters(imageContext: any, enhancedColors: any): EnhancedVisualParameters {
    // Base parameters from context analysis
    const baseParams: EnhancedVisualParameters = {
      // Color parameters
      primaryColor: enhancedColors.primaryColor,
      secondaryColor: enhancedColors.secondaryColor,
      accentColor: enhancedColors.accentColor,
      colorHarmony: enhancedColors.harmonyType,
      saturation: imageContext.saturationLevel || 0.5,
      brightness: imageContext.brightnessLevel || 0.5,
      
      // Composition parameters
      complexity: imageContext.complexity,
      symmetry: imageContext.symmetry || 0.5,
      balance: imageContext.balance || 0.5,
      focusPoints: imageContext.focusPoints || 3,
      
      // Mood parameters
      mood: imageContext.mood,
      emotionalIntensity: this.calculateEmotionalIntensity(imageContext),
      timeOfDay: imageContext.timeOfDay || 'day',
      weather: imageContext.weatherSuggestion || 'clear',
      
      // Style parameters
      artStyle: imageContext.artStyle || 'realistic',
      textureLevel: this.mapTextureLevel(imageContext),
      detailLevel: this.mapDetailLevel(imageContext),
      
      // Animation parameters
      animationSpeed: this.mapAnimationSpeed(imageContext),
      particleCount: this.mapParticleCount(imageContext),
      waveFrequency: this.mapWaveFrequency(imageContext),
      
      // Performance parameters
      qualityLevel: this.mapQualityLevel(imageContext),
      optimizationMode: this.mapOptimizationMode(imageContext)
    };
    
    console.log(`  🎭 Mood Intensity: ${baseParams.emotionalIntensity.toFixed(2)}`);
    console.log(`  🎨 Art Style: ${baseParams.artStyle}`);
    console.log(`  ⚡ Animation Speed: ${baseParams.animationSpeed.toFixed(2)}`);
    console.log(`  🔧 Quality Level: ${baseParams.qualityLevel.toFixed(2)}`);
    
    return baseParams;
  }

  /**
   * Enhance animation parameters based on context
   */
  private enhanceAnimationParameters(params: EnhancedVisualParameters, context: any): EnhancedVisualParameters {
    // Use parameter interpolator to smooth transitions
    const enhancedParams = { ...params };
    
    // Create parameter objects for interpolation
    const fromParams = { speed: params.animationSpeed, brightness: params.brightness, saturation: params.saturation };
    const toParams = { ...fromParams };
    
    // Adjust animation based on mood
    if (context.mood.includes('energetic') || context.mood.includes('vibrant')) {
      toParams.speed = params.animationSpeed * 1.5;
      enhancedParams.particleCount = Math.floor(params.particleCount * 1.3);
    } else if (context.mood.includes('calm') || context.mood.includes('serene')) {
      toParams.speed = params.animationSpeed * 0.7;
      enhancedParams.particleCount = Math.floor(params.particleCount * 0.8);
    }
    
    // Adjust based on time of day
    if (context.timeOfDay === 'night') {
      toParams.brightness = params.brightness * 0.6;
    } else if (context.timeOfDay === 'dawn' || context.timeOfDay === 'dusk') {
      toParams.saturation = params.saturation * 1.2;
    }
    
    // Interpolate parameters
    const interpolatedParams = this.parameterInterpolator.interpolate(fromParams, toParams, 0.8, 'easeInOut');
    enhancedParams.animationSpeed = interpolatedParams.speed;
    enhancedParams.brightness = interpolatedParams.brightness;
    enhancedParams.saturation = interpolatedParams.saturation;
    
    console.log(`  🎬 Enhanced Animation: ${enhancedParams.animationSpeed.toFixed(2)} speed, ${enhancedParams.particleCount} particles`);
    console.log(`  🌅 Time Adaptation: ${enhancedParams.brightness.toFixed(2)} brightness, ${enhancedParams.saturation.toFixed(2)} saturation`);
    
    return enhancedParams;
  }

  /**
   * Helper methods for parameter mapping
   */
  private calculateEmotionalIntensity(context: any): number {
    const moodIntensity: Record<string, number> = {
      'energetic': 0.9, 'vibrant': 0.8, 'dramatic': 0.7,
      'calm': 0.3, 'serene': 0.2, 'peaceful': 0.4,
      'mysterious': 0.6, 'intense': 0.8, 'cheerful': 0.7
    };
    
    const maxIntensity = Math.max(...context.mood.map((mood: string) => moodIntensity[mood] || 0.5));
    return maxIntensity;
  }

  private mapTextureLevel(context: any): number {
    return context.texture || 0.5;
  }

  private mapDetailLevel(context: any): number {
    const styleDetail: Record<string, number> = {
      'detailed': 0.9, 'realistic': 0.8, 'surreal': 0.7,
      'minimalist': 0.3, 'impressionist': 0.6, 'expressionist': 0.7
    };
    return styleDetail[context.artStyle] || 0.5;
  }

  private mapAnimationSpeed(context: any): number {
    const moodSpeed: Record<string, number> = {
      'energetic': 0.9, 'vibrant': 0.8, 'dramatic': 0.7,
      'calm': 0.3, 'serene': 0.2, 'peaceful': 0.4
    };
    
    const maxSpeed = Math.max(...context.mood.map((mood: string) => moodSpeed[mood] || 0.5));
    return maxSpeed;
  }

  private mapParticleCount(context: any): number {
    const baseCount = 100;
    const complexityMultiplier = context.complexity * 2;
    return Math.floor(baseCount * (1 + complexityMultiplier));
  }

  private mapWaveFrequency(context: any): number {
    return 0.3 + (context.complexity * 0.7);
  }

  private mapQualityLevel(context: any): number {
    return 0.6 + (context.confidence * 0.4);
  }

  private mapOptimizationMode(context: any): string {
    if (context.complexity > 0.8) return 'performance';
    if (context.complexity < 0.3) return 'quality';
    return 'balanced';
  }

  /**
   * Generate mock image data for testing
   */
  generateMockImageData(type: string = 'landscape'): ImageData {
    const dimensions: Record<string, { width: number; height: number }> = {
      'landscape': { width: 800, height: 600 },
      'portrait': { width: 600, height: 800 },
      'abstract': { width: 1000, height: 1000 },
      'geometric': { width: 800, height: 800 },
      'organic': { width: 900, height: 700 }
    };
    
    const dim = dimensions[type] || dimensions.landscape;
    return {
      width: dim.width,
      height: dim.height,
      data: new Uint8ClampedArray(dim.width * dim.height * 4),
      colorSpace: 'srgb'
    };
  }

  /**
   * Run comprehensive integration test
   */
  async runIntegrationTest(): Promise<void> {
    console.log('🧪 Running Enhanced AI Integration Test');
    console.log('=' .repeat(60));
    
    const imageTypes = ['landscape', 'portrait', 'abstract', 'geometric', 'organic'];
    
    for (const imageType of imageTypes) {
      console.log(`\n📸 Testing ${imageType.toUpperCase()} image analysis...`);
      
      const mockImageData = this.generateMockImageData(imageType);
      const enhancedParams = await this.analyzeAndEnhance(mockImageData);
      
      console.log(`✅ ${imageType} analysis completed successfully`);
      console.log(`   🎨 Primary Color: ${enhancedParams.primaryColor}`);
      console.log(`   🎭 Mood: [${enhancedParams.mood.join(', ')}]`);
      console.log(`   ⚡ Animation Speed: ${enhancedParams.animationSpeed.toFixed(2)}`);
      console.log(`   🔧 Quality Level: ${enhancedParams.qualityLevel.toFixed(2)}`);
    }
    
    console.log('\n🎉 All integration tests completed successfully!');
  }
}

// Run the integration example
async function runIntegrationExample() {
  const integration = new EnhancedAIIntegration();
  await integration.runIntegrationTest();
}

// Export for use in other modules
export { EnhancedAIIntegration, runIntegrationExample };
export type { EnhancedVisualParameters };

// Run if executed directly
if (require.main === module) {
  runIntegrationExample().catch(console.error);
} 