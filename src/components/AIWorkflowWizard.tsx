import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useVisualStore } from '../store/visualStore';
import { AIStoreAdapter } from '../ai-system/adapters/StoreAdapter';
import { AIService } from '../ai-system/services/AIService';
import { WeatherService } from '../ai-system/services/WeatherService';
import type { ThemeAnalysis, EnhancedColorPalette, WeatherData } from '../types/unified';
import styles from './AIIntegrationDashboard.module.css';

interface UploadedImage {
  file: File;
  preview: string;
  name: string;
}

interface ThemeData {
  title: string;
  description: string;
  mood: string[];
  style: string;
}

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export const AIWorkflowWizard: React.FC = () => {
  const { 
    ai, 
    updateAIAnalysis,
    updateAIColorHarmony,
    updateAIWeatherIntegration,
    updateAIStatus,
    loadPresetData,
    savePreset
  } = useVisualStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [themeData, setThemeData] = useState<ThemeData>({
    title: '',
    description: '',
    mood: [],
    style: ''
  });
  const [weatherLocation, setWeatherLocation] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<ThemeAnalysis | null>(null);
  const [colorHarmony, setColorHarmony] = useState<EnhancedColorPalette | null>(null);
  const [presetName, setPresetName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [weatherApiKey, setWeatherApiKey] = useState('');
  const [testingApiKey, setTestingApiKey] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testingWeatherKey, setTestingWeatherKey] = useState(false);
  const [weatherKeyStatus, setWeatherKeyStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [presetCreated, setPresetCreated] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const aiService = AIService.getInstance();
  const weatherService = WeatherService.getInstance();

  // Initialize API keys from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedOpenAI = localStorage.getItem('openai-api-key') || '';
      const storedWeather = localStorage.getItem('openweather-api-key') || '';
      setOpenaiApiKey(storedOpenAI);
      setWeatherApiKey(storedWeather);
    }
  }, []);

  // API Setup
  const setupApiKeys = () => {
    if (openaiApiKey.trim()) {
      aiService.setApiKey(openaiApiKey.trim());
      localStorage.setItem('openai-api-key', openaiApiKey.trim());
      console.log('🔑 OpenAI API key configured');
    }
    if (weatherApiKey.trim()) {
      weatherService.setApiKey(weatherApiKey.trim());
      localStorage.setItem('openweather-api-key', weatherApiKey.trim());
      console.log('🌤️ Weather API key configured');
    }
    setShowApiSetup(false);
    setError(null);
  };

  const checkApiKeys = () => {
    const hasOpenAI = aiService.getApiKey();
    const hasWeather = weatherService.getApiKey();
    
    if (!hasOpenAI || !hasWeather) {
      setShowApiSetup(true);
      return false;
    }
    return true;
  };

  const testOpenAIKey = async () => {
    if (!openaiApiKey.trim()) {
      setError('Please enter an OpenAI API key first');
      return;
    }

    setTestingApiKey(true);
    setApiKeyStatus('testing');
    setError(null);

    try {
      // Temporarily set the API key for testing
      aiService.setApiKey(openaiApiKey.trim());
      
      // Test the API key
      const isValid = await aiService.testApiKey();
      
      if (isValid) {
        setApiKeyStatus('success');
        console.log('✅ OpenAI API key is valid and working');
      } else {
        setApiKeyStatus('error');
        setError('OpenAI API key test failed. Please check your key and try again.');
      }
    } catch (err) {
      setApiKeyStatus('error');
      setError(`API key test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setTestingApiKey(false);
    }
  };

  const testWeatherKey = async () => {
    if (!weatherApiKey.trim()) {
      setError('Please enter a Weather API key first');
      return;
    }

    setTestingWeatherKey(true);
    setWeatherKeyStatus('testing');
    setError(null);

    try {
      // Temporarily set the API key for testing
      weatherService.setApiKey(weatherApiKey.trim());
      
      // Test the API key
      const isValid = await weatherService.testApiKey();
      
      if (isValid) {
        setWeatherKeyStatus('success');
        console.log('✅ Weather API key is valid and working');
      } else {
        setWeatherKeyStatus('error');
        setError('Weather API key test failed. Please check your key and try again.');
      }
    } catch (err) {
      setWeatherKeyStatus('error');
      setError(`Weather API key test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setTestingWeatherKey(false);
    }
  };

  const steps: WorkflowStep[] = [
    { id: 1, title: 'Upload Image', description: 'Select an image for AI analysis', completed: !!uploadedImage, current: currentStep === 1 },
    { id: 2, title: 'Weather Location', description: 'Set location for weather data', completed: !!weatherLocation, current: currentStep === 2 },
    { id: 3, title: 'Fetch Weather', description: 'Get current weather data', completed: !!weatherData, current: currentStep === 3 },
    { id: 4, title: 'AI Analysis', description: 'Analyze image and generate theme', completed: !!aiAnalysis, current: currentStep === 4 },
    { id: 5, title: 'Review Analysis', description: 'Review AI insights and color harmony', completed: !!colorHarmony, current: currentStep === 5 },
    { id: 6, title: 'Review Preset', description: 'Review settings before applying', completed: false, current: currentStep === 6 },
    { id: 7, title: 'Create & Apply', description: 'Generate preset and apply to canvas', completed: false, current: currentStep === 7 }
  ];

  // Step 1: Image Upload
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage({
          file,
          preview: e.target?.result as string,
          name: file.name
        });
        setError(null);
        setPresetCreated(false);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  // Step 2: Theme Details
  const handleThemeChange = (field: keyof ThemeData, value: string | string[]) => {
    setThemeData(prev => ({ ...prev, [field]: value }));
  };

  // Step 3: Weather Location
  const handleLocationSubmit = async () => {
    if (!weatherLocation.trim()) {
      setError('Please enter a location');
      return;
    }
    setError(null);
    // This would integrate with your weather service
    setCurrentStep(3);
  };

  // Step 4: Fetch Weather
  const fetchWeatherData = async () => {
    if (!weatherLocation.trim()) {
      setError('Please enter a location');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log('🌤️ Fetching weather data for:', weatherLocation);
      console.log('🌤️ Weather API key status:', weatherService.getApiKey() ? 'Configured' : 'Not configured');
      
      const data = await weatherService.getWeatherData(weatherLocation);
      console.log('🌤️ Weather data received:', data);
      console.log('🌤️ Data source:', data.dataSource);
      console.log('🌤️ Verification:', data.verification);
      
      setWeatherData(data);
      setError(null);
      console.log('🌤️ Weather data set successfully');
    } catch (err) {
      console.error('❌ Weather fetch error:', err);
      setError('Failed to fetch weather data');
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 4: AI Analysis
  const performAIAnalysis = async () => {
    if (!uploadedImage) {
      setError('Please upload an image first');
      return;
    }

    if (!aiService.getApiKey()) {
      setError('Please configure your OpenAI API key');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log('🤖 Starting AI analysis...');
      console.log('🤖 Image file:', uploadedImage.file.name, 'Size:', uploadedImage.file.size);
      console.log('🤖 Weather data available:', !!weatherData);
      if (weatherData) {
        console.log('🤖 Weather context:', {
          condition: weatherData.condition,
          temperature: weatherData.temperature,
          windSpeed: weatherData.windSpeed,
          timeOfDay: weatherData.timeOfDay
        });
      }

      const analysis = await aiService.analyzeImage(uploadedImage.preview, weatherData || undefined);
      console.log('🤖 AI analysis complete:', analysis);
      console.log('🤖 Analysis structure check:');
      console.log('  - Theme:', analysis.theme);
      console.log('  - Visual characteristics:', analysis.visualCharacteristics);
      console.log('  - Color palette:', analysis.colorPalette);
      console.log('  - Weather mappings:', analysis.weatherMappings);
      console.log('  - Confidence:', analysis.confidence);
      
      setAiAnalysis(analysis);
      setError(null);
      console.log('🤖 AI analysis set successfully');
    } catch (err) {
      console.error('❌ AI analysis error:', err);
      setError('Failed to analyze image');
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 5: Generate Color Harmony
  const generateColorHarmony = async () => {
    if (!aiAnalysis) {
      setError('Please perform AI analysis first');
      return;
    }

    if (!checkApiKeys()) {
      return;
    }

    setIsProcessing(true);
    setError(null);
    updateAIStatus({ ...ai?.status, enhancedAI: 'generating' });

    try {
      // Generate real color harmony using AI
      const realColorHarmony = await aiService.generateColorHarmony(
        aiAnalysis.colorPalette, 
        weatherData || undefined
      );
      
      setColorHarmony(realColorHarmony);
      
      // Update AI color harmony in store
      updateAIColorHarmony({
        palette: realColorHarmony,
        harmonyConfig: {
          type: realColorHarmony.harmonyType || 'complementary',
          baseColors: [realColorHarmony.primary, realColorHarmony.secondary],
          variations: realColorHarmony.supporting
        },
        lastGenerated: new Date(),
        performanceMetrics: {
          generationTime: Date.now(),
          apiTokens: 'Unknown', // Not available in EnhancedColorPalette
          confidence: realColorHarmony.harmonyScore || 0.85
        }
      });
      
      console.log('🎨 Real color harmony generated:', realColorHarmony);
    } catch (err) {
      console.error('Color harmony generation error:', err);
      setError(`Color harmony generation failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      
      // Fallback to mock color harmony
      console.log('🔄 Falling back to mock color harmony...');
      const mockColorHarmony: EnhancedColorPalette = {
        primary: aiAnalysis.colorPalette.primary,
        secondary: aiAnalysis.colorPalette.secondary,
        accent: aiAnalysis.colorPalette.accent,
        supporting: aiAnalysis.colorPalette.supporting,
        harmonyType: 'complementary',
        harmonyScore: 0.85,
        contrastRatio: 4.5,
        saturation: 0.8,
        brightness: 0.7,
        temperature: 'warm',
        mood: ['energetic', 'harmonious', 'dynamic'],
        accessibility: {
          wcagAA: true,
          wcagAAA: false,
          colorBlindFriendly: true
        }
      };
      
      setColorHarmony(mockColorHarmony);
    } finally {
      setIsProcessing(false);
      updateAIStatus({ ...ai?.status, enhancedAI: 'idle' });
    }
  };

  // Step 7: Create & Apply Preset
  const createPreset = async () => {
    if (!aiAnalysis || !colorHarmony || !presetName.trim()) {
      setError('Please complete previous steps and enter a preset name');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setPresetCreated(false);

    try {
      console.log('🎨 Starting preset creation...');
      console.log('🎨 AI Analysis:', aiAnalysis);
      console.log('🎨 Color Harmony:', colorHarmony);
      
      // Combine all data to create a comprehensive preset
      const currentStore = useVisualStore.getState();
      console.log('🎨 Current store state:', currentStore);
      
      const storeUpdates = AIStoreAdapter.mapToStore(aiAnalysis);
      console.log('🎨 Store updates from AI:', storeUpdates);
      
      const colorUpdates = AIStoreAdapter.applyColorPalette(colorHarmony, currentStore);
      console.log('🎨 Color updates:', colorUpdates);
      
      const weatherUpdates = weatherData ? AIStoreAdapter.applyWeatherData(weatherData, currentStore) : {};
      console.log('🎨 Weather updates:', weatherUpdates);

      // Merge all updates
      const finalPreset = {
        ...currentStore,
        ...storeUpdates,
        ...colorUpdates,
        ...weatherUpdates
      };
      
      console.log('🎨 Final preset to apply:', finalPreset);

      // Save the preset
      savePreset(presetName);
      
      // Apply to canvas using store's update methods to ensure reactivity
      loadPresetData(finalPreset);

      // Force a store update to trigger re-renders
      useVisualStore.setState(finalPreset);

      // Show success message
      setError(null);
      setPresetCreated(true);
      
      console.log('🎨 Preset created and applied successfully');
    } catch (err) {
      console.error('❌ Error creating preset:', err);
      setError('Failed to create preset');
      setPresetCreated(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 8: Apply to Canvas
  const applyToCanvas = () => {
    // The preset is already applied in step 7
    // This step is for confirmation and any final adjustments
    setCurrentStep(7);
  };

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <h3>Upload Image for Analysis</h3>
            <p>Select an image that represents your desired visual theme. The AI will analyze colors, composition, and mood.</p>
            
            <div className={styles.uploadArea}>
              {uploadedImage ? (
                <div className={styles.imagePreview}>
                  <img src={uploadedImage.preview} alt="Uploaded" />
                  <p>{uploadedImage.name}</p>
                  <button onClick={triggerImageUpload} className={styles.secondaryButton}>
                    Change Image
                  </button>
                </div>
              ) : (
                <div className={styles.uploadPrompt} onClick={triggerImageUpload}>
                  <div className={styles.uploadIcon}>📷</div>
                  <p>Click to upload image</p>
                  <p className={styles.uploadHint}>Supports JPG, PNG, GIF (max 10MB)</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className={styles.stepContent}>
            <h3>Weather Location</h3>
            <p>Set your location to integrate real-time weather data into your visual theme.</p>
            
            <div className={styles.formGroup}>
              <label>Location</label>
              <input
                type="text"
                value={weatherLocation}
                onChange={(e) => setWeatherLocation(e.target.value)}
                placeholder="e.g., San Francisco, CA or 94102"
                className={styles.textInput}
              />
            </div>

            <button onClick={handleLocationSubmit} className={styles.primaryButton}>
              Set Location
            </button>
          </div>
        );

      case 3:
        return (
          <div className={styles.stepContent}>
            <h3>Fetch Weather Data</h3>
            <p>Retrieving current weather conditions for {weatherLocation}...</p>
            
            {weatherData ? (
              <div className={styles.weatherDisplay}>
                <h4>Current Weather</h4>
                <div className={styles.weatherInfo}>
                  <p>🌡️ {weatherData.temperature}°F</p>
                  <p>🌤️ {weatherData.condition}</p>
                  <p>💨 {weatherData.windSpeed} mph</p>
                  <p>💧 {weatherData.humidity}% humidity</p>
                </div>
              </div>
            ) : (
              <button 
                onClick={fetchWeatherData} 
                className={styles.primaryButton}
                disabled={isProcessing}
              >
                {isProcessing ? 'Fetching...' : 'Fetch Weather Data'}
              </button>
            )}
          </div>
        );

      case 4:
        return (
          <div className={styles.stepContent}>
            <h3>AI Analysis</h3>
            <p>Analyzing your image and theme to generate visual characteristics...</p>
            
            {aiAnalysis ? (
              <div className={styles.analysisDisplay}>
                <h4>Analysis Results</h4>
                <div className={styles.analysisInfo}>
                  <p><strong>Theme:</strong> {aiAnalysis.theme || 'Unknown'}</p>
                  <p><strong>Mood:</strong> {aiAnalysis.mood?.join(', ') || 'Unknown'}</p>
                  <p><strong>Confidence:</strong> {((aiAnalysis.confidence || 0) * 100).toFixed(1)}%</p>
                  <div className={styles.characteristics}>
                    <h5>Visual Characteristics:</h5>
                    <div className={styles.characteristicGrid}>
                      <span>Saturation: {((aiAnalysis.visualCharacteristics?.saturation || 0) * 100).toFixed(0)}%</span>
                      <span>Energy: {((aiAnalysis.visualCharacteristics?.energy || 0) * 100).toFixed(0)}%</span>
                      <span>Harmony: {((aiAnalysis.visualCharacteristics?.harmony || 0) * 100).toFixed(0)}%</span>
                      <span>Speed: {((aiAnalysis.visualCharacteristics?.speed || 0) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={performAIAnalysis} 
                className={styles.primaryButton}
                disabled={isProcessing}
              >
                {isProcessing ? 'Analyzing...' : 'Start AI Analysis'}
              </button>
            )}
          </div>
        );

      case 5:
        return (
          <div className={styles.stepContent}>
            <h3>Color Harmony & Review</h3>
            <p>Review the AI-generated color palette and visual characteristics.</p>
            
            {colorHarmony ? (
              <div className={styles.harmonyDisplay}>
                <h4>Color Harmony</h4>
                <div className={styles.colorPalette}>
                  <div className={styles.colorSwatch} style={{ backgroundColor: colorHarmony.primary || '#000000' }}>
                    <span>Primary</span>
                  </div>
                  <div className={styles.colorSwatch} style={{ backgroundColor: colorHarmony.secondary || '#000000' }}>
                    <span>Secondary</span>
                  </div>
                  <div className={styles.colorSwatch} style={{ backgroundColor: colorHarmony.accent || '#000000' }}>
                    <span>Accent</span>
                  </div>
                </div>
                <div className={styles.harmonyInfo}>
                  <p><strong>Harmony Type:</strong> {colorHarmony.harmonyType || 'Unknown'}</p>
                  <p><strong>Harmony Score:</strong> {((colorHarmony.harmonyScore || 0) * 100).toFixed(1)}%</p>
                  <p><strong>Temperature:</strong> {colorHarmony.temperature || 'Unknown'}</p>
                  <p><strong>Mood:</strong> {colorHarmony.mood?.join(', ') || 'Unknown'}</p>
                </div>
              </div>
            ) : (
              <button 
                onClick={generateColorHarmony} 
                className={styles.primaryButton}
                disabled={isProcessing}
              >
                {isProcessing ? 'Generating...' : 'Generate Color Harmony'}
              </button>
            )}
          </div>
        );

      case 6:
        return (
          <div className={styles.stepContent}>
            <h3>Review Preset Parameters</h3>
            <p>Review the parameters that will be applied to your canvas.</p>
            
            {aiAnalysis && colorHarmony && (
              <div className={styles.reviewDisplay}>
                <h4>🎨 Color Palette Changes</h4>
                <div className={styles.parameterChanges}>
                  <div className={styles.parameterGroup}>
                    <h5>Primary Colors</h5>
                    <div className={styles.colorPreview}>
                      <div className={styles.colorSwatch} style={{ backgroundColor: colorHarmony.primary || '#000000' }}>
                        <span>Primary: {colorHarmony.primary || '#000000'}</span>
                      </div>
                      <div className={styles.colorSwatch} style={{ backgroundColor: colorHarmony.secondary || '#000000' }}>
                        <span>Secondary: {colorHarmony.secondary || '#000000'}</span>
                      </div>
                      <div className={styles.colorSwatch} style={{ backgroundColor: colorHarmony.accent || '#000000' }}>
                        <span>Accent: {colorHarmony.accent || '#000000'}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.parameterGroup}>
                    <h5>Visual Characteristics</h5>
                    <div className={styles.parameterGrid}>
                      <div className={styles.parameter}>
                        <span>Saturation:</span>
                        <span className={styles.value}>{((aiAnalysis.visualCharacteristics?.saturation || 0) * 100).toFixed(0)}%</span>
                      </div>
                      <div className={styles.parameter}>
                        <span>Energy:</span>
                        <span className={styles.value}>{((aiAnalysis.visualCharacteristics?.energy || 0) * 100).toFixed(0)}%</span>
                      </div>
                      <div className={styles.parameter}>
                        <span>Harmony:</span>
                        <span className={styles.value}>{((aiAnalysis.visualCharacteristics?.harmony || 0) * 100).toFixed(0)}%</span>
                      </div>
                      <div className={styles.parameter}>
                        <span>Speed:</span>
                        <span className={styles.value}>{((aiAnalysis.visualCharacteristics?.speed || 0) * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.parameterGroup}>
                    <h5>Color Harmony</h5>
                    <div className={styles.parameterGrid}>
                      <div className={styles.parameter}>
                        <span>Harmony Type:</span>
                        <span className={styles.value}>{colorHarmony.harmonyType || 'Unknown'}</span>
                      </div>
                      <div className={styles.parameter}>
                        <span>Harmony Score:</span>
                        <span className={styles.value}>{((colorHarmony.harmonyScore || 0) * 100).toFixed(1)}%</span>
                      </div>
                      <div className={styles.parameter}>
                        <span>Temperature:</span>
                        <span className={styles.value}>{colorHarmony.temperature || 'Unknown'}</span>
                      </div>
                      <div className={styles.parameter}>
                        <span>Mood:</span>
                        <span className={styles.value}>{colorHarmony.mood?.join(', ') || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>

                  {weatherData && (
                    <div className={styles.parameterGroup}>
                      <h5>🌤️ Weather Integration</h5>
                      <div className={styles.parameterGrid}>
                        <div className={styles.parameter}>
                          <span>Temperature:</span>
                          <span className={styles.value}>{weatherData.temperature}°F</span>
                        </div>
                        <div className={styles.parameter}>
                          <span>Condition:</span>
                          <span className={styles.value}>{weatherData.condition}</span>
                        </div>
                        <div className={styles.parameter}>
                          <span>Wind Speed:</span>
                          <span className={styles.value}>{weatherData.windSpeed} mph</span>
                        </div>
                        <div className={styles.parameter}>
                          <span>Humidity:</span>
                          <span className={styles.value}>{weatherData.humidity}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={styles.parameterGroup}>
                    <h5>🎯 AI Analysis</h5>
                    <div className={styles.parameterGrid}>
                      <div className={styles.parameter}>
                        <span>Theme:</span>
                        <span className={styles.value}>{aiAnalysis.theme || 'Unknown'}</span>
                      </div>
                      <div className={styles.parameter}>
                        <span>Mood:</span>
                        <span className={styles.value}>{aiAnalysis.mood?.join(', ') || 'Unknown'}</span>
                      </div>
                      <div className={styles.parameter}>
                        <span>Confidence:</span>
                        <span className={styles.value}>{((aiAnalysis.confidence || 0) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.presetPreview}>
                  <h5>📋 Preset Summary</h5>
                  <p>This preset will apply the following changes to your canvas:</p>
                  <ul>
                    <li>🎨 Update color palette with AI-generated harmony</li>
                    <li>⚡ Adjust animation speed based on energy levels</li>
                    <li>🌊 Modify particle density and flow patterns</li>
                    <li>🌈 Apply saturation and contrast adjustments</li>
                    {weatherData && (
                      <li>🌤️ Integrate weather-responsive visual effects</li>
                    )}
                  </ul>
                </div>

                {/* Actual Store Changes */}
                {(() => {
                  const changes = getStoreChanges();
                  if (!changes) return null;
                  
                  const { storeUpdates, colorUpdates, weatherUpdates } = changes;
                  
                  return (
                    <div className={styles.parameterGroup}>
                      <h5>🔧 Actual Parameter Changes</h5>
                      <div className={styles.parameterGrid}>
                        {storeUpdates.geometric?.spheres && (
                          <div className={styles.parameter}>
                            <span>Spheres Count:</span>
                            <span className={styles.value}>{storeUpdates.geometric.spheres.count}</span>
                          </div>
                        )}
                        {storeUpdates.geometric?.spheres && (
                          <div className={styles.parameter}>
                            <span>Spheres Speed:</span>
                            <span className={styles.value}>{storeUpdates.geometric.spheres.speed.toFixed(1)}x</span>
                          </div>
                        )}
                        {storeUpdates.particles && (
                          <div className={styles.parameter}>
                            <span>Particle Count:</span>
                            <span className={styles.value}>{storeUpdates.particles.count}</span>
                          </div>
                        )}
                        {storeUpdates.particles && (
                          <div className={styles.parameter}>
                            <span>Particle Speed:</span>
                            <span className={styles.value}>{storeUpdates.particles.speed.toFixed(1)}x</span>
                          </div>
                        )}
                        {storeUpdates.globalEffects?.atmosphericBlur && (
                          <div className={styles.parameter}>
                            <span>Atmospheric Blur:</span>
                            <span className={styles.value}>{storeUpdates.globalEffects.atmosphericBlur.enabled ? 'ON' : 'OFF'}</span>
                          </div>
                        )}
                        {storeUpdates.globalEffects?.shapeGlow && (
                          <div className={styles.parameter}>
                            <span>Shape Glow:</span>
                            <span className={styles.value}>{storeUpdates.globalEffects.shapeGlow.enabled ? 'ON' : 'OFF'}</span>
                          </div>
                        )}
                        {storeUpdates.globalEffects?.trails && (
                          <div className={styles.parameter}>
                            <span>Motion Trails:</span>
                            <span className={styles.value}>{storeUpdates.globalEffects.trails.enabled ? 'ON' : 'OFF'}</span>
                          </div>
                        )}
                        {colorUpdates.geometric?.spheres && (
                          <div className={styles.parameter}>
                            <span>Sphere Color:</span>
                            <span className={styles.value} style={{ color: colorUpdates.geometric.spheres.color }}>
                              {colorUpdates.geometric.spheres.color}
                            </span>
                          </div>
                        )}
                        {weatherUpdates.globalEffects?.atmosphericBlur && (
                          <div className={styles.parameter}>
                            <span>Weather Blur:</span>
                            <span className={styles.value}>{weatherUpdates.globalEffects.atmosphericBlur.intensity.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        );

      case 7:
        return (
          <div className={styles.stepContent}>
            <h3>Create & Apply Preset</h3>
            <p>Generate a new visual preset and apply it to your canvas.</p>
            
            <div className={styles.formGroup}>
              <label>Preset Name</label>
              <input
                type="text"
                value={presetName || ''}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="e.g., Dynamic Harmony - SF Weather"
                className={styles.textInput}
              />
            </div>

            <button 
              onClick={createPreset} 
              className={styles.primaryButton}
              disabled={isProcessing || !presetName.trim()}
            >
              {isProcessing ? 'Creating...' : 'Create & Apply Preset'}
            </button>

            {presetCreated && !isProcessing && (
              <div className={styles.successMessage}>
                <h4>✅ Success!</h4>
                <p>Preset "{presetName}" has been created and applied to your canvas.</p>
                <p>The visual theme now incorporates:</p>
                <ul>
                  <li>Image analysis and color extraction</li>
                  <li>AI-generated theme and mood</li>
                  <li>Weather-responsive parameters</li>
                  <li>AI-generated color harmony</li>
                </ul>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const clearApiKeys = () => {
    setOpenaiApiKey('');
    setWeatherApiKey('');
    localStorage.removeItem('openai-api-key');
    localStorage.removeItem('openweather-api-key');
    setError('✅ API keys cleared');
  };

  // Calculate actual store changes that will be applied
  const getStoreChanges = () => {
    if (!aiAnalysis || !colorHarmony) return null;

    const currentStore = useVisualStore.getState();
    const storeUpdates = AIStoreAdapter.mapToStore(aiAnalysis);
    const colorUpdates = AIStoreAdapter.applyColorPalette(colorHarmony, currentStore);
    const weatherUpdates = weatherData ? AIStoreAdapter.applyWeatherData(weatherData, currentStore) : {};

    return {
      storeUpdates,
      colorUpdates,
      weatherUpdates,
      totalChanges: { ...storeUpdates, ...colorUpdates, ...weatherUpdates }
    };
  };

  return (
    <div className={styles.workflowWizard}>
      {/* API Setup Modal */}
      {showApiSetup && (
        <div className={styles.apiSetupModal}>
          <div className={styles.apiSetupContent}>
            <h3>🔑 API Setup Required</h3>
            <p>To use real AI and weather data, please configure your API keys:</p>
            
            <div className={styles.troubleshooting}>
              <h4>Common Issues:</h4>
              <ul>
                <li>🔑 OpenAI key starts with "sk-", OpenWeather key is different format</li>
                <li>⚠️ Don't use OpenAI key for weather service - they're different APIs</li>
                <li>👁️ OpenAI account needs access to GPT-4o models</li>
                <li>💰 Ensure you have sufficient API credits</li>
                <li>🌐 Check your internet connection</li>
              </ul>
            </div>
            
            <div className={styles.formGroup}>
              <label>OpenAI API Key</label>
              <div className={styles.apiKeyInput}>
                <input
                  type="password"
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  placeholder="sk-..."
                  className={styles.textInput}
                />
                <button 
                  onClick={testOpenAIKey}
                  disabled={testingApiKey || !openaiApiKey.trim()}
                  className={`${styles.testButton} ${apiKeyStatus === 'success' ? styles.success : ''} ${apiKeyStatus === 'error' ? styles.error : ''}`}
                >
                  {testingApiKey ? 'Testing...' : apiKeyStatus === 'success' ? '✅ Valid' : apiKeyStatus === 'error' ? '❌ Invalid' : 'Test'}
                </button>
              </div>
              <small>
                Get your key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI Platform</a>
              </small>
            </div>
            
            <div className={styles.formGroup}>
              <label>OpenWeather API Key</label>
              <div className={styles.apiKeyInput}>
                <input
                  type="password"
                  value={weatherApiKey}
                  onChange={(e) => setWeatherApiKey(e.target.value)}
                  placeholder="your-api-key"
                  className={styles.textInput}
                />
                <button 
                  onClick={testWeatherKey}
                  disabled={testingWeatherKey || !weatherApiKey.trim()}
                  className={`${styles.testButton} ${weatherKeyStatus === 'success' ? styles.success : ''} ${weatherKeyStatus === 'error' ? styles.error : ''}`}
                >
                  {testingWeatherKey ? 'Testing...' : weatherKeyStatus === 'success' ? '✅ Valid' : weatherKeyStatus === 'error' ? '❌ Invalid' : 'Test'}
                </button>
              </div>
              <small>
                Get your key from <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer">OpenWeather</a>
              </small>
            </div>
            
            <div className={styles.buttonGroup}>
              <button onClick={setupApiKeys} className={styles.primaryButton}>
                Save API Keys
              </button>
              <button onClick={() => setShowApiSetup(false)} className={styles.secondaryButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.workflowHeader}>
        <h2>AI Workflow Wizard</h2>
        <p>Create a custom visual preset using AI analysis</p>
      </div>

      {/* Progress Steps */}
      <div className={styles.progressSteps}>
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={`${styles.step} ${step.current ? styles.current : ''} ${step.completed ? styles.completed : ''}`}
          >
            <div className={styles.stepNumber}>{step.id}</div>
            <div className={styles.stepInfo}>
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className={styles.stepContainer}>
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        <button 
          onClick={prevStep} 
          disabled={currentStep === 1}
          className={styles.navButton}
        >
          ← Previous
        </button>
        
        <div className={styles.stepIndicator}>
          Step {currentStep} of {steps.length}
        </div>
        
        <button 
          onClick={nextStep} 
          disabled={currentStep === steps.length}
          className={styles.navButton}
        >
          Next →
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <button onClick={() => setError(null)} className={styles.dismissButton}>
            Dismiss
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default AIWorkflowWizard;