import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVisualStore } from '../store/visualStore';
import * as THREE from 'three';

export const Particles = () => {
  const { particles, globalEffects, globalAnimationSpeed } = useVisualStore();

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

  // Use a single geometry instance for all particles
  const particleGeometry = useMemo(() => {
    return new THREE.SphereGeometry(0.5, 8, 6); // base size, will be scaled
  }, []);

  const particleMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: particles.color,
      transparent: true,
      opacity: particles.opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [particles.color, particles.opacity]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const turbulence = globalEffects.particleInteraction.turbulence;
    // Safety check: clamp global animation speed to prevent crashes
    const safeAnimationSpeed = Math.max(0.01, Math.min(5.0, globalAnimationSpeed));
    // Calculate final speed: individual particle speed * global animation speed
    const finalSpeed = particles.speed * safeAnimationSpeed;
    const scale = Math.max(0.01, particles.size);

    particleRefs.current.forEach((mesh, i) => {
      if (mesh) {
        // Set scale based on slider
        mesh.scale.set(scale, scale, scale);
        // Base movement with individual speed * global animation speed
        mesh.position.y += Math.sin(time + i) * 0.01 * finalSpeed;
        // Add turbulence with individual speed * global animation speed
        if (turbulence > 0) {
          mesh.position.x += (Math.random() - 0.5) * turbulence * 0.1 * finalSpeed;
          mesh.position.y += (Math.random() - 0.5) * turbulence * 0.1 * finalSpeed;
          mesh.position.z += (Math.random() - 0.5) * turbulence * 0.1 * finalSpeed;
        }
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
          material={particleMaterial}
        />
      ))}
    </group>
  );
}; 