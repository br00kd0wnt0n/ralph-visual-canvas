import { ArtisticCanvasConfig } from '../../../types/artistic';

export const dynamicPaintingPreset: ArtisticCanvasConfig = {
  cameraConstraint: {
    enabled: true,
    position: [0, 0, 30],
    lookAt: [0, 0, 0],
    fov: 60,
    near: 1,
    far: 100,
  },
  paintingSystem: {
    enabled: true,
    canvasResolution: [1920, 1080],
    fadeRate: 0.005,
    blendModes: ['screen', 'color-dodge', 'overlay'],
    activeBlendMode: 'screen',
  },
  objectBehaviors: {
    spheres: {
      enabled: true,
      type: 'brush',
      brushSize: 25,
      opacity: 0.4,
      color: 'rainbow',
      brushTexture: 'watercolor',
      pressure: 1.0,
      interactions: { withOtherObjects: true, attractionRadius: 20 }
    },
    cubes: {
      enabled: true,
      type: 'splatter',
      brushSize: 15,
      opacity: 0.6,
      color: 'object',
      interactions: { withOtherObjects: false }
    },
    toruses: {
      enabled: true,
      type: 'trail',
      brushSize: 20,
      opacity: 0.5,
      color: 'temperature',
      trailLength: 50,
      trailWidth: 8,
      trailFade: 0.98,
      interactions: { withOtherObjects: false }
    },
    blobs: {
      enabled: true,
      type: 'glow',
      brushSize: 35,
      opacity: 0.3,
      color: 'rainbow',
      interactions: { withOtherObjects: true, attractionRadius: 30 }
    },
    ribbons: {
      enabled: true,
      type: 'trail',
      brushSize: 12,
      opacity: 0.7,
      color: 'rainbow',
      trailLength: 80,
      trailWidth: 6,
      trailFade: 0.99,
      interactions: { withOtherObjects: false }
    },
    crystals: {
      enabled: true,
      type: 'stamp',
      brushSize: 18,
      opacity: 0.4,
      color: 'object',
      stampSize: 12,
      stampShape: 'star',
      stampInterval: 30,
      interactions: { withOtherObjects: false }
    },
    particles: {
      enabled: true,
      type: 'splatter',
      brushSize: 3,
      opacity: 0.3,
      color: 'rainbow',
      interactions: { withOtherObjects: false }
    },
  },
  overlayEffects: {
    textureOverlay: {
      enabled: true,
      layers: [
        {
          texture: 'watercolor',
          opacity: 0.1,
          blendMode: 'overlay',
          scale: 1.5,
          movement: { x: 0.1, y: 0.05 }
        },
        {
          texture: 'noise',
          opacity: 0.08,
          blendMode: 'soft-light',
          scale: 3,
          movement: { x: -0.05, y: 0.02 }
        }
      ]
    },
    blendingLayer: {
      enabled: true,
      globalBlendMode: 'screen',
      colorGrading: {
        saturation: 1.3,
        contrast: 1.2,
        brightness: 1.1,
        temperature: 0.1,
        tint: 0.05,
      },
      cohesionBlur: 0.3,
    },
    paintingTrails: {
      enabled: true,
      maxTrails: 200,
      trailQuality: 'high',
      velocityInfluence: 0.8,
      temperatureMapping: true,
    },
    cohesionEffects: {
      enabled: true,
      connectionLines: { enabled: true, maxDistance: 40, opacity: 0.2, thickness: 2, color: 'temperature' },
      fieldEffects: { enabled: true, strength: 0.2, range: 25, visualizeField: false },
      ambientGlow: { enabled: true, intensity: 0.3, radius: 80, color: 'auto' },
    },
  },
}; 