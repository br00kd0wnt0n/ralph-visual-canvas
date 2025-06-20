// Artistic Canvas System TypeScript Interfaces

export type BlendMode = 
  | 'normal' 
  | 'multiply' 
  | 'screen' 
  | 'overlay' 
  | 'soft-light' 
  | 'hard-light' 
  | 'color-dodge' 
  | 'color-burn' 
  | 'darken' 
  | 'lighten' 
  | 'difference' 
  | 'exclusion' 
  | 'hue' 
  | 'saturation' 
  | 'color' 
  | 'luminosity';

export type PaintingType = 'trail' | 'stamp' | 'brush' | 'splatter' | 'ripple' | 'glow';

export type ColorSource = 'object' | 'temperature' | 'rainbow' | 'custom';

export type BrushTexture = 'soft' | 'hard' | 'watercolor' | 'oil' | 'pencil' | 'spray';

export type StampShape = 'circle' | 'square' | 'triangle' | 'star' | 'cross' | 'diamond';

export interface PaintingBehavior {
  enabled: boolean;
  type: PaintingType;
  brushSize: number;
  opacity: number;
  color: ColorSource;
  customColor?: string;
  
  // Trail-specific properties
  trailLength?: number;
  trailWidth?: number;
  trailFade?: number;
  
  // Stamp-specific properties
  stampSize?: number;
  stampShape?: StampShape;
  stampInterval?: number;
  
  // Brush-specific properties
  brushTexture?: BrushTexture;
  pressure?: number;
  
  // Splatter-specific properties
  splatterCount?: number;
  splatterSpread?: number;
  
  // Ripple-specific properties
  rippleSpeed?: number;
  rippleAmplitude?: number;
  
  // Glow-specific properties
  glowIntensity?: number;
  glowRadius?: number;
  
  // Interaction properties
  interactions: {
    withOtherObjects: boolean;
    attractionRadius?: number;
    repulsionRadius?: number;
  };
}

export interface CameraConstraint {
  enabled: boolean;
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
  near: number;
  far: number;
}

export interface PaintingSystem {
  enabled: boolean;
  canvasResolution: [number, number];
  fadeRate: number;
  blendModes: BlendMode[];
  activeBlendMode: BlendMode;
}

export interface TextureOverlayLayer {
  texture: 'noise' | 'grain' | 'watercolor' | 'canvas' | 'paper';
  opacity: number;
  blendMode: BlendMode;
  scale: number;
  movement: { x: number; y: number };
}

export interface TextureOverlay {
  enabled: boolean;
  layers: TextureOverlayLayer[];
}

export interface ColorGrading {
  saturation: number;
  contrast: number;
  brightness: number;
  temperature: number;
  tint: number;
}

export interface BlendingLayer {
  enabled: boolean;
  globalBlendMode: BlendMode;
  colorGrading: ColorGrading;
  cohesionBlur: number;
}

export interface PaintingTrails {
  enabled: boolean;
  maxTrails: number;
  trailQuality: 'low' | 'medium' | 'high';
  velocityInfluence: number;
  temperatureMapping: boolean;
}

export interface ConnectionLines {
  enabled: boolean;
  maxDistance: number;
  opacity: number;
  thickness: number;
  color: 'auto' | 'temperature' | 'custom';
  customColor?: string;
}

export interface FieldEffects {
  enabled: boolean;
  strength: number;
  range: number;
  visualizeField: boolean;
}

export interface AmbientGlow {
  enabled: boolean;
  intensity: number;
  radius: number;
  color: 'auto' | 'temperature' | 'custom';
  customColor?: string;
}

export interface CohesionEffects {
  enabled: boolean;
  connectionLines: ConnectionLines;
  fieldEffects: FieldEffects;
  ambientGlow: AmbientGlow;
}

export interface OverlayEffects {
  textureOverlay: TextureOverlay;
  blendingLayer: BlendingLayer;
  paintingTrails: PaintingTrails;
  cohesionEffects: CohesionEffects;
}

export interface ObjectBehaviors {
  spheres: PaintingBehavior;
  cubes: PaintingBehavior;
  toruses: PaintingBehavior;
  blobs: PaintingBehavior;
  ribbons: PaintingBehavior;
  crystals: PaintingBehavior;
  particles: PaintingBehavior;
}

export interface ArtisticCanvasConfig {
  cameraConstraint: CameraConstraint;
  paintingSystem: PaintingSystem;
  objectBehaviors: ObjectBehaviors;
  overlayEffects: OverlayEffects;
}

export interface CanvasPaintData {
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  type: PaintingType;
  timestamp: number;
  velocity?: { x: number; y: number };
  pressure?: number;
}

export interface PaintingContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  config: ArtisticCanvasConfig;
  paintHistory: CanvasPaintData[];
  lastPaintTime: number;
}

export interface ArtisticCanvasState {
  isPainting: boolean;
  currentBrush: PaintingBehavior | null;
  paintHistory: CanvasPaintData[];
  canvasElement: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  weatherCondition: string;
  visibility: number;
}

export interface AIData {
  theme: string;
  mood: string;
  complexity: number;
  energy: number;
  colorPalette: string[];
  style: string;
} 