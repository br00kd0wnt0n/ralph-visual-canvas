import { ArtisticCanvasConfig } from '../../../types/artistic';

export const subtleFlowPreset: ArtisticCanvasConfig = {
  cameraConstraint: {
    enabled: true,
    position: [0, 0, 25],
    lookAt: [0, 0, 0],
    fov: 50,
    near: 1,
    far: 100,
  },
  paintingSystem: {
    enabled: true,
    canvasResolution: [1920, 1080],
    fadeRate: 0.02,
    blendModes: ['soft-light', 'overlay', 'screen'],
    activeBlendMode: 'soft-light',
  },
  objectBehaviors: {
    spheres: {
      enabled: true,
      type: 'trail',
      brushSize: 15,
      opacity: 0.3,
      color: 'object',
      trailLength: 30,
      trailWidth: 3,
      trailFade: 0.95,
      interactions: { withOtherObjects: false }
    },
    cubes: {
      enabled: true,
      type: 'stamp',
      brushSize: 8,
      opacity: 0.2,
      color: 'object',
      stampSize: 6,
      stampShape: 'square',
      stampInterval: 60,
      interactions: { withOtherObjects: false }
    },
    toruses: {
      enabled: true,
      type: 'brush',
      brushSize: 12,
      opacity: 0.25,
      color: 'object',
      brushTexture: 'soft',
      pressure: 0.7,
      interactions: { withOtherObjects: false }
    },
    blobs: {
      enabled: true,
      type: 'glow',
      brushSize: 20,
      opacity: 0.15,
      color: 'temperature',
      interactions: { withOtherObjects: false }
    },
    ribbons: {
      enabled: false,
      type: 'trail',
      brushSize: 5,
      opacity: 0.4,
      color: 'rainbow',
      interactions: { withOtherObjects: false }
    },
    crystals: {
      enabled: true,
      type: 'ripple',
      brushSize: 10,
      opacity: 0.2,
      color: 'object',
      interactions: { withOtherObjects: false }
    },
    particles: {
      enabled: true,
      type: 'brush',
      brushSize: 2,
      opacity: 0.1,
      color: 'object',
      brushTexture: 'soft',
      interactions: { withOtherObjects: false }
    },
  },
  overlayEffects: {
    textureOverlay: {
      enabled: true,
      layers: [
        {
          texture: 'noise',
          opacity: 0.05,
          blendMode: 'overlay',
          scale: 2,
          movement: { x: 0, y: 0 }
        }
      ]
    },
    blendingLayer: {
      enabled: true,
      globalBlendMode: 'normal',
      colorGrading: {
        saturation: 1.1,
        contrast: 1.05,
        brightness: 1.0,
        temperature: 0,
        tint: 0,
      },
      cohesionBlur: 0.5,
    },
    paintingTrails: {
      enabled: true,
      maxTrails: 100,
      trailQuality: 'medium',
      velocityInfluence: 0.5,
      temperatureMapping: true,
    },
    cohesionEffects: {
      enabled: false,
      connectionLines: { enabled: false, maxDistance: 50, opacity: 0.1, thickness: 1, color: 'auto' },
      fieldEffects: { enabled: false, strength: 0.1, range: 30, visualizeField: false },
      ambientGlow: { enabled: false, intensity: 0.2, radius: 100, color: 'auto' },
    },
  },
}; 