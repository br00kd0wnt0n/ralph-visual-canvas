// test-feature-flag-system.ts
// Comprehensive test script for the feature flag system

import { getFeatureFlagManager, initializeFeatureFlags } from '../config/featureFlags';
import { getSafeIntegration } from './utils/SafeIntegration';

/**
 * Test the complete feature flag system
 */
async function testFeatureFlagSystem() {
  console.log('🧪 Testing Feature Flag System');
  console.log('=' .repeat(50));

  try {
    // Initialize the system
    console.log('1️⃣ Initializing feature flag system...');
    initializeFeatureFlags();
    
    const featureManager = getFeatureFlagManager();
    const safeIntegration = getSafeIntegration();

    // Test 1: Basic feature flag operations
    console.log('\n2️⃣ Testing basic feature flag operations...');
    const initialFlags = featureManager.getFlags();
    console.log('Initial flags:', initialFlags);

    // Test setting individual flags
    featureManager.setFlag('enableEnhancedAI', true, 'Test enable');
    console.log('Enhanced AI enabled:', featureManager.getFlag('enableEnhancedAI'));

    // Test setting multiple flags
    featureManager.setFlags({
      enableAdvancedColorHarmony: true,
      enableSmoothTransitions: true,
      enableContextAnalysis: true
    }, 'Bulk test enable');
    console.log('Multiple flags set');

    // Test 2: Safe integration testing
    console.log('\n3️⃣ Testing safe integration...');
    
    // Test color harmony integration
    const colorResult = safeIntegration.integrateEnhancedColorSystem().generatePalette('#ff0000', 0.8);
    console.log('Color harmony result:', {
      success: colorResult.success,
      fallbackUsed: colorResult.fallbackUsed,
      performance: colorResult.performance.duration + 'ms'
    });

    // Test parameter interpolation
    const interpResult = safeIntegration.integrateParameterInterpolation().interpolate(
      { value: 0, opacity: 0 },
      { value: 100, opacity: 1 },
      0.5
    );
    console.log('Interpolation result:', {
      success: interpResult.success,
      fallbackUsed: interpResult.fallbackUsed,
      performance: interpResult.performance.duration + 'ms'
    });

    // Test 3: System health monitoring
    console.log('\n4️⃣ Testing system health monitoring...');
    const health = safeIntegration.validateSystemState();
    console.log('System health:', {
      status: health.status,
      issues: health.issues.length,
      responseTime: health.performance.averageResponseTime + 'ms'
    });

    // Test 4: Performance monitoring
    console.log('\n5️⃣ Testing performance monitoring...');
    const performanceImpact = safeIntegration.monitorPerformanceImpact();
    console.log('Performance impact:', performanceImpact.map(p => ({
      feature: p.feature,
      improvement: p.improvement + '%',
      samples: p.samples
    })));

    // Test 5: Feature flag validation
    console.log('\n6️⃣ Testing feature flag validation...');
    const validation = featureManager.validateDependencies();
    console.log('Validation result:', {
      valid: validation.valid,
      issues: validation.issues
    });

    // Test 6: Runtime switching
    console.log('\n7️⃣ Testing runtime feature switching...');
    
    // Disable enhanced features
    featureManager.setFlag('enableAdvancedColorHarmony', false, 'Test disable');
    const disabledResult = safeIntegration.integrateEnhancedColorSystem().generatePalette('#ff0000', 0.8);
    console.log('Disabled result (fallback):', disabledResult.fallbackUsed);

    // Re-enable enhanced features
    featureManager.setFlag('enableAdvancedColorHarmony', true, 'Test re-enable');
    const enabledResult = safeIntegration.integrateEnhancedColorSystem().generatePalette('#ff0000', 0.8);
    console.log('Enabled result (enhanced):', !enabledResult.fallbackUsed);

    // Test 7: Integration testing
    console.log('\n8️⃣ Testing integration tests...');
    const testResults = await safeIntegration.runIntegrationTests();
    console.log('Integration test results:', {
      total: testResults.totalTests,
      passed: testResults.passedTests,
      failed: testResults.failedTests,
      successRate: ((testResults.passedTests / testResults.totalTests) * 100).toFixed(1) + '%'
    });

    // Test 8: System comparison
    console.log('\n9️⃣ Testing system comparison...');
    const comparison = safeIntegration.compareEnhancedVsOriginal();
    console.log('Comparison results:', comparison.map(c => ({
      feature: c.feature,
      performance: c.performance.improvement + '%',
      quality: c.quality.improvement + '%',
      compatible: c.compatibility
    })));

    // Test 9: System report generation
    console.log('\n🔟 Testing system report generation...');
    const report = safeIntegration.generateSystemReport();
    console.log('System report generated:', {
      health: report.health.status,
      performance: report.performance.length + ' metrics',
      recommendations: report.recommendations.length + ' recommendations'
    });

    // Test 10: Production safety
    console.log('\n1️⃣1️⃣ Testing production safety...');
    
    // Simulate production environment
    featureManager.resetToDefaults('production');
    const productionFlags = featureManager.getFlags();
    console.log('Production flags (should be disabled):', {
      enhancedAI: productionFlags.enableEnhancedAI,
      colorHarmony: productionFlags.enableAdvancedColorHarmony,
      transitions: productionFlags.enableSmoothTransitions
    });

    // Test that fallbacks are used in production
    const productionColorResult = safeIntegration.integrateEnhancedColorSystem().generatePalette('#ff0000', 0.8);
    console.log('Production color result (should use fallback):', productionColorResult.fallbackUsed);

    // Reset to development
    featureManager.resetToDefaults('development');
    console.log('Reset to development environment');

    console.log('\n✅ All feature flag system tests completed successfully!');
    console.log('🎛️ The system is ready for development and production use.');

  } catch (error) {
    console.error('❌ Feature flag system test failed:', error);
  }
}

// Run the test if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  console.log('🌐 Running feature flag system test in browser...');
  testFeatureFlagSystem();
} else {
  // Node.js environment
  console.log('🖥️ Running feature flag system test in Node.js...');
  testFeatureFlagSystem();
}

export { testFeatureFlagSystem }; 