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
  const groupRef = useRef<THREE.Group>(null);
  const { geometric, globalEffects, backgroundConfig, globalAnimationSpeed } = useVisualStore();
  const blobs = geometric.blobs;
  const { shapeGlow } = globalEffects;

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

  // Enhanced glow effect for blobs
  const glowColor = shapeGlow.useObjectColor ? blobs.color : (shapeGlow.customColor || blobs.color);
  const glowIntensity = shapeGlow.enabled ? shapeGlow.intensity : 0;

  // PERFORMANCE OPTIMIZATION: Use a single shared material with proper 3D rendering and enhanced glow
  const sharedMaterial = useMemo(() => {
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
  }, [blobs.color, glowColor, glowIntensity, blobs.opacity]);

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
      // Safety check: clamp global animation speed to prevent crashes
      const safeAnimationSpeed = Math.max(0.01, Math.min(5.0, globalAnimationSpeed));
      const scaledTime = time * safeAnimationSpeed;
      const waveIntensity = globalEffects.distortion.wave * 2;
      const rippleIntensity = globalEffects.distortion.ripple * 3;
      // Calculate final speed: individual blob speed * movement speed * global animation speed
      const finalSpeed = safeSpeed * movementSpeed * safeAnimationSpeed;
      
      // Rotate the entire group with individual speed * global animation speed
      groupRef.current.rotation.y += finalSpeed * 0.01;
      
      // PERFORMANCE OPTIMIZATION: Only apply viewport constraints every 3 frames
      frameCountRef.current++;
      const shouldApplyConstraints = backgroundConfig.enabled && frameCountRef.current % 3 === 0;
      
      // Animate individual blobs with individual speed * global animation speed
      groupRef.current.children.forEach((child, i) => {
        const trailObjectGroup = child as THREE.Group;
        const mesh = trailObjectGroup.children[0] as THREE.Mesh;
        const pos = positionsRef.current[i];
        if (!pos) return;
        
        // Set position on the group (which TrailObject reads from)
        let x = pos[0];
        let y = pos[1] + Math.sin(scaledTime + i) * 2 * finalSpeed;
        let z = pos[2];
        
        // Add wave distortion with global animation speed
        if (waveIntensity > 0) {
          x = pos[0] + Math.sin(scaledTime * globalEffects.distortion.frequency + i) * waveIntensity;
          z = pos[2] + Math.cos(scaledTime * globalEffects.distortion.frequency + i * 0.5) * waveIntensity;
        }
        
        // Add ripple effect with global animation speed
        if (rippleIntensity > 0) {
          const distance = Math.sqrt(x ** 2 + z ** 2);
          y += Math.sin(scaledTime * 2 + distance * 0.5) * rippleIntensity;
        }
        
        // Apply layer Z position when in background mode (less frequently)
        if (shouldApplyConstraints) {
          // Apply viewport constraints for background mode
          const constrainedPosition = constrainToViewport({
            x: x,
            y: y,
            z: z
          }, layerZ);
          trailObjectGroup.position.set(constrainedPosition.x, constrainedPosition.y, constrainedPosition.z);
        } else {
          trailObjectGroup.position.set(x, y, z);
        }
        
        // Add rotation and scaling with individual speed * global animation speed
        mesh.rotation.x += Math.sin(scaledTime + i) * 0.01 * finalSpeed;
        mesh.rotation.z += Math.cos(scaledTime + i * 0.5) * 0.008 * finalSpeed;
        
        const scale = 1 + Math.sin(scaledTime + i) * 0.1;
        mesh.scale.setScalar(scale);
      });
    }
  });

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
          material={sharedMaterial}
        >
          <group position={position}>
            <mesh
              geometry={sharedGeometry}
              material={sharedMaterial}
            />
            
            {/* Add pulsing glow effect when enabled */}
            {shapeGlow.enabled && shapeGlow.pulsing && (
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