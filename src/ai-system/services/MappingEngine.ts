import { AIAnalysisService } from './AIAnalysisService';
import { WeatherService } from './WeatherService';
import { ThemeConfig, ThemeAnalysis, WeatherData, GeneratedParameters } from '../types/AITypes';

export class MappingEngine {
  private static instance: MappingEngine;
  private aiService: AIAnalysisService;
  private weatherService: WeatherService;

  private constructor() {
    this.aiService = AIAnalysisService.getInstance();
    this.weatherService = WeatherService.getInstance();
  }

  public static getInstance(): MappingEngine {
    if (!MappingEngine.instance) {
      MappingEngine.instance = new MappingEngine();
    }
    return MappingEngine.instance;
  }

  public async processTheme(
    themeName: string,
    location: string,
    evolutionPeriod: '1hour' | '1day' | '1week' = '1day'
  ): Promise<GeneratedParameters> {
    // Create theme config
    const themeConfig: ThemeConfig = {
      id: `theme_${Date.now()}`,
      name: themeName,
      description: `AI-generated theme: ${themeName}`,
      location,
      evolutionPeriod,
      createdAt: new Date()
    };

    // Parallel processing
    const [themeAnalysis, weatherData] = await Promise.all([
      this.aiService.analyzeTheme(themeConfig),
      this.weatherService.getWeatherData(location)
    ]);

    // Generate final parameters
    const parameters = await this.aiService.generateParameters(themeAnalysis, weatherData);

    return {
      timestamp: new Date(),
      theme: themeName,
      weather: weatherData,
      computed: parameters.computed,
      reasoning: parameters.reasoning
    };
  }

  public async getRealTimeParameters(
    themeName: string,
    location: string
  ): Promise<GeneratedParameters> {
    // Get current weather data
    const weatherData = await this.weatherService.getWeatherData(location);
    
    // Create a minimal theme config for real-time processing
    const themeConfig: ThemeConfig = {
      id: `realtime_${Date.now()}`,
      name: themeName,
      description: `Real-time theme: ${themeName}`,
      location,
      evolutionPeriod: '1hour',
      createdAt: new Date()
    };

    // Get theme analysis
    const themeAnalysis = await this.aiService.analyzeTheme(themeConfig);
    
    // Generate parameters
    const parameters = await this.aiService.generateParameters(themeAnalysis, weatherData);

    return {
      timestamp: new Date(),
      theme: themeName,
      weather: weatherData,
      computed: parameters.computed,
      reasoning: parameters.reasoning
    };
  }

  public async validateParameters(parameters: GeneratedParameters): Promise<{
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  }> {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Validate computed parameters
    const { computed } = parameters;

    // Check saturation
    if (computed.saturation < 0 || computed.saturation > 2) {
      issues.push(`Saturation value ${computed.saturation} is out of valid range (0-2)`);
    }

    // Check turbulence
    if (computed.turbulence < 0 || computed.turbulence > 1) {
      issues.push(`Turbulence value ${computed.turbulence} is out of valid range (0-1)`);
    }

    // Check harmony
    if (computed.harmony < 0 || computed.harmony > 1) {
      issues.push(`Harmony value ${computed.harmony} is out of valid range (0-1)`);
    }

    // Check energy
    if (computed.energy < 0 || computed.energy > 1) {
      issues.push(`Energy value ${computed.energy} is out of valid range (0-1)`);
    }

    // Check speed
    if (computed.speed < 0 || computed.speed > 2) {
      issues.push(`Speed value ${computed.speed} is out of valid range (0-2)`);
    }

    // Check density
    if (computed.density < 0 || computed.density > 2) {
      issues.push(`Density value ${computed.density} is out of valid range (0-2)`);
    }

    // Check brightness
    if (computed.brightness < 0 || computed.brightness > 2) {
      issues.push(`Brightness value ${computed.brightness} is out of valid range (0-2)`);
    }

    // Check hue values
    if (computed.primaryHue < 0 || computed.primaryHue > 360) {
      issues.push(`Primary hue value ${computed.primaryHue} is out of valid range (0-360)`);
    }

    if (computed.secondaryHue < 0 || computed.secondaryHue > 360) {
      issues.push(`Secondary hue value ${computed.secondaryHue} is out of valid range (0-360)`);
    }

    // Generate suggestions based on weather conditions
    const { weather } = parameters;

    if (weather.condition === 'storm' && computed.turbulence < 0.8) {
      suggestions.push('Consider increasing turbulence for storm conditions');
    }

    if (weather.condition === 'sunny' && computed.brightness < 1.0) {
      suggestions.push('Consider increasing brightness for sunny conditions');
    }

    if (weather.windSpeed > 15 && computed.turbulence < 0.6) {
      suggestions.push('Consider increasing turbulence for high wind conditions');
    }

    if (weather.temperature > 80 && computed.speed < 1.0) {
      suggestions.push('Consider increasing speed for high temperature conditions');
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }

  public async exportParameters(parameters: GeneratedParameters): Promise<string> {
    // Export parameters as JSON
    return JSON.stringify(parameters, null, 2);
  }

  public async importParameters(jsonString: string): Promise<GeneratedParameters> {
    try {
      const parsed = JSON.parse(jsonString);
      
      // Validate the imported data
      const validation = await this.validateParameters(parsed);
      
      if (!validation.isValid) {
        throw new Error(`Invalid parameters: ${validation.issues.join(', ')}`);
      }

      return parsed;
    } catch (error) {
      throw new Error(`Failed to import parameters: ${error}`);
    }
  }
} 