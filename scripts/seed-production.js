const { MongoClient } = require('mongodb');

// This script should be run on Railway with the MONGODB_URI environment variable set
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is required');
  process.exit(1);
}

const samplePresets = [
  {
    name: 'LANDING - Basic',
    description: 'Default landing page preset with logo enabled and clean setup',
    category: 'default',
    tags: ['landing', 'basic', 'logo', 'default'],
    data: {
      ui: {
        showDashboards: false,
        cameraPositioningMode: false
      },
      background: {
        opacity: 0.8,
        blur: 2,
        color: '#000011',
        gradient: true
      },
      backgroundConfig: {
        enabled: false,
        mode: 'full3D',
        viewport: {
          bounds: {
            x: [-60, 60],
            y: [-35, 35],
            z: [-80, 20]
          },
          safeZone: 0.8
        },
        timeScale: 1.0,
        camera: {
          fixed: false,
          position: [0, 0, 60],
          target: [0, 0, 0]
        },
        artisticLayout: {
          layers: {
            deepBackground: {
              zPosition: -80,
              objects: ['metamorphosis'],
              opacity: 0.6,
              movement: 'minimal'
            },
            farBackground: {
              zPosition: -50,
              objects: ['waveInterference'],
              opacity: 0.8,
              movement: 'slow'
            },
            midBackground: {
              zPosition: -20,
              objects: [],
              opacity: 0.9,
              movement: 'normal'
            },
            nearBackground: {
              zPosition: -5,
              objects: ['blobs', 'spheres', 'cubes'],
              opacity: 1,
              movement: 'normal'
            },
            foreground: {
              zPosition: 5,
              objects: ['fireflies'],
              opacity: 1,
              movement: 'active'
            }
          },
          camera: {
            position: [0, 0, 60],
            target: [0, 0, 0],
            fov: 75
          },
          viewport: {
            bounds: {
              x: [-60, 60],
              y: [-35, 35],
              z: [-80, 20]
            }
          }
        }
      },
      logo: {
        enabled: false,
        size: 800,
        position: {
          x: 'center',
          y: 'center'
        },
        offset: {
          x: 0,
          y: 0
        },
        opacity: 1.0,
        animation: {
          enabled: false,
          type: 'none',
          speed: 1.0
        }
      },
      geometric: {
        spheres: {
          count: 12,
          size: 1.5,
          color: '#00ff88',
          speed: 1.5,
          rotation: 0,
          opacity: 0.9,
          organicness: 0.8,
          movementPattern: 'verticalSine',
          distance: 2.0,
          pulseEnabled: false,
          pulseSize: 1.0
        },
        cubes: {
          count: 10,
          size: 1.2,
          color: '#ff00cc',
          rotation: 1.2,
          speed: 1.0,
          opacity: 0.8,
          organicness: 0.6,
          movementPattern: 'orbit',
          distance: 2.5,
          pulseEnabled: false,
          pulseSize: 1.0
        },
        toruses: {
          count: 8,
          size: 1.8,
          color: '#ffa500',
          speed: 1.2,
          rotation: 0,
          opacity: 0.7,
          organicness: 1.0,
          movementPattern: 'verticalSine',
          distance: 2.0,
          pulseEnabled: false,
          pulseSize: 1.0
        },
        blobs: {
          count: 6,
          size: 1.8,
          color: '#9370db',
          speed: 1.0,
          opacity: 1.0,
          organicness: 1.5,
          movementPattern: 'orbit',
          distance: 3.0,
          pulseEnabled: false,
          pulseSize: 1.0
        },
        crystals: {
          count: 8,
          size: 1.0,
          color: '#4ecdc4',
          rotation: 2.0,
          opacity: 0.9,
          complexity: 16,
          organicness: 0.2
        },
        waveInterference: {
          color: '#00ffff'
        },
        metamorphosis: {
          color: '#00ffff'
        },
        fireflies: {
          color: '#ffff00'
        },
        layeredSineWaves: {
          color: '#ffff00'
        }
      },
      particles: {
        count: 800,
        size: 0.1,
        color: '#ff1493',
        speed: 1.5,
        opacity: 1.0,
        spread: 40,
        movementPattern: 'random',
        distance: 1.5,
        pulseEnabled: false,
        pulseSize: 1.0
      },
      globalEffects: {
        atmosphericBlur: {
          enabled: false,
          intensity: 0.5,
          layers: 10
        },
        colorBlending: {
          enabled: false,
          mode: 'screen',
          intensity: 1.0
        },
        shapeGlow: {
          enabled: false,
          intensity: 1.0,
          radius: 50,
          useObjectColor: true,
          customColor: '#ffffff',
          pulsing: false,
          pulseSpeed: 1.0
        },
        chromatic: {
          enabled: false,
          aberration: 0.5,
          aberrationColors: {
            red: '#ff0000',
            green: '#00ff00',
            blue: '#0000ff'
          },
          rainbow: {
            enabled: false,
            intensity: 0.5,
            speed: 1.0,
            rotation: 0,
            blendMode: 'screen',
            colors: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'],
            opacity: 0.3
          },
          prism: 0
        },
        distortion: {
          enabled: false,
          wave: 0,
          ripple: 0,
          noise: 0,
          frequency: 1
        },
        particleInteraction: {
          enabled: false,
          magnetism: 0,
          repulsion: 0,
          flowField: false,
          turbulence: 0
        },
        volumetric: {
          enabled: false,
          fog: 0,
          lightShafts: 0,
          density: 0.5,
          color: '#4169e1'
        },
        trails: {
          enabled: false,
          sphereTrails: {
            enabled: false,
            length: 20,
            opacity: 0.7,
            width: 0.1,
            fadeRate: 0.95
          },
          cubeTrails: {
            enabled: false,
            length: 15,
            opacity: 0.6,
            width: 0.08,
            fadeRate: 0.94
          },
          blobTrails: {
            enabled: false,
            length: 25,
            opacity: 0.7,
            width: 0.12,
            fadeRate: 0.96
          },
          torusTrails: {
            enabled: false,
            length: 20,
            opacity: 0.6,
            width: 0.1,
            fadeRate: 0.95
          },
          particleTrails: {
            enabled: false,
            length: 15,
            opacity: 0.5,
            width: 0.05,
            fadeRate: 0.97
          }
        },
        waveInterference: {
          enabled: false,
          speed: 0.5,
          amplitude: 1.0,
          contourLevels: 5,
          preset: 1,
          edgeFade: {
            enabled: true,
            fadeStart: 0.3,
            fadeEnd: 0.7
          }
        },
        metamorphosis: {
          enabled: false,
          morphSpeed: 1.0,
          rotationSpeed: 0.5,
          wireframeOpacity: 0.4,
          size: 1.0,
          blur: 0.5,
          intensity: 1.0,
          layers: 1
        },
        fireflies: {
          enabled: false,
          count: 100,
          speed: 0.5,
          glowIntensity: 1.5,
          swarmRadius: 30
        },
        layeredSineWaves: {
          enabled: false,
          layers: 50,
          points: 100,
          waveAmplitude: 10,
          speed: 0.5,
          opacity: 0.5,
          lineWidth: 1.0,
          size: 1.0,
          width: 100,
          height: 100,
          intensity: 1.0,
          layerCount: 5,
          edgeFade: {
            enabled: true,
            fadeStart: 0.3,
            fadeEnd: 0.7
          }
        }
      },
      effects: {
        glow: 0.6,
        contrast: 1.2,
        saturation: 1.5,
        hue: 0,
        brightness: 1.1,
        vignette: 0.15
      },
      camera: {
        distance: 12,
        height: 2,
        fov: 60,
        position: [0, 2, 12],
        target: [0, 0, 0],
        rotation: {
          x: 0,
          y: 0,
          z: 0
        },
        autoRotate: false,
        autoRotateSpeed: 0.5,
        damping: 0.05,
        enableZoom: true,
        enablePan: true,
        enableRotate: true,
        minDistance: 5,
        maxDistance: 50,
        minPolarAngle: 0,
        maxPolarAngle: 3.141592653589793,
        autoPan: {
          enabled: false,
          speed: 0.15,
          radius: 15,
          height: 3,
          easing: 0.015,
          currentAngle: 0
        },
        depthOfField: {
          enabled: false,
          focusDistance: 10,
          focalLength: 50,
          bokehScale: 1,
          blur: 0.5
        }
      },
      globalAnimationSpeed: 1.0,
      globalBlendMode: {
        mode: 'normal',
        opacity: 0.5
      },
      location: 'New York City'
    },
    isPublic: true,
    createdBy: 'system',
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Sunset Glow',
    description: 'A warm sunset-inspired visual preset with orange and red tones',
    category: 'nature',
    tags: ['sunset', 'warm', 'orange', 'red'],
    data: {
      camera: {
        distance: 15,
        height: 3,
        fov: 60,
        position: [0, 3, 15],
        target: [0, 0, 0],
        rotation: { x: 0, y: 0, z: 0 },
        autoRotate: true,
        autoRotateSpeed: 0.3,
        damping: 0.05,
        enableZoom: true,
        enablePan: true,
        enableRotate: true,
        minDistance: 5,
        maxDistance: 50,
        minPolarAngle: 0,
        maxPolarAngle: 3.141592653589793
      },
      particles: {
        count: 800,
        size: 0.02,
        color: '#ff6b35',
        speed: 0.4,
        opacity: 0.8,
        spread: 25
      },
      geometric: {
        spheres: {
          count: 15,
          size: 2.8,
          color: '#ff4500',
          speed: 0.2,
          opacity: 0.6,
          organicness: 1.2
        },
        cubes: {
          count: 10,
          size: 1.2,
          color: '#ff6347',
          rotation: 1.0,
          opacity: 0.5,
          organicness: 0.8
        },
        toruses: {
          count: 6,
          size: 3.5,
          color: '#ff4500',
          speed: 0.3,
          opacity: 0.7,
          organicness: 0.9
        },
        blobs: {
          count: 8,
          size: 2.2,
          color: '#ff4500',
          speed: 0.4,
          opacity: 0.9,
          organicness: 1.1
        },
        crystals: {
          count: 12,
          size: 1.5,
          color: '#ff6347',
          rotation: 1.8,
          opacity: 0.8,
          complexity: 12,
          organicness: 0.3
        },
        waveInterference: { color: '#ff4500' },
        metamorphosis: { color: '#ff6347' },
        fireflies: { color: '#ff4500' },
        layeredSineWaves: { color: '#ff4500' }
      },
      globalEffects: {
        atmosphericBlur: {
          enabled: true,
          intensity: 0.3,
          layers: 15
        },
        colorBlending: {
          enabled: true,
          mode: 'multiply',
          intensity: 1.2
        },
        shapeGlow: {
          enabled: true,
          intensity: 1.5,
          radius: 60,
          useObjectColor: true,
          customColor: '#ff4500',
          pulsing: true,
          pulseSpeed: 0.8
        },
        chromatic: {
          enabled: true,
          aberration: 1.5,
          aberrationColors: {
            red: '#ff4500',
            green: '#ff6347',
            blue: '#ff4500'
          },
          rainbow: {
            enabled: false,
            intensity: 0,
            speed: 1,
            rotation: 0,
            blendMode: 'screen',
            colors: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'],
            opacity: 0.3
          },
          prism: 0
        },
        distortion: {
          enabled: false,
          wave: 0,
          ripple: 0,
          noise: 0,
          frequency: 1
        },
        particleInteraction: {
          enabled: false,
          magnetism: 0,
          repulsion: 0,
          flowField: false,
          turbulence: 0
        },
        volumetric: {
          enabled: false,
          fog: 0,
          lightShafts: 0,
          density: 0.5,
          color: '#4169e1'
        },
        trails: {
          enabled: true,
          sphereTrails: {
            enabled: true,
            length: 25,
            opacity: 0.7,
            width: 0.15,
            fadeRate: 0.92
          },
          cubeTrails: {
            enabled: false,
            length: 15,
            opacity: 0.5,
            width: 0.08,
            fadeRate: 0.94
          },
          blobTrails: {
            enabled: false,
            length: 25,
            opacity: 0.7,
            width: 0.12,
            fadeRate: 0.96
          }
        },
        waveInterference: {
          enabled: true,
          speed: 0.15,
          amplitude: 1.8,
          contourLevels: 5,
          edgeFade: {
            enabled: true,
            fadeStart: 0.4,
            fadeEnd: 0.6
          }
        },
        metamorphosis: {
          enabled: false,
          morphSpeed: 0.5,
          rotationSpeed: 0.1,
          wireframeOpacity: 0.3,
          size: 1.5,
          blur: 1
        },
        fireflies: {
          enabled: true,
          count: 150,
          speed: 0.5,
          glowIntensity: 2.2,
          swarmRadius: 50
        },
        layeredSineWaves: {
          enabled: true,
          layers: 120,
          points: 100,
          waveAmplitude: 18,
          speed: 0.25,
          opacity: 0.5,
          lineWidth: 1.6,
          size: 0.8,
          width: 220,
          height: 220,
          edgeFade: {
            enabled: true,
            fadeStart: 0.7,
            fadeEnd: 0.4
          },
          connectingLines: false
        }
      },
      effects: {
        glow: 0.8,
        contrast: 1.3,
        saturation: 1.6,
        hue: 0,
        brightness: 1.2,
        vignette: 0.2
      },
      background: {
        opacity: 0.9,
        blur: 1.5,
        color: '#1a0f0f',
        gradient: true
      },
      backgroundConfig: {
        enabled: false,
        mode: 'full3D',
        viewport: {
          bounds: {
            x: [-60, 60],
            y: [-35, 35],
            z: [-80, 20]
          },
          safeZone: 0.8
        },
        timeScale: 1,
        camera: {
          fixed: false,
          position: [0, 0, 60],
          target: [0, 0, 0]
        },
        artisticLayout: {
          layers: {
            deepBackground: {
              zPosition: -80,
              objects: ['metamorphosis'],
              opacity: 0.6,
              movement: 'minimal'
            },
            farBackground: {
              zPosition: -50,
              objects: ['waveInterference'],
              opacity: 0.8,
              movement: 'slow'
            },
            midBackground: {
              zPosition: -20,
              objects: [],
              opacity: 0.9,
              movement: 'normal'
            },
            nearBackground: {
              zPosition: -5,
              objects: ['blobs', 'spheres', 'cubes'],
              opacity: 1,
              movement: 'normal'
            },
            foreground: {
              zPosition: 5,
              objects: ['fireflies'],
              opacity: 1,
              movement: 'active'
            }
          },
          camera: {
            position: [0, 0, 60],
            target: [0, 0, 0],
            fov: 75
          },
          viewport: {
            bounds: {
              x: [-60, 60],
              y: [-35, 35],
              z: [-80, 20]
            }
          }
        }
      },
      ui: {},
      globalAnimationSpeed: 1
    },
    isPublic: true,
    createdBy: 'system',
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Ocean Waves',
    description: 'Cool blue ocean-inspired preset with calming wave effects',
    category: 'nature',
    tags: ['ocean', 'blue', 'calm', 'waves'],
    data: {
      camera: {
        distance: 20,
        height: 5,
        fov: 45,
        position: [0, 5, 20],
        target: [0, 0, 0],
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
        maxPolarAngle: 3.141592653589793
      },
      particles: {
        count: 1200,
        size: 0.015,
        color: '#4169e1',
        speed: 0.3,
        opacity: 0.7,
        spread: 30
      },
      geometric: {
        spheres: {
          count: 20,
          size: 2.0,
          color: '#1e90ff',
          speed: 0.15,
          opacity: 0.4,
          organicness: 1.8
        },
        cubes: {
          count: 6,
          size: 0.8,
          color: '#00bfff',
          rotation: 0.8,
          opacity: 0.3,
          organicness: 1.2
        },
        toruses: {
          count: 4,
          size: 4.0,
          color: '#4169e1',
          speed: 0.2,
          opacity: 0.6,
          organicness: 1.5
        },
        blobs: {
          count: 12,
          size: 1.5,
          color: '#00bfff',
          speed: 0.25,
          opacity: 0.8,
          organicness: 1.3
        },
        crystals: {
          count: 8,
          size: 1.2,
          color: '#1e90ff',
          rotation: 1.2,
          opacity: 0.7,
          complexity: 14,
          organicness: 0.4
        },
        waveInterference: { color: '#4169e1' },
        metamorphosis: { color: '#00bfff' },
        fireflies: { color: '#1e90ff' },
        layeredSineWaves: { color: '#4169e1' }
      },
      globalEffects: {
        atmosphericBlur: {
          enabled: true,
          intensity: 0.2,
          layers: 20
        },
        colorBlending: {
          enabled: true,
          mode: 'screen',
          intensity: 0.8
        },
        shapeGlow: {
          enabled: true,
          intensity: 1.2,
          radius: 80,
          useObjectColor: true,
          customColor: '#4169e1',
          pulsing: false,
          pulseSpeed: 1
        },
        chromatic: {
          enabled: false,
          aberration: 0.5,
          aberrationColors: {
            red: '#4169e1',
            green: '#00bfff',
            blue: '#1e90ff'
          },
          rainbow: {
            enabled: false,
            intensity: 0,
            speed: 1,
            rotation: 0,
            blendMode: 'screen',
            colors: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'],
            opacity: 0.3
          },
          prism: 0
        },
        distortion: {
          enabled: false,
          wave: 0,
          ripple: 0,
          noise: 0,
          frequency: 1
        },
        particleInteraction: {
          enabled: false,
          magnetism: 0,
          repulsion: 0,
          flowField: false,
          turbulence: 0
        },
        volumetric: {
          enabled: false,
          fog: 0,
          lightShafts: 0,
          density: 0.5,
          color: '#4169e1'
        },
        trails: {
          enabled: true,
          sphereTrails: {
            enabled: false,
            length: 20,
            opacity: 0.6,
            width: 0.1,
            fadeRate: 0.95
          },
          cubeTrails: {
            enabled: false,
            length: 15,
            opacity: 0.5,
            width: 0.08,
            fadeRate: 0.94
          },
          blobTrails: {
            enabled: false,
            length: 25,
            opacity: 0.7,
            width: 0.12,
            fadeRate: 0.96
          }
        },
        waveInterference: {
          enabled: true,
          speed: 0.08,
          amplitude: 2.2,
          contourLevels: 6,
          edgeFade: {
            enabled: true,
            fadeStart: 0.3,
            fadeEnd: 0.7
          }
        },
        metamorphosis: {
          enabled: false,
          morphSpeed: 0.5,
          rotationSpeed: 0.1,
          wireframeOpacity: 0.3,
          size: 1.5,
          blur: 1
        },
        fireflies: {
          enabled: true,
          count: 80,
          speed: 0.3,
          glowIntensity: 1.6,
          swarmRadius: 40
        },
        layeredSineWaves: {
          enabled: true,
          layers: 200,
          points: 120,
          waveAmplitude: 25,
          speed: 0.15,
          opacity: 0.6,
          lineWidth: 1.2,
          size: 0.6,
          width: 250,
          height: 250,
          edgeFade: {
            enabled: true,
            fadeStart: 0.8,
            fadeEnd: 0.3
          },
          connectingLines: false
        }
      },
      effects: {
        glow: 0.4,
        contrast: 1.1,
        saturation: 1.3,
        hue: 0,
        brightness: 0.9,
        vignette: 0.1
      },
      background: {
        opacity: 0.8,
        blur: 2.5,
        color: '#0a0a2a',
        gradient: true
      },
      backgroundConfig: {
        enabled: false,
        mode: 'full3D',
        viewport: {
          bounds: {
            x: [-60, 60],
            y: [-35, 35],
            z: [-80, 20]
          },
          safeZone: 0.8
        },
        timeScale: 1,
        camera: {
          fixed: false,
          position: [0, 0, 60],
          target: [0, 0, 0]
        },
        artisticLayout: {
          layers: {
            deepBackground: {
              zPosition: -80,
              objects: ['metamorphosis'],
              opacity: 0.6,
              movement: 'minimal'
            },
            farBackground: {
              zPosition: -50,
              objects: ['waveInterference'],
              opacity: 0.8,
              movement: 'slow'
            },
            midBackground: {
              zPosition: -20,
              objects: [],
              opacity: 0.9,
              movement: 'normal'
            },
            nearBackground: {
              zPosition: -5,
              objects: ['blobs', 'spheres', 'cubes'],
              opacity: 1,
              movement: 'normal'
            },
            foreground: {
              zPosition: 5,
              objects: ['fireflies'],
              opacity: 1,
              movement: 'active'
            }
          },
          camera: {
            position: [0, 0, 60],
            target: [0, 0, 0],
            fov: 75
          },
          viewport: {
            bounds: {
              x: [-60, 60],
              y: [-35, 35],
              z: [-80, 20]
            }
          }
        }
      },
      ui: {},
      globalAnimationSpeed: 0.8
    },
    isPublic: true,
    createdBy: 'system',
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Neon City',
    description: 'Cyberpunk-inspired preset with neon colors and urban vibes',
    category: 'urban',
    tags: ['neon', 'cyberpunk', 'urban', 'purple'],
    data: {
      camera: {
        distance: 12,
        height: 2,
        fov: 70,
        position: [0, 2, 12],
        target: [0, 0, 0],
        rotation: { x: 0, y: 0, z: 0 },
        autoRotate: true,
        autoRotateSpeed: 0.5,
        damping: 0.05,
        enableZoom: true,
        enablePan: true,
        enableRotate: true,
        minDistance: 5,
        maxDistance: 50,
        minPolarAngle: 0,
        maxPolarAngle: 3.141592653589793
      },
      particles: {
        count: 1500,
        size: 0.025,
        color: '#ff00ff',
        speed: 0.6,
        opacity: 0.9,
        spread: 35
      },
      geometric: {
        spheres: {
          count: 18,
          size: 1.8,
          color: '#8a2be2',
          speed: 0.4,
          opacity: 0.7,
          organicness: 0.8
        },
        cubes: {
          count: 15,
          size: 1.0,
          color: '#ff00ff',
          rotation: 2.2,
          opacity: 0.6,
          organicness: 0.6
        },
        toruses: {
          count: 8,
          size: 2.8,
          color: '#9400d3',
          speed: 0.7,
          opacity: 0.8,
          organicness: 0.7
        },
        blobs: {
          count: 10,
          size: 1.6,
          color: '#ff00ff',
          speed: 0.5,
          opacity: 0.9,
          organicness: 0.9
        },
        crystals: {
          count: 14,
          size: 1.3,
          color: '#8a2be2',
          rotation: 2.5,
          opacity: 0.8,
          complexity: 18,
          organicness: 0.2
        },
        waveInterference: { color: '#ff00ff' },
        metamorphosis: { color: '#8a2be2' },
        fireflies: { color: '#ff00ff' },
        layeredSineWaves: { color: '#9400d3' }
      },
      globalEffects: {
        atmosphericBlur: {
          enabled: true,
          intensity: 0.4,
          layers: 12
        },
        colorBlending: {
          enabled: true,
          mode: 'add',
          intensity: 1.5
        },
        shapeGlow: {
          enabled: true,
          intensity: 2.0,
          radius: 50,
          useObjectColor: true,
          customColor: '#ff00ff',
          pulsing: true,
          pulseSpeed: 1.2
        },
        chromatic: {
          enabled: true,
          aberration: 2.0,
          aberrationColors: {
            red: '#ff00ff',
            green: '#8a2be2',
            blue: '#9400d3'
          },
          rainbow: {
            enabled: false,
            intensity: 0,
            speed: 1,
            rotation: 0,
            blendMode: 'screen',
            colors: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'],
            opacity: 0.3
          },
          prism: 0
        },
        distortion: {
          enabled: false,
          wave: 0,
          ripple: 0,
          noise: 0,
          frequency: 1
        },
        particleInteraction: {
          enabled: false,
          magnetism: 0,
          repulsion: 0,
          flowField: false,
          turbulence: 0
        },
        volumetric: {
          enabled: false,
          fog: 0,
          lightShafts: 0,
          density: 0.5,
          color: '#4169e1'
        },
        trails: {
          enabled: true,
          sphereTrails: {
            enabled: true,
            length: 30,
            opacity: 0.8,
            width: 0.2,
            fadeRate: 0.88
          },
          cubeTrails: {
            enabled: true,
            length: 20,
            opacity: 0.7,
            width: 0.15,
            fadeRate: 0.90
          },
          blobTrails: {
            enabled: false,
            length: 25,
            opacity: 0.7,
            width: 0.12,
            fadeRate: 0.96
          }
        },
        waveInterference: {
          enabled: true,
          speed: 0.2,
          amplitude: 1.5,
          contourLevels: 4,
          edgeFade: {
            enabled: true,
            fadeStart: 0.2,
            fadeEnd: 0.5
          }
        },
        metamorphosis: {
          enabled: false,
          morphSpeed: 0.5,
          rotationSpeed: 0.1,
          wireframeOpacity: 0.3,
          size: 1.5,
          blur: 1
        },
        fireflies: {
          enabled: true,
          count: 200,
          speed: 0.8,
          glowIntensity: 2.5,
          swarmRadius: 60
        },
        layeredSineWaves: {
          enabled: true,
          layers: 100,
          points: 60,
          waveAmplitude: 12,
          speed: 0.3,
          opacity: 0.7,
          lineWidth: 1.8,
          size: 0.9,
          width: 180,
          height: 180,
          edgeFade: {
            enabled: true,
            fadeStart: 0.6,
            fadeEnd: 0.4
          },
          connectingLines: false
        }
      },
      effects: {
        glow: 1.0,
        contrast: 1.5,
        saturation: 1.8,
        hue: 0,
        brightness: 0.8,
        vignette: 0.3
      },
      background: {
        opacity: 0.7,
        blur: 1.0,
        color: '#1a0033',
        gradient: true
      },
      backgroundConfig: {
        enabled: false,
        mode: 'full3D',
        viewport: {
          bounds: {
            x: [-60, 60],
            y: [-35, 35],
            z: [-80, 20]
          },
          safeZone: 0.8
        },
        timeScale: 1,
        camera: {
          fixed: false,
          position: [0, 0, 60],
          target: [0, 0, 0]
        },
        artisticLayout: {
          layers: {
            deepBackground: {
              zPosition: -80,
              objects: ['metamorphosis'],
              opacity: 0.6,
              movement: 'minimal'
            },
            farBackground: {
              zPosition: -50,
              objects: ['waveInterference'],
              opacity: 0.8,
              movement: 'slow'
            },
            midBackground: {
              zPosition: -20,
              objects: [],
              opacity: 0.9,
              movement: 'normal'
            },
            nearBackground: {
              zPosition: -5,
              objects: ['blobs', 'spheres', 'cubes'],
              opacity: 1,
              movement: 'normal'
            },
            foreground: {
              zPosition: 5,
              objects: ['fireflies'],
              opacity: 1,
              movement: 'active'
            }
          },
          camera: {
            position: [0, 0, 60],
            target: [0, 0, 0],
            fov: 75
          },
          viewport: {
            bounds: {
              x: [-60, 60],
              y: [-35, 35],
              z: [-80, 20]
            }
          }
        }
      },
      ui: {},
      globalAnimationSpeed: 1.2
    },
    isPublic: true,
    createdBy: 'system',
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedProductionPresets() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('visual-canvas');
    const collection = db.collection('presets');
    
    // Clear existing sample presets (only the ones we created)
    await collection.deleteMany({ 
      name: { $in: ['LANDING - Basic', 'Sunset Glow', 'Ocean Waves', 'Neon City'] }
    });
    console.log('Cleared existing sample presets');
    
    // Insert sample presets
    const result = await collection.insertMany(samplePresets);
    console.log(`Inserted ${result.insertedCount} presets`);
    
    // List all presets
    const allPresets = await collection.find({}).toArray();
    console.log('All presets:', allPresets.map(p => ({ id: p._id, name: p.name })));
    
  } catch (error) {
    console.error('Error seeding presets:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedProductionPresets(); 