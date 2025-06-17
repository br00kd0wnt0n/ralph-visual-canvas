import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useVisualStore } from '../store/visualStore';
import { getLayerConfig, constrainToViewport, getMovementSpeed } from '../utils/backgroundLayout';

// Simple seeded random generator
function mulberry32(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export const Blobs: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { geometric, globalEffects, backgroundConfig } = useVisualStore();
  const blobs = geometric.blobs;

  // Get layer configuration for background mode - with proper fallbacks
  const layerConfig = backgroundConfig.enabled ? 
    backgroundConfig.artisticLayout?.layers?.nearBackground : null;
  const layerZ = layerConfig?.zPosition || 0;
  const layerOpacity = layerConfig?.opacity || 1.0;
  const movementSpeed = layerConfig ? getMovementSpeed(layerConfig.movement) : 1.0;

  // Safety checks
  const safeCount = isNaN(blobs.count) || blobs.count < 0 ? 0 : blobs.count;
  const safeSize = isNaN(blobs.size) || blobs.size <= 0 ? 1.0 : blobs.size;
  const safeOrganicness = isNaN(blobs.organicness) || blobs.organicness < 0 ? 0 : blobs.organicness;
  const safeOpacity = isNaN(blobs.opacity) || blobs.opacity < 0 ? 1.0 : blobs.opacity;
  const safeSpeed = isNaN(blobs.speed) || blobs.speed < 0 ? 1.0 : blobs.speed;

  // Early return if no blobs
  if (!blobs || safeCount === 0) {
    return null;
  }

  // Store stable random seeds for each blob
  const seedsRef = useRef<number[]>([]);
  if (seedsRef.current.length !== safeCount) {
    // Regenerate seeds if count changes
    seedsRef.current = Array.from({ length: safeCount }, (_, i) => Math.floor(Math.random() * 1000000) + i * 1000);
  }

  // PERFORMANCE OPTIMIZATION: Use a single shared geometry instead of individual geometries
  const sharedGeometry = useMemo(() => {
    const geometry = new THREE.SphereGeometry(
      safeSize,
      8 + Math.floor(safeOrganicness * 8),
      6 + Math.floor(safeOrganicness * 6)
    );
    
    if (safeOrganicness > 0) {
      const positions = geometry.attributes.position;
      for (let j = 0; j < positions.count; j++) {
        const x = positions.getX(j);
        const y = positions.getY(j);
        const z = positions.getZ(j);
        const distortion = safeOrganicness * 0.3;
        positions.setXYZ(
          j,
          x + (Math.random() - 0.5) * distortion,
          y + (Math.random() - 0.5) * distortion,
          z + (Math.random() - 0.5) * distortion
        );
      }
      positions.needsUpdate = true;
      geometry.computeVertexNormals();
    }
    return geometry;
  }, [safeSize, safeOrganicness]);

  // PERFORMANCE OPTIMIZATION: Use a single shared material
  const sharedMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: blobs.color,
      transparent: true,
      opacity: Math.max(0.1, safeOpacity * layerOpacity),
      side: THREE.DoubleSide
    });
  }, [blobs.color, safeOpacity, layerOpacity]);

  // Stable positions for each blob
  const positionsRef = useRef<[number, number, number][]>([]);
  if (positionsRef.current.length !== safeCount) {
    // Regenerate positions if count changes
    positionsRef.current = seedsRef.current.map((seed) => {
      const rand = mulberry32(seed + 9999);
      return [
        (rand() - 0.5) * 50,
        (rand() - 0.5) * 30,
        (rand() - 0.5) * 40
      ];
    });
  }

  // Frame counter for performance optimization
  const frameCountRef = useRef(0);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      const timeScale = backgroundConfig.timeScale;
      const scaledTime = time * timeScale;
      const waveIntensity = globalEffects.distortion.wave * 2;
      const rippleIntensity = globalEffects.distortion.ripple * 3;
      const adjustedSpeed = safeSpeed * movementSpeed;
      
      // Rotate the entire group
      groupRef.current.rotation.y += adjustedSpeed * 0.01 * timeScale;
      
      // PERFORMANCE OPTIMIZATION: Only apply viewport constraints every 3 frames
      frameCountRef.current++;
      const shouldApplyConstraints = backgroundConfig.enabled && frameCountRef.current % 3 === 0;
      
      // Animate individual blobs
      groupRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const pos = positionsRef.current[i];
        if (!pos) return;
        
        // Base movement - use the same approach as other components
        mesh.position.y = pos[1] + Math.sin(scaledTime + i) * 2 * adjustedSpeed;
        
        // Add wave distortion
        if (waveIntensity > 0) {
          mesh.position.x = pos[0] + Math.sin(scaledTime * globalEffects.distortion.frequency + i) * waveIntensity;
          mesh.position.z = pos[2] + Math.cos(scaledTime * globalEffects.distortion.frequency + i * 0.5) * waveIntensity;
        } else {
          mesh.position.x = pos[0];
          mesh.position.z = pos[2];
        }
        
        // Add ripple effect
        if (rippleIntensity > 0) {
          const distance = Math.sqrt(mesh.position.x ** 2 + mesh.position.z ** 2);
          mesh.position.y += Math.sin(scaledTime * 2 + distance * 0.5) * rippleIntensity;
        }
        
        // Apply layer Z position when in background mode (less frequently)
        if (shouldApplyConstraints) {
          // Apply viewport constraints for background mode
          const constrainedPosition = constrainToViewport({
            x: mesh.position.x,
            y: mesh.position.y,
            z: mesh.position.z
          }, layerZ);
          mesh.position.set(constrainedPosition.x, constrainedPosition.y, constrainedPosition.z);
        }
        
        // Add rotation and scaling
        mesh.rotation.x += Math.sin(scaledTime + i) * 0.01 * adjustedSpeed;
        mesh.rotation.z += Math.cos(scaledTime + i * 0.5) * 0.008 * adjustedSpeed;
        
        const scale = 1 + Math.sin(scaledTime + i) * 0.1;
        mesh.scale.setScalar(scale);
      });
    }
  });

  return (
    <group ref={groupRef} key={`blobs-${backgroundConfig.enabled}-${safeCount}`}>
      {positionsRef.current.map((position, i) => (
        <mesh
          key={`blob-${i}-${safeCount}`}
          geometry={sharedGeometry}
          material={sharedMaterial}
          position={position}
        />
      ))}
    </group>
  );
};