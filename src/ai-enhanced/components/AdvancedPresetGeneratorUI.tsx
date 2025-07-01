// AdvancedPresetGeneratorUI.tsx
// Comprehensive UI for testing the Advanced Preset Generator
// Includes image upload, preset generation, scoring, and visualization

import React, { useState, useCallback } from 'react';
import { AdvancedPresetGenerator, GeneratedPreset, GenerationStrategy, EnhancedPresetGenerationService } from '../services/AdvancedPresetGenerator';
import { getFeatureFlagManager } from '../../config/featureFlags';

interface PresetGenerationState {
  isGenerating: boolean;
  progress: number;
  currentStrategy: string;
  generatedPresets: GeneratedPreset[];
  selectedPreset: GeneratedPreset | null;
  error: string | null;
  isPreviewing: boolean;
}

interface AdvancedPresetGeneratorUIProps {
  onClose?: () => void;
  onApplyPreset?: (preset: GeneratedPreset) => void;
}

export const AdvancedPresetGeneratorUI: React.FC<AdvancedPresetGeneratorUIProps> = ({ onClose, onApplyPreset }) => {
  const [state, setState] = useState<PresetGenerationState>({
    isGenerating: false,
    progress: 0,
    currentStrategy: '',
    generatedPresets: [],
    selectedPreset: null,
    error: null,
    isPreviewing: false
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generationCount, setGenerationCount] = useState(30);
  const [selectedStrategies, setSelectedStrategies] = useState<GenerationStrategy[]>([
    'harmonic_emphasis',
    'dynamic_movement',
    'atmospheric_mood',
    'geometric_balance',
    'artistic_interpretation'
  ]);

  const featureManager = getFeatureFlagManager();

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      setState(prev => ({ ...prev, error: null }));
    }
  }, []);

  const handleStrategyToggle = useCallback((strategy: GenerationStrategy) => {
    setSelectedStrategies(prev => 
      prev.includes(strategy)
        ? prev.filter(s => s !== strategy)
        : [...prev, strategy]
    );
  }, []);

  const generatePresets = useCallback(async () => {
    if (!selectedImage) {
      setState(prev => ({ ...prev, error: 'Please select an image first' }));
      return;
    }

    if (selectedStrategies.length === 0) {
      setState(prev => ({ ...prev, error: 'Please select at least one generation strategy' }));
      return;
    }

    if (!featureManager.isFeatureEnabled('enableAdvancedPresets')) {
      setState(prev => ({ ...prev, error: 'Advanced preset generation is disabled' }));
      return;
    }

    setState(prev => ({
      ...prev,
      isGenerating: true,
      progress: 0,
      currentStrategy: '',
      generatedPresets: [],
      selectedPreset: null,
      error: null
    }));

    try {
      console.log('🚀 Starting advanced preset generation...');
      
      const service = new EnhancedPresetGenerationService();
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 500);

      const presets = await service.generatePresetsWithEnhancedAI(selectedImage);
      
      clearInterval(progressInterval);
      
      setState(prev => ({
        ...prev,
        isGenerating: false,
        progress: 100,
        generatedPresets: presets,
        selectedPreset: presets.length > 0 ? presets[0] : null
      }));

      console.log(`✨ Generated ${presets.length} presets successfully`);
      
    } catch (error) {
      console.error('❌ Error generating presets:', error);
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Failed to generate presets'
      }));
    }
  }, [selectedImage, selectedStrategies, featureManager]);

  const selectPreset = useCallback((preset: GeneratedPreset) => {
    setState(prev => ({ ...prev, selectedPreset: preset }));
  }, []);

  const applyPreset = useCallback((preset: GeneratedPreset) => {
    if (onApplyPreset) {
      onApplyPreset(preset);
      setState(prev => ({ ...prev, isPreviewing: false }));
    }
  }, [onApplyPreset]);

  const togglePreview = useCallback(() => {
    setState(prev => ({ ...prev, isPreviewing: !prev.isPreviewing }));
  }, []);

  const exportPresets = useCallback(() => {
    if (state.generatedPresets.length === 0) return;
    
    const dataStr = JSON.stringify(state.generatedPresets, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `advanced-presets-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [state.generatedPresets]);

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number): string => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              🎨 Advanced Preset Generator
            </h2>
            <p className="text-gray-600 mt-1">
              Generate 30 diverse, high-quality visual presets from image analysis
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Feature Flag Status */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900 !text-blue-900" style={{ color: '#1e3a8a' }}>
                Advanced Preset Generation: {featureManager.isFeatureEnabled('enableAdvancedPresets') ? '✅ Enabled' : '❌ Disabled'}
              </span>
              <span className="text-sm text-blue-700 !text-blue-700" style={{ color: '#1d4ed8' }}>
                Preset Scoring: {featureManager.isFeatureEnabled('enablePresetScoring') ? '✅ Enabled' : '❌ Disabled'}
              </span>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Source Image
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg border"
                />
              )}
            </div>
          </div>

          {/* Generation Settings */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Presets
              </label>
              <input
                type="number"
                min="10"
                max="50"
                value={generationCount}
                onChange={(e) => setGenerationCount(parseInt(e.target.value) || 30)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
                style={{ color: '#1f2937' }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Generation Strategies
              </label>
              <div className="space-y-2">
                {(['harmonic_emphasis', 'dynamic_movement', 'atmospheric_mood', 'geometric_balance', 'artistic_interpretation'] as GenerationStrategy[]).map(strategy => (
                  <label key={strategy} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedStrategies.includes(strategy)}
                      onChange={() => handleStrategyToggle(strategy)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {strategy.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="mb-6">
            <button
              onClick={generatePresets}
              disabled={state.isGenerating || !selectedImage || selectedStrategies.length === 0}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {state.isGenerating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating Presets... {state.progress}%</span>
                </div>
              ) : (
                'Generate Advanced Presets'
              )}
            </button>
          </div>

          {/* Error Display */}
          {state.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{state.error}</p>
            </div>
          )}

          {/* Progress Bar */}
          {state.isGenerating && (
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${state.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-800 mt-2">
                {state.currentStrategy && `Current strategy: ${state.currentStrategy}`}
              </p>
            </div>
          )}

          {/* Generated Presets */}
          {state.generatedPresets.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Generated Presets ({state.generatedPresets.length})
                </h3>
                <button
                  onClick={exportPresets}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Export JSON
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Preset List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {state.generatedPresets.map((preset, index) => (
                    <div
                      key={preset.id}
                      onClick={() => selectPreset(preset)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors bg-white ${
                        state.selectedPreset?.id === preset.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{preset.name}</h4>
                        <span className="text-sm text-gray-500 capitalize">
                          {preset.strategy.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`px-2 py-1 rounded ${getScoreBackground(preset.scores.overall)} ${getScoreColor(preset.scores.overall)}`}>
                          Score: {preset.scores.overall.toFixed(1)}
                        </span>
                        <span className="text-gray-800">
                          Confidence: {preset.confidence.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Preset Details */}
                {state.selectedPreset && (
                  <div className="space-y-4 bg-white p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {state.selectedPreset.name}
                      </h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => applyPreset(state.selectedPreset!)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Apply Preset
                        </button>
                        <button
                          onClick={togglePreview}
                          className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-purple-700 transition-colors"
                        >
                          {state.isPreviewing ? 'Hide Preview' : 'Show Preview'}
                        </button>
                      </div>
                    </div>

                    {/* Visual Preview */}
                    {state.isPreviewing && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h5 className="text-sm font-medium text-gray-700 mb-3">Visual Preview</h5>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <strong className="text-gray-800">Geometric Shapes:</strong>
                            <div className="mt-1 space-y-1">
                              {Object.entries(state.selectedPreset.visualState.geometric).map(([shape, config]) => (
                                <div key={shape} className="flex items-center space-x-2">
                                  <div 
                                    className="w-4 h-4 rounded border border-gray-300"
                                    style={{ backgroundColor: config.color }}
                                  ></div>
                                  <span className="text-gray-700 capitalize">{shape}:</span>
                                  <span className="text-gray-600 font-mono">{config.count} items</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <strong className="text-gray-800">Effects:</strong>
                            <div className="mt-1 space-y-1">
                              {Object.entries(state.selectedPreset.visualState.effects).map(([effect, value]) => (
                                <div key={effect} className="flex justify-between">
                                  <span className="text-gray-700 capitalize">{effect}:</span>
                                  <span className="text-gray-600 font-mono">{typeof value === 'number' ? value.toFixed(2) : String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
                          💡 This preset will create a {state.selectedPreset.strategy.replace('_', ' ')} style visualization with {state.selectedPreset.confidence.toFixed(0)}% confidence.
                        </div>
                      </div>
                    )}
                    
                    {/* Quality Scores */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Quality Scores</h5>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(state.selectedPreset.scores).map(([key, score]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className={`text-sm font-medium ${getScoreColor(score)}`}>
                              {score.toFixed(1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Visual State Preview */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Visual Configuration</h5>
                      <div className="bg-gray-50 p-3 rounded-lg text-xs font-mono overflow-x-auto max-h-32 border border-gray-200">
                        <pre className="text-gray-800 !text-gray-800" style={{ color: '#1f2937' }}>{JSON.stringify(state.selectedPreset.visualState, null, 2)}</pre>
                      </div>
                    </div>

                    {/* Performance Estimate */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Performance Estimate</h5>
                      <div className="grid grid-cols-2 gap-3 text-sm text-gray-800 !text-gray-800" style={{ color: '#1f2937' }}>
                        <div>FPS: {state.selectedPreset.metadata.estimatedPerformance.fps.toFixed(1)}</div>
                        <div>Memory: {state.selectedPreset.metadata.estimatedPerformance.memoryUsage.toFixed(1)} MB</div>
                        <div>Complexity: {state.selectedPreset.metadata.estimatedPerformance.complexity.toFixed(1)}</div>
                        <div>Render Time: {state.selectedPreset.metadata.estimatedPerformance.renderTime.toFixed(1)}ms</div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Generation Info</h5>
                      <div className="text-sm text-gray-800 !text-gray-800 space-y-1" style={{ color: '#1f2937' }}>
                        <div>Strategy: {state.selectedPreset.strategy.replace('_', ' ')}</div>
                        <div>Seed: {state.selectedPreset.metadata.generationSeed}</div>
                        <div>Created: {state.selectedPreset.metadata.createdAt.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 