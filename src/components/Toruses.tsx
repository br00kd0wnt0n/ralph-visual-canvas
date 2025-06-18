import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVisualStore } from '../store/visualStore';
import * as THREE from 'three';

export const Toruses = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { geometric, globalEffects, globalAnimationSpeed } = useVisualStore();
  const { toruses } = geometric;

  const torusPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < toruses.count; i++) {
      positions.push([
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 8,
      ]);
    }
    return positions;
  }, [toruses.count]);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      const waveIntensity = globalEffects.distortion.wave * 2;
      // Safety check: clamp global animation speed to prevent crashes
      const safeAnimationSpeed = Math.max(0.01, Math.min(5.0, globalAnimationSpeed));
      // Calculate final speed: individual torus speed * global animation speed
      const finalSpeed = toruses.speed * safeAnimationSpeed;
      
      groupRef.current.rotation.y += finalSpeed * 0.01;
      groupRef.current.children.forEach((child, i) => {
        // Base movement with individual speed * global animation speed
        child.rotation.x += finalSpeed * 0.02;
        child.rotation.z += finalSpeed * 0.01;
        
        // Add wave distortion with global animation speed
        if (waveIntensity > 0) {
          child.position.y += Math.sin(time * globalEffects.distortion.frequency + i) * waveIntensity * safeAnimationSpeed;
          child.position.x += Math.cos(time * globalEffects.distortion.frequency + i * 0.5) * waveIntensity * safeAnimationSpeed;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {torusPositions.map((position, i) => (
        <mesh key={i} position={position as [number, number, number]}>
          <torusGeometry args={[toruses.size, toruses.size * 0.3, 16, 32]} />
          <meshBasicMaterial 
            color={toruses.color} 
            transparent 
            opacity={toruses.opacity}
          />
        </mesh>
      ))}
    </group>
  );
}; 