import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useVisualStore } from '../store/visualStore';

// Simple, working auto-pan system
export const SimpleAutoPan = () => {
  const { camera, globalAnimationSpeed, updateAutoPanAngle } = useVisualStore();
  const { camera: threeCamera } = useThree();
  
  // Simple angle tracking
  const angleRef = useRef(camera.autoPan.currentAngle);
  const lastUpdateTime = useRef(0);
  
  useFrame((state) => {
    if (!camera.autoPan.enabled || !threeCamera) return;
    
    const now = performance.now();
    
    // Simple, reliable speed calculation
    const { speed, radius, height } = camera.autoPan;
    const deltaTime = state.clock.getDelta();
    
    // Clear, visible speed calculation
    const effectiveSpeed = speed * Math.max(0.5, globalAnimationSpeed); // Minimum 50% global effect
    const angleIncrement = effectiveSpeed * 0.5 * deltaTime; // Much more visible speed
    
    // Update angle
    angleRef.current += angleIncrement;
    
    // Calculate new camera position directly
    const x = Math.cos(angleRef.current) * radius;
    const z = Math.sin(angleRef.current) * radius;
    
    // Set camera position directly - no complex lerping
    threeCamera.position.set(x, height, z);
    threeCamera.lookAt(0, 0, 0);
    
    // Update store less frequently for performance
    if (now - lastUpdateTime.current > 100) { // Every 100ms
      updateAutoPanAngle(angleRef.current);
      lastUpdateTime.current = now;
    }
  });
  
  return null;
};

// Performance monitor for debugging
export const AutoPanDebugMonitor = () => {
  const { camera, globalAnimationSpeed } = useVisualStore();
  const frameCount = useRef(0);
  const lastReport = useRef(0);
  
  useFrame(() => {
    if (!camera.autoPan.enabled) return;
    
    frameCount.current++;
    const now = performance.now();
    
    // Report every 3 seconds when auto-pan is active
    if (now - lastReport.current > 3000) {
      const fps = (frameCount.current / 3).toFixed(1);
      console.log(`🎥 Auto-Pan Active - FPS: ${fps}, Speed: ${camera.autoPan.speed}x, Global: ${globalAnimationSpeed.toFixed(1)}x`);
      frameCount.current = 0;
      lastReport.current = now;
    }
  });
  
  return null;
};