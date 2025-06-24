'use client';

import React, { useState, useEffect } from 'react';
import EnhancedVisualCanvas from '../components/EnhancedVisualCanvas';
import { GlobalEffectsDashboard } from '../components/GlobalEffectsDashboard';
import { ShapeParticleDashboard } from '../components/ShapeParticleDashboard';
import { DashboardToggle } from '../components/DashboardToggle';
import { GlobalDefaultsToggle } from '../components/GlobalDefaultsToggle';
import { AIToggle } from '../components/AIToggle';
import { AITestDashboard } from '../ai-system/components/AITestDashboard';
import GlobalDefaultsPanel from '../components/GlobalDefaultsManager';
import { TrailControlPanel } from '../components/TrailControlPanel';
import { useVisualStore } from '../store/visualStore';
import { PresetClient } from '../lib/presetClient';
import styles from './page.module.css';
import { BottomButtonBar } from '../components/BottomButtonBar';

export default function Home() {
  const { ui, toggleDashboards, toggleCameraPositioningMode, toggleAutoPan, loadPreset, loadPresetData, getAvailablePresets, camera } = useVisualStore();
  const [showGlobalDefaults, setShowGlobalDefaults] = useState(false);
  const [showAITest, setShowAITest] = useState(false);
  const [showTrailControls, setShowTrailControls] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [isPresetLoaded, setIsPresetLoaded] = useState(false);

  // Load LANDING - Basic preset from cloud by default on first app load
  useEffect(() => {
    const loadLandingPresetFromCloud = async () => {
      try {
        const response = await PresetClient.getPresets({ limit: 100 });
        const presets = response.presets;
        
        // Find LANDING - Basic preset
        const landingPreset = presets.find(p => p.name === 'LANDING');
        
        if (landingPreset) {
          // Use the new loadPresetData method to properly apply the preset
          loadPresetData(landingPreset.data);
        } else {
          // Fallback to localStorage
          const availablePresets = getAvailablePresets();
          if (availablePresets.includes('LANDING')) {
            loadPreset('LANDING');
          } else if (availablePresets.includes('INIT')) {
            loadPreset('INIT');
          } else {
            // No default presets found, using default settings
          }
        }
      } catch (error) {
        console.error('Error loading cloud preset:', error);
        
        // Fallback to localStorage on error
        const availablePresets = getAvailablePresets();
        if (availablePresets.includes('LANDING')) {
          loadPreset('LANDING');
        } else if (availablePresets.includes('INIT')) {
          loadPreset('INIT');
        } else {
          // No default presets found, using default settings
        }
      } finally {
        // Mark preset loading as complete regardless of success/failure
        setIsPresetLoaded(true);
      }
    };

    loadLandingPresetFromCloud();
  }, [loadPreset, loadPresetData, getAvailablePresets]);

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Loading Screen - Show until preset is loaded */}
      {!isPresetLoaded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <div className="text-white text-lg">Loading</div>
            <div className="text-gray-400 text-sm mt-1">Ralph Canvas</div>
          </div>
        </div>
      )}

      {/* Enhanced Visual Canvas - Only show after preset is loaded */}
      {isPresetLoaded && <EnhancedVisualCanvas />}

      {/* Top Controls Bar */}
      <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Removed duplicate DashboardToggle and GlobalDefaultsToggle */}
        </div>

        <div className="flex items-center space-x-4">
          {/* Removed PerformanceIndicator */}
        </div>
      </div>

      {/* Bottom Center Button Bar */}
      <BottomButtonBar
        isDashboardOpen={ui.showDashboards}
        onDashboardToggle={toggleDashboards}
        isGlobalDefaultsOpen={showGlobalDefaults}
        onGlobalDefaultsToggle={() => setShowGlobalDefaults(!showGlobalDefaults)}
        isAIOpen={showAITest}
        onAIToggle={() => setShowAITest(!showAITest)}
        isCameraPositioningMode={ui.cameraPositioningMode}
        isAutoPanEnabled={camera.autoPan.enabled}
        onCameraPositioningToggle={toggleCameraPositioningMode}
        onAutoPanToggle={toggleAutoPan}
        isTrailControlsOpen={showTrailControls}
        onTrailControlsToggle={() => setShowTrailControls(!showTrailControls)}
        isPerformanceOpen={showPerformance}
        onPerformanceToggle={() => setShowPerformance((v) => !v)}
      />

      {/* Dashboards - Side Columns */}
      {ui.showDashboards && (
        <>
          {/* Left Column - Global Effects */}
          <div className="fixed left-4 top-20 bottom-4 z-40 w-80 overflow-y-auto">
            <GlobalEffectsDashboard />
          </div>

          {/* Right Column - Shape & Particle Controls */}
          <div className="fixed right-4 top-20 bottom-4 z-40 w-80 overflow-y-auto">
            <ShapeParticleDashboard />
          </div>
        </>
      )}

      {/* AI Test Dashboard - Center Panel */}
      {showAITest && (
        <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] h-[90vh] max-w-[1200px] max-h-[900px] overflow-y-auto bg-gray-900/95 backdrop-blur-sm rounded-lg border border-gray-700 shadow-2xl">
          <AITestDashboard />
        </div>
      )}

      {/* Trail Control Panel */}
      <TrailControlPanel 
        isOpen={showTrailControls} 
        onClose={() => setShowTrailControls(false)} 
      />

      {/* Global Defaults Panel */}
      <GlobalDefaultsPanel 
        isOpen={showGlobalDefaults} 
        onClose={() => setShowGlobalDefaults(false)} 
      />
    </main>
  );
}
