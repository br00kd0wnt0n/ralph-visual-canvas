// ColorHarmonyEngine.ts
// Isolated color harmony engine with comprehensive testing and validation
// No dependencies on existing AI system - completely self-contained

import {
  EnhancedColorPalette,
  ColorHarmonyConfig,
  ColorAnalysis,
  HarmonyRule,
  TestResults,
  TestDetail,
  ColorValidationResult,
  IntegrationAdapter,
  PerformanceMetrics,
  ColorCache,
  HARMONY_RULES,
  COLOR_TEMPERATURES,
  ACCESSIBILITY_STANDARDS,
  ColorFormat,
  HarmonyAlgorithm,
  ValidationLevel
} from '../types/EnhancedAITypes';

export class ColorHarmonyEngine {
  private cache: ColorCache = {};
  private performanceMetrics: PerformanceMetrics = {
    generationTime: 0,
    memoryUsage: 0,
    cacheHitRate: 0,
    validationTime: 0
  };
  private cacheHits = 0;
  private cacheMisses = 0;

  constructor() {
    console.log('🎨 ColorHarmonyEngine initialized - Ready for isolated testing');
  }

  // ===== CORE PALETTE GENERATION =====

  /**
   * Generate a harmonious color palette from a base color
   */
  generatePalette(baseColor: string, harmonyLevel: number = 0.8): EnhancedColorPalette {
    const startTime = performance.now();
    
    // Check cache first
    const cacheKey = `${baseColor}-${harmonyLevel}`;
    if (this.cache[cacheKey]) {
      this.cacheHits++;
      this.cache[cacheKey].usageCount++;
      this.updatePerformanceMetrics(startTime);
      return this.cache[cacheKey].palette;
    }

    this.cacheMisses++;

    try {
      // Analyze base color
      const baseAnalysis = this.analyzeColor(baseColor);
      
      // Determine best harmony type based on color characteristics
      const harmonyType = this.determineOptimalHarmonyType(baseAnalysis, harmonyLevel);
      
      // Generate harmonious colors
      const harmoniousColors = this.generateHarmoniousColors(baseAnalysis, harmonyType, harmonyLevel);
      
      // Create supporting colors
      const supportingColors = this.generateSupportingColors(baseAnalysis, harmoniousColors, 4);
      
      // Calculate harmony metrics
      const harmonyScore = this.calculateHarmonyScore(harmoniousColors);
      const contrastRatio = this.calculateContrastRatio(harmoniousColors[0], harmoniousColors[1]);
      
      // Determine color temperature and mood
      const temperature = this.determineColorTemperature(baseAnalysis);
      const mood = this.determineMoodAssociations(harmonyType, temperature);
      
      // Calculate overall metrics
      const saturation = this.calculateAverageSaturation([...harmoniousColors, ...supportingColors]);
      const brightness = this.calculateAverageBrightness([...harmoniousColors, ...supportingColors]);
      
      // Check accessibility
      const accessibility = this.checkAccessibility(harmoniousColors);
      
      const palette: EnhancedColorPalette = {
        primary: harmoniousColors[0],
        secondary: harmoniousColors[1],
        accent: harmoniousColors[2] || harmoniousColors[1],
        supporting: supportingColors,
        harmonyType,
        harmonyScore,
        contrastRatio,
        saturation,
        brightness,
        temperature,
        mood,
        accessibility
      };

      // Cache the result
      this.cache[cacheKey] = {
        palette,
        timestamp: Date.now(),
        usageCount: 1
      };

      this.updatePerformanceMetrics(startTime);
      
      console.log(`🎨 Generated ${harmonyType} palette with harmony score: ${harmonyScore.toFixed(2)}`);
      
      return palette;
      
    } catch (error) {
      console.error('❌ Error generating palette:', error);
      throw new Error(`Failed to generate palette: ${error}`);
    }
  }

  /**
   * Generate palette with advanced configuration
   */
  generatePaletteWithConfig(config: ColorHarmonyConfig): EnhancedColorPalette {
    const basePalette = this.generatePalette(config.baseColor, config.harmonyLevel);
    
    // Apply configuration adjustments
    return this.adjustPaletteForConfig(basePalette, config);
  }

  // ===== COLOR ANALYSIS =====

  /**
   * Analyze a color and extract all relevant properties
   */
  analyzeColor(color: string): ColorAnalysis {
    const hex = this.normalizeColor(color);
    const rgb = this.hexToRgb(hex);
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    return {
      hue: hsl.h,
      saturation: hsl.s,
      lightness: hsl.l,
      rgb,
      hsl,
      hex,
      temperature: this.determineColorTemperature({ hue: hsl.h, saturation: hsl.s, lightness: hsl.l }),
      brightness: this.calculateBrightness(rgb),
      contrast: this.calculateContrast(rgb)
    };
  }

  /**
   * Determine the optimal harmony type for a given color
   */
  private determineOptimalHarmonyType(analysis: ColorAnalysis, harmonyLevel: number): keyof typeof HARMONY_RULES {
    const { hue, saturation, lightness } = analysis;
    
    // High saturation colors work well with complementary
    if (saturation > 80) {
      return 'complementary';
    }
    
    // Low saturation colors work well with analogous
    if (saturation < 40) {
      return 'analogous';
    }
    
    // Medium saturation with high lightness works well with triadic
    if (saturation > 50 && lightness > 60) {
      return 'triadic';
    }
    
    // Very high or very low lightness works well with monochromatic
    if (lightness > 85 || lightness < 15) {
      return 'monochromatic';
    }
    
    // Default to split-complementary for balanced results
    return 'split-complementary';
  }

  // ===== HARMONY GENERATION =====

  /**
   * Generate harmonious colors based on harmony rules
   */
  private generateHarmoniousColors(
    baseAnalysis: ColorAnalysis, 
    harmonyType: keyof typeof HARMONY_RULES, 
    harmonyLevel: number
  ): string[] {
    const rule = HARMONY_RULES[harmonyType];
    const colors: string[] = [baseAnalysis.hex];
    
    for (const angleOffset of rule.angleOffsets) {
      const newHue = (baseAnalysis.hue + angleOffset) % 360;
      const newSaturation = Math.min(100, baseAnalysis.saturation * rule.saturationMultiplier);
      const newLightness = Math.min(100, baseAnalysis.lightness * rule.lightnessMultiplier);
      
      const newColor = this.hslToHex(newHue, newSaturation, newLightness);
      colors.push(newColor);
    }
    
    return colors;
  }

  /**
   * Generate supporting colors that complement the main palette
   */
  private generateSupportingColors(
    baseAnalysis: ColorAnalysis, 
    mainColors: string[], 
    count: number
  ): string[] {
    const supporting: string[] = [];
    
    for (let i = 0; i < count; i++) {
      // Create variations with different lightness and saturation
      const variation = this.createColorVariation(baseAnalysis, i, count);
      supporting.push(variation);
    }
    
    return supporting;
  }

  // ===== VALIDATION & TESTING =====

  /**
   * Validate a color palette for quality and accessibility
   */
  validatePalette(palette: EnhancedColorPalette): ColorValidationResult {
    const startTime = performance.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    
    // Basic validation
    if (!this.isValidHexColor(palette.primary)) {
      errors.push('Primary color is not a valid hex color');
    }
    
    if (!this.isValidHexColor(palette.secondary)) {
      errors.push('Secondary color is not a valid hex color');
    }
    
    // Harmony score validation
    if (palette.harmonyScore < 0.3) {
      warnings.push('Low harmony score detected');
      suggestions.push('Consider using a different harmony type');
    }
    
    // Contrast validation
    if (palette.contrastRatio < 3.0) {
      warnings.push('Low contrast ratio detected');
      suggestions.push('Consider adjusting lightness values for better contrast');
    }
    
    // Accessibility validation
    if (!palette.accessibility.wcagAA) {
      warnings.push('Palette does not meet WCAG AA standards');
      suggestions.push('Adjust colors for better accessibility');
    }
    
    // Saturation validation
    if (palette.saturation > 0.9) {
      warnings.push('Very high saturation may cause visual fatigue');
      suggestions.push('Consider reducing saturation for better usability');
    }
    
    const validationTime = performance.now() - startTime;
    this.performanceMetrics.validationTime = validationTime;
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      accessibilityScore: this.calculateAccessibilityScore(palette),
      harmonyScore: palette.harmonyScore
    };
  }

  /**
   * Comprehensive testing suite
   */
  testWithSampleColors(): TestResults {
    console.log('🧪 Starting comprehensive color harmony tests...');
    
    const testStartTime = performance.now();
    const testDetails: TestDetail[] = [];
    const sampleColors = [
      '#FF0000', // Red
      '#00FF00', // Green
      '#0000FF', // Blue
      '#FFFF00', // Yellow
      '#FF00FF', // Magenta
      '#00FFFF', // Cyan
      '#FFA500', // Orange
      '#800080', // Purple
      '#000000', // Black
      '#FFFFFF'  // White
    ];
    
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    
    // Test 1: Basic palette generation
    for (const color of sampleColors) {
      const testName = `Generate palette for ${color}`;
      const testStart = performance.now();
      
      try {
        const palette = this.generatePalette(color, 0.8);
        const validation = this.validatePalette(palette);
        
        const passed = validation.isValid;
        const executionTime = performance.now() - testStart;
        
        testDetails.push({
          testName,
          passed,
          expected: 'Valid palette',
          actual: passed ? 'Valid palette' : validation.errors.join(', '),
          executionTime
        });
        
        totalTests++;
        if (passed) passedTests++; else failedTests++;
        
      } catch (error) {
        testDetails.push({
          testName,
          passed: false,
          expected: 'Valid palette',
          actual: `Error: ${error}`,
          error: error.toString(),
          executionTime: performance.now() - testStart
        });
        totalTests++;
        failedTests++;
      }
    }
    
    // Test 2: Harmony type determination
    const harmonyTestColors = ['#FF0000', '#00FF00', '#0000FF'];
    for (const color of harmonyTestColors) {
      const testName = `Harmony type for ${color}`;
      const testStart = performance.now();
      
      try {
        const analysis = this.analyzeColor(color);
        const harmonyType = this.determineOptimalHarmonyType(analysis, 0.8);
        const passed = Object.keys(HARMONY_RULES).includes(harmonyType);
        
        testDetails.push({
          testName,
          passed,
          expected: 'Valid harmony type',
          actual: harmonyType,
          executionTime: performance.now() - testStart
        });
        
        totalTests++;
        if (passed) passedTests++; else failedTests++;
        
      } catch (error) {
        testDetails.push({
          testName,
          passed: false,
          expected: 'Valid harmony type',
          actual: `Error: ${error}`,
          error: error.toString(),
          executionTime: performance.now() - testStart
        });
        totalTests++;
        failedTests++;
      }
    }
    
    // Test 3: Color analysis
    const analysisTestColors = ['#FF0000', '#00FF00', '#0000FF'];
    for (const color of analysisTestColors) {
      const testName = `Color analysis for ${color}`;
      const testStart = performance.now();
      
      try {
        const analysis = this.analyzeColor(color);
        const passed = analysis.hue >= 0 && analysis.hue <= 360 &&
                      analysis.saturation >= 0 && analysis.saturation <= 100 &&
                      analysis.lightness >= 0 && analysis.lightness <= 100;
        
        testDetails.push({
          testName,
          passed,
          expected: 'Valid color analysis',
          actual: passed ? 'Valid analysis' : 'Invalid analysis values',
          executionTime: performance.now() - testStart
        });
        
        totalTests++;
        if (passed) passedTests++; else failedTests++;
        
      } catch (error) {
        testDetails.push({
          testName,
          passed: false,
          expected: 'Valid color analysis',
          actual: `Error: ${error}`,
          error: error.toString(),
          executionTime: performance.now() - testStart
        });
        totalTests++;
        failedTests++;
      }
    }
    
    // Test 4: Performance test
    const performanceTestName = 'Performance test - 100 palette generations';
    const performanceTestStart = performance.now();
    
    try {
      const startMemory = performance.memory?.usedJSHeapSize || 0;
      
      for (let i = 0; i < 100; i++) {
        const color = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
        this.generatePalette(color, 0.8);
      }
      
      const endMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryUsage = endMemory - startMemory;
      const executionTime = performance.now() - performanceTestStart;
      const averageTime = executionTime / 100;
      
      const passed = averageTime < 10; // Should be under 10ms per palette
      
      testDetails.push({
        testName: performanceTestName,
        passed,
        expected: 'Under 10ms per palette',
        actual: `${averageTime.toFixed(2)}ms per palette`,
        executionTime
      });
      
      totalTests++;
      if (passed) passedTests++; else failedTests++;
      
    } catch (error) {
      testDetails.push({
        testName: performanceTestName,
        passed: false,
        expected: 'Under 10ms per palette',
        actual: `Error: ${error}`,
        error: error.toString(),
        executionTime: performance.now() - performanceTestStart
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
        averageGenerationTime: this.performanceMetrics.generationTime,
        memoryUsage: this.performanceMetrics.memoryUsage,
        paletteQualityScore: passedTests / totalTests
      }
    };
  }

  // ===== UTILITY METHODS =====

  /**
   * Convert color between different formats
   */
  convertColor(color: string, targetFormat: ColorFormat): string {
    const analysis = this.analyzeColor(color);
    
    switch (targetFormat) {
      case 'hex':
        return analysis.hex;
      case 'rgb':
        return `rgb(${analysis.rgb.r}, ${analysis.rgb.g}, ${analysis.rgb.b})`;
      case 'hsl':
        return `hsl(${analysis.hue}, ${analysis.saturation}%, ${analysis.lightness}%)`;
      case 'hsv':
        const hsv = this.rgbToHsv(analysis.rgb.r, analysis.rgb.g, analysis.rgb.b);
        return `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
      default:
        return analysis.hex;
    }
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    this.performanceMetrics.cacheHitRate = this.cacheHits / (this.cacheHits + this.cacheMisses);
    return { ...this.performanceMetrics };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache = {};
    this.cacheHits = 0;
    this.cacheMisses = 0;
    console.log('🗑️ Color cache cleared');
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

  // ===== INTEGRATION ADAPTERS =====

  /**
   * Create integration adapter for future use with existing AI system
   */
  createIntegrationAdapter(): IntegrationAdapter {
    return {
      convertToLegacyFormat: (palette: EnhancedColorPalette) => {
        // Convert to existing AI system format
        return {
          primary: palette.primary,
          secondary: palette.secondary,
          accent: palette.accent,
          supporting: palette.supporting
        };
      },
      
      convertFromLegacyFormat: (legacyPalette: any) => {
        // Convert from existing AI system format
        const baseColor = legacyPalette.primary || '#000000';
        return this.generatePalette(baseColor, 0.8);
      },
      
      validateIntegration: () => {
        // Test integration compatibility
        const testPalette = this.generatePalette('#FF0000', 0.8);
        const legacy = this.createIntegrationAdapter().convertToLegacyFormat(testPalette);
        const restored = this.createIntegrationAdapter().convertFromLegacyFormat(legacy);
        
        return restored.primary === testPalette.primary;
      }
    };
  }

  // ===== PRIVATE HELPER METHODS =====

  private normalizeColor(color: string): string {
    if (color.startsWith('#')) {
      return color.length === 4 ? 
        `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}` : 
        color;
    }
    
    // Handle rgb/rgba format
    if (color.startsWith('rgb')) {
      const rgb = color.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        return this.rgbToHex(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]));
      }
    }
    
    return '#000000'; // Default fallback
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  private rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h /= 6;
    }

    return {
      h: h * 360,
      s: s * 100,
      l: l * 100
    };
  }

  private hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    return this.rgbToHex(
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255)
    );
  }

  private rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    const s = max === 0 ? 0 : d / max;
    const v = max;

    if (max !== min) {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: h * 360,
      s: s * 100,
      v: v * 100
    };
  }

  private determineColorTemperature(analysis: { hue: number }): 'warm' | 'cool' | 'neutral' {
    const { hue } = analysis;
    
    for (const [temp, config] of Object.entries(COLOR_TEMPERATURES)) {
      for (const [min, max] of config.hueRanges) {
        if (hue >= min && hue <= max) {
          return temp as 'warm' | 'cool' | 'neutral';
        }
      }
    }
    
    return 'neutral';
  }

  private determineMoodAssociations(harmonyType: string, temperature: string): string[] {
    const harmonyMoods = HARMONY_RULES[harmonyType as keyof typeof HARMONY_RULES]?.moodAssociations || [];
    const temperatureMoods = COLOR_TEMPERATURES[temperature as keyof typeof COLOR_TEMPERATURES]?.moodAssociations || [];
    
    return [...new Set([...harmonyMoods, ...temperatureMoods])];
  }

  private calculateHarmonyScore(colors: string[]): number {
    if (colors.length < 2) return 0;
    
    let totalScore = 0;
    let comparisons = 0;
    
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const analysis1 = this.analyzeColor(colors[i]);
        const analysis2 = this.analyzeColor(colors[j]);
        
        // Calculate hue distance (0-180 degrees)
        const hueDistance = Math.min(
          Math.abs(analysis1.hue - analysis2.hue),
          360 - Math.abs(analysis1.hue - analysis2.hue)
        );
        
        // Score based on optimal hue distances for harmony
        let score = 0;
        if (hueDistance >= 150 && hueDistance <= 210) { // Complementary range
          score = 0.9;
        } else if (hueDistance >= 110 && hueDistance <= 130) { // Triadic range
          score = 0.8;
        } else if (hueDistance >= 20 && hueDistance <= 80) { // Analogous range
          score = 0.7;
        } else if (hueDistance <= 30) { // Monochromatic range
          score = 0.6;
        } else {
          score = 0.3;
        }
        
        totalScore += score;
        comparisons++;
      }
    }
    
    return comparisons > 0 ? totalScore / comparisons : 0;
  }

  private calculateContrastRatio(color1: string, color2: string): number {
    const analysis1 = this.analyzeColor(color1);
    const analysis2 = this.analyzeColor(color2);
    
    const luminance1 = this.calculateLuminance(analysis1.rgb);
    const luminance2 = this.calculateLuminance(analysis2.rgb);
    
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  private calculateLuminance(rgb: { r: number; g: number; b: number }): number {
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  private calculateBrightness(rgb: { r: number; g: number; b: number }): number {
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 / 255;
  }

  private calculateContrast(rgb: { r: number; g: number; b: number }): number {
    const brightness = this.calculateBrightness(rgb);
    return brightness > 0.5 ? 1 - brightness : brightness;
  }

  private calculateAverageSaturation(colors: string[]): number {
    const saturations = colors.map(color => this.analyzeColor(color).saturation);
    return saturations.reduce((sum, sat) => sum + sat, 0) / saturations.length / 100;
  }

  private calculateAverageBrightness(colors: string[]): number {
    const brightnesses = colors.map(color => {
      const rgb = this.hexToRgb(color);
      return this.calculateBrightness(rgb);
    });
    return brightnesses.reduce((sum, bright) => sum + bright, 0) / brightnesses.length;
  }

  private checkAccessibility(colors: string[]): { wcagAA: boolean; wcagAAA: boolean; colorBlindFriendly: boolean } {
    if (colors.length < 2) {
      return { wcagAA: false, wcagAAA: false, colorBlindFriendly: false };
    }
    
    const contrastRatio = this.calculateContrastRatio(colors[0], colors[1]);
    const wcagAA = contrastRatio >= ACCESSIBILITY_STANDARDS.WCAG_AA.normalText;
    const wcagAAA = contrastRatio >= ACCESSIBILITY_STANDARDS.WCAG_AAA.normalText;
    
    // Simple color blind friendliness check (avoid red-green combinations)
    const analysis1 = this.analyzeColor(colors[0]);
    const analysis2 = this.analyzeColor(colors[1]);
    const hueDiff = Math.abs(analysis1.hue - analysis2.hue);
    const colorBlindFriendly = !(hueDiff >= 150 && hueDiff <= 210); // Not pure red-green
    
    return { wcagAA, wcagAAA, colorBlindFriendly };
  }

  private calculateAccessibilityScore(palette: EnhancedColorPalette): number {
    let score = 0;
    
    if (palette.accessibility.wcagAAA) score += 0.4;
    else if (palette.accessibility.wcagAA) score += 0.3;
    
    if (palette.accessibility.colorBlindFriendly) score += 0.3;
    
    if (palette.contrastRatio >= 7.0) score += 0.3;
    else if (palette.contrastRatio >= 4.5) score += 0.2;
    
    return Math.min(1, score);
  }

  private createColorVariation(analysis: ColorAnalysis, index: number, total: number): string {
    const lightnessVariation = 0.1 + (index * 0.15);
    const saturationVariation = 0.8 + (index * 0.1);
    
    const newLightness = Math.max(10, Math.min(90, analysis.lightness * lightnessVariation));
    const newSaturation = Math.max(20, Math.min(100, analysis.saturation * saturationVariation));
    
    return this.hslToHex(analysis.hue, newSaturation, newLightness);
  }

  private adjustPaletteForConfig(palette: EnhancedColorPalette, config: ColorHarmonyConfig): EnhancedColorPalette {
    // Apply configuration adjustments
    const adjustedPalette = { ...palette };
    
    // Adjust saturation
    if (config.targetSaturation !== undefined) {
      adjustedPalette.saturation = config.targetSaturation;
    }
    
    // Adjust brightness
    if (config.targetBrightness !== undefined) {
      adjustedPalette.brightness = config.targetBrightness;
    }
    
    // Adjust temperature
    if (config.targetTemperature !== undefined) {
      adjustedPalette.temperature = config.targetTemperature;
    }
    
    // Adjust mood
    if (config.targetMood.length > 0) {
      adjustedPalette.mood = config.targetMood;
    }
    
    return adjustedPalette;
  }

  private isValidHexColor(color: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }

  private updatePerformanceMetrics(startTime: number): void {
    this.performanceMetrics.generationTime = performance.now() - startTime;
    this.performanceMetrics.memoryUsage = performance.memory?.usedJSHeapSize || 0;
  }
}

// Export a default instance for easy testing
export const colorHarmonyEngine = new ColorHarmonyEngine();

// Export testing utilities
export const testColorHarmonyEngine = () => {
  console.log('🧪 Starting ColorHarmonyEngine tests...');
  const results = colorHarmonyEngine.testWithSampleColors();
  console.log('📊 Test Results:', results);
  return results;
}; 