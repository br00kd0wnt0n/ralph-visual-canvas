import React, { useState } from 'react';
import { DashboardToggle } from './DashboardToggle';
import { GlobalDefaultsToggle } from './GlobalDefaultsToggle';
import { AIToggle } from './AIToggle';
import { TrailToggle } from './TrailToggle';
import { PerformanceMonitor } from './PerformanceMonitor';
import { ShareToggle } from './ShareToggle';

interface BottomButtonBarProps {
  isDashboardOpen: boolean;
  onDashboardToggle: () => void;
  isGlobalDefaultsOpen: boolean;
  onGlobalDefaultsToggle: () => void;
  isAIOpen: boolean;
  onAIToggle: () => void;
  isAINewOpen: boolean;
  onAINewToggle: () => void;
  isCameraPositioningMode: boolean;
  isAutoPanEnabled: boolean;
  onCameraPositioningToggle: () => void;
  onAutoPanToggle: () => void;
  isTrailControlsOpen: boolean;
  onTrailControlsToggle: () => void;
  isPerformanceOpen: boolean;
  onPerformanceToggle: () => void;
  isShareOpen: boolean;
  onShareToggle: () => void;
}

export const BottomButtonBar: React.FC<BottomButtonBarProps> = ({
  isDashboardOpen,
  onDashboardToggle,
  isGlobalDefaultsOpen,
  onGlobalDefaultsToggle,
  isAIOpen,
  onAIToggle,
  isAINewOpen,
  onAINewToggle,
  isCameraPositioningMode,
  isAutoPanEnabled,
  onCameraPositioningToggle,
  onAutoPanToggle,
  isTrailControlsOpen,
  onTrailControlsToggle,
  isPerformanceOpen,
  onPerformanceToggle,
  isShareOpen,
  onShareToggle,
}) => {
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
        
        {/* Camera Positioning Mode Button */}
      <div style={{ pointerEvents: 'auto' }}>
        <button
          className="toggleButton"
          style={{
            zIndex: 2000,
              background: isCameraPositioningMode 
                ? 'rgba(128, 128, 128, 0.9)' 
                : 'rgba(0, 0, 0, 0.8)',
              border: isCameraPositioningMode 
                ? '2px solid #808080' 
                : '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50%',
            width: 50,
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 20,
              color: 'white',
              boxShadow: isCameraPositioningMode 
                ? '0 4px 16px rgba(128,128,128,0.3)' 
                : '0 4px 12px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            pointerEvents: 'auto',
              filter: 'grayscale(100%)',
          }}
            title={isCameraPositioningMode ? 'Disable Camera Positioning Mode' : 'Enable Camera Positioning Mode'}
            onClick={onCameraPositioningToggle}
        >
          🎥
        </button>
      </div>
        
        {/* Auto Pan Button */}
        <div style={{ pointerEvents: 'auto' }}>
          <button
            className="toggleButton"
            style={{
              zIndex: 2000,
              background: isAutoPanEnabled 
                ? 'rgba(128, 128, 128, 0.9)' 
                : 'rgba(0, 0, 0, 0.8)',
              border: isAutoPanEnabled 
                ? '2px solid #808080' 
                : '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: 50,
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 20,
              color: 'white',
              boxShadow: isAutoPanEnabled 
                ? '0 4px 16px rgba(128,128,128,0.3)' 
                : '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
              pointerEvents: 'auto',
              filter: 'grayscale(100%)',
            }}
            title={isAutoPanEnabled ? 'Disable Auto Pan' : 'Enable Auto Pan'}
            onClick={onAutoPanToggle}
          >
            🎬
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
              filter: 'grayscale(100%)',
            }}
            onClick={onPerformanceToggle}
          >
            📊
          </button>
        </div>
        
        {/* NEW: AI Integration Dashboard Button */}
        <div style={{ pointerEvents: 'auto' }}>
          <button
            className="toggleButton"
            style={{
              zIndex: 2000,
              background: isAINewOpen 
                ? 'rgba(59, 130, 246, 0.9)' 
                : 'rgba(0, 0, 0, 0.8)',
              border: isAINewOpen 
                ? '2px solid #3b82f6' 
                : '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: 50,
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 20,
              color: 'white',
              boxShadow: isAINewOpen 
                ? '0 4px 16px rgba(59, 130, 246, 0.3)' 
                : '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
              pointerEvents: 'auto',
              filter: isAINewOpen ? 'none' : 'grayscale(100%)',
            }}
            title={isAINewOpen ? 'Close AI Theme Generator' : 'Open AI Theme Generator'}
            onClick={onAINewToggle}
          >
            🤖
          </button>
        </div>
        
        {/* Share Button */}
        <div style={{ pointerEvents: 'auto' }}>
          <ShareToggle isOpen={isShareOpen} onToggle={onShareToggle} />
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