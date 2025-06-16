import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVisualStore } from '../store/visualStore';
import * as THREE from 'three';

export const Toruses = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { geometric, globalEffects } = useVisualStore();
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
      
      groupRef.current.rotation.y += toruses.speed * 0.01;
      groupRef.current.children.forEach((child, i) => {
        // Base movement
        child.rotation.x += toruses.speed * 0.02;
        child.rotation.z += toruses.speed * 0.01;
        
        // Add wave distortion
        if (waveIntensity > 0) {
          child.position.y += Math.sin(time * globalEffects.distortion.frequency + i) * waveIntensity;
          child.position.x += Math.cos(time * globalEffects.distortion.frequency + i * 0.5) * waveIntensity;
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