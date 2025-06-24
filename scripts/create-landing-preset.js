// Script to create LANDING - Basic preset in localStorage
// Run this in the browser console or as a Node.js script

const landingBasicPreset = {
  "LANDING - Basic": {
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
      enabled: true,
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
    location: 'New York City',
    savedAt: new Date().toISOString(),
    version: '1.0'
  }
};

// Function to add the preset to localStorage
function addLandingBasicPreset() {
  try {
    // Get existing presets
    const existingPresets = JSON.parse(localStorage.getItem('visualPresets') || '{}');
    
    // Add the new preset
    const updatedPresets = { ...existingPresets, ...landingBasicPreset };
    
    // Save back to localStorage
    localStorage.setItem('visualPresets', JSON.stringify(updatedPresets));
    
    console.log('✅ LANDING - Basic preset added to localStorage');
    console.log('Available presets:', Object.keys(updatedPresets));
    
    return true;
  } catch (error) {
    console.error('❌ Error adding LANDING - Basic preset:', error);
    return false;
  }
}

// Export for use in Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { addLandingBasicPreset, landingBasicPreset };
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  addLandingBasicPreset();
} 