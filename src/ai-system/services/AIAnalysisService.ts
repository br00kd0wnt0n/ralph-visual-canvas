import { ThemeConfig, ThemeAnalysis, ColorPalette, VisualCharacteristics, WeatherMappings } from '../types/AITypes';

export class AIAnalysisService {
  private static instance: AIAnalysisService;

  private constructor() {}

  public static getInstance(): AIAnalysisService {
    if (!AIAnalysisService.instance) {
      AIAnalysisService.instance = new AIAnalysisService();
    }
    return AIAnalysisService.instance;
  }

  public async analyzeTheme(themeConfig: ThemeConfig): Promise<ThemeAnalysis> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock AI analysis based on theme
    const analysis = this.generateMockAnalysis(themeConfig.name);
    
    return {
      theme: themeConfig.name,
      colorPalette: analysis.colorPalette,
      mood: analysis.mood,
      atmosphere: analysis.atmosphere,
      visualCharacteristics: analysis.visualCharacteristics,
      weatherMappings: this.generateWeatherMappings(analysis),
      confidence: analysis.confidence
    };
  }

  private generateMockAnalysis(theme: string): {
    colorPalette: ColorPalette;
    mood: string[];
    atmosphere: string;
    visualCharacteristics: VisualCharacteristics;
    confidence: number;
  } {
    const themeLower = theme.toLowerCase();
    
    // Default analysis
    let analysis = {
      colorPalette: {
        primary: '#8B0000',
        secondary: '#000080',
        accent: '#FF6B35',
        supporting: ['#2D1B69', '#8B4513']
      },
      mood: ['mysterious', 'nostalgic', 'supernatural'],
      atmosphere: 'dark, neon-lit, 80s aesthetic',
      visualCharacteristics: {
        saturation: 0.9,
        turbulence: 0.7,
        harmony: 0.3,
        energy: 0.8,
        speed: 1.2,
        density: 1.1,
        brightness: 0.6
      },
      confidence: 0.87
    };

    // Theme-specific overrides
    if (themeLower.includes('stranger') || themeLower.includes('things')) {
      analysis = {
        colorPalette: {
          primary: '#8B0000',
          secondary: '#000080',
          accent: '#FF6B35',
          supporting: ['#2D1B69', '#8B4513']
        },
        mood: ['mysterious', 'nostalgic', 'supernatural'],
        atmosphere: 'dark, neon-lit, 80s aesthetic',
        visualCharacteristics: {
          saturation: 0.9,
          turbulence: 0.7,
          harmony: 0.3,
          energy: 0.8,
          speed: 1.2,
          density: 1.1,
          brightness: 0.6
        },
        confidence: 0.95
      };
    } else if (themeLower.includes('blade') || themeLower.includes('runner')) {
      analysis = {
        colorPalette: {
          primary: '#FF4500',
          secondary: '#1E90FF',
          accent: '#FFD700',
          supporting: ['#2F4F4F', '#696969']
        },
        mood: ['cyberpunk', 'futuristic', 'noir'],
        atmosphere: 'rainy, neon-lit, dystopian cityscape',
        visualCharacteristics: {
          saturation: 0.8,
          turbulence: 0.4,
          harmony: 0.6,
          energy: 0.6,
          speed: 0.8,
          density: 0.9,
          brightness: 0.5
        },
        confidence: 0.92
      };
    } else if (themeLower.includes('nature') || themeLower.includes('forest')) {
      analysis = {
        colorPalette: {
          primary: '#228B22',
          secondary: '#8FBC8F',
          accent: '#FFD700',
          supporting: ['#654321', '#2E8B57']
        },
        mood: ['peaceful', 'organic', 'natural'],
        atmosphere: 'lush, verdant, life-filled',
        visualCharacteristics: {
          saturation: 0.7,
          turbulence: 0.2,
          harmony: 0.9,
          energy: 0.4,
          speed: 0.6,
          density: 0.7,
          brightness: 0.8
        },
        confidence: 0.88
      };
    } else if (themeLower.includes('ocean') || themeLower.includes('sea')) {
      analysis = {
        colorPalette: {
          primary: '#1E90FF',
          secondary: '#00CED1',
          accent: '#FFD700',
          supporting: ['#4169E1', '#20B2AA']
        },
        mood: ['flowing', 'deep', 'mysterious'],
        atmosphere: 'fluid, dynamic, underwater currents',
        visualCharacteristics: {
          saturation: 0.6,
          turbulence: 0.5,
          harmony: 0.8,
          energy: 0.5,
          speed: 0.9,
          density: 0.8,
          brightness: 0.7
        },
        confidence: 0.85
      };
    }

    return analysis;
  }

  private generateWeatherMappings(analysis: any): WeatherMappings {
    return {
      temperature: {
        hueShift: (temp: number) => {
          // Warmer temps shift towards red/orange, cooler towards blue
          return (temp - 32) / 100 * 60;
        },
        speedMultiplier: (temp: number) => {
          // Higher temps = faster movement
          return Math.max(0.3, temp / 80);
        },
        energyModifier: (temp: number) => {
          // Optimal energy around 70°F
          const optimal = 70;
          const diff = Math.abs(temp - optimal);
          return Math.max(0.5, 1 - diff / 50);
        }
      },
      wind: {
        turbulence: (speed: number) => {
          // Higher wind = more turbulence
          return Math.min(1, speed / 30);
        },
        flowDirection: (direction: number) => {
          // Convert wind direction to flow direction
          return direction;
        },
        density: (speed: number) => {
          // Higher wind = lower density (particles spread out)
          return Math.max(0.3, 1 - speed / 40);
        }
      },
      conditions: {
        sunny: {
          saturation: 1.2,
          brightness: 1.0,
          energy: 1.1
        },
        cloudy: {
          saturation: 0.8,
          brightness: 0.7,
          energy: 0.9
        },
        rain: {
          saturation: 0.6,
          brightness: 0.5,
          turbulence: 1.2,
          speed: 0.8
        },
        storm: {
          saturation: 0.7,
          brightness: 0.4,
          turbulence: 1.5,
          energy: 1.3,
          speed: 1.4
        },
        snow: {
          saturation: 0.5,
          brightness: 0.9,
          turbulence: 0.3,
          speed: 0.6
        }
      }
    };
  }

  public async generateParameters(
    themeAnalysis: ThemeAnalysis,
    weatherData: any
  ): Promise<any> {
    const { visualCharacteristics, weatherMappings } = themeAnalysis;
    
    // Apply weather mappings
    const tempHueShift = weatherMappings.temperature.hueShift(weatherData.temperature);
    const windTurbulence = weatherMappings.wind.turbulence(weatherData.windSpeed);
    const conditionModifiers = weatherMappings.conditions[weatherData.condition] || {};
    
    // Compute final parameters
    const computed = {
      primaryHue: (0 + tempHueShift + 360) % 360,
      secondaryHue: (240 + tempHueShift + 360) % 360,
      saturation: (visualCharacteristics.saturation * (conditionModifiers.saturation || 1)),
      turbulence: Math.min(1, visualCharacteristics.turbulence + windTurbulence),
      harmony: visualCharacteristics.harmony,
      energy: visualCharacteristics.energy * (conditionModifiers.energy || 1),
      speed: visualCharacteristics.speed * weatherMappings.temperature.speedMultiplier(weatherData.temperature),
      density: visualCharacteristics.density * weatherMappings.wind.density(weatherData.windSpeed),
      brightness: conditionModifiers.brightness || 1.0
    };

    return {
      timestamp: new Date(),
      theme: themeAnalysis.theme,
      weather: weatherData,
      computed,
      reasoning: [
        `Applied temperature-based hue shift of ${tempHueShift.toFixed(1)}°`,
        `Wind speed of ${weatherData.windSpeed}mph increased turbulence by ${windTurbulence.toFixed(2)}`,
        `${weatherData.condition} conditions modified saturation and brightness`,
        `Temperature of ${weatherData.temperature}°F adjusted animation speed`
      ]
    };
  }
} 