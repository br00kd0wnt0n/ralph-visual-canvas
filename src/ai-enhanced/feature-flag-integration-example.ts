// feature-flag-integration-example.ts
// Comprehensive example demonstrating the complete feature flag system
// Shows safe integration, development UI, and production safety

import { getFeatureFlagManager, initializeFeatureFlags } from '../config/featureFlags';
import { getSafeIntegration, SafeIntegration } from './utils/SafeIntegration';

/**
 * Complete Feature Flag Integration Example
 * Demonstrates safe integration with enhanced AI features
 */
export class FeatureFlagIntegrationExample {
  private featureManager = getFeatureFlagManager();
  private safeIntegration = getSafeIntegration();

  constructor() {
    console.log('🚀 Feature Flag Integration Example initialized');
    this.initializeSystem();
  }

  /**
   * Initialize the feature flag system
   */
  private initializeSystem(): void {
    // Initialize feature flags from environment variables
    initializeFeatureFlags();
    
    // Log current state
    const flags = this.featureManager.getFlags();
    console.log('📋 Current feature flags:', flags);
    
    // Validate system state
    const validation = this.featureManager.validateDependencies();
    if (!validation.valid) {
      console.warn('⚠️ Feature flag validation issues:', validation.issues);
    }
  }

  /**
   * Example: Safe color harmony integration
   */
  async demonstrateColorHarmonyIntegration(): Promise<void> {
    console.log('\n🎨 Demonstrating Color Harmony Integration');
    
    const baseColor = '#ff6b6b';
    const harmonyLevel = 0.8;

    // Safe execution with fallback
    const result = this.safeIntegration.safelyExecute(
      'enableAdvancedColorHarmony',
      () => {
        // Enhanced color harmony
        return this.safeIntegration.integrateEnhancedColorSystem().generatePalette(baseColor, harmonyLevel);
      },
      () => {
        // Fallback to basic color generation
        return {
          success: true,
          data: {
            primary: baseColor,
            secondary: this.adjustColor(baseColor, 30),
            accent: this.adjustColor(baseColor, 180),
            harmonyType: 'basic',
            harmonyScore: 0.5
          },
          performance: { duration: 1, feature: 'colorHarmony', timestamp: new Date() },
          fallbackUsed: true
        };
      },
      (error) => {
        console.error('❌ Color harmony error:', error);
        return {
          success: false,
          data: null,
          error: error.message,
          performance: { duration: 0, feature: 'colorHarmony', timestamp: new Date() },
          fallbackUsed: true
        };
      }
    );

    console.log('✅ Color harmony result:', result);
    
    if (result.success && result.data) {
      console.log(`🎨 Generated palette with ${result.data.harmonyType} harmony`);
      console.log(`📊 Harmony score: ${result.data.harmonyScore}`);
      console.log(`⚡ Performance: ${result.performance.duration.toFixed(2)}ms`);
    }
  }

  /**
   * Example: Safe parameter interpolation
   */
  async demonstrateParameterInterpolation(): Promise<void> {
    console.log('\n📈 Demonstrating Parameter Interpolation');
    
    const fromState = { opacity: 0, scale: 1, rotation: 0 };
    const toState = { opacity: 1, scale: 2, rotation: 360 };
    const progress = 0.5;

    // Conditional feature execution
    const result = this.safeIntegration.withFeature('enableSmoothTransitions', () => {
      return this.safeIntegration.integrateParameterInterpolation().interpolate(
        fromState, 
        toState, 
        progress, 
        'easeInOut'
      );
    });

    if (result) {
      console.log('✅ Enhanced interpolation result:', result);
      console.log(`⚡ Performance: ${result.performance.duration.toFixed(2)}ms`);
    } else {
      console.log('🔄 Using fallback interpolation');
      // Fallback interpolation
      const fallbackResult = this.linearInterpolation(fromState, toState, progress);
      console.log('📊 Fallback result:', fallbackResult);
    }
  }

  /**
   * Example: Safe context analysis
   */
  async demonstrateContextAnalysis(): Promise<void> {
    console.log('\n🔍 Demonstrating Context Analysis');
    
    // Create mock image data for testing
    const mockImageData = this.createMockImageData(100, 100);
    
    try {
      const result = await this.safeIntegration.integrateContextAnalysis().analyzeImage(mockImageData);
      
      console.log('✅ Context analysis result:', result);
      
      if (result.success && result.data) {
        console.log(`🖼️ Image type: ${result.data.imageType}`);
        console.log(`🎨 Dominant colors: ${result.data.dominantColors?.length || 0}`);
        console.log(`📊 Complexity: ${result.data.complexity}`);
        console.log(`⚡ Performance: ${result.performance.duration.toFixed(2)}ms`);
      }
    } catch (error) {
      console.error('❌ Context analysis failed:', error);
    }
  }

  /**
   * Example: System health monitoring
   */
  async demonstrateSystemHealthMonitoring(): Promise<void> {
    console.log('\n🏥 Demonstrating System Health Monitoring');
    
    // Generate system report
    const systemReport = this.safeIntegration.generateSystemReport();
    
    console.log('📊 System Health Report:');
    console.log(`   Status: ${systemReport.health.status}`);
    console.log(`   Issues: ${systemReport.health.issues.length}`);
    console.log(`   Response Time: ${systemReport.health.performance.averageResponseTime.toFixed(2)}ms`);
    console.log(`   Error Rate: ${(systemReport.health.performance.errorRate * 100).toFixed(2)}%`);
    
    // Performance impact analysis
    const performanceImpact = this.safeIntegration.monitorPerformanceImpact();
    console.log('\n⚡ Performance Impact Analysis:');
    performanceImpact.forEach(impact => {
      console.log(`   ${impact.feature}: ${impact.improvement > 0 ? '+' : ''}${impact.improvement.toFixed(1)}% improvement`);
    });
    
    // Recommendations
    if (systemReport.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      systemReport.recommendations.forEach(rec => console.log(`   - ${rec}`));
    }
  }

  /**
   * Example: Feature flag runtime switching
   */
  async demonstrateRuntimeSwitching(): Promise<void> {
    console.log('\n🔄 Demonstrating Runtime Feature Switching');
    
    // Test with enhanced features disabled
    console.log('📋 Testing with enhanced features disabled...');
    this.featureManager.setFlag('enableAdvancedColorHarmony', false, 'Testing fallback');
    
    const disabledResult = this.safeIntegration.integrateEnhancedColorSystem().generatePalette('#ff0000', 0.8);
    console.log('🔄 Disabled result (fallback):', disabledResult.fallbackUsed);
    
    // Enable enhanced features
    console.log('\n📋 Enabling enhanced features...');
    this.featureManager.setFlag('enableAdvancedColorHarmony', true, 'Testing enhanced');
    
    const enabledResult = this.safeIntegration.integrateEnhancedColorSystem().generatePalette('#ff0000', 0.8);
    console.log('✅ Enabled result (enhanced):', !enabledResult.fallbackUsed);
    
    // Compare performance
    console.log(`⚡ Performance comparison:`);
    console.log(`   Disabled: ${disabledResult.performance.duration.toFixed(2)}ms`);
    console.log(`   Enabled: ${enabledResult.performance.duration.toFixed(2)}ms`);
  }

  /**
   * Example: Integration testing
   */
  async demonstrateIntegrationTesting(): Promise<void> {
    console.log('\n🧪 Demonstrating Integration Testing');
    
    try {
      // Run comprehensive integration tests
      const testResults = await this.safeIntegration.runIntegrationTests();
      
      console.log('📊 Integration Test Results:');
      console.log(`   Total Tests: ${testResults.totalTests}`);
      console.log(`   Passed: ${testResults.passedTests}`);
      console.log(`   Failed: ${testResults.failedTests}`);
      console.log(`   Success Rate: ${((testResults.passedTests / testResults.totalTests) * 100).toFixed(1)}%`);
      
      // Performance tests
      if (testResults.performanceTests.length > 0) {
        console.log('\n⚡ Performance Test Results:');
        testResults.performanceTests.forEach(test => {
          console.log(`   ${test.feature}: ${test.improvement > 0 ? '+' : ''}${test.improvement.toFixed(1)}% improvement`);
        });
      }
      
      // Compatibility tests
      if (testResults.compatibilityTests.length > 0) {
        console.log('\n🔧 Compatibility Test Results:');
        testResults.compatibilityTests.forEach(test => {
          console.log(`   ${test.feature}: ${test.compatible ? '✅' : '❌'} ${test.issues.length > 0 ? `(${test.issues.join(', ')})` : ''}`);
        });
      }
      
    } catch (error) {
      console.error('❌ Integration testing failed:', error);
    }
  }

  /**
   * Example: Production safety demonstration
   */
  async demonstrateProductionSafety(): Promise<void> {
    console.log('\n🛡️ Demonstrating Production Safety');
    
    // Simulate production environment
    console.log('🏭 Simulating production environment...');
    this.featureManager.resetToDefaults('production');
    
    const productionFlags = this.featureManager.getFlags();
    console.log('📋 Production feature flags:', productionFlags);
    
    // Test that enhanced features are safely disabled
    const colorResult = this.safeIntegration.integrateEnhancedColorSystem().generatePalette('#ff0000', 0.8);
    console.log('🔄 Production color result (should use fallback):', colorResult.fallbackUsed);
    
    const interpResult = this.safeIntegration.integrateParameterInterpolation().interpolate(
      { value: 0 }, 
      { value: 100 }, 
      0.5
    );
    console.log('🔄 Production interpolation result (should use fallback):', interpResult.fallbackUsed);
    
    // Validate system state
    const validation = this.featureManager.validateDependencies();
    console.log('✅ Production validation:', validation.valid ? 'PASSED' : 'FAILED');
    
    // Reset to development for continued testing
    this.featureManager.resetToDefaults('development');
    console.log('🔄 Reset to development environment');
  }

  /**
   * Run complete demonstration
   */
  async runCompleteDemonstration(): Promise<void> {
    console.log('🚀 Starting Complete Feature Flag Integration Demonstration');
    console.log('=' .repeat(60));
    
    try {
      await this.demonstrateColorHarmonyIntegration();
      await this.demonstrateParameterInterpolation();
      await this.demonstrateContextAnalysis();
      await this.demonstrateSystemHealthMonitoring();
      await this.demonstrateRuntimeSwitching();
      await this.demonstrateIntegrationTesting();
      await this.demonstrateProductionSafety();
      
      console.log('\n' + '=' .repeat(60));
      console.log('✅ Complete demonstration finished successfully!');
      console.log('🎛️ Use the development UI components to interact with the system:');
      console.log('   - FeatureTogglePanel: Real-time feature flag controls');
      console.log('   - EnhancedAITestingInterface: Comprehensive testing interface');
      console.log('   - SystemComparisonTool: Side-by-side comparison and benchmarking');
      
    } catch (error) {
      console.error('❌ Demonstration failed:', error);
    }
  }

  // Helper methods

  private adjustColor(color: string, hueShift: number): string {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const factor = 1.2;
    const newR = Math.min(255, Math.round(r * factor));
    const newG = Math.min(255, Math.round(g * factor));
    const newB = Math.min(255, Math.round(b * factor));
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }

  private linearInterpolation(from: Record<string, any>, to: Record<string, any>, progress: number): Record<string, any> {
    const result: Record<string, any> = {};
    
    Object.keys(from).forEach(key => {
      if (typeof from[key] === 'number' && typeof to[key] === 'number') {
        result[key] = from[key] + (to[key] - from[key]) * progress;
      } else {
        result[key] = progress > 0.5 ? to[key] : from[key];
      }
    });
    
    return result;
  }

  private createMockImageData(width: number, height: number): ImageData {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not create canvas context');
    }
    
    canvas.width = width;
    canvas.height = height;
    
    // Create a simple gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#ff0000');
    gradient.addColorStop(1, '#0000ff');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    return ctx.getImageData(0, 0, width, height);
  }
}

// Example usage (uncomment to run)
/*
const example = new FeatureFlagIntegrationExample();
example.runCompleteDemonstration();
*/ 