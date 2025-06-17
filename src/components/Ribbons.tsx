import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVisualStore } from '../store/visualStore';
import * as THREE from 'three';

export const Ribbons = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { geometric, globalEffects } = useVisualStore();
  const { ribbons } = geometric;
  const { shapeGlow } = globalEffects;

  const ribbonData = useMemo(() => {
    const data = [];
    const safeCount = isNaN(ribbons.count) || ribbons.count < 0 ? 0 : ribbons.count;
    const safeLength = isNaN(ribbons.length) || ribbons.length < 3 ? 3 : ribbons.length;
    const safeWidth = isNaN(ribbons.width) || ribbons.width <= 0 ? 0.3 : ribbons.width;
    const safeFlow = isNaN(ribbons.flow) || ribbons.flow < 0 ? 0.8 : ribbons.flow;
    
    for (let i = 0; i < safeCount; i++) {
      // Create flowing curve points with smoother distribution
      const points = [];
      const segments = Math.floor(safeLength * 3); // More segments for smoothness
      
      for (let j = 0; j <= segments; j++) {
        const t = j / segments;
        // Smoother, more flowing curves using multiple sine waves
        const x = (Math.random() - 0.5) * 15 + 
                  Math.sin(t * Math.PI * 2) * safeFlow * 4 +
                  Math.sin(t * Math.PI * 6) * safeFlow * 1;
        const y = (Math.random() - 0.5) * 12 + 
                  Math.cos(t * Math.PI * 3) * safeFlow * 3 +
                  Math.cos(t * Math.PI * 8) * safeFlow * 0.5;
        const z = (Math.random() - 0.5) * 8 + 
                  Math.sin(t * Math.PI * 4) * safeFlow * 2 +
                  Math.cos(t * Math.PI * 10) * safeFlow * 0.3;
        points.push(new THREE.Vector3(x, y, z));
      }
      
      // Create very smooth curve with more detail
      const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.1);
      const tubeGeometry = new THREE.TubeGeometry(
        curve, 
        segments * 2,           // More tube segments
        safeWidth, 
        16,                     // More radial segments for smoothness
        false
      );
      
      data.push({
        geometry: tubeGeometry,
        curve: curve,
        baseRotation: Math.random() * Math.PI * 2,
        flowOffset: Math.random() * Math.PI * 2,
        driftSpeed: 0.5 + Math.random() * 0.5, // Individual drift speeds
      });
    }
    return data;
  }, [ribbons.count, ribbons.length, ribbons.width, ribbons.flow]);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      const safeSpeed = isNaN(ribbons.speed) || ribbons.speed < 0 ? 1.2 : ribbons.speed;
      
      groupRef.current.children.forEach((child, i) => {
        const data = ribbonData[i];
        if (data) {
          // Gentle, flowing rotation
          child.rotation.x = data.baseRotation + 
            Math.sin(time * safeSpeed * 0.2 + data.flowOffset) * 0.3;
          child.rotation.y += safeSpeed * 0.005; // Slower rotation
          child.rotation.z = Math.cos(time * safeSpeed * 0.15 + data.flowOffset) * 0.25;
          
          // Gentle floating motion with individual variation
          child.position.y += Math.sin(time * safeSpeed * 0.3 * data.driftSpeed + i) * 0.02;
          child.position.x += Math.cos(time * safeSpeed * 0.2 * data.driftSpeed + i) * 0.015;
          child.position.z += Math.sin(time * safeSpeed * 0.25 * data.driftSpeed + i * 0.5) * 0.01;
          
          // Subtle scale breathing
          const breathe = 1 + Math.sin(time * safeSpeed * 0.4 + data.flowOffset) * 0.05;
          child.scale.set(breathe, breathe, breathe);
        }
      });
    }
  });

  if (!ribbons || ribbons.count === 0) {
    return null;
  }

  return (
    <group ref={groupRef} userData={{ objectType: 'ribbons' }}>
      {ribbonData.map((data, i) => {
        const geometry = data.geometry;
        // Safety check: only render if geometry exists
        if (!geometry) return null;
        
        return (
          <group key={`ribbon-${i}-${ribbons.count}`}>
            {/* Main ribbon */}
            <mesh>
              <primitive object={geometry} />
              <meshBasicMaterial 
                color={ribbons.color} 
                transparent 
                opacity={ribbons.opacity}
                side={THREE.DoubleSide}
                wireframe={false}
              />
            </mesh>
            {/* Glow layer */}
            {shapeGlow.enabled && (
              <mesh>
                <primitive object={geometry} />
                <meshBasicMaterial
                  color={shapeGlow.useObjectColor ? ribbons.color : shapeGlow.customColor}
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