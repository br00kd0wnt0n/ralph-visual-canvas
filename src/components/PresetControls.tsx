import React, { useState, useEffect, useCallback } from 'react';
import { useVisualStore } from '../store/visualStore';
import styles from './GlobalEffectsDashboard.module.css';

const PresetControls: React.FC = React.memo(() => {
  const { savePreset, loadPreset, getAvailablePresets, deletePreset } = useVisualStore();
  const [presetName, setPresetName] = useState('');
  const [availablePresets, setAvailablePresets] = useState<string[]>([]);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Refresh available presets when component mounts or after operations
  const refreshPresets = useCallback(() => {
    setAvailablePresets(getAvailablePresets());
  }, [getAvailablePresets]);

  useEffect(() => {
    refreshPresets();
  }, [refreshPresets]);

  const handleSave = useCallback(async () => {
    if (!presetName.trim()) return;
    
    setIsSaving(true);
    try {
      savePreset(presetName.trim());
      refreshPresets();
      setPresetName('');
    } catch (error) {
      console.error('Error saving preset:', error);
    } finally {
      setIsSaving(false);
    }
  }, [presetName, savePreset, refreshPresets]);

  const handleLoad = useCallback(async () => {
    if (!selectedPreset) return;
    
    setIsLoading(true);
    try {
      loadPreset(selectedPreset);
    } catch (error) {
      console.error('Error loading preset:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPreset, loadPreset]);

  const handleDelete = useCallback(async () => {
    if (!selectedPreset) return;
    
    if (window.confirm(`Are you sure you want to delete the preset "${selectedPreset}"?`)) {
      try {
        deletePreset(selectedPreset);
        refreshPresets();
        setSelectedPreset('');
      } catch (error) {
        console.error('Error deleting preset:', error);
      }
    }
  }, [selectedPreset, deletePreset, refreshPresets]);

  return (
    <div className={styles.controlSection}>
      <h3>💾 Presets</h3>
      
      {/* Save New Preset */}
      <div className={styles.controlGroup}>
        <label>Save Current Settings</label>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="Enter preset name..."
            className={styles.textInput}
            disabled={isSaving}
          />
          <button 
            onClick={handleSave}
            disabled={!presetName.trim() || isSaving}
            className={`${styles.button} ${isSaving ? styles.buttonDisabled : ''}`}
          >
            {isSaving ? 'Saving...' : 'Save Preset'}
          </button>
        </div>
      </div>

      {/* Load/Delete Existing Presets */}
      {availablePresets.length > 0 && (
        <div className={styles.controlGroup}>
          <label>Manage Presets</label>
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
        </div>
      )}

      {availablePresets.length === 0 && (
        <div className={styles.emptyState}>
          No presets saved yet. Save your current settings to create a preset.
        </div>
      )}
    </div>
  );
});

export default PresetControls; 