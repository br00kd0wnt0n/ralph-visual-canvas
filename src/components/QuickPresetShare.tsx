// QuickPresetShare.tsx
// Always-visible preset share functionality

import React, { useState, useEffect } from 'react';
import { useVisualStore } from '../store/visualStore';
import { PresetClient } from '../lib/presetClient';
import { generatePresetURL, copyPresetURL } from '../hooks/usePresetFromURL';

interface QuickPresetShareProps {
  onClose?: () => void;
}

export const QuickPresetShare: React.FC<QuickPresetShareProps> = ({ onClose }) => {
  const { getAvailablePresets } = useVisualStore();
  // Always show the menu when this component is rendered
  const [cloudPresets, setCloudPresets] = useState<any[]>([]);
  const [localPresets, setLocalPresets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    // Load presets when component mounts
    setLocalPresets(getAvailablePresets());
    loadCloudPresets();
  }, [getAvailablePresets]);

  const loadCloudPresets = async () => {
    setLoading(true);
    try {
      const response = await PresetClient.getPresets({ limit: 10 });
      setCloudPresets(response.presets || []);
    } catch (error) {
      console.error('Failed to load cloud presets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (identifier: string, isCloud: boolean, name: string) => {
    const success = await copyPresetURL(identifier, isCloud);
    if (success) {
      setCopied(identifier);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleTestURL = () => {
    // For testing - create a sample URL
    const sampleURL = generatePresetURL('LANDING', false);
    window.open(sampleURL, '_blank');
  };

  // Component is always rendered as a panel

  return (
    <div style={{
      position: 'relative',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      padding: '16px',
      minWidth: '280px',
      maxHeight: '400px',
      overflowY: 'auto',
      color: 'white',
      fontSize: '14px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>Share Presets</h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>

      {/* Test URL Feature */}
      <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: 'rgba(59, 130, 246, 0.2)', borderRadius: '4px' }}>
        <div style={{ marginBottom: '8px', fontSize: '12px', opacity: 0.8 }}>Test URL System:</div>
        <button
          onClick={handleTestURL}
          style={{
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          🧪 Test with Sample Preset
        </button>
      </div>

      {/* Local Presets */}
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.8 }}>Local Presets</h4>
        {localPresets.length === 0 ? (
          <p style={{ margin: 0, opacity: 0.6, fontSize: '12px' }}>No local presets found</p>
        ) : (
          localPresets.map(preset => (
            <div key={preset} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '4px 0',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <span style={{ fontSize: '12px' }}>{preset}</span>
              <button
                onClick={() => handleShare(preset, false, preset)}
                style={{
                  backgroundColor: copied === preset ? '#10b981' : 'rgba(59, 130, 246, 0.8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '10px',
                  cursor: 'pointer'
                }}
              >
                {copied === preset ? '✓' : '🔗'}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Cloud Presets */}
      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.8 }}>Cloud Presets</h4>
        {loading ? (
          <p style={{ margin: 0, opacity: 0.6, fontSize: '12px' }}>Loading...</p>
        ) : cloudPresets.length === 0 ? (
          <p style={{ margin: 0, opacity: 0.6, fontSize: '12px' }}>No cloud presets found</p>
        ) : (
          cloudPresets.slice(0, 5).map(preset => (
            <div key={preset._id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '4px 0',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <span style={{ fontSize: '12px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {preset.name}
              </span>
              <button
                onClick={() => handleShare(preset._id, true, preset.name)}
                style={{
                  backgroundColor: copied === preset._id ? '#10b981' : 'rgba(59, 130, 246, 0.8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '10px',
                  cursor: 'pointer'
                }}
              >
                {copied === preset._id ? '✓' : '🔗'}
              </button>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '12px', fontSize: '11px', opacity: 0.6, textAlign: 'center' }}>
        Click 🔗 to copy shareable URL
      </div>
    </div>
  );
};