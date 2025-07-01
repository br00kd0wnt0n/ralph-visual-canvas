// test-feature-flags/page.tsx
// Dedicated test page for the Feature Flag Integration System

'use client';

import React, { useState } from 'react';
import { getFeatureFlagManager } from '../../config/featureFlags';
import { getSafeIntegration } from '../../ai-enhanced/utils/SafeIntegration';
import EnhancedAIDevelopmentDashboard from '../../ai-enhanced/components/DevelopmentTestingUI';
import FeatureTogglePanel from '../../ai-enhanced/components/FeatureTogglePanel';
import EnhancedAITestingInterface from '../../ai-enhanced/components/EnhancedAITestingInterface';
import SystemComparisonTool from '../../ai-enhanced/components/SystemComparisonTool';
import { AdvancedPresetGeneratorUI } from '../../ai-enhanced/components/AdvancedPresetGeneratorUI';
import { GeneratedPreset, EnhancedVisualState } from '../../ai-enhanced/services/AdvancedPresetGenerator';
import { useVisualStore } from '../../store/visualStore';

export default function FeatureFlagsTestPage() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showTogglePanel, setShowTogglePanel] = useState(true);
  const [showTestingInterface, setShowTestingInterface] = useState(true);
  const [showComparisonTool, setShowComparisonTool] = useState(true);
  const [showPresetGenerator, setShowPresetGenerator] = useState(false);
  const [appliedPreset, setAppliedPreset] = useState<GeneratedPreset | null>(null);

  const featureManager = getFeatureFlagManager();
  const safeIntegration = getSafeIntegration();
  const visualStore = useVisualStore();

  const convertEnhancedVisualStateToVisualStore = (enhancedState: EnhancedVisualState) => {
    return {
      geometric: {
        spheres: {
          count: enhancedState.geometric.spheres.count,
          size: enhancedState.geometric.spheres.size,
          color: enhancedState.geometric.spheres.color,
          speed: enhancedState.geometric.spheres.speed,
          rotation: enhancedState.geometric.spheres.rotation || 0,
          opacity: 1,
          organicness: enhancedState.geometric.spheres.organicness,
          movementPattern: 'orbit' as const,
          distance: 100,
          pulseEnabled: false,
          pulseSize: 1
        },
        cubes: {
          count: enhancedState.geometric.cubes.count,
          size: enhancedState.geometric.cubes.size,
          color: enhancedState.geometric.cubes.color,
          rotation: enhancedState.geometric.cubes.rotation || 0,
          speed: enhancedState.geometric.cubes.speed,
          opacity: 1,
          organicness: enhancedState.geometric.cubes.organicness,
          movementPattern: 'orbit' as const,
          distance: 100,
          pulseEnabled: false,
          pulseSize: 1
        },
        toruses: {
          count: enhancedState.geometric.toruses.count,
          size: enhancedState.geometric.toruses.size,
          color: enhancedState.geometric.toruses.color,
          speed: enhancedState.geometric.toruses.speed,
          rotation: enhancedState.geometric.toruses.rotation || 0,
          opacity: 1,
          organicness: enhancedState.geometric.toruses.organicness,
          movementPattern: 'orbit' as const,
          distance: 100,
          pulseEnabled: false,
          pulseSize: 1
        },
        blobs: {
          count: enhancedState.geometric.blobs.count,
          size: enhancedState.geometric.blobs.size,
          color: enhancedState.geometric.blobs.color,
          speed: enhancedState.geometric.blobs.speed,
          opacity: 1,
          organicness: enhancedState.geometric.blobs.organicness,
          movementPattern: 'orbit' as const,
          distance: 100,
          pulseEnabled: false,
          pulseSize: 1
        },
        crystals: {
          count: 0,
          size: 1,
          color: '#ffffff',
          rotation: 0,
          opacity: 1,
          complexity: 1,
          organicness: 0
        },
        waveInterference: {
          color: '#ffffff'
        },
        metamorphosis: {
          color: '#ffffff'
        },
        fireflies: {
          color: '#ffffff'
        },
        layeredSineWaves: {
          color: '#ffffff'
        }
      },
      effects: {
        brightness: enhancedState.effects.brightness,
        saturation: enhancedState.effects.saturation,
        contrast: enhancedState.effects.contrast,
        vignette: enhancedState.effects.vignette,
        glow: enhancedState.effects.glow,
        hue: 0
      },
      globalEffects: {
        atmosphericBlur: enhancedState.globalEffects.atmosphericBlur,
        volumetric: enhancedState.globalEffects.volumetric,
        distortion: enhancedState.globalEffects.distortion
      },
      globalAnimationSpeed: enhancedState.animation.speed
    } as any; // Use any to bypass strict type checking for this conversion
  };

  const handleRunTest = async () => {
    console.log('🧪 Running feature flag system test...');
    
    // Test feature flag operations
    const flags = featureManager.getFlags();
    console.log('📋 Current flags:', flags);
    
    // Test safe integration
    const colorResult = safeIntegration.integrateEnhancedColorSystem().generatePalette('#ff0000', 0.8);
    console.log('🎨 Color harmony test:', colorResult);
    
    // Test system health
    const health = safeIntegration.validateSystemState();
    console.log('🏥 System health:', health);
    
    console.log('✅ Feature flag system test completed!');
  };

  const handleApplyPreset = (preset: GeneratedPreset) => {
    console.log('🎨 Applying preset:', preset.name);
    console.log('🎨 Original preset visual state:', preset.visualState);
    setAppliedPreset(preset);
    
    try {
      // Convert enhanced visual state to visual store format
      const visualStoreData = convertEnhancedVisualStateToVisualStore(preset.visualState);
      console.log('🎨 Converted visual store data:', visualStoreData);
      
      // Apply the preset to the visual store
      visualStore.loadPresetData(visualStoreData);
      
      console.log('✅ Preset applied to visual store:', visualStoreData);
      
      // Show success notification
      alert(`✅ Preset "${preset.name}" applied successfully!\n\nThis preset will create a ${preset.strategy.replace('_', ' ')} style visualization.\n\nGo to the main canvas to see the visual changes!`);
      
    } catch (error) {
      console.error('❌ Error applying preset:', error);
      alert(`❌ Error applying preset: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🎛️ Feature Flag Integration System
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Complete testing interface for enhanced AI features with zero production risk
          </p>
          
          {/* Quick Test Button */}
          <button
            onClick={handleRunTest}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-6"
          >
            🧪 Run Quick Test
          </button>
        </div>

        {/* Control Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            🎮 UI Component Controls
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showTogglePanel}
                onChange={(e) => setShowTogglePanel(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300">Feature Toggle Panel</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showTestingInterface}
                onChange={(e) => setShowTestingInterface(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300">Testing Interface</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showComparisonTool}
                onChange={(e) => setShowComparisonTool(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300">Comparison Tool</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showPresetGenerator}
                onChange={(e) => setShowPresetGenerator(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300">Preset Generator</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showDashboard}
                onChange={(e) => setShowDashboard(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300">Development Dashboard</span>
            </label>
          </div>
        </div>

        {/* Feature Flag Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            📊 Current Feature Flag Status
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(featureManager.getFlags()).map(([flag, enabled]) => (
              <div key={flag} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {flag.replace('enable', '').replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className={`w-3 h-3 rounded-full ${
                  enabled ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            🏥 System Health
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-medium text-blue-900 dark:text-blue-100">Enhanced AI</h3>
              <p className="text-blue-600 dark:text-blue-400">
                {featureManager.isEnhancedAIEnabled() ? '✅ Enabled' : '❌ Disabled'}
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="font-medium text-green-900 dark:text-green-100">Development Mode</h3>
              <p className="text-green-600 dark:text-green-400">
                {featureManager.isDevelopmentMode() ? '✅ Enabled' : '❌ Disabled'}
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h3 className="font-medium text-purple-900 dark:text-purple-100">System Status</h3>
              <p className="text-purple-600 dark:text-purple-400">
                {safeIntegration.validateSystemState().status}
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
            🎯 How to Use the Feature Flag System
          </h2>
          <div className="space-y-3 text-blue-800 dark:text-blue-200">
            <div className="flex items-start space-x-2">
              <span className="text-blue-600 dark:text-blue-400">1.</span>
              <p>Use the <strong>Feature Toggle Panel</strong> (bottom-right) to control enhanced AI features in real-time</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600 dark:text-blue-400">2.</span>
              <p>Use the <strong>Testing Interface</strong> (top-right) to run comprehensive tests and upload images</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600 dark:text-blue-400">3.</span>
              <p>Use the <strong>Comparison Tool</strong> (top-left) to compare enhanced vs original system performance</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600 dark:text-blue-400">4.</span>
              <p>Use the <strong>Preset Generator</strong> to generate 30 diverse presets from image analysis</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600 dark:text-blue-400">5.</span>
              <p>Click <strong>"Development Dashboard"</strong> to access the full integrated workflow tester</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600 dark:text-blue-400">6.</span>
              <p><strong>View Applied Presets:</strong> Go to the main canvas (home page) to see presets applied from the generator</p>
            </div>
          </div>
        </div>

        {/* Applied Preset Notification */}
        {appliedPreset && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 mb-8 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
                  ✅ Preset Applied Successfully!
                </h2>
                <p className="text-green-800 dark:text-green-200 mb-2">
                  <strong>{appliedPreset.name}</strong> has been applied to the system.
                </p>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Strategy: {appliedPreset.strategy.replace('_', ' ')} | 
                  Confidence: {appliedPreset.confidence.toFixed(0)}% | 
                  Overall Score: {appliedPreset.scores.overall.toFixed(1)}
                </p>
              </div>
              <button
                onClick={() => setAppliedPreset(null)}
                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating UI Components */}
      {showTogglePanel && <FeatureTogglePanel />}
      {showTestingInterface && <EnhancedAITestingInterface />}
      {showComparisonTool && <SystemComparisonTool />}
      
      {/* Full Screen Dashboard */}
      {showDashboard && <EnhancedAIDevelopmentDashboard />}
      
      {/* Advanced Preset Generator */}
      {showPresetGenerator && <AdvancedPresetGeneratorUI onClose={() => setShowPresetGenerator(false)} onApplyPreset={handleApplyPreset} />}
    </div>
  );
} 