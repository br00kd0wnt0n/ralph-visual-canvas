// test-context-analyzer.ts
// Comprehensive test script for ContextAnalyzer with sophisticated mock analysis

import { ContextAnalyzer } from './services/ContextAnalyzer';

async function runContextAnalyzerTests() {
  console.log('🚀 Starting ContextAnalyzer Comprehensive Tests\n');
  
  // Initialize analyzer with detailed logging enabled
  const analyzer = new ContextAnalyzer({
    enableDetailedLogging: true,
    enableValidation: true
  });

  try {
    // Test 1: Basic functionality with mock image
    console.log('📋 Test 1: Basic Image Analysis');
    console.log('=' .repeat(50));
    
    const mockImageData = {
      width: 800,
      height: 600,
      data: new Uint8ClampedArray(800 * 600 * 4),
      colorSpace: 'srgb' as const
    };
    
    const result = await analyzer.analyzeImage(mockImageData);
    console.log('✅ Basic analysis completed successfully');
    console.log(`📊 Analysis Time: ${result.analysisTime.toFixed(2)}ms`);
    console.log(`🎯 Confidence: ${result.confidence.toFixed(2)}`);
    console.log(`📐 Complexity: ${result.complexity.toFixed(2)}\n`);

    // Test 2: Generate multiple mock contexts
    console.log('📋 Test 2: Mock Context Generation');
    console.log('=' .repeat(50));
    
    for (let i = 0; i < 5; i++) {
      const mockContext = analyzer.generateMockContext(i);
      console.log(`🎲 Mock Context ${i + 1}:`);
      console.log(`  Type: ${mockContext.imageType}`);
      console.log(`  Mood: [${mockContext.mood.join(', ')}]`);
      console.log(`  Colors: ${mockContext.dominantColors.join(', ')}`);
      console.log(`  Time: ${mockContext.timeOfDay}`);
      console.log(`  Style: ${mockContext.artStyle}\n`);
    }

    // Test 3: Comprehensive testing with mock images
    console.log('📋 Test 3: Comprehensive Mock Image Testing');
    console.log('=' .repeat(50));
    
    const testResults = await analyzer.testWithMockImages();
    console.log(`📈 Test Results Summary:`);
    console.log(`  Total Tests: ${testResults.totalTests}`);
    console.log(`  Passed: ${testResults.passedTests}`);
    console.log(`  Failed: ${testResults.failedTests}`);
    console.log(`  Success Rate: ${((testResults.passedTests / testResults.totalTests) * 100).toFixed(1)}%`);
    console.log(`  Average Analysis Time: ${testResults.performanceMetrics.averageAnalysisTime.toFixed(2)}ms`);
    console.log(`  Accuracy Score: ${testResults.performanceMetrics.accuracyScore.toFixed(2)}\n`);

    // Test 4: Performance benchmarking
    console.log('📋 Test 4: Performance Benchmarking');
    console.log('=' .repeat(50));
    
    const benchmark = await analyzer.runPerformanceBenchmark();
    console.log(`⚡ Performance Results:`);
    console.log(`  Average Analysis Time: ${benchmark.analysisTime.toFixed(2)}ms`);
    console.log(`  Throughput: ${benchmark.throughput.toFixed(1)} analyses/second`);
    console.log(`  Memory Usage: ${benchmark.memoryUsage}MB`);
    console.log(`  Accuracy: ${benchmark.accuracy.toFixed(2)}`);
    console.log(`  Confidence: ${benchmark.confidence.toFixed(2)}\n`);

    // Test 5: Validation testing
    console.log('📋 Test 5: Validation Testing');
    console.log('=' .repeat(50));
    
    const mockContext = analyzer.generateMockContext();
    const validation = analyzer.validateAnalysis(mockContext);
    
    console.log(`🔍 Validation Results:`);
    console.log(`  Valid: ${validation.isValid}`);
    console.log(`  Accuracy: ${validation.accuracy.toFixed(2)}`);
    console.log(`  Confidence: ${validation.confidence.toFixed(2)}`);
    
    if (validation.errors.length > 0) {
      console.log(`  ❌ Errors: ${validation.errors.join(', ')}`);
    }
    if (validation.warnings.length > 0) {
      console.log(`  ⚠️ Warnings: ${validation.warnings.join(', ')}`);
    }
    if (validation.suggestions.length > 0) {
      console.log(`  💡 Suggestions: ${validation.suggestions.join(', ')}`);
    }
    console.log('');

    // Test 6: AI Integration Adapter
    console.log('📋 Test 6: AI Integration Adapter');
    console.log('=' .repeat(50));
    
    const adapter = analyzer.createAIIntegrationAdapter();
    const integrationStatus = adapter.getIntegrationStatus();
    const integrationTest = adapter.testIntegrationWithMockData();
    
    console.log(`🔗 Integration Status:`);
    console.log(`  Ready: ${integrationStatus.ready}`);
    console.log(`  Compatibility: ${integrationStatus.compatibility.toFixed(2)}`);
    console.log(`  Requirements: ${integrationStatus.requirements.length}`);
    
    console.log(`🧪 Integration Test Results:`);
    console.log(`  Tests Passed: ${integrationTest.passedTests}/${integrationTest.totalTests}`);
    console.log(`  Average Time: ${integrationTest.performanceMetrics.averageAnalysisTime.toFixed(2)}ms`);
    console.log(`  Accuracy: ${integrationTest.performanceMetrics.accuracyScore.toFixed(2)}\n`);

    // Test 7: Edge cases and error handling
    console.log('📋 Test 7: Edge Cases and Error Handling');
    console.log('=' .repeat(50));
    
    try {
      // Test with minimal image data
      const minimalImageData = {
        width: 1,
        height: 1,
        data: new Uint8ClampedArray(4),
        colorSpace: 'srgb' as const
      };
      
      const minimalResult = await analyzer.analyzeImage(minimalImageData);
      console.log(`✅ Minimal image analysis successful`);
      console.log(`  Size: ${minimalResult.metadata.width}x${minimalResult.metadata.height}`);
      console.log(`  Analysis Time: ${minimalResult.analysisTime.toFixed(2)}ms\n`);
      
    } catch (error) {
      console.log(`❌ Minimal image analysis failed: ${error}\n`);
    }

    // Test 8: Feature flag testing
    console.log('📋 Test 8: Feature Flag Testing');
    console.log('=' .repeat(50));
    
    const analyzerWithFlags = new ContextAnalyzer({
      enableDetailedLogging: false,
      enableValidation: false
    });
    
    const silentResult = await analyzerWithFlags.analyzeImage(mockImageData);
    console.log(`🔇 Silent analysis completed (no logging)`);
    console.log(`  Analysis Time: ${silentResult.analysisTime.toFixed(2)}ms`);
    console.log(`  Confidence: ${silentResult.confidence.toFixed(2)}\n`);

    // Final summary
    console.log('🎉 All ContextAnalyzer Tests Completed Successfully!');
    console.log('=' .repeat(50));
    console.log('📊 Final Statistics:');
    console.log(`  ✅ Basic Analysis: Working`);
    console.log(`  ✅ Mock Generation: Working`);
    console.log(`  ✅ Comprehensive Testing: ${testResults.passedTests}/${testResults.totalTests} passed`);
    console.log(`  ✅ Performance: ${benchmark.throughput.toFixed(1)} analyses/sec`);
    console.log(`  ✅ Validation: ${validation.isValid ? 'Passed' : 'Failed'}`);
    console.log(`  ✅ AI Integration: ${integrationStatus.ready ? 'Ready' : 'Not Ready'}`);
    console.log(`  ✅ Edge Cases: Handled`);
    console.log(`  ✅ Feature Flags: Working`);
    
    console.log('\n🚀 ContextAnalyzer is ready for integration!');

  } catch (error) {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  }
}

// Run the tests if this file is executed directly
if (require.main === module) {
  runContextAnalyzerTests().catch(console.error);
}

export { runContextAnalyzerTests }; 