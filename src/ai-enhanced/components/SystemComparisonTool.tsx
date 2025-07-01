// SystemComparisonTool.tsx
// Development UI component for side-by-side system comparison and benchmarking

import React, { useState, useEffect } from 'react';
import { getSafeIntegration, ComparisonResults, IntegrationTestResults } from '../utils/SafeIntegration';
import { getFeatureFlagManager } from '../../config/featureFlags';

interface SystemComparisonToolProps {
  className?: string;
  onClose?: () => void;
}

export const SystemComparisonTool: React.FC<SystemComparisonToolProps> = ({
  className = '',
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [comparisonResults, setComparisonResults] = useState<ComparisonResults[]>([]);
  const [integrationResults, setIntegrationResults] = useState<IntegrationTestResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string>('all');
  const [exportData, setExportData] = useState<any>(null);

  const safeIntegration = getSafeIntegration();
  const featureManager = getFeatureFlagManager();

  useEffect(() => {
    if (isVisible) {
      runComparison();
    }
  }, [isVisible]);

  const runComparison = async () => {
    setIsRunning(true);
    try {
      // Run comprehensive comparison
      const comparison = safeIntegration.compareEnhancedVsOriginal();
      setComparisonResults(comparison);

      // Run integration tests
      const integration = await safeIntegration.runIntegrationTests();
      setIntegrationResults(integration);

      // Generate export data
      const exportResults = {
        timestamp: new Date().toISOString(),
        featureFlags: featureManager.getFlags(),
        comparison: comparison,
        integration: integration,
        systemReport: safeIntegration.generateSystemReport(),
        performanceMetrics: featureManager.exportState()
      };
      setExportData(exportResults);

      console.log('📊 System comparison completed:', exportResults);
    } catch (error) {
      console.error('❌ Comparison failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleExportResults = () => {
    if (!exportData) return;

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `enhanced-ai-comparison-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'colorHarmony': return '🎨';
      case 'interpolation': return '📈';
      case 'contextAnalysis': return '🔍';
      default: return '⚙️';
    }
  };

  const getPerformanceGrade = (improvement: number) => {
    if (improvement >= 50) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' };
    if (improvement >= 25) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (improvement >= 10) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (improvement >= 0) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (improvement >= -10) return { grade: 'D', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getQualityGrade = (improvement: number) => {
    if (improvement >= 100) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' };
    if (improvement >= 50) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (improvement >= 25) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (improvement >= 0) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (improvement >= -25) return { grade: 'D', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const filteredResults = selectedFeature === 'all' 
    ? comparisonResults 
    : comparisonResults.filter(r => r.feature === selectedFeature);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`fixed top-4 left-4 z-50 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 ${className}`}
        title="System Comparison"
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">📊</span>
          <span className="text-sm font-medium">Compare</span>
        </div>
      </button>

      {/* Comparison Interface */}
      {isVisible && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                System Comparison Tool
              </h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={runComparison}
                  disabled={isRunning}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isRunning ? 'Running...' : 'Refresh'}
                </button>
                <button
                  onClick={handleExportResults}
                  disabled={!exportData}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  Export
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Feature Filter */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filter by Feature:
                </label>
                <select
                  value={selectedFeature}
                  onChange={(e) => setSelectedFeature(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Features</option>
                  <option value="colorHarmony">Color Harmony</option>
                  <option value="interpolation">Interpolation</option>
                  <option value="contextAnalysis">Context Analysis</option>
                </select>
              </div>

              {/* Summary Cards */}
              {comparisonResults.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">📊</span>
                      <div>
                        <p className="text-sm text-blue-600 dark:text-blue-400">Total Tests</p>
                        <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                          {comparisonResults.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">⚡</span>
                      <div>
                        <p className="text-sm text-green-600 dark:text-green-400">Avg Performance</p>
                        <p className="text-xl font-bold text-green-900 dark:text-green-100">
                          {comparisonResults.reduce((sum, r) => sum + r.performance.improvement, 0) / comparisonResults.length}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <p className="text-sm text-purple-600 dark:text-purple-400">Avg Quality</p>
                        <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                          {comparisonResults.reduce((sum, r) => sum + r.quality.improvement, 0) / comparisonResults.length}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">🔧</span>
                      <div>
                        <p className="text-sm text-orange-600 dark:text-orange-400">Compatibility</p>
                        <p className="text-xl font-bold text-orange-900 dark:text-orange-100">
                          {comparisonResults.filter(r => r.compatibility).length}/{comparisonResults.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Detailed Comparison */}
              {filteredResults.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Detailed Comparison Results
                  </h3>
                  
                  <div className="space-y-4">
                    {filteredResults.map((result, index) => {
                      const perfGrade = getPerformanceGrade(result.performance.improvement);
                      const qualGrade = getQualityGrade(result.quality.improvement);
                      
                      return (
                        <div
                          key={index}
                          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{getFeatureIcon(result.feature)}</span>
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                                {result.feature.replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${perfGrade.bg} ${perfGrade.color}`}>
                                Performance: {perfGrade.grade}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${qualGrade.bg} ${qualGrade.color}`}>
                                Quality: {qualGrade.grade}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Performance Comparison */}
                            <div className="space-y-3">
                              <h5 className="font-medium text-gray-900 dark:text-white">Performance Analysis</h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Original Response:</span>
                                  <span className="text-gray-900 dark:text-white">{result.performance.original}ms</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Enhanced Response:</span>
                                  <span className="text-gray-900 dark:text-white">{result.performance.enhanced.toFixed(2)}ms</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Improvement:</span>
                                  <span className={`font-medium ${
                                    result.performance.improvement > 0 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {result.performance.improvement > 0 ? '+' : ''}{result.performance.improvement.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Quality Comparison */}
                            <div className="space-y-3">
                              <h5 className="font-medium text-gray-900 dark:text-white">Quality Analysis</h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Original Quality:</span>
                                  <span className="text-gray-900 dark:text-white">{(result.quality.original * 100).toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Enhanced Quality:</span>
                                  <span className="text-gray-900 dark:text-white">{(result.quality.enhanced * 100).toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Improvement:</span>
                                  <span className={`font-medium ${
                                    result.quality.improvement > 0 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {result.quality.improvement > 0 ? '+' : ''}{result.quality.improvement.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Compatibility Status */}
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Compatibility:</span>
                              <span className={`text-sm font-medium ${
                                result.compatibility ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {result.compatibility ? '✅ Compatible' : '❌ Incompatible'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Integration Test Results */}
              {integrationResults && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Integration Test Results
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                          {integrationResults.totalTests}
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">Total Tests</p>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                          {integrationResults.passedTests}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">Passed</p>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                          {integrationResults.failedTests}
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-400">Failed</p>
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Tests */}
                  {integrationResults.compatibilityTests.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">Compatibility Tests</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {integrationResults.compatibilityTests.map((test, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-600 rounded">
                            <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                              {test.feature.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className={`text-sm font-medium ${
                              test.compatible ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {test.compatible ? '✅' : '❌'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Export Information */}
              {exportData && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Export Information</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>Timestamp: {exportData.timestamp}</p>
                    <p>Features Tested: {comparisonResults.length}</p>
                    <p>Integration Tests: {integrationResults?.totalTests || 0}</p>
                    <p>Data Size: {JSON.stringify(exportData).length} bytes</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SystemComparisonTool; 