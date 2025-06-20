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
  const globalAnimationSpeed = useVisualStore((state) => state.globalAnimationSpeed);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Safety check: clamp global animation speed to prevent crashes
    const safeAnimationSpeed = Math.max(0.01, Math.min(5.0, globalAnimationSpeed));

    // Rotate the entire group with global animation speed (excluding cubes)
    groupRef.current.children.forEach((child) => {
      if (child.userData.type !== 'cube') {
        child.rotation.y += delta * 0.2 * safeAnimationSpeed;
      }
    });

    // Update individual shapes with their individual speeds * global animation speed
    groupRef.current.children.forEach((child) => {
      if (child.userData.type === 'sphere' || child.userData.type === 'torus') {
        // Get individual speed from the geometric store
        const shapeType = child.userData.type as keyof typeof geometric;
        const shapeConfig = geometric[shapeType];
        if (shapeConfig && 'speed' in shapeConfig) {
          const individualSpeed = (shapeConfig as any).speed || 1.0;
          const finalSpeed = individualSpeed * safeAnimationSpeed;
          
          // Apply individual speed * global animation speed
          child.rotation.x += delta * 0.5 * finalSpeed;
          child.rotation.y += delta * 0.3 * finalSpeed;
        }
      } else if (child.userData.type === 'cube') {
        const cubeRotation = child.userData.rotation || 1;
        const cubeSpeed = child.userData.speed || 1;
        const finalRotationSpeed = cubeRotation * safeAnimationSpeed;
        const finalMovementSpeed = cubeSpeed * safeAnimationSpeed;
        
        // Rotation: use rotation property for spinning
        child.rotation.x += delta * finalRotationSpeed;
        child.rotation.y += delta * finalRotationSpeed;
        
        // Movement: use speed property for position changes
        const time = state.clock.elapsedTime;
        const originalPos = child.userData.originalPosition || [0, 0, 0];
        child.position.x = originalPos[0] + Math.sin(time) * 1 * finalMovementSpeed;
        child.position.y = originalPos[1] + Math.cos(time * 0.5) * 1 * finalMovementSpeed;
        child.position.z = originalPos[2] + Math.sin(time * 0.7) * 1 * finalMovementSpeed;
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
      {Array.from({ length: geometric.cubes.count }).map((_, i) => {
        const originalX = Math.cos(i * Math.PI * 2 / geometric.cubes.count) * 4;
        const originalY = Math.sin(i * Math.PI * 2 / geometric.cubes.count) * 4;
        return (
          <Box
            key={`cube-${i}`}
            args={[geometric.cubes.size, geometric.cubes.size, geometric.cubes.size]}
            position={[originalX, originalY, 0]}
            userData={{ 
              type: 'cube', 
              rotation: geometric.cubes.rotation, 
              speed: geometric.cubes.speed,
              originalPosition: [originalX, originalY, 0]
            }}
          >
            <meshBasicMaterial
              color={geometric.cubes.color}
              transparent
              opacity={geometric.cubes.opacity}
            />
          </Box>
        );
      })}

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