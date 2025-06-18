# AI Analysis and Mapping System

A standalone AI analysis and mapping system for the EnhancedVisualCanvas project. This system can be developed and tested independently from the visual components.

## Architecture

```
src/ai-system/
├── services/           # Core AI and data services
│   ├── AIAnalysisService.ts    # AI theme analysis
│   ├── WeatherService.ts       # Weather data integration
│   └── MappingEngine.ts        # Parameter mapping and validation
├── types/              # TypeScript type definitions
│   └── AITypes.ts             # All AI system types
├── utils/              # Utility functions
│   └── testHelpers.ts         # Testing utilities
├── components/         # React components
│   └── AITestDashboard.tsx    # Test interface
└── index.ts           # Main exports
```

## Features

### 🎨 Theme Analysis
- AI-powered theme analysis with mock intelligence
- Color palette generation based on theme keywords
- Visual characteristics mapping (saturation, turbulence, harmony, etc.)
- Confidence scoring for analysis results

### 🌤️ Weather Integration
- Mock weather data for multiple cities
- Real-time weather condition mapping
- Temperature, wind, humidity, and pressure effects
- Time-of-day considerations

### ⚡ Parameter Mapping
- Dynamic parameter computation based on theme + weather
- Real-time parameter validation
- Export/import functionality
- Performance testing and metrics

### 🧪 Testing Interface
- Comprehensive test dashboard
- Individual component testing
- Performance benchmarking
- Validation and error reporting

## Usage

### Basic Usage

```typescript
import { MappingEngine } from './ai-system';

const engine = MappingEngine.getInstance();

// Process a theme with weather data
const parameters = await engine.processTheme(
  'Stranger Things',
  'New York City',
  '1day'
);

console.log(parameters.computed);
```

### Testing Interface

1. Click the "🤖 AI Test System" button in the top-right corner of the main app
2. Enter a theme name (e.g., "Stranger Things", "Blade Runner", "Nature")
3. Select a location and evolution period
4. Use the test controls to:
   - Run full analysis pipeline
   - Validate generated parameters
   - Export results as JSON
   - Run performance tests

### Supported Themes

The system includes pre-configured analysis for:
- **Stranger Things**: Dark, neon-lit, 80s aesthetic
- **Blade Runner**: Cyberpunk, futuristic, noir
- **Nature**: Peaceful, organic, natural
- **Ocean**: Flowing, deep, mysterious

### Weather Conditions

Mock weather data available for:
- New York City (cloudy, 45°F)
- Los Angeles (sunny, 72°F)
- Miami (rain, 78°F)
- Chicago (snow, 32°F)
- Seattle (rain, 55°F)

## API Reference

### MappingEngine

```typescript
class MappingEngine {
  static getInstance(): MappingEngine
  
  async processTheme(
    themeName: string,
    location: string,
    evolutionPeriod: '1hour' | '1day' | '1week'
  ): Promise<GeneratedParameters>
  
  async validateParameters(parameters: GeneratedParameters): Promise<{
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  }>
  
  async exportParameters(parameters: GeneratedParameters): Promise<string>
}
```

### AIAnalysisService

```typescript
class AIAnalysisService {
  static getInstance(): AIAnalysisService
  
  async analyzeTheme(themeConfig: ThemeConfig): Promise<ThemeAnalysis>
  
  async generateParameters(
    themeAnalysis: ThemeAnalysis,
    weatherData: WeatherData
  ): Promise<GeneratedParameters>
}
```

### WeatherService

```typescript
class WeatherService {
  static getInstance(): WeatherService
  
  async getWeatherData(location: string): Promise<WeatherData>
  
  getWeatherConditionIcon(condition: string): string
  
  getWindDirectionArrow(direction: number): string
}
```

## Development

### Adding New Themes

1. Update `AIAnalysisService.generateMockAnalysis()` with new theme logic
2. Add theme-specific color palettes and visual characteristics
3. Test with the AI Test Dashboard

### Adding Real Weather API

1. Replace mock data in `WeatherService.getWeatherData()`
2. Add API key configuration
3. Implement error handling for API failures

### Extending Parameter Mapping

1. Update `WeatherMappings` interface in `AITypes.ts`
2. Modify mapping logic in `AIAnalysisService.generateParameters()`
3. Add validation rules in `MappingEngine.validateParameters()`

## Testing

The system includes comprehensive testing utilities:

```typescript
import { TestHelpers } from './ai-system';

// Generate test scenarios
const scenarios = TestHelpers.generateTestScenarios();

// Create mock data
const mockParams = TestHelpers.createMockParameters('Test Theme');

// Validate parameters
const validation = TestHelpers.validateParameterRanges(mockParams);
```

## Integration with Visual Canvas

The AI system is designed to be integrated with the main visual canvas:

1. **Parameter Export**: Export computed parameters as JSON
2. **Real-time Updates**: Use `getRealTimeParameters()` for live updates
3. **Theme Evolution**: Support for different evolution periods
4. **Weather Responsive**: Automatic adaptation to weather conditions

## Future Enhancements

- [ ] Real AI integration (OpenAI, Claude, etc.)
- [ ] Real weather API integration
- [ ] Machine learning for parameter optimization
- [ ] User preference learning
- [ ] Advanced theme recognition
- [ ] Multi-location support
- [ ] Historical weather data analysis 