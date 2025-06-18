// AI Test Dashboard - Redesigned for Better UX
// 
// This dashboard provides a clear step-by-step testing flow:
// 1. Setup APIs and upload image
// 2. Run AI analysis and weather fetch
// 3. View results and test parameter mapping
// 4. Advanced testing and debugging
//
// Key improvements:
// - Clear step-by-step progression
// - Better visual hierarchy
// - Intuitive testing flow
// - Improved status indicators
// - Better error handling and feedback

import React, { useState, useEffect, useRef } from 'react';
import { MappingEngine } from '../services/MappingEngine';
import { WeatherService } from '../services/WeatherService';
import { TestHelpers } from '../utils/testHelpers';
import { GeneratedParameters, WeatherData } from '../types/AITypes';
import { useAIStore } from '../../store/aiStore';
import ParameterMappingTester from './ParameterMappingTester';

type TestStep = 'setup' | 'analysis' | 'results' | 'advanced';

export const AITestDashboard = () => {
  // Core state
  const [currentStep, setCurrentStep] = useState<TestStep>('setup');
  const [theme, setTheme] = useState('');
  const [location, setLocation] = useState('New York City');
  const [period, setPeriod] = useState<'1hour' | '1day' | '1week'>('1day');
  const [analysis, setAnalysis] = useState<any>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [computed, setComputed] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // API setup
  const [openaiKey, setOpenaiKey] = useState('');
  const [openweatherKey, setOpenweatherKey] = useState('');
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [showWeatherApiSetup, setShowWeatherApiSetup] = useState(false);

  // Zustand store integration
  const {
    aiResults: storeAIResults,
    weatherData: storeWeatherData,
    parameterUpdates,
    isLiveMode,
    mappingEngineStatus,
    showParameterTester,
    setAIResults,
    setWeatherData,
    addParameterUpdates,
    setShowParameterTester,
    clearParameterUpdates
  } = useAIStore();

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Service instances
  const mappingEngine = MappingEngine.getInstance();
  const weatherService = WeatherService.getInstance();

  // Load API keys on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('openai-key');
    if (savedKey) {
      setOpenaiKey(savedKey);
    }
    
    const savedWeatherKey = localStorage.getItem('openweather-api-key');
    if (savedWeatherKey) {
      setOpenweatherKey(savedWeatherKey);
    }
  }, []);

  // Ensure proper scroll behavior
  useEffect(() => {
    // Prevent any unwanted scroll behavior
    const preventScroll = (e: Event) => {
      if (e.target && (e.target as HTMLElement).closest('.image-upload-area')) {
        e.preventDefault();
      }
    };

    // Add event listeners to prevent scroll issues
    document.addEventListener('dragenter', preventScroll, { passive: false });
    document.addEventListener('dragover', preventScroll, { passive: false });
    document.addEventListener('drop', preventScroll, { passive: false });

    // Ensure body scroll is enabled
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';

    return () => {
      // Cleanup event listeners
      document.removeEventListener('dragenter', preventScroll);
      document.removeEventListener('dragover', preventScroll);
      document.removeEventListener('drop', preventScroll);
      
      // Reset body styles
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, []);

  // Sync with store
  useEffect(() => {
    if (storeAIResults) {
      setAnalysis(storeAIResults);
      setCurrentStep('results');
    }
  }, [storeAIResults]);

  useEffect(() => {
    if (storeWeatherData) {
      setWeather(storeWeatherData);
    }
  }, [storeWeatherData]);

  // Helper function to convert image to base64
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const analyzeTheme = async () => {
    if (!theme || !referenceImage) return;
    
    setIsLoading(true);
    setTestResults([]);
    
    try {
      const base64Image = await convertImageToBase64(referenceImage);
      const apiKey = localStorage.getItem('openai-key') || openaiKey;
      
      if (!apiKey) {
        alert('Please setup your OpenAI API key first');
        setShowApiSetup(true);
        setIsLoading(false);
        return;
      }
      
      if (!apiKey.startsWith('sk-') && !apiKey.startsWith('sk-proj-')) {
        throw new Error('Invalid API key format. Should start with "sk-" or "sk-proj-"');
      }
      
      setTestResults(prev => [...prev, '🤖 Calling OpenAI Vision API...']);
      
      const requestPayload = {
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this ${theme} reference image for a generative art piece. Extract and return as JSON:

1. dominantColors: Array of 3-5 hex color codes from the image
2. colorPalette: {primary, secondary, accent} hex codes  
3. mood: Array of 3-5 mood keywords
4. atmosphere: Single descriptive phrase
5. visualCharacteristics: {
   saturation: 0-1 (how vibrant),
   turbulence: 0-1 (how chaotic vs calm),
   harmony: 0-1 (how balanced),
   energy: 0-1 (how dynamic),
   speed: 0-2 (suggested animation speed),
   density: 0-2 (object density multiplier)
}
6. weatherMappings: Suggestions for how weather should influence this theme

Return only valid JSON, no markdown formatting.`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: "low"
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      };
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenAI API key.');
        } else if (response.status === 404) {
          throw new Error('API endpoint not found. Please check your OpenAI API access.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else {
          throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
      }

      const data = await response.json();
      const analysisText = data.choices[0].message.content;
      
      setTestResults(prev => [...prev, '✅ AI response received, parsing analysis...']);
      
      let aiAnalysis;
      try {
        let cleanedResponse = analysisText.trim();
        if (cleanedResponse.startsWith('```json')) {
          cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanedResponse.startsWith('```')) {
          cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        aiAnalysis = JSON.parse(cleanedResponse);
      } catch (parseError) {
        throw new Error('AI returned invalid JSON format');
      }

      const enrichedAnalysis = {
        ...aiAnalysis,
        theme,
        imageName: referenceImage.name,
        imageSize: `${(referenceImage.size / 1024).toFixed(1)} KB`,
        processingTime: `${Date.now() - Date.now()}ms`,
        source: 'OpenAI Vision API',
        apiTokens: data.usage?.total_tokens || 'Unknown',
        confidence: 0.95,
        timestamp: new Date().toISOString()
      };

      setAnalysis(enrichedAnalysis);
      setAIResults(enrichedAnalysis);
      clearParameterUpdates();
      
      setTestResults(prev => [...prev, '✅ Analysis complete!']);
      setCurrentStep('results');
      
    } catch (error) {
      console.error('Analysis error:', error);
      setTestResults(prev => [...prev, `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
      await mockAnalyzeTheme();
    } finally {
      setIsLoading(false);
    }
  };

  const mockAnalyzeTheme = async () => {
    setTestResults(prev => [...prev, '🎭 Using mock analysis...']);
    
    const mockAnalysis = {
      theme,
      dominantColors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
      colorPalette: {
        primary: '#ff6b6b',
        secondary: '#4ecdc4',
        accent: '#feca57',
        supporting: ['#45b7d1', '#96ceb4']
      },
      mood: ['energetic', 'playful', 'vibrant', 'dynamic'],
      atmosphere: 'A lively and colorful digital landscape',
      visualCharacteristics: {
        saturation: 0.8,
        turbulence: 0.6,
        harmony: 0.7,
        energy: 0.9,
        speed: 1.2,
        density: 1.1,
        brightness: 1.0
      },
      weatherMappings: {
        temperature: {
          hueShift: (temp: number) => temp > 70 ? 30 : 0,
          speedMultiplier: (temp: number) => temp > 80 ? 1.2 : 1.0,
          energyModifier: (temp: number) => temp > 75 ? 1.1 : 1.0
        },
        wind: {
          turbulence: (speed: number) => speed / 20,
          flowDirection: (direction: number) => direction,
          density: (speed: number) => speed > 15 ? 0.8 : 1.0
        },
        conditions: {
          sunny: { brightness: 1.2, saturation: 1.1 },
          rainy: { brightness: 0.8, speed: 0.7 },
          stormy: { turbulence: 1.2, brightness: 0.6 },
          snowy: { saturation: 0.7, brightness: 1.1 }
        }
      },
      confidence: 0.85,
      imageName: referenceImage?.name || 'Mock Image',
      imageSize: 'Mock Data',
      processingTime: '0ms',
      source: 'Mock Analysis',
      timestamp: new Date().toISOString()
    };

    setAnalysis(mockAnalysis);
    setAIResults(mockAnalysis);
    setCurrentStep('results');
    setTestResults(prev => [...prev, '✅ Mock analysis complete!']);
  };

  const fetchWeather = async () => {
    setTestResults(prev => [...prev, '🌤️ Fetching weather data...']);
    
    try {
      const weatherData = await weatherService.getWeatherData(location);
      setWeather(weatherData);
      setWeatherData(weatherData);
      setTestResults(prev => [...prev, '✅ Weather data received!']);
    } catch (error) {
      console.error('Weather fetch error:', error);
      setTestResults(prev => [...prev, `❌ Weather error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    }
  };

  const runFullTest = async () => {
    setTestResults([]);
    setTestResults(prev => [...prev, '🚀 Starting full test sequence...']);
    
    await analyzeTheme();
    await fetchWeather();
    
    setTestResults(prev => [...prev, '🎉 Full test sequence complete!']);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target.files?.[0];
    if (file) {
      setReferenceImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setReferenceImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = (event: React.MouseEvent) => {
    // Simple direct trigger - let the browser handle it naturally
    event.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const isSetupComplete = theme && referenceImage && (openaiKey || openweatherKey);
  const isAnalysisComplete = analysis && weather;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Title and Description */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🤖</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">AI Test Dashboard</h1>
                  <p className="text-gray-400 text-sm">Step-by-step testing for AI analysis and parameter mapping</p>
                </div>
              </div>
            </div>
            
            {/* Status Dashboard */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-gray-400 text-xs uppercase tracking-wide">Current Step</div>
                  <div className="font-mono text-blue-400 font-semibold capitalize mt-1">{currentStep}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-xs uppercase tracking-wide">Live Mode</div>
                  <div className={`font-mono font-semibold mt-1 ${isLiveMode ? 'text-green-400' : 'text-red-400'}`}>
                    {isLiveMode ? '🟢 ON' : '🔴 OFF'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-xs uppercase tracking-wide">Updates</div>
                  <div className="font-mono text-blue-400 font-semibold mt-1">{parameterUpdates.length}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-xs uppercase tracking-wide">Status</div>
                  <div className="font-mono text-green-400 font-semibold mt-1">✅ Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-center space-x-8">
            {(['setup', 'analysis', 'results', 'advanced'] as TestStep[]).map((step, index) => {
              const isActive = currentStep === step;
              const isCompleted = ['setup', 'analysis', 'results', 'advanced'].indexOf(currentStep) > index;
              const isUpcoming = ['setup', 'analysis', 'results', 'advanced'].indexOf(currentStep) < index;
              
              return (
                <div key={step} className="flex items-center space-x-3">
                  <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                      : isCompleted
                      ? 'bg-gradient-to-br from-green-500 to-green-600 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    {isCompleted ? '✓' : index + 1}
                    {isActive && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium transition-colors ${
                      isActive ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-gray-400'
                    }`}>
                      {step.charAt(0).toUpperCase() + step.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {step === 'setup' && 'Configure APIs & Upload'}
                      {step === 'analysis' && 'AI Analysis & Weather'}
                      {step === 'results' && 'View Results & Test'}
                      {step === 'advanced' && 'Advanced Testing'}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className={`w-8 h-0.5 transition-colors ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Step 1: Setup */}
        {currentStep === 'setup' && (
          <div className="space-y-6">
            {/* Main Setup Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 shadow-xl">
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Setup & Configuration</h2>
                    <p className="text-gray-400">Configure your APIs and upload a reference image to get started</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* API Configuration Section */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-white">API Configuration</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {/* OpenAI API */}
                      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-400">🤖</span>
                            <span className="font-medium text-white">OpenAI API Key</span>
                          </div>
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            openaiKey ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'
                          }`}>
                            {openaiKey ? '✓ Configured' : '⚠️ Required'}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => setShowApiSetup(!showApiSetup)}
                          className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-3 transition-all duration-200 flex items-center justify-between group"
                        >
                          <span className="text-white">Configure API Key</span>
                          <span className="text-blue-200 group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                        
                        {showApiSetup && (
                          <div className="mt-4 space-y-3 p-4 bg-gray-700 rounded-lg border border-gray-600">
                            <input
                              type="password"
                              value={openaiKey}
                              onChange={(e) => setOpenaiKey(e.target.value)}
                              placeholder="sk-..."
                              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                            <button
                              onClick={() => {
                                localStorage.setItem('openai-key', openaiKey);
                                alert('API key saved!');
                              }}
                              className="w-full bg-green-600 hover:bg-green-700 rounded-lg px-4 py-3 transition-all duration-200 text-white font-medium"
                            >
                              Save API Key
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Weather API */}
                      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-green-400">🌤️</span>
                            <span className="font-medium text-white">Weather API Key</span>
                          </div>
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            openweatherKey ? 'bg-green-900 text-green-400' : 'bg-gray-700 text-gray-400'
                          }`}>
                            {openweatherKey ? '✓ Configured' : 'Optional'}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => setShowWeatherApiSetup(!showWeatherApiSetup)}
                          className="w-full bg-green-600 hover:bg-green-700 rounded-lg px-4 py-3 transition-all duration-200 flex items-center justify-between group"
                        >
                          <span className="text-white">Configure Weather API</span>
                          <span className="text-green-200 group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                        
                        {showWeatherApiSetup && (
                          <div className="mt-4 space-y-3 p-4 bg-gray-700 rounded-lg border border-gray-600">
                            <input
                              type="password"
                              value={openweatherKey}
                              onChange={(e) => setOpenweatherKey(e.target.value)}
                              placeholder="OpenWeather API key"
                              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            />
                            <button
                              onClick={() => {
                                localStorage.setItem('openweather-api-key', openweatherKey);
                                alert('Weather API key saved!');
                              }}
                              className="w-full bg-green-600 hover:bg-green-700 rounded-lg px-4 py-3 transition-all duration-200 text-white font-medium"
                            >
                              Save Weather API Key
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-white">Reference Image</h3>
                    </div>
                    
                    <div
                      className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 transition-all duration-300 select-none image-upload-area bg-gray-800 hover:bg-gray-750"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={handleImageClick}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleImageClick(e as any);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label="Upload image"
                      style={{ 
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        MozUserSelect: 'none',
                        msUserSelect: 'none'
                      }}
                    >
                      {imagePreview ? (
                        <div className="space-y-4">
                          <div className="relative">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="max-w-full h-40 object-cover rounded-lg mx-auto border border-gray-600"
                            />
                            <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                              <span className="text-white text-xs">📸</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Image uploaded successfully</p>
                            <p className="text-xs text-gray-500 mt-1">Click or drag to change</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-2xl">📸</span>
                          </div>
                          <div>
                            <p className="text-gray-300 font-medium">Upload Reference Image</p>
                            <p className="text-sm text-gray-400 mt-1">Click or drag image here</p>
                            <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, WebP</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleImageClick}
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-all duration-200 text-white font-medium"
                          >
                            Choose Image
                          </button>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        style={{ display: 'none' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Theme Input */}
                <div className="mt-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-white">Theme Description</h3>
                  </div>
                  <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="e.g., cyberpunk city, nature landscape, abstract art, biomass theme"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all placeholder-gray-500"
                  />
                </div>

                {/* Next Step Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setCurrentStep('analysis')}
                    disabled={!isSetupComplete}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg px-8 py-4 transition-all duration-200 flex items-center space-x-3 text-white font-medium shadow-lg hover:shadow-xl disabled:shadow-none"
                  >
                    <span>Next: Run Analysis</span>
                    <span className="text-xl">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Analysis */}
        {currentStep === 'analysis' && (
          <div className="space-y-6">
            {/* Main Analysis Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 shadow-xl">
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">AI Analysis & Weather Data</h2>
                    <p className="text-gray-400">Run AI analysis on your image and fetch weather data for parameter mapping</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Test Controls Section */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-white">Test Controls</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {/* AI Analysis Button */}
                      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-400">🤖</span>
                            <span className="font-medium text-white">AI Image Analysis</span>
                          </div>
                          <span className="text-sm text-gray-400">Required</span>
                        </div>
                        
                        <button
                          onClick={analyzeTheme}
                          disabled={isLoading || !theme || !referenceImage}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg px-4 py-4 transition-all duration-200 flex items-center justify-center space-x-3 text-white font-medium shadow-lg hover:shadow-xl disabled:shadow-none"
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              <span>Analyzing...</span>
                            </>
                          ) : (
                            <>
                              <span>🤖</span>
                              <span>Run AI Analysis</span>
                            </>
                          )}
                        </button>
                      </div>
                      
                      {/* Weather Fetch Button */}
                      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-green-400">🌤️</span>
                            <span className="font-medium text-white">Weather Data</span>
                          </div>
                          <span className="text-sm text-gray-400">Optional</span>
                        </div>
                        
                        <button
                          onClick={fetchWeather}
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg px-4 py-4 transition-all duration-200 flex items-center justify-center space-x-3 text-white font-medium shadow-lg hover:shadow-xl disabled:shadow-none"
                        >
                          <span>🌤️</span>
                          <span>Fetch Weather Data</span>
                        </button>
                      </div>
                      
                      {/* Full Test Button */}
                      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-purple-400">🚀</span>
                            <span className="font-medium text-white">Complete Test</span>
                          </div>
                          <span className="text-sm text-purple-400">Recommended</span>
                        </div>
                        
                        <button
                          onClick={runFullTest}
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg px-4 py-4 transition-all duration-200 flex items-center justify-center space-x-3 text-white font-medium shadow-lg hover:shadow-xl disabled:shadow-none"
                        >
                          <span>🚀</span>
                          <span>Run Full Test</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Test Results Section */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-white">Test Results</h3>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                      <div className="bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto border border-gray-700">
                        {testResults.length === 0 ? (
                          <div className="text-center py-8">
                            <div className="text-4xl mb-3">📋</div>
                            <p className="text-gray-500">No test results yet</p>
                            <p className="text-sm text-gray-600 mt-1">Run a test to see results here</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {testResults.map((result, index) => (
                              <div key={index} className="text-sm font-mono bg-gray-800 rounded px-3 py-2 border-l-2 border-blue-500">
                                {result}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setCurrentStep('setup')}
                    className="bg-gray-600 hover:bg-gray-700 rounded-lg px-6 py-3 transition-all duration-200 flex items-center space-x-2 text-white font-medium"
                  >
                    <span>←</span>
                    <span>Back to Setup</span>
                  </button>
                  
                  <button
                    onClick={() => setCurrentStep('results')}
                    disabled={!isAnalysisComplete}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg px-8 py-3 transition-all duration-200 flex items-center space-x-3 text-white font-medium shadow-lg hover:shadow-xl disabled:shadow-none"
                  >
                    <span>Next: View Results</span>
                    <span className="text-xl">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {currentStep === 'results' && (
          <div className="space-y-6">
            {/* Main Results Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 shadow-xl">
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Results & Parameter Mapping</h2>
                    <p className="text-gray-400">View your analysis results and test parameter mapping with the visual system</p>
                  </div>
                </div>

                {/* Parameter Mapping Tester Toggle */}
                <div className="mb-8">
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-blue-400 text-xl">🔧</span>
                        <div>
                          <h3 className="font-medium text-white">Parameter Mapping Tester</h3>
                          <p className="text-sm text-gray-400">Test how AI and weather data affect visual parameters</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowParameterTester(!showParameterTester)}
                        className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 transition-all duration-200 flex items-center space-x-2 text-white font-medium"
                      >
                        <span>{showParameterTester ? 'Hide' : 'Show'}</span>
                        <span>{showParameterTester ? '−' : '+'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Parameter Mapping Tester */}
                {showParameterTester && (
                  <div className="mb-8">
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                      <ParameterMappingTester
                        aiResults={analysis}
                        weatherData={weather || undefined}
                        onParameterUpdate={(updates) => {
                          addParameterUpdates(updates);
                          console.log('Parameter updates applied:', updates);
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Results Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* AI Analysis Results */}
                  {analysis && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
                      </div>
                      
                      {/* Color Analysis */}
                      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <h4 className="font-medium text-blue-400 mb-3 flex items-center space-x-2">
                          <span>🎨</span>
                          <span>Color Palette</span>
                        </h4>
                        <div className="space-y-3">
                          {analysis.colorPalette && Object.entries(analysis.colorPalette).map(([key, color]) => (
                            <div key={key} className="flex items-center space-x-3 p-2 bg-gray-700 rounded-lg">
                              <div 
                                className="w-8 h-8 rounded-lg border-2 border-gray-600 shadow-lg"
                                style={{ backgroundColor: color as string }}
                              />
                              <div className="flex-1">
                                <span className="text-sm font-medium text-white capitalize">{key}:</span>
                                <div className="text-xs font-mono text-gray-400">{String(color)}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mood & Characteristics */}
                      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <h4 className="font-medium text-blue-400 mb-3 flex items-center space-x-2">
                          <span>💫</span>
                          <span>Mood & Characteristics</span>
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-gray-400">Mood:</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {analysis.mood?.map((mood: string, index: number) => (
                                <span 
                                  key={index}
                                  className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full font-medium"
                                >
                                  {mood}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-400">Atmosphere:</span>
                            <div className="text-sm text-gray-300 mt-1 bg-gray-700 rounded-lg px-3 py-2 italic">"{analysis.atmosphere}"</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Weather Data */}
                  {weather && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-white">Weather Data</h3>
                      </div>
                      
                      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <h4 className="font-medium text-green-400 mb-3 flex items-center space-x-2">
                          <span>🌤️</span>
                          <span>Current Conditions</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-gray-700 rounded-lg p-3">
                            <div className="text-gray-400 text-xs uppercase tracking-wide">Location</div>
                            <div className="font-semibold text-white mt-1">{weather.location || 'Unknown'}</div>
                          </div>
                          <div className="bg-gray-700 rounded-lg p-3">
                            <div className="text-gray-400 text-xs uppercase tracking-wide">Temperature</div>
                            <div className="font-semibold text-white mt-1">{weather.temperature}°F</div>
                          </div>
                          <div className="bg-gray-700 rounded-lg p-3">
                            <div className="text-gray-400 text-xs uppercase tracking-wide">Condition</div>
                            <div className="font-semibold text-white mt-1 capitalize">{weather.condition}</div>
                          </div>
                          <div className="bg-gray-700 rounded-lg p-3">
                            <div className="text-gray-400 text-xs uppercase tracking-wide">Humidity</div>
                            <div className="font-semibold text-white mt-1">{weather.humidity}%</div>
                          </div>
                          <div className="bg-gray-700 rounded-lg p-3">
                            <div className="text-gray-400 text-xs uppercase tracking-wide">Wind Speed</div>
                            <div className="font-semibold text-white mt-1">{weather.windSpeed} mph</div>
                          </div>
                          <div className="bg-gray-700 rounded-lg p-3">
                            <div className="text-gray-400 text-xs uppercase tracking-wide">Pressure</div>
                            <div className="font-semibold text-white mt-1">{weather.pressure} hPa</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Visual Characteristics */}
                  {analysis?.visualCharacteristics && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-white">Visual Characteristics</h3>
                      </div>
                      
                      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <h4 className="font-medium text-purple-400 mb-3 flex items-center space-x-2">
                          <span>📊</span>
                          <span>Analysis Metrics</span>
                        </h4>
                        <div className="space-y-4">
                          {Object.entries(analysis.visualCharacteristics).map(([key, value]) => (
                            <div key={key} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="capitalize text-sm font-medium text-white">{key}:</span>
                                <span className="text-sm font-mono text-gray-400 w-12 text-right">
                                  {typeof value === 'number' ? value.toFixed(2) : String(value)}
                                </span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${(value as number) * 50}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setCurrentStep('analysis')}
                    className="bg-gray-600 hover:bg-gray-700 rounded-lg px-6 py-3 transition-all duration-200 flex items-center space-x-2 text-white font-medium"
                  >
                    <span>←</span>
                    <span>Back to Analysis</span>
                  </button>
                  
                  <button
                    onClick={() => setCurrentStep('advanced')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg px-8 py-3 transition-all duration-200 flex items-center space-x-3 text-white font-medium shadow-lg hover:shadow-xl"
                  >
                    <span>Advanced Testing</span>
                    <span className="text-xl">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Advanced */}
        {currentStep === 'advanced' && (
          <div className="space-y-6">
            {/* Main Advanced Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 shadow-xl">
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Advanced Testing & Debugging</h2>
                    <p className="text-gray-400">Advanced testing tools and system diagnostics</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Advanced Controls */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-white">Advanced Controls</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Export Results */}
                      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-400">📁</span>
                            <span className="font-medium text-white">Export Results</span>
                          </div>
                          <span className="text-sm text-gray-400">JSON Format</span>
                        </div>
                        
                        <button
                          onClick={() => {
                            const results = { analysis, weather, computed, testResults, timestamp: new Date().toISOString() };
                            const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `ai-test-results-${Date.now()}.json`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          }}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg px-4 py-4 transition-all duration-200 flex items-center justify-center space-x-3 text-white font-medium shadow-lg hover:shadow-xl"
                        >
                          <span>📁</span>
                          <span>Export Results</span>
                        </button>
                      </div>
                      
                      {/* Reset All */}
                      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-red-400">🔄</span>
                            <span className="font-medium text-white">Reset System</span>
                          </div>
                          <span className="text-sm text-red-400">Danger Zone</span>
                        </div>
                        
                        <button
                          onClick={() => {
                            setAnalysis(null);
                            setWeather(null);
                            setComputed(null);
                            setTestResults([]);
                            setCurrentStep('setup');
                          }}
                          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg px-4 py-4 transition-all duration-200 flex items-center justify-center space-x-3 text-white font-medium shadow-lg hover:shadow-xl"
                        >
                          <span>🔄</span>
                          <span>Reset All</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* System Status */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-white">System Status</h3>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                      <h4 className="font-medium text-green-400 mb-4 flex items-center space-x-2">
                        <span>⚡</span>
                        <span>Service Status</span>
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-400">🤖</span>
                            <span className="text-white">AI Service</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-400 font-medium">Active</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <span className="text-green-400">🌤️</span>
                            <span className="text-white">Weather Service</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-400 font-medium">Active</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <span className="text-purple-400">🔧</span>
                            <span className="text-white">Mapping Engine</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-400 font-medium">Active</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <span className="text-yellow-400">🧪</span>
                            <span className="text-white">Parameter Tester</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${showParameterTester ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                            <span className={`font-medium ${showParameterTester ? 'text-green-400' : 'text-gray-400'}`}>
                              {showParameterTester ? 'Visible' : 'Hidden'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <span className="text-pink-400">🔄</span>
                            <span className="text-white">Live Mode</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${isLiveMode ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                            <span className={`font-medium ${isLiveMode ? 'text-green-400' : 'text-red-400'}`}>
                              {isLiveMode ? 'ON' : 'OFF'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setCurrentStep('results')}
                    className="bg-gray-600 hover:bg-gray-700 rounded-lg px-6 py-3 transition-all duration-200 flex items-center space-x-2 text-white font-medium"
                  >
                    <span>←</span>
                    <span>Back to Results</span>
                  </button>
                  
                  <button
                    onClick={() => setCurrentStep('setup')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg px-8 py-3 transition-all duration-200 flex items-center space-x-3 text-white font-medium shadow-lg hover:shadow-xl"
                  >
                    <span>Start Over</span>
                    <span className="text-xl">🔄</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 