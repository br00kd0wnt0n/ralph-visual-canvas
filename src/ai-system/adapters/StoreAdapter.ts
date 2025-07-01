// AI Store Adapter
// Bridges between AI system and visual store using unified type system
// Provides clean separation of concerns and type safety

import type { 
  ThemeAnalysis, 
  VisualCharacteristics, 
  WeatherData, 
  WeatherMappings,
  EnhancedColorPalette, 
  ColorHarmonyConfig 
} from '../../types/unified';
import type { VisualState } from '../../store/visualStore';

export class AIStoreAdapter {
  /**
   * Maps AI analysis results to store properties
   */
  static mapToStore(aiAnalysis: ThemeAnalysis): Partial<VisualState> {
    console.log('🔧 AIStoreAdapter.mapToStore called with:', aiAnalysis);
    
    // Safety checks and fallbacks
    const visualCharacteristics = aiAnalysis.visualCharacteristics || {
      saturation: 0.5,
      turbulence: 0.3,
      harmony: 0.6,
      energy: 0.5,
      speed: 1.0,
      density: 0.8,
      brightness: 0.7
    };
    
    const colorPalette = aiAnalysis.colorPalette || {
      primary: '#1a1a2e',
      secondary: '#e94560',
      accent: '#0f3460',
      supporting: ['#16213e', '#533483', '#7209b7']
    };
    
    console.log('🔧 Using visual characteristics:', visualCharacteristics);
    console.log('🔧 Using color palette:', colorPalette);
    
    const mappedData = {
      geometric: {
        spheres: {
          count: Math.round(visualCharacteristics.density * 50),
          size: 2 + visualCharacteristics.energy * 8,
          color: colorPalette.primary,
          speed: visualCharacteristics.speed * 2,
          rotation: visualCharacteristics.turbulence * 2,
          opacity: 0.3 + visualCharacteristics.harmony * 0.7,
          organicness: visualCharacteristics.turbulence * 10,
          movementPattern: 'orbit' as const,
          distance: 20 + visualCharacteristics.density * 30,
          pulseEnabled: visualCharacteristics.energy > 0.5,
          pulseSize: visualCharacteristics.energy * 2
        },
        cubes: {
          count: Math.round(visualCharacteristics.density * 30),
          size: 3 + visualCharacteristics.energy * 7,
          color: colorPalette.secondary,
          rotation: visualCharacteristics.turbulence * 1.5,
          speed: visualCharacteristics.speed * 1.5,
          opacity: 0.4 + visualCharacteristics.harmony * 0.6,
          organicness: visualCharacteristics.turbulence * 8,
          movementPattern: 'orbit' as const,
          distance: 25 + visualCharacteristics.density * 25,
          pulseEnabled: visualCharacteristics.energy > 0.6,
          pulseSize: visualCharacteristics.energy * 1.8
        },
        toruses: {
          count: Math.round(visualCharacteristics.density * 20),
          size: 2 + visualCharacteristics.energy * 6,
          color: colorPalette.accent,
          speed: visualCharacteristics.speed * 1.2,
          rotation: visualCharacteristics.turbulence * 1.8,
          opacity: 0.5 + visualCharacteristics.harmony * 0.5,
          organicness: visualCharacteristics.turbulence * 6,
          movementPattern: 'orbit' as const,
          distance: 30 + visualCharacteristics.density * 20,
          pulseEnabled: visualCharacteristics.energy > 0.7,
          pulseSize: visualCharacteristics.energy * 1.5
        },
        blobs: {
          count: Math.round(visualCharacteristics.density * 15),
          size: 4 + visualCharacteristics.energy * 5,
          color: colorPalette.supporting[0] || colorPalette.primary,
          speed: visualCharacteristics.speed * 0.8,
          opacity: 0.6 + visualCharacteristics.harmony * 0.4,
          organicness: visualCharacteristics.turbulence * 12,
          movementPattern: 'orbit' as const,
          distance: 35 + visualCharacteristics.density * 15,
          pulseEnabled: visualCharacteristics.energy > 0.4,
          pulseSize: visualCharacteristics.energy * 1.2
        },
        crystals: {
          count: Math.round(visualCharacteristics.density * 10),
          size: 2 + visualCharacteristics.energy * 4,
          color: colorPalette.supporting[1] || colorPalette.secondary,
          rotation: visualCharacteristics.turbulence * 2,
          opacity: 0.7 + visualCharacteristics.harmony * 0.3,
          complexity: visualCharacteristics.turbulence * 8,
          organicness: visualCharacteristics.turbulence * 4
        },
        waveInterference: {
          color: colorPalette.primary
        },
        metamorphosis: {
          color: colorPalette.accent
        },
        fireflies: {
          color: colorPalette.supporting[2] || colorPalette.primary
        },
        layeredSineWaves: {
          color: colorPalette.supporting[3] || colorPalette.secondary
        }
      },
      particles: {
        count: Math.round(visualCharacteristics.density * 100),
        size: 1 + visualCharacteristics.energy * 3,
        color: colorPalette.primary,
        speed: visualCharacteristics.speed * 1.5,
        opacity: 0.3 + visualCharacteristics.harmony * 0.7,
        spread: 20 + visualCharacteristics.turbulence * 30,
        movementPattern: 'random' as const,
        distance: 40 + visualCharacteristics.density * 20,
        pulseEnabled: visualCharacteristics.energy > 0.3,
        pulseSize: visualCharacteristics.energy * 1.0
      },
      globalEffects: {
        atmosphericBlur: {
          enabled: visualCharacteristics.energy > 0.3,
          intensity: visualCharacteristics.energy * 0.4,
          layers: 3
        },
        colorBlending: {
          enabled: visualCharacteristics.harmony > 0.5,
          mode: 'screen' as const,
          intensity: visualCharacteristics.harmony * 0.6
        },
        shapeGlow: {
          enabled: visualCharacteristics.energy > 0.4,
          intensity: visualCharacteristics.energy * 0.8,
          radius: 2 + visualCharacteristics.energy * 3,
          useObjectColor: true,
          customColor: colorPalette.primary,
          pulsing: visualCharacteristics.energy > 0.5,
          pulseSpeed: visualCharacteristics.speed * 0.5
        },
        chromatic: {
          enabled: visualCharacteristics.turbulence > 0.4,
          aberration: visualCharacteristics.turbulence * 0.3,
          aberrationColors: {
            red: '#ff0000',
            green: '#00ff00',
            blue: '#0000ff'
          },
          rainbow: {
            enabled: false,
            intensity: 0,
            speed: 1,
            rotation: 0,
            blendMode: 'normal',
            colors: [],
            opacity: 0
          },
          prism: visualCharacteristics.turbulence * 0.2
        },
        distortion: {
          enabled: visualCharacteristics.turbulence > 0.3,
          wave: visualCharacteristics.turbulence * 0.5,
          ripple: visualCharacteristics.turbulence * 0.3,
          noise: visualCharacteristics.turbulence * 0.2,
          frequency: 1 + visualCharacteristics.turbulence * 2
        },
        particleInteraction: {
          enabled: visualCharacteristics.energy > 0.6,
          magnetism: visualCharacteristics.energy * 0.5,
          repulsion: visualCharacteristics.turbulence * 0.3,
          flowField: visualCharacteristics.harmony > 0.7,
          turbulence: visualCharacteristics.turbulence * 0.4
        },
        volumetric: {
          enabled: visualCharacteristics.energy > 0.5,
          fog: visualCharacteristics.turbulence * 0.3,
          lightShafts: visualCharacteristics.energy * 0.4,
          density: visualCharacteristics.density * 0.5,
          color: colorPalette.primary
        },
        trails: {
          enabled: visualCharacteristics.speed > 0.5,
          sphereTrails: {
            enabled: true,
            length: Math.round(visualCharacteristics.speed * 20),
            opacity: 0.3 + visualCharacteristics.harmony * 0.4,
            width: 1 + visualCharacteristics.energy * 2,
            fadeRate: 0.95
          },
          cubeTrails: {
            enabled: true,
            length: Math.round(visualCharacteristics.speed * 15),
            opacity: 0.3 + visualCharacteristics.harmony * 0.4,
            width: 1 + visualCharacteristics.energy * 2,
            fadeRate: 0.95
          },
          blobTrails: {
            enabled: true,
            length: Math.round(visualCharacteristics.speed * 12),
            opacity: 0.3 + visualCharacteristics.harmony * 0.4,
            width: 1 + visualCharacteristics.energy * 2,
            fadeRate: 0.95
          },
          torusTrails: {
            enabled: true,
            length: Math.round(visualCharacteristics.speed * 10),
            opacity: 0.3 + visualCharacteristics.harmony * 0.4,
            width: 1 + visualCharacteristics.energy * 2,
            fadeRate: 0.95
          },
          particleTrails: {
            enabled: true,
            length: Math.round(visualCharacteristics.speed * 8),
            opacity: 0.3 + visualCharacteristics.harmony * 0.4,
            width: 1 + visualCharacteristics.energy * 2,
            fadeRate: 0.95
          }
        },
        waveInterference: {
          enabled: visualCharacteristics.turbulence > 0.4,
          speed: visualCharacteristics.speed * 0.8,
          amplitude: visualCharacteristics.energy * 0.6,
          contourLevels: 5,
          preset: 1,
          edgeFade: {
            enabled: true,
            fadeStart: 0.7,
            fadeEnd: 1.0
          }
        },
        metamorphosis: {
          enabled: visualCharacteristics.turbulence > 0.6,
          morphSpeed: visualCharacteristics.speed * 0.5,
          rotationSpeed: visualCharacteristics.turbulence * 0.8,
          wireframeOpacity: 0.3 + visualCharacteristics.energy * 0.4,
          size: 2 + visualCharacteristics.energy * 3,
          blur: visualCharacteristics.turbulence * 0.3,
          intensity: visualCharacteristics.energy * 0.7,
          layers: 3
        },
        fireflies: {
          enabled: visualCharacteristics.energy > 0.7,
          count: Math.round(visualCharacteristics.density * 30),
          speed: visualCharacteristics.speed * 0.6,
          glowIntensity: visualCharacteristics.energy * 0.8,
          swarmRadius: 20 + visualCharacteristics.density * 15
        },
        layeredSineWaves: {
          enabled: visualCharacteristics.harmony > 0.6,
          layers: 3,
          points: 100,
          waveAmplitude: visualCharacteristics.energy * 0.5,
          speed: visualCharacteristics.speed * 0.4,
          opacity: 0.3 + visualCharacteristics.harmony * 0.4,
          lineWidth: 1 + visualCharacteristics.energy * 2,
          size: 50 + visualCharacteristics.density * 30,
          width: 100 + visualCharacteristics.density * 50,
          height: 100 + visualCharacteristics.density * 50,
          intensity: visualCharacteristics.energy * 0.6,
          layerCount: 3,
          edgeFade: {
            enabled: true,
            fadeStart: 0.8,
            fadeEnd: 1.0
          }
        }
      },
      effects: {
        glow: visualCharacteristics.energy * 0.6,
        contrast: 0.5 + visualCharacteristics.harmony * 0.5,
        saturation: 0.3 + visualCharacteristics.energy * 0.7,
        hue: 0,
        brightness: 0.4 + visualCharacteristics.brightness * 0.6,
        vignette: visualCharacteristics.turbulence * 0.4
      },
      globalAnimationSpeed: visualCharacteristics.speed
    };
    
    console.log('🔧 Mapped data summary:');
    console.log('  - Geometric shapes mapped:', Object.keys(mappedData.geometric).length);
    console.log('  - Particles mapped:', !!mappedData.particles);
    console.log('  - Global effects mapped:', Object.keys(mappedData.globalEffects).length);
    console.log('  - Sample sphere count:', mappedData.geometric.spheres.count);
    console.log('  - Sample particle count:', mappedData.particles.count);
    console.log('  - Sample trail enabled:', mappedData.globalEffects.trails.enabled);
    
    return mappedData;
  }

  /**
   * Maps store properties to AI analysis format
   */
  static mapFromStore(store: VisualState): Partial<ThemeAnalysis> {
    const { geometric, particles, globalEffects, effects, globalAnimationSpeed } = store;
    
    return {
      theme: 'Generated from current scene',
      mood: ['dynamic', 'harmonious'],
      atmosphere: 'synthetic',
      visualCharacteristics: {
        saturation: effects.saturation,
        turbulence: globalEffects.distortion?.wave || 0,
        harmony: effects.contrast,
        energy: effects.glow,
        speed: globalAnimationSpeed,
        density: (geometric.spheres.count + geometric.cubes.count + geometric.toruses.count) / 100,
        brightness: effects.brightness
      },
      confidence: 0.8
    };
  }

  /**
   * Applies weather data to store properties
   */
  static applyWeatherData(weather: WeatherData, store: VisualState): Partial<VisualState> {
    const temperatureEffect = (weather.temperature - 50) / 50; // Normalize to -1 to 1
    const windEffect = weather.windSpeed / 50; // Normalize to 0 to 1
    
    return {
      globalAnimationSpeed: 0.5 + temperatureEffect * 0.5,
      globalEffects: {
        ...store.globalEffects,
        distortion: {
          ...store.globalEffects.distortion,
          wave: windEffect * 0.5,
          ripple: windEffect * 0.3
        }
      }
    };
  }

  /**
   * Applies enhanced color palette to store
   */
  static applyColorPalette(palette: EnhancedColorPalette, store: VisualState): Partial<VisualState> {
    return {
      geometric: {
        ...store.geometric,
        spheres: { ...store.geometric.spheres, color: palette.primary },
        cubes: { ...store.geometric.cubes, color: palette.secondary },
        toruses: { ...store.geometric.toruses, color: palette.accent },
        blobs: { ...store.geometric.blobs, color: palette.supporting[0] || palette.primary }
      },
      particles: {
        ...store.particles,
        color: palette.primary
      },
      globalEffects: {
        ...store.globalEffects,
        shapeGlow: {
          ...store.globalEffects.shapeGlow,
          customColor: palette.primary
        }
      }
    };
  }
} 