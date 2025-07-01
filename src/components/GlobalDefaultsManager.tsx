import React, { useState, useEffect, useRef } from 'react';
import { useVisualStore } from '../store/visualStore';
import { GlobalDefaultsManager, CameraPresets, GLOBAL_DEFAULTS } from '../utils/globalDefaults';
import { AIService } from '../ai-system/services/AIService';
import { WeatherService } from '../ai-system/services/WeatherService';

interface GlobalDefaultsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalDefaultsPanel({ isOpen, onClose }: GlobalDefaultsPanelProps) {
  const [activeTab, setActiveTab] = useState<'camera' | 'visual' | 'performance' | 'quality' | 'animation' | 'logo' | 'apikeys'>('camera');
  const [showPresets, setShowPresets] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0); // Force re-renders when defaults change
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');
  
  // API Key Management
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [weatherApiKey, setWeatherApiKey] = useState('');
  const [testingOpenAI, setTestingOpenAI] = useState(false);
  const [testingWeather, setTestingWeather] = useState(false);
  const [openAIStatus, setOpenAIStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [weatherStatus, setWeatherStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  
  const visualStore = useVisualStore();
  // Use the store's getGlobalDefaults function to get reactive defaults
  const currentDefaults = visualStore.getGlobalDefaults();

  const handleUpdateDefaults = (category: keyof typeof currentDefaults, updates: any) => {
    console.log('[GlobalDefaultsPanel] handleUpdateDefaults called:', { category, updates });
    console.log('[GlobalDefaultsPanel] Before update - currentDefaults:', currentDefaults);
    
    visualStore.updateGlobalDefaults(category, updates);
    
    // Force immediate re-render
    setUpdateTrigger(prev => prev + 1);
    
    console.log('[GlobalDefaultsPanel] After update - new defaults:', visualStore.getGlobalDefaults());
  };

  const handleResetCategory = (category: keyof typeof currentDefaults) => {
    console.log('[GlobalDefaultsPanel] handleResetCategory called:', category);
    
    switch (category) {
      case 'camera':
        visualStore.resetCameraToDefaults();
        setUpdateTrigger(prev => prev + 1);
        console.log('[GlobalDefaultsPanel] Camera reset completed');
        break;
      case 'visual':
        visualStore.resetVisualEffectsToDefaults();
        setUpdateTrigger(prev => prev + 1);
        console.log('[GlobalDefaultsPanel] Visual effects reset completed');
        break;
      case 'performance':
        // Reset performance defaults to initial values
        GlobalDefaultsManager.resetAllDefaults();
        // Force apply the reset defaults
        visualStore.forceApplyGlobalDefaults();
        setUpdateTrigger(prev => prev + 1);
        console.log('[GlobalDefaultsPanel] Performance reset completed');
        break;
      case 'quality':
        // Reset quality defaults to initial values
        GlobalDefaultsManager.resetAllDefaults();
        // Force apply the reset defaults
        visualStore.forceApplyGlobalDefaults();
        setUpdateTrigger(prev => prev + 1);
        console.log('[GlobalDefaultsPanel] Quality reset completed');
        break;
      case 'animation':
        // Reset animation defaults to initial values
        GlobalDefaultsManager.resetAllDefaults();
        // Force apply the reset defaults
        visualStore.forceApplyGlobalDefaults();
        setUpdateTrigger(prev => prev + 1);
        console.log('[GlobalDefaultsPanel] Animation reset completed');
        break;
      case 'logo':
        // Reset logo defaults to initial values
        GlobalDefaultsManager.resetAllDefaults();
        // Force apply the reset defaults
        visualStore.forceApplyGlobalDefaults();
        setUpdateTrigger(prev => prev + 1);
        console.log('[GlobalDefaultsPanel] Logo reset completed');
        break;
      default:
        // For other categories, we need to manually reset
        GlobalDefaultsManager.resetAllDefaults();
        setUpdateTrigger(prev => prev + 1);
        console.log('[GlobalDefaultsPanel] Default reset completed');
        break;
    }
  };

  const handleApplyPreset = (presetName: keyof typeof CameraPresets) => {
    console.log('[GlobalDefaultsPanel] handleApplyPreset called:', presetName);
    const preset = CameraPresets[presetName];
    console.log('[GlobalDefaultsPanel] Applying preset:', preset);
    
    // Update both the defaults and the interactive position
    if (preset.position && preset.target) {
      visualStore.updateCamera(preset);
    }
    
    setUpdateTrigger(prev => prev + 1);
    
    console.log('[GlobalDefaultsPanel] Preset applied successfully');
  };

  // Show feedback message and clear after 3 seconds
  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMessage(message);
    setFeedbackType(type);
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  // API Key Management Functions
  const aiService = AIService.getInstance();
  const weatherService = WeatherService.getInstance();

  // Load API keys on mount
  useEffect(() => {
    // Check if we're in production (environment variables should be used)
    const isProduction = typeof process !== 'undefined' && process.env.NODE_ENV === 'production';
    
    if (!isProduction) {
      // Development: Load from localStorage
      const storedOpenAI = localStorage.getItem('openai-api-key') || '';
      const storedWeather = localStorage.getItem('openweather-api-key') || '';
      setOpenaiApiKey(storedOpenAI);
      setWeatherApiKey(storedWeather);
    }
  }, []);

  const testOpenAIKey = async () => {
    if (!openaiApiKey.trim()) {
      showFeedback('Please enter an OpenAI API key first', 'error');
      return;
    }

    setTestingOpenAI(true);
    setOpenAIStatus('testing');

    try {
      aiService.setApiKey(openaiApiKey.trim());
      const isValid = await aiService.testApiKey();
      
      if (isValid) {
        setOpenAIStatus('success');
        showFeedback('✅ OpenAI API key is valid and working');
      } else {
        setOpenAIStatus('error');
        showFeedback('❌ OpenAI API key test failed', 'error');
      }
    } catch (err) {
      setOpenAIStatus('error');
      showFeedback(`OpenAI API key test failed: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    } finally {
      setTestingOpenAI(false);
    }
  };

  const testWeatherKey = async () => {
    if (!weatherApiKey.trim()) {
      showFeedback('Please enter a Weather API key first', 'error');
      return;
    }

    setTestingWeather(true);
    setWeatherStatus('testing');

    try {
      weatherService.setApiKey(weatherApiKey.trim());
      const isValid = await weatherService.testApiKey();
      
      if (isValid) {
        setWeatherStatus('success');
        showFeedback('✅ Weather API key is valid and working');
      } else {
        setWeatherStatus('error');
        showFeedback('❌ Weather API key test failed', 'error');
      }
    } catch (err) {
      setWeatherStatus('error');
      showFeedback(`Weather API key test failed: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    } finally {
      setTestingWeather(false);
    }
  };

  const saveApiKeys = () => {
    if (openaiApiKey.trim()) {
      aiService.setApiKey(openaiApiKey.trim());
      localStorage.setItem('openai-api-key', openaiApiKey.trim());
    }
    if (weatherApiKey.trim()) {
      weatherService.setApiKey(weatherApiKey.trim());
      localStorage.setItem('openweather-api-key', weatherApiKey.trim());
    }
    showFeedback('✅ API keys saved successfully');
  };

  const clearApiKeys = () => {
    setOpenaiApiKey('');
    setWeatherApiKey('');
    localStorage.removeItem('openai-api-key');
    localStorage.removeItem('openweather-api-key');
    showFeedback('✅ API keys cleared');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900/90 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <h2 className="text-xl font-bold text-white">Global Defaults Manager</h2>
          </div>
          <div className="flex items-center space-x-4">
            {feedbackMessage && (
              <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                feedbackType === 'success' 
                  ? 'bg-green-900/50 text-green-300 border border-green-700/30' 
                  : 'bg-red-900/50 text-red-300 border border-red-700/30'
              }`}>
                {feedbackMessage}
              </div>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
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
                { id: 'animation', label: 'Animation', icon: '🎬' },
                { id: 'logo', label: 'Logo', icon: '🏷' },
                { id: 'apikeys', label: 'API Keys', icon: '🔑' }
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
                  onClick={() => {
                    try {
                      visualStore.resetToGlobalDefaults();
                      setUpdateTrigger(prev => prev + 1);
                      console.log('[GlobalDefaultsPanel] Reset All to Defaults clicked. Current:', visualStore.getGlobalDefaults());
                      showFeedback('✅ All settings reset to global defaults!');
                    } catch (error) {
                      console.error('[GlobalDefaultsPanel] Error resetting to defaults:', error);
                      showFeedback('❌ Error resetting to defaults', 'error');
                    }
                  }}
                  className="w-full px-3 py-2 text-sm bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                >
                  Reset All to Defaults
                </button>
                <button
                  onClick={() => {
                    try {
                      visualStore.forceApplyGlobalDefaults();
                      setUpdateTrigger(prev => prev + 1);
                      console.log('[GlobalDefaultsPanel] Force Override AI Changes clicked. Current:', visualStore.getGlobalDefaults());
                      showFeedback('✅ Global defaults force applied!');
                    } catch (error) {
                      console.error('[GlobalDefaultsPanel] Error force applying defaults:', error);
                      showFeedback('❌ Error force applying defaults', 'error');
                    }
                  }}
                  className="w-full px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Force Override AI Changes
                </button>
                <button
                  onClick={() => {
                    try {
                      GlobalDefaultsManager.saveDefaults();
                      setUpdateTrigger(prev => prev + 1);
                      console.log('[GlobalDefaultsPanel] Save Defaults clicked. Current:', visualStore.getGlobalDefaults());
                      showFeedback('✅ Defaults saved to localStorage!');
                    } catch (error) {
                      console.error('[GlobalDefaultsPanel] Error saving defaults:', error);
                      showFeedback('❌ Error saving defaults', 'error');
                    }
                  }}
                  className="w-full px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Save Defaults
                </button>
                <button
                  onClick={() => {
                    try {
                      GlobalDefaultsManager.loadDefaults();
                      setUpdateTrigger(prev => prev + 1);
                      console.log('[GlobalDefaultsPanel] Load Saved Defaults clicked. Current:', visualStore.getGlobalDefaults());
                      showFeedback('✅ Defaults loaded from localStorage!');
                    } catch (error) {
                      console.error('[GlobalDefaultsPanel] Error loading defaults:', error);
                      showFeedback('❌ Error loading defaults', 'error');
                    }
                  }}
                  className="w-full px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Load Saved Defaults
                </button>
                <button
                  onClick={() => {
                    try {
                      visualStore.clearCachedDefaults();
                      setUpdateTrigger(prev => prev + 1);
                      if (process.env.NODE_ENV === 'development') {
                        console.log('[GlobalDefaultsPanel] Clear Cached Defaults clicked');
                      }
                      showFeedback('✅ Cached defaults cleared!');
                    } catch (error) {
                      if (process.env.NODE_ENV === 'development') {
                        console.error('[GlobalDefaultsPanel] Error clearing cached defaults:', error);
                      }
                      showFeedback('❌ Error clearing cached defaults', 'error');
                    }
                  }}
                  className="w-full px-3 py-2 text-sm bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                >
                  Clear Cached Defaults
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Global Weather Location Field */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-2">Weather Location</label>
              <input
                type="text"
                value={visualStore.location}
                onChange={e => visualStore.setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter city, region, or coordinates"
              />
              <div className="text-xs text-gray-400 mt-1">Current: {visualStore.location}</div>
            </div>

            {activeTab === 'camera' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Interactive Camera Positioning</h3>
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
                    <div className="grid grid-cols-3 gap-3">
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

                <div className="space-y-4">
                  {/* Camera Info Panel */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">Current Position</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">X:</span>
                        <span className="text-white font-mono">{currentDefaults.camera.position[0].toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Y:</span>
                        <span className="text-white font-mono">{currentDefaults.camera.position[1].toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Z:</span>
                        <span className="text-white font-mono">{currentDefaults.camera.position[2].toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Distance:</span>
                        <span className="text-white font-mono">{Math.sqrt(currentDefaults.camera.position[0] ** 2 + currentDefaults.camera.position[2] ** 2).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Camera Controls */}
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-600/30">
                    <h3 className="text-lg font-semibold text-blue-400 mb-4">Camera Controls</h3>
                    
                    {/* Camera Positioning Mode Toggle */}
                    <div className="mb-4 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-blue-300">Live Camera Positioning</label>
                        <button
                          onClick={() => visualStore.toggleCameraPositioningMode()}
                          className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                            visualStore.ui.cameraPositioningMode
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-gray-600 hover:bg-gray-700 text-gray-200'
                          }`}
                        >
                          {visualStore.ui.cameraPositioningMode ? 'Active' : 'Enable'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">
                        {visualStore.ui.cameraPositioningMode 
                          ? 'Click and drag on the live view to position camera. Press ESC to exit.'
                          : 'Enable to directly control camera position on the live view instead of using sliders.'
                        }
                      </p>
                    </div>
                    
                    {/* Field of View Slider */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Field of View: {currentDefaults.camera.fov}°
                      </label>
                      <input
                        type="range"
                        min="30"
                        max="120"
                        step="1"
                        value={currentDefaults.camera.fov}
                        onChange={(e) => handleUpdateDefaults('camera', { fov: parseInt(e.target.value) })}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>30°</span>
                        <span>75°</span>
                        <span>120°</span>
                      </div>
                    </div>

                    {/* Depth of Field Controls */}
                    <div className="mb-4 p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-purple-300">Depth of Field</h4>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={currentDefaults.camera.depthOfField.enabled}
                            onChange={(e) => handleUpdateDefaults('camera', { 
                              depthOfField: { 
                                ...currentDefaults.camera.depthOfField, 
                                enabled: e.target.checked 
                              } 
                            })}
                            className="rounded"
                          />
                          <span className="text-xs text-gray-300">Enabled</span>
                        </div>
                      </div>
                      
                      {currentDefaults.camera.depthOfField.enabled && (
                        <div className="space-y-3">
                          {/* Focus Distance */}
                          <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1">
                              Focus Distance: {currentDefaults.camera.depthOfField.focusDistance}
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="50"
                              step="0.5"
                              value={currentDefaults.camera.depthOfField.focusDistance}
                              onChange={(e) => handleUpdateDefaults('camera', { 
                                depthOfField: { 
                                  ...currentDefaults.camera.depthOfField, 
                                  focusDistance: Number(e.target.value) 
                                } 
                              })}
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                              <span>1</span>
                              <span>25</span>
                              <span>50</span>
                            </div>
                          </div>

                          {/* Focal Length */}
                          <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1">
                              Focal Length: {currentDefaults.camera.depthOfField.focalLength}mm
                            </label>
                            <input
                              type="range"
                              min="10"
                              max="200"
                              step="5"
                              value={currentDefaults.camera.depthOfField.focalLength}
                              onChange={(e) => handleUpdateDefaults('camera', { 
                                depthOfField: { 
                                  ...currentDefaults.camera.depthOfField, 
                                  focalLength: Number(e.target.value) 
                                } 
                              })}
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                              <span>10mm</span>
                              <span>100mm</span>
                              <span>200mm</span>
                            </div>
                          </div>

                          {/* Bokeh Scale */}
                          <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1">
                              Bokeh Scale: {currentDefaults.camera.depthOfField.bokehScale}
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="5"
                              step="0.1"
                              value={currentDefaults.camera.depthOfField.bokehScale}
                              onChange={(e) => handleUpdateDefaults('camera', { 
                                depthOfField: { 
                                  ...currentDefaults.camera.depthOfField, 
                                  bokehScale: Number(e.target.value) 
                                } 
                              })}
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                              <span>0</span>
                              <span>2.5</span>
                              <span>5</span>
                            </div>
                          </div>

                          {/* Blur */}
                          <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1">
                              Blur: {currentDefaults.camera.depthOfField.blur}
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="2"
                              step="0.1"
                              value={currentDefaults.camera.depthOfField.blur}
                              onChange={(e) => handleUpdateDefaults('camera', { 
                                depthOfField: { 
                                  ...currentDefaults.camera.depthOfField, 
                                  blur: Number(e.target.value) 
                                } 
                              })}
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                              <span>0</span>
                              <span>1</span>
                              <span>2</span>
                            </div>
                          </div>
                        </div>
                      )}
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

                {/* Global Blend Modes Panel */}
                <div className="mb-6 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                  <h4 className="text-sm font-semibold text-blue-300 mb-3">Global Blend Modes</h4>
                  <div className="flex items-center space-x-4 mb-3">
                    <label className="text-xs text-gray-300 font-medium">Blend Mode:</label>
                    <select
                      value={currentDefaults.globalBlendMode.mode}
                      onChange={e => handleUpdateDefaults('globalBlendMode', { mode: e.target.value })}
                      className="bg-gray-800 text-white rounded px-2 py-1 border border-gray-700 focus:outline-none"
                    >
                      <option value="normal">Normal</option>
                      <option value="multiply">Multiply</option>
                      <option value="screen">Screen</option>
                      <option value="overlay">Overlay</option>
                      <option value="darken">Darken</option>
                      <option value="lighten">Lighten</option>
                      <option value="color-dodge">Color Dodge</option>
                      <option value="color-burn">Color Burn</option>
                      <option value="hard-light">Hard Light</option>
                      <option value="soft-light">Soft Light</option>
                      <option value="difference">Difference</option>
                      <option value="exclusion">Exclusion</option>
                      <option value="hue">Hue</option>
                      <option value="saturation">Saturation</option>
                      <option value="color">Color</option>
                      <option value="luminosity">Luminosity</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="text-xs text-gray-300 font-medium">Opacity:</label>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={currentDefaults.globalBlendMode.opacity}
                      onChange={e => handleUpdateDefaults('globalBlendMode', { opacity: Number(e.target.value) })}
                      className="w-40"
                    />
                    <span className="text-xs text-gray-400">{Math.round(currentDefaults.globalBlendMode.opacity * 100)}%</span>
                  </div>
                </div>
                {/* End Global Blend Modes Panel */}
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
                      <div className="text-xs text-gray-400 mt-1">{currentDefaults.performance.maxParticles} particles</div>
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
                      <div className="text-xs text-gray-400 mt-1">{currentDefaults.performance.maxShapes} shapes</div>
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
                        <span className="text-sm text-gray-300">Enabled</span>
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
                        max="3.0"
                        step="0.1"
                        value={currentDefaults.animation.defaultSpeed}
                        onChange={(e) => handleUpdateDefaults('animation', { defaultSpeed: Number(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        {currentDefaults.animation.defaultSpeed}x
                        {currentDefaults.animation.defaultSpeed > 2.0 && (
                          <span className="text-yellow-400 ml-2">⚠️ High speed may affect performance</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-300 mb-3">Animation Info</h4>
                      <p className="text-xs text-gray-400">
                        This controls the global animation speed multiplier that affects all animated elements in the scene.
                        Lower values create slower, more cinematic animations, while higher values create faster, more energetic movements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'logo' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Logo Defaults</h3>
                  <button
                    onClick={() => handleResetCategory('logo')}
                    className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                  >
                    Reset
                  </button>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-600/30">
                  <h3 className="text-lg font-semibold text-blue-400 mb-4">Logo Configuration</h3>
                  
                  {/* Logo Enable/Disable */}
                  <div className="mb-4 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-blue-300">Show Company Logo</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={currentDefaults.logo.enabled}
                          onChange={(e) => handleUpdateDefaults('logo', { enabled: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-xs text-gray-300">Enabled</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">
                      Enable to display the company logo overlay on the canvas.
                    </p>
                  </div>

                  {/* Logo Size */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Logo Size: {currentDefaults.logo.size}px
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="800"
                      step="10"
                      value={currentDefaults.logo.size}
                      onChange={(e) => handleUpdateDefaults('logo', { size: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>50px</span>
                      <span>425px</span>
                      <span>800px</span>
                    </div>
                  </div>

                  {/* Logo Position */}
                  <div className="mb-4 p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                    <h4 className="text-sm font-semibold text-purple-300 mb-3">Logo Position</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Horizontal Position */}
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-2">Horizontal</label>
                        <select
                          value={currentDefaults.logo.position.x}
                          onChange={(e) => handleUpdateDefaults('logo', { 
                            position: { 
                              ...currentDefaults.logo.position, 
                              x: e.target.value as 'left' | 'center' | 'right' 
                            } 
                          })}
                          className="w-full bg-gray-800 text-white rounded px-2 py-1 border border-gray-700 focus:outline-none text-xs"
                        >
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
                        </select>
                      </div>

                      {/* Vertical Position */}
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-2">Vertical</label>
                        <select
                          value={currentDefaults.logo.position.y}
                          onChange={(e) => handleUpdateDefaults('logo', { 
                            position: { 
                              ...currentDefaults.logo.position, 
                              y: e.target.value as 'top' | 'center' | 'bottom' 
                            } 
                          })}
                          className="w-full bg-gray-800 text-white rounded px-2 py-1 border border-gray-700 focus:outline-none text-xs"
                        >
                          <option value="top">Top</option>
                          <option value="center">Center</option>
                          <option value="bottom">Bottom</option>
                        </select>
                      </div>
                    </div>

                    {/* Offset Controls */}
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">
                          X Offset: {currentDefaults.logo.offset.x}px
                        </label>
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          step="5"
                          value={currentDefaults.logo.offset.x}
                          onChange={(e) => handleUpdateDefaults('logo', { 
                            offset: { 
                              ...currentDefaults.logo.offset, 
                              x: parseInt(e.target.value) 
                            } 
                          })}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">
                          Y Offset: {currentDefaults.logo.offset.y}px
                        </label>
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          step="5"
                          value={currentDefaults.logo.offset.y}
                          onChange={(e) => handleUpdateDefaults('logo', { 
                            offset: { 
                              ...currentDefaults.logo.offset, 
                              y: parseInt(e.target.value) 
                            } 
                          })}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Logo Opacity */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Logo Opacity: {Math.round(currentDefaults.logo.opacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={currentDefaults.logo.opacity}
                      onChange={(e) => handleUpdateDefaults('logo', { opacity: Number(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>10%</span>
                      <span>55%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Logo Animation */}
                  <div className="mb-4 p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-green-300">Logo Animation</h4>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={currentDefaults.logo.animation.enabled}
                          onChange={(e) => handleUpdateDefaults('logo', { 
                            animation: { 
                              ...currentDefaults.logo.animation, 
                              enabled: e.target.checked 
                            } 
                          })}
                          className="rounded"
                        />
                        <span className="text-xs text-gray-300">Enabled</span>
                      </div>
                    </div>
                    
                    {currentDefaults.logo.animation.enabled && (
                      <div className="space-y-3">
                        {/* Animation Type */}
                        <div>
                          <label className="block text-xs font-medium text-gray-300 mb-2">Animation Type</label>
                          <select
                            value={currentDefaults.logo.animation.type}
                            onChange={(e) => handleUpdateDefaults('logo', { 
                              animation: { 
                                ...currentDefaults.logo.animation, 
                                type: e.target.value as 'pulse' | 'float' | 'rotate' | 'none' 
                              } 
                            })}
                            className="w-full bg-gray-800 text-white rounded px-2 py-1 border border-gray-700 focus:outline-none text-xs"
                          >
                            <option value="none">None</option>
                            <option value="pulse">Pulse</option>
                            <option value="float">Float</option>
                            <option value="rotate">Rotate</option>
                          </select>
                        </div>

                        {/* Animation Speed */}
                        <div>
                          <label className="block text-xs font-medium text-gray-300 mb-1">
                            Animation Speed: {currentDefaults.logo.animation.speed}x
                          </label>
                          <input
                            type="range"
                            min="0.1"
                            max="3"
                            step="0.1"
                            value={currentDefaults.logo.animation.speed}
                            onChange={(e) => handleUpdateDefaults('logo', { 
                              animation: { 
                                ...currentDefaults.logo.animation, 
                                speed: Number(e.target.value) 
                              } 
                            })}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>0.1x</span>
                            <span>1.5x</span>
                            <span>3x</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'apikeys' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">API Key Management</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">
                      {typeof process !== 'undefined' && process.env.NODE_ENV === 'production' 
                        ? '🔒 Production Mode (Use Railway Environment Variables)' 
                        : '🛠️ Development Mode (localStorage)'
                      }
                    </span>
                  </div>
                </div>

                {/* Production Warning */}
                {typeof process !== 'undefined' && process.env.NODE_ENV === 'production' && (
                  <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-yellow-400">⚠️</span>
                      <span className="text-yellow-300 font-medium">Production Environment</span>
                    </div>
                    <p className="text-sm text-yellow-200">
                      In production, API keys should be configured via Railway environment variables, not through this interface.
                      Contact your administrator to set up the required environment variables.
                    </p>
                  </div>
                )}

                {/* Development API Key Management */}
                {(!process || process.env.NODE_ENV !== 'production') && (
                  <div className="space-y-6">
                    {/* OpenAI API Key */}
                    <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/50 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-blue-400 text-xl">🤖</span>
                          <div>
                            <h4 className="text-lg font-semibold text-white">OpenAI API Key</h4>
                            <p className="text-sm text-gray-400">For AI analysis and theme generation</p>
                          </div>
                        </div>
                        <span className={`text-sm px-3 py-1 rounded-full ${
                          openAIStatus === 'success' 
                            ? 'bg-green-900/60 text-green-400' 
                            : openAIStatus === 'error'
                            ? 'bg-red-900/60 text-red-400'
                            : openAIStatus === 'testing'
                            ? 'bg-yellow-900/60 text-yellow-400'
                            : 'bg-gray-700/60 text-gray-400'
                        }`}>
                          {openAIStatus === 'success' ? '✅ Valid' : 
                           openAIStatus === 'error' ? '❌ Invalid' : 
                           openAIStatus === 'testing' ? '🔄 Testing' : '⚪ Not Tested'}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <input
                          type="password"
                          value={openaiApiKey}
                          onChange={(e) => setOpenaiApiKey(e.target.value)}
                          placeholder="sk-..."
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={testOpenAIKey}
                            disabled={testingOpenAI || !openaiApiKey.trim()}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
                          >
                            {testingOpenAI ? (
                              <>
                                <span className="animate-spin">🔄</span>
                                <span>Testing...</span>
                              </>
                            ) : (
                              <>
                                <span>🧪</span>
                                <span>Test Key</span>
                              </>
                            )}
                          </button>
                          <a 
                            href="https://platform.openai.com/api-keys" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm underline"
                          >
                            Get API Key →
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Weather API Key */}
                    <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/50 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-green-400 text-xl">🌤️</span>
                          <div>
                            <h4 className="text-lg font-semibold text-white">OpenWeather API Key</h4>
                            <p className="text-sm text-gray-400">For weather-based visual effects</p>
                          </div>
                        </div>
                        <span className={`text-sm px-3 py-1 rounded-full ${
                          weatherStatus === 'success' 
                            ? 'bg-green-900/60 text-green-400' 
                            : weatherStatus === 'error'
                            ? 'bg-red-900/60 text-red-400'
                            : weatherStatus === 'testing'
                            ? 'bg-yellow-900/60 text-yellow-400'
                            : 'bg-gray-700/60 text-gray-400'
                        }`}>
                          {weatherStatus === 'success' ? '✅ Valid' : 
                           weatherStatus === 'error' ? '❌ Invalid' : 
                           weatherStatus === 'testing' ? '🔄 Testing' : '⚪ Not Tested'}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <input
                          type="password"
                          value={weatherApiKey}
                          onChange={(e) => setWeatherApiKey(e.target.value)}
                          placeholder="your-openweather-api-key"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={testWeatherKey}
                            disabled={testingWeather || !weatherApiKey.trim()}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
                          >
                            {testingWeather ? (
                              <>
                                <span className="animate-spin">🔄</span>
                                <span>Testing...</span>
                              </>
                            ) : (
                              <>
                                <span>🧪</span>
                                <span>Test Key</span>
                              </>
                            )}
                          </button>
                          <a 
                            href="https://openweathermap.org/api" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 text-sm underline"
                          >
                            Get API Key →
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={saveApiKeys}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
                      >
                        <span>💾</span>
                        <span>Save All Keys</span>
                      </button>
                      <button
                        onClick={clearApiKeys}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
                      >
                        <span>🗑️</span>
                        <span>Clear All Keys</span>
                      </button>
                    </div>

                    {/* Help Information */}
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-blue-300 mb-3">💡 API Key Help</h4>
                      <div className="space-y-2 text-sm text-blue-200">
                        <p><strong>OpenAI API Key:</strong> Starts with "sk-", used for AI image analysis and theme generation</p>
                        <p><strong>OpenWeather API Key:</strong> Different format, used for weather-based visual effects</p>
                        <p><strong>Security:</strong> Keys are stored in localStorage for development only. Production uses environment variables.</p>
                        <p><strong>Testing:</strong> Use the test buttons to verify your API keys work correctly before saving.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 