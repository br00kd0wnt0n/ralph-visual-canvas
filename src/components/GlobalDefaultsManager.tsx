import React, { useState } from 'react';
import { useVisualStore } from '../store/visualStore';
import { GlobalDefaultsManager, CameraPresets } from '../utils/globalDefaults';

interface GlobalDefaultsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalDefaultsPanel({ isOpen, onClose }: GlobalDefaultsPanelProps) {
  const [activeTab, setActiveTab] = useState<'camera' | 'visual' | 'performance' | 'quality' | 'animation'>('camera');
  const [showPresets, setShowPresets] = useState(false);
  
  const visualStore = useVisualStore();
  const currentDefaults = GlobalDefaultsManager.getDefaults();
  const currentState = visualStore;

  const handleUpdateDefaults = (category: keyof typeof currentDefaults, updates: any) => {
    visualStore.updateGlobalDefaults(category, updates);
  };

  const handleResetCategory = (category: keyof typeof currentDefaults) => {
    switch (category) {
      case 'camera':
        visualStore.resetCameraToDefaults();
        break;
      case 'visual':
        visualStore.resetVisualEffectsToDefaults();
        break;
      default:
        // For other categories, we need to manually reset
        GlobalDefaultsManager.resetAllDefaults();
        break;
    }
  };

  const handleApplyPreset = (presetName: keyof typeof CameraPresets) => {
    const preset = CameraPresets[presetName];
    visualStore.updateCamera(preset);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900/90 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <h2 className="text-xl font-bold text-white">Global Defaults Manager</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-800 border-r border-gray-700 p-4">
            <nav className="space-y-2">
              {[
                { id: 'camera', label: 'Camera', icon: '📷' },
                { id: 'visual', label: 'Visual Effects', icon: '🎨' },
                { id: 'performance', label: 'Performance', icon: '⚡' },
                { id: 'quality', label: 'Quality', icon: '✨' },
                { id: 'animation', label: 'Animation', icon: '🎬' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Quick Actions</h3>
              
              {/* Protection Status */}
              <div className="mb-4 p-3 bg-green-900/20 border border-green-700/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-400 font-medium">Global Defaults Protection Active</span>
                </div>
                <p className="text-xs text-green-300 mt-1">
                  AI and weather effects will respect your global defaults for camera and visual quality parameters.
                </p>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => visualStore.resetToGlobalDefaults()}
                  className="w-full px-3 py-2 text-sm bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                >
                  Reset All to Defaults
                </button>
                <button
                  onClick={() => visualStore.forceApplyGlobalDefaults()}
                  className="w-full px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Force Override AI Changes
                </button>
                <button
                  onClick={() => GlobalDefaultsManager.saveDefaults()}
                  className="w-full px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Save Defaults
                </button>
                <button
                  onClick={() => GlobalDefaultsManager.loadDefaults()}
                  className="w-full px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Load Saved Defaults
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'camera' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Camera Defaults</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowPresets(!showPresets)}
                      className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                    >
                      {showPresets ? 'Hide' : 'Show'} Presets
                    </button>
                    <button
                      onClick={() => handleResetCategory('camera')}
                      className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {showPresets && (
                  <div className="bg-gray-800 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">Camera Presets</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(CameraPresets).map(([name, preset]) => (
                        <button
                          key={name}
                          onClick={() => handleApplyPreset(name as keyof typeof CameraPresets)}
                          className="px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors capitalize"
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Distance</label>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        step="1"
                        value={currentDefaults.camera.distance}
                        onChange={(e) => handleUpdateDefaults('camera', { distance: Number(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-400 mt-1">{currentDefaults.camera.distance}</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Height</label>
                      <input
                        type="range"
                        min="-10"
                        max="20"
                        step="0.5"
                        value={currentDefaults.camera.height}
                        onChange={(e) => handleUpdateDefaults('camera', { height: Number(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-400 mt-1">{currentDefaults.camera.height}</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Field of View</label>
                      <input
                        type="range"
                        min="30"
                        max="120"
                        step="5"
                        value={currentDefaults.camera.fov}
                        onChange={(e) => handleUpdateDefaults('camera', { fov: Number(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-400 mt-1">{currentDefaults.camera.fov}°</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Auto Rotate</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={currentDefaults.camera.autoRotate}
                          onChange={(e) => handleUpdateDefaults('camera', { autoRotate: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-300">Enabled</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Auto Rotate Speed</label>
                      <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={currentDefaults.camera.autoRotateSpeed}
                        onChange={(e) => handleUpdateDefaults('camera', { autoRotateSpeed: Number(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-400 mt-1">{currentDefaults.camera.autoRotateSpeed}</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Damping</label>
                      <input
                        type="range"
                        min="0.01"
                        max="0.2"
                        step="0.01"
                        value={currentDefaults.camera.damping}
                        onChange={(e) => handleUpdateDefaults('camera', { damping: Number(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-400 mt-1">{currentDefaults.camera.damping}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'visual' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Visual Effects Defaults</h3>
                  <button
                    onClick={() => handleResetCategory('visual')}
                    className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                  >
                    Reset
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Vignette</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={currentDefaults.visual.vignette}
                        onChange={(e) => handleUpdateDefaults('visual', { vignette: Number(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-400 mt-1">{currentDefaults.visual.vignette}</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Glow</label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={currentDefaults.visual.glow}
                        onChange={(e) => handleUpdateDefaults('visual', { glow: Number(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-400 mt-1">{currentDefaults.visual.glow}</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Contrast</label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={currentDefaults.visual.contrast}
                        onChange={(e) => handleUpdateDefaults('visual', { contrast: Number(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-400 mt-1">{currentDefaults.visual.contrast}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Saturation</label>
                      <input
                        type="range"
                        min="0"
                        max="3"
                        step="0.1"
                        value={currentDefaults.visual.saturation}
                        onChange={(e) => handleUpdateDefaults('visual', { saturation: Number(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-400 mt-1">{currentDefaults.visual.saturation}</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Brightness</label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={currentDefaults.visual.brightness}
                        onChange={(e) => handleUpdateDefaults('visual', { brightness: Number(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-400 mt-1">{currentDefaults.visual.brightness}</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Bloom</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={currentDefaults.visual.bloom}
                          onChange={(e) => handleUpdateDefaults('visual', { bloom: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-300">Enabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Performance Defaults</h3>
                  <button
                    onClick={() => handleResetCategory('performance')}
                    className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                  >
                    Reset
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Target FPS</label>
                      <input
                        type="range"
                        min="30"
                        max="120"
                        step="10"
                        value={currentDefaults.performance.targetFPS}
                        onChange={(e) => handleUpdateDefaults('performance', { targetFPS: Number(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-400 mt-1">{currentDefaults.performance.targetFPS} FPS</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Max Particles</label>
                      <input
                        type="range"
                        min="100"
                        max="5000"
                        step="100"
                        value={currentDefaults.performance.maxParticles}
                        onChange={(e) => handleUpdateDefaults('performance', { maxParticles: Number(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-400 mt-1">{currentDefaults.performance.maxParticles}</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Max Shapes</label>
                      <input
                        type="range"
                        min="10"
                        max="500"
                        step="10"
                        value={currentDefaults.performance.maxShapes}
                        onChange={(e) => handleUpdateDefaults('performance', { maxShapes: Number(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-400 mt-1">{currentDefaults.performance.maxShapes}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">VSync</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={currentDefaults.performance.enableVSync}
                          onChange={(e) => handleUpdateDefaults('performance', { enableVSync: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-300">Enabled</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Frustum Culling</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={currentDefaults.performance.enableFrustumCulling}
                          onChange={(e) => handleUpdateDefaults('performance', { enableFrustumCulling: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-300">Enabled</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Level of Detail</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={currentDefaults.performance.enableLOD}
                          onChange={(e) => handleUpdateDefaults('performance', { enableLOD: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-300">Enabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'quality' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Quality Defaults</h3>
                  <button
                    onClick={() => handleResetCategory('quality')}
                    className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                  >
                    Reset
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Antialiasing</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={currentDefaults.quality.antialiasing}
                          onChange={(e) => handleUpdateDefaults('quality', { antialiasing: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-300">Enabled</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Shadows</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={currentDefaults.quality.shadows}
                          onChange={(e) => handleUpdateDefaults('quality', { shadows: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-300">Enabled</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Reflections</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={currentDefaults.quality.reflections}
                          onChange={(e) => handleUpdateDefaults('quality', { reflections: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-gray-300">Enabled</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Post Processing</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={currentDefaults.quality.postProcessing}
                          onChange={(e) => handleUpdateDefaults('quality', { postProcessing: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-300">Enabled</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Bloom</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={currentDefaults.quality.bloom}
                          onChange={(e) => handleUpdateDefaults('quality', { bloom: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-300">Enabled</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Motion Blur</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={currentDefaults.quality.motionBlur}
                          onChange={(e) => handleUpdateDefaults('quality', { motionBlur: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-300">Enabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'animation' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Animation Defaults</h3>
                  <button
                    onClick={() => handleResetCategory('animation')}
                    className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                  >
                    Reset
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Default Speed</label>
                      <input
                        type="range"
                        min="0.1"
                        max="3"
                        step="0.1"
                        value={currentDefaults.animation.defaultSpeed}
                        onChange={(e) => handleUpdateDefaults('animation', { defaultSpeed: Number(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-400 mt-1">{currentDefaults.animation.defaultSpeed}x</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Easing</label>
                      <select
                        value={currentDefaults.animation.easing}
                        onChange={(e) => handleUpdateDefaults('animation', { easing: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      >
                        <option value="easeInOut">Ease In Out</option>
                        <option value="easeIn">Ease In</option>
                        <option value="easeOut">Ease Out</option>
                        <option value="linear">Linear</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Loop</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={currentDefaults.animation.loop}
                          onChange={(e) => handleUpdateDefaults('animation', { loop: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-300">Enabled</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Auto Play</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={currentDefaults.animation.autoPlay}
                          onChange={(e) => handleUpdateDefaults('animation', { autoPlay: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-300">Enabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 