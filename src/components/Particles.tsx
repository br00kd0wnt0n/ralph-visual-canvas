import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVisualStore } from '../store/visualStore';
import * as THREE from 'three';

export const Particles = () => {
  const { particles, globalEffects, globalAnimationSpeed } = useVisualStore();
  const { shapeGlow } = globalEffects;
  const glowIntensity = shapeGlow?.enabled ? (shapeGlow?.intensity ?? 0) : 0;

  const particlePositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < particles.count; i++) {
      positions.push({
        x: (Math.random() - 0.5) * particles.spread,
        y: (Math.random() - 0.5) * particles.spread,
        z: (Math.random() - 0.5) * particles.spread,
      });
    }
    return positions;
  }, [particles.count, particles.spread]);

  const particleRefs = useRef<THREE.Mesh[]>([]);
  const pulseTimeRef = useRef(0);

  // Use a single geometry instance for all particles
  const particleGeometry = useMemo(() => {
    return new THREE.SphereGeometry(0.5, 8, 6); // base size, will be scaled
  }, []);

  // Individual materials for each particle
  const particleMaterials = useMemo(() => {
    return Array.from({ length: particles.count }, () => {
      return new THREE.MeshStandardMaterial({
      color: particles.color,
      transparent: true,
      opacity: particles.opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
        emissive: new THREE.Color(particles.color),
        emissiveIntensity: 0,
      });
    });
  }, [particles.count, particles.color, particles.opacity]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const turbulence = globalEffects.particleInteraction.turbulence;
    // Safety check: clamp global animation speed to prevent crashes
    const safeAnimationSpeed = Math.max(0.01, Math.min(5.0, globalAnimationSpeed));
    // Calculate final speed: individual particle speed * global animation speed
    const finalSpeed = particles.speed * safeAnimationSpeed;
    const scale = Math.max(0.01, particles.size);
    const movementPattern = particles.movementPattern || 'random';
    const safeDistance = isNaN(particles.distance) || particles.distance < 0 ? 1.5 : particles.distance;
    const pulseEnabled = particles.pulseEnabled || false;
    const pulseSize = isNaN(particles.pulseSize) || particles.pulseSize < 0 ? 1.0 : particles.pulseSize;
    
    // Debug logging for pulsing state
    if (pulseEnabled && Math.random() < 0.001) {
      console.log(`🔍 [particles] Pulsing Debug:`, {
        pulseEnabled,
        pulseSize,
        glowIntensity,
        shapeGlow: {
          enabled: shapeGlow.enabled,
          intensity: shapeGlow.intensity,
          useObjectColor: shapeGlow.useObjectColor,
          customColor: shapeGlow.customColor
        }
      });
    }

    // Update pulse time for individual particle pulsing
    if (pulseEnabled) {
      pulseTimeRef.current += state.clock.getDelta() * safeAnimationSpeed;
    }

    particleRefs.current.forEach((mesh, i) => {
      if (mesh && particlePositions[i]) {
        // Set scale based on slider
        mesh.scale.set(scale, scale, scale);
        // Movement pattern logic
        let x = particlePositions[i].x;
        let y = particlePositions[i].y;
        let z = particlePositions[i].z;
        if (movementPattern === 'orbit') {
          x = particlePositions[i].x + Math.sin(time + i) * 2 * finalSpeed * safeDistance;
          y = particlePositions[i].y + Math.cos(time + i * 0.5) * 1.5 * finalSpeed * safeDistance;
          z = particlePositions[i].z + Math.sin(time * 0.7 + i) * 1 * finalSpeed * safeDistance;
        } else if (movementPattern === 'verticalSine') {
          y = particlePositions[i].y + Math.sin(time + i) * 2 * finalSpeed * safeDistance;
        } else if (movementPattern === 'random') {
          x = particlePositions[i].x + (Math.random() - 0.5) * 0.5 * finalSpeed * safeDistance;
          y = particlePositions[i].y + (Math.random() - 0.5) * 0.5 * finalSpeed * safeDistance;
          z = particlePositions[i].z + (Math.random() - 0.5) * 0.5 * finalSpeed * safeDistance;
        }
        // 'static' does nothing
        // Add turbulence with individual speed * global animation speed
        if (turbulence > 0) {
          x += (Math.random() - 0.5) * turbulence * 0.1 * finalSpeed;
          y += (Math.random() - 0.5) * turbulence * 0.1 * finalSpeed;
          z += (Math.random() - 0.5) * turbulence * 0.1 * finalSpeed;
        }
        mesh.position.set(x, y, z);
        
        // Apply individual particle pulsing
        if (pulseEnabled) {
          const material = particleMaterials[i]; // Use individual material
          if (material && material.emissiveIntensity !== undefined) {
            const pulsePhase = pulseTimeRef.current + i * 0.3;
            const pulseIntensity = 0.5 + 0.5 * Math.sin(pulsePhase);
            const newEmissiveIntensity = glowIntensity * 1.5 * pulseIntensity * pulseSize;
            material.emissiveIntensity = newEmissiveIntensity;
            
            // Debug logging for first particle only
            if (i === 0 && Math.random() < 0.01) {
              console.log(`✨ [particle-${i}] Pulsing Animation:`, {
                pulsePhase: pulsePhase.toFixed(2),
                pulseIntensity: pulseIntensity.toFixed(3),
                newEmissiveIntensity: newEmissiveIntensity.toFixed(3),
                materialType: material.type,
                hasEmissive: 'emissive' in material,
                emissiveColor: material.emissive?.getHexString()
              });
            }
          }
        }
      }
    });

    console.log('🎨 Particles component - Current store values:', {
      count: particles.count,
      size: particles.size,
      color: particles.color,
      speed: particles.speed,
      opacity: particles.opacity,
      spread: particles.spread,
      movementPattern: particles.movementPattern,
      distance: particles.distance,
      pulseEnabled: particles.pulseEnabled,
      pulseSize: particles.pulseSize,
      globalAnimationSpeed: globalAnimationSpeed,
      shapeGlow: {
        enabled: shapeGlow?.enabled,
        intensity: shapeGlow?.intensity,
        useObjectColor: shapeGlow?.useObjectColor,
        customColor: shapeGlow?.customColor
      }
    });
  });

  return (
    <group>
      {particlePositions.map((pos, i) => (
        <mesh
          key={`particle-${i}`}
          ref={(el) => {
            if (el) particleRefs.current[i] = el;
          }}
          position={[pos.x, pos.y, pos.z]}
          geometry={particleGeometry}
          material={particleMaterials[i]}
        />
      ))}
    </group>
  );
}; 