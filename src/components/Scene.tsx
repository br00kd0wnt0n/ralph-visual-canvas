import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Box, Torus, PerspectiveCamera } from '@react-three/drei';
import { useVisualStore } from '../store/visualStore';
import * as THREE from 'three';

const Particles = () => {
  const { count, size, color, speed, opacity, spread } = useVisualStore((state) => state.particles);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * spread;
      const y = (Math.random() - 0.5) * spread;
      const z = (Math.random() - 0.5) * spread;
      temp.push({ position: [x, y, z], velocity: [0, 0, 0] });
    }
    return temp;
  }, [count, spread]);

  useFrame((state, delta) => {
    particles.forEach((particle) => {
      particle.position[1] += particle.velocity[1] * speed * delta;
      if (particle.position[1] > spread / 2) {
        particle.position[1] = -spread / 2;
      }
    });
  });

  return (
    <group>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position as [number, number, number]}>
          <sphereGeometry args={[size, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  );
};

const GeometricShapes = () => {
  const geometric = useVisualStore((state) => state.geometric);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Rotate the entire group
    groupRef.current.rotation.y += delta * 0.2;

    // Update individual shapes
    groupRef.current.children.forEach((child) => {
      if (child.userData.type === 'sphere' || child.userData.type === 'torus') {
        child.rotation.y += delta * (child.userData.speed || 1);
      } else if (child.userData.type === 'cube') {
        child.rotation.x += delta * (child.userData.rotation || 1);
        child.rotation.y += delta * (child.userData.rotation || 1);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Spheres */}
      {Array.from({ length: geometric.spheres.count }).map((_, i) => (
        <Sphere
          key={`sphere-${i}`}
          args={[geometric.spheres.size, 32, 32]}
          position={[
            Math.cos(i * Math.PI * 2 / geometric.spheres.count) * 3,
            Math.sin(i * Math.PI * 2 / geometric.spheres.count) * 3,
            0
          ]}
          userData={{ type: 'sphere', speed: geometric.spheres.speed }}
        >
          <meshBasicMaterial
            color={geometric.spheres.color}
            transparent
            opacity={geometric.spheres.opacity}
          />
        </Sphere>
      ))}

      {/* Cubes */}
      {Array.from({ length: geometric.cubes.count }).map((_, i) => (
        <Box
          key={`cube-${i}`}
          args={[geometric.cubes.size, geometric.cubes.size, geometric.cubes.size]}
          position={[
            Math.cos(i * Math.PI * 2 / geometric.cubes.count) * 4,
            Math.sin(i * Math.PI * 2 / geometric.cubes.count) * 4,
            0
          ]}
          userData={{ type: 'cube', rotation: geometric.cubes.rotation }}
        >
          <meshBasicMaterial
            color={geometric.cubes.color}
            transparent
            opacity={geometric.cubes.opacity}
          />
        </Box>
      ))}

      {/* Toruses */}
      {Array.from({ length: geometric.toruses.count }).map((_, i) => (
        <Torus
          key={`torus-${i}`}
          args={[geometric.toruses.size, geometric.toruses.size * 0.3, 16, 32]}
          position={[
            Math.cos(i * Math.PI * 2 / geometric.toruses.count) * 5,
            Math.sin(i * Math.PI * 2 / geometric.toruses.count) * 5,
            0
          ]}
          userData={{ type: 'torus', speed: geometric.toruses.speed }}
        >
          <meshBasicMaterial
            color={geometric.toruses.color}
            transparent
            opacity={geometric.toruses.opacity}
          />
        </Torus>
      ))}
    </group>
  );
};

const Background = () => {
  const { color, opacity, gradient } = useVisualStore((state) => state.background);
  
  return (
    <mesh position={[0, 0, -10]}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Add a resize handler component
const ResizeHandler = () => {
  const { camera, gl } = useThree();
  
  useEffect(() => {
    const handleResize = () => {
      if (camera instanceof THREE.PerspectiveCamera) {
        // Update camera aspect ratio
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      }
      
      // Update renderer size
      gl.setSize(window.innerWidth, window.innerHeight);
    };

    // Initial setup
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [camera, gl]);

  return null;
};

export const Scene = () => {
  const { effects } = useVisualStore();

  return (
    <div className="scene-container">
      <Canvas
        style={{
          background: 'transparent',
          filter: `
            contrast(${effects.contrast})
            saturate(${effects.saturation})
            hue-rotate(${effects.hue}deg)
          `,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={75} />
        <ResizeHandler />
        <Background />
        <GeometricShapes />
        <Particles />
      </Canvas>
    </div>
  );
}; 