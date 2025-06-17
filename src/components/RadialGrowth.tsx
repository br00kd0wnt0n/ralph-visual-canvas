import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVisualStore } from '../store/visualStore';
import * as THREE from 'three';

interface Radiator {
  position: THREE.Vector3;
  radius: number;
  lines: number;
  growth: number;
  maxLength: number;
  age: number;
  lifespan: number;
  opacity: number;
  isDead: boolean;
}

export const RadialGrowth = () => {
  const { globalEffects, geometric } = useVisualStore();
  const { radialGrowth } = globalEffects;
  const groupRef = useRef<THREE.Group>(null);
  const radiatorsRef = useRef<Radiator[]>([]);
  const frameCountRef = useRef(0);

  // Material for the radiating lines
  const lineMaterial = useMemo(() => 
    new THREE.LineBasicMaterial({
      color: geometric.radialGrowth?.color || '#333333',
      transparent: true,
      opacity: 0.5,
    }), [geometric.radialGrowth?.color]
  );

  // Material for center dots
  const dotMaterial = useMemo(() =>
    new THREE.MeshBasicMaterial({
      color: geometric.radialGrowth?.color || '#333333',
      transparent: true,
    }), [geometric.radialGrowth?.color]
  );

  const createRadiator = (x?: number, y?: number, z?: number): Radiator => {
    let position: THREE.Vector3;
    
    if (x !== undefined && y !== undefined && z !== undefined) {
      position = new THREE.Vector3(x, y, z);
    } else if (radiatorsRef.current.length > 0 && Math.random() < 0.8) {
      // Spawn near existing radiator
      const parent = radiatorsRef.current[Math.floor(Math.random() * radiatorsRef.current.length)];
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 10 + 5;
      position = new THREE.Vector3(
        parent.position.x + Math.cos(angle) * distance,
        parent.position.y + (Math.random() - 0.5) * 5,
        parent.position.z + Math.sin(angle) * distance
      );
    } else {
      // Random position with center bias
      const centerBias = Math.random() * 0.5 + 0.5;
      position = new THREE.Vector3(
        (Math.random() - 0.5) * 40 * centerBias,
        (Math.random() - 0.5) * 20 * centerBias,
        (Math.random() - 0.5) * 40 * centerBias
      );
    }

    return {
      position,
      radius: Math.random() * 8 + 2,
      lines: Math.floor(Math.random() * 24 + 16),
      growth: (Math.random() * 0.5 + 0.5) * 0.025,
      maxLength: Math.random() * 8 + 4,
      age: 0,
      lifespan: (Math.random() * 200 + 100) * 4,
      opacity: 0,
      isDead: false,
    };
  };

  useFrame(() => {
    if (!radialGrowth?.enabled || !groupRef.current) return;

    frameCountRef.current++;

    // Spawn new radiators
    if (frameCountRef.current % 40 === 0 && radiatorsRef.current.length < 20) {
      radiatorsRef.current.push(createRadiator());
    }

    // Clear previous geometry
    groupRef.current.clear();

    // Update and render radiators
    radiatorsRef.current = radiatorsRef.current.filter(radiator => {
      radiator.age++;
      
      // Update opacity based on life stage
      if (radiator.age < radiator.lifespan * 0.2) {
        radiator.opacity = Math.min(1, radiator.age / (radiator.lifespan * 0.2));
      } else if (radiator.age > radiator.lifespan * 0.8) {
        radiator.opacity = Math.max(0, 1 - (radiator.age - radiator.lifespan * 0.8) / (radiator.lifespan * 0.2));
      } else {
        radiator.opacity = 1;
      }

      if (radiator.age > radiator.lifespan) {
        radiator.isDead = true;
        return false;
      }

      // Create radiating lines
      const currentLength = Math.min(radiator.maxLength, radiator.age * radiator.growth);
      const points: THREE.Vector3[] = [];
      
      for (let i = 0; i < radiator.lines; i++) {
        const angle = (i / radiator.lines) * Math.PI * 2;
        const length = currentLength;
        
        // Create line from center to edge
        points.push(radiator.position.clone());
        points.push(new THREE.Vector3(
          radiator.position.x + Math.cos(angle) * length,
          radiator.position.y,
          radiator.position.z + Math.sin(angle) * length
        ));
      }

      // Create line geometry
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = lineMaterial.clone();
      material.opacity = radiator.opacity * 0.5;
      material.needsUpdate = true;
      
      const lines = new THREE.LineSegments(geometry, material);
      groupRef.current!.add(lines);

      // Create center dot
      const centerRadius = 0.1 + radiator.age * 0.001;
      const dotGeometry = new THREE.SphereGeometry(centerRadius, 8, 6);
      const dotMat = dotMaterial.clone();
      dotMat.opacity = radiator.opacity * 0.8;
      dotMat.needsUpdate = true;
      
      const dot = new THREE.Mesh(dotGeometry, dotMat);
      dot.position.copy(radiator.position);
      groupRef.current!.add(dot);

      return true;
    });
  });

  return <group ref={groupRef} />;
}; 