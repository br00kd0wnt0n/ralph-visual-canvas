export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  referenceImage?: File;
  location: string;
  evolutionPeriod: '1hour' | '1day' | '1week';
  createdAt: Date;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  supporting: string[];
}

export interface VisualCharacteristics {
  saturation: number;     // 0-1
  turbulence: number;     // 0-1 (chaos level)
  harmony: number;        // 0-1 (synchronization)
  energy: number;         // 0-1 (intensity)
  speed: number;          // 0-2 (animation speed)
  density: number;        // 0-2 (object density)
  brightness: number;     // 0-2 (overall brightness)
}

export interface WeatherData {
  temperature: number;    // °F
  condition: string;      // sunny, cloudy, rain, storm, etc.
  windSpeed: number;      // mph
  windDirection: number;  // degrees
  humidity: number;       // %
  pressure: number;       // inHg
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
  dataSource?: string;    // API source (OpenWeather, wttr.in, mock)
  lastUpdated?: string;   // ISO timestamp
  location?: string;      // Location name
  verification?: {
    apiProvider: string;
    coordinates?: { lat: number; lon: number };
    rawData?: any;
  };
}

export interface ThemeAnalysis {
  theme: string;
  colorPalette: ColorPalette;
  mood: string[];
  atmosphere: string;
  visualCharacteristics: VisualCharacteristics;
  weatherMappings: WeatherMappings;
  confidence: number;     // 0-1 AI confidence score
}

export interface WeatherMappings {
  temperature: {
    hueShift: (temp: number) => number;
    speedMultiplier: (temp: number) => number;
    energyModifier: (temp: number) => number;
  };
  wind: {
    turbulence: (speed: number) => number;
    flowDirection: (direction: number) => number;
    density: (speed: number) => number;
  };
  conditions: Record<string, Partial<VisualCharacteristics>>;
}

export interface GeneratedParameters {
  timestamp: Date;
  theme: string;
  weather: WeatherData;
  computed: VisualCharacteristics & {
    primaryHue: number;
    secondaryHue: number;
    brightness: number;
  };
  reasoning: string[];    // AI explanation of decisions
} 