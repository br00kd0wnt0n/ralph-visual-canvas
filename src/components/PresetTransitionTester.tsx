import React, { useState } from 'react';
import { useVisualStore } from '../store/visualStore';

export const PresetTransitionTester = () => {
  const { getAvailablePresets, transitionPreset, loadPreset } = useVisualStore();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPreset, setCurrentPreset] = useState<string>('');

  const availablePresets = getAvailablePresets();

  const handleTransition = async (presetName: string) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentPreset(presetName);
    
    try {
      console.log(`🎬 Starting transition to ${presetName}...`);
      await transitionPreset(presetName, 2500); // 2.5 second transition
      console.log(`✅ Transition to ${presetName} completed!`);
    } catch (error) {
      console.error('❌ Transition failed:', error);
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleInstantLoad = (presetName: string) => {
    if (isTransitioning) return;
    
    setCurrentPreset(presetName);
    loadPreset(presetName);
    console.log(`⚡ Instantly loaded ${presetName}`);
  };

  if (availablePresets.length === 0) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-white font-medium mb-2">Preset Transition Tester</h3>
        <p className="text-gray-400 text-sm">No presets available</p>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-gray-800 rounded-lg p-4 border border-gray-700 max-w-xs">
      <h3 className="text-white font-medium mb-3">Preset Transition Tester</h3>
      
      <div className="space-y-2">
        {availablePresets.map((preset) => (
          <div key={preset} className="flex space-x-2">
            <button
              onClick={() => handleTransition(preset)}
              disabled={isTransitioning}
              className={`flex-1 px-3 py-2 text-sm rounded transition-all ${
                isTransitioning 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isTransitioning && currentPreset === preset ? '🎬' : '🎭'} Transition
            </button>
            
            <button
              onClick={() => handleInstantLoad(preset)}
              disabled={isTransitioning}
              className={`px-3 py-2 text-sm rounded transition-all ${
                isTransitioning 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              ⚡
            </button>
          </div>
        ))}
      </div>
      
      {isTransitioning && (
        <div className="mt-3 text-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mx-auto mb-2"></div>
          <p className="text-blue-400 text-sm">Transitioning to {currentPreset}...</p>
        </div>
      )}
    </div>
  );
}; 