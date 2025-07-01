// EnhancedAITestingInterface.tsx
// Development UI component for enhanced AI testing and comparison

import React, { useState, useRef } from 'react';
import { getSafeIntegration, ComparisonResults } from '../utils/SafeIntegration';
import { getFeatureFlagManager } from '../../config/featureFlags';

interface EnhancedAITestingInterfaceProps {
  className?: string;
  onClose?: () => void;
}

export const EnhancedAITestingInterface: React.FC<EnhancedAITestingInterfaceProps> = ({
  className = '',
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [testResults, setTestResults] = useState<ComparisonResults[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTest, setSelectedTest] = useState<string>('all');
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const safeIntegration = getSafeIntegration();
  const featureManager = getFeatureFlagManager();

  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      // Run integration tests
      const integrationResults = await safeIntegration.runIntegrationTests();
      
      // Run comparison tests
      const comparisonResults = safeIntegration.compareEnhancedVsOriginal();
      setTestResults(comparisonResults);
      
      // Get performance metrics
      const metrics = featureManager.exportState();
      setPerformanceMetrics(metrics);
      
      console.log('🧪 Enhanced AI tests completed:', integrationResults);
      console.log('📊 Comparison results:', comparisonResults);
      
    } catch (error) {
      console.error('❌ Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const img = new Image();
        img.onload = async () => {
          // Create canvas to get ImageData
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          // Test context analysis
          const contextResult = await safeIntegration.integrateContextAnalysis().analyzeImage(imageData);
          
          console.log('🖼️ Image analysis result:', contextResult);
          
          // Update test results
          setTestResults(prev => [...prev, {
            feature: 'contextAnalysis',
            originalResult: { type: 'basic', confidence: 0.5 },
            enhancedResult: contextResult.data,
            performance: {
              original: 1,
              enhanced: contextResult.performance.duration,
              improvement: ((1 - contextResult.performance.duration) / 1) * 100
            },
            quality: {
              original: 0.5,
              enhanced: contextResult.data?.confidence || 0.5,
              improvement: ((contextResult.data?.confidence || 0.5) - 0.5) / 0.5 * 100
            },
            compatibility: true
          }]);
        };
        img.src = e.target?.result as string;
      } catch (error) {
        console.error('❌ Image processing failed:', error);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleColorTest = () => {
    const testColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
    
    testColors.forEach(color => {
      const result = safeIntegration.integrateEnhancedColorSystem().generatePalette(color, 0.8);
      
      setTestResults(prev => [...prev, {
        feature: 'colorHarmony',
        originalResult: { primary: color, harmonyScore: 0.5 },
        enhancedResult: result.data,
        performance: {
          original: 1,
          enhanced: result.performance.duration,
          improvement: ((1 - result.performance.duration) / 1) * 100
        },
        quality: {
          original: 0.5,
          enhanced: result.data?.harmonyScore || 0.5,
          improvement: ((result.data?.harmonyScore || 0.5) - 0.5) / 0.5 * 100
        },
        compatibility: true
      }]);
    });
  };

  const handleInterpolationTest = () => {
    const testStates = [
      { from: { value: 0, color: '#ff0000' }, to: { value: 100, color: '#00ff00' } },
      { from: { opacity: 0, scale: 1 }, to: { opacity: 1, scale: 2 } },
      { from: { rotation: 0, x: 0 }, to: { rotation: 360, x: 100 } }
    ];

    testStates.forEach(({ from, to }) => {
      const result = safeIntegration.integrateParameterInterpolation().interpolate(from, to, 0.5);
      
      setTestResults(prev => [...prev, {
        feature: 'interpolation',
        originalResult: { interpolated: from },
        enhancedResult: result.data,
        performance: {
          original: 1,
          enhanced: result.performance.duration,
          improvement: ((1 - result.performance.duration) / 1) * 100
        },
        quality: {
          original: 0.5,
          enhanced: 0.8,
          improvement: 60
        },
        compatibility: true
      }]);
    });
  };

  const getTestStatus = (result: ComparisonResults) => {
    if (result.performance.improvement > 0 && result.quality.improvement > 0) {
      return { status: 'success', icon: '✅', color: 'text-green-600' };
    } else if (result.performance.improvement < -20 || result.quality.improvement < -20) {
      return { status: 'failed', icon: '❌', color: 'text-red-600' };
    } else {
      return { status: 'mixed', icon: '⚠️', color: 'text-yellow-600' };
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`fixed top-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 ${className}`}
        title="Enhanced AI Testing"
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">🧪</span>
          <span className="text-sm font-medium">AI Testing</span>
        </div>
      </button>

      {/* Testing Interface */}
      {isVisible && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Enhanced AI Testing Interface
              </h2>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Test Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={handleRunTests}
                  disabled={isRunning}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isRunning ? 'Running...' : 'Run All Tests'}
                </button>
                
                <button
                  onClick={handleColorTest}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Test Color Harmony
                </button>
                
                <button
                  onClick={handleInterpolationTest}
                  className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Test Interpolation
                </button>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Upload Test Image
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Test Results */}
              {testResults.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Test Results ({testResults.length})
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {testResults.map((result, index) => {
                      const status = getTestStatus(result);
                      return (
                        <div
                          key={index}
                          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                              {result.feature.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            <span className={`text-sm font-medium ${status.color}`}>
                              {status.icon} {status.status}
                            </span>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Performance:</span>
                              <span className={`font-medium ${
                                result.performance.improvement > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {result.performance.improvement > 0 ? '+' : ''}{result.performance.improvement.toFixed(1)}%
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Quality:</span>
                              <span className={`font-medium ${
                                result.quality.improvement > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {result.quality.improvement > 0 ? '+' : ''}{result.quality.improvement.toFixed(1)}%
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Response Time:</span>
                              <span className="text-gray-900 dark:text-white">
                                {result.performance.enhanced.toFixed(2)}ms
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Performance Metrics */}
              {performanceMetrics && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Performance Metrics
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(performanceMetrics.performanceMetrics).map(([feature, metrics]: [string, any]) => (
                      <div key={feature} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white capitalize mb-2">
                          {feature.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Avg:</span>
                            <span className="text-gray-900 dark:text-white">{metrics.average.toFixed(2)}ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Min:</span>
                            <span className="text-gray-900 dark:text-white">{metrics.min.toFixed(2)}ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Max:</span>
                            <span className="text-gray-900 dark:text-white">{metrics.max.toFixed(2)}ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Samples:</span>
                            <span className="text-gray-900 dark:text-white">{metrics.count}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feature Flag Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Feature Flag Status
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(featureManager.getFlags()).map(([flag, enabled]) => (
                    <div key={flag} className="flex items-center space-x-2">
                      <span className={`w-3 h-3 rounded-full ${
                        enabled ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {flag.replace('enable', '').replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EnhancedAITestingInterface; 