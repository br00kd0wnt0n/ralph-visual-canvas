// InterpolationTypes.ts
// Type definitions for the isolated parameter interpolation system
// Generic support for any data structure with comprehensive interpolation capabilities

export type EasingType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'easeOutCubic' | 'easeInCubic' | 'easeInOutCubic' | 'bounce' | 'elastic';

export interface InterpolationConfig {
  duration: number;           // Animation duration in milliseconds
  easing: EasingType;        // Easing function to use
  fps: number;               // Target frames per second
  autoStart: boolean;        // Whether to start animation immediately
  onStart?: () => void;      // Callback when animation starts
  onUpdate?: (progress: number, currentState: any) => void; // Progress callback
  onComplete?: () => void;   // Callback when animation completes
  onError?: (error: Error) => void; // Error callback
}

export interface AnimationState {
  isRunning: boolean;
  startTime: number;
  duration: number;
  progress: number;
  currentState: any;
  fromState: any;
  toState: any;
  easing: EasingType;
  fps: number;
  frameCount: number;
  lastFrameTime: number;
}

export interface InterpolationResult<T> {
  interpolatedState: T;
  progress: number;
  easingValue: number;
  timestamp: number;
  isValid: boolean;
  warnings: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  accuracy: number; // 0-1, how accurate the interpolation is
  performance: {
    interpolationTime: number;
    memoryUsage: number;
    complexity: number; // 1-10, how complex the data structure is
  };
}

export interface TestResults {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  testDetails: TestDetail[];
  performanceMetrics: {
    averageInterpolationTime: number;
    memoryUsage: number;
    accuracyScore: number;
    complexityScore: number;
  };
  testScenarios: TestScenario[];
}

export interface TestDetail {
  testName: string;
  passed: boolean;
  expected: any;
  actual: any;
  error?: string;
  executionTime: number;
  accuracy: number;
}

export interface TestScenario {
  name: string;
  description: string;
  fromState: any;
  toState: any;
  duration: number;
  easing: EasingType;
  expectedAccuracy: number;
  complexity: number;
}

export interface PerformanceMetrics {
  interpolationTime: number;
  memoryUsage: number;
  frameRate: number;
  accuracy: number;
  cacheHitRate: number;
  complexity: number;
}

export interface ColorInterpolation {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface HSLInterpolation {
  h: number;
  s: number;
  l: number;
  a?: number;
}

export interface EasingFunction {
  name: string;
  description: string;
  function: (t: number) => number;
  useCases: string[];
}

export interface InterpolationCache {
  [key: string]: {
    result: any;
    timestamp: number;
    usageCount: number;
    accuracy: number;
  };
}

export interface VisualStoreAdapter {
  // Future integration with VisualStore
  transitionVisualState(targetState: Partial<any>, duration: number, easing?: EasingType): Promise<void>;
  testWithMockVisualState(): TestResults;
  validateVisualStateTransition(fromState: any, toState: any): ValidationResult;
  getVisualStateSnapshot(): any;
  applyVisualStateUpdate(update: any): void;
}

export interface MockVisualState {
  // Mock structure for testing future VisualStore integration
  geometric: {
    spheres: {
      count: number;
      size: number;
      color: string;
      speed: number;
      opacity: number;
    };
    cubes: {
      count: number;
      size: number;
      color: string;
      speed: number;
      opacity: number;
    };
    toruses: {
      count: number;
      size: number;
      color: string;
      speed: number;
      opacity: number;
    };
  };
  particles: {
    count: number;
    size: number;
    color: string;
    speed: number;
    opacity: number;
    spread: number;
  };
  globalEffects: {
    atmosphericBlur: {
      enabled: boolean;
      intensity: number;
    };
    shapeGlow: {
      enabled: boolean;
      intensity: number;
      radius: number;
    };
  };
  camera: {
    distance: number;
    fov: number;
    autoRotate: boolean;
    autoRotateSpeed: number;
  };
  globalAnimationSpeed: number;
}

// Easing function definitions
export const EASING_FUNCTIONS: Record<EasingType, EasingFunction> = {
  linear: {
    name: 'Linear',
    description: 'Constant rate of change',
    function: (t: number) => t,
    useCases: ['mechanical', 'uniform', 'predictable']
  },
  easeIn: {
    name: 'Ease In',
    description: 'Slow start, accelerate',
    function: (t: number) => t * t,
    useCases: ['entering', 'appearing', 'building up']
  },
  easeOut: {
    name: 'Ease Out',
    description: 'Fast start, decelerate',
    function: (t: number) => 1 - Math.pow(1 - t, 2),
    useCases: ['exiting', 'settling', 'winding down']
  },
  easeInOut: {
    name: 'Ease In Out',
    description: 'Slow start and end, fast middle',
    function: (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    useCases: ['natural', 'organic', 'smooth transitions']
  },
  easeOutCubic: {
    name: 'Ease Out Cubic',
    description: 'Smooth deceleration curve',
    function: (t: number) => 1 - Math.pow(1 - t, 3),
    useCases: ['smooth', 'elegant', 'professional']
  },
  easeInCubic: {
    name: 'Ease In Cubic',
    description: 'Smooth acceleration curve',
    function: (t: number) => t * t * t,
    useCases: ['powerful', 'dramatic', 'building tension']
  },
  easeInOutCubic: {
    name: 'Ease In Out Cubic',
    description: 'Smooth acceleration and deceleration',
    function: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    useCases: ['premium', 'high-quality', 'cinematic']
  },
  bounce: {
    name: 'Bounce',
    description: 'Bouncy elastic effect',
    function: (t: number) => {
      if (t < 1 / 2.75) {
        return 7.5625 * t * t;
      } else if (t < 2 / 2.75) {
        return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
      } else if (t < 2.5 / 2.75) {
        return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
      } else {
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
      }
    },
    useCases: ['playful', 'energetic', 'attention-grabbing']
  },
  elastic: {
    name: 'Elastic',
    description: 'Elastic spring effect',
    function: (t: number) => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
    },
    useCases: ['springy', 'responsive', 'dynamic']
  }
};

// Test scenarios for comprehensive testing
export const TEST_SCENARIOS: TestScenario[] = [
  {
    name: 'Simple Number Interpolation',
    description: 'Basic numeric value interpolation',
    fromState: { value: 0 },
    toState: { value: 100 },
    duration: 1000,
    easing: 'linear',
    expectedAccuracy: 0.99,
    complexity: 1
  },
  {
    name: 'Color Interpolation',
    description: 'RGB color interpolation',
    fromState: { color: '#FF0000' },
    toState: { color: '#00FF00' },
    duration: 1000,
    easing: 'easeInOut',
    expectedAccuracy: 0.95,
    complexity: 3
  },
  {
    name: 'Nested Object Interpolation',
    description: 'Complex nested object structure',
    fromState: {
      geometric: {
        spheres: { count: 5, size: 1.0, speed: 0.5 },
        cubes: { count: 3, size: 0.8, speed: 0.3 }
      }
    },
    toState: {
      geometric: {
        spheres: { count: 10, size: 1.5, speed: 1.0 },
        cubes: { count: 6, size: 1.2, speed: 0.8 }
      }
    },
    duration: 2000,
    easing: 'easeInOutCubic',
    expectedAccuracy: 0.90,
    complexity: 7
  },
  {
    name: 'Array Interpolation',
    description: 'Array element-wise interpolation',
    fromState: { positions: [0, 0, 0] },
    toState: { positions: [100, 200, 300] },
    duration: 1500,
    easing: 'easeOutCubic',
    expectedAccuracy: 0.98,
    complexity: 4
  },
  {
    name: 'Mixed Type Interpolation',
    description: 'Mixed numbers, strings, booleans, and objects',
    fromState: {
      count: 0,
      enabled: false,
      color: '#000000',
      config: { opacity: 0, scale: 0.5 }
    },
    toState: {
      count: 100,
      enabled: true,
      color: '#FFFFFF',
      config: { opacity: 1, scale: 1.5 }
    },
    duration: 2500,
    easing: 'bounce',
    expectedAccuracy: 0.85,
    complexity: 8
  },
  {
    name: 'Visual State Mock',
    description: 'Complete VisualStore mock structure',
    fromState: {
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
    },
    toState: {
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
    },
    duration: 3000,
    easing: 'easeInOutCubic',
    expectedAccuracy: 0.88,
    complexity: 10
  }
];

// Utility types for internal use
export type InterpolatableValue = number | string | boolean | ColorInterpolation | HSLInterpolation | any[];
export type InterpolatableObject = Record<string, InterpolatableValue | Record<string, any>>;

// Feature flag for controlled activation
export interface FeatureFlags {
  enableAdvancedInterpolation: boolean;
  enableColorInterpolation: boolean;
  enablePerformanceOptimization: boolean;
  enableCaching: boolean;
  enableValidation: boolean;
  enableLogging: boolean;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  enableAdvancedInterpolation: true,
  enableColorInterpolation: true,
  enablePerformanceOptimization: true,
  enableCaching: true,
  enableValidation: true,
  enableLogging: true
}; 