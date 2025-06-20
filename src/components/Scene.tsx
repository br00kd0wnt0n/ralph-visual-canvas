import React, { useRef, useMemo, useEffect, CSSProperties } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Box, Torus, PerspectiveCamera } from '@react-three/drei';
import { useVisualStore } from '../store/visualStore';
import * as THREE from 'three';
import { Spheres } from './Spheres';
import { Cubes } from './Cubes';
import { Toruses } from './Toruses';
import { Particles } from './Particles';

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
  const { background, geometric, particles, effects, globalEffects, updateGlobalEffects } = useVisualStore();
  const { opacity, blur, color } = background;

  // Container style with no transforms
  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    transform: 'none',
    willChange: 'transform',
    isolation: 'isolate'
  };

  // Pure CSS blur layers for bokeh effect
  const blurLayers = useMemo(() => {
    if (!globalEffects.atmosphericBlur.enabled) return null;
    
    const layers = [];
    const baseIntensity = globalEffects.atmosphericBlur.intensity;
    const layerCount = globalEffects.atmosphericBlur.layers;
    
    for (let i = 0; i < layerCount; i++) {
      // Progressive blur intensity for bokeh effect
      const intensity = baseIntensity * (i + 1) * 2;
      // Decreasing opacity for each layer
      const opacity = 0.3 / (i + 1);
      
      layers.push(
        <div
          key={i}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            backdropFilter: `blur(${intensity}px)`,
            opacity,
            zIndex: i + 1,
            mixBlendMode: 'normal',
            transform: 'none',
            willChange: 'backdrop-filter',
            isolation: 'isolate'
          }}
        />
      );
    }
    
    // Add a soft bloom layer for enhanced bokeh effect
    if (baseIntensity > 0.5) {
      layers.push(
        <div
          key="bloom"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            backdropFilter: `blur(${baseIntensity * 8}px)`,
            opacity: 0.2,
            zIndex: layerCount + 1,
            mixBlendMode: 'soft-light',
            transform: 'none',
            willChange: 'backdrop-filter',
            isolation: 'isolate'
          }}
        />
      );
    }
    
    return layers;
  }, [globalEffects.atmosphericBlur]);

  // Canvas container with no transforms
  const canvasContainerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    transform: 'none',
    willChange: 'transform',
    isolation: 'isolate'
  };

  return (
    <div style={containerStyle}>
      {blurLayers}
      <div style={canvasContainerStyle}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Spheres />
          <Cubes />
          <Toruses />
          <Particles />
        </Canvas>
      </div>
    </div>
  );
}; 