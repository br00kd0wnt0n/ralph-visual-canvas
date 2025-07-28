// Improved parameter ranges for AI preset generation
// These ranges produce visually appealing results based on testing

export const IMPROVED_PARAMETER_RANGES = {
  shapes: {
    count: {
      min: 20,
      max: 80,
      sweet: 40,
      performance: {
        low: 20,
        medium: 40,
        high: 60
      }
    },
    size: {
      min: 0.5,
      max: 5.0,
      default: 1.5,
      variation: 2.0
    },
    speed: {
      min: 0.8,
      max: 3.0,
      default: 1.5,
      calm: 0.8,
      energetic: 2.5
    },
    opacity: {
      min: 0.6,
      max: 1.0,
      glass: 0.7,
      solid: 0.9
    },
    organicness: {
      min: 0,
      max: 0.5,
      smooth: 0.2,
      chaotic: 0.4
    },
    distance: {
      min: 1.0,
      max: 5.0,
      default: 2.0
    }
  },
  
  particles: {
    count: {
      min: 100,
      max: 800,
      sweet: 400,
      performance: {
        low: 200,
        medium: 400,
        high: 600
      }
    },
    size: {
      min: 1,
      max: 15,
      visible: 5,
      subtle: 3
    },
    spread: {
      min: 30,
      max: 80,
      balanced: 50
    }
  },
  
  effects: {
    glow: {
      min: 0,
      max: 1.0,
      subtle: 0.3,
      vibrant: 0.6,
      intense: 0.8
    },
    brightness: {
      min: 0.8,
      max: 1.3,
      balanced: 1.0
    },
    saturation: {
      min: 0.8,
      max: 1.8,
      muted: 0.8,
      rich: 1.3,
      vibrant: 1.6
    },
    contrast: {
      min: 0.9,
      max: 1.4,
      balanced: 1.1
    },
    vignette: {
      min: 0,
      max: 0.5,
      subtle: 0.2,
      dramatic: 0.4
    }
  },
  
  globalEffects: {
    distortion: {
      wave: {
        min: 0,
        max: 0.6,
        subtle: 0.2,
        moderate: 0.4
      },
      ripple: {
        min: 0,
        max: 0.6,
        subtle: 0.2,
        moderate: 0.4
      },
      frequency: {
        min: 0.5,
        max: 2.0,
        default: 1.0
      }
    },
    atmosphericBlur: {
      intensity: {
        min: 0,
        max: 0.5,
        subtle: 0.2,
        dreamy: 0.4
      },
      layers: {
        min: 1,
        max: 3
      }
    },
    shapeGlow: {
      intensity: {
        min: 0,
        max: 0.8,
        subtle: 0.3,
        bright: 0.6
      }
    }
  },
  
  animation: {
    globalSpeed: {
      min: 0.5,
      max: 2.0,
      calm: 0.7,
      balanced: 1.0,
      energetic: 1.5
    }
  }
};

// Movement pattern selection based on strategy
export const selectMovementPattern = (
  strategy: string,
  mood: string[],
  energy: number
): 'orbit' | 'verticalSine' | 'random' | 'static' => {
  if (strategy === 'dynamic_movement') {
    return energy > 0.7 ? 'random' : 'orbit';
  }
  if (strategy === 'atmospheric_mood') {
    return 'verticalSine';
  }
  if (mood.includes('chaotic') || mood.includes('energetic')) {
    return 'random';
  }
  if (mood.includes('calm') || mood.includes('peaceful')) {
    return 'verticalSine';
  }
  return 'orbit';
};

// Feature enablement based on strategy
export const getEnabledFeatures = (strategy: string) => {
  const features = {
    shapeGlow: true,
    trails: false,
    distortion: false,
    atmosphericBlur: false,
    depthOfField: false,
    particleInteraction: false,
    pulsing: false
  };
  
  switch (strategy) {
    case 'harmonic_emphasis':
      features.shapeGlow = true;
      features.pulsing = true;
      features.atmosphericBlur = true;
      break;
      
    case 'dynamic_movement':
      features.trails = true;
      features.particleInteraction = true;
      features.shapeGlow = true;
      break;
      
    case 'atmospheric_mood':
      features.atmosphericBlur = true;
      features.depthOfField = true;
      features.shapeGlow = true;
      features.pulsing = true;
      break;
      
    case 'geometric_balance':
      features.shapeGlow = true;
      break;
      
    case 'artistic_interpretation':
      features.distortion = true;
      features.shapeGlow = true;
      features.trails = true;
      features.atmosphericBlur = true;
      break;
  }
  
  return features;
};

// Performance-aware parameter adjustment
export const adjustForPerformance = (
  params: any,
  targetFPS: number = 45
): any => {
  const adjusted = { ...params };
  
  // Calculate total complexity
  const shapeCount = (params.geometric?.spheres?.count || 0) +
                    (params.geometric?.cubes?.count || 0) +
                    (params.geometric?.toruses?.count || 0);
  const particleCount = params.particles?.count || 0;
  const complexity = shapeCount + (particleCount / 10);
  
  // Adjust if too complex
  if (complexity > 150) {
    const scale = 120 / complexity;
    
    if (adjusted.geometric) {
      ['spheres', 'cubes', 'toruses'].forEach(shape => {
        if (adjusted.geometric[shape]) {
          adjusted.geometric[shape].count = Math.floor(adjusted.geometric[shape].count * scale);
        }
      });
    }
    
    if (adjusted.particles) {
      adjusted.particles.count = Math.floor(adjusted.particles.count * scale);
    }
    
    // Disable expensive effects
    if (adjusted.globalEffects?.trails) {
      adjusted.globalEffects.trails.enabled = false;
    }
    if (adjusted.globalEffects?.atmosphericBlur) {
      adjusted.globalEffects.atmosphericBlur.layers = 1;
    }
  }
  
  return adjusted;
};