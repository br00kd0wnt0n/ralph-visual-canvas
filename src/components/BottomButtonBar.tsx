import React, { useState } from 'react';
import { DashboardToggle } from './DashboardToggle';
import { GlobalDefaultsToggle } from './GlobalDefaultsToggle';
import { AIToggle } from './AIToggle';
import { TrailToggle } from './TrailToggle';
import { PerformanceMonitor } from './PerformanceMonitor';

interface BottomButtonBarProps {
  isDashboardOpen: boolean;
  onDashboardToggle: () => void;
  isGlobalDefaultsOpen: boolean;
  onGlobalDefaultsToggle: () => void;
  isAIOpen: boolean;
  onAIToggle: () => void;
  isCameraPositioningMode: boolean;
  isAutoPanEnabled: boolean;
  onCameraModeToggle: () => void;
  isTrailControlsOpen: boolean;
  onTrailControlsToggle: () => void;
  isPerformanceOpen: boolean;
  onPerformanceToggle: () => void;
}

export const BottomButtonBar: React.FC<BottomButtonBarProps> = ({
  isDashboardOpen,
  onDashboardToggle,
  isGlobalDefaultsOpen,
  onGlobalDefaultsToggle,
  isAIOpen,
  onAIToggle,
  isCameraPositioningMode,
  isAutoPanEnabled,
  onCameraModeToggle,
  isTrailControlsOpen,
  onTrailControlsToggle,
  isPerformanceOpen,
  onPerformanceToggle,
}) => {
  // Determine camera button state and styling
  const getCameraButtonState = () => {
    if (isAutoPanEnabled) {
      return {
        icon: '🎬',
        background: 'rgba(37, 99, 235, 0.9)',
        border: '2px solid #2563eb',
        boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
        title: 'Disable Auto Pan Mode'
      };
    } else if (isCameraPositioningMode) {
      return {
        icon: '🎥',
        background: 'rgba(220, 38, 127, 0.9)',
        border: '2px solid #dc267f',
        boxShadow: '0 4px 16px rgba(220,38,127,0.3)',
        title: 'Disable Camera Positioning Mode'
      };
    } else {
      return {
        icon: '📷',
        background: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        title: 'Enable Camera Controls'
      };
    }
  };

  const cameraState = getCameraButtonState();

  return (
    <>
      <div style={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: 16,
        display: 'flex',
        gap: 24,
        zIndex: 2000,
        pointerEvents: 'none',
      }}>
        <div style={{ pointerEvents: 'auto' }}>
          <DashboardToggle />
        </div>
        <div style={{ pointerEvents: 'auto' }}>
          <GlobalDefaultsToggle isOpen={isGlobalDefaultsOpen} onToggle={onGlobalDefaultsToggle} />
        </div>
        <div style={{ pointerEvents: 'auto' }}>
          <TrailToggle isOpen={isTrailControlsOpen} onToggle={onTrailControlsToggle} />
        </div>
        <div style={{ pointerEvents: 'auto' }}>
          <button
            className="toggleButton"
            style={{
              zIndex: 2000,
              background: cameraState.background,
              border: cameraState.border,
              borderRadius: '50%',
              width: 50,
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 20,
              color: 'white',
              boxShadow: cameraState.boxShadow,
              transition: 'all 0.3s ease',
              pointerEvents: 'auto',
            }}
            title={cameraState.title}
            onClick={onCameraModeToggle}
          >
            {cameraState.icon}
          </button>
        </div>
        <div style={{ pointerEvents: 'auto' }}>
          <button
            className="toggleButton"
            style={{
              zIndex: 2000,
              background: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: 50,
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 20,
              color: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
              pointerEvents: 'auto',
            }}
            onClick={onPerformanceToggle}
          >
            📊
          </button>
        </div>
        <div style={{ pointerEvents: 'auto' }}>
          <AIToggle isOpen={isAIOpen} onToggle={onAIToggle} />
        </div>
      </div>
      {isPerformanceOpen && (
        <div style={{ position: 'fixed', top: 80, right: 32, zIndex: 3000 }}>
          <PerformanceMonitor />
        </div>
      )}
    </>
  );
}; 