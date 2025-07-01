import type { ThemeAnalysis, EnhancedColorPalette, WeatherData } from '../../types/unified';

export class AIService {
  private static instance: AIService;
  private apiKey: string | null = null;

  private constructor() {
    // Try to load API key from environment variables first (for production)
    if (typeof process !== 'undefined' && process.env.OPENAI_API_KEY) {
      this.apiKey = process.env.OPENAI_API_KEY;
    } else if (typeof window !== 'undefined') {
      // Fallback to localStorage for development
      this.apiKey = localStorage.getItem('openai-api-key');
    }
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public setApiKey(apiKey: string): void {
    // Validate API key format
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ OpenAI API key should start with "sk-". Please check your API key format.');
    }
    
    this.apiKey = apiKey;
    if (typeof window !== 'undefined') {
      localStorage.setItem('openai-api-key', apiKey);
    }
  }

  public getApiKey(): string | null {
    return this.apiKey;
  }

  public async testApiKey(): Promise<boolean> {
    if (!this.apiKey) {
      throw new Error('No API key configured');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        const hasVisionModel = data.data?.some((model: any) => 
          model.id.includes('gpt-4o') || model.id.includes('gpt-4-vision')
        );
        
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Your OpenAI account may not have access to GPT-4o models');
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ OpenAI API key is valid');
        }
        return true;
      } else {
        const errorText = await response.text();
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ OpenAI API key test failed:', errorText);
        }
        return false;
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ OpenAI API key test error:', error);
      }
      return false;
    }
  }

  public async analyzeImage(imageBase64: string, weatherData?: WeatherData): Promise<ThemeAnalysis> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      // Remove data URL prefix if present
      const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

      const requestPayload = {
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this image and create a visual theme for a dynamic digital art canvas. Consider the following:

1. **Theme Analysis**: What is the overall theme, mood, and atmosphere?
2. **Color Palette**: Extract dominant colors and create a harmonious palette
3. **Visual Characteristics**: Determine saturation, energy, speed, density, brightness levels
4. **Weather Integration**: ${weatherData ? `Current weather: ${weatherData.condition}, ${weatherData.temperature}°F, ${weatherData.windSpeed}mph wind. How should this affect the visual theme?` : 'No weather data available'}

Return your analysis as a JSON object with this exact structure:
{
  "theme": "string",
  "colorPalette": {
    "primary": "hex color",
    "secondary": "hex color", 
    "accent": "hex color",
    "supporting": ["hex colors"]
  },
  "mood": ["mood words"],
  "atmosphere": "string",
  "visualCharacteristics": {
    "saturation": 0.0-1.0,
    "turbulence": 0.0-1.0,
    "harmony": 0.0-1.0,
    "energy": 0.0-1.0,
    "speed": 0.0-1.0,
    "density": 0.0-1.0,
    "brightness": 0.0-1.0
  },
  "weatherMappings": {
    "temperature": {
      "hueShift": "function description",
      "speedMultiplier": "function description", 
      "energyModifier": "function description"
    },
    "wind": {
      "turbulence": "function description",
      "flowDirection": "function description",
      "density": "function description"
    },
    "conditions": {}
  },
  "confidence": 0.0-1.0
}`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Data}`
                }
              }
            ]
          }
        ],
        max_tokens: 1500,
        temperature: 0.3
      };

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload)
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 OpenAI API Response Status:', response.status);
        console.log('🔍 OpenAI API Response Headers:', Object.fromEntries(response.headers.entries()));
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔍 OpenAI API Error Response:', errorText);
        
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenAI API key format (should start with "sk-").');
        } else if (response.status === 404) {
          throw new Error('API endpoint not found. Please check your OpenAI API access and ensure you have access to GPT-4o.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else if (response.status === 400) {
          // Try to parse the error message for more details
          try {
            const errorData = JSON.parse(errorText);
            if (errorData.error?.message) {
              throw new Error(`OpenAI API Error: ${errorData.error.message}`);
            }
          } catch (parseError) {
            // If we can't parse the error, use the raw text
            throw new Error(`OpenAI API Error: ${errorText}`);
          }
        } else {
          throw new Error(`OpenAI API Error: ${response.status} - ${response.statusText}`);
        }
      }

      const data = await response.json();
      const analysisText = data.choices[0].message.content;
      
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

      // Convert function descriptions to actual functions
      const weatherMappings = this.convertWeatherMappings(aiAnalysis.weatherMappings);

      const enrichedAnalysis: ThemeAnalysis = {
        ...aiAnalysis,
        weatherMappings,
        confidence: aiAnalysis.confidence || 0.85,
        source: 'OpenAI Vision API',
        apiTokens: data.usage?.total_tokens || 'Unknown',
        timestamp: new Date().toISOString()
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('🤖 AI analysis complete:', enrichedAnalysis);
      }
      return enrichedAnalysis;

    } catch (error) {
      console.error('AI analysis error:', error);
      throw error;
    }
  }

  private convertWeatherMappings(mappings: any) {
    // Convert function descriptions to actual functions
    return {
      temperature: {
        hueShift: (temp: number) => {
          // Default implementation based on temperature
          return temp > 70 ? 30 : temp < 32 ? -30 : 0;
        },
        speedMultiplier: (temp: number) => {
          // Default implementation based on temperature
          return temp > 80 ? 1.2 : temp < 32 ? 0.8 : 1.0;
        },
        energyModifier: (temp: number) => {
          // Default implementation based on temperature
          return temp > 75 ? 1.1 : temp < 40 ? 0.9 : 1.0;
        }
      },
      wind: {
        turbulence: (speed: number) => {
          // Default implementation based on wind speed
          return Math.min(1, speed / 20);
        },
        flowDirection: (direction: number) => {
          // Default implementation based on wind direction
          return direction / 360;
        },
        density: (speed: number) => {
          // Default implementation based on wind speed
          return Math.max(0.1, 1 - speed / 30);
        }
      },
      conditions: mappings.conditions || {}
    };
  }

  public async generateColorHarmony(basePalette: any, weatherData?: WeatherData): Promise<EnhancedColorPalette> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const requestPayload = {
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `Generate an enhanced color harmony palette based on this base palette: ${JSON.stringify(basePalette)}

${weatherData ? `Current weather context: ${weatherData.condition}, ${weatherData.temperature}°F, ${weatherData.timeOfDay}` : ''}

Create a sophisticated color palette with:
- Primary, secondary, and accent colors
- Supporting colors (4-6 colors)
- Complementary and analogous variations
- Weather-appropriate adjustments

Return as JSON:
{
  "primary": "hex",
  "secondary": "hex",
  "accent": "hex", 
  "supporting": ["hex colors"],
  "complementary": ["hex colors"],
  "analogous": ["hex colors"],
  "weatherAdjusted": ["hex colors"],
  "harmonyType": "string",
  "confidence": 0.0-1.0
}`
          }
        ],
        max_tokens: 800,
        temperature: 0.4
      };

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const colorText = data.choices[0].message.content;
      
      let colorHarmony;
      try {
        let cleanedResponse = colorText.trim();
        if (cleanedResponse.startsWith('```json')) {
          cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanedResponse.startsWith('```')) {
          cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        colorHarmony = JSON.parse(cleanedResponse);
      } catch (parseError) {
        throw new Error('AI returned invalid JSON format for color harmony');
      }

      const enhancedPalette: EnhancedColorPalette = {
        ...colorHarmony,
        source: 'OpenAI Color Harmony',
        apiTokens: data.usage?.total_tokens || 'Unknown',
        timestamp: new Date().toISOString()
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('🎨 Color harmony generated:', enhancedPalette);
      }
      return enhancedPalette;

    } catch (error) {
      console.error('Color harmony generation error:', error);
      throw error;
    }
  }
} 