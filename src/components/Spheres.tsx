import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVisualStore } from '../store/visualStore';
import * as THREE from 'three';

export const Spheres = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { geometric, globalEffects, globalAnimationSpeed } = useVisualStore();
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
      
      // Enhanced movement with distortion effects and individual speed * global animation speed
      const waveIntensity = globalEffects.distortion.wave * 2;
      const rippleIntensity = globalEffects.distortion.ripple * 3;
      // Safety check: clamp global animation speed to prevent crashes
      const safeAnimationSpeed = Math.max(0.01, Math.min(5.0, globalAnimationSpeed));
      // Calculate final speed: individual sphere speed * global animation speed
      const finalSpeed = spheres.speed * safeAnimationSpeed;
      
      groupRef.current.rotation.y += finalSpeed * 0.01;
      groupRef.current.children.forEach((child, i) => {
        // Base movement with individual speed * global animation speed
        child.position.y += Math.sin(time + i) * 0.02 * finalSpeed;
        
        // Add wave distortion with global animation speed
        if (waveIntensity > 0) {
          child.position.x += Math.sin(time * globalEffects.distortion.frequency + i) * waveIntensity * safeAnimationSpeed;
          child.position.z += Math.cos(time * globalEffects.distortion.frequency + i * 0.5) * waveIntensity * safeAnimationSpeed;
        }
        
        // Add ripple effect with global animation speed
        if (rippleIntensity > 0) {
          const distance = Math.sqrt(child.position.x ** 2 + child.position.z ** 2);
          child.position.y += Math.sin(time * 2 + distance * 0.5) * rippleIntensity * safeAnimationSpeed;
        }
      });
    }
  });

  return (
    <group ref={groupRef} userData={{ objectType: 'spheres' }}>
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