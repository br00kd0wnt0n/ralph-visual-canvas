// ParameterMappingTester.tsx
// React component for testing and debugging the ParameterMappingEngine
// Allows live monitoring, manual overrides, and performance tracking

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ParameterMappingEngine, type ParameterRule, type ParameterUpdate } from '../services/ParameterMappingEngine';
import { ThemeAnalysis, WeatherData } from '../types/AITypes';
import { useAIStore, subscribeToParameterUpdates, subscribeToPerformanceMetrics } from '../../store/aiStore';
import { useVisualStore } from '../../store/visualStore';

interface ParameterMappingTesterProps {
  aiResults?: ThemeAnalysis;
  weatherData?: WeatherData;
  currentParams?: any;
  onParameterUpdate?: (updates: ParameterUpdate[]) => void;
  className?: string;
}

interface PerformanceMetrics {
  fps: number;
  memoryUsage?: {
    used: number;
    total: number;
    percentage: number;
  };
  renderTime: number;
}

interface OverrideState {
  [variable: string]: {
    value: any;
    isOverridden: boolean;
    originalValue?: any;
  };
}

const ParameterMappingTester: React.FC<ParameterMappingTesterProps> = ({
  aiResults: propAIResults,
  weatherData: propWeatherData,
  currentParams: propCurrentParams,
  onParameterUpdate,
  className = ''
}) => {
  // Helper functions - defined first to avoid initialization errors
  const getNestedValue = useCallback((obj: any, path: string): any => {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }, []);

  const setNestedValue = useCallback((obj: any, path: string, value: any): any => {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
    return obj;
  }, []);

  // Zustand store integration
  const {
    aiResults: storeAIResults,
    weatherData: storeWeatherData,
    parameterUpdates,
    lastUpdateTime,
    isLiveMode,
    activeOverrides,
    mappingEngineStatus,
    performanceMetrics: storePerformanceMetrics,
    showParameterTester,
    selectedVariable: storeSelectedVariable,
    addParameterUpdates,
    setLiveMode,
    setOverride,
    clearOverride,
    clearAllOverrides,
    setMappingEngineStatus,
    updatePerformanceMetrics,
    setShowParameterTester,
    setSelectedVariable
  } = useAIStore();

  // Visual store for current parameters
  const visualState = useVisualStore();

  // Use props if provided, otherwise use store values
  const aiResults = propAIResults || storeAIResults;
  const weatherData = propWeatherData || storeWeatherData;
  const currentParams = propCurrentParams || visualState;

  // Local state management
  const [mappingEngine] = useState(() => new ParameterMappingEngine());
  const [selectedVariable, setSelectedVariableLocal] = useState<string>(storeSelectedVariable);
  const [liveMode, setLiveModeLocal] = useState<boolean>(isLiveMode);
  const [overrideMode, setOverrideMode] = useState<OverrideState>({});
  const [performanceMetrics, setPerformanceMetricsLocal] = useState<PerformanceMetrics>({
    fps: storePerformanceMetrics.fps,
    renderTime: 0
  });
  const [lastUpdate, setLastUpdateLocal] = useState<Date>(lastUpdateTime || new Date());
  const [updateHistory, setUpdateHistory] = useState<ParameterUpdate[]>(parameterUpdates);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Sync local state with store
  useEffect(() => {
    setSelectedVariableLocal(storeSelectedVariable);
  }, [storeSelectedVariable]);

  useEffect(() => {
    setLiveModeLocal(isLiveMode);
  }, [isLiveMode]);

  useEffect(() => {
    setUpdateHistory(parameterUpdates);
  }, [parameterUpdates]);

  useEffect(() => {
    setLastUpdateLocal(lastUpdateTime || new Date());
  }, [lastUpdateTime]);

  useEffect(() => {
    setPerformanceMetricsLocal(prev => ({
      ...prev,
      fps: storePerformanceMetrics.fps
    }));
  }, [storePerformanceMetrics.fps]);

  // Update store when local state changes
  useEffect(() => {
    setSelectedVariable(selectedVariable);
  }, [selectedVariable, setSelectedVariable]);

  useEffect(() => {
    setLiveMode(liveMode);
  }, [liveMode, setLiveMode]);

  // Get all available rules from the mapping engine
  const allRules = useMemo(() => {
    return mappingEngine.getAllRules().sort((a, b) => a.variable.localeCompare(b.variable));
  }, [mappingEngine]);

  // Get current computed value for selected variable
  const currentComputedValue = useMemo(() => {
    if (!selectedVariable || !aiResults || !weatherData) return null;

    try {
      const updates = mappingEngine.mapParameters(aiResults, weatherData, currentParams);
      const update = updates.find(u => u.variable === selectedVariable);
      return update?.value ?? null;
    } catch (error) {
      console.error('Error computing value:', error);
      return null;
    }
  }, [selectedVariable, aiResults, weatherData, currentParams, mappingEngine]);

  // Get current actual value from scene
  const currentActualValue = useMemo(() => {
    if (!selectedVariable) return null;
    return getNestedValue(currentParams, selectedVariable);
  }, [selectedVariable, currentParams, getNestedValue]);

  // Performance monitoring
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measurePerformance = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Get memory usage if available
        let memoryUsage;
        if ('memory' in performance) {
          const mem = (performance as any).memory;
          memoryUsage = {
            used: Math.round(mem.usedJSHeapSize / 1024 / 1024),
            total: Math.round(mem.totalJSHeapSize / 1024 / 1024),
            percentage: Math.round((mem.usedJSHeapSize / mem.totalJSHeapSize) * 100)
          };
        }

        const newMetrics = {
          fps,
          memoryUsage,
          renderTime: currentTime - lastTime
        };

        setPerformanceMetricsLocal(newMetrics);
        updatePerformanceMetrics({
          fps,
          memoryUsage,
          updateFrequency: frameCount
        });

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measurePerformance);
    };

    animationId = requestAnimationFrame(measurePerformance);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [updatePerformanceMetrics]);

  // Auto-update in live mode
  useEffect(() => {
    if (!liveMode || !aiResults || !weatherData) return;

    const interval = setInterval(() => {
      try {
        setMappingEngineStatus('active');
        const updates = mappingEngine.mapParameters(aiResults, weatherData, currentParams);
        
        // Add updates to store
        addParameterUpdates(updates);
        
        // Call prop callback if provided
        if (onParameterUpdate) {
          onParameterUpdate(updates);
        }
        
        setMappingEngineStatus('idle');
      } catch (error) {
        console.error('Error in live mode update:', error);
        setMappingEngineStatus('error');
      }
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [liveMode, aiResults, weatherData, currentParams, mappingEngine, onParameterUpdate, addParameterUpdates, setMappingEngineStatus]);

  // Subscribe to external parameter updates
  useEffect(() => {
    const unsubscribe = subscribeToParameterUpdates((updates) => {
      setUpdateHistory(prev => [...prev.slice(-50), ...updates]); // Keep last 50 updates
      setLastUpdateLocal(new Date());
    });

    return unsubscribe;
  }, []);

  // Subscribe to performance metrics updates
  useEffect(() => {
    const unsubscribe = subscribeToPerformanceMetrics((metrics) => {
      setPerformanceMetricsLocal(prev => ({
        ...prev,
        fps: metrics.fps
      }));
    });

    return unsubscribe;
  }, []);

  // Handle manual override
  const handleOverride = useCallback((variable: string, value: any) => {
    setOverrideMode(prev => ({
      ...prev,
      [variable]: {
        value,
        isOverridden: true,
        originalValue: prev[variable]?.originalValue ?? getNestedValue(currentParams, variable)
      }
    }));

    // Update store
    setOverride(variable, value);

    // Apply override to current params
    const updatedParams = { ...currentParams };
    setNestedValue(updatedParams, variable, value);

    if (onParameterUpdate) {
      onParameterUpdate([{
        variable,
        value,
        source: 'override',
        priority: 10,
        reason: 'Manual override',
        confidence: 1.0
      }]);
    }
  }, [currentParams, onParameterUpdate, setNestedValue, getNestedValue, setOverride]);

  // Reset override for a variable
  const resetOverride = useCallback((variable: string) => {
    setOverrideMode(prev => {
      const newState = { ...prev };
      delete newState[variable];
      return newState;
    });

    // Update store
    clearOverride(variable);

    // Restore original value
    const originalValue = overrideMode[variable]?.originalValue;
    if (originalValue !== undefined) {
      const updatedParams = { ...currentParams };
      setNestedValue(updatedParams, variable, originalValue);

      if (onParameterUpdate) {
        onParameterUpdate([{
          variable,
          value: originalValue,
          source: 'reset',
          priority: 10,
          reason: 'Override reset',
          confidence: 1.0
        }]);
      }
    }
  }, [overrideMode, currentParams, onParameterUpdate, setNestedValue, clearOverride]);

  // Reset all overrides
  const resetAllOverrides = useCallback(() => {
    setOverrideMode({});
    clearAllOverrides();
    
    // This would need to be handled by the parent component
    if (onParameterUpdate) {
      const resetUpdates = Object.keys(overrideMode).map(variable => ({
        variable,
        value: overrideMode[variable].originalValue,
        source: 'reset' as const,
        priority: 10,
        reason: 'All overrides reset',
        confidence: 1.0
      }));
      onParameterUpdate(resetUpdates);
    }
  }, [overrideMode, onParameterUpdate, clearAllOverrides]);

  // Get input type for variable
  const getInputType = useCallback((variable: string, value: any) => {
    if (typeof value === 'boolean') return 'checkbox';
    if (typeof value === 'number') {
      const rule = mappingEngine.getRule(variable);
      if (rule && rule.constraints) {
        const { min, max } = rule.constraints;
        if (min !== undefined && max !== undefined && max - min <= 10) {
          return 'range';
        }
      }
      return 'number';
    }
    return 'text';
  }, [mappingEngine]);

  // Get input props for variable
  const getInputProps = useCallback((variable: string) => {
    const rule = mappingEngine.getRule(variable);
    if (!rule) return {};

    const { min, max } = rule.constraints;
    const currentValue = getNestedValue(currentParams, variable);

    if (typeof currentValue === 'number') {
      return {
        min: min ?? 0,
        max: max ?? 100,
        step: (max - min) / 100
      };
    }

    return {};
  }, [mappingEngine, currentParams, getNestedValue]);

  // Format value for display
  const formatValue = useCallback((value: any): string => {
    if (typeof value === 'number') {
      return value.toFixed(3);
    }
    if (typeof value === 'boolean') {
      return value ? '✓' : '✗';
    }
    return String(value);
  }, []);

  // Get value color based on type
  const getValueColor = useCallback((value: any): string => {
    if (typeof value === 'number') {
      if (value > 0.8) return 'text-green-500';
      if (value > 0.5) return 'text-yellow-500';
      return 'text-red-500';
    }
    if (typeof value === 'boolean') {
      return value ? 'text-green-500' : 'text-red-500';
    }
    return 'text-gray-300';
  }, []);

  // Don't render if not shown
  if (!showParameterTester) {
    return null;
  }

  return (
    <div className={`bg-gray-900 text-white p-6 rounded-lg shadow-xl border border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-blue-400">Parameter Mapping Tester</h2>
          <p className="text-sm text-gray-400">Test and override visual system parameters</p>
        </div>
        
        {/* Performance Metrics */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">FPS:</span>
            <span className={`font-mono ${performanceMetrics.fps > 50 ? 'text-green-400' : performanceMetrics.fps > 30 ? 'text-yellow-400' : 'text-red-400'}`}>
              {performanceMetrics.fps}
            </span>
          </div>
          
          {performanceMetrics.memoryUsage && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Memory:</span>
              <span className={`font-mono ${performanceMetrics.memoryUsage.percentage < 70 ? 'text-green-400' : performanceMetrics.memoryUsage.percentage < 90 ? 'text-yellow-400' : 'text-red-400'}`}>
                {performanceMetrics.memoryUsage.used}MB ({performanceMetrics.memoryUsage.percentage}%)
              </span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Last Update:</span>
            <span className="font-mono text-gray-300">
              {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="liveMode"
            checked={liveMode}
            onChange={(e) => setLiveModeLocal(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="liveMode" className="text-sm font-medium">
            Live Mode
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </button>
        </div>
        
        {Object.keys(overrideMode).length > 0 && (
          <button
            onClick={resetAllOverrides}
            className="px-3 py-1 text-xs bg-red-600 hover:bg-red-500 rounded transition-colors"
          >
            Reset All Overrides ({Object.keys(overrideMode).length})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Variable Selection and Control */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Variable
            </label>
            <select
              value={selectedVariable}
              onChange={(e) => setSelectedVariableLocal(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a variable...</option>
              {allRules.map(rule => (
                <option key={rule.variable} value={rule.variable}>
                  {rule.variable} - {rule.description}
                </option>
              ))}
            </select>
          </div>

          {selectedVariable && (
            <div className="bg-gray-800 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-blue-400">{selectedVariable}</h3>
                {overrideMode[selectedVariable]?.isOverridden && (
                  <span className="px-2 py-1 text-xs bg-yellow-600 text-yellow-100 rounded">
                    Overridden
                  </span>
                )}
              </div>

              {/* Current Values */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Computed:</span>
                  <div className={`font-mono ${getValueColor(currentComputedValue)}`}>
                    {currentComputedValue !== null ? formatValue(currentComputedValue) : 'N/A'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Actual:</span>
                  <div className={`font-mono ${getValueColor(currentActualValue)}`}>
                    {currentActualValue !== null ? formatValue(currentActualValue) : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Manual Override */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Manual Override
                </label>
                <div className="flex items-center space-x-2">
                  {currentActualValue !== null && (
                    <>
                      {getInputType(selectedVariable, currentActualValue) === 'range' && (
                        <input
                          type="range"
                          value={overrideMode[selectedVariable]?.value ?? currentActualValue}
                          onChange={(e) => handleOverride(selectedVariable, parseFloat(e.target.value))}
                          {...getInputProps(selectedVariable)}
                          className="flex-1"
                        />
                      )}
                      
                      {getInputType(selectedVariable, currentActualValue) === 'number' && (
                        <input
                          type="number"
                          value={overrideMode[selectedVariable]?.value ?? currentActualValue}
                          onChange={(e) => handleOverride(selectedVariable, parseFloat(e.target.value))}
                          {...getInputProps(selectedVariable)}
                          className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                        />
                      )}
                      
                      {getInputType(selectedVariable, currentActualValue) === 'checkbox' && (
                        <input
                          type="checkbox"
                          checked={overrideMode[selectedVariable]?.value ?? currentActualValue}
                          onChange={(e) => handleOverride(selectedVariable, e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                        />
                      )}
                      
                      {getInputType(selectedVariable, currentActualValue) === 'text' && (
                        <input
                          type="text"
                          value={overrideMode[selectedVariable]?.value ?? currentActualValue}
                          onChange={(e) => handleOverride(selectedVariable, e.target.value)}
                          className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                        />
                      )}
                    </>
                  )}
                  
                  {overrideMode[selectedVariable]?.isOverridden && (
                    <button
                      onClick={() => resetOverride(selectedVariable)}
                      className="px-2 py-1 text-xs bg-red-600 hover:bg-red-500 rounded transition-colors"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Rule Information */}
              {showAdvanced && (
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Source: {mappingEngine.getRule(selectedVariable)?.source}</div>
                  <div>Priority: {mappingEngine.getRule(selectedVariable)?.priority}</div>
                  <div>Sensitivity: {mappingEngine.getRule(selectedVariable)?.sensitivity}</div>
                  <div>Description: {mappingEngine.getRule(selectedVariable)?.description}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Update History and Statistics */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">Recent Updates</h3>
            <div className="bg-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto">
              {updateHistory.length === 0 ? (
                <p className="text-gray-500 text-sm">No updates yet...</p>
              ) : (
                <div className="space-y-2">
                  {updateHistory.slice(-10).reverse().map((update, index) => (
                    <div key={index} className="text-xs border-b border-gray-700 pb-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-blue-400">{update.variable}</span>
                        <span className={`px-1 rounded text-xs ${
                          update.source === 'ai' ? 'bg-blue-600' :
                          update.source === 'weather' ? 'bg-green-600' :
                          update.source === 'evolution' ? 'bg-purple-600' :
                          update.source === 'hybrid' ? 'bg-yellow-600' :
                          update.source === 'override' ? 'bg-orange-600' :
                          update.source === 'reset' ? 'bg-red-600' :
                          'bg-gray-600'
                        }`}>
                          {update.source}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`font-mono ${getValueColor(update.value)}`}>
                          {formatValue(update.value)}
                        </span>
                        <span className="text-gray-500">
                          {update.confidence.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-gray-500 mt-1 truncate">
                        {update.reason}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          {showAdvanced && (
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Statistics</h3>
              <div className="bg-gray-800 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Rules:</span>
                  <span className="font-mono">{allRules.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Locked Parameters:</span>
                  <span className="font-mono">{mappingEngine.getLockedParameters().length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Overrides:</span>
                  <span className="font-mono">{Object.keys(overrideMode).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Update Count:</span>
                  <span className="font-mono">{updateHistory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Engine Status:</span>
                  <span className={`font-mono ${
                    mappingEngineStatus === 'active' ? 'text-green-400' :
                    mappingEngineStatus === 'error' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {mappingEngineStatus}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-6 pt-4 border-t border-gray-700 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Status: {liveMode ? '🟢 Live' : '🔴 Manual'}</span>
          <span>Engine: {mappingEngineStatus === 'active' ? '🟢 Active' : mappingEngineStatus === 'error' ? '🔴 Error' : '🟡 Idle'}</span>
          {aiResults && <span>AI: ✅ Connected</span>}
          {weatherData && <span>Weather: ✅ Connected</span>}
        </div>
        <div className="text-right">
          <div>Parameter Mapping Engine v1.0</div>
          <div>EnhancedVisualCanvas</div>
        </div>
      </div>
    </div>
  );
};

export default ParameterMappingTester; 