// RalphCanvasBackground.tsx
// Simplified component for use as website background

'use client';

import React, { useEffect, useState } from 'react';
import EnhancedVisualCanvas from './EnhancedVisualCanvas';
import { useVisualStore } from '../store/visualStore';
import { PresetClient } from '../lib/presetClient';
import { initializeGlobalAPI } from '../api/GlobalAPI';

interface RalphCanvasBackgroundProps {
  /** Default preset to load on mount */
  defaultPreset?: string;
  /** Whether to show loading screen */
  showLoading?: boolean;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Callback when preset is loaded */
  onPresetLoaded?: (presetName: string) => void;
  /** Additional CSS classes */
  className?: string;
  /** Additional styles */
  style?: React.CSSProperties;
}

export const RalphCanvasBackground: React.FC<RalphCanvasBackgroundProps> = ({
  defaultPreset = 'LANDING',
  showLoading = true,
  loadingComponent,
  onPresetLoaded,
  className = '',
  style = {}
}) => {
  const { loadPreset, loadPresetData, getAvailablePresets } = useVisualStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedPreset, setLoadedPreset] = useState<string | null>(null);

  // Initialize global API on mount
  useEffect(() => {
    initializeGlobalAPI();
  }, []);

  // Load default preset on mount
  useEffect(() => {
    const loadDefaultPreset = async () => {
      try {
        console.log(`🎨 Loading default preset: ${defaultPreset}`);
        
        // Try local presets first
        const localPresets = getAvailablePresets();
        if (localPresets.includes(defaultPreset)) {
          loadPreset(defaultPreset);
          setLoadedPreset(defaultPreset);
          setIsLoaded(true);
          onPresetLoaded?.(defaultPreset);
          console.log(`✅ Loaded local preset: ${defaultPreset}`);
          return;
        }

        // Try cloud presets
        const response = await PresetClient.getPresets({ limit: 100 });
        const cloudPreset = response.presets.find(p => 
          p.name.toLowerCase() === defaultPreset.toLowerCase()
        );
        
        if (cloudPreset && cloudPreset.data) {
          loadPresetData(cloudPreset.data);
          setLoadedPreset(cloudPreset.name);
          setIsLoaded(true);
          onPresetLoaded?.(cloudPreset.name);
          console.log(`✅ Loaded cloud preset: ${cloudPreset.name}`);
          return;
        }

        // Fallback to any available preset
        if (localPresets.length > 0) {
          const fallback = localPresets[0];
          loadPreset(fallback);
          setLoadedPreset(fallback);
          setIsLoaded(true);
          onPresetLoaded?.(fallback);
          console.log(`✅ Loaded fallback preset: ${fallback}`);
          return;
        }

        // No presets found, use defaults
        console.log('⚠️ No presets found, using default settings');
        setIsLoaded(true);
        
      } catch (error) {
        console.error('❌ Error loading preset:', error);
        setIsLoaded(true); // Show canvas anyway
      }
    };

    loadDefaultPreset();
  }, [defaultPreset, loadPreset, loadPresetData, getAvailablePresets, onPresetLoaded]);

  const defaultLoadingComponent = (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      zIndex: 50
    }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: '50%',
          borderTopColor: 'white',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }} />
        <div style={{ fontSize: '18px', marginBottom: '4px' }}>Loading</div>
        <div style={{ fontSize: '14px', opacity: 0.7 }}>Ralph Canvas</div>
      </div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  return (
    <div 
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style
      }}
    >
      {/* Loading Screen */}
      {showLoading && !isLoaded && (loadingComponent || defaultLoadingComponent)}
      
      {/* Canvas - Always render but may be hidden during loading */}
      <div style={{ 
        width: '100%', 
        height: '100%',
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out'
      }}>
        <EnhancedVisualCanvas showUI={false} />
      </div>
    </div>
  );
};

export default RalphCanvasBackground;