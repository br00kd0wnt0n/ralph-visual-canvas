// ImprovedColorPresetGenerator.ts
// Enhanced preset generation with strong image color references

import { ImageContext, EnhancedColorPalette } from '../types/ContextTypes';
import { IMPROVED_PARAMETER_RANGES } from './ImprovedPresetParameters';

interface ColorMapping {
  shapes: {
    primary: string;
    secondary: string;
    accent: string;
  };
  particles: string;
  effects: {
    chromatic: {
      red: string;
      green: string;
      blue: string;
    };
    volumetric: string;
  };
}

export class ImprovedColorPresetGenerator {
  /**
   * Generate color mapping directly from image dominant colors
   * This ensures presets strongly reference the uploaded image
   */
  generateColorMapping(context: ImageContext): ColorMapping {
    const { dominantColors } = context;
    
    // Ensure we have at least 3 colors, fill with variations if needed
    const colors = [...dominantColors];
    while (colors.length < 5) {
      const baseColor = colors[0];
      colors.push(this.adjustBrightness(baseColor, colors.length * 0.2));
    }
    
    return {
      shapes: {
        primary: colors[0],    // Most dominant color
        secondary: colors[1],  // Second dominant
        accent: colors[2]      // Third dominant
      },
      particles: this.adjustBrightness(colors[0], 0.3), // Brighter version for visibility
      effects: {
        chromatic: {
          red: this.shiftHue(colors[0], -30),
          green: colors[1],
          blue: this.shiftHue(colors[2], 30)
        },
        volumetric: colors[3] || colors[0]
      }
    };
  }

  /**
   * Apply image colors to preset with cloud preset patterns
   */
  applyColorsToPreset(preset: any, colorMapping: ColorMapping, context: ImageContext) {
    const ranges = IMPROVED_PARAMETER_RANGES;
    
    // Based on cloud preset analysis, apply colors strongly
    preset.geometric = {
      spheres: {
        ...preset.geometric.spheres,
        color: colorMapping.shapes.primary,
        count: Math.floor(8 + context.complexity * 15), // 8-23 range
        size: 1.2 + context.complexity * 3, // 1.2-4.2 range
      },
      cubes: {
        ...preset.geometric.cubes,
        color: colorMapping.shapes.secondary,
        count: Math.floor(5 + context.complexity * 12), // 5-17 range
        size: 1.5 + context.complexity * 2.5, // 1.5-4.0 range
      },
      toruses: {
        ...preset.geometric.toruses,
        color: colorMapping.shapes.accent,
        count: Math.floor(4 + context.complexity * 8), // 4-12 range
        size: 2.0 + context.complexity * 3, // 2.0-5.0 range
      },
      blobs: {
        ...preset.geometric.blobs,
        color: this.adjustBrightness(colorMapping.shapes.primary, -0.3), // Darker variant
        count: Math.floor(3 + context.complexity * 6), // 3-9 range
        size: 1.8 + context.complexity * 2, // 1.8-3.8 range
      }
    };
    
    // Apply to particles with appropriate sizing
    preset.particles = {
      ...preset.particles,
      color: colorMapping.particles,
      count: Math.floor(200 + context.complexity * 600), // 200-800 range
      size: 0.2 + (1 - context.complexity) * 1.5, // Smaller when more particles
    };
    
    // Apply to effects for cohesive look
    preset.globalEffects = {
      ...preset.globalEffects,
      chromatic: {
        ...preset.globalEffects.chromatic,
        enabled: true,
        aberration: 3.0 + context.complexity * 3.0, // 3.0-6.0 range
        aberrationColors: colorMapping.effects.chromatic
      },
      volumetric: {
        ...preset.globalEffects.volumetric,
        color: colorMapping.effects.volumetric
      },
      shapeGlow: {
        ...preset.globalEffects.shapeGlow,
        enabled: true,
        intensity: 0.4 + context.complexity * 0.3,
        useObjectColor: true // Use shape colors for glow
      }
    };
    
    // Enable trails for movement (from cloud preset patterns)
    if (context.complexity > 0.5) {
      preset.globalEffects.trails = {
        enabled: true,
        sphereTrails: { enabled: true, length: 150, opacity: 0.6 },
        cubeTrails: { enabled: true, length: 120, opacity: 0.5 },
        particleTrails: { enabled: true, length: 200, opacity: 0.4 }
      };
    }
    
    return preset;
  }

  /**
   * Utility functions for color manipulation
   */
  private hexToRgb(hex: string): { r: number, g: number, b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  adjustBrightness(color: string, factor: number): string {
    const rgb = this.hexToRgb(color);
    const adjust = (val: number) => Math.min(255, Math.max(0, val + (factor * 255)));
    return this.rgbToHex(
      Math.round(adjust(rgb.r)),
      Math.round(adjust(rgb.g)),
      Math.round(adjust(rgb.b))
    );
  }

  shiftHue(color: string, degrees: number): string {
    const rgb = this.hexToRgb(color);
    // Convert to HSL, shift hue, convert back
    // Simplified version - in production use proper color library
    const shifted = {
      r: Math.min(255, Math.max(0, rgb.r + degrees)),
      g: Math.min(255, Math.max(0, rgb.g - degrees/2)),
      b: Math.min(255, Math.max(0, rgb.b + degrees/2))
    };
    return this.rgbToHex(shifted.r, shifted.g, shifted.b);
  }
}

// Export singleton instance
export const improvedColorPresetGenerator = new ImprovedColorPresetGenerator();