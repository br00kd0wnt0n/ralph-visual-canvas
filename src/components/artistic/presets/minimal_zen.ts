import { ArtisticCanvasConfig } from '../../../types/artistic';

export const minimalZenPreset: ArtisticCanvasConfig = {
  cameraConstraint: {
    enabled: true,
    position: [0, 0, 20],
    lookAt: [0, 0, 0],
    fov: 45,
    near: 1,
    far: 100,
  },
  paintingSystem: {
    enabled: true,
    canvasResolution: [1920, 1080],
    fadeRate: 0.01,
    blendModes: ['normal', 'multiply', 'soft-light'],
    activeBlendMode: 'normal',
  },
  objectBehaviors: {
    spheres: {
      enabled: true,
      type: 'brush',
      brushSize: 8,
      opacity: 0.15,
      color: 'object',
      brushTexture: 'soft',
      pressure: 0.5,
      interactions: { withOtherObjects: false }
    },
    cubes: {
      enabled: false,
      type: 'stamp',
      brushSize: 5,
      opacity: 0.1,
      color: 'object',
      interactions: { withOtherObjects: false }
    },
    toruses: {
      enabled: true,
      type: 'trail',
      brushSize: 6,
      opacity: 0.2,
      color: 'object',
      trailLength: 20,
      trailWidth: 2,
      trailFade: 0.9,
      interactions: { withOtherObjects: false }
    },
    blobs: {
      enabled: false,
      type: 'glow',
      brushSize: 15,
      opacity: 0.1,
      color: 'temperature',
      interactions: { withOtherObjects: false }
    },
    ribbons: {
      enabled: false,
      type: 'trail',
      brushSize: 3,
      opacity: 0.25,
      color: 'object',
      interactions: { withOtherObjects: false }
    },
    crystals: {
      enabled: true,
      type: 'ripple',
      brushSize: 5,
      opacity: 0.15,
      color: 'object',
      interactions: { withOtherObjects: false }
    },
    particles: {
      enabled: false,
      type: 'brush',
      brushSize: 1,
      opacity: 0.05,
      color: 'object',
      interactions: { withOtherObjects: false }
    },
  },
  overlayEffects: {
    textureOverlay: {
      enabled: true,
      layers: [
        {
          texture: 'paper',
          opacity: 0.03,
          blendMode: 'multiply',
          scale: 1,
          movement: { x: 0, y: 0 }
        }
      ]
    },
    blendingLayer: {
      enabled: true,
      globalBlendMode: 'normal',
      colorGrading: {
        saturation: 0.9,
        contrast: 1.0,
        brightness: 1.0,
        temperature: -0.1,
        tint: 0,
      },
      cohesionBlur: 0.8,
    },
    paintingTrails: {
      enabled: true,
      maxTrails: 50,
      trailQuality: 'low',
      velocityInfluence: 0.2,
      temperatureMapping: false,
    },
    cohesionEffects: {
      enabled: false,
      connectionLines: { enabled: false, maxDistance: 30, opacity: 0.05, thickness: 1, color: 'auto' },
      fieldEffects: { enabled: false, strength: 0.05, range: 20, visualizeField: false },
      ambientGlow: { enabled: false, intensity: 0.1, radius: 50, color: 'auto' },
    },
  },
}; 