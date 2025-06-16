import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVisualStore } from '../store/visualStore';
import * as THREE from 'three';

export const Particles = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const { particles, globalEffects } = useVisualStore();

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particles.count * 3);
    for (let i = 0; i < particles.count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * particles.spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * particles.spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * particles.spread;
    }
    return positions;
  }, [particles.count, particles.spread]);

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.elapsedTime;
      pointsRef.current.rotation.y += particles.speed * 0.005;
      
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const turbulence = globalEffects.particleInteraction.turbulence;
      
      for (let i = 0; i < positions.length; i += 3) {
        // Base movement
        positions[i + 1] += Math.sin(time + i) * 0.01 * particles.speed;
        
        // Add turbulence
        if (turbulence > 0) {
          positions[i] += (Math.random() - 0.5) * turbulence * 0.1;
          positions[i + 1] += (Math.random() - 0.5) * turbulence * 0.1;
          positions[i + 2] += (Math.random() - 0.5) * turbulence * 0.1;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.count}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={particles.color}
        size={particles.size * 2}
        transparent
        opacity={particles.opacity}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}; 