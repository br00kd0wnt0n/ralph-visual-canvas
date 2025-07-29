// PresetShareButton.tsx
// Component to generate and copy shareable preset URLs

import React, { useState } from 'react';
import { generatePresetURL, copyPresetURL } from '../hooks/usePresetFromURL';
import styles from './GlobalEffectsDashboard.module.css';

interface PresetShareButtonProps {
  presetId?: string;
  presetName?: string;
  isCloudPreset?: boolean;
  className?: string;
}

export const PresetShareButton: React.FC<PresetShareButtonProps> = ({
  presetId,
  presetName,
  isCloudPreset = false,
  className
}) => {
  const [copied, setCopied] = useState(false);
  const [showURL, setShowURL] = useState(false);
  
  const identifier = presetId || presetName;
  if (!identifier) return null;
  
  const url = generatePresetURL(identifier, isCloudPreset);
  
  const handleShare = async () => {
    const success = await copyPresetURL(identifier, isCloudPreset);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handleToggleURL = () => {
    setShowURL(!showURL);
  };
  
  return (
    <div className={className}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          onClick={handleShare}
          className={styles.primaryButton}
          style={{ 
            padding: '4px 12px', 
            fontSize: '12px',
            backgroundColor: copied ? '#10b981' : undefined 
          }}
        >
          {copied ? '✓ Copied!' : '🔗 Share'}
        </button>
        
        <button
          onClick={handleToggleURL}
          className={styles.secondaryButton}
          style={{ 
            padding: '4px 8px', 
            fontSize: '12px' 
          }}
        >
          {showURL ? '−' : '+'}
        </button>
      </div>
      
      {showURL && (
        <div style={{ 
          marginTop: '8px', 
          padding: '8px', 
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderRadius: '4px',
          fontSize: '11px',
          wordBreak: 'break-all',
          fontFamily: 'monospace'
        }}>
          {url}
        </div>
      )}
    </div>
  );
};