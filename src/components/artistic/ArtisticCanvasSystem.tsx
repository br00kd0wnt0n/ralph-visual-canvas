import React, { useRef, useEffect, useState, useCallback, ReactNode } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  ArtisticCanvasConfig,
  PaintingBehavior,
  BlendMode,
  PaintingType,
  CanvasPaintData,
  PaintingContext,
  ArtisticCanvasState
} from '../../types/artistic';

// Utility functions for color conversion
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

// Temperature to color mapping
const temperatureToColor = (temp: number): string => {
  // Map temperature (-20 to 40) to color spectrum
  const normalized = Math.max(0, Math.min(1, (temp + 20) / 60));
  
  if (normalized < 0.33) {
    // Cold: blue to cyan
    const t = normalized / 0.33;
    return rgbToHex(0, Math.round(255 * t), Math.round(255 * (0.5 + t * 0.5)));
  } else if (normalized < 0.66) {
    // Mild: cyan to yellow
    const t = (normalized - 0.33) / 0.33;
    return rgbToHex(Math.round(255 * t), 255, Math.round(255 * (1 - t)));
  } else {
    // Hot: yellow to red
    const t = (normalized - 0.66) / 0.34;
    return rgbToHex(255, Math.round(255 * (1 - t)), 0);
  }
};

// Rainbow color generation
const getRainbowColor = (index: number, total: number): string => {
  const hue = (index / total) * 360;
  const saturation = 80;
  const lightness = 60;
  
  // Convert HSL to RGB
  const h = hue / 360;
  const s = saturation / 100;
  const l = lightness / 100;
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;
  
  let r = 0, g = 0, b = 0;
  
  if (h < 1/6) {
    r = c; g = x; b = 0;
  } else if (h < 2/6) {
    r = x; g = c; b = 0;
  } else if (h < 3/6) {
    r = 0; g = c; b = x;
  } else if (h < 4/6) {
    r = 0; g = x; b = c;
  } else if (h < 5/6) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }
  
  return rgbToHex(
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  );
};

// Canvas painting functions
class CanvasPainter {
  private context: CanvasRenderingContext2D;
  private config: ArtisticCanvasConfig;
  private paintHistory: CanvasPaintData[] = [];
  private lastPaintTime: number = 0;

  constructor(canvas: HTMLCanvasElement, config: ArtisticCanvasConfig) {
    console.log('🎨 CanvasPainter constructor called');
    console.log('🎨 Canvas element:', canvas);
    console.log('🎨 Canvas dimensions:', canvas.width, 'x', canvas.height);
    
    this.context = canvas.getContext('2d')!;
    
    if (!this.context) {
      console.error('🎨 Failed to get 2D context from canvas!');
      throw new Error('Failed to get 2D context');
    }
    
    console.log('🎨 2D context obtained successfully');
    console.log('🎨 Context properties:', {
      canvas: this.context.canvas,
      globalAlpha: this.context.globalAlpha,
      globalCompositeOperation: this.context.globalCompositeOperation
    });
    
    this.config = config;
    this.setupCanvas();
    
    // Test the context is working
    this.context.fillStyle = 'rgba(255, 0, 0, 0.8)'; // More opaque red
    this.context.fillRect(0, 0, 100, 100);
    console.log('🎨 Test rectangle drawn to verify context is working');
    
    // Also draw a bright green circle
    this.context.fillStyle = 'rgba(0, 255, 0, 1.0)'; // Bright green
    this.context.beginPath();
    this.context.arc(150, 150, 50, 0, Math.PI * 2);
    this.context.fill();
    console.log('🎨 Test green circle drawn');
  }

  public setupCanvas() {
    const { canvasResolution } = this.config.paintingSystem;
    console.log('🎨 setupCanvas called with resolution:', canvasResolution);
    
    // Use the actual canvas element size instead of fixed resolution
    const rect = this.context.canvas.getBoundingClientRect();
    let actualWidth = rect.width;
    let actualHeight = rect.height;
    
    console.log('🎨 Canvas element rect:', rect);
    console.log('🎨 Actual canvas size:', actualWidth, 'x', actualHeight);
    
    // Fallback to window size if canvas size is zero
    if (actualWidth === 0 || actualHeight === 0) {
      actualWidth = window.innerWidth;
      actualHeight = window.innerHeight;
      console.log('🎨 Using window size as fallback:', actualWidth, 'x', actualHeight);
    }
    
    // Set canvas dimensions
    this.context.canvas.width = actualWidth;
    this.context.canvas.height = actualHeight;
    
    console.log('🎨 Canvas dimensions set to:', actualWidth, 'x', actualHeight);
    
    // Set blend mode
    const blendModeMap: Record<string, GlobalCompositeOperation> = {
      'normal': 'source-over',
      'multiply': 'multiply',
      'screen': 'screen',
      'overlay': 'overlay',
      'soft-light': 'soft-light',
      'hard-light': 'hard-light',
      'color-dodge': 'color-dodge',
      'color-burn': 'color-burn',
      'darken': 'darken',
      'lighten': 'lighten',
      'difference': 'difference',
      'exclusion': 'exclusion',
      'hue': 'hue',
      'saturation': 'saturation',
      'color': 'color',
      'luminosity': 'luminosity'
    };
    
    // Use 'normal' blend mode for better visibility during testing
    const blendMode = this.config.paintingSystem.activeBlendMode === 'soft-light' ? 'normal' : this.config.paintingSystem.activeBlendMode;
    this.context.globalCompositeOperation = blendModeMap[blendMode] || 'source-over';
    console.log('🎨 Blend mode set to:', this.context.globalCompositeOperation, '(original was:', this.config.paintingSystem.activeBlendMode, ')');
    
    // Test drawing to verify context is working
    this.context.save();
    this.context.fillStyle = '#ff0000';
    this.context.globalAlpha = 1.0;
    this.context.fillRect(10, 10, 50, 30);
    console.log('🎨 Test rectangle drawn to verify context is working');
    
    // Test circle drawing
    this.context.fillStyle = '#00ff00';
    this.context.beginPath();
    this.context.arc(100, 25, 20, 0, Math.PI * 2);
    this.context.fill();
    console.log('🎨 Test green circle drawn');
    this.context.restore();
  }

  private getColor(behavior: PaintingBehavior, objectColor?: string, temperature?: number, index?: number): string {
    switch (behavior.color) {
      case 'object':
        return objectColor || '#ffffff';
      case 'temperature':
        return temperatureToColor(temperature || 20);
      case 'rainbow':
        return getRainbowColor(index || 0, 100);
      case 'custom':
        return behavior.customColor || '#ffffff';
      default:
        return '#ffffff';
    }
  }

  private applyBrushTexture(behavior: PaintingBehavior) {
    if (!behavior.brushTexture) return;

    switch (behavior.brushTexture) {
      case 'soft':
        this.context.shadowBlur = behavior.brushSize * 0.5;
        this.context.shadowColor = 'rgba(0,0,0,0.3)';
        break;
      case 'watercolor':
        this.context.globalAlpha *= 0.7;
        this.context.shadowBlur = behavior.brushSize * 0.3;
        break;
      case 'oil':
        this.context.globalAlpha *= 1.2;
        this.context.shadowBlur = behavior.brushSize * 0.2;
        break;
      case 'pencil':
        this.context.lineWidth = 1;
        this.context.globalAlpha *= 0.8;
        break;
      case 'spray':
        this.context.shadowBlur = behavior.brushSize * 0.1;
        break;
    }
  }

  paintTrail(
    x: number, 
    y: number, 
    behavior: PaintingBehavior, 
    velocity?: { x: number; y: number },
    objectColor?: string,
    temperature?: number,
    index?: number
  ) {
    console.log(`🎨 paintTrail called: x=${x}, y=${y}, trailLength=${behavior.trailLength}, trailWidth=${behavior.trailWidth}`);
    
    if (!behavior.trailLength || !behavior.trailWidth || !behavior.trailFade) {
      console.log('🎨 paintTrail: Missing required properties, skipping');
      return;
    }

    const color = this.getColor(behavior, objectColor, temperature, index);
    const points: { x: number; y: number; opacity: number }[] = [];
    
    // Generate trail points
    for (let i = 0; i < behavior.trailLength; i++) {
      const fade = Math.pow(behavior.trailFade, i);
      const offsetX = velocity ? -velocity.x * i * 0.1 : 0;
      const offsetY = velocity ? -velocity.y * i * 0.1 : 0;
      
      points.push({
        x: x + offsetX,
        y: y + offsetY,
        opacity: behavior.opacity * fade
      });
    }

    console.log(`🎨 paintTrail: Generated ${points.length} trail points with color ${color}`);

    // Draw trail
    this.context.save();
    this.applyBrushTexture(behavior);
    
    for (let i = 0; i < points.length - 1; i++) {
      const point = points[i];
      const nextPoint = points[i + 1];
      
      this.context.globalAlpha = point.opacity;
      this.context.strokeStyle = color;
      this.context.lineWidth = behavior.trailWidth * (1 - i / points.length);
      
      this.context.beginPath();
      this.context.moveTo(point.x, point.y);
      this.context.lineTo(nextPoint.x, nextPoint.y);
      this.context.stroke();
    }
    
    this.context.restore();
    
    console.log('🎨 paintTrail: Trail drawing completed');
  }

  paintStamp(
    x: number, 
    y: number, 
    behavior: PaintingBehavior,
    objectColor?: string,
    temperature?: number,
    index?: number
  ) {
    if (!behavior.stampSize || !behavior.stampShape) return;

    const color = this.getColor(behavior, objectColor, temperature, index);
    
    this.context.save();
    this.context.globalAlpha = behavior.opacity;
    this.context.fillStyle = color;
    
    const size = behavior.stampSize;
    
    switch (behavior.stampShape) {
      case 'circle':
        this.context.beginPath();
        this.context.arc(x, y, size, 0, Math.PI * 2);
        this.context.fill();
        break;
        
      case 'square':
        this.context.fillRect(x - size, y - size, size * 2, size * 2);
        break;
        
      case 'triangle':
        this.context.beginPath();
        this.context.moveTo(x, y - size);
        this.context.lineTo(x - size, y + size);
        this.context.lineTo(x + size, y + size);
        this.context.closePath();
        this.context.fill();
        break;
        
      case 'star':
        this.drawStar(x, y, size);
        break;
        
      case 'cross':
        this.context.fillRect(x - size, y - size * 0.3, size * 2, size * 0.6);
        this.context.fillRect(x - size * 0.3, y - size, size * 0.6, size * 2);
        break;
        
      case 'diamond':
        this.context.beginPath();
        this.context.moveTo(x, y - size);
        this.context.lineTo(x + size, y);
        this.context.lineTo(x, y + size);
        this.context.lineTo(x - size, y);
        this.context.closePath();
        this.context.fill();
        break;
    }
    
    this.context.restore();
  }

  private drawStar(x: number, y: number, size: number) {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size * 0.5;
    
    this.context.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      
      if (i === 0) {
        this.context.moveTo(px, py);
      } else {
        this.context.lineTo(px, py);
      }
    }
    this.context.closePath();
    this.context.fill();
  }

  paintBrush(
    x: number, 
    y: number, 
    behavior: PaintingBehavior,
    pressure: number = 1,
    objectColor?: string,
    temperature?: number,
    index?: number
  ) {
    const color = this.getColor(behavior, objectColor, temperature, index);
    const size = behavior.brushSize * pressure;
    
    this.context.save();
    this.context.globalAlpha = behavior.opacity;
    this.context.fillStyle = color;
    this.applyBrushTexture(behavior);
    
    // Create brush stroke
    this.context.beginPath();
    this.context.arc(x, y, size, 0, Math.PI * 2);
    this.context.fill();
    
    this.context.restore();
  }

  paintSplatter(
    x: number, 
    y: number, 
    behavior: PaintingBehavior,
    objectColor?: string,
    temperature?: number,
    index?: number
  ) {
    if (!behavior.splatterCount || !behavior.splatterSpread) return;

    const color = this.getColor(behavior, objectColor, temperature, index);
    
    this.context.save();
    this.context.globalAlpha = behavior.opacity;
    this.context.fillStyle = color;
    
    for (let i = 0; i < behavior.splatterCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * behavior.splatterSpread;
      const splatterX = x + Math.cos(angle) * distance;
      const splatterY = y + Math.sin(angle) * distance;
      const splatterSize = behavior.brushSize * (0.2 + Math.random() * 0.8);
      
      this.context.beginPath();
      this.context.arc(splatterX, splatterY, splatterSize, 0, Math.PI * 2);
      this.context.fill();
    }
    
    this.context.restore();
  }

  paintRipple(
    x: number, 
    y: number, 
    behavior: PaintingBehavior,
    time: number,
    objectColor?: string,
    temperature?: number,
    index?: number
  ) {
    if (!behavior.rippleSpeed || !behavior.rippleAmplitude) return;

    const color = this.getColor(behavior, objectColor, temperature, index);
    const rippleRadius = (time * behavior.rippleSpeed) % behavior.brushSize;
    const opacity = behavior.opacity * (1 - rippleRadius / behavior.brushSize);
    
    this.context.save();
    this.context.globalAlpha = opacity;
    this.context.strokeStyle = color;
    this.context.lineWidth = behavior.rippleAmplitude;
    
    this.context.beginPath();
    this.context.arc(x, y, rippleRadius, 0, Math.PI * 2);
    this.context.stroke();
    
    this.context.restore();
  }

  paintGlow(
    x: number, 
    y: number, 
    behavior: PaintingBehavior,
    objectColor?: string,
    temperature?: number,
    index?: number
  ) {
    const color = this.getColor(behavior, objectColor, temperature, index);
    const intensity = behavior.glowIntensity || 1;
    const radius = behavior.glowRadius || behavior.brushSize * 2;
    
    this.context.save();
    
    // Create gradient for glow effect
    const gradient = this.context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `${color}${Math.round(behavior.opacity * 255).toString(16).padStart(2, '0')}`);
    gradient.addColorStop(0.5, `${color}${Math.round(behavior.opacity * 0.5 * 255).toString(16).padStart(2, '0')}`);
    gradient.addColorStop(1, `${color}00`);
    
    this.context.fillStyle = gradient;
    this.context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    
    this.context.restore();
  }

  // Main painting function
  paint(
    x: number, 
    y: number, 
    behavior: PaintingBehavior,
    options: {
      velocity?: { x: number; y: number };
      pressure?: number;
      time?: number;
      objectColor?: string;
      temperature?: number;
      index?: number;
    } = {}
  ) {
    console.log(`🎨 PAINT CALLED: x=${x}, y=${y}, type=${behavior.type}, enabled=${behavior.enabled}`);
    
    if (!behavior.enabled) {
      console.log('🎨 Paint skipped - behavior disabled');
      return;
    }

    const paintData: CanvasPaintData = {
      x,
      y,
      size: behavior.brushSize,
      opacity: behavior.opacity,
      color: this.getColor(behavior, options.objectColor, options.temperature, options.index),
      type: behavior.type,
      timestamp: Date.now(),
      velocity: options.velocity,
      pressure: options.pressure
    };

    this.paintHistory.push(paintData);
    
    // Limit paint history
    if (this.paintHistory.length > 1000) {
      this.paintHistory = this.paintHistory.slice(-500);
    }

    console.log(`🎨 Painting ${behavior.type} at (${x}, ${y}) with color ${paintData.color}`);

    switch (behavior.type) {
      case 'trail':
        this.paintTrail(x, y, behavior, options.velocity, options.objectColor, options.temperature, options.index);
        break;
      case 'stamp':
        this.paintStamp(x, y, behavior, options.objectColor, options.temperature, options.index);
        break;
      case 'brush':
        this.paintBrush(x, y, behavior, options.pressure, options.objectColor, options.temperature, options.index);
        break;
      case 'splatter':
        this.paintSplatter(x, y, behavior, options.objectColor, options.temperature, options.index);
        break;
      case 'ripple':
        this.paintRipple(x, y, behavior, options.time || 0, options.objectColor, options.temperature, options.index);
        break;
      case 'glow':
        this.paintGlow(x, y, behavior, options.objectColor, options.temperature, options.index);
        break;
    }
    
    console.log('🎨 Paint function completed');
  }

  // Fade canvas over time
  fade() {
    const { fadeRate } = this.config.paintingSystem;
    console.log(`🎨 Fade called with rate: ${fadeRate}`);
    
    // Temporarily disable fading for debugging
    if (fadeRate > 0) {
      console.log('🎨 Fade disabled for debugging');
      return;
    }
    
    this.context.save();
    this.context.globalCompositeOperation = 'destination-out';
    this.context.globalAlpha = fadeRate;
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    this.context.restore();
    console.log('🎨 Fade applied');
  }

  // Clear canvas
  clear() {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    this.paintHistory = [];
  }

  // Get canvas as data URL
  getDataURL(): string {
    return this.context.canvas.toDataURL();
  }
}

// Global painter instance and painting objects registry
let globalPainter: CanvasPainter | null = null;
let paintingObjects: Array<{
  position: { x: number; y: number; z: number };
  behavior: PaintingBehavior;
  objectColor?: string;
  temperature?: number;
  index?: number;
  lastPosition?: { x: number; y: number; z: number };
  lastPaintTime?: number;
  isMoving?: boolean;
  velocity?: { x: number; y: number; z: number };
}> = [];

// Global state for camera and size information
let globalCamera: THREE.Camera | null = null;
let globalSize: { width: number; height: number } = { width: 0, height: 0 };

// Velocity threshold for considering an object "moving" (in units per second)
const VELOCITY_THRESHOLD = 0.05; // Increased from 0.001 to 0.05 for more reasonable detection

// Canvas clearing interval (in seconds)
const CANVAS_CLEAR_INTERVAL = 10; // Clear canvas every 10 seconds
let lastCanvasClearTime = 0;

// Function to register painting objects
export const registerPaintingObject = (object: {
  position: { x: number; y: number; z: number };
  behavior: PaintingBehavior;
  objectColor?: string;
  temperature?: number;
  index?: number;
}) => {
  paintingObjects.push({
    ...object,
    lastPosition: { ...object.position },
    lastPaintTime: Date.now() * 0.001,
    isMoving: false,
    velocity: { x: 0, y: 0, z: 0 }
  });
  console.log(`🎨 Registered painting object: type=${object.behavior.type}, total objects: ${paintingObjects.length}`);
};

// Function to unregister painting objects
export const unregisterPaintingObject = (index: number) => {
  paintingObjects = paintingObjects.filter((_, i) => i !== index);
};

// Function to update global camera and size
export const updateGlobalCameraAndSize = (camera: THREE.Camera, size: { width: number; height: number }) => {
  globalCamera = camera;
  globalSize = size;
  console.log(`🎨 Global camera and size updated: ${size.width}x${size.height}`);
};

// Function to update painting objects (called from overlay)
export const updatePaintingObjects = () => {
  if (!globalPainter || !globalCamera) {
    console.log('🎨 updatePaintingObjects: No painter or camera available');
    return;
  }
  
  const currentTime = Date.now() * 0.001;
  
  // Clear canvas periodically to prevent trail accumulation
  if (currentTime - lastCanvasClearTime > CANVAS_CLEAR_INTERVAL) {
    // Temporarily disable canvas clearing for debugging
    console.log('🎨 Canvas clearing disabled for debugging');
    // globalPainter.clear();
    lastCanvasClearTime = currentTime;
    // console.log('🎨 Canvas cleared to prevent trail accumulation');
  }
  
  let movingObjectsCount = 0;
  
  // Only log occasionally to avoid spam
  if (Math.random() < 0.01) {
    console.log(`🎨 Processing ${paintingObjects.length} painting objects...`);
  }
  
  paintingObjects.forEach((object, index) => {
    if (!object.behavior.enabled) {
      return;
    }

    // Calculate velocity if we have a previous position
    let velocity: { x: number; y: number; z: number } | undefined;
    let isMoving = false;
    
    if (object.lastPosition) {
      const deltaTime = currentTime - (object.lastPaintTime || currentTime);
      if (deltaTime > 0) {
        velocity = {
          x: (object.position.x - object.lastPosition.x) / deltaTime,
          y: (object.position.y - object.lastPosition.y) / deltaTime,
          z: (object.position.z - object.lastPosition.z) / deltaTime
        };
        
        // Calculate speed magnitude
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y + velocity.z * velocity.z);
        isMoving = speed > VELOCITY_THRESHOLD;
        
        // Debug: Log velocity for moving objects (only occasionally)
        if (isMoving && Math.random() < 0.05) { // Only log 5% of the time
          console.log(`🎨 Object ${index} moving: speed=${speed.toFixed(2)}, velocity=(${velocity.x.toFixed(2)}, ${velocity.y.toFixed(2)}, ${velocity.z.toFixed(2)})`);
        }
        
        // Debug: Log when objects are not moving (occasionally)
        if (!isMoving && Math.random() < 0.001) { // Very rare logging
          console.log(`🎨 Object ${index} not moving: speed=${speed.toFixed(4)}, threshold=${VELOCITY_THRESHOLD}`);
        }
      }
    }

    // Only paint if the object is moving
    if (isMoving) {
      movingObjectsCount++;
      
      // Log every moving object for debugging
      console.log(`🎨 Painting moving object ${index} at position (${object.position.x.toFixed(2)}, ${object.position.y.toFixed(2)}, ${object.position.z.toFixed(2)})`);
      
      // Convert 3D position to 2D canvas coordinates
      const vector = new THREE.Vector3(object.position.x, object.position.y, object.position.z);
      vector.project(globalCamera!);
      
      const x = (vector.x * 0.5 + 0.5) * globalSize.width;
      const y = (vector.y * -0.5 + 0.5) * globalSize.height;

      // Add bounds checking to ensure coordinates are valid
      if (isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) {
        console.log(`🎨 Invalid 2D coordinates for object ${index}: x=${x}, y=${y}`);
        return;
      }

      // Check if coordinates are within reasonable bounds (allow some overflow for trails)
      const maxReasonableDistance = Math.max(globalSize.width, globalSize.height) * 2;
      if (Math.abs(x) > maxReasonableDistance || Math.abs(y) > maxReasonableDistance) {
        console.log(`🎨 Object ${index} too far from camera: x=${x.toFixed(2)}, y=${y.toFixed(2)}`);
        return;
      }

      console.log(`🎨 3D to 2D conversion: (${object.position.x.toFixed(2)}, ${object.position.y.toFixed(2)}, ${object.position.z.toFixed(2)}) -> (${x.toFixed(2)}, ${y.toFixed(2)})`);

      // Convert 3D velocity to 2D screen velocity
      let screenVelocity: { x: number; y: number } | undefined;
      if (velocity) {
        const lastVector = new THREE.Vector3(object.lastPosition!.x, object.lastPosition!.y, object.lastPosition!.z);
        lastVector.project(globalCamera!);
        
        const lastX = (lastVector.x * 0.5 + 0.5) * globalSize.width;
        const lastY = (lastVector.y * -0.5 + 0.5) * globalSize.height;
        
        const deltaTime = currentTime - (object.lastPaintTime || currentTime);
        if (deltaTime > 0) {
          screenVelocity = {
            x: (x - lastX) / deltaTime,
            y: (y - lastY) / deltaTime
          };
        }
      }

      // Paint based on behavior type
      globalPainter!.paint(x, y, object.behavior, {
        velocity: screenVelocity,
        time: currentTime,
        objectColor: object.objectColor,
        temperature: object.temperature,
        index: object.index
      });
    } else {
      // Debug: Log when objects are not moving (occasionally)
      if (Math.random() < 0.001) { // Very rare logging
        const speed = velocity ? Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y + velocity.z * velocity.z) : 0;
        console.log(`🎨 Object ${index} not moving: speed=${speed.toFixed(4)}, threshold=${VELOCITY_THRESHOLD}, position=(${object.position.x.toFixed(2)}, ${object.position.y.toFixed(2)}, ${object.position.z.toFixed(2)})`);
      }
    }
    
    // Update last position and time
    object.lastPosition = { ...object.position };
    object.lastPaintTime = currentTime;
    object.isMoving = isMoving;
    object.velocity = velocity;
  });
  
  // Log moving objects count
  if (movingObjectsCount > 0) {
    console.log(`🎨 ${movingObjectsCount} objects moving out of ${paintingObjects.length} total`);
  }
};

// ArtisticCanvas wrapper component - This should NOT render inside R3F Canvas
interface ArtisticCanvasProps {
  config: ArtisticCanvasConfig;
  children: ReactNode;
}

export const ArtisticCanvas: React.FC<ArtisticCanvasProps> = ({ config, children }) => {
  const { camera, size } = useThree();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [painter, setPainter] = useState<CanvasPainter | null>(null);

  useEffect(() => {
    if (canvasRef.current && config.paintingSystem.enabled) {
      const newPainter = new CanvasPainter(canvasRef.current, config);
      setPainter(newPainter);
      globalPainter = newPainter;
    }
  }, [config]);

  useEffect(() => {
    if (config.cameraConstraint.enabled) {
      camera.position.set(...config.cameraConstraint.position);
      camera.lookAt(...config.cameraConstraint.lookAt);
      
      // Handle different camera types
      if ('fov' in camera) {
        (camera as any).fov = config.cameraConstraint.fov;
      }
      camera.near = config.cameraConstraint.near;
      camera.far = config.cameraConstraint.far;
      camera.updateProjectionMatrix();
    }
  }, [camera, config.cameraConstraint]);

  useFrame((state) => {
    // Update global camera and size information
    updateGlobalCameraAndSize(camera, size);
    
    // Update painting objects
    updatePaintingObjects();
    
    if (painter && config.paintingSystem.enabled) {
      painter.fade();
    }
  });

  // Don't render canvas element inside R3F - it will be rendered outside
  return <>{children}</>;
};

// Separate component for the 2D canvas overlay
export const ArtisticCanvasOverlay: React.FC<{ config: ArtisticCanvasConfig }> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [painter, setPainter] = useState<CanvasPainter | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (canvasRef.current && config.paintingSystem.enabled) {
      console.log('🎨 Creating ArtisticCanvasOverlay with config:', config.paintingSystem);
      
      const newPainter = new CanvasPainter(canvasRef.current, config);
      setPainter(newPainter);
      globalPainter = newPainter;
      
      // Set initial canvas size
      const rect = canvasRef.current.getBoundingClientRect();
      setCanvasSize({ width: rect.width, height: rect.height });
      
      console.log('🎨 CanvasPainter created successfully');
    }
  }, [config]);

  // Handle canvas size updates
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const newSize = { width: rect.width, height: rect.height };
        
        if (newSize.width !== canvasSize.width || newSize.height !== canvasSize.height) {
          setCanvasSize(newSize);
          console.log('🎨 Canvas size updated:', newSize.width + 'x' + newSize.height);
          
          if (painter) {
            painter.setupCanvas();
          }
        }
      }
    };

    // Update size on mount and window resize
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [canvasSize, painter]);

  // Animation loop for painting system (outside of R3F context)
  useEffect(() => {
    if (!config.paintingSystem.enabled || !painter) return;

    const animate = () => {
      // Update painting objects is now handled by ArtisticCanvasController in R3F context
      // updatePaintingObjects();
      
      // Apply fade effect
      painter.fade();
      
      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [config.paintingSystem.enabled, painter]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (!config.paintingSystem.enabled) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
        mixBlendMode: config.paintingSystem.activeBlendMode,
        border: '2px solid red',
        backgroundColor: 'rgba(0, 0, 255, 0.1)'
      }}
    />
  );
};

// PaintingObject wrapper component
interface PaintingObjectProps {
  behavior: PaintingBehavior;
  position: { x: number; y: number; z: number };
  children: ReactNode;
  objectColor?: string;
  temperature?: number;
  index?: number;
}

export const PaintingObject: React.FC<PaintingObjectProps> = ({ 
  behavior, 
  position, 
  children, 
  objectColor,
  temperature,
  index 
}) => {
  const objectRef = useRef<number>(-1);
  const groupRef = useRef<THREE.Group>(null);
  const lastPositionRef = useRef<{ x: number; y: number; z: number }>(position);
  const lastTimeRef = useRef<number>(Date.now() * 0.001);

  useEffect(() => {
    // Register this painting object
    objectRef.current = paintingObjects.length;
    registerPaintingObject({
      position,
      behavior,
      objectColor,
      temperature,
      index
    });
    
    console.log(`🎨 PaintingObject registered: index=${objectRef.current}, type=${behavior.type}, position=(${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)})`);

    return () => {
      // Unregister on cleanup
      if (objectRef.current >= 0) {
        unregisterPaintingObject(objectRef.current);
        console.log(`🎨 PaintingObject unregistered: index=${objectRef.current}`);
      }
    };
  }, []);

  // Use useFrame to continuously update the position from the animated group
  useFrame(() => {
    if (objectRef.current >= 0 && paintingObjects[objectRef.current] && groupRef.current) {
      const object = paintingObjects[objectRef.current];
      
      // The animation is happening on the PARENT group (the one with position={pos})
      // The groupRef.current is the PaintingObject's group, but we need the parent
      let actualPosition = { x: 0, y: 0, z: 0 };
      
      // Get the position from the parent group (where the animation is happening)
      if (groupRef.current.parent) {
        const parentGroup = groupRef.current.parent as THREE.Group;
        actualPosition = {
          x: parentGroup.position.x,
          y: parentGroup.position.y,
          z: parentGroup.position.z
        };
      }
      
      const currentTime = Date.now() * 0.001;
      
      // Debug: Log the actual position being tracked - reduced frequency for performance
      if (process.env.NODE_ENV === 'development' && Math.random() < 0.01) { // Reduced from 0.05 to 0.01 (1% chance)
        console.log(`🎨 PaintingObject ${objectRef.current} tracking: parent group position=(${actualPosition.x.toFixed(2)}, ${actualPosition.y.toFixed(2)}, ${actualPosition.z.toFixed(2)})`);
      }
      
      // Calculate velocity based on position change
      const velocity = {
        x: actualPosition.x - lastPositionRef.current.x,
        y: actualPosition.y - lastPositionRef.current.y,
        z: actualPosition.z - lastPositionRef.current.z
      };
      
      const timeDelta = currentTime - lastTimeRef.current;
      if (timeDelta > 0) {
        velocity.x /= timeDelta;
        velocity.y /= timeDelta;
        velocity.z /= timeDelta;
      }
      
      const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y + velocity.z * velocity.z);
      
      // Update the painting object with the actual animated position
      object.position = actualPosition;
      object.velocity = velocity;
      object.lastPaintTime = currentTime;
      
      // Update our local tracking
      lastPositionRef.current = actualPosition;
      lastTimeRef.current = currentTime;
    }
  });

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      {children}
    </group>
  );
};

// Hook for accessing the painter
export const useArtisticPainter = () => {
  return globalPainter;
};

// Component to be used inside Canvas for handling camera and size updates
export const ArtisticCanvasController: React.FC = () => {
  const { camera, size } = useThree();
  const frameCountRef = useRef(0);

  useFrame(() => {
    // PERFORMANCE OPTIMIZATION: Only update every 3 frames to reduce overhead
    frameCountRef.current++;
    if (frameCountRef.current % 3 !== 0) return;
    
    // Update global camera and size information for the painting system
    updateGlobalCameraAndSize(camera, size);
    
    // Also update painting objects here since we have access to the camera
    updatePaintingObjects();
  });

  return null; // This component doesn't render anything
}; 