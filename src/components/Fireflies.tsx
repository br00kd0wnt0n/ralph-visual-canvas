import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVisualStore } from '../store/visualStore';
import * as THREE from 'three';

interface Firefly {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  glowPhase: number;
  glowSpeed: number;
  brightness: number;
  maxBrightness: number;
  size: number;
  wanderAngle: number;
}

export const Fireflies = () => {
  const { globalEffects, geometric } = useVisualStore();
  const { fireflies } = globalEffects;
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const firefliesRef = useRef<Firefly[]>([]);
  const matrixRef = useRef<THREE.Matrix4>(new THREE.Matrix4());
  const colorRef = useRef<THREE.Color>(new THREE.Color());

  // Initialize fireflies
  const initializeFireflies = () => {
    const count = fireflies?.count || 50;
    const flies: Firefly[] = [];
    
    for (let i = 0; i < count; i++) {
      flies.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 60
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.02
        ),
        glowPhase: Math.random() * Math.PI * 2,
        glowSpeed: 0.02 + Math.random() * 0.03,
        brightness: 0,
        maxBrightness: 0.3 + Math.random() * 0.7,
        size: 0.1 + Math.random() * 0.2,
        wanderAngle: Math.random() * Math.PI * 2,
      });
    }
    
    firefliesRef.current = flies;
  };

  // Geometry and material for fireflies
  const geometry = useMemo(() => new THREE.SphereGeometry(0.1, 8, 6), []);
  
  const material = useMemo(() => 
    new THREE.MeshBasicMaterial({
      color: geometric.fireflies?.color || '#ffff88',
      transparent: true,
      opacity: 1,
    }), [geometric.fireflies?.color]
  );

  // Initialize fireflies when count changes
  React.useEffect(() => {
    if (fireflies?.enabled) {
      initializeFireflies();
    }
  }, [fireflies?.count, fireflies?.enabled]);

  useFrame((state, delta) => {
    if (!fireflies?.enabled || !instancedMeshRef.current || firefliesRef.current.length === 0) {
      return;
    }

    const mesh = instancedMeshRef.current;
    const time = state.clock.elapsedTime;
    const glowIntensity = fireflies?.glowIntensity || 1;
    const speed = fireflies?.speed || 1;

    firefliesRef.current.forEach((firefly, i) => {
      // Update glow phase
      firefly.glowPhase += firefly.glowSpeed;
      firefly.brightness = firefly.maxBrightness * (0.3 + 0.7 * Math.sin(firefly.glowPhase)) * glowIntensity;

      // Wandering behavior
      firefly.wanderAngle += (Math.random() - 0.5) * 0.1;
      
      // Apply wandering force
      const wanderForce = new THREE.Vector3(
        Math.cos(firefly.wanderAngle) * 0.001 * speed,
        Math.sin(firefly.wanderAngle * 0.7) * 0.0005 * speed,
        Math.sin(firefly.wanderAngle) * 0.001 * speed
      );
      
      firefly.velocity.add(wanderForce);

      // Flocking behavior - attraction to nearby fireflies
      const neighbors = firefliesRef.current.filter((other, j) => {
        if (i === j) return false;
        const distance = firefly.position.distanceTo(other.position);
        return distance < 5; // Attraction radius
      });

      if (neighbors.length > 0) {
        const center = neighbors.reduce((acc, neighbor) => {
          return acc.add(neighbor.position);
        }, new THREE.Vector3()).divideScalar(neighbors.length);
        
        const attraction = center.sub(firefly.position).multiplyScalar(0.0001 * speed);
        firefly.velocity.add(attraction);
      }

      // Avoid getting too close to each other
      firefliesRef.current.forEach((other, j) => {
        if (i === j) return;
        const distance = firefly.position.distanceTo(other.position);
        if (distance < 1.5) {
          const repulsion = firefly.position.clone()
            .sub(other.position)
            .normalize()
            .multiplyScalar(0.002 * speed);
          firefly.velocity.add(repulsion);
        }
      });

      // Gentle drift toward center to keep them in view
      const centerPull = new THREE.Vector3(0, 0, 0)
        .sub(firefly.position)
        .normalize()
        .multiplyScalar(0.0002 * speed);
      firefly.velocity.add(centerPull);

      // Apply velocity damping
      firefly.velocity.multiplyScalar(0.98);

      // Limit velocity
      const maxVelocity = 0.05 * speed;
      if (firefly.velocity.length() > maxVelocity) {
        firefly.velocity.normalize().multiplyScalar(maxVelocity);
      }

      // Update position
      firefly.position.add(firefly.velocity);

      // Boundary constraints (soft)
      const boundary = fireflies?.swarmRadius || 30;
      if (Math.abs(firefly.position.x) > boundary) {
        firefly.velocity.x *= -0.1;
      }
      if (Math.abs(firefly.position.y) > 20) {
        firefly.velocity.y *= -0.1;
      }
      if (Math.abs(firefly.position.z) > boundary) {
        firefly.velocity.z *= -0.1;
      }

      // Update instance matrix
      matrixRef.current.makeScale(firefly.size, firefly.size, firefly.size);
      matrixRef.current.setPosition(firefly.position);
      mesh.setMatrixAt(i, matrixRef.current);

      // Update instance color with glow
      colorRef.current.setHex(parseInt((geometric.fireflies?.color || '#ffff88').replace('#', ''), 16));
      colorRef.current.multiplyScalar(firefly.brightness);
      mesh.setColorAt(i, colorRef.current);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  });

  if (!fireflies?.enabled) return null;

  const count = fireflies?.count || 50;

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[geometry, material, count]}
      position={[0, 5, 0]} // Float above the scene
    />
  );
}; 