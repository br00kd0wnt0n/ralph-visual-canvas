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
import styles from './page.module.css';
import { BottomButtonBar } from '../components/BottomButtonBar';

export default function Home() {
  const { ui, toggleDashboards, toggleCameraPositioningMode, toggleAutoPan, loadPreset, getAvailablePresets, camera } = useVisualStore();
  const [showGlobalDefaults, setShowGlobalDefaults] = useState(false);
  const [showAITest, setShowAITest] = useState(false);
  const [showTrailControls, setShowTrailControls] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);

  // Load INIT preset by default on first app load
  useEffect(() => {
    const availablePresets = getAvailablePresets();
    if (availablePresets.includes('INIT')) {
      console.log('🚀 Loading INIT preset by default...');
      loadPreset('INIT');
    } else {
      console.log('ℹ️ INIT preset not found, using default settings');
    }
  }, [loadPreset, getAvailablePresets]);

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Enhanced Visual Canvas */}
      <EnhancedVisualCanvas />

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
