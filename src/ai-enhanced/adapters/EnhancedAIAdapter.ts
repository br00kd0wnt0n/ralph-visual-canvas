// Enhanced AI Store Adapter
// Bridges between Enhanced AI system and visual store using unified type system
// Provides color harmony and parameter interpolation capabilities

import type { 
  VisualState, 
  EnhancedColorPalette, 
  ColorHarmonyConfig,
  ColorAnalysis,
  PerformanceMetrics,
  ColorValidationResult
} from '../../types/unified';
import { TypeMapper, TypeValidator, HARMONY_RULES, COLOR_TEMPERATURES } from '../../types/unified';

export class EnhancedAIAdapter {
  /**
   * Map Enhanced Color Palette to store properties
   * Converts EnhancedColorPalette to partial VisualState updates
   */
  static mapColorPaletteToStore(palette: EnhancedColorPalette): Partial<VisualState> {
    // Validate input
    if (!TypeValidator.validateEnhancedColorPalette(palette)) {
      console.warn('EnhancedAIAdapter: Invalid enhanced color palette');
      return {};
    }

    // Map colors to geometric shapes
    const colorUpdates = {
      geometric: {
        spheres: { 
          color: palette.primary,
          count: 20,
          size: 1,
          speed: 1,
          rotation: 0,
          opacity: 0.8,
          organicness: 0.5,
          movementPattern: 'orbit' as const,
          distance: 1.5,
          pulseEnabled: false,
          pulseSize: 1
        },
        cubes: { 
          color: palette.secondary,
          count: 15,
          size: 1,
          rotation: 0,
          speed: 1,
          opacity: 0.8,
          organicness: 0.5,
          movementPattern: 'orbit' as const,
          distance: 1.5,
          pulseEnabled: false,
          pulseSize: 1
        },
        toruses: { 
          color: palette.accent,
          count: 10,
          size: 1,
          speed: 1,
          rotation: 0,
          opacity: 0.8,
          organicness: 0.5,
          movementPattern: 'orbit' as const,
          distance: 1.5,
          pulseEnabled: false,
          pulseSize: 1
        },
        blobs: { 
          color: palette.supporting[0] || palette.primary,
          count: 8,
          size: 1,
          speed: 1,
          opacity: 0.8,
          organicness: 0.5,
          movementPattern: 'orbit' as const,
          distance: 1.5,
          pulseEnabled: false,
          pulseSize: 1
        },
        crystals: {
          count: 0,
          size: 1,
          color: '#ffffff',
          rotation: 0,
          opacity: 1,
          complexity: 1,
          organicness: 0
        },
        waveInterference: {
          color: '#ffffff'
        },
        metamorphosis: {
          color: '#ffffff'
        },
        fireflies: {
          color: '#ffffff'
        },
        layeredSineWaves: {
          color: '#ffffff'
        }
      },
      particles: {
        color: palette.supporting[1] || palette.secondary,
        count: 50,
        size: 0.5,
        speed: 1,
        opacity: 0.8,
        spread: 50,
        movementPattern: 'random' as const,
        distance: 1.5,
        pulseEnabled: false,
        pulseSize: 1
      }
    };

    // Apply harmony-based effects
    const harmonyUpdates = EnhancedAIAdapter.applyHarmonyEffects(palette);

    // Apply temperature-based effects
    const temperatureUpdates = EnhancedAIAdapter.applyTemperatureEffects(palette);

    // Merge all updates
    return {
      ...colorUpdates,
      ...harmonyUpdates,
      ...temperatureUpdates
    };
  }

  /**
   * Map store properties to Enhanced Color Palette
   * Converts VisualState to partial EnhancedColorPalette
   */
  static mapStoreToColorPalette(store: VisualState): Partial<EnhancedColorPalette> {
    const basePalette = {
      primary: store.geometric.spheres.color,
      secondary: store.geometric.cubes.color,
      accent: store.geometric.toruses.color,
      supporting: [store.particles.color, store.geometric.blobs.color]
    };

    // Analyze the palette to determine harmony type
    const harmonyType = EnhancedAIAdapter.analyzeHarmonyType(basePalette);
    
    // Calculate harmony score based on color relationships
    const harmonyScore = EnhancedAIAdapter.calculateHarmonyScore(basePalette, harmonyType);

    // Determine color temperature
    const temperature = EnhancedAIAdapter.analyzeColorTemperature(basePalette.primary);

    return {
      ...basePalette,
      harmonyType,
      harmonyScore,
      contrastRatio: 4.5, // Default WCAG AA
      saturation: store.effects.saturation,
      brightness: store.effects.brightness,
      temperature,
      mood: [], // Would need mood analysis to populate
      accessibility: {
        wcagAA: true,
        wcagAAA: false,
        colorBlindFriendly: false
      }
    };
  }

  /**
   * Apply harmony-based effects to store
   */
  private static applyHarmonyEffects(palette: EnhancedColorPalette): Partial<VisualState> {
    const updates: Partial<VisualState> = {};

    // Apply harmony score to effects
    updates.effects = {
      saturation: palette.saturation,
      brightness: palette.brightness,
      glow: palette.harmonyScore * 0.5, // Higher harmony = more glow
      contrast: 1 + (palette.harmonyScore * 0.3), // Higher harmony = more contrast
      hue: 0,
      vignette: 0
    };

    // Apply harmony type specific effects
    const harmonyRule = HARMONY_RULES[palette.harmonyType];
    if (harmonyRule) {
      // Apply mood associations to animation patterns
      const isEnergetic = harmonyRule.moodAssociations.includes('energetic');
      const isCalm = harmonyRule.moodAssociations.includes('calm');
      
      if (isEnergetic) {
        updates.globalAnimationSpeed = 1.5;
        if (updates.geometric) {
          updates.geometric.spheres = {
            ...updates.geometric.spheres,
            movementPattern: 'random' as const
          };
        }
      } else if (isCalm) {
        updates.globalAnimationSpeed = 0.7;
        if (updates.geometric) {
          updates.geometric.spheres = {
            ...updates.geometric.spheres,
            movementPattern: 'orbit' as const
          };
        }
      }
    }

    return updates;
  }

  /**
   * Apply temperature-based effects to store
   */
  private static applyTemperatureEffects(palette: EnhancedColorPalette): Partial<VisualState> {
    const updates: Partial<VisualState> = {};

    const temperatureConfig = COLOR_TEMPERATURES[palette.temperature];
    if (temperatureConfig) {
      // Apply mood associations to effects
      const isWarm = palette.temperature === 'warm';
      const isCool = palette.temperature === 'cool';

      if (isWarm) {
        updates.effects = {
          saturation: Math.min(1.2, palette.saturation * 1.1),
          brightness: Math.min(1.1, palette.brightness * 1.05),
          glow: 0.6, // Warm colors get more glow
          contrast: 1.2,
          hue: 0,
          vignette: 0
        };
      } else if (isCool) {
        updates.effects = {
          saturation: palette.saturation * 0.9,
          brightness: palette.brightness * 0.95,
          glow: 0.3, // Cool colors get less glow
          contrast: 0.9,
          hue: 0,
          vignette: 0
        };
      }
    }

    return updates;
  }

  /**
   * Analyze harmony type from color palette
   */
  private static analyzeHarmonyType(palette: {
    primary: string;
    secondary: string;
    accent: string;
    supporting: string[];
  }): EnhancedColorPalette['harmonyType'] {
    // Simple heuristic-based harmony analysis
    const primaryHue = EnhancedAIAdapter.colorToHue(palette.primary);
    const secondaryHue = EnhancedAIAdapter.colorToHue(palette.secondary);
    const accentHue = EnhancedAIAdapter.colorToHue(palette.accent);

    const primarySecondaryDiff = Math.abs(primaryHue - secondaryHue);
    const primaryAccentDiff = Math.abs(primaryHue - accentHue);

    // Check for complementary (opposite colors)
    if (Math.abs(primarySecondaryDiff - 180) < 30) {
      return 'complementary';
    }

    // Check for triadic (120° apart)
    if (Math.abs(primarySecondaryDiff - 120) < 30 && Math.abs(primaryAccentDiff - 240) < 30) {
      return 'triadic';
    }

    // Check for analogous (adjacent colors)
    if (primarySecondaryDiff < 60 && primaryAccentDiff < 60) {
      return 'analogous';
    }

    // Default to monochromatic if colors are similar
    if (primarySecondaryDiff < 30 && primaryAccentDiff < 30) {
      return 'monochromatic';
    }

    return 'complementary'; // Default fallback
  }

  /**
   * Calculate harmony score based on color relationships
   */
  private static calculateHarmonyScore(
    palette: {
      primary: string;
      secondary: string;
      accent: string;
      supporting: string[];
    },
    harmonyType: EnhancedColorPalette['harmonyType']
  ): number {
    const harmonyRule = HARMONY_RULES[harmonyType];
    if (!harmonyRule) return 0.5;

    // Calculate how well colors follow the harmony rule
    const primaryHue = EnhancedAIAdapter.colorToHue(palette.primary);
    const secondaryHue = EnhancedAIAdapter.colorToHue(palette.secondary);
    const accentHue = EnhancedAIAdapter.colorToHue(palette.accent);

    let score = 0;
    let totalChecks = 0;

    // Check if secondary color follows the rule
    const expectedSecondaryHue = (primaryHue + harmonyRule.angleOffsets[0]) % 360;
    const secondaryDiff = Math.abs(secondaryHue - expectedSecondaryHue);
    score += Math.max(0, 1 - secondaryDiff / 30);
    totalChecks++;

    // Check if accent color follows the rule
    if (harmonyRule.angleOffsets[1] !== undefined) {
      const expectedAccentHue = (primaryHue + harmonyRule.angleOffsets[1]) % 360;
      const accentDiff = Math.abs(accentHue - expectedAccentHue);
      score += Math.max(0, 1 - accentDiff / 30);
      totalChecks++;
    }

    return totalChecks > 0 ? score / totalChecks : 0.5;
  }

  /**
   * Analyze color temperature from primary color
   */
  private static analyzeColorTemperature(primaryColor: string): 'warm' | 'cool' | 'neutral' {
    const hue = EnhancedAIAdapter.colorToHue(primaryColor);
    
    // Check warm ranges
    if ((hue >= 0 && hue <= 60) || (hue >= 300 && hue <= 360)) {
      return 'warm';
    }
    
    // Check cool ranges
    if (hue >= 180 && hue <= 240) {
      return 'cool';
    }
    
    return 'neutral';
  }

  /**
   * Convert hex color to hue value
   */
  private static colorToHue(hexColor: string): number {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    
    if (delta === 0) return 0;
    
    let hue = 0;
    if (max === r) {
      hue = ((g - b) / delta) % 6;
    } else if (max === g) {
      hue = (b - r) / delta + 2;
    } else {
      hue = (r - g) / delta + 4;
    }
    
    hue = hue * 60;
    if (hue < 0) hue += 360;
    
    return hue;
  }

  /**
   * Validate Enhanced Color Palette
   */
  static validateColorPalette(palette: EnhancedColorPalette): ColorValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check required properties
    if (!palette.primary) errors.push('Primary color is required');
    if (!palette.secondary) errors.push('Secondary color is required');
    if (!palette.accent) errors.push('Accent color is required');

    // Check harmony score
    if (palette.harmonyScore < 0 || palette.harmonyScore > 1) {
      errors.push('Harmony score must be between 0 and 1');
    }

    // Check contrast ratio
    if (palette.contrastRatio < 3.0) {
      warnings.push('Low contrast ratio may affect accessibility');
    }

    // Check saturation and brightness
    if (palette.saturation < 0 || palette.saturation > 1) {
      errors.push('Saturation must be between 0 and 1');
    }
    if (palette.brightness < 0 || palette.brightness > 1) {
      errors.push('Brightness must be between 0 and 1');
    }

    // Generate suggestions
    if (palette.harmonyScore < 0.6) {
      suggestions.push('Consider adjusting colors to improve harmony');
    }
    if (palette.contrastRatio < 4.5) {
      suggestions.push('Consider increasing contrast for better accessibility');
    }

    const isValid = errors.length === 0;
    const accessibilityScore = Math.min(1, palette.contrastRatio / 7.0);
    const harmonyScore = palette.harmonyScore;

    return {
      isValid,
      errors,
      warnings,
      suggestions,
      accessibilityScore,
      harmonyScore
    };
  }

  /**
   * Get Enhanced AI analysis summary for logging
   */
  static getColorPaletteSummary(palette: EnhancedColorPalette): string {
    return `Harmony: ${palette.harmonyType} (${(palette.harmonyScore * 100).toFixed(1)}%), Temperature: ${palette.temperature}, Contrast: ${palette.contrastRatio.toFixed(1)}`;
  }
} 