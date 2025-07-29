// URLPresetIndicator.tsx
// Shows when a preset is loaded from URL

import React from 'react';
import { URLPresetState } from '../hooks/usePresetFromURL';
import styles from './GlobalEffectsDashboard.module.css';

interface URLPresetIndicatorProps {
  urlState: URLPresetState;
}

export const URLPresetIndicator: React.FC<URLPresetIndicatorProps> = ({ urlState }) => {
  if (!urlState.isLoading && !urlState.presetId && !urlState.presetName && !urlState.error) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10000,
      backgroundColor: urlState.error ? '#dc2626' : urlState.isLoading ? '#3b82f6' : '#10b981',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      {urlState.isLoading && (
        <>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '50%',
            borderTopColor: 'white',
            animation: 'spin 1s linear infinite'
          }} />
          Loading preset from URL...
        </>
      )}
      
      {urlState.error && (
        <>
          ❌ {urlState.error}
        </>
      )}
      
      {(urlState.presetId || urlState.presetName) && !urlState.isLoading && !urlState.error && (
        <>
          🔗 Loaded: {urlState.presetName || urlState.presetId}
        </>
      )}
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};