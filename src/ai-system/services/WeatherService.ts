import { WeatherData } from '../types/AITypes';

export class WeatherService {
  private static instance: WeatherService;
  private apiKey: string | null = null;

  private constructor() {
    // Try to load API key from environment variables first (for production)
    if (typeof process !== 'undefined' && process.env.OPENWEATHER_API_KEY) {
      this.apiKey = process.env.OPENWEATHER_API_KEY;
    } else if (typeof window !== 'undefined') {
      // Fallback to localStorage for development
      this.apiKey = localStorage.getItem('openweather-api-key');
    }
  }

  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  public setApiKey(apiKey: string): void {
    // Validate API key format (OpenWeather keys are typically 32 characters, not OpenAI format)
    if (apiKey && apiKey.startsWith('sk-')) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ You are using an OpenAI API key for the weather service. Please use a valid OpenWeather API key instead.');
      }
      return; // Don't set invalid keys
    }
    
    if (apiKey && apiKey.length < 20) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ OpenWeather API key seems too short. Please check your API key format.');
      }
    }
    
    this.apiKey = apiKey;
    if (typeof window !== 'undefined') {
      localStorage.setItem('openweather-api-key', apiKey);
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
      // Test with a simple location lookup
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=London&limit=1&appid=${this.apiKey}`
      );

      if (response.ok) {
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ OpenWeather API key is valid');
        }
        return true;
      } else {
        const errorText = await response.text();
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ OpenWeather API key test failed:', errorText);
        }
        return false;
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ OpenWeather API key test error:', error);
      }
      return false;
    }
  }

  public async getWeatherData(location: string): Promise<WeatherData> {
    // If no API key, try the free wttr.in API
    if (!this.apiKey) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('No OpenWeather API key configured, trying free weather API');
      }
      return this.getFreeWeatherData(location);
    }

    try {
      // First, get coordinates for the location
      const coords = await this.getCoordinates(location);
      if (!coords) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Could not find coordinates for ${location}, trying free weather API`);
        }
        return this.getFreeWeatherData(location);
      }

      // Get weather data using coordinates
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${this.apiKey}&units=imperial`
      );

      if (!weatherResponse.ok) {
        throw new Error(`Weather API error: ${weatherResponse.status}`);
      }

      const weatherData = await weatherResponse.json();
      
      // Transform OpenWeather data to our format
      const transformedData: WeatherData = {
        temperature: Math.round(weatherData.main.temp),
        condition: this.mapWeatherCondition(weatherData.weather[0].main, weatherData.weather[0].description),
        windSpeed: Math.round(weatherData.wind.speed),
        windDirection: weatherData.wind.deg || 0,
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        timeOfDay: this.getTimeOfDayFromTimestamp(weatherData.dt, weatherData.sys.sunrise, weatherData.sys.sunset),
        dataSource: 'OpenWeather API',
        lastUpdated: new Date().toISOString(),
        location: location,
        verification: {
          apiProvider: 'OpenWeatherMap',
          coordinates: coords,
          rawData: weatherData
        }
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('🌤️ Real weather data fetched:', transformedData);
      }
      return transformedData;

    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Weather API error:', error);
        console.warn('Falling back to free weather API');
      }
      return this.getFreeWeatherData(location);
    }
  }

  private async getCoordinates(location: string): Promise<{ lat: number; lon: number } | null> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: data[0].lat,
          lon: data[0].lon
        };
      }

      return null;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Geocoding error:', error);
      }
      return null;
    }
  }

  private mapWeatherCondition(main: string, description: string): string {
    const conditionMap: Record<string, string> = {
      'Clear': 'clear',
      'Clouds': 'cloudy',
      'Rain': 'rain',
      'Drizzle': 'rain',
      'Thunderstorm': 'storm',
      'Snow': 'snow',
      'Mist': 'fog',
      'Smoke': 'fog',
      'Haze': 'fog',
      'Dust': 'fog',
      'Fog': 'fog',
      'Sand': 'fog',
      'Ash': 'fog',
      'Squall': 'storm',
      'Tornado': 'storm'
    };

    return conditionMap[main] || 'partly cloudy';
  }

  private getTimeOfDayFromTimestamp(current: number, sunrise: number, sunset: number): 'dawn' | 'day' | 'dusk' | 'night' {
    const currentTime = current * 1000; // Convert to milliseconds
    const sunriseTime = sunrise * 1000;
    const sunsetTime = sunset * 1000;
    
    const dawnStart = sunriseTime - (2 * 60 * 60 * 1000); // 2 hours before sunrise
    const dawnEnd = sunriseTime + (1 * 60 * 60 * 1000);   // 1 hour after sunrise
    const duskStart = sunsetTime - (1 * 60 * 60 * 1000);  // 1 hour before sunset
    const duskEnd = sunsetTime + (2 * 60 * 60 * 1000);    // 2 hours after sunset

    if (currentTime >= dawnStart && currentTime <= dawnEnd) {
      return 'dawn';
    } else if (currentTime > dawnEnd && currentTime < duskStart) {
      return 'day';
    } else if (currentTime >= duskStart && currentTime <= duskEnd) {
      return 'dusk';
    } else {
      return 'night';
    }
  }

  private getMockWeatherData(location: string): WeatherData {
    // Simulate API call delay
    // await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock weather data - in real implementation, this would call a weather API
    const mockWeatherData: Record<string, WeatherData> = {
      'new york': {
        temperature: 45,
        condition: 'cloudy',
        windSpeed: 12,
        windDirection: 245,
        humidity: 68,
        pressure: 29.8,
        timeOfDay: 'dusk'
      },
      'los angeles': {
        temperature: 72,
        condition: 'sunny',
        windSpeed: 8,
        windDirection: 180,
        humidity: 45,
        pressure: 30.1,
        timeOfDay: 'day'
      },
      'miami': {
        temperature: 78,
        condition: 'rain',
        windSpeed: 15,
        windDirection: 90,
        humidity: 85,
        pressure: 29.9,
        timeOfDay: 'day'
      },
      'chicago': {
        temperature: 32,
        condition: 'snow',
        windSpeed: 20,
        windDirection: 270,
        humidity: 70,
        pressure: 29.5,
        timeOfDay: 'dawn'
      },
      'seattle': {
        temperature: 55,
        condition: 'rain',
        windSpeed: 10,
        windDirection: 200,
        humidity: 80,
        pressure: 29.7,
        timeOfDay: 'night'
      }
    };

    // Find matching location (case insensitive)
    const locationKey = Object.keys(mockWeatherData).find(
      key => key.toLowerCase().includes(location.toLowerCase()) || 
             location.toLowerCase().includes(key.toLowerCase())
    );

    if (locationKey) {
      return mockWeatherData[locationKey];
    }

    // Default weather data if location not found
    return {
      temperature: 65,
      condition: 'partly cloudy',
      windSpeed: 10,
      windDirection: 180,
      humidity: 60,
      pressure: 30.0,
      timeOfDay: 'day',
      dataSource: 'Mock Data',
      lastUpdated: new Date().toISOString(),
      location: location,
      verification: {
        apiProvider: 'Mock Service'
      }
    };
  }

  public async getCurrentTimeOfDay(location: string): Promise<'dawn' | 'day' | 'dusk' | 'night'> {
    // Mock time of day based on location
    const timeZones: Record<string, 'dawn' | 'day' | 'dusk' | 'night'> = {
      'new york': 'dusk',
      'los angeles': 'day',
      'miami': 'day',
      'chicago': 'dawn',
      'seattle': 'night'
    };

    const locationKey = Object.keys(timeZones).find(
      key => key.toLowerCase().includes(location.toLowerCase()) || 
             location.toLowerCase().includes(key.toLowerCase())
    );

    return locationKey ? timeZones[locationKey] : 'day';
  }

  public getWeatherConditionIcon(condition: string): string {
    const icons: Record<string, string> = {
      'sunny': '☀️',
      'partly cloudy': '⛅',
      'cloudy': '☁️',
      'rain': '🌧️',
      'storm': '⛈️',
      'snow': '❄️',
      'fog': '🌫️',
      'clear': '🌙'
    };

    return icons[condition.toLowerCase()] || '🌤️';
  }

  public getWindDirectionArrow(direction: number): string {
    const arrows = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
    const index = Math.round(direction / 45) % 8;
    return arrows[index];
  }

  private async getFreeWeatherData(location: string): Promise<WeatherData> {
    try {
      // Use wttr.in API (free, no key required)
      const response = await fetch(
        `https://wttr.in/${encodeURIComponent(location)}?format=j1`
      );

      if (!response.ok) {
        throw new Error(`Free weather API error: ${response.status}`);
      }

      const data = await response.json();
      const current = data.current_condition[0];
      
      // Transform wttr.in data to our format
      const transformedData: WeatherData = {
        temperature: parseInt(current.temp_F),
        condition: this.mapWttrCondition(current.weatherDesc[0].value),
        windSpeed: parseInt(current.windspeedMiles),
        windDirection: parseInt(current.winddirDegree),
        humidity: parseInt(current.humidity),
        pressure: parseFloat(current.pressure),
        timeOfDay: this.getTimeOfDayFromWttr(current.observation_time),
        dataSource: 'wttr.in API',
        lastUpdated: new Date().toISOString(),
        location: location,
        verification: {
          apiProvider: 'wttr.in',
          rawData: data
        }
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('🌤️ Free weather data fetched:', transformedData);
      }
      return transformedData;

    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Free weather API error:', error);
        console.warn('Falling back to mock data');
      }
      return this.getMockWeatherData(location);
    }
  }

  private mapWttrCondition(description: string): string {
    const desc = description.toLowerCase();
    
    if (desc.includes('sunny') || desc.includes('clear')) return 'clear';
    if (desc.includes('cloudy') || desc.includes('overcast')) return 'cloudy';
    if (desc.includes('rain') || desc.includes('drizzle')) return 'rain';
    if (desc.includes('storm') || desc.includes('thunder')) return 'storm';
    if (desc.includes('snow') || desc.includes('sleet')) return 'snow';
    if (desc.includes('fog') || desc.includes('mist')) return 'fog';
    
    return 'partly cloudy';
  }

  private getTimeOfDayFromWttr(observationTime: string): 'dawn' | 'day' | 'dusk' | 'night' {
    // Simple time-based logic since wttr.in doesn't provide sunrise/sunset
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 8) return 'dawn';
    if (hour >= 8 && hour < 18) return 'day';
    if (hour >= 18 && hour < 21) return 'dusk';
    return 'night';
  }
} 