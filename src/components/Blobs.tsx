import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useVisualStore } from '../store/visualStore';
import { getLayerConfig, constrainToViewport, getMovementSpeed } from '../utils/backgroundLayout';
import { TrailObject } from './TrailObject';

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
  // ALL HOOKS MUST BE CALLED FIRST, BEFORE ANY CONDITIONAL LOGIC
  const groupRef = useRef<THREE.Group>(null);
  const { geometric, globalEffects, backgroundConfig, globalAnimationSpeed } = useVisualStore();
  const { blobs } = geometric;
  const { shapeGlow } = globalEffects;

  // Store stable random seeds for each blob
  const seedsRef = useRef<number[]>([]);
  
  // Frame counter for performance optimization
  const frameCountRef = useRef(0);
  const pulseTimeRef = useRef(0);

  // Stable positions for each blob
  const positionsRef = useRef<THREE.Vector3[]>([]);

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

  // Update seeds if count changes
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

  // Enhanced glow effect for blobs with safety checks
  const glowColor = shapeGlow?.useObjectColor ? blobs.color : (shapeGlow?.customColor || blobs.color);
  const glowIntensity = shapeGlow?.enabled ? (shapeGlow?.intensity ?? 0) : 0;

  // Individual materials for each blob
  const blobMaterials = useMemo(() => {
    return Array.from({ length: safeCount }, () => {
    return new THREE.MeshStandardMaterial({
      color: blobs.color,
      emissive: new THREE.Color(glowColor),
      emissiveIntensity: glowIntensity * 2.0, // Much stronger glow
      transparent: true,
      opacity: blobs.opacity, // Use actual blobs opacity instead of layerOpacity
      side: THREE.DoubleSide,
      // Add additive blending for more vibrant glow
      blending: glowIntensity > 0 ? THREE.AdditiveBlending : THREE.NormalBlending,
      // Increase metalness and roughness for better glow visibility
      metalness: glowIntensity > 0 ? 0.8 : 0.1,
      roughness: glowIntensity > 0 ? 0.2 : 0.8
    });
    });
  }, [safeCount, blobs.color, blobs.opacity, glowColor, glowIntensity]);

  // Update positions if count changes
  if (positionsRef.current.length !== safeCount) {
    // Regenerate positions if count changes
    positionsRef.current = seedsRef.current.map((seed) => {
      const rand = mulberry32(seed + 9999);
      return new THREE.Vector3(
        (rand() - 0.5) * 50,
        (rand() - 0.5) * 30,
        (rand() - 0.5) * 40
      );
    });
  }

  // ALWAYS call useFrame, but make it conditional inside
  useFrame((state) => {
    // Early return if conditions aren't met
    if (!groupRef.current || !blobs || safeCount === 0) return;
    
      const time = state.clock.elapsedTime;
    const timeScale = backgroundConfig.timeScale;
      const safeAnimationSpeed = Math.max(0.01, Math.min(5.0, globalAnimationSpeed));
    const scaledTime = time * timeScale * safeAnimationSpeed;
    const finalSpeed = blobs.speed * safeAnimationSpeed;
    const movementPattern = blobs.movementPattern || 'orbit';
    const safeDistance = isNaN(blobs.distance) || blobs.distance < 0 ? 3.0 : blobs.distance;
    const pulseEnabled = blobs.pulseEnabled || false;
    const pulseSize = isNaN(blobs.pulseSize) || blobs.pulseSize < 0 ? 1.0 : blobs.pulseSize;
    
    // Debug logging for pulsing state
    if (pulseEnabled && Math.random() < 0.001) {
      console.log(`🔍 [blobs] Pulsing Debug:`, {
        pulseEnabled,
        pulseSize,
        glowIntensity,
        shapeGlow: {
          enabled: shapeGlow?.enabled,
          intensity: shapeGlow?.intensity,
          useObjectColor: shapeGlow?.useObjectColor,
          customColor: shapeGlow?.customColor
        }
      });
    }
    
    // Update pulse time for individual blob pulsing
    if (pulseEnabled) {
      pulseTimeRef.current += state.clock.getDelta() * safeAnimationSpeed;
    }
    
      groupRef.current.children.forEach((child, i) => {
        const trailObjectGroup = child as THREE.Group;
        const mesh = trailObjectGroup.children[0] as THREE.Mesh;
      const material = blobMaterials[i]; // Use individual material
        const pos = positionsRef.current[i];
        if (!pos) return;
        
      // Individual blob speed and rotation
      const individualSpeed = safeSpeed * safeAnimationSpeed;
      
      // Apply individual rotation to each blob
      mesh.rotation.x += individualSpeed * 0.01 * timeScale;
      mesh.rotation.y += individualSpeed * 0.01 * timeScale;
      mesh.rotation.z += individualSpeed * 0.005 * timeScale;
      
      let x = pos.x;
      let y = pos.y;
      let z = pos.z;
      
      // Movement pattern logic
      if (movementPattern === 'orbit') {
        x = pos.x + Math.sin(scaledTime + i) * 2 * individualSpeed * safeDistance;
        y = pos.y + Math.cos(scaledTime + i * 0.5) * 1.5 * individualSpeed * safeDistance;
        z = pos.z + Math.sin(scaledTime * 0.7 + i) * 1 * individualSpeed * safeDistance;
      } else if (movementPattern === 'verticalSine') {
        y = pos.y + Math.sin(scaledTime + i) * 2 * individualSpeed * safeDistance;
      } else if (movementPattern === 'random') {
        x = pos.x + (Math.random() - 0.5) * 0.5 * individualSpeed * safeDistance;
        y = pos.y + (Math.random() - 0.5) * 0.5 * individualSpeed * safeDistance;
        z = pos.z + (Math.random() - 0.5) * 0.5 * individualSpeed * safeDistance;
        }
      // 'static' does nothing
      
      trailObjectGroup.position.set(x, y, z);
      
      // Apply individual blob pulsing
      if (pulseEnabled && material) {
        if (material.emissiveIntensity !== undefined) {
          const pulsePhase = pulseTimeRef.current + i * 0.4;
          const pulseIntensity = 0.5 + 0.5 * Math.sin(pulsePhase);
          const newEmissiveIntensity = glowIntensity * 2.0 * pulseIntensity * pulseSize;
          material.emissiveIntensity = newEmissiveIntensity;
          
          // Debug logging for first blob only
          if (i === 0 && Math.random() < 0.01) {
            console.log(`✨ [blob-${i}] Pulsing Animation:`, {
              pulsePhase: pulsePhase.toFixed(2),
              pulseIntensity: pulseIntensity.toFixed(3),
              newEmissiveIntensity: newEmissiveIntensity.toFixed(3),
              materialType: material.type,
              hasEmissive: 'emissive' in material,
              emissiveColor: material.emissive?.getHexString()
            });
          }
        }
        
        // Also animate the pulsing glow mesh if it exists
        if (trailObjectGroup.children.length > 1) {
          const glowMesh = trailObjectGroup.children[1] as THREE.Mesh;
          const glowMaterial = glowMesh.material as THREE.MeshBasicMaterial;
          if (glowMaterial && glowMaterial.opacity !== undefined) {
            const pulsePhase = pulseTimeRef.current + i * 0.4;
            const pulseIntensity = 0.5 + 0.5 * Math.sin(pulsePhase);
            glowMaterial.opacity = glowIntensity * 0.3 * pulseIntensity * pulseSize;
          }
    }
      }
    });
  });

  // NOW we can have conditional returns after all hooks are called
  if (!blobs || safeCount === 0) {
    return null;
  }

  return (
    <group ref={groupRef} key={`blobs-${backgroundConfig.enabled}-${safeCount}`}>
      {positionsRef.current.map((position, i) => (
        <TrailObject 
          key={`blob-${i}-${safeCount}`}
          id={`blob-${i}`}
          color={new THREE.Color(blobs.color)}
          size={safeSize}
          velocityThreshold={0.05}
          trailType='blobTrails'
          geometry={sharedGeometry}
          material={blobMaterials[i]}
        >
          <group position={position}>
            <mesh
              geometry={sharedGeometry}
              material={blobMaterials[i]}
            />
            
            {/* Add pulsing glow effect when enabled */}
            {shapeGlow?.enabled && shapeGlow?.pulsing && (
              <mesh geometry={sharedGeometry} position={[0, 0, 0]}>
                <meshBasicMaterial
                  color={glowColor}
                  transparent={true}
                  opacity={glowIntensity * 0.3}
                  blending={THREE.AdditiveBlending}
                  side={THREE.BackSide}
                />
              </mesh>
            )}
          </group>
        </TrailObject>
      ))}
    </group>
  );
};