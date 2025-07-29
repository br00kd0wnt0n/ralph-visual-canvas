import React, { useState, useEffect, useCallback } from 'react';
import { useVisualStore } from '../store/visualStore';
import { PresetClient } from '../lib/presetClient';
import { Preset } from '../types/preset';
import { PresetShareButton } from './PresetShareButton';
import styles from './GlobalEffectsDashboard.module.css';

const PresetControls: React.FC = React.memo(() => {
  const { savePreset, loadPreset, getAvailablePresets, deletePreset } = useVisualStore();
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  const [availablePresets, setAvailablePresets] = useState<string[]>([]);
  const [availableCloudPresets, setAvailableCloudPresets] = useState<Preset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [selectedCloudPreset, setSelectedCloudPreset] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [storageMode, setStorageMode] = useState<'local' | 'cloud'>('local');
  const [isLoadingCloud, setIsLoadingCloud] = useState(false);

  // Refresh available presets when component mounts or after operations
  const refreshPresets = useCallback(() => {
    if (storageMode === 'local') {
      setAvailablePresets(getAvailablePresets());
    }
  }, [getAvailablePresets, storageMode]);

  const refreshCloudPresets = useCallback(async () => {
    if (storageMode === 'cloud') {
      setIsLoadingCloud(true);
      try {
        const response = await PresetClient.getPresets({ limit: 100 });
        setAvailableCloudPresets(response.presets);
      } catch (error) {
        console.error('Error loading cloud presets:', error);
      } finally {
        setIsLoadingCloud(false);
      }
    }
  }, [storageMode]);

  useEffect(() => {
    refreshPresets();
  }, [refreshPresets]);

  useEffect(() => {
    refreshCloudPresets();
  }, [refreshCloudPresets]);

  const handleSave = useCallback(async () => {
    if (!presetName.trim()) return;
    
    setIsSaving(true);
    try {
      if (storageMode === 'local') {
        savePreset(presetName.trim());
        refreshPresets();
      } else {
        // Save to MongoDB
        const currentState = useVisualStore.getState();
        const presetData = {
          name: presetName,
          description: presetDescription,
          data: {
            geometric: currentState.geometric,
            particles: currentState.particles,
            globalEffects: currentState.globalEffects,
            effects: currentState.effects,
            camera: currentState.camera,
            background: currentState.background,
            backgroundConfig: currentState.backgroundConfig,
            ui: {}, // Empty UI state
            globalAnimationSpeed: currentState.globalAnimationSpeed || 1
          }
        };
        
        await PresetClient.createPreset(presetData);
        await refreshCloudPresets();
      }
      setPresetName('');
      setPresetDescription('');
    } catch (error) {
      console.error('Error saving preset:', error);
      alert(`Error saving preset: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  }, [presetName, presetDescription, storageMode, savePreset, refreshPresets, refreshCloudPresets]);

  const handleLoad = useCallback(async () => {
    if (!selectedPreset && !selectedCloudPreset) return;
    
    setIsLoading(true);
    try {
      if (storageMode === 'local') {
        loadPreset(selectedPreset);
      } else {
        // Load from MongoDB
        const presetId = selectedCloudPreset;
        const preset = await PresetClient.getPresetById(presetId);
        if (preset) {
          const currentState = useVisualStore.getState();
          
          // Apply preset data to store
          if (preset.data.geometric) {
            Object.entries(preset.data.geometric).forEach(([key, value]) => {
              currentState.updateGeometric(key as any, value as any);
            });
          }
          if (preset.data.particles) {
            currentState.updateParticles(preset.data.particles);
          }
          if (preset.data.globalEffects) {
            currentState.updateGlobalEffects(preset.data.globalEffects);
          }
          if (preset.data.effects) {
            currentState.updateEffects(preset.data.effects);
          }
          if (preset.data.camera) {
            currentState.updateCamera(preset.data.camera);
          }
          if (preset.data.background) {
            currentState.updateBackground(preset.data.background);
          }
          if (preset.data.backgroundConfig) {
            currentState.updateBackgroundConfig(preset.data.backgroundConfig);
          }
          if (typeof preset.data.globalAnimationSpeed === 'number') {
            currentState.updateGlobalAnimationSpeed(preset.data.globalAnimationSpeed);
          }
        }
      }
    } catch (error) {
      console.error('Error loading preset:', error);
      alert(`Error loading preset: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPreset, selectedCloudPreset, storageMode, loadPreset]);

  const handleDelete = useCallback(async () => {
    const presetToDelete = storageMode === 'local' ? selectedPreset : selectedCloudPreset;
    if (!presetToDelete) return;
    
    const presetName = storageMode === 'local' ? presetToDelete : 
      availableCloudPresets.find(p => p._id?.toString() === presetToDelete)?.name || presetToDelete;
    
    if (window.confirm(`Are you sure you want to delete the preset "${presetName}"?`)) {
      try {
        if (storageMode === 'local') {
          deletePreset(selectedPreset);
          refreshPresets();
          setSelectedPreset('');
        } else {
          await PresetClient.deletePreset(selectedCloudPreset);
          await refreshCloudPresets();
          setSelectedCloudPreset('');
        }
      } catch (error) {
        console.error('Error deleting preset:', error);
        alert(`Error deleting preset: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }, [selectedPreset, selectedCloudPreset, storageMode, deletePreset, refreshPresets, refreshCloudPresets, availableCloudPresets]);

  const handleStorageModeChange = (mode: 'local' | 'cloud') => {
    setStorageMode(mode);
    setSelectedPreset('');
    setSelectedCloudPreset('');
  };

  return (
    <div>
      {/* Storage Mode Toggle */}
      <div className="bg-black/20 rounded-lg p-3 mb-4">
        <h4 className="text-white font-medium mb-3">Storage Mode</h4>
        <div className="flex space-x-2">
          <button
            onClick={() => handleStorageModeChange('local')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              storageMode === 'local' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            💾 Local
          </button>
          <button
            onClick={() => handleStorageModeChange('cloud')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              storageMode === 'cloud' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            ☁️ Cloud
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {storageMode === 'local' 
            ? 'Presets saved locally in your browser' 
            : 'Presets saved to cloud database (accessible everywhere)'
          }
        </p>
      </div>

      {/* Save New Preset */}
      <div className="bg-black/20 rounded-lg p-3 mb-4">
        <h4 className="text-white font-medium mb-3">Save Current Settings</h4>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="Enter preset name..."
            className={styles.textInput}
            disabled={isSaving}
          />
          {storageMode === 'cloud' && (
            <input
              type="text"
              value={presetDescription}
              onChange={(e) => setPresetDescription(e.target.value)}
              placeholder="Description (optional)..."
              className={styles.textInput}
              disabled={isSaving}
            />
          )}
          <button 
            onClick={handleSave}
            disabled={!presetName.trim() || isSaving}
            className={styles.saveButton}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Load/Delete Existing Presets */}
      {storageMode === 'local' && availablePresets.length > 0 && (
        <div className="bg-black/20 rounded-lg p-3">
          <h4 className="text-white font-medium mb-3">Manage Local Presets</h4>
          <select
            value={selectedPreset}
            onChange={(e) => setSelectedPreset(e.target.value)}
            className={styles.selectControl}
            disabled={isLoading}
          >
            <option value="">Select a preset...</option>
            {availablePresets.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <div className={styles.buttonGroup}>
            <button 
              onClick={handleLoad}
              disabled={!selectedPreset || isLoading}
              className={`${styles.button} ${isLoading ? styles.buttonDisabled : ''}`}
            >
              {isLoading ? 'Loading...' : 'Load'}
            </button>
            <button 
              onClick={handleDelete}
              disabled={!selectedPreset || isLoading}
              className={`${styles.buttonDanger} ${isLoading ? styles.buttonDisabled : ''}`}
            >
              Delete
            </button>
          </div>
          {selectedPreset && (
            <PresetShareButton 
              presetName={selectedPreset}
              isCloudPreset={false}
              className={styles.mt1}
            />
          )}
        </div>
      )}

      {storageMode === 'cloud' && (
        <div className="bg-black/20 rounded-lg p-3">
          <h4 className="text-white font-medium mb-3">Manage Cloud Presets</h4>
          {isLoadingCloud ? (
            <div className="text-center py-4">
              <p className="text-gray-400 text-sm">Loading cloud presets...</p>
            </div>
          ) : availableCloudPresets.length > 0 ? (
            <>
              <select
                value={selectedCloudPreset}
                onChange={(e) => setSelectedCloudPreset(e.target.value)}
                className={styles.selectControl}
                disabled={isLoading}
              >
                <option value="">Select a preset...</option>
                {availableCloudPresets.map((preset) => (
                  <option key={preset._id?.toString()} value={preset._id?.toString()}>
                    {preset.name} {preset.description && `- ${preset.description}`}
                  </option>
                ))}
              </select>
              <div className={styles.buttonGroup}>
                <button 
                  onClick={handleLoad}
                  disabled={!selectedCloudPreset || isLoading}
                  className={`${styles.button} ${isLoading ? styles.buttonDisabled : ''}`}
                >
                  {isLoading ? 'Loading...' : 'Load'}
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={!selectedCloudPreset || isLoading}
                  className={`${styles.buttonDanger} ${isLoading ? styles.buttonDisabled : ''}`}
                >
                  Delete
                </button>
              </div>
              {selectedCloudPreset && (
                <PresetShareButton 
                  presetId={selectedCloudPreset}
                  isCloudPreset={true}
                  className={styles.mt1}
                />
              )}
            <>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400 text-sm">
                No cloud presets saved yet. Save your current settings to create a cloud preset.
              </p>
            </div>
          )}
        </div>
      )}

      {storageMode === 'local' && availablePresets.length === 0 && (
        <div className="bg-black/20 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-sm">
            No local presets saved yet. Save your current settings to create a preset.
          </p>
        </div>
      )}
    </div>
  );
});

export default PresetControls; 