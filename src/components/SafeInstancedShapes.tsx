import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useVisualStore } from '../store/visualStore';
import { resourceManager } from '../utils/ResourceManager';

// EMERGENCY SAFE VERSION - Addresses browser crash issues
const UPDATE_FREQUENCY = 4; // Reduced from 2 for safety
const MAX_INSTANCES = 100; // Reduced from 200 for safety
const MAX_SCALE_MULTIPLIER = 10; // Prevent scale overflow

// Safe math helpers
const safeMultiply = (a: number, b: number): number => {
  const result = a * b;
  if (!isFinite(result) || isNaN(result)) return 1;
  return Math.max(0.1, Math.min(MAX_SCALE_MULTIPLIER, result));
};

const safeAdd = (a: number, b: number): number => {
  const result = a + b;
  if (!isFinite(result) || isNaN(result)) return a;
  return result;
};

// Safe distortion calculation (simplified)
const calculateSafeDistortion = (
  position: { x: number; y: number; z: number },
  time: number,
  index: number,
  distortion: any
) => {
  if (!distortion || (!distortion.wave && !distortion.ripple)) {
    return position;
  }
  
  // Reduced multipliers to prevent overflow
  const waveIntensity = Math.min(2, (distortion.wave || 0) * 2); // Max 2
  const rippleIntensity = Math.min(3, (distortion.ripple || 0) * 3); // Max 3
  const frequency = Math.max(0.1, Math.min(2, distortion.frequency || 1));
  
  let { x, y, z } = position;
  
  // Safe wave calculation
  if (waveIntensity > 0) {
    const waveX = Math.sin(time * frequency + index * 0.1) * waveIntensity;
    const waveZ = Math.cos(time * frequency + index * 0.15) * waveIntensity;
    x = safeAdd(x, waveX);
    z = safeAdd(z, waveZ);
  }
  
  // Safe ripple calculation
  if (rippleIntensity > 0) {
    const distance = Math.sqrt(x * x + z * z);
    if (isFinite(distance)) {
      const ripplePhase = time * 2 - distance * 0.1;
      const rippleY = Math.sin(ripplePhase) * rippleIntensity;
      y = safeAdd(y, rippleY);
    }
  }
  
  return { x, y, z };
};

export const SafeInstancedSpheres = () => {
  const { globalEffects, backgroundConfig, globalAnimationSpeed, geometric } = useVisualStore();
  const { spheres } = geometric;
  const { shapeGlow } = globalEffects;
  
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const glowMeshRef = useRef<THREE.InstancedMesh>(null);
  const frameCount = useRef(0);
  const pulseTimeRef = useRef(0);
  
  // Safe geometry with bounds checking
  const geometry = useMemo(() => {
    const key = `safe-sphere-geo-${Math.min(0.5, spheres.organicness || 0)}`;
    return resourceManager.getOrCreateGeometry(key, () => {
      const geo = new THREE.SphereGeometry(1, 12, 12); // Reduced quality for performance
      const safeOrganicness = Math.max(0, Math.min(0.3, spheres.organicness || 0));
      
      if (safeOrganicness > 0) {
        const positions = geo.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          const noise = (Math.random() - 0.5) * safeOrganicness;
          positions[i] = safeAdd(positions[i], noise);
          positions[i + 1] = safeAdd(positions[i + 1], noise);
          positions[i + 2] = safeAdd(positions[i + 2], noise);
        }
        geo.attributes.position.needsUpdate = true;
        geo.computeVertexNormals();
      }
      return geo;
    });
  }, [spheres.organicness]);
  
  // Safe material
  const material = useMemo(() => {
    const glowIntensity = Math.max(0, Math.min(1, (shapeGlow?.intensity || 0) * 2));
    const key = `safe-sphere-mat-${spheres.color}-${spheres.opacity}-${glowIntensity}`;
    
    return resourceManager.getOrCreateMaterial(key, () => {
      return new THREE.MeshStandardMaterial({
        color: spheres.color,
        emissive: new THREE.Color(spheres.color),
        emissiveIntensity: glowIntensity,
        transparent: true,
        opacity: Math.max(0.1, Math.min(1, spheres.opacity || 0.8)),
        metalness: glowIntensity > 0 ? 0.5 : 0.1,
        roughness: glowIntensity > 0 ? 0.3 : 0.7,
      });
    });
  }, [spheres.color, spheres.opacity, shapeGlow]);
  
  // Safe positions with bounds
  const positions = useMemo(() => {
    const pos = [];
    const safeCount = Math.max(0, Math.min(MAX_INSTANCES, spheres.count || 0));
    for (let i = 0; i < safeCount; i++) {
      pos.push({
        x: (Math.random() - 0.5) * 40, // Reduced spread
        y: (Math.random() - 0.5) * 25,
        z: (Math.random() - 0.5) * 30,
        phase: Math.random() * Math.PI * 2
      });
    }
    return pos;
  }, [spheres.count]);
  
  // Initialize with safety checks
  useEffect(() => {
    if (!meshRef.current || positions.length === 0) return;
    
    const safeSize = Math.max(0.5, Math.min(3, spheres.size || 1));
    
    for (let i = 0; i < Math.min(positions.length, MAX_INSTANCES); i++) {
      const pos = positions[i];
      if (!pos) continue;
      
      const tempMatrix = new THREE.Matrix4();
      tempMatrix.makeScale(safeSize, safeSize, safeSize);
      tempMatrix.setPosition(pos.x, pos.y, pos.z);
      meshRef.current.setMatrixAt(i, tempMatrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions, spheres.size]);
  
  // Safe animation loop
  useFrame((state) => {
    if (!meshRef.current || positions.length === 0) return;
    
    frameCount.current++;
    if (frameCount.current % UPDATE_FREQUENCY !== 0) return;
    
    const time = state.clock.elapsedTime;
    const safeAnimationSpeed = Math.max(0.1, Math.min(2, globalAnimationSpeed || 1));
    const scaledTime = time * safeAnimationSpeed;
    
    const movementPattern = spheres.movementPattern || 'verticalSine';
    const safeDistance = Math.max(0.5, Math.min(3, spheres.distance || 1.5));
    const finalSpeed = Math.max(0.1, Math.min(2, spheres.speed || 1)) * safeAnimationSpeed;
    const safeSize = Math.max(0.5, Math.min(3, spheres.size || 1));
    
    // Update positions safely
    for (let i = 0; i < Math.min(positions.length, MAX_INSTANCES); i++) {
      const pos = positions[i];
      if (!pos) continue;
      
      let x = pos.x;
      let y = pos.y;
      let z = pos.z;
      
      // Safe movement patterns
      if (movementPattern === 'orbit') {
        x = safeAdd(pos.x, Math.sin(scaledTime + i) * finalSpeed * safeDistance);
        y = safeAdd(pos.y, Math.cos(scaledTime + i * 0.5) * finalSpeed * safeDistance * 0.5);
        z = safeAdd(pos.z, Math.sin(scaledTime * 0.7 + i) * finalSpeed * safeDistance * 0.5);
      } else if (movementPattern === 'verticalSine') {
        y = safeAdd(pos.y, Math.sin(scaledTime + i) * finalSpeed * safeDistance);
      } else if (movementPattern === 'random') {
        x = safeAdd(pos.x, (Math.random() - 0.5) * 0.2 * finalSpeed);
        y = safeAdd(pos.y, (Math.random() - 0.5) * 0.2 * finalSpeed);
        z = safeAdd(pos.z, (Math.random() - 0.5) * 0.2 * finalSpeed);
      }
      
      // Safe distortion
      const distortion = globalEffects?.distortion;
      if (distortion && (distortion.wave > 0 || distortion.ripple > 0)) {
        const distorted = calculateSafeDistortion({ x, y, z }, scaledTime, i, distortion);
        x = distorted.x;
        y = distorted.y;
        z = distorted.z;
      }
      
      // Calculate safe scale (FIXED: No more exponential growth)
      let scale = safeSize;
      if (shapeGlow?.enabled && shapeGlow?.pulsing) {
        const pulsePhase = (pulseTimeRef.current || 0) + (pos.phase || 0);
        const pulseScale = 1 + 0.05 * Math.sin(pulsePhase); // Reduced from 0.1
        scale = safeMultiply(scale, pulseScale);
      }
      
      // Set matrix once
      const tempMatrix = new THREE.Matrix4();
      tempMatrix.makeScale(scale, scale, scale);
      tempMatrix.setPosition(x, y, z);
      meshRef.current.setMatrixAt(i, tempMatrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    
    // Update pulse time safely
    if (shapeGlow?.enabled && shapeGlow?.pulsing) {
      pulseTimeRef.current = safeAdd(pulseTimeRef.current || 0, state.clock.getDelta() * 2);
    }
  });
  
  if (positions.length === 0) return null;
  
  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, Math.min(positions.length, MAX_INSTANCES)]}
      frustumCulled={true}
    />
  );
};