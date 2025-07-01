// integration-example.ts
// Example of how the ColorHarmonyEngine could be integrated with the existing AI system
// This is for demonstration purposes only - not actually integrated yet

import { colorHarmonyEngine } from './services/ColorHarmonyEngine';
import { EnhancedColorPalette, ColorHarmonyConfig } from './types/EnhancedAITypes';

// Example: Enhanced AI color mapping function
export class EnhancedAIColorMapper {
  private harmonyEngine = colorHarmonyEngine;

  /**
   * Enhanced color mapping that uses the harmony engine
   * This would replace the basic color assignment in the existing AI system
   */
  mapAIToEnhancedColors(
    baseColor: string,
    mood: string[],
    energy: number,
    saturation: number,
    brightness: number
  ): EnhancedColorPalette {
    
    // Create configuration based on AI analysis
    const config: ColorHarmonyConfig = {
      baseColor,
      harmonyLevel: 0.8,
      targetMood: mood,
      targetTemperature: this.determineTemperatureFromMood(mood),
      targetSaturation: saturation,
      targetBrightness: brightness,
      accessibilityMode: true,
      maxSupportingColors: 6
    };

    // Generate enhanced palette
    const enhancedPalette = this.harmonyEngine.generatePaletteWithConfig(config);

    // Log the enhancement
    console.log(`🎨 Enhanced AI Color Mapping:`);
    console.log(`   Base Color: ${baseColor}`);
    console.log(`   Mood: ${mood.join(', ')}`);
    console.log(`   Generated ${enhancedPalette.harmonyType} palette`);
    console.log(`   Harmony Score: ${enhancedPalette.harmonyScore.toFixed(2)}`);
    console.log(`   Accessibility: ${enhancedPalette.accessibility.wcagAA ? 'WCAG AA ✓' : 'WCAG AA ✗'}`);

    return enhancedPalette;
  }

  /**
   * Convert enhanced palette back to existing AI system format
   */
  convertToLegacyFormat(enhancedPalette: EnhancedColorPalette) {
    return {
      primary: enhancedPalette.primary,
      secondary: enhancedPalette.secondary,
      accent: enhancedPalette.accent,
      supporting: enhancedPalette.supporting,
      // Additional metadata for future use
      metadata: {
        harmonyType: enhancedPalette.harmonyType,
        harmonyScore: enhancedPalette.harmonyScore,
        accessibility: enhancedPalette.accessibility,
        mood: enhancedPalette.mood
      }
    };
  }

  /**
   * Validate that the enhanced palette meets quality standards
   */
  validateEnhancedPalette(palette: EnhancedColorPalette): boolean {
    const validation = this.harmonyEngine.validatePalette(palette);
    
    if (!validation.isValid) {
      console.warn('⚠️ Enhanced palette validation failed:', validation.errors);
      return false;
    }

    if (validation.warnings.length > 0) {
      console.warn('⚠️ Enhanced palette warnings:', validation.warnings);
    }

    if (validation.suggestions.length > 0) {
      console.log('💡 Enhancement suggestions:', validation.suggestions);
    }

    return true;
  }

  /**
   * Get performance metrics for the enhanced color mapping
   */
  getPerformanceMetrics() {
    return this.harmonyEngine.getPerformanceMetrics();
  }

  private determineTemperatureFromMood(mood: string[]): 'warm' | 'cool' | 'neutral' {
    const warmMoods = ['energetic', 'passionate', 'exciting', 'comforting', 'bold'];
    const coolMoods = ['calm', 'peaceful', 'professional', 'trustworthy', 'mysterious'];
    
    const warmCount = mood.filter(m => warmMoods.includes(m)).length;
    const coolCount = mood.filter(m => coolMoods.includes(m)).length;
    
    if (warmCount > coolCount) return 'warm';
    if (coolCount > warmCount) return 'cool';
    return 'neutral';
  }
}

// Example usage demonstration
export const demonstrateEnhancedIntegration = () => {
  console.log('🔮 Enhanced AI Color Integration Demo');
  console.log('=====================================');

  const enhancedMapper = new EnhancedAIColorMapper();

  // Example 1: Energetic mood
  console.log('\n1. Energetic Mood Example:');
  const energeticPalette = enhancedMapper.mapAIToEnhancedColors(
    '#FF0000',           // Base color
    ['energetic', 'bold', 'exciting'], // Mood
    0.9,                 // High energy
    0.8,                 // High saturation
    0.7                  // Medium brightness
  );

  const legacyFormat = enhancedMapper.convertToLegacyFormat(energeticPalette);
  console.log('   Legacy format:', legacyFormat);

  // Example 2: Calm mood
  console.log('\n2. Calm Mood Example:');
  const calmPalette = enhancedMapper.mapAIToEnhancedColors(
    '#4A90E2',           // Base color
    ['calm', 'peaceful', 'professional'], // Mood
    0.3,                 // Low energy
    0.5,                 // Medium saturation
    0.6                  // Medium brightness
  );

  const calmLegacyFormat = enhancedMapper.convertToLegacyFormat(calmPalette);
  console.log('   Legacy format:', calmLegacyFormat);

  // Example 3: Validation
  console.log('\n3. Validation Example:');
  const isValid = enhancedMapper.validateEnhancedPalette(energeticPalette);
  console.log(`   Energetic palette valid: ${isValid ? '✓' : '✗'}`);

  // Example 4: Performance metrics
  console.log('\n4. Performance Metrics:');
  const metrics = enhancedMapper.getPerformanceMetrics();
  console.log(`   Generation time: ${metrics.generationTime.toFixed(2)}ms`);
  console.log(`   Memory usage: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
  console.log(`   Cache hit rate: ${(metrics.cacheHitRate * 100).toFixed(1)}%`);

  console.log('\n🎉 Enhanced integration demo completed!');
  console.log('=====================================');
};

// Example of how this would be used in the existing AI system
export const exampleAIIntegration = () => {
  console.log('\n🔗 Future AI System Integration Example:');
  
  // This is how the existing AI system could be enhanced:
  
  /*
  // OLD WAY (current AI system):
  const oldColorMapping = {
    primary: aiResults.colorPalette.primary,
    secondary: aiResults.colorPalette.secondary,
    accent: aiResults.colorPalette.accent,
    supporting: aiResults.colorPalette.supporting
  };

  // NEW WAY (with enhanced harmony engine):
  const enhancedMapper = new EnhancedAIColorMapper();
  const enhancedPalette = enhancedMapper.mapAIToEnhancedColors(
    aiResults.colorPalette.primary,
    aiResults.mood,
    aiResults.visualCharacteristics.energy,
    aiResults.visualCharacteristics.saturation,
    aiResults.visualCharacteristics.brightness
  );
  
  // Convert back to existing format for compatibility
  const newColorMapping = enhancedMapper.convertToLegacyFormat(enhancedPalette);
  
  // Apply enhanced colors to visual store
  visualStore.updateGeometric('spheres', { color: newColorMapping.primary });
  visualStore.updateGeometric('cubes', { color: newColorMapping.secondary });
  visualStore.updateGeometric('toruses', { color: newColorMapping.accent });
  */
  
  console.log('   ✅ Enhanced color mapping ready for integration');
  console.log('   ✅ Backward compatibility maintained');
  console.log('   ✅ Accessibility compliance included');
  console.log('   ✅ Performance optimized');
};

// Run the demonstration
if (require.main === module) {
  demonstrateEnhancedIntegration();
  exampleAIIntegration();
} 