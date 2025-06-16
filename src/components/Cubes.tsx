import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVisualStore } from '../store/visualStore';
import * as THREE from 'three';

export const Cubes = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { geometric, globalEffects } = useVisualStore();
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
      
      groupRef.current.children.forEach((child, i) => {
        // Enhanced rotation with distortion
        child.rotation.x += cubes.rotation * 0.01;
        child.rotation.y += cubes.rotation * 0.015;
        child.position.x += Math.sin(time + i) * 0.01;
        
        // Add noise distortion
        if (noiseIntensity > 0) {
          child.rotation.z += Math.random() * noiseIntensity * 0.1;
          child.scale.setScalar(1 + Math.random() * noiseIntensity * 0.2);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
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