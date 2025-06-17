import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVisualStore } from '../store/visualStore';
import * as THREE from 'three';

export const Blobs = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { geometric, globalEffects } = useVisualStore();
  const { blobs } = geometric;
  const { shapeGlow } = globalEffects;

  if (!blobs || blobs.count === 0) {
    return null;
  }

  const blobPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < blobs.count; i++) {
      positions.push([
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 12,
      ]);
    }
    return positions;
  }, [blobs.count]);

  // Helper to create unique organic geometry for each blob
  const createOrganicGeometry = (organicness: number) => {
    const geometry = new THREE.SphereGeometry(1, 16, 16);
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const noise = (Math.random() - 0.5) * organicness;
      positions[i] += noise;
      positions[i + 1] += noise;
      positions[i + 2] += noise;
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
  };

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      const waveIntensity = globalEffects.distortion.wave * 2;
      const rippleIntensity = globalEffects.distortion.ripple * 3;
      
      groupRef.current.rotation.y += blobs.speed * 0.005;
      
      groupRef.current.children.forEach((child, i) => {
        child.rotation.x += Math.sin(time + i) * 0.01 * blobs.speed;
        child.rotation.z += Math.cos(time + i * 0.5) * 0.008 * blobs.speed;
        child.position.y += Math.sin(time * 0.5 + i) * 0.02 * blobs.speed;
        
        // Add wave distortion
        if (waveIntensity > 0) {
          child.position.x += Math.sin(time * globalEffects.distortion.frequency + i) * waveIntensity * 0.1;
          child.position.z += Math.cos(time * globalEffects.distortion.frequency + i * 0.5) * waveIntensity * 0.1;
        }
        
        // Add ripple effect
        if (rippleIntensity > 0) {
          const distance = Math.sqrt(child.position.x ** 2 + child.position.z ** 2);
          child.position.y += Math.sin(time * 2 + distance * 0.5) * rippleIntensity * 0.1;
        }
      });
    }
  });

  return (
    <group ref={groupRef} userData={{ objectType: 'blobs' }}>
      {blobPositions.map((position, i) => {
        const geometry = useMemo(() => createOrganicGeometry(blobs.organicness), [blobs.organicness, i, blobs.count]);
        return (
          <group key={`blob-${i}-${blobs.count}`} position={position as [number, number, number]} scale={[blobs.size, blobs.size, blobs.size]}>
            {/* Main blob */}
            <mesh>
              <primitive object={geometry} />
              <meshBasicMaterial 
                color={blobs.color} 
                transparent 
                opacity={blobs.opacity}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Glow layer */}
            {shapeGlow.enabled && (
              <mesh>
                <primitive object={geometry} />
                <meshBasicMaterial
                  color={shapeGlow.useObjectColor ? blobs.color : shapeGlow.customColor}
                  transparent
                  opacity={shapeGlow.intensity * 0.3}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}; 