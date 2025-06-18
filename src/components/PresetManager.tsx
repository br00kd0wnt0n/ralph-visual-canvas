'use client';

import React, { useState, useEffect } from 'react';
import { PresetClient } from '@/lib/presetClient';
import { Preset } from '@/types/preset';
import { useVisualStore } from '@/store/visualStore';

export const PresetManager: React.FC = () => {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const visualStore = useVisualStore();

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await PresetClient.getPresets({ limit: 50 });
      setPresets(response.presets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load presets');
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentPreset = async () => {
    if (!presetName.trim()) {
      setError('Preset name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Get current state from visual store
      const currentState = {
        camera: visualStore.camera,
        particles: visualStore.particles,
        geometric: visualStore.geometric,
        globalEffects: visualStore.globalEffects,
        backgroundConfig: visualStore.backgroundConfig,
        effects: visualStore.effects,
        background: visualStore.background,
        ui: visualStore.ui,
        globalAnimationSpeed: visualStore.globalAnimationSpeed
      };

      await PresetClient.createPreset({
        name: presetName,
        description: presetDescription,
        data: currentState
      });

      setSuccess(`Preset "${presetName}" saved successfully!`);
      setPresetName('');
      setPresetDescription('');
      setSaveDialogOpen(false);
      loadPresets(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save preset');
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = async (preset: Preset) => {
    try {
      setLoading(true);
      setError(null);
      
      // Apply the preset data to the visual store
      if (preset.data.camera) visualStore.updateCamera(preset.data.camera);
      if (preset.data.particles) visualStore.updateParticles(preset.data.particles);
      if (preset.data.geometric) {
        // Update each geometric shape type
        Object.keys(preset.data.geometric).forEach((shapeType) => {
          const shapeData = preset.data.geometric[shapeType as keyof typeof preset.data.geometric];
          if (shapeData) {
            visualStore.updateGeometric(shapeType as keyof typeof visualStore.geometric, shapeData);
          }
        });
      }
      if (preset.data.globalEffects) visualStore.updateGlobalEffects(preset.data.globalEffects);
      if (preset.data.backgroundConfig) visualStore.updateBackgroundConfig(preset.data.backgroundConfig);
      if (preset.data.effects) visualStore.updateEffects(preset.data.effects);
      if (preset.data.background) visualStore.updateBackground(preset.data.background);

      setSuccess(`Preset "${preset.name}" loaded successfully!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load preset');
    } finally {
      setLoading(false);
    }
  };

  const deletePreset = async (preset: Preset) => {
    if (!preset._id) return;
    
    if (!confirm(`Are you sure you want to delete "${preset.name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await PresetClient.deletePreset(preset._id.toString());
      setSuccess(`Preset "${preset.name}" deleted successfully!`);
      loadPresets(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete preset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Preset Manager</h3>
        <button
          onClick={() => setSaveDialogOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          disabled={loading}
        >
          Save Current
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-md text-green-200">
          {success}
        </div>
      )}

      {saveDialogOpen && (
        <div className="mb-4 p-4 bg-gray-800/50 rounded-md border border-white/20">
          <h4 className="text-white font-medium mb-3">Save Current State</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Preset name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700/50 border border-white/20 rounded-md text-white placeholder-gray-400"
            />
            <textarea
              placeholder="Description (optional)"
              value={presetDescription}
              onChange={(e) => setPresetDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700/50 border border-white/20 rounded-md text-white placeholder-gray-400"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={saveCurrentPreset}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                disabled={loading}
              >
                Save
              </button>
              <button
                onClick={() => setSaveDialogOpen(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {loading ? (
          <div className="text-center text-gray-400 py-4">Loading presets...</div>
        ) : presets.length === 0 ? (
          <div className="text-center text-gray-400 py-4">No presets found</div>
        ) : (
          presets.map((preset) => (
            <div
              key={preset._id?.toString()}
              className="flex justify-between items-center p-3 bg-gray-800/30 rounded-md border border-white/10"
            >
              <div className="flex-1">
                <h4 className="text-white font-medium">{preset.name}</h4>
                {preset.description && (
                  <p className="text-gray-400 text-sm">{preset.description}</p>
                )}
                <p className="text-gray-500 text-xs">
                  {new Date(preset.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => loadPreset(preset)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                  disabled={loading}
                >
                  Load
                </button>
                <button
                  onClick={() => deletePreset(preset)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 