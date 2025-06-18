import { ThemeConfig, WeatherData, GeneratedParameters } from '../types/AITypes';

export class TestHelpers {
  /**
   * Generate a mock theme configuration for testing
   */
  static createMockThemeConfig(
    name: string = 'Test Theme',
    location: string = 'New York City',
    evolutionPeriod: '1hour' | '1day' | '1week' = '1day'
  ): ThemeConfig {
    return {
      id: `test_theme_${Date.now()}`,
      name,
      description: `Test theme: ${name}`,
      location,
      evolutionPeriod,
      createdAt: new Date()
    };
  }

  /**
   * Generate mock weather data for testing
   */
  static createMockWeatherData(
    temperature: number = 65,
    condition: string = 'partly cloudy',
    windSpeed: number = 10
  ): WeatherData {
    return {
      temperature,
      condition,
      windSpeed,
      windDirection: 180,
      humidity: 60,
      pressure: 30.0,
      timeOfDay: 'day'
    };
  }

  /**
   * Generate mock parameters for testing
   */
  static createMockParameters(
    theme: string = 'Test Theme',
    weather?: WeatherData
  ): GeneratedParameters {
    const mockWeather = weather || this.createMockWeatherData();
    
    return {
      timestamp: new Date(),
      theme,
      weather: mockWeather,
      computed: {
        primaryHue: 0,
        secondaryHue: 240,
        saturation: 0.8,
        turbulence: 0.5,
        harmony: 0.7,
        energy: 0.6,
        speed: 1.0,
        density: 0.8,
        brightness: 1.0
      },
      reasoning: [
        'Mock parameter generation for testing',
        'Applied default weather mappings',
        'Generated baseline visual characteristics'
      ]
    };
  }

  /**
   * Validate that parameters are within expected ranges
   */
  static validateParameterRanges(parameters: GeneratedParameters): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const { computed } = parameters;

    // Check all computed values are within valid ranges
    if (computed.saturation < 0 || computed.saturation > 2) {
      errors.push(`Saturation ${computed.saturation} out of range [0-2]`);
    }

    if (computed.turbulence < 0 || computed.turbulence > 1) {
      errors.push(`Turbulence ${computed.turbulence} out of range [0-1]`);
    }

    if (computed.harmony < 0 || computed.harmony > 1) {
      errors.push(`Harmony ${computed.harmony} out of range [0-1]`);
    }

    if (computed.energy < 0 || computed.energy > 1) {
      errors.push(`Energy ${computed.energy} out of range [0-1]`);
    }

    if (computed.speed < 0 || computed.speed > 2) {
      errors.push(`Speed ${computed.speed} out of range [0-2]`);
    }

    if (computed.density < 0 || computed.density > 2) {
      errors.push(`Density ${computed.density} out of range [0-2]`);
    }

    if (computed.brightness < 0 || computed.brightness > 2) {
      errors.push(`Brightness ${computed.brightness} out of range [0-2]`);
    }

    if (computed.primaryHue < 0 || computed.primaryHue > 360) {
      errors.push(`Primary hue ${computed.primaryHue} out of range [0-360]`);
    }

    if (computed.secondaryHue < 0 || computed.secondaryHue > 360) {
      errors.push(`Secondary hue ${computed.secondaryHue} out of range [0-360]`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate a series of test scenarios
   */
  static generateTestScenarios(): Array<{
    name: string;
    theme: string;
    location: string;
    expectedConditions: string[];
  }> {
    return [
      {
        name: 'Stranger Things Theme',
        theme: 'Stranger Things',
        location: 'New York City',
        expectedConditions: ['mysterious', 'nostalgic', 'supernatural']
      },
      {
        name: 'Blade Runner Theme',
        theme: 'Blade Runner',
        location: 'Los Angeles',
        expectedConditions: ['cyberpunk', 'futuristic', 'noir']
      },
      {
        name: 'Nature Theme',
        theme: 'Nature',
        location: 'Seattle',
        expectedConditions: ['peaceful', 'organic', 'natural']
      },
      {
        name: 'Ocean Theme',
        theme: 'Ocean',
        location: 'Miami',
        expectedConditions: ['flowing', 'deep', 'mysterious']
      }
    ];
  }

  /**
   * Simulate API delay for testing
   */
  static async simulateDelay(ms: number = 1000): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate performance metrics for testing
   */
  static generatePerformanceMetrics(): {
    processingTime: number;
    memoryUsage: number;
    cpuUsage: number;
    successRate: number;
  } {
    return {
      processingTime: Math.random() * 2000 + 500, // 500-2500ms
      memoryUsage: Math.random() * 50 + 10, // 10-60MB
      cpuUsage: Math.random() * 30 + 5, // 5-35%
      successRate: Math.random() * 0.2 + 0.8 // 80-100%
    };
  }

  /**
   * Create a test report
   */
  static createTestReport(
    testName: string,
    parameters: GeneratedParameters,
    performanceMetrics: any
  ): string {
    const validation = this.validateParameterRanges(parameters);
    
    return `
Test Report: ${testName}
=====================================
Timestamp: ${parameters.timestamp.toISOString()}
Theme: ${parameters.theme}
Location: ${parameters.weather.condition}, ${parameters.weather.temperature}°F

Validation: ${validation.isValid ? 'PASS' : 'FAIL'}
${validation.errors.length > 0 ? `Errors: ${validation.errors.join(', ')}` : ''}

Performance Metrics:
- Processing Time: ${performanceMetrics.processingTime.toFixed(0)}ms
- Memory Usage: ${performanceMetrics.memoryUsage.toFixed(1)}MB
- CPU Usage: ${performanceMetrics.cpuUsage.toFixed(1)}%
- Success Rate: ${(performanceMetrics.successRate * 100).toFixed(1)}%

Generated Parameters:
- Primary Hue: ${parameters.computed.primaryHue.toFixed(0)}°
- Secondary Hue: ${parameters.computed.secondaryHue.toFixed(0)}°
- Saturation: ${parameters.computed.saturation.toFixed(2)}
- Turbulence: ${parameters.computed.turbulence.toFixed(2)}
- Energy: ${parameters.computed.energy.toFixed(2)}
- Speed: ${parameters.computed.speed.toFixed(2)}x

Reasoning:
${parameters.reasoning.map(r => `- ${r}`).join('\n')}
    `.trim();
  }
} 