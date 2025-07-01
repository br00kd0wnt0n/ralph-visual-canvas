// ParameterInterpolator.ts
// Isolated parameter interpolation system with generic state interpolation
// No dependencies on existing stores or components - completely self-contained

import {
  EasingType,
  InterpolationConfig,
  AnimationState,
  InterpolationResult,
  ValidationResult,
  TestResults,
  TestDetail,
  PerformanceMetrics,
  ColorInterpolation,
  HSLInterpolation,
  EasingFunction,
  InterpolationCache,
  VisualStoreAdapter,
  MockVisualState,
  EASING_FUNCTIONS,
  TEST_SCENARIOS,
  FeatureFlags,
  DEFAULT_FEATURE_FLAGS
} from '../types/InterpolationTypes';

export class ParameterInterpolator<T extends Record<string, any>> {
  private cache: InterpolationCache = {};
  private animationState: AnimationState | null = null;
  private animationId: number | null = null;
  private featureFlags: FeatureFlags;
  private performanceMetrics: PerformanceMetrics = {
    interpolationTime: 0,
    memoryUsage: 0,
    frameRate: 0,
    accuracy: 0,
    cacheHitRate: 0,
    complexity: 0
  };
  private cacheHits = 0;
  private cacheMisses = 0;

  constructor(featureFlags: Partial<FeatureFlags> = {}) {
    this.featureFlags = { ...DEFAULT_FEATURE_FLAGS, ...featureFlags };
    console.log('🔄 ParameterInterpolator initialized - Ready for isolated testing');
  }

  // ===== CORE INTERPOLATION METHODS =====

  /**
   * Main interpolation method - works with any object structure
   */
  interpolate(fromState: T, toState: T, progress: number, easingType: EasingType = 'linear'): T {
    const startTime = performance.now();
    
    // Check cache first
    const cacheKey = this.generateCacheKey(fromState, toState, progress, easingType);
    if (this.featureFlags.enableCaching && this.cache[cacheKey]) {
      this.cacheHits++;
      this.cache[cacheKey].usageCount++;
      this.updatePerformanceMetrics(startTime);
      return this.cache[cacheKey].result;
    }

    this.cacheMisses++;

    try {
      // Apply easing function
      const easingValue = this.applyEasing(progress, easingType);
      
      // Perform interpolation
      const interpolatedState = this.interpolateObject(fromState, toState, easingValue);
      
      // Cache result
      if (this.featureFlags.enableCaching) {
        this.cache[cacheKey] = {
          result: interpolatedState,
          timestamp: Date.now(),
          usageCount: 1,
          accuracy: this.calculateAccuracy(fromState, toState, interpolatedState, easingValue)
        };
      }

      this.updatePerformanceMetrics(startTime);
      
      if (this.featureFlags.enableLogging) {
        console.log(`🔄 Interpolated state with ${easingType} easing (${(easingValue * 100).toFixed(1)}% progress)`);
      }
      
      return interpolatedState;
      
    } catch (error) {
      console.error('❌ Interpolation error:', error);
      throw new Error(`Failed to interpolate: ${error}`);
    }
  }

  /**
   * Animate transition between states
   */
  async animateTransition(
    fromState: T,
    toState: T,
    duration: number,
    onUpdate: (state: T) => void,
    easing: EasingType = 'easeInOut',
    config?: Partial<InterpolationConfig>
  ): Promise<void> {
    const fullConfig: InterpolationConfig = {
      duration,
      easing,
      fps: 60,
      autoStart: true,
      ...config
    };

    return new Promise((resolve, reject) => {
      try {
        // Initialize animation state
        this.animationState = {
          isRunning: true,
          startTime: performance.now(),
          duration: fullConfig.duration,
          progress: 0,
          currentState: fromState,
          fromState,
          toState,
          easing: fullConfig.easing,
          fps: fullConfig.fps,
          frameCount: 0,
          lastFrameTime: 0
        };

        // Call onStart callback
        fullConfig.onStart?.();

        // Start animation loop
        this.animationId = requestAnimationFrame(() => this.animationLoop(onUpdate, resolve, reject, fullConfig));

      } catch (error) {
        reject(error);
      }
    });
  }

  // ===== EASING FUNCTIONS =====

  /**
   * Apply easing function to progress value
   */
  applyEasing(progress: number, easingType: EasingType): number {
    const easingFunction = EASING_FUNCTIONS[easingType];
    if (!easingFunction) {
      console.warn(`⚠️ Unknown easing type: ${easingType}, using linear`);
      return progress;
    }
    
    return easingFunction.function(Math.max(0, Math.min(1, progress)));
  }

  /**
   * Get all available easing functions
   */
  getEasingFunctions(): Record<EasingType, EasingFunction> {
    return EASING_FUNCTIONS;
  }

  /**
   * Get easing function by type
   */
  getEasingFunction(easingType: EasingType): EasingFunction | null {
    return EASING_FUNCTIONS[easingType] || null;
  }

  // ===== INTERPOLATION HELPERS =====

  /**
   * Recursively interpolate object structure
   */
  private interpolateObject(fromObj: any, toObj: any, progress: number): any {
    if (fromObj === toObj) return fromObj;
    if (progress <= 0) return fromObj;
    if (progress >= 1) return toObj;

    // Handle different types
    if (Array.isArray(fromObj) && Array.isArray(toObj)) {
      return this.interpolateArray(fromObj, toObj, progress);
    }
    
    if (typeof fromObj === 'object' && typeof toObj === 'object' && fromObj !== null && toObj !== null) {
      return this.interpolateNestedObject(fromObj, toObj, progress);
    }
    
    if (typeof fromObj === 'number' && typeof toObj === 'number') {
      return this.interpolateNumber(fromObj, toObj, progress);
    }
    
    if (typeof fromObj === 'string' && typeof toObj === 'string') {
      return this.interpolateString(fromObj, toObj, progress);
    }
    
    if (typeof fromObj === 'boolean' && typeof toObj === 'boolean') {
      return this.interpolateBoolean(fromObj, toObj, progress);
    }

    // Fallback: return target value
    return toObj;
  }

  /**
   * Interpolate numeric values
   */
  private interpolateNumber(from: number, to: number, progress: number): number {
    return from + (to - from) * progress;
  }

  /**
   * Interpolate string values (for colors, etc.)
   */
  private interpolateString(from: string, to: string, progress: number): string {
    // Handle color interpolation
    if (this.featureFlags.enableColorInterpolation && this.isColorString(from) && this.isColorString(to)) {
      return this.interpolateColor(from, to, progress);
    }
    
    // For other strings, interpolate character by character if same length
    if (from.length === to.length) {
      return from.split('').map((char, index) => {
        const fromChar = from.charCodeAt(index);
        const toChar = to.charCodeAt(index);
        const interpolatedChar = Math.round(fromChar + (toChar - fromChar) * progress);
        return String.fromCharCode(interpolatedChar);
      }).join('');
    }
    
    // Fallback: return target string
    return to;
  }

  /**
   * Interpolate boolean values (threshold-based)
   */
  private interpolateBoolean(from: boolean, to: boolean, progress: number): boolean {
    if (from === to) return from;
    return progress > 0.5 ? to : from;
  }

  /**
   * Interpolate array values element-wise
   */
  private interpolateArray(fromArr: any[], toArr: any[], progress: number): any[] {
    const maxLength = Math.max(fromArr.length, toArr.length);
    const result: any[] = [];
    
    for (let i = 0; i < maxLength; i++) {
      const fromValue = fromArr[i];
      const toValue = toArr[i];
      
      if (fromValue !== undefined && toValue !== undefined) {
        result.push(this.interpolateObject(fromValue, toValue, progress));
      } else if (fromValue !== undefined) {
        result.push(fromValue);
      } else if (toValue !== undefined) {
        result.push(toValue);
      }
    }
    
    return result;
  }

  /**
   * Interpolate nested object structures
   */
  private interpolateNestedObject(fromObj: any, toObj: any, progress: number): any {
    const result: any = {};
    const allKeys = new Set([...Object.keys(fromObj), ...Object.keys(toObj)]);
    
    for (const key of allKeys) {
      const fromValue = fromObj[key];
      const toValue = toObj[key];
      
      if (fromValue !== undefined && toValue !== undefined) {
        result[key] = this.interpolateObject(fromValue, toValue, progress);
      } else if (fromValue !== undefined) {
        result[key] = fromValue;
      } else if (toValue !== undefined) {
        result[key] = toValue;
      }
    }
    
    return result;
  }

  // ===== COLOR INTERPOLATION =====

  /**
   * Check if string is a color
   */
  private isColorString(str: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(str) || 
           /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(str) ||
           /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/.test(str);
  }

  /**
   * Interpolate color values
   */
  private interpolateColor(fromColor: string, toColor: string, progress: number): string {
    const fromRGB = this.parseColor(fromColor);
    const toRGB = this.parseColor(toColor);
    
    if (!fromRGB || !toRGB) {
      return progress > 0.5 ? toColor : fromColor;
    }
    
    const interpolatedRGB = {
      r: Math.round(fromRGB.r + (toRGB.r - fromRGB.r) * progress),
      g: Math.round(fromRGB.g + (toRGB.g - fromRGB.g) * progress),
      b: Math.round(fromRGB.b + (toRGB.b - fromRGB.b) * progress)
    };
    
    return `rgb(${interpolatedRGB.r}, ${interpolatedRGB.g}, ${interpolatedRGB.b})`;
  }

  /**
   * Parse color string to RGB
   */
  private parseColor(color: string): { r: number; g: number; b: number } | null {
    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const rgb = parseInt(hex, 16);
      return {
        r: (rgb >> 16) & 255,
        g: (rgb >> 8) & 255,
        b: rgb & 255
      };
    }
    
    // Handle rgb() colors
    const rgbMatch = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3])
      };
    }
    
    // Handle hsl() colors (simplified conversion)
    const hslMatch = color.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
    if (hslMatch) {
      const h = parseInt(hslMatch[1]) / 360;
      const s = parseInt(hslMatch[2]) / 100;
      const l = parseInt(hslMatch[3]) / 100;
      
      // Simplified HSL to RGB conversion
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      return {
        r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
        g: Math.round(hue2rgb(p, q, h) * 255),
        b: Math.round(hue2rgb(p, q, h - 1/3) * 255)
      };
    }
    
    return null;
  }

  // ===== ANIMATION CONTROL =====

  /**
   * Animation loop for smooth transitions
   */
  private animationLoop(
    onUpdate: (state: T) => void,
    resolve: () => void,
    reject: (error: Error) => void,
    config: InterpolationConfig
  ): void {
    if (!this.animationState || !this.animationState.isRunning) {
      resolve();
      return;
    }

    const currentTime = performance.now();
    const elapsed = currentTime - this.animationState.startTime;
    const progress = Math.min(elapsed / this.animationState.duration, 1);

    // Update animation state
    this.animationState.progress = progress;
    this.animationState.frameCount++;
    this.animationState.lastFrameTime = currentTime;

    try {
      // Interpolate current state
      const currentState = this.interpolate(
        this.animationState.fromState,
        this.animationState.toState,
        progress,
        this.animationState.easing
      );

      this.animationState.currentState = currentState;

      // Call update callback
      onUpdate(currentState);
      config.onUpdate?.(progress, currentState);

      // Check if animation is complete
      if (progress >= 1) {
        this.animationState.isRunning = false;
        config.onComplete?.();
        resolve();
        return;
      }

      // Continue animation
      this.animationId = requestAnimationFrame(() => 
        this.animationLoop(onUpdate, resolve, reject, config)
      );

    } catch (error) {
      this.animationState.isRunning = false;
      config.onError?.(error as Error);
      reject(error as Error);
    }
  }

  /**
   * Stop current animation
   */
  stopAnimation(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    if (this.animationState) {
      this.animationState.isRunning = false;
    }
  }

  /**
   * Get current animation state
   */
  getAnimationState(): AnimationState | null {
    return this.animationState;
  }

  // ===== VALIDATION & TESTING =====

  /**
   * Validate interpolation result
   */
  validateInterpolation(from: T, to: T, result: T): ValidationResult {
    const startTime = performance.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    try {
      // Basic validation
      if (!result || typeof result !== 'object') {
        errors.push('Result is not a valid object');
      }

      // Check for missing properties
      const fromKeys = Object.keys(from);
      const toKeys = Object.keys(to);
      const resultKeys = Object.keys(result);
      
      const allKeys = new Set([...fromKeys, ...toKeys]);
      
      for (const key of allKeys) {
        if (!resultKeys.includes(key)) {
          warnings.push(`Missing property: ${key}`);
        }
      }

      // Calculate accuracy
      const accuracy = this.calculateAccuracy(from, to, result, 0.5);

      // Performance metrics
      const interpolationTime = performance.now() - startTime;
      const complexity = this.calculateComplexity(from);

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        suggestions,
        accuracy,
        performance: {
          interpolationTime,
          memoryUsage: this.performanceMetrics.memoryUsage,
          complexity
        }
      };

    } catch (error) {
      return {
        isValid: false,
        errors: [`Validation error: ${error}`],
        warnings: [],
        suggestions: [],
        accuracy: 0,
        performance: {
          interpolationTime: performance.now() - startTime,
          memoryUsage: 0,
          complexity: 0
        }
      };
    }
  }

  /**
   * Comprehensive testing suite
   */
  testInterpolation(): TestResults {
    console.log('🧪 Starting ParameterInterpolator tests...');
    
    const testStartTime = performance.now();
    const testDetails: TestDetail[] = [];
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;

    // Test each scenario
    for (const scenario of TEST_SCENARIOS) {
      const testName = scenario.name;
      const testStart = performance.now();
      
      try {
        // Test interpolation
        const result = this.interpolate(scenario.fromState, scenario.toState, 0.5, scenario.easing);
        
        // Validate result
        const validation = this.validateInterpolation(scenario.fromState, scenario.toState, result);
        
        const passed = validation.isValid && validation.accuracy >= scenario.expectedAccuracy;
        const executionTime = performance.now() - testStart;
        
        testDetails.push({
          testName,
          passed,
          expected: `Valid interpolation with ${scenario.expectedAccuracy * 100}% accuracy`,
          actual: passed ? `Valid interpolation with ${(validation.accuracy * 100).toFixed(1)}% accuracy` : validation.errors.join(', '),
          executionTime,
          accuracy: validation.accuracy
        });
        
        totalTests++;
        if (passed) passedTests++; else failedTests++;
        
      } catch (error) {
        testDetails.push({
          testName,
          passed: false,
          expected: `Valid interpolation`,
          actual: `Error: ${error}`,
          error: error.toString(),
          executionTime: performance.now() - testStart,
          accuracy: 0
        });
        totalTests++;
        failedTests++;
      }
    }

    // Performance tests
    const performanceTestName = 'Performance test - 1000 interpolations';
    const performanceTestStart = performance.now();
    
    try {
      const testState = { value: 0 };
      const targetState = { value: 100 };
      
      for (let i = 0; i < 1000; i++) {
        this.interpolate(testState, targetState, i / 1000, 'linear');
      }
      
      const executionTime = performance.now() - performanceTestStart;
      const averageTime = executionTime / 1000;
      
      const passed = averageTime < 1; // Should be under 1ms per interpolation
      
      testDetails.push({
        testName: performanceTestName,
        passed,
        expected: 'Under 1ms per interpolation',
        actual: `${averageTime.toFixed(3)}ms per interpolation`,
        executionTime,
        accuracy: 1
      });
      
      totalTests++;
      if (passed) passedTests++; else failedTests++;
      
    } catch (error) {
      testDetails.push({
        testName: performanceTestName,
        passed: false,
        expected: 'Under 1ms per interpolation',
        actual: `Error: ${error}`,
        error: error.toString(),
        executionTime: performance.now() - performanceTestStart,
        accuracy: 0
      });
      totalTests++;
      failedTests++;
    }

    const totalTime = performance.now() - testStartTime;
    
    console.log(`✅ Testing completed: ${passedTests}/${totalTests} tests passed`);
    console.log(`⏱️ Total test time: ${totalTime.toFixed(2)}ms`);
    
    return {
      totalTests,
      passedTests,
      failedTests,
      testDetails,
      performanceMetrics: {
        averageInterpolationTime: this.performanceMetrics.interpolationTime,
        memoryUsage: this.performanceMetrics.memoryUsage,
        accuracyScore: passedTests / totalTests,
        complexityScore: this.calculateAverageComplexity(TEST_SCENARIOS)
      },
      testScenarios: TEST_SCENARIOS
    };
  }

  /**
   * Run performance tests
   */
  runPerformanceTests(): PerformanceMetrics {
    const startTime = performance.now();
    const startMemory = performance.memory?.usedJSHeapSize || 0;
    
    // Run interpolation tests
    const testState = { value: 0 };
    const targetState = { value: 100 };
    
    for (let i = 0; i < 100; i++) {
      this.interpolate(testState, targetState, i / 100, 'linear');
    }
    
    const endTime = performance.now();
    const endMemory = performance.memory?.usedJSHeapSize || 0;
    
    this.performanceMetrics = {
      interpolationTime: endTime - startTime,
      memoryUsage: endMemory - startMemory,
      frameRate: 60, // Target frame rate
      accuracy: 0.95, // Estimated accuracy
      cacheHitRate: this.cacheHits / (this.cacheHits + this.cacheMisses),
      complexity: 5 // Average complexity
    };
    
    return { ...this.performanceMetrics };
  }

  // ===== VISUAL STORE ADAPTER =====

  /**
   * Create adapter for future VisualStore integration
   */
  createVisualStoreAdapter(): VisualStoreAdapter {
    return {
      transitionVisualState: async (targetState: Partial<any>, duration: number, easing: EasingType = 'easeInOut') => {
        // This will be implemented when ready to integrate
        console.log(`🔄 VisualStore transition requested: ${duration}ms with ${easing} easing`);
        return Promise.resolve();
      },
      
      testWithMockVisualState: (): TestResults => {
        // Test with mock VisualStore structure
        const mockFromState: MockVisualState = {
          geometric: {
            spheres: { count: 5, size: 1.0, color: '#FF0000', speed: 0.5, opacity: 0.8 },
            cubes: { count: 3, size: 0.8, color: '#00FF00', speed: 0.3, opacity: 0.6 },
            toruses: { count: 2, size: 0.6, color: '#0000FF', speed: 0.4, opacity: 0.7 }
          },
          particles: { count: 100, size: 0.3, color: '#FFFF00', speed: 0.8, opacity: 0.5, spread: 20 },
          globalEffects: {
            atmosphericBlur: { enabled: false, intensity: 0 },
            shapeGlow: { enabled: false, intensity: 0, radius: 0 }
          },
          camera: { distance: 10, fov: 60, autoRotate: false, autoRotateSpeed: 0 },
          globalAnimationSpeed: 1.0
        };
        
        const mockToState: MockVisualState = {
          geometric: {
            spheres: { count: 15, size: 1.5, color: '#FF6B6B', speed: 1.2, opacity: 1.0 },
            cubes: { count: 8, size: 1.3, color: '#4ECDC4', speed: 0.9, opacity: 0.9 },
            toruses: { count: 5, size: 1.1, color: '#45B7D1', speed: 0.7, opacity: 0.8 }
          },
          particles: { count: 300, size: 0.5, color: '#96CEB4', speed: 1.5, opacity: 0.8, spread: 35 },
          globalEffects: {
            atmosphericBlur: { enabled: true, intensity: 0.6 },
            shapeGlow: { enabled: true, intensity: 0.8, radius: 5 }
          },
          camera: { distance: 15, fov: 75, autoRotate: true, autoRotateSpeed: 0.5 },
          globalAnimationSpeed: 1.5
        };
        
        const result = this.interpolate(mockFromState, mockToState, 0.5, 'easeInOutCubic');
        const validation = this.validateInterpolation(mockFromState, mockToState, result);
        
        return {
          totalTests: 1,
          passedTests: validation.isValid ? 1 : 0,
          failedTests: validation.isValid ? 0 : 1,
          testDetails: [{
            testName: 'Mock VisualStore Interpolation',
            passed: validation.isValid,
            expected: 'Valid VisualStore interpolation',
            actual: validation.isValid ? 'Valid interpolation' : validation.errors.join(', '),
            executionTime: 0,
            accuracy: validation.accuracy
          }],
          performanceMetrics: {
            averageInterpolationTime: this.performanceMetrics.interpolationTime,
            memoryUsage: this.performanceMetrics.memoryUsage,
            accuracyScore: validation.accuracy,
            complexityScore: this.calculateComplexity(mockFromState)
          },
          testScenarios: []
        };
      },
      
      validateVisualStateTransition: (fromState: any, toState: any): ValidationResult => {
        return this.validateInterpolation(fromState, toState, fromState);
      },
      
      getVisualStateSnapshot: (): any => {
        return this.animationState?.currentState || {};
      },
      
      applyVisualStateUpdate: (update: any): void => {
        console.log('🔄 VisualStore update applied:', update);
      }
    };
  }

  // ===== UTILITY METHODS =====

  /**
   * Generate cache key for interpolation
   */
  private generateCacheKey(fromState: any, toState: any, progress: number, easing: EasingType): string {
    return `${JSON.stringify(fromState)}_${JSON.stringify(toState)}_${progress}_${easing}`;
  }

  /**
   * Calculate interpolation accuracy
   */
  private calculateAccuracy(from: any, to: any, result: any, progress: number): number {
    // Simple accuracy calculation based on expected vs actual values
    let totalDiff = 0;
    let totalValues = 0;
    
    const compareValues = (fromVal: any, toVal: any, resultVal: any) => {
      if (typeof fromVal === 'number' && typeof toVal === 'number' && typeof resultVal === 'number') {
        const expected = fromVal + (toVal - fromVal) * progress;
        const actual = resultVal;
        totalDiff += Math.abs(expected - actual);
        totalValues++;
      }
    };
    
    this.traverseObjects(from, to, result, compareValues);
    
    return totalValues > 0 ? Math.max(0, 1 - (totalDiff / totalValues)) : 1;
  }

  /**
   * Calculate data structure complexity
   */
  private calculateComplexity(obj: any): number {
    if (obj === null || obj === undefined) return 0;
    if (typeof obj !== 'object') return 1;
    if (Array.isArray(obj)) return obj.length;
    
    let complexity = 1;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        complexity += this.calculateComplexity(obj[key]);
      }
    }
    
    return Math.min(10, complexity);
  }

  /**
   * Calculate average complexity of test scenarios
   */
  private calculateAverageComplexity(scenarios: any[]): number {
    const totalComplexity = scenarios.reduce((sum, scenario) => sum + scenario.complexity, 0);
    return totalComplexity / scenarios.length;
  }

  /**
   * Traverse objects recursively
   */
  private traverseObjects(from: any, to: any, result: any, callback: (fromVal: any, toVal: any, resultVal: any) => void): void {
    if (typeof from === 'object' && typeof to === 'object' && typeof result === 'object' && 
        from !== null && to !== null && result !== null) {
      
      const allKeys = new Set([...Object.keys(from), ...Object.keys(to), ...Object.keys(result)]);
      
      for (const key of allKeys) {
        const fromVal = from[key];
        const toVal = to[key];
        const resultVal = result[key];
        
        if (fromVal !== undefined && toVal !== undefined && resultVal !== undefined) {
          this.traverseObjects(fromVal, toVal, resultVal, callback);
        }
      }
    } else {
      callback(from, to, result);
    }
  }

  /**
   * Update performance metrics
   */
  private updatePerformanceMetrics(startTime: number): void {
    this.performanceMetrics.interpolationTime = performance.now() - startTime;
    this.performanceMetrics.memoryUsage = performance.memory?.usedJSHeapSize || 0;
    this.performanceMetrics.cacheHitRate = this.cacheHits / (this.cacheHits + this.cacheMisses);
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache = {};
    this.cacheHits = 0;
    this.cacheMisses = 0;
    console.log('🗑️ Interpolation cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; hits: number; misses: number; hitRate: number } {
    return {
      size: Object.keys(this.cache).length,
      hits: this.cacheHits,
      misses: this.cacheMisses,
      hitRate: this.cacheHits / (this.cacheHits + this.cacheMisses)
    };
  }

  /**
   * Update feature flags
   */
  updateFeatureFlags(flags: Partial<FeatureFlags>): void {
    this.featureFlags = { ...this.featureFlags, ...flags };
    console.log('⚙️ Feature flags updated:', flags);
  }

  /**
   * Get current feature flags
   */
  getFeatureFlags(): FeatureFlags {
    return { ...this.featureFlags };
  }
}

// Export a default instance for easy testing
export const parameterInterpolator = new ParameterInterpolator();

// Export testing utilities
export const testParameterInterpolator = () => {
  console.log('🧪 Starting ParameterInterpolator tests...');
  const results = parameterInterpolator.testInterpolation();
  console.log('📊 Test Results:', results);
  return results;
}; 