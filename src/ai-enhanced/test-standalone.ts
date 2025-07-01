// test-standalone.ts
// Standalone test script for ColorHarmonyEngine
// Run this to test the isolated color harmony functionality

import { colorHarmonyEngine, testColorHarmonyEngine } from './services/ColorHarmonyEngine';
import { EnhancedColorPalette, ColorHarmonyConfig } from './types/EnhancedAITypes';

console.log('🎨 ColorHarmonyEngine Standalone Test');
console.log('=====================================');

// Test 1: Basic palette generation
console.log('\n1. Testing basic palette generation...');
try {
  const testColors = ['#FF0000', '#00FF00', '#0000FF', '#FFA500', '#800080'];
  
  testColors.forEach(color => {
    console.log(`\n   Testing color: ${color}`);
    const palette = colorHarmonyEngine.generatePalette(color, 0.8);
    console.log(`   Generated ${palette.harmonyType} palette:`);
    console.log(`   - Primary: ${palette.primary}`);
    console.log(`   - Secondary: ${palette.secondary}`);
    console.log(`   - Accent: ${palette.accent}`);
    console.log(`   - Harmony Score: ${palette.harmonyScore.toFixed(2)}`);
    console.log(`   - Contrast Ratio: ${palette.contrastRatio.toFixed(2)}`);
    console.log(`   - Temperature: ${palette.temperature}`);
    console.log(`   - Mood: ${palette.mood.join(', ')}`);
  });
} catch (error) {
  console.error('❌ Error in basic palette generation:', error);
}

// Test 2: Advanced configuration
console.log('\n2. Testing advanced configuration...');
try {
  const config: ColorHarmonyConfig = {
    baseColor: '#FF6B6B',
    harmonyLevel: 0.9,
    targetMood: ['energetic', 'creative'],
    targetTemperature: 'warm',
    targetSaturation: 0.8,
    targetBrightness: 0.7,
    accessibilityMode: true,
    maxSupportingColors: 6
  };
  
  const advancedPalette = colorHarmonyEngine.generatePaletteWithConfig(config);
  console.log(`   Generated advanced palette:`);
  console.log(`   - Harmony Type: ${advancedPalette.harmonyType}`);
  console.log(`   - Supporting Colors: ${advancedPalette.supporting.length}`);
  console.log(`   - Accessibility Score: ${advancedPalette.accessibility.wcagAA ? 'WCAG AA ✓' : 'WCAG AA ✗'}`);
  console.log(`   - Color Blind Friendly: ${advancedPalette.accessibility.colorBlindFriendly ? '✓' : '✗'}`);
} catch (error) {
  console.error('❌ Error in advanced configuration:', error);
}

// Test 3: Color validation
console.log('\n3. Testing color validation...');
try {
  const testPalette = colorHarmonyEngine.generatePalette('#FF0000', 0.8);
  const validation = colorHarmonyEngine.validatePalette(testPalette);
  
  console.log(`   Validation Results:`);
  console.log(`   - Valid: ${validation.isValid ? '✓' : '✗'}`);
  console.log(`   - Harmony Score: ${validation.harmonyScore.toFixed(2)}`);
  console.log(`   - Accessibility Score: ${validation.accessibilityScore.toFixed(2)}`);
  
  if (validation.warnings.length > 0) {
    console.log(`   - Warnings: ${validation.warnings.join(', ')}`);
  }
  
  if (validation.suggestions.length > 0) {
    console.log(`   - Suggestions: ${validation.suggestions.join(', ')}`);
  }
} catch (error) {
  console.error('❌ Error in color validation:', error);
}

// Test 4: Color format conversion
console.log('\n4. Testing color format conversion...');
try {
  const testColor = '#FF6B6B';
  const formats = ['hex', 'rgb', 'hsl', 'hsv'] as const;
  
  formats.forEach(format => {
    const converted = colorHarmonyEngine.convertColor(testColor, format);
    console.log(`   ${testColor} → ${format.toUpperCase()}: ${converted}`);
  });
} catch (error) {
  console.error('❌ Error in color format conversion:', error);
}

// Test 5: Performance metrics
console.log('\n5. Testing performance metrics...');
try {
  const metrics = colorHarmonyEngine.getPerformanceMetrics();
  const cacheStats = colorHarmonyEngine.getCacheStats();
  
  console.log(`   Performance Metrics:`);
  console.log(`   - Generation Time: ${metrics.generationTime.toFixed(2)}ms`);
  console.log(`   - Memory Usage: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
  console.log(`   - Cache Hit Rate: ${(cacheStats.hitRate * 100).toFixed(1)}%`);
  console.log(`   - Cache Size: ${cacheStats.size} entries`);
} catch (error) {
  console.error('❌ Error in performance metrics:', error);
}

// Test 6: Integration adapter
console.log('\n6. Testing integration adapter...');
try {
  const adapter = colorHarmonyEngine.createIntegrationAdapter();
  const testPalette = colorHarmonyEngine.generatePalette('#FF0000', 0.8);
  
  // Test conversion to legacy format
  const legacyFormat = adapter.convertToLegacyFormat(testPalette);
  console.log(`   Legacy format:`, legacyFormat);
  
  // Test conversion from legacy format
  const restoredPalette = adapter.convertFromLegacyFormat(legacyFormat);
  console.log(`   Restored palette primary: ${restoredPalette.primary}`);
  
  // Test integration validation
  const integrationValid = adapter.validateIntegration();
  console.log(`   Integration validation: ${integrationValid ? '✓' : '✗'}`);
} catch (error) {
  console.error('❌ Error in integration adapter:', error);
}

// Test 7: Comprehensive test suite
console.log('\n7. Running comprehensive test suite...');
try {
  const testResults = testColorHarmonyEngine();
  
  console.log(`   Comprehensive Test Results:`);
  console.log(`   - Total Tests: ${testResults.totalTests}`);
  console.log(`   - Passed: ${testResults.passedTests}`);
  console.log(`   - Failed: ${testResults.failedTests}`);
  console.log(`   - Success Rate: ${((testResults.passedTests / testResults.totalTests) * 100).toFixed(1)}%`);
  console.log(`   - Average Generation Time: ${testResults.performanceMetrics.averageGenerationTime.toFixed(2)}ms`);
  console.log(`   - Palette Quality Score: ${testResults.performanceMetrics.paletteQualityScore.toFixed(2)}`);
  
  // Show failed tests if any
  const failedTests = testResults.testDetails.filter(test => !test.passed);
  if (failedTests.length > 0) {
    console.log(`   Failed Tests:`);
    failedTests.forEach(test => {
      console.log(`     - ${test.testName}: ${test.error || test.actual}`);
    });
  }
} catch (error) {
  console.error('❌ Error in comprehensive test suite:', error);
}

// Test 8: Cache management
console.log('\n8. Testing cache management...');
try {
  const initialStats = colorHarmonyEngine.getCacheStats();
  console.log(`   Initial cache size: ${initialStats.size}`);
  
  // Generate some palettes to populate cache
  for (let i = 0; i < 5; i++) {
    const color = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
    colorHarmonyEngine.generatePalette(color, 0.8);
  }
  
  const populatedStats = colorHarmonyEngine.getCacheStats();
  console.log(`   After population: ${populatedStats.size} entries`);
  console.log(`   Cache hit rate: ${(populatedStats.hitRate * 100).toFixed(1)}%`);
  
  // Clear cache
  colorHarmonyEngine.clearCache();
  const clearedStats = colorHarmonyEngine.getCacheStats();
  console.log(`   After clearing: ${clearedStats.size} entries`);
} catch (error) {
  console.error('❌ Error in cache management:', error);
}

console.log('\n🎉 Standalone testing completed!');
console.log('=====================================');

// Export for potential use in other modules
export {
  colorHarmonyEngine,
  testColorHarmonyEngine
}; 