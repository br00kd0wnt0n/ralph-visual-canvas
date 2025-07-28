import React, { useRef, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useVisualStore } from '../store/visualStore';

// Performance constants
const CAMERA_UPDATE_THRESHOLD = 0.001; // Very sensitive for smooth updates
const MIN_UPDATE_INTERVAL = 50; // Minimum ms between store updates
const POSITION_SMOOTHING = 0.08; // Lower = smoother motion
const AUTO_PAN_FRAME_SKIP = 1; // Update every frame for smoothness

// Optimized Auto-Pan System
export const OptimizedAutoPanSystem = () => {
  const { camera, globalAnimationSpeed, updateAutoPanAngle } = useVisualStore();
  const three = useThree();
  
  // Performance tracking refs
  const frameCount = useRef(0);
  const lastUpdateTime = useRef(0);
  const lastStoreUpdate = useRef(0);
  const currentPosition = useRef(new THREE.Vector3());
  const targetPosition = useRef(new THREE.Vector3());
  const lastAngle = useRef(camera.autoPan.currentAngle);
  
  useFrame((state) => {
    if (!camera.autoPan.enabled || !three.camera) return;
    
    frameCount.current++;
    const now = performance.now();
    
    // Calculate smooth position every frame for fluid motion
    const deltaTime = state.clock.getDelta();
    const { speed, radius, height, currentAngle } = camera.autoPan;
    
    // Calculate new angle with auto-pan having its own baseline speed
    // Base speed ensures visibility even with slow global animation
    const baseAutoPanSpeed = 0.008; // Independent baseline for auto-pan
    const globalSpeedEffect = Math.max(0.3, globalAnimationSpeed); // Minimum 30% global effect
    const angleSpeed = speed * baseAutoPanSpeed * globalSpeedEffect;
    const newAngle = currentAngle + (angleSpeed * deltaTime);
    
    // Calculate target position smoothly
    targetPosition.current.set(
      Math.cos(newAngle) * radius,
      height,
      Math.sin(newAngle) * radius
    );
    
    // Store angle for next update
    lastAngle.current = newAngle;
    
    // Update store less frequently (but calculate smooth every frame)
    if (now - lastStoreUpdate.current > MIN_UPDATE_INTERVAL * 3) {
      updateAutoPanAngle(newAngle);
      lastStoreUpdate.current = now;
    }
    
    // Smooth interpolation every frame for visual smoothness
    currentPosition.current.lerp(targetPosition.current, POSITION_SMOOTHING);
    
    // Only update camera if position changed significantly
    const distance = three.camera.position.distanceTo(currentPosition.current);
    if (distance > CAMERA_UPDATE_THRESHOLD) {
      three.camera.position.copy(currentPosition.current);
      three.camera.lookAt(0, 0, 0);
      lastUpdateTime.current = now;
    }
  });
  
  return null;
};

// Optimized Camera Controls for manual mode
export const OptimizedCameraControls = () => {
  const { camera, ui, updateCamera } = useVisualStore();
  const controlsRef = useRef<any>(null);
  const three = useThree();
  
  // Performance tracking
  const lastStoreUpdate = useRef(0);
  const pendingUpdate = useRef<any>(null);
  const updateTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Debounced camera update
  const debouncedCameraUpdate = useCallback((newPosition: [number, number, number], newTarget: [number, number, number]) => {
    pendingUpdate.current = { position: newPosition, target: newTarget };
    
    if (updateTimer.current) {
      clearTimeout(updateTimer.current);
    }
    
    updateTimer.current = setTimeout(() => {
      if (pendingUpdate.current) {
        const { position, target } = pendingUpdate.current;
        const distance = Math.sqrt(position[0] ** 2 + position[2] ** 2);
        const height = position[1];
        
        updateCamera({
          position,
          target,
          distance,
          height
        });
        
        pendingUpdate.current = null;
        lastStoreUpdate.current = performance.now();
      }
    }, MIN_UPDATE_INTERVAL);
  }, [updateCamera]);
  
  // Handle camera changes with throttling
  useFrame(() => {
    if (!ui.cameraPositioningMode || !controlsRef.current) return;
    
    const now = performance.now();
    
    // Check if camera moved
    const camPos = three.camera.position;
    const targetPos = controlsRef.current.target;
    
    const hasChanged = 
      Math.abs(camPos.x - (pendingUpdate.current?.position[0] ?? camera.position[0])) > CAMERA_UPDATE_THRESHOLD ||
      Math.abs(camPos.y - (pendingUpdate.current?.position[1] ?? camera.position[1])) > CAMERA_UPDATE_THRESHOLD ||
      Math.abs(camPos.z - (pendingUpdate.current?.position[2] ?? camera.position[2])) > CAMERA_UPDATE_THRESHOLD;
    
    if (hasChanged && now - lastStoreUpdate.current > MIN_UPDATE_INTERVAL) {
      debouncedCameraUpdate(
        [camPos.x, camPos.y, camPos.z],
        [targetPos.x, targetPos.y, targetPos.z]
      );
    }
  });
  
  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (updateTimer.current) {
        clearTimeout(updateTimer.current);
      }
    };
  }, []);
  
  if (!ui.cameraPositioningMode) return null;
  
  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={camera.enablePan}
      enableZoom={camera.enableZoom}
      enableRotate={camera.enableRotate}
      dampingFactor={camera.damping}
      minDistance={camera.minDistance}
      maxDistance={camera.maxDistance}
      minPolarAngle={camera.minPolarAngle}
      maxPolarAngle={camera.maxPolarAngle}
      autoRotate={camera.autoRotate}
      autoRotateSpeed={camera.autoRotateSpeed}
      // Performance optimization
      enableDamping={true}
      rotateSpeed={0.5}
      zoomSpeed={0.8}
    />
  );
};

// Camera system performance monitor
export const CameraPerformanceMonitor = () => {
  const updateCount = useRef(0);
  const lastReport = useRef(0);
  
  useFrame(() => {
    updateCount.current++;
    const now = performance.now();
    
    // Report every 5 seconds
    if (now - lastReport.current > 5000) {
      const updatesPerSecond = (updateCount.current / 5).toFixed(1);
      console.log(`📷 Camera updates per second: ${updatesPerSecond}`);
      updateCount.current = 0;
      lastReport.current = now;
    }
  });
  
  return null;
};