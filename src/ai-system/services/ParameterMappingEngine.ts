// ParameterMappingEngine.ts
// Comprehensive parameter mapping system for EnhancedVisualCanvas
// Supports AI, weather, time, evolution, and hybrid logic

import { ThemeAnalysis, WeatherData } from '../types/AITypes';

// Core Types
interface ParameterRule {
  variable: string;
  source: 'ai' | 'weather' | 'time' | 'evolution' | 'hybrid' | 'override' | 'reset';
  priority: number; // 1-10, higher wins conflicts
  constraints: {
    min: number;
    max: number;
    safeZone?: [number, number]; // values that won't break the scene
    lockWhenActive?: string[]; // other variables that lock this one
  };
  mappingFunction: MappingFunction;
  sensitivity: number; // 0-1, how much it responds to changes
  evolutionRate?: number; // for time-based evolution
  description?: string; // human-readable description
}

type MappingFunction = (input: MappingInput) => number | string | boolean;

interface MappingInput {
  ai: ThemeAnalysis;
  weather: WeatherData;
  time: TimeData;
  evolution: EvolutionState;
  current: any; // current parameter value
  scene: SceneState; // for safety checks
}

interface TimeData {
  hour: number;
  minute: number;
  period: 'dawn' | 'day' | 'dusk' | 'night';
  timestamp: number;
}

interface EvolutionState {
  phase: 'calm' | 'building' | 'peak' | 'declining' | 'transition';
  mood: 'calm' | 'energetic' | 'mysterious' | 'chaotic' | 'peaceful';
  intensity: number; // 0-1
  duration: number; // seconds in current phase
}

interface SceneState {
  isBackgroundMode: boolean;
  isModalFriendly: boolean;
  performanceLevel: 'low' | 'medium' | 'high';
  activeEffects: string[];
}

interface ParameterUpdate {
  variable: string;
  value: any;
  source: 'ai' | 'weather' | 'time' | 'evolution' | 'hybrid' | 'override' | 'reset';
  priority: number;
  reason: string;
  confidence: number; // 0-1
}

interface UserPreferences {
  performanceMode: 'quality' | 'balanced' | 'performance';
  preferredMood: string[];
  sensitivityLevel: number; // 0-1
}

class ParameterMappingEngine {
  private rules: Map<string, ParameterRule> = new Map();
  private locked: Set<string> = new Set();
  private safetyLimits: Map<string, [number, number]> = new Map();
  private evolutionState: EvolutionState = {
    phase: 'calm',
    mood: 'peaceful',
    intensity: 0.5,
    duration: 0
  };

  constructor() {
    this.initializeRules();
    this.initializeSafetyLimits();
  }

  private addRule(rule: ParameterRule) {
    this.rules.set(rule.variable, rule);
  }

  private initializeRules() {
    // ===== COLOR MAPPINGS (AI-DRIVEN) =====
    this.addRule({
      variable: 'geometric.spheres.color',
      source: 'ai',
      priority: 8,
      constraints: { min: 0, max: 1 },
      mappingFunction: (input: MappingInput) => input.ai.colorPalette.primary,
      sensitivity: 0.8,
      description: 'Primary color from AI analysis'
    });

    this.addRule({
      variable: 'geometric.cubes.color',
      source: 'ai',
      priority: 8,
      constraints: { min: 0, max: 1 },
      mappingFunction: (input: MappingInput) => input.ai.colorPalette.secondary,
      sensitivity: 0.8,
      description: 'Secondary color from AI analysis'
    });

    this.addRule({
      variable: 'geometric.toruses.color',
      source: 'ai',
      priority: 8,
      constraints: { min: 0, max: 1 },
      mappingFunction: (input: MappingInput) => input.ai.colorPalette.accent,
      sensitivity: 0.8,
      description: 'Accent color from AI analysis'
    });

    this.addRule({
      variable: 'particles.color',
      source: 'hybrid',
      priority: 7,
      constraints: { min: 0, max: 1 },
      mappingFunction: (input: MappingInput) => {
        // Blend primary and accent based on energy
        const energy = input.ai.visualCharacteristics.energy;
        return energy > 0.7 ? input.ai.colorPalette.accent : input.ai.colorPalette.primary;
      },
      sensitivity: 0.6,
      description: 'Dynamic particle color based on energy'
    });

    // ===== PARTICLE SYSTEM (HYBRID: AI + WEATHER + TIME) =====
    this.addRule({
      variable: 'particles.count',
      source: 'hybrid',
      priority: 7,
      constraints: { 
        min: 50, 
        max: 800, 
        safeZone: [100, 600] // performance safe zone
      },
      mappingFunction: (input: MappingInput) => {
        const baseCount = 200;
        const energyMultiplier = input.ai.visualCharacteristics.energy * 2;
        const weatherMultiplier = input.weather.windSpeed > 15 ? 1.3 : 1.0;
        const timeMultiplier = input.time.hour < 6 || input.time.hour > 22 ? 0.7 : 1.0;
        
        return Math.round(baseCount * energyMultiplier * weatherMultiplier * timeMultiplier);
      },
      sensitivity: 0.6,
      description: 'Particle count based on energy, wind, and time'
    });

    this.addRule({
      variable: 'particles.speed',
      source: 'hybrid',
      priority: 6,
      constraints: { min: 0.1, max: 3.0 },
      mappingFunction: (input: MappingInput) => {
        const baseSpeed = input.ai.visualCharacteristics.speed;
        const windBoost = input.weather.windSpeed / 20; // wind affects particle speed
        const temperatureBoost = input.weather.temperature > 70 ? 0.3 : 0;
        
        return Math.min(3.0, baseSpeed + windBoost + temperatureBoost);
      },
      sensitivity: 0.5,
      description: 'Particle speed influenced by wind and temperature'
    });

    this.addRule({
      variable: 'particles.spread',
      source: 'hybrid',
      priority: 6,
      constraints: { min: 10, max: 50 },
      mappingFunction: (input: MappingInput) => {
        const baseSpread = 20;
        const windSpread = input.weather.windSpeed * 0.5;
        const turbulenceSpread = input.ai.visualCharacteristics.turbulence * 10;
        
        return Math.min(50, baseSpread + windSpread + turbulenceSpread);
      },
      sensitivity: 0.4,
      description: 'Particle spread based on wind and turbulence'
    });

    // ===== SHAPE PROPERTIES (AI + EVOLUTION) =====
    this.addRule({
      variable: 'geometric.spheres.count',
      source: 'hybrid',
      priority: 6,
      constraints: { min: 0, max: 20 },
      mappingFunction: (input: MappingInput) => {
        const baseCount = 8;
        const densityMultiplier = input.ai.visualCharacteristics.density;
        const evolutionBoost = input.evolution.intensity * 3;
        
        return Math.round(baseCount * densityMultiplier + evolutionBoost);
      },
      sensitivity: 0.5,
      description: 'Sphere count based on density and evolution'
    });

    this.addRule({
      variable: 'geometric.spheres.speed',
      source: 'hybrid',
      priority: 6,
      constraints: { min: 0.1, max: 3.0 },
      mappingFunction: (input: MappingInput) => {
        const baseSpeed = input.ai.visualCharacteristics.speed;
        const energyBoost = input.ai.visualCharacteristics.energy * 0.5;
        const evolutionBoost = input.evolution.intensity * 0.3;
        
        return Math.min(3.0, baseSpeed + energyBoost + evolutionBoost);
      },
      sensitivity: 0.6,
      description: 'Sphere speed based on AI speed and energy'
    });

    this.addRule({
      variable: 'geometric.spheres.organicness',
      source: 'ai',
      priority: 7,
      constraints: { min: 0, max: 2 },
      mappingFunction: (input: MappingInput) => {
        // Higher turbulence = more organic shapes
        return input.ai.visualCharacteristics.turbulence * 1.5;
      },
      sensitivity: 0.7,
      description: 'Organic deformation based on turbulence'
    });

    // ===== EFFECTS BASED ON WEATHER =====
    this.addRule({
      variable: 'globalEffects.atmosphericBlur.intensity',
      source: 'weather',
      priority: 6,
      constraints: { min: 0, max: 10 },
      mappingFunction: (input: MappingInput) => {
        const humidityFactor = input.weather.humidity / 100;
        const conditionFactor = input.weather.condition.includes('fog') ? 2 : 1;
        const windFactor = input.weather.windSpeed > 20 ? 1.5 : 1;
        
        return humidityFactor * 5 * conditionFactor * windFactor;
      },
      sensitivity: 0.4,
      evolutionRate: 0.01, // slow evolution
      description: 'Atmospheric blur based on humidity and conditions'
    });

    this.addRule({
      variable: 'globalEffects.atmosphericBlur.enabled',
      source: 'weather',
      priority: 7,
      constraints: { min: 0, max: 1 },
      mappingFunction: (input: MappingInput) => {
        return input.weather.humidity > 70 || 
               input.weather.condition.includes('fog') || 
               input.weather.condition.includes('mist');
      },
      sensitivity: 0.8,
      description: 'Enable blur in humid/foggy conditions'
    });

    this.addRule({
      variable: 'globalEffects.volumetric.fog',
      source: 'weather',
      priority: 6,
      constraints: { min: 0, max: 1 },
      mappingFunction: (input: MappingInput) => {
        const humidityFactor = input.weather.humidity / 100;
        const conditionFactor = input.weather.condition.includes('fog') ? 0.8 : 0.2;
        const timeFactor = input.time.period === 'dawn' || input.time.period === 'dusk' ? 0.3 : 0;
        
        return Math.min(1, humidityFactor * conditionFactor + timeFactor);
      },
      sensitivity: 0.5,
      description: 'Volumetric fog based on humidity and time'
    });

    // ===== DISTORTION EFFECTS (HYBRID) =====
    // REQUESTED: Wave distortion based on AI turbulence and evolution mood
    this.addRule({
      variable: 'globalEffects.distortion.wave',
      source: 'hybrid',
      priority: 7,
      constraints: { min: 0, max: 1, safeZone: [0.1, 0.7] },
      mappingFunction: (input: MappingInput) => {
        const baseTurbulence = input.ai.visualCharacteristics.turbulence;
        const moodBoost = input.evolution.mood === 'chaotic' ? 0.3 : 
                         input.evolution.mood === 'energetic' ? 0.2 : 0;
        const windFactor = input.weather.windSpeed / 30; // wind creates waves
        
        return Math.min(1, baseTurbulence + moodBoost + windFactor);
      },
      sensitivity: 0.6,
      description: 'Wave distortion based on turbulence, mood, and wind'
    });

    this.addRule({
      variable: 'globalEffects.distortion.noise',
      source: 'hybrid',
      priority: 7,
      constraints: { min: 0, max: 1, safeZone: [0.1, 0.7] },
      mappingFunction: (input: MappingInput) => {
        const base = input.ai.visualCharacteristics.turbulence;
        const moodBoost = input.evolution.mood === 'chaotic' ? 0.3 : 0;
        const windNoise = input.weather.windSpeed > 15 ? 0.2 : 0;
        
        return Math.min(1, base + moodBoost + windNoise);
      },
      sensitivity: 0.6,
      description: 'Noise distortion based on turbulence and chaotic mood'
    });

    this.addRule({
      variable: 'globalEffects.distortion.ripple',
      source: 'hybrid',
      priority: 6,
      constraints: { min: 0, max: 1 },
      mappingFunction: (input: MappingInput) => {
        const baseRipple = input.ai.visualCharacteristics.harmony * 0.5;
        const energyRipple = input.ai.visualCharacteristics.energy * 0.3;
        const timeRipple = input.time.period === 'dawn' || input.time.period === 'dusk' ? 0.2 : 0;
        
        return Math.min(1, baseRipple + energyRipple + timeRipple);
      },
      sensitivity: 0.4,
      description: 'Ripple effect based on harmony and energy'
    });

    // ===== CHROMATIC EFFECTS (EVOLUTION + MOOD) =====
    this.addRule({
      variable: 'globalEffects.chromatic.rainbow.speed',
      source: 'evolution',
      priority: 5,
      constraints: { 
        min: 0.1, 
        max: 3,
        safeZone: [0.5, 2.0]
      },
      mappingFunction: (input: MappingInput) => {
        const baseSpeed = 1.0;
        const moodMultiplier = {
          'calm': 0.5,
          'energetic': 2.0,
          'mysterious': 0.8,
          'chaotic': 2.5,
          'peaceful': 0.3
        }[input.evolution.mood] || 1.0;
        
        return baseSpeed * moodMultiplier;
      },
      sensitivity: 0.3,
      evolutionRate: 0.005,
      description: 'Rainbow speed based on evolution mood'
    });

    this.addRule({
      variable: 'globalEffects.chromatic.rainbow.intensity',
      source: 'hybrid',
      priority: 6,
      constraints: { min: 0, max: 1 },
      mappingFunction: (input: MappingInput) => {
        const baseIntensity = input.evolution.intensity;
        const saturationBoost = input.ai.visualCharacteristics.saturation * 0.3;
        const energyBoost = input.ai.visualCharacteristics.energy * 0.2;
        
        return Math.min(1, baseIntensity + saturationBoost + energyBoost);
      },
      sensitivity: 0.4,
      description: 'Rainbow intensity based on evolution and saturation'
    });

    // ===== SHAPE GLOW (AI + WEATHER) =====
    this.addRule({
      variable: 'globalEffects.shapeGlow.intensity',
      source: 'hybrid',
      priority: 6,
      constraints: { min: 0, max: 3 },
      mappingFunction: (input: MappingInput) => {
        const baseGlow = input.ai.visualCharacteristics.energy * 1.5;
        const timeGlow = input.time.period === 'night' ? 0.5 : 0;
        const weatherGlow = input.weather.condition === 'clear' ? 0.3 : 0;
        
        return Math.min(3, baseGlow + timeGlow + weatherGlow);
      },
      sensitivity: 0.5,
      description: 'Shape glow based on energy and time'
    });

    this.addRule({
      variable: 'globalEffects.shapeGlow.enabled',
      source: 'hybrid',
      priority: 7,
      constraints: { min: 0, max: 1 },
      mappingFunction: (input: MappingInput) => {
        return input.ai.visualCharacteristics.energy > 0.6 || 
               input.time.period === 'night' ||
               input.evolution.mood === 'mysterious';
      },
      sensitivity: 0.8,
      description: 'Enable glow for high energy or mysterious moods'
    });

    // ===== PARTICLE INTERACTION (WEATHER + AI) =====
    this.addRule({
      variable: 'globalEffects.particleInteraction.turbulence',
      source: 'hybrid',
      priority: 6,
      constraints: { min: 0, max: 1 },
      mappingFunction: (input: MappingInput) => {
        const baseTurbulence = input.ai.visualCharacteristics.turbulence;
        const windTurbulence = input.weather.windSpeed / 40;
        const evolutionTurbulence = input.evolution.intensity * 0.3;
        
        return Math.min(1, baseTurbulence + windTurbulence + evolutionTurbulence);
      },
      sensitivity: 0.5,
      description: 'Particle turbulence based on wind and evolution'
    });

    this.addRule({
      variable: 'globalEffects.particleInteraction.magnetism',
      source: 'evolution',
      priority: 5,
      constraints: { min: 0, max: 1 },
      mappingFunction: (input: MappingInput) => {
        const baseMagnetism = input.evolution.intensity;
        const harmonyMagnetism = input.ai.visualCharacteristics.harmony * 0.5;
        
        return Math.min(1, baseMagnetism + harmonyMagnetism);
      },
      sensitivity: 0.4,
      description: 'Particle magnetism based on evolution and harmony'
    });

    // ===== CAMERA AND VIEWPORT (SAFETY-CRITICAL) =====
    this.addRule({
      variable: 'camera.distance',
      source: 'hybrid',
      priority: 10,
      constraints: { 
        min: 10, 
        max: 50,
        safeZone: [15, 35],
        lockWhenActive: ['backgroundConfig.mode'] // don't change if in background mode
      },
      mappingFunction: (input: MappingInput) => {
        // Only subtle changes allowed
        const current = input.current;
        const maxChange = 2;
        const suggested = 25 + (input.ai.visualCharacteristics.energy - 0.5) * 10;
        
        return Math.max(current - maxChange, Math.min(current + maxChange, suggested));
      },
      sensitivity: 0.1,
      description: 'Camera distance with minimal changes for stability'
    });

    this.addRule({
      variable: 'camera.fov',
      source: 'hybrid',
      priority: 9,
      constraints: { min: 30, max: 120, safeZone: [45, 90] },
      mappingFunction: (input: MappingInput) => {
        const baseFov = 60;
        const energyFov = (input.ai.visualCharacteristics.energy - 0.5) * 20;
        const moodFov = input.evolution.mood === 'chaotic' ? 10 : 0;
        
        return Math.max(30, Math.min(120, baseFov + energyFov + moodFov));
      },
      sensitivity: 0.2,
      description: 'Camera FOV based on energy and mood'
    });

    // ===== POST-PROCESSING EFFECTS =====
    this.addRule({
      variable: 'effects.saturation',
      source: 'hybrid',
      priority: 6,
      constraints: { min: 0, max: 3 },
      mappingFunction: (input: MappingInput) => {
        const baseSaturation = input.ai.visualCharacteristics.saturation;
        const weatherSaturation = input.weather.condition === 'sunny' ? 0.3 : 0;
        const timeSaturation = input.time.period === 'day' ? 0.2 : -0.1;
        
        return Math.max(0, Math.min(3, baseSaturation + weatherSaturation + timeSaturation));
      },
      sensitivity: 0.4,
      description: 'Saturation based on AI analysis and weather'
    });

    this.addRule({
      variable: 'effects.brightness',
      source: 'hybrid',
      priority: 6,
      constraints: { min: 0, max: 3 },
      mappingFunction: (input: MappingInput) => {
        const baseBrightness = 1.0;
        const weatherBrightness = input.weather.condition === 'sunny' ? 0.3 : 
                                 input.weather.condition === 'cloudy' ? -0.2 : 0;
        const timeBrightness = input.time.period === 'night' ? -0.3 : 
                              input.time.period === 'dawn' ? 0.1 : 0;
        
        return Math.max(0, Math.min(3, baseBrightness + weatherBrightness + timeBrightness));
      },
      sensitivity: 0.4,
      description: 'Brightness based on weather and time'
    });

    this.addRule({
      variable: 'effects.vignette',
      source: 'hybrid',
      priority: 5,
      constraints: { min: 0, max: 1 },
      mappingFunction: (input: MappingInput) => {
        const baseVignette = 0.1;
        const moodVignette = input.evolution.mood === 'mysterious' ? 0.3 : 0;
        const timeVignette = input.time.period === 'night' ? 0.2 : 0;
        
        return Math.min(1, baseVignette + moodVignette + timeVignette);
      },
      sensitivity: 0.3,
      description: 'Vignette based on mood and time'
    });

    // ===== BACKGROUND CONFIGURATION =====
    this.addRule({
      variable: 'backgroundConfig.timeScale',
      source: 'hybrid',
      priority: 8,
      constraints: { min: 0.1, max: 3.0, safeZone: [0.5, 2.0] },
      mappingFunction: (input: MappingInput) => {
        const baseTimeScale = 1.0;
        const energyTimeScale = input.ai.visualCharacteristics.energy * 0.5;
        const moodTimeScale = input.evolution.mood === 'energetic' ? 0.3 : 
                             input.evolution.mood === 'calm' ? -0.2 : 0;
        
        return Math.max(0.1, Math.min(3.0, baseTimeScale + energyTimeScale + moodTimeScale));
      },
      sensitivity: 0.3,
      description: 'Time scale based on energy and mood'
    });

    // ===== SPECIAL EFFECTS (EVOLUTION-DRIVEN) =====
    this.addRule({
      variable: 'globalEffects.fireflies.enabled',
      source: 'evolution',
      priority: 6,
      constraints: { min: 0, max: 1 },
      mappingFunction: (input: MappingInput) => {
        return input.evolution.mood === 'mysterious' || 
               input.time.period === 'night' ||
               input.evolution.intensity > 0.7;
      },
      sensitivity: 0.7,
      description: 'Enable fireflies for mysterious moods or night time'
    });

    this.addRule({
      variable: 'globalEffects.fireflies.count',
      source: 'hybrid',
      priority: 5,
      constraints: { min: 10, max: 100 },
      mappingFunction: (input: MappingInput) => {
        const baseCount = 30;
        const evolutionCount = input.evolution.intensity * 40;
        const timeCount = input.time.period === 'night' ? 20 : 0;
        
        return Math.round(Math.min(100, baseCount + evolutionCount + timeCount));
      },
      sensitivity: 0.4,
      description: 'Firefly count based on evolution and time'
    });

    this.addRule({
      variable: 'globalEffects.metamorphosis.enabled',
      source: 'evolution',
      priority: 7,
      constraints: { min: 0, max: 1 },
      mappingFunction: (input: MappingInput) => {
        return input.evolution.phase === 'transition' || 
               input.evolution.mood === 'chaotic' ||
               input.evolution.intensity > 0.8;
      },
      sensitivity: 0.8,
      description: 'Enable metamorphosis during transitions or high intensity'
    });
  }

  private initializeSafetyLimits() {
    // Absolute limits that should never be exceeded
    this.safetyLimits.set('particles.count', [10, 1000]);
    this.safetyLimits.set('geometric.spheres.count', [0, 15]);
    this.safetyLimits.set('geometric.cubes.count', [0, 15]);
    this.safetyLimits.set('geometric.toruses.count', [0, 10]);
    this.safetyLimits.set('geometric.blobs.count', [0, 10]);
    this.safetyLimits.set('camera.distance', [8, 60]);
    this.safetyLimits.set('camera.fov', [20, 150]);
    this.safetyLimits.set('globalEffects.shapeGlow.radius', [1, 150]);
    this.safetyLimits.set('globalEffects.fireflies.count', [5, 150]);
    this.safetyLimits.set('backgroundConfig.timeScale', [0.05, 5.0]);
  }

  // Main mapping function
  public mapParameters(
    aiResults: ThemeAnalysis,
    weatherData: WeatherData,
    currentParams: any,
    evolutionState?: EvolutionState
  ): ParameterUpdate[] {
    const updates: ParameterUpdate[] = [];
    const timeData = this.getCurrentTimeData();
    const sceneState = this.getSceneState(currentParams);
    
    // Update evolution state if provided
    if (evolutionState) {
      this.evolutionState = evolutionState;
    }

    for (const [variable, rule] of this.rules) {
      if (this.locked.has(variable)) continue;

      const input: MappingInput = {
        ai: aiResults,
        weather: weatherData,
        time: timeData,
        evolution: this.evolutionState,
        current: this.getNestedValue(currentParams, variable),
        scene: sceneState
      };

      try {
        const newValue = rule.mappingFunction(input);
        const safeValue = this.applySafetyLimits(variable, newValue, rule.constraints);
        
        if (this.shouldUpdate(variable, safeValue, input.current, rule.sensitivity)) {
          updates.push({
            variable,
            value: safeValue,
            source: rule.source,
            priority: rule.priority,
            reason: this.generateReason(rule.source, input),
            confidence: this.calculateConfidence(rule, input)
          });
        }
      } catch (error) {
        console.warn(`Mapping error for ${variable}:`, error);
      }
    }

    return this.resolveConflicts(updates);
  }

  // AI-Powered Meta-Mapping (for complex decisions)
  public async generateAdvancedMapping(
    aiResults: ThemeAnalysis,
    currentScene: any,
    userPreferences?: UserPreferences
  ): Promise<ParameterUpdate[]> {
    // This could call OpenAI to make higher-level decisions
    const prompt = this.buildMappingPrompt(aiResults, currentScene, userPreferences);
    
    // Call AI for complex mapping decisions
    const aiResponse = await this.callAIForMapping(prompt);
    
    // Parse and validate AI suggestions
    return this.validateAISuggestions(aiResponse, currentScene);
  }

  private applySafetyLimits(variable: string, value: any, constraints: any): any {
    const absoluteLimits = this.safetyLimits.get(variable);
    
    if (typeof value === 'number') {
      let safeValue = Math.max(constraints.min, Math.min(constraints.max, value));
      
      if (absoluteLimits) {
        safeValue = Math.max(absoluteLimits[0], Math.min(absoluteLimits[1], safeValue));
      }
      
      // Prefer safe zone if available
      if (constraints.safeZone) {
        const [safeMin, safeMax] = constraints.safeZone;
        if (safeValue < safeMin || safeValue > safeMax) {
          // Gradually move toward safe zone
          safeValue = safeValue < safeMin ? 
            Math.min(safeMin, safeValue + 1) : 
            Math.max(safeMax, safeValue - 1);
        }
      }
      
      return safeValue;
    }
    
    return value;
  }

  // Configuration methods for tweaking
  public updateRule(variable: string, updates: Partial<ParameterRule>) {
    const rule = this.rules.get(variable);
    if (rule) {
      this.rules.set(variable, { ...rule, ...updates });
    }
  }

  public lockParameter(variable: string, reason?: string) {
    this.locked.add(variable);
    console.log(`🔒 Locked parameter: ${variable}${reason ? ` (${reason})` : ''}`);
  }

  public unlockParameter(variable: string) {
    this.locked.delete(variable);
    console.log(`🔓 Unlocked parameter: ${variable}`);
  }

  public addCustomMapping(
    variable: string, 
    mappingFunction: MappingFunction,
    options: Partial<ParameterRule> = {}
  ) {
    this.rules.set(variable, {
      variable,
      source: 'hybrid',
      priority: 5,
      constraints: { min: 0, max: 1 },
      mappingFunction,
      sensitivity: 0.5,
      description: 'Custom mapping',
      ...options
    });
  }

  // Helper methods
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  private shouldUpdate(variable: string, newValue: any, currentValue: any, sensitivity: number): boolean {
    if (typeof newValue === 'number' && typeof currentValue === 'number') {
      const diff = Math.abs(newValue - currentValue);
      const threshold = Math.abs(currentValue) * (1 - sensitivity) + 0.01;
      return diff > threshold;
    }
    return newValue !== currentValue;
  }

  private resolveConflicts(updates: ParameterUpdate[]): ParameterUpdate[] {
    // Sort by priority and resolve conflicts
    const grouped = new Map<string, ParameterUpdate[]>();
    
    updates.forEach(update => {
      if (!grouped.has(update.variable)) {
        grouped.set(update.variable, []);
      }
      grouped.get(update.variable)!.push(update);
    });

    return Array.from(grouped.values()).map(group => {
      return group.sort((a, b) => b.priority - a.priority)[0];
    });
  }

  private generateReason(source: string, input: MappingInput): string {
    switch (source) {
      case 'ai':
        return `AI detected ${input.ai.theme} theme with ${input.ai.atmosphere} atmosphere`;
      case 'weather':
        return `Weather: ${input.weather.condition}, ${input.weather.temperature}°F`;
      case 'time':
        return `Time-based: ${input.time.period}`;
      case 'evolution':
        return `Evolution: ${input.evolution.phase} phase, ${input.evolution.mood} mood`;
      default:
        return 'Hybrid mapping';
    }
  }

  private calculateConfidence(rule: ParameterRule, input: MappingInput): number {
    let confidence = 0.5; // base confidence
    
    // Higher confidence for AI-driven rules
    if (rule.source === 'ai') confidence += 0.2;
    
    // Higher confidence for weather when conditions are clear
    if (rule.source === 'weather' && input.weather.condition !== 'unknown') confidence += 0.1;
    
    // Higher confidence for evolution when intensity is high
    if (rule.source === 'evolution' && input.evolution.intensity > 0.7) confidence += 0.1;
    
    // Lower confidence for hybrid rules (more complex)
    if (rule.source === 'hybrid') confidence -= 0.1;
    
    return Math.max(0, Math.min(1, confidence));
  }

  private getCurrentTimeData(): TimeData {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    let period: 'dawn' | 'day' | 'dusk' | 'night';
    if (hour >= 6 && hour < 12) period = 'dawn';
    else if (hour >= 12 && hour < 18) period = 'day';
    else if (hour >= 18 && hour < 22) period = 'dusk';
    else period = 'night';
    
    return {
      hour,
      minute,
      period,
      timestamp: now.getTime()
    };
  }

  private getSceneState(currentParams: any): SceneState {
    return {
      isBackgroundMode: currentParams?.backgroundConfig?.enabled || false,
      isModalFriendly: currentParams?.backgroundConfig?.mode === 'modalFriendly',
      performanceLevel: 'medium', // Could be determined by FPS monitoring
      activeEffects: this.getActiveEffects(currentParams)
    };
  }

  private getActiveEffects(currentParams: any): string[] {
    const effects: string[] = [];
    const globalEffects = currentParams?.globalEffects;
    
    if (globalEffects?.atmosphericBlur?.enabled) effects.push('atmosphericBlur');
    if (globalEffects?.shapeGlow?.enabled) effects.push('shapeGlow');
    if (globalEffects?.chromatic?.enabled) effects.push('chromatic');
    if (globalEffects?.volumetric?.enabled) effects.push('volumetric');
    if (globalEffects?.distortion?.enabled) effects.push('distortion');
    if (globalEffects?.fireflies?.enabled) effects.push('fireflies');
    if (globalEffects?.metamorphosis?.enabled) effects.push('metamorphosis');
    
    return effects;
  }

  private buildMappingPrompt(aiResults: ThemeAnalysis, currentScene: any, userPreferences?: UserPreferences): string {
    return `Analyze the following visual scene and suggest parameter adjustments:

AI Analysis: ${JSON.stringify(aiResults, null, 2)}
Current Scene: ${JSON.stringify(currentScene, null, 2)}
User Preferences: ${JSON.stringify(userPreferences, null, 2)}

Suggest parameter updates that would enhance the visual experience while maintaining performance.`;
  }

  private async callAIForMapping(prompt: string): Promise<any> {
    // This would integrate with OpenAI or other AI service
    // For now, return a mock response
    return {
      suggestions: [],
      confidence: 0.5
    };
  }

  private validateAISuggestions(aiResponse: any, currentScene: any): ParameterUpdate[] {
    // Validate and convert AI suggestions to ParameterUpdate format
    return [];
  }

  // Public utility methods
  public getRule(variable: string): ParameterRule | undefined {
    return this.rules.get(variable);
  }

  public getAllRules(): ParameterRule[] {
    return Array.from(this.rules.values());
  }

  public getLockedParameters(): string[] {
    return Array.from(this.locked);
  }

  public getSafetyLimits(): Map<string, [number, number]> {
    return new Map(this.safetyLimits);
  }
}

// Export the engine and types
export { 
  ParameterMappingEngine, 
  type ParameterRule, 
  type MappingFunction, 
  type ParameterUpdate,
  type TimeData,
  type EvolutionState,
  type SceneState,
  type UserPreferences
}; 