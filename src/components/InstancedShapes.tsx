import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useVisualStore } from '../store/visualStore';
import { constrainToViewport } from '../utils/backgroundLayout';
import { resourceManager } from '../utils/ResourceManager';
import { calculateDistortion } from './DistortionFix';
import { calculateGlowSettings } from './EnhancedGlowEffect';

// Performance constants
const UPDATE_FREQUENCY = 2; // Update every N frames
const MAX_INSTANCES = 200; // Maximum instances per mesh

// Helper to create matrix for instance
const tempObject = new THREE.Object3D();
const tempMatrix = new THREE.Matrix4();
const tempColor = new THREE.Color();

// Instanced Spheres Component
export const InstancedSpheres = () => {
  const { globalEffects, backgroundConfig, globalAnimationSpeed, geometric } = useVisualStore();
  const { spheres } = geometric;
  const { shapeGlow } = globalEffects;
  
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const glowMeshRef = useRef<THREE.InstancedMesh>(null);
  const frameCount = useRef(0);
  const pulseTimeRef = useRef(0);
  
  // Use ResourceManager for geometry
  const geometry = useMemo(() => {
    const key = `sphere-geo-${spheres.organicness}`;
    return resourceManager.getOrCreateGeometry(key, () => {
      const geo = new THREE.SphereGeometry(1, 16, 16);
      // Apply organicness deformation once
      if (spheres.organicness > 0) {
        const positions = geo.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          const noise = (Math.random() - 0.5) * spheres.organicness;
          positions[i] += noise;
          positions[i + 1] += noise;
          positions[i + 2] += noise;
        }
        geo.attributes.position.needsUpdate = true;
        geo.computeVertexNormals();
      }
      return geo;
    });
  }, [spheres.organicness]);
  
  // Calculate enhanced glow settings
  const glowSettings = useMemo(() => {
    return calculateGlowSettings(spheres.color, shapeGlow, 'sphere');
  }, [spheres.color, shapeGlow]);
  
  // Use ResourceManager for material with enhanced glow
  const material = useMemo(() => {
    const key = `sphere-mat-${spheres.color}-${spheres.opacity}-${glowSettings.intensity}`;
    
    return resourceManager.getOrCreateMaterial(key, () => {
      return new THREE.MeshStandardMaterial({
        color: spheres.color,
        ...glowSettings.materialSettings
      });
    });
  }, [spheres.color, spheres.opacity, glowSettings]);
  
  // Initialize positions
  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < spheres.count; i++) {
      pos.push({
        x: (Math.random() - 0.5) * 50,
        y: (Math.random() - 0.5) * 30,
        z: (Math.random() - 0.5) * 40,
        phase: Math.random() * Math.PI * 2
      });
    }
    return pos;
  }, [spheres.count]);
  
  // Set initial matrices
  useEffect(() => {
    if (!meshRef.current) return;
    
    for (let i = 0; i < spheres.count; i++) {
      const pos = positions[i];
      tempObject.position.set(pos.x, pos.y, pos.z);
      tempObject.scale.setScalar(spheres.size);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    
    // Set colors if needed
    if (meshRef.current.instanceColor) {
      for (let i = 0; i < spheres.count; i++) {
        tempColor.set(spheres.color);
        meshRef.current.setColorAt(i, tempColor);
      }
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [spheres.count, spheres.size, spheres.color, positions]);
  
  // Animation loop
  useFrame((state) => {
    if (!meshRef.current || spheres.count === 0) return;
    
    frameCount.current++;
    if (frameCount.current % UPDATE_FREQUENCY !== 0) return;
    
    const time = state.clock.elapsedTime;
    const timeScale = backgroundConfig.timeScale;
    const safeAnimationSpeed = Math.max(0.01, Math.min(5.0, globalAnimationSpeed));
    const scaledTime = time * timeScale * safeAnimationSpeed;
    
    const movementPattern = spheres.movementPattern || 'verticalSine';
    const safeDistance = spheres.distance || 2.0;
    const finalSpeed = spheres.speed * safeAnimationSpeed;
    
    // Update pulse time for glow
    if (shapeGlow?.enabled && shapeGlow?.pulsing) {
      pulseTimeRef.current += state.clock.getDelta() * (shapeGlow?.pulseSpeed ?? 1.0) * safeAnimationSpeed;
    }
    
    // Update each instance
    for (let i = 0; i < spheres.count; i++) {
      const pos = positions[i];
      if (!pos) continue;
      
      let x = pos.x;
      let y = pos.y;
      let z = pos.z;
      
      // Apply movement pattern
      if (movementPattern === 'orbit') {
        x = pos.x + Math.sin(scaledTime + i) * 2 * finalSpeed * safeDistance;
        y = pos.y + Math.cos(scaledTime + i * 0.5) * 1.5 * finalSpeed * safeDistance;
        z = pos.z + Math.sin(scaledTime * 0.7 + i) * 1 * finalSpeed * safeDistance;
      } else if (movementPattern === 'verticalSine') {
        y = pos.y + Math.sin(scaledTime + i) * 2 * finalSpeed * safeDistance;
      } else if (movementPattern === 'random') {
        x = pos.x + (Math.random() - 0.5) * 0.5 * finalSpeed * safeDistance;
        y = pos.y + (Math.random() - 0.5) * 0.5 * finalSpeed * safeDistance;
        z = pos.z + (Math.random() - 0.5) * 0.5 * finalSpeed * safeDistance;
      }
      
      // Apply enhanced distortion effects
      const distortion = globalEffects?.distortion;
      if (distortion && (distortion.wave > 0 || distortion.ripple > 0)) {
        const distorted = calculateDistortion(
          { x, y, z },
          scaledTime,
          i,
          distortion
        );
        x = distorted.x;
        y = distorted.y;
        z = distorted.z;
      }
      
      // Set position and scale
      tempObject.position.set(x, y, z);
      tempObject.scale.setScalar(spheres.size);
      
      // Apply pulsing scale if enabled
      if (shapeGlow?.enabled && shapeGlow?.pulsing) {
        const pulsePhase = pulseTimeRef.current + pos.phase;
        const pulseScale = 1 + 0.1 * Math.sin(pulsePhase);
        tempObject.scale.multiplyScalar(pulseScale);
      }
      
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
      
      // Update glow mesh if exists
      if (glowMeshRef.current && glowSettings.enabled) {
        tempObject.scale.multiplyScalar(glowSettings.outerGlowSettings.scale);
        tempObject.updateMatrix();
        glowMeshRef.current.setMatrixAt(i, tempObject.matrix);
      }
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (glowMeshRef.current) {
      glowMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });
  
  if (spheres.count === 0) return null;
  
  return (
    <group>
      <instancedMesh
        ref={meshRef}
        args={[geometry, material, Math.min(spheres.count, MAX_INSTANCES)]}
        frustumCulled={false}
      />
      {glowSettings.enabled && (
        <instancedMesh
          ref={glowMeshRef}
          args={[
            geometry,
            new THREE.MeshBasicMaterial({
              color: glowSettings.outerGlowSettings.color,
              transparent: true,
              opacity: glowSettings.outerGlowSettings.opacity,
              blending: THREE.AdditiveBlending,
              side: THREE.BackSide,
              depthWrite: false
            }),
            Math.min(spheres.count, MAX_INSTANCES)
          ]}
          frustumCulled={false}
        />
      )}
    </group>
  );
};

// Similar implementations for Cubes and Toruses...
export const InstancedCubes = () => {
  // Implementation similar to InstancedSpheres but with BoxGeometry
  const { globalEffects, backgroundConfig, globalAnimationSpeed, geometric } = useVisualStore();
  const { cubes } = geometric;
  const { shapeGlow } = globalEffects;
  
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const frameCount = useRef(0);
  
  const geometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    if (cubes.organicness > 0) {
      const positions = geo.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const noise = (Math.random() - 0.5) * cubes.organicness;
        positions[i] += noise;
        positions[i + 1] += noise;
        positions[i + 2] += noise;
      }
      geo.attributes.position.needsUpdate = true;
      geo.computeVertexNormals();
    }
    return geo;
  }, [cubes.organicness]);
  
  const material = useMemo(() => {
    const glowColor = shapeGlow?.useObjectColor ? cubes.color : (shapeGlow?.customColor || cubes.color);
    const glowIntensity = shapeGlow?.enabled ? shapeGlow?.intensity : 0;
    
    return new THREE.MeshStandardMaterial({
      color: cubes.color,
      emissive: new THREE.Color(glowColor),
      emissiveIntensity: glowIntensity * 2.0,
      transparent: true,
      opacity: cubes.opacity,
      metalness: glowIntensity > 0 ? 0.8 : 0.0,
      roughness: glowIntensity > 0 ? 0.2 : 0.5,
    });
  }, [cubes.color, cubes.opacity, shapeGlow]);
  
  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < cubes.count; i++) {
      pos.push({
        x: (Math.random() - 0.5) * 50,
        y: (Math.random() - 0.5) * 30,
        z: (Math.random() - 0.5) * 40,
      });
    }
    return pos;
  }, [cubes.count]);
  
  useEffect(() => {
    if (!meshRef.current) return;
    
    for (let i = 0; i < cubes.count; i++) {
      const pos = positions[i];
      tempObject.position.set(pos.x, pos.y, pos.z);
      tempObject.scale.setScalar(cubes.size);
      tempObject.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [cubes.count, cubes.size, positions]);
  
  useFrame((state) => {
    if (!meshRef.current || cubes.count === 0) return;
    
    frameCount.current++;
    if (frameCount.current % UPDATE_FREQUENCY !== 0) return;
    
    const time = state.clock.elapsedTime;
    const safeAnimationSpeed = Math.max(0.01, Math.min(5.0, globalAnimationSpeed));
    const finalRotationSpeed = cubes.rotation * safeAnimationSpeed;
    const finalMovementSpeed = cubes.speed * safeAnimationSpeed;
    
    for (let i = 0; i < cubes.count; i++) {
      const pos = positions[i];
      if (!pos) continue;
      
      meshRef.current.getMatrixAt(i, tempMatrix);
      tempMatrix.decompose(tempObject.position, tempObject.quaternion, tempObject.scale);
      
      // Update rotation
      tempObject.rotation.x += finalRotationSpeed * 0.01;
      tempObject.rotation.y += finalRotationSpeed * 0.015;
      
      // Update position
      tempObject.position.x = pos.x + Math.sin(time + i) * 2 * finalMovementSpeed;
      tempObject.position.y = pos.y + Math.cos(time + i * 0.5) * 1.5 * finalMovementSpeed;
      tempObject.position.z = pos.z + Math.sin(time * 0.7 + i) * 1 * finalMovementSpeed;
      
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  
  if (cubes.count === 0) return null;
  
  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, Math.min(cubes.count, MAX_INSTANCES)]}
      frustumCulled={false}
    />
  );
};