import React, { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVisualStore } from '../store/visualStore';
import { constrainToViewport } from '../utils/backgroundLayout';
import * as THREE from 'three';

// Resource manager for shared geometries and materials
class ResourceManager {
  private static instance: ResourceManager;
  private geometryCache = new Map<string, THREE.BufferGeometry>();
  private materialCache = new Map<string, THREE.Material>();

  static getInstance(): ResourceManager {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }
    return ResourceManager.instance;
  }

  // Create organic geometry matching your existing pattern
  getOrganicGeometry(type: 'cube' | 'sphere' | 'torus', size: number, organicness: number): THREE.BufferGeometry {
    const key = `${type}-${size.toFixed(2)}-${organicness.toFixed(2)}`;
    
    if (!this.geometryCache.has(key)) {
      let geometry: THREE.BufferGeometry | undefined;
      
      // Match your existing geometry creation
      switch (type) {
        case 'cube':
          geometry = new THREE.BoxGeometry(size, size, size);
          break;
        case 'sphere':
          geometry = new THREE.SphereGeometry(size, 16, 16);
          break;
        case 'torus':
          geometry = new THREE.TorusGeometry(size, size * 0.3, 8, 16);
          break;
        default:
          throw new Error(`Unknown geometry type: ${type}`);
      }
      
      if (!geometry) {
        throw new Error(`Failed to create geometry for type: ${type}`);
      }
      
      // Apply organicness exactly like your existing code
      if (organicness > 0) {
        const positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          const noise = (Math.random() - 0.5) * organicness;
          positions[i] += noise;
          positions[i + 1] += noise;
          positions[i + 2] += noise;
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
      }
      
      this.geometryCache.set(key, geometry);
    }
    
    return this.geometryCache.get(key)!;
  }

  // Material manager matching your existing glow system
  getMaterial(
    color: string, 
    opacity: number, 
    glow?: { enabled: boolean; intensity: number; customColor?: string; useObjectColor: boolean }
  ): THREE.Material {
    const glowColor = glow?.enabled ? (glow.useObjectColor ? color : glow.customColor || color) : color;
    const glowIntensity = glow?.enabled ? glow.intensity : 0;
    const key = `${color}-${opacity.toFixed(2)}-${glowColor}-${glowIntensity.toFixed(2)}`;
    
    if (!this.materialCache.has(key)) {
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        emissive: new THREE.Color(glowColor),
        emissiveIntensity: glowIntensity * 2.0, // Match your existing glow intensity
        transparent: opacity < 1,
        opacity,
        blending: glowIntensity > 0 ? THREE.AdditiveBlending : THREE.NormalBlending,
        metalness: glowIntensity > 0 ? 0.8 : 0.0,
        roughness: glowIntensity > 0 ? 0.2 : 0.5,
      });
      
      this.materialCache.set(key, material);
    }
    
    return this.materialCache.get(key)!;
  }

  dispose() {
    this.geometryCache.forEach(geometry => geometry.dispose());
    this.materialCache.forEach(material => material.dispose());
    this.geometryCache.clear();
    this.materialCache.clear();
  }
}

// Optimized shape component using instanced rendering
interface OptimizedShapeProps {
  type: 'cubes' | 'spheres' | 'toruses';
}

const OptimizedShape: React.FC<OptimizedShapeProps> = ({ type }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { geometric, globalEffects, backgroundConfig, globalAnimationSpeed } = useVisualStore();
  const resourceManager = ResourceManager.getInstance();
  
  // Get shape config from your existing store
  const shapeConfig = geometric[type];
  
  // Apply your existing safety checks
  const safeCount = Math.max(0, Math.min(shapeConfig.count || 0, 1000));
  if (safeCount === 0 || !['cubes', 'spheres', 'toruses'].includes(type)) return null;

  // Map plural to singular type safely
  const shapeType =
    type === 'cubes' ? 'cube' :
    type === 'spheres' ? 'sphere' :
    type === 'toruses' ? 'torus' :
    undefined;
  if (!shapeType) return null;

  const safeSize = Math.max(0.1, Math.min(shapeConfig.size || 1, 10));
  const safeSpeed = Math.max(0, Math.min(shapeConfig.speed || 1, 5));
  const safeRotation = type === 'cubes' ? Math.max(0, Math.min((shapeConfig as any).rotation || 1, 5)) : 0;
  const safeOpacity = Math.max(0, Math.min(shapeConfig.opacity || 1, 1));
  const safeOrganicness = Math.max(0, Math.min((shapeConfig as any).organicness || 0, 1));
  const safeAnimationSpeed = Math.max(0.01, Math.min(globalAnimationSpeed, 5));

  // Get layer configuration from your existing background system
  const layerConfig = backgroundConfig.enabled ? 
    backgroundConfig.artisticLayout?.layers?.nearBackground : null;
  const layerZ = layerConfig?.zPosition || 0;

  // Create geometry and material using optimized system
  const geometry = useMemo(() => {
    return resourceManager.getOrganicGeometry(shapeType, safeSize, safeOrganicness);
  }, [shapeType, safeSize, safeOrganicness]);

  const material = useMemo(() => {
    return resourceManager.getMaterial(
      shapeConfig.color,
      safeOpacity,
      globalEffects.shapeGlow.enabled ? globalEffects.shapeGlow : undefined
    );
  }, [shapeConfig.color, safeOpacity, globalEffects.shapeGlow]);

  // Generate stable positions using your existing patterns
  const instanceData = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const rotations: THREE.Euler[] = [];
    const phases: number[] = [];
    
    for (let i = 0; i < safeCount; i++) {
      // Use your existing position generation pattern
      positions.push(new THREE.Vector3(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 40,
      ));
      
      rotations.push(new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ));
      
      phases.push(Math.random() * Math.PI * 2);
    }
    
    return { positions, rotations, phases };
  }, [safeCount]);

  // Temporary objects for matrix calculations (avoids creating new objects each frame)
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const frameCountRef = useRef(0);

  useFrame((state) => {
    if (!meshRef.current || safeCount === 0) return;
    
    const time = state.clock.elapsedTime;
    const timeScale = backgroundConfig.timeScale || 1;
    const scaledTime = time * timeScale * safeAnimationSpeed;
    
    // Your existing distortion effects
    const waveIntensity = (globalEffects.distortion?.wave || 0) * 2;
    const rippleIntensity = (globalEffects.distortion?.ripple || 0) * 3;
    const frequency = globalEffects.distortion?.frequency || 1;
    
    // Calculate final speeds using your existing patterns
    const finalMovementSpeed = safeSpeed * safeAnimationSpeed;
    const finalRotationSpeed = safeRotation * safeAnimationSpeed;

    // Performance optimization: apply viewport constraints less frequently
    frameCountRef.current++;
    const shouldApplyConstraints = backgroundConfig.enabled && frameCountRef.current % 5 === 0;

    // Update instances using your EXACT existing animation patterns
    for (let i = 0; i < safeCount; i++) {
      const originalPos = instanceData.positions[i];
      const originalRot = instanceData.rotations[i];
      const phase = instanceData.phases[i];
      
      // Position calculation matching your existing components exactly
      let x = originalPos.x;
      let y = originalPos.y;
      let z = originalPos.z;
      
      if (type === 'cubes') {
        // Match your Cubes.tsx animation exactly
        x = originalPos.x + Math.sin(scaledTime + i) * 2 * finalMovementSpeed;
        y = originalPos.y + Math.cos(scaledTime + i * 0.5) * 1.5 * finalMovementSpeed;
        z = originalPos.z + Math.sin(scaledTime * 0.7 + i) * 1 * finalMovementSpeed;
      } else if (type === 'spheres' || type === 'toruses') {
        // Match your Spheres/Toruses animation exactly
        y = originalPos.y + Math.sin(scaledTime + i) * 2 * finalMovementSpeed;
        x = originalPos.x;
        z = originalPos.z;
      }
      
      // Apply your existing wave distortion
      if (waveIntensity > 0) {
        x += Math.sin(scaledTime * frequency + i) * waveIntensity;
        z += Math.cos(scaledTime * frequency + i * 0.5) * waveIntensity;
      }
      
      // Apply your existing ripple effect
      if (rippleIntensity > 0) {
        const distance = Math.sqrt(x * x + z * z);
        y += Math.sin(scaledTime * 2 + distance * 0.5) * rippleIntensity;
      }
      
      // Apply viewport constraints using your existing system (less frequently for performance)
      if (shouldApplyConstraints && backgroundConfig.enabled) {
        const constrainedPosition = constrainToViewport({ x, y, z }, layerZ);
        tempObject.position.set(constrainedPosition.x, constrainedPosition.y, constrainedPosition.z);
      } else {
        tempObject.position.set(x, y, z);
      }
      
      // Rotation using your existing patterns
      if (type === 'cubes') {
        // Match your cubes rotation exactly
        tempObject.rotation.set(
          originalRot.x + scaledTime * finalRotationSpeed * 0.01,
          originalRot.y + scaledTime * finalRotationSpeed * 0.015,
          originalRot.z
        );
      } else if (type === 'spheres') {
        // Match spheres rotation (group rotation is handled by the group)
        tempObject.rotation.set(
          originalRot.x + scaledTime * finalMovementSpeed * 0.5,
          originalRot.y + scaledTime * finalMovementSpeed * 0.3,
          originalRot.z
        );
      } else if (type === 'toruses') {
        // Match toruses rotation
        tempObject.rotation.set(
          originalRot.x + scaledTime * finalMovementSpeed * 0.5,
          originalRot.y + scaledTime * finalMovementSpeed * 0.3,
          originalRot.z
        );
      }
      
      // Scale (default to 1, can be animated if needed)
      tempObject.scale.setScalar(1);
      
      // Update matrix
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (safeCount === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, safeCount]}
      frustumCulled={true}
    />
  );
};

// Optimized particles component
const OptimizedParticles: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { particles, globalEffects, backgroundConfig, globalAnimationSpeed } = useVisualStore();
  const resourceManager = ResourceManager.getInstance();
  
  // Apply your existing safety checks
  const safeCount = Math.max(0, Math.min(particles.count, 2000));
  const safeSize = Math.max(0.1, Math.min(particles.size, 5.0));
  const safeSpeed = Math.max(0.1, Math.min(particles.speed, 10.0));
  const safeSpread = Math.max(10, Math.min(particles.spread, 100));
  const safeOpacity = Math.max(0.1, Math.min(particles.opacity, 1.0));
  const safeAnimationSpeed = Math.max(0.01, Math.min(globalAnimationSpeed, 5));

  // Create shared geometry and material
  const geometry = useMemo(() => new THREE.SphereGeometry(0.1, 8, 6), []);
  
  const material = useMemo(() => {
    const glowColor = globalEffects.shapeGlow.useObjectColor ? particles.color : (globalEffects.shapeGlow.customColor || particles.color);
    const glowIntensity = globalEffects.shapeGlow.enabled ? globalEffects.shapeGlow.intensity : 0;
    
    return new THREE.MeshStandardMaterial({
      color: particles.color,
      emissive: new THREE.Color(glowColor),
      emissiveIntensity: glowIntensity * 1.5,
      transparent: true,
      opacity: safeOpacity,
      blending: glowIntensity > 0 ? THREE.AdditiveBlending : THREE.NormalBlending,
      metalness: glowIntensity > 0 ? 0.6 : 0.1,
      roughness: glowIntensity > 0 ? 0.3 : 0.8
    });
  }, [particles.color, safeOpacity, globalEffects.shapeGlow]);

  // Generate particle positions
  const instanceData = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    
    for (let i = 0; i < safeCount; i++) {
      positions.push(new THREE.Vector3(
        (Math.random() - 0.5) * safeSpread * 2,
        (Math.random() - 0.5) * safeSpread * 1.5,
        (Math.random() - 0.5) * safeSpread * 2,
      ));
    }
    
    return { positions };
  }, [safeCount, safeSpread]);

  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const frameCountRef = useRef(0);

  useFrame((state) => {
    if (!meshRef.current || safeCount === 0) return;
    
    const time = state.clock.elapsedTime;
    const timeScale = backgroundConfig.timeScale || 1;
    const scaledTime = time * timeScale * safeAnimationSpeed;
    const turbulence = globalEffects.particleInteraction?.turbulence || 0;
    const finalSpeed = safeSpeed * safeAnimationSpeed;
    
    // Performance optimization: apply constraints less frequently
    frameCountRef.current++;
    const shouldApplyConstraints = backgroundConfig.enabled && frameCountRef.current % 5 === 0;
    const layerZ = backgroundConfig.enabled ? 
      backgroundConfig.artisticLayout?.layers?.midBackground?.zPosition || 0 : 0;

    for (let i = 0; i < safeCount; i++) {
      const originalPos = instanceData.positions[i];
      
      // Match your existing particle animation
      let x = originalPos.x;
      let y = originalPos.y + Math.sin(scaledTime + i) * 0.01 * finalSpeed;
      let z = originalPos.z;
      
      // Add turbulence matching your existing pattern
      if (turbulence > 0) {
        x += (Math.random() - 0.5) * turbulence * 0.1 * finalSpeed;
        y += (Math.random() - 0.5) * turbulence * 0.1 * finalSpeed;
        z += (Math.random() - 0.5) * turbulence * 0.1 * finalSpeed;
      }
      
      // Apply viewport constraints (less frequently)
      if (shouldApplyConstraints && backgroundConfig.enabled) {
        const constrainedPosition = constrainToViewport({ x, y, z }, layerZ);
        tempObject.position.set(constrainedPosition.x, constrainedPosition.y, constrainedPosition.z);
      } else {
        tempObject.position.set(x, y, z);
      }
      
      // Set scale based on size
      tempObject.scale.setScalar(safeSize);
      tempObject.rotation.set(0, 0, 0);
      
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (safeCount === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, safeCount]}
      frustumCulled={true}
    />
  );
};

// Main optimized geometric system
export const OptimizedGeometricSystem: React.FC = () => {
  const { geometric, particles } = useVisualStore();
  
  return (
    <group>
      {/* Replace individual components with optimized versions */}
      {geometric.cubes.count > 0 && <OptimizedShape type="cubes" />}
      {geometric.spheres.count > 0 && <OptimizedShape type="spheres" />}
      {geometric.toruses.count > 0 && <OptimizedShape type="toruses" />}
      {particles.count > 0 && <OptimizedParticles />}
    </group>
  );
};

// Cleanup function
export const cleanupOptimizedResources = () => {
  ResourceManager.getInstance().dispose();
}; 