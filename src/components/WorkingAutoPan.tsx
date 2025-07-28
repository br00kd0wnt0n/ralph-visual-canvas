import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useVisualStore } from '../store/visualStore';

// Working auto-pan that actually rotates the camera around the scene
export const WorkingAutoPan = () => {
  const { camera, globalAnimationSpeed } = useVisualStore();
  const { camera: threeCamera } = useThree();
  
  // Simple angle tracking for 360-degree rotation
  const angleRef = useRef(0);
  
  useFrame((state, deltaTime) => {
    // Only run if auto-pan is enabled
    if (!camera.autoPan.enabled) return;
    
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('Auto-pan active:', {
        enabled: camera.autoPan.enabled,
        speed: camera.autoPan.speed,
        radius: camera.autoPan.radius,
        height: camera.autoPan.height,
        globalSpeed: globalAnimationSpeed
      });
    }
    
    // Get auto-pan settings
    const { speed, radius, height } = camera.autoPan;
    
    // Calculate rotation speed (should be clearly visible)
    const rotationSpeed = speed * globalAnimationSpeed * 0.3; // Much more visible
    
    // Increment angle for smooth 360-degree rotation
    angleRef.current += rotationSpeed * deltaTime;
    
    // Calculate new camera position in circle around origin
    const x = Math.cos(angleRef.current) * radius;
    const z = Math.sin(angleRef.current) * radius;
    
    // Position camera and look at center
    threeCamera.position.set(x, height, z);
    threeCamera.lookAt(0, 0, 0);
    
    // Position logging for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Camera position:', { x: x.toFixed(2), y: height, z: z.toFixed(2), angle: angleRef.current.toFixed(2) });
    }
  });
  
  return null;
};

// Debug component to show auto-pan status
export const AutoPanStatus = () => {
  const { camera, globalAnimationSpeed } = useVisualStore();
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 10,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <div>Auto-Pan: {camera.autoPan.enabled ? '✅ ON' : '❌ OFF'}</div>
      <div>Speed: {camera.autoPan.speed}x</div>
      <div>Global: {globalAnimationSpeed.toFixed(1)}x</div>
      <div>Radius: {camera.autoPan.radius}</div>
      <div>Height: {camera.autoPan.height}</div>
    </div>
  );
};