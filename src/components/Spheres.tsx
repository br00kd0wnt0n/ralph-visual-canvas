import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVisualStore } from '../store/visualStore';
import * as THREE from 'three';

export const Spheres = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { geometric, globalEffects } = useVisualStore();
  const { spheres } = geometric;

  const spherePositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < spheres.count; i++) {
      positions.push([
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
      ]);
    }
    return positions;
  }, [spheres.count]);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      
      // Enhanced movement with distortion effects
      const waveIntensity = globalEffects.distortion.wave * 2;
      const rippleIntensity = globalEffects.distortion.ripple * 3;
      
      groupRef.current.rotation.y += spheres.speed * 0.01;
      groupRef.current.children.forEach((child, i) => {
        // Base movement
        child.position.y += Math.sin(time + i) * 0.02 * spheres.speed;
        
        // Add wave distortion
        if (waveIntensity > 0) {
          child.position.x += Math.sin(time * globalEffects.distortion.frequency + i) * waveIntensity;
          child.position.z += Math.cos(time * globalEffects.distortion.frequency + i * 0.5) * waveIntensity;
        }
        
        // Add ripple effect
        if (rippleIntensity > 0) {
          const distance = Math.sqrt(child.position.x ** 2 + child.position.z ** 2);
          child.position.y += Math.sin(time * 2 + distance * 0.5) * rippleIntensity;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {spherePositions.map((position, i) => (
        <mesh key={i} position={position as [number, number, number]}>
          <sphereGeometry args={[spheres.size, 16, 16]} />
          <meshBasicMaterial 
            color={spheres.color} 
            transparent 
            opacity={spheres.opacity}
          />
        </mesh>
      ))}
    </group>
  );
}; 