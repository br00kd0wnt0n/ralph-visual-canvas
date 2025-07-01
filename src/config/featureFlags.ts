// featureFlags.ts
// Comprehensive feature flag system for enhanced AI features
// Provides safe, controlled integration with zero production impact

export interface FeatureFlags {
  // Master controls
  enableEnhancedAI: boolean;
  enableDevelopmentMode: boolean;
  
  // Individual enhanced features
  enableAdvancedColorHarmony: boolean;
  enableSmoothTransitions: boolean;
  enableContextAnalysis: boolean;
  enableAdvancedPresets: boolean;
  enablePresetScoring: boolean;
  
  // Integration controls
  enableAIIntegration: boolean;
  enableVisualStoreIntegration: boolean;
  enableRealTimeUpdates: boolean;
  
  // Development features
  enablePerformanceMonitoring: boolean;
  enableDetailedLogging: boolean;
  enableTestingUI: boolean;
}

export interface FeatureConfig {
  flags: FeatureFlags;
  version: string;
  lastUpdated: Date;
  environment: 'development' | 'staging' | 'production';
  metadata: {
    buildNumber: string;
    commitHash: string;
    deploymentTime: Date;
  };
}

export interface FeatureFlagChange {
  flag: keyof FeatureFlags;
  oldValue: boolean;
  newValue: boolean;
  timestamp: Date;
  reason?: string;
  userId?: string;
}

export interface FeatureFlagHistory {
  changes: FeatureFlagChange[];
  totalChanges: number;
  lastChange: Date;
}

// Default feature flags - all enhanced features disabled in production
export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  // Master controls - disabled by default
  enableEnhancedAI: false,
  enableDevelopmentMode: false,
  
  // Individual enhanced features - disabled by default
  enableAdvancedColorHarmony: false,
  enableSmoothTransitions: false,
  enableContextAnalysis: false,
  enableAdvancedPresets: false,
  enablePresetScoring: false,
  
  // Integration controls - disabled by default
  enableAIIntegration: false,
  enableVisualStoreIntegration: false,
  enableRealTimeUpdates: false,
  
  // Development features - disabled by default
  enablePerformanceMonitoring: false,
  enableDetailedLogging: false,
  enableTestingUI: false,
};

// Development feature flags - enhanced features enabled for testing
export const DEVELOPMENT_FEATURE_FLAGS: FeatureFlags = {
  // Master controls - enabled for development
  enableEnhancedAI: true,
  enableDevelopmentMode: true,
  
  // Individual enhanced features - enabled for testing
  enableAdvancedColorHarmony: true,
  enableSmoothTransitions: true,
  enableContextAnalysis: true,
  enableAdvancedPresets: true,
  enablePresetScoring: true,
  
  // Integration controls - enabled for development
  enableAIIntegration: true,
  enableVisualStoreIntegration: true,
  enableRealTimeUpdates: true,
  
  // Development features - enabled for debugging
  enablePerformanceMonitoring: true,
  enableDetailedLogging: true,
  enableTestingUI: true,
};

// Staging feature flags - selective testing
export const STAGING_FEATURE_FLAGS: FeatureFlags = {
  // Master controls - enabled for staging
  enableEnhancedAI: true,
  enableDevelopmentMode: false,
  
  // Individual enhanced features - selective testing
  enableAdvancedColorHarmony: true,
  enableSmoothTransitions: true,
  enableContextAnalysis: false, // Disabled for initial testing
  enableAdvancedPresets: true,
  enablePresetScoring: false, // Disabled for initial testing
  
  // Integration controls - selective testing
  enableAIIntegration: true,
  enableVisualStoreIntegration: false, // Disabled for initial testing
  enableRealTimeUpdates: true,
  
  // Development features - minimal for staging
  enablePerformanceMonitoring: true,
  enableDetailedLogging: false,
  enableTestingUI: false,
};

class FeatureFlagManager {
  private flags: FeatureFlags;
  private config: FeatureConfig;
  private history: FeatureFlagHistory;
  private listeners: Map<string, Set<(flags: FeatureFlags) => void>>;
  private performanceMetrics: Map<string, number[]>;

  constructor(environment: 'development' | 'staging' | 'production' = 'production') {
    this.flags = this.getDefaultFlags(environment);
    this.config = this.createConfig(environment);
    this.history = { changes: [], totalChanges: 0, lastChange: new Date() };
    this.listeners = new Map();
    this.performanceMetrics = new Map();
    
    console.log(`🚩 FeatureFlagManager initialized for ${environment} environment`);
    console.log(`🎛️ Enhanced AI: ${this.flags.enableEnhancedAI ? 'ENABLED' : 'DISABLED'}`);
  }

  /**
   * Get current feature flags
   */
  getFlags(): FeatureFlags {
    return { ...this.flags };
  }

  /**
   * Get specific feature flag
   */
  getFlag<K extends keyof FeatureFlags>(flag: K): FeatureFlags[K] {
    return this.flags[flag];
  }

  /**
   * Set specific feature flag
   */
  setFlag<K extends keyof FeatureFlags>(flag: K, value: FeatureFlags[K], reason?: string): void {
    const oldValue = this.flags[flag];
    this.flags[flag] = value;
    
    // Record change
    const change: FeatureFlagChange = {
      flag,
      oldValue: oldValue as boolean,
      newValue: value as boolean,
      timestamp: new Date(),
      reason
    };
    
    this.history.changes.push(change);
    this.history.totalChanges++;
    this.history.lastChange = new Date();
    
    // Notify listeners
    this.notifyListeners(flag);
    
    console.log(`🚩 Feature flag changed: ${flag} = ${value}${reason ? ` (${reason})` : ''}`);
  }

  /**
   * Set multiple feature flags at once
   */
  setFlags(flags: Partial<FeatureFlags>, reason?: string): void {
    Object.entries(flags).forEach(([key, value]) => {
      this.setFlag(key as keyof FeatureFlags, value as boolean, reason);
    });
  }

  /**
   * Reset all flags to defaults
   */
  resetToDefaults(environment: 'development' | 'staging' | 'production' = 'production'): void {
    this.flags = this.getDefaultFlags(environment);
    this.config = this.createConfig(environment);
    this.notifyAllListeners();
    console.log(`🔄 Feature flags reset to ${environment} defaults`);
  }

  /**
   * Check if enhanced AI is enabled
   */
  isEnhancedAIEnabled(): boolean {
    return this.flags.enableEnhancedAI;
  }

  /**
   * Check if development mode is enabled
   */
  isDevelopmentMode(): boolean {
    return this.flags.enableDevelopmentMode;
  }

  /**
   * Check if specific feature is enabled
   */
  isFeatureEnabled(feature: keyof FeatureFlags): boolean {
    return this.flags[feature];
  }

  /**
   * Subscribe to feature flag changes
   */
  subscribe(flag: keyof FeatureFlags, callback: (flags: FeatureFlags) => void): () => void {
    if (!this.listeners.has(flag)) {
      this.listeners.set(flag, new Set());
    }
    
    this.listeners.get(flag)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.get(flag)?.delete(callback);
    };
  }

  /**
   * Subscribe to all feature flag changes
   */
  subscribeToAll(callback: (flags: FeatureFlags) => void): () => void {
    const unsubscribeFunctions: (() => void)[] = [];
    
    Object.keys(this.flags).forEach(flag => {
      const unsubscribe = this.subscribe(flag as keyof FeatureFlags, callback);
      unsubscribeFunctions.push(unsubscribe);
    });
    
    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
  }

  /**
   * Record performance metric for a feature
   */
  recordPerformanceMetric(feature: string, duration: number): void {
    if (!this.performanceMetrics.has(feature)) {
      this.performanceMetrics.set(feature, []);
    }
    
    this.performanceMetrics.get(feature)!.push(duration);
    
    // Keep only last 100 metrics
    if (this.performanceMetrics.get(feature)!.length > 100) {
      this.performanceMetrics.get(feature)!.shift();
    }
  }

  /**
   * Get performance metrics for a feature
   */
  getPerformanceMetrics(feature: string): {
    average: number;
    min: number;
    max: number;
    count: number;
  } {
    const metrics = this.performanceMetrics.get(feature) || [];
    
    if (metrics.length === 0) {
      return { average: 0, min: 0, max: 0, count: 0 };
    }
    
    const sum = metrics.reduce((acc, val) => acc + val, 0);
    const average = sum / metrics.length;
    const min = Math.min(...metrics);
    const max = Math.max(...metrics);
    
    return { average, min, max, count: metrics.length };
  }

  /**
   * Get feature flag history
   */
  getHistory(): FeatureFlagHistory {
    return { ...this.history };
  }

  /**
   * Get current configuration
   */
  getConfig(): FeatureConfig {
    return { ...this.config };
  }

  /**
   * Export current state for debugging
   */
  exportState(): {
    flags: FeatureFlags;
    config: FeatureConfig;
    history: FeatureFlagHistory;
    performanceMetrics: Record<string, { average: number; min: number; max: number; count: number }>;
  } {
    const performanceData: Record<string, { average: number; min: number; max: number; count: number }> = {};
    
    this.performanceMetrics.forEach((metrics, feature) => {
      performanceData[feature] = this.getPerformanceMetrics(feature);
    });
    
    return {
      flags: this.getFlags(),
      config: this.getConfig(),
      history: this.getHistory(),
      performanceMetrics: performanceData
    };
  }

  /**
   * Validate feature flag dependencies
   */
  validateDependencies(): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // Check if individual features are enabled when master control is disabled
    if (!this.flags.enableEnhancedAI) {
      const enabledFeatures = Object.entries(this.flags)
        .filter(([key, value]) => key !== 'enableEnhancedAI' && value === true)
        .map(([key]) => key);
      
      if (enabledFeatures.length > 0) {
        issues.push(`Enhanced AI is disabled but features are enabled: ${enabledFeatures.join(', ')}`);
      }
    }
    
    // Check if development features are enabled in production
    if (this.config.environment === 'production') {
      if (this.flags.enableDevelopmentMode) {
        issues.push('Development mode should not be enabled in production');
      }
      if (this.flags.enableTestingUI) {
        issues.push('Testing UI should not be enabled in production');
      }
    }
    
    return {
      valid: issues.length === 0,
      issues
    };
  }

  // Private helper methods

  private getDefaultFlags(environment: string): FeatureFlags {
    switch (environment) {
      case 'development':
        return { ...DEVELOPMENT_FEATURE_FLAGS };
      case 'staging':
        return { ...STAGING_FEATURE_FLAGS };
      case 'production':
      default:
        return { ...DEFAULT_FEATURE_FLAGS };
    }
  }

  private createConfig(environment: 'development' | 'staging' | 'production'): FeatureConfig {
    return {
      flags: this.flags,
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      lastUpdated: new Date(),
      environment,
      metadata: {
        buildNumber: process.env.NEXT_PUBLIC_BUILD_NUMBER || 'dev',
        commitHash: process.env.NEXT_PUBLIC_COMMIT_HASH || 'unknown',
        deploymentTime: new Date()
      }
    };
  }

  private notifyListeners(flag: keyof FeatureFlags): void {
    this.listeners.get(flag)?.forEach(callback => {
      try {
        callback(this.getFlags());
      } catch (error) {
        console.error(`Error in feature flag listener for ${flag}:`, error);
      }
    });
  }

  private notifyAllListeners(): void {
    Object.keys(this.flags).forEach(flag => {
      this.notifyListeners(flag as keyof FeatureFlags);
    });
  }
}

// Global feature flag manager instance
let globalFeatureFlagManager: FeatureFlagManager | null = null;

/**
 * Get or create global feature flag manager
 */
export function getFeatureFlagManager(environment?: 'development' | 'staging' | 'production'): FeatureFlagManager {
  if (!globalFeatureFlagManager) {
    const env = environment || (process.env.NODE_ENV === 'development' ? 'development' : 'production');
    globalFeatureFlagManager = new FeatureFlagManager(env);
  }
  return globalFeatureFlagManager;
}

/**
 * Initialize feature flags from environment variables
 */
export function initializeFeatureFlags(): void {
  const manager = getFeatureFlagManager();
  
  // Override flags from environment variables
  Object.keys(DEFAULT_FEATURE_FLAGS).forEach(flag => {
    const envKey = `NEXT_PUBLIC_FEATURE_${flag.toUpperCase()}`;
    const envValue = process.env[envKey];
    
    if (envValue !== undefined) {
      const boolValue = envValue.toLowerCase() === 'true';
      manager.setFlag(flag as keyof FeatureFlags, boolValue, `Environment variable: ${envKey}`);
    }
  });
  
  // Validate dependencies
  const validation = manager.validateDependencies();
  if (!validation.valid) {
    console.warn('⚠️ Feature flag validation issues:', validation.issues);
  }
}

// Initialize on module load
if (typeof window !== 'undefined') {
  initializeFeatureFlags();
}

export { FeatureFlagManager }; 