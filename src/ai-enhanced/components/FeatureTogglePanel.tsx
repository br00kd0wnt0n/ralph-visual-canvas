// FeatureTogglePanel.tsx
// Development UI component for feature flag testing and monitoring

import React, { useState, useEffect } from 'react';
import { getFeatureFlagManager, FeatureFlags } from '../../config/featureFlags';
import { getSafeIntegration, SystemReport } from '../utils/SafeIntegration';

interface FeatureTogglePanelProps {
  className?: string;
  showPerformance?: boolean;
  showHealth?: boolean;
}

export const FeatureTogglePanel: React.FC<FeatureTogglePanelProps> = ({
  className = '',
  showPerformance = true,
  showHealth = true
}) => {
  const featureManager = getFeatureFlagManager();
  const safeIntegration = getSafeIntegration();
  
  const [flags, setFlags] = useState<FeatureFlags>(featureManager.getFlags());
  const [systemReport, setSystemReport] = useState<SystemReport | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    // Initialize flags
    setFlags(featureManager.getFlags());

    // Subscribe to flag changes
    const unsubscribe = featureManager.subscribeToAll((newFlags) => {
      setFlags(newFlags);
      setLastUpdate(new Date());
    });

    // Generate initial system report
    if (showHealth) {
      setSystemReport(safeIntegration.generateSystemReport());
    }

    return unsubscribe;
  }, [showHealth]);

  const handleFlagToggle = (flag: keyof FeatureFlags, value: boolean) => {
    featureManager.setFlag(flag, value, 'Manual toggle via UI');
  };

  const handleMasterToggle = (enabled: boolean) => {
    const updates: Partial<FeatureFlags> = {
      enableEnhancedAI: enabled,
      enableAdvancedColorHarmony: enabled,
      enableSmoothTransitions: enabled,
      enableContextAnalysis: enabled,
      enableAdvancedPresets: enabled,
      enablePresetScoring: enabled,
      enableAIIntegration: enabled,
      enableVisualStoreIntegration: enabled,
      enableRealTimeUpdates: enabled
    };
    
    featureManager.setFlags(updates, `Master toggle: ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleResetToDefaults = () => {
    featureManager.resetToDefaults('development');
  };

  const handleGenerateReport = () => {
    setSystemReport(safeIntegration.generateSystemReport());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'unhealthy': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '🟢';
      case 'degraded': return '🟡';
      case 'unhealthy': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Collapsed Panel */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200"
          title="Enhanced AI Features"
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg">🎛️</span>
            <span className="text-sm font-medium">AI Features</span>
            {systemReport && (
              <span className={`text-xs ${getStatusColor(systemReport.health.status)}`}>
                {getStatusIcon(systemReport.health.status)}
              </span>
            )}
          </div>
        </button>
      )}

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-96 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Enhanced AI Features
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Master Controls */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Master Controls</h4>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Enhanced AI</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleMasterToggle(true)}
                    className={`px-2 py-1 text-xs rounded ${
                      flags.enableEnhancedAI
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Enable All
                  </button>
                  <button
                    onClick={() => handleMasterToggle(false)}
                    className={`px-2 py-1 text-xs rounded ${
                      !flags.enableEnhancedAI
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Disable All
                  </button>
                </div>
              </div>
            </div>

            {/* Individual Features */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Individual Features</h4>
              <div className="space-y-2">
                {Object.entries(flags).map(([key, value]) => {
                  if (key === 'enableEnhancedAI' || key === 'enableDevelopmentMode') return null;
                  
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleFlagToggle(key as keyof FeatureFlags, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {key.replace('enable', '').replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                      <span className={`text-xs px-2 py-1 rounded ${
                        value
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {value ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* System Health */}
            {showHealth && systemReport && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-white">System Health</h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                    <span className={`text-sm font-medium ${getStatusColor(systemReport.health.status)}`}>
                      {getStatusIcon(systemReport.health.status)} {systemReport.health.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {systemReport.health.performance.averageResponseTime.toFixed(2)}ms
                    </span>
                  </div>
                  {systemReport.health.issues.length > 0 && (
                    <div className="text-xs text-red-600 dark:text-red-400">
                      Issues: {systemReport.health.issues.length}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Performance Metrics */}
            {showPerformance && systemReport && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-white">Performance Impact</h4>
                <div className="space-y-1">
                  {systemReport.performance.map((impact) => (
                    <div key={impact.feature} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">{impact.feature}</span>
                      <span className={`font-medium ${
                        impact.improvement > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {impact.improvement > 0 ? '+' : ''}{impact.improvement.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleGenerateReport}
                className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Refresh Report
              </button>
              <button
                onClick={handleResetToDefaults}
                className="px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Last Update */}
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Last update: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureTogglePanel; 