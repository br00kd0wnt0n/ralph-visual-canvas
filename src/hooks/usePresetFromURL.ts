// usePresetFromURL.ts
// Hook to handle preset loading from URL parameters

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useVisualStore } from '../store/visualStore';
import { PresetClient } from '../lib/presetClient';

export interface URLPresetState {
  isLoading: boolean;
  error: string | null;
  presetId: string | null;
  presetName: string | null;
}

export function usePresetFromURL() {
  const searchParams = useSearchParams();
  const { loadPreset, loadPresetData, getAvailablePresets } = useVisualStore();
  const [state, setState] = useState<URLPresetState>({
    isLoading: false,
    error: null,
    presetId: null,
    presetName: null
  });

  useEffect(() => {
    const loadFromURL = async () => {
      // Check for preset in URL parameters
      const presetId = searchParams.get('preset');
      const presetName = searchParams.get('p'); // Short version
      
      if (!presetId && !presetName) return;

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        if (presetId) {
          // Load cloud preset by ID
          console.log(`📥 Loading preset from URL: ${presetId}`);
          const preset = await PresetClient.getPresetById(presetId);
          
          if (preset && preset.data) {
            loadPresetData(preset.data);
            setState({
              isLoading: false,
              error: null,
              presetId: preset._id,
              presetName: preset.name
            });
            console.log(`✅ Loaded preset: ${preset.name}`);
          } else {
            throw new Error('Preset not found');
          }
        } else if (presetName) {
          // Load local preset by name
          const availablePresets = getAvailablePresets();
          if (availablePresets.includes(presetName)) {
            loadPreset(presetName);
            setState({
              isLoading: false,
              error: null,
              presetId: null,
              presetName: presetName
            });
            console.log(`✅ Loaded local preset: ${presetName}`);
          } else {
            throw new Error(`Local preset "${presetName}" not found`);
          }
        }
      } catch (error) {
        console.error('Error loading preset from URL:', error);
        setState({
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load preset',
          presetId: null,
          presetName: null
        });
      }
    };

    loadFromURL();
  }, [searchParams, loadPreset, loadPresetData, getAvailablePresets]);

  return state;
}

/**
 * Generate shareable URL for a preset
 */
export function generatePresetURL(presetIdOrName: string, isCloudPreset: boolean = false): string {
  const baseURL = typeof window !== 'undefined' ? window.location.origin : '';
  const param = isCloudPreset ? 'preset' : 'p';
  return `${baseURL}?${param}=${encodeURIComponent(presetIdOrName)}`;
}

/**
 * Copy preset URL to clipboard
 */
export async function copyPresetURL(presetIdOrName: string, isCloudPreset: boolean = false): Promise<boolean> {
  try {
    const url = generatePresetURL(presetIdOrName, isCloudPreset);
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error('Failed to copy URL:', error);
    return false;
  }
}