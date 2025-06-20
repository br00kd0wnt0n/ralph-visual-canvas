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
      // Calculate final speeds: individual cube speeds * global animation speed
      const finalRotationSpeed = cubes.rotation * safeAnimationSpeed;
      const finalMovementSpeed = cubes.speed * safeAnimationSpeed;
      
      groupRef.current.children.forEach((child, i) => {
        const originalPos = cubePositions[i];
        if (!originalPos) return;
        
        // Rotation: use rotation property for spinning
        child.rotation.x += finalRotationSpeed * 0.01;
        child.rotation.y += finalRotationSpeed * 0.015;
        
        // Movement: use speed property for position changes based on original position
        child.position.x = originalPos[0] + Math.sin(time + i) * 2 * finalMovementSpeed;
        child.position.y = originalPos[1] + Math.cos(time + i * 0.5) * 1.5 * finalMovementSpeed;
        child.position.z = originalPos[2] + Math.sin(time * 0.7 + i) * 1 * finalMovementSpeed;
        
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