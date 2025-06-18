import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVisualStore } from '../store/visualStore';
import * as THREE from 'three';

export const Cubes = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { geometric, globalEffects, globalAnimationSpeed } = useVisualStore();
  const { cubes } = geometric;

  const cubePositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < cubes.count; i++) {
      positions.push([
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 8,
      ]);
    }
    return positions;
  }, [cubes.count]);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      const noiseIntensity = globalEffects.distortion.noise;
      // Safety check: clamp global animation speed to prevent crashes
      const safeAnimationSpeed = Math.max(0.01, Math.min(5.0, globalAnimationSpeed));
      // Calculate final rotation speed: individual cube rotation * global animation speed
      const finalRotationSpeed = cubes.rotation * safeAnimationSpeed;
      
      groupRef.current.children.forEach((child, i) => {
        // Enhanced rotation with distortion and individual speed * global animation speed
        child.rotation.x += finalRotationSpeed * 0.01;
        child.rotation.y += finalRotationSpeed * 0.015;
        child.position.x += Math.sin(time + i) * 0.01 * safeAnimationSpeed;
        
        // Add noise distortion with global animation speed
        if (noiseIntensity > 0) {
          child.rotation.z += Math.random() * noiseIntensity * 0.1 * safeAnimationSpeed;
          child.scale.setScalar(1 + Math.random() * noiseIntensity * 0.2);
        }
      });
    }
  });

  return (
    <group ref={groupRef} userData={{ objectType: 'cubes' }}>
      {cubePositions.map((position, i) => (
        <mesh key={i} position={position as [number, number, number]}>
          <boxGeometry args={[cubes.size, cubes.size, cubes.size]} />
          <meshBasicMaterial 
            color={cubes.color} 
            transparent 
            opacity={cubes.opacity}
          />
        </mesh>
      ))}
    </group>
  );
}; 