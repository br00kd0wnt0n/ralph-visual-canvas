// ParameterMappingEngine.ts
interface ParameterRule {
  variable: string;
  source: 'ai' | 'weather' | 'time' | 'evolution' | 'hybrid';
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
}

type MappingFunction = (input: MappingInput) => number | string | boolean;

interface MappingInput {
  ai: AIAnalysisResults;
  weather: WeatherData;
  time: TimeData;
  evolution: EvolutionState;
  current: any; // current parameter value
  scene: SceneState; // for safety checks
}

interface EvolutionState {
  sessionTime: number;
  userInteractions: number;
  mood: 'calm' | 'energetic' | 'mysterious' | 'chaotic';
  phase: 'intro' | 'exploration' | 'climax' | 'resolution';
}

class ParameterMappingEngine {
  private rules: Map<string, ParameterRule> = new Map();
  private locked: Set<string> = new Set();
  private safetyLimits: Map<string, [number, number]> = new Map();

  constructor() {
    this.initializeRules();
    this.initializeSafetyLimits();
  }

  private initializeRules() {
    // SAFE TO CHANGE - Visual aesthetics
    this.addRule({
      variable: 'geometric.spheres.color',
      source: 'ai',
      priority: 8,
      constraints: { min: 0, max: 1 },
      mappingFunction: (input) => input.ai.colorPalette.primary,
      sensitivity: 0.8
    });

    this.addRule({
      variable: 'particles.count',
      source: 'hybrid',
      priority: 7,
      constraints: { 
        min: 50, 
        max: 800, 
        safeZone: [100, 600] // performance safe zone
      },
      mappingFunction: (input) => {
        const baseCount = 200;
        const energyMultiplier = input.ai.visualCharacteristics.energy * 2;
        const weatherMultiplier = input.weather.windSpeed > 15 ? 1.3 : 1.0;
        const timeMultiplier = input.time.hour < 6 || input.time.hour > 22 ? 0.7 : 1.0;
        
        return Math.round(baseCount * energyMultiplier * weatherMultiplier * timeMultiplier);
      },
      sensitivity: 0.6
    });

    this.addRule({
      variable: 'globalEffects.atmosphericBlur.intensity',
      source: 'weather',
      priority: 6,
      constraints: { min: 0, max: 10 },
      mappingFunction: (input) => {
        const humidityFactor = input.weather.humidity / 100;
        const conditionFactor = input.weather.condition.includes('fog') ? 2 : 1;
        return humidityFactor * 5 * conditionFactor;
      },
      sensitivity: 0.4,
      evolutionRate: 0.01 // slow evolution
    });

    // MODERATE RISK - Can change but with limits
    this.addRule({
      variable: 'globalEffects.chromatic.rainbow.speed',
      source: 'evolution',
      priority: 5,
      constraints: { 
        min: 0.1, 
        max: 3,
        safeZone: [0.5, 2.0]
      },
      mappingFunction: (input) => {
        const baseSpeed = 1.0;
        const moodMultiplier = {
          'calm': 0.5,
          'energetic': 2.0,
          'mysterious': 0.8,
          'chaotic': 2.5
        }[input.evolution.mood];
        
        return baseSpeed * moodMultiplier;
      },
      sensitivity: 0.3,
      evolutionRate: 0.005
    });

    // LOCKED - Critical for scene stability
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
      mappingFunction: (input) => {
        // Only subtle changes allowed
        const current = input.current;
        const maxChange = 2;
        const suggested = 25 + (input.ai.visualCharacteristics.energy - 0.5) * 10;
        
        return Math.max(current - maxChange, Math.min(current + maxChange, suggested));
      },
      sensitivity: 0.1
    });
  }

  private initializeSafetyLimits() {
    // Absolute limits that should never be exceeded
    this.safetyLimits.set('particles.count', [10, 1000]);
    this.safetyLimits.set('geometric.spheres.count', [0, 15]);
    this.safetyLimits.set('camera.distance', [8, 60]);
    this.safetyLimits.set('globalEffects.shapeGlow.radius', [1, 150]);
  }

  // Main mapping function
  public mapParameters(
    aiResults: AIAnalysisResults,
    weatherData: WeatherData,
    currentParams: any,
    evolutionState: EvolutionState
  ): ParameterUpdate[] {
    const updates: ParameterUpdate[] = [];
    const timeData = this.getCurrentTimeData();

    for (const [variable, rule] of this.rules) {
      if (this.locked.has(variable)) continue;

      const input: MappingInput = {
        ai: aiResults,
        weather: weatherData,
        time: timeData,
        evolution: evolutionState,
        current: this.getNestedValue(currentParams, variable),
        scene: this.getSceneState(currentParams)
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
            reason: this.generateReason(rule.source, input)
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
    aiResults: AIAnalysisResults,
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
}

interface ParameterUpdate {
  variable: string;
  value: any;
  source: 'ai' | 'weather' | 'time' | 'evolution' | 'hybrid';
  priority: number;
  reason: string;
}

interface TimeData {
  hour: number;
  period: 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';
  season: 'spring' | 'summer' | 'fall' | 'winter';
}

interface UserPreferences {
  preferredIntensity: number;
  colorPreferences: string[];
  performanceMode: 'quality' | 'balanced' | 'performance';
  favoriteEffects: string[];
}

export { ParameterMappingEngine, type ParameterRule, type MappingFunction, type ParameterUpdate };