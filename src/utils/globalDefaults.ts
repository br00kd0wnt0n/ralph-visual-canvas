// Global Defaults Management Utility
// This file provides easy access to global defaults and utility functions
//
// IMPORTANT: Global Defaults Protection System
// ============================================
// The global defaults system ensures that your preferred visual settings
// always take precedence over AI-generated changes. Here's how it works:
//
// 1. PERSISTENCE: Defaults are saved to localStorage and persist across sessions
// 2. PROTECTION: AI functions use applyAIAnalysisToVisualStoreWithDefaults() which
//    respects global defaults for critical parameters like camera and visual effects
// 3. OVERRIDE: The forceApplyGlobalDefaults() function can override any AI changes
// 4. PRIORITY: Global defaults are applied first, then AI can suggest specific overrides
//
// Protected Parameters:
// - Camera settings (distance, fov, position, etc.)
// - Visual effects (vignette, glow, contrast, saturation, brightness)
// - Performance settings (targetFPS, maxParticles, etc.)
// - Quality settings (antialiasing, shadows, etc.)
//
// AI-Controlled Parameters:
// - Colors and color palettes
// - Geometric shape properties
// - Particle systems
// - Special effects (wave interference, metamorphosis, fireflies)
// - Global effects (atmospheric blur, distortion, etc.)

import { GLOBAL_DEFAULTS } from '../store/visualStore';

// Export the global defaults for easy access
export { GLOBAL_DEFAULTS };

// Utility functions for managing defaults
export const GlobalDefaultsManager = {
  // Get current global defaults
  getDefaults: () => GLOBAL_DEFAULTS,
  
  // Get specific category defaults
  getCameraDefaults: () => GLOBAL_DEFAULTS.camera,
  getPerformanceDefaults: () => GLOBAL_DEFAULTS.performance,
  getQualityDefaults: () => GLOBAL_DEFAULTS.quality,
  getAnimationDefaults: () => GLOBAL_DEFAULTS.animation,
  getVisualDefaults: () => GLOBAL_DEFAULTS.visual,
  
  // Update global defaults
  updateCameraDefaults: (updates: Partial<typeof GLOBAL_DEFAULTS.camera>) => {
    Object.assign(GLOBAL_DEFAULTS.camera, updates);
  },
  
  updatePerformanceDefaults: (updates: Partial<typeof GLOBAL_DEFAULTS.performance>) => {
    Object.assign(GLOBAL_DEFAULTS.performance, updates);
  },
  
  updateQualityDefaults: (updates: Partial<typeof GLOBAL_DEFAULTS.quality>) => {
    Object.assign(GLOBAL_DEFAULTS.quality, updates);
  },
  
  updateAnimationDefaults: (updates: Partial<typeof GLOBAL_DEFAULTS.animation>) => {
    Object.assign(GLOBAL_DEFAULTS.animation, updates);
  },
  
  updateVisualDefaults: (updates: Partial<typeof GLOBAL_DEFAULTS.visual>) => {
    Object.assign(GLOBAL_DEFAULTS.visual, updates);
  },
  
  // Reset all defaults to initial values
  resetAllDefaults: () => {
    // Reset camera defaults
    Object.assign(GLOBAL_DEFAULTS.camera, {
      distance: 12,
      height: 2,
      fov: 60,
      position: [0, 2, 12] as [number, number, number],
      target: [0, 0, 0] as [number, number, number],
      rotation: { x: 0, y: 0, z: 0 },
      autoRotate: false,
      autoRotateSpeed: 0.5,
      damping: 0.05,
      enableZoom: true,
      enablePan: true,
      enableRotate: true,
      minDistance: 5,
      maxDistance: 50,
      minPolarAngle: 0,
      maxPolarAngle: Math.PI,
      depthOfField: {
        enabled: false,
        focusDistance: 10,
        focalLength: 50,
        bokehScale: 1,
        blur: 0.5
      }
    });
    
    // Reset performance defaults
    Object.assign(GLOBAL_DEFAULTS.performance, {
      targetFPS: 60,
      enableVSync: true,
      maxParticles: 1000,
      maxShapes: 100,
      enableFrustumCulling: true,
      enableLOD: true
    });
    
    // Reset quality defaults
    Object.assign(GLOBAL_DEFAULTS.quality, {
      antialiasing: true,
      shadows: true,
      reflections: true,
      postProcessing: true,
      bloom: true,
      motionBlur: false
    });
    
    // Reset animation defaults
    Object.assign(GLOBAL_DEFAULTS.animation, {
      defaultSpeed: 0.1,
    });
    
    // Reset visual defaults
    Object.assign(GLOBAL_DEFAULTS.visual, {
      vignette: 0.15,
      glow: 0.6,
      contrast: 1.2,
      saturation: 1.5,
      brightness: 1.1,
      bloom: true,
      chromaticAberration: 0.0,
      motionBlur: false
    });
    
    // Reset logo defaults
    Object.assign(GLOBAL_DEFAULTS.logo, {
      enabled: false,
      size: 120,
      position: {
        x: 'center' as const,
        y: 'top' as const
      },
      offset: {
        x: 0,
        y: 20
      },
      opacity: 0.8,
      animation: {
        enabled: true,
        type: 'pulse' as const,
        speed: 1.0
      }
    });
  },
  
  // Save defaults to localStorage
  saveDefaults: () => {
    try {
      localStorage.setItem('globalDefaults', JSON.stringify(GLOBAL_DEFAULTS));
    } catch (error) {
      console.warn('Failed to save global defaults:', error);
    }
  },
  
  // Load defaults from localStorage
  loadDefaults: () => {
    try {
      const saved = localStorage.getItem('globalDefaults');
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(GLOBAL_DEFAULTS, parsed);
      }
    } catch (error) {
      console.warn('Failed to load global defaults:', error);
    }
  }
};

// Predefined camera presets
export const CameraPresets = {
  cinematic: {
    distance: 15,
    height: 3,
    fov: 45,
    position: [0, 3, 15] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
    rotation: { x: -0.1, y: 0, z: 0 },
    autoRotate: false,
    autoRotateSpeed: 0.5,
    damping: 0.1,
    enableZoom: true,
    enablePan: true,
    enableRotate: true,
    minDistance: 8,
    maxDistance: 30,
    minPolarAngle: 0,
    maxPolarAngle: Math.PI,
    depthOfField: {
      enabled: true,
      focusDistance: 15,
      focalLength: 85,
      bokehScale: 2,
      blur: 0.8
    }
  },
  
  closeUp: {
    distance: 8,
    height: 1,
    fov: 75,
    position: [0, 1, 8] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
    rotation: { x: 0, y: 0, z: 0 },
    autoRotate: false,
    autoRotateSpeed: 0.5,
    damping: 0.05,
    enableZoom: true,
    enablePan: true,
    enableRotate: true,
    minDistance: 3,
    maxDistance: 15,
    minPolarAngle: 0,
    maxPolarAngle: Math.PI,
    depthOfField: {
      enabled: true,
      focusDistance: 8,
      focalLength: 50,
      bokehScale: 1.5,
      blur: 1.2
    }
  },
  
  wideAngle: {
    distance: 20,
    height: 5,
    fov: 90,
    position: [0, 5, 20] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
    rotation: { x: -0.2, y: 0, z: 0 },
    autoRotate: false,
    autoRotateSpeed: 0.5,
    damping: 0.05,
    enableZoom: true,
    enablePan: true,
    enableRotate: true,
    minDistance: 10,
    maxDistance: 50,
    minPolarAngle: 0,
    maxPolarAngle: Math.PI,
    depthOfField: {
      enabled: false,
      focusDistance: 20,
      focalLength: 35,
      bokehScale: 0.5,
      blur: 0.3
    }
  },
  
  orbiting: {
    distance: 12,
    height: 2,
    fov: 60,
    position: [0, 2, 12] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
    rotation: { x: 0, y: 0, z: 0 },
    autoRotate: true,
    autoRotateSpeed: 1.0,
    damping: 0.05,
    enableZoom: true,
    enablePan: true,
    enableRotate: true,
    minDistance: 5,
    maxDistance: 30,
    minPolarAngle: 0,
    maxPolarAngle: Math.PI,
    depthOfField: {
      enabled: false,
      focusDistance: 12,
      focalLength: 50,
      bokehScale: 1,
      blur: 0.5
    }
  }
};

// Export types for TypeScript
export type GlobalDefaults = typeof GLOBAL_DEFAULTS;
export type CameraDefaults = typeof GLOBAL_DEFAULTS.camera;
export type PerformanceDefaults = typeof GLOBAL_DEFAULTS.performance;
export type QualityDefaults = typeof GLOBAL_DEFAULTS.quality;
export type AnimationDefaults = typeof GLOBAL_DEFAULTS.animation;
export type VisualDefaults = typeof GLOBAL_DEFAULTS.visual; 