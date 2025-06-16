import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useVisualStore } from '../store/visualStore';
import * as THREE from 'three';
import styles from './EnhancedVisualCanvas.module.css';

// Update blend mode type to match React's CSS properties
type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 
  'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 
  'hue' | 'saturation' | 'color' | 'luminosity';

const useRainbowAnimation = (speed: number, rotation: number) => {
  const [time, setTime] = React.useState(0);
  
  React.useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setTime(prev => (prev + speed * 0.01) % 360);
    });
    return () => cancelAnimationFrame(animationFrame);
  }, [speed]);

  return time;
};

const Spheres = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { geometric, globalEffects } = useVisualStore();
  const { spheres } = geometric;
  const { atmosphericBlur } = globalEffects;

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
        <group key={i} position={position as [number, number, number]}>
          <mesh>
            <sphereGeometry args={[spheres.size, 32, 32]} />
            <meshBasicMaterial 
              color={spheres.color} 
              transparent 
              opacity={spheres.opacity}
              alphaTest={0.1}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const Cubes = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { geometric, globalEffects } = useVisualStore();
  const { cubes } = geometric;
  const { atmosphericBlur } = globalEffects;

  const cubePositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < cubes.count; i++) {
      positions.push([
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 8,
      ]);
    }
    return positions;
  }, [cubes.count]);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      const noiseIntensity = globalEffects.distortion.noise;
      
      groupRef.current.children.forEach((child, i) => {
        // Enhanced rotation with distortion
        child.rotation.x += cubes.rotation * 0.01;
        child.rotation.y += cubes.rotation * 0.015;
        child.position.x += Math.sin(time + i) * 0.01;
        
        // Add noise distortion
        if (noiseIntensity > 0) {
          child.rotation.z += Math.random() * noiseIntensity * 0.1;
          child.scale.setScalar(1 + Math.random() * noiseIntensity * 0.2);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {cubePositions.map((position, i) => (
        <group key={i} position={position as [number, number, number]}>
          <mesh>
            <boxGeometry args={[cubes.size, cubes.size, cubes.size]} />
            <meshBasicMaterial 
              color={cubes.color} 
              transparent 
              opacity={cubes.opacity}
              alphaTest={0.1}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const Toruses = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { geometric, globalEffects } = useVisualStore();
  const { toruses } = geometric;
  const { atmosphericBlur } = globalEffects;

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
        <group key={i} position={position as [number, number, number]}>
          <mesh>
            <torusGeometry args={[toruses.size, toruses.size * 0.4, 32, 64]} />
            <meshBasicMaterial 
              color={toruses.color} 
              transparent 
              opacity={toruses.opacity}
              alphaTest={0.1}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const Particles = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const { particles, globalEffects } = useVisualStore();

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particles.count * 3);
    for (let i = 0; i < particles.count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * particles.spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * particles.spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * particles.spread;
    }
    return positions;
  }, [particles.count, particles.spread]);

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.elapsedTime;
      pointsRef.current.rotation.y += particles.speed * 0.005;
      
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const turbulence = globalEffects.particleInteraction.turbulence;
      
      for (let i = 0; i < positions.length; i += 3) {
        // Base movement
        positions[i + 1] += Math.sin(time + i) * 0.01 * particles.speed;
        
        // Add turbulence
        if (turbulence > 0) {
          positions[i] += (Math.random() - 0.5) * turbulence * 0.1;
          positions[i + 1] += (Math.random() - 0.5) * turbulence * 0.1;
          positions[i + 2] += (Math.random() - 0.5) * turbulence * 0.1;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.count}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={particles.color}
        size={particles.size * 2}
        transparent
        opacity={particles.opacity}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const VolumetricFog = () => {
  const { globalEffects } = useVisualStore();
  const { volumetric } = globalEffects;

  if (!volumetric.enabled || volumetric.density === 0) return null;

  return (
    <>
      <fog
        attach="fog"
        args={[volumetric.color, 1, 50 / (volumetric.density * 0.5)]}
        near={1}
        far={50}
      />
      {/* Volumetric light shafts */}
      {volumetric.lightShafts > 0 && (
        <>
          {/* Main light shaft */}
          <mesh position={[0, 5, -5]} rotation={[-Math.PI / 4, 0, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshBasicMaterial
              color={volumetric.color}
              transparent
              opacity={volumetric.lightShafts * 0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Secondary light shafts */}
          <mesh position={[-5, 3, -4]} rotation={[-Math.PI / 6, Math.PI / 6, 0]}>
            <planeGeometry args={[15, 15]} />
            <meshBasicMaterial
              color={volumetric.color}
              transparent
              opacity={volumetric.lightShafts * 0.15}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[5, 3, -4]} rotation={[-Math.PI / 6, -Math.PI / 6, 0]}>
            <planeGeometry args={[15, 15]} />
            <meshBasicMaterial
              color={volumetric.color}
              transparent
              opacity={volumetric.lightShafts * 0.15}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}
    </>
  );
};

const Scene = () => {
  const { globalEffects } = useVisualStore();
  const { volumetric, glowSystem } = globalEffects;

  return (
    <>
      <VolumetricFog />
      <ambientLight intensity={0.5 + (volumetric.lightShafts * 0.5)} />
      <pointLight 
        position={[10, 10, 10]} 
        intensity={1 + glowSystem.intensity}
        color={glowSystem.color}
      />
      <Spheres />
      <Cubes />
      <Toruses />
      <Particles />
    </>
  );
};

const EnhancedVisualCanvas = () => {
  const { globalEffects } = useVisualStore();
  const { 
    chromatic, 
    volumetric, 
    atmosphericBlur, 
    colorBlending, 
    glowSystem, 
    distortion 
  } = globalEffects;

  // Create high blur layer for extreme settings
  const highBlurLayer = useMemo(() => {
    if (!atmosphericBlur.enabled || atmosphericBlur.intensity <= 15) return null;
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backdropFilter: `blur(${(atmosphericBlur.intensity - 15) * 2}px)`,
          pointerEvents: 'none',
          zIndex: 50,
          mixBlendMode: 'normal',
          willChange: 'backdrop-filter',
          isolation: 'isolate'
        }}
      />
    );
  }, [atmosphericBlur]);

  // Create chromatic aberration layers
  const aberrationLayers = useMemo(() => {
    if (!chromatic.enabled || chromatic.aberration <= 0) return null;
    const baseOffset = chromatic.aberration * 10; // Increased for more visible separation
    
    return (
      <>
        {/* Red channel */}
        <div style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${baseOffset}px, 0)`,
          filter: `blur(${chromatic.aberration * 0.3}px)`,
          mixBlendMode: 'screen',
          opacity: 0.5,
          pointerEvents: 'none',
          zIndex: 2,
          background: `linear-gradient(to right, 
            transparent 0%,
            ${chromatic.aberrationColors.red} 20%,
            ${chromatic.aberrationColors.red} 80%,
            transparent 100%
          )`
        }} />
        {/* Green channel */}
        <div style={{
          position: 'absolute',
          inset: 0,
          transform: 'translate(0, 0)',
          filter: `blur(${chromatic.aberration * 0.3}px)`,
          mixBlendMode: 'screen',
          opacity: 0.5,
          pointerEvents: 'none',
          zIndex: 1,
          background: `linear-gradient(to right, 
            transparent 0%,
            ${chromatic.aberrationColors.green} 20%,
            ${chromatic.aberrationColors.green} 80%,
            transparent 100%
          )`
        }} />
        {/* Blue channel */}
        <div style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${-baseOffset}px, 0)`,
          filter: `blur(${chromatic.aberration * 0.3}px)`,
          mixBlendMode: 'screen',
          opacity: 0.5,
          pointerEvents: 'none',
          zIndex: 2,
          background: `linear-gradient(to right, 
            transparent 0%,
            ${chromatic.aberrationColors.blue} 20%,
            ${chromatic.aberrationColors.blue} 80%,
            transparent 100%
          )`
        }} />
        {/* Color blending overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          filter: `blur(${chromatic.aberration * 1.5}px)`,
          mixBlendMode: 'overlay',
          opacity: 0.15,
          pointerEvents: 'none',
          zIndex: 3,
          background: `linear-gradient(45deg, 
            ${chromatic.aberrationColors.red}22,
            ${chromatic.aberrationColors.green}22,
            ${chromatic.aberrationColors.blue}22
          )`
        }} />
      </>
    );
  }, [chromatic]);

  // Create rainbow effect layer
  const rainbowLayer = useMemo(() => {
    if (!chromatic.enabled || !chromatic.rainbow.enabled || chromatic.rainbow.intensity <= 0) return null;
    return (
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(${chromatic.rainbow.rotation}deg, ${chromatic.rainbow.colors.join(', ')})`,
        mixBlendMode: chromatic.rainbow.blendMode,
        opacity: chromatic.rainbow.opacity * chromatic.rainbow.intensity,
        pointerEvents: 'none',
        zIndex: 3,
        filter: `blur(${chromatic.rainbow.intensity * 5}px)`
      }} />
    );
  }, [chromatic]);

  // Create volumetric fog layer
  const fogLayer = useMemo(() => {
    if (!volumetric.enabled || volumetric.fog <= 0) return null;
    return (
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at center, 
          ${volumetric.color}${Math.floor(volumetric.fog * 50).toString(16).padStart(2, '0')} 0%,
          transparent 70%
        )`,
        backdropFilter: `blur(${volumetric.density * 20}px)`,
        opacity: volumetric.fog,
        pointerEvents: 'none',
        zIndex: 4
      }} />
    );
  }, [volumetric]);

  return (
    <div className={styles.canvasContainer}>
      {aberrationLayers}
      {rainbowLayer}
      {fogLayer}
      {highBlurLayer}
      
      <Canvas
        style={{
          filter: `
            ${atmosphericBlur.enabled ? `blur(${atmosphericBlur.intensity * 0.8}px)` : ''}
            ${distortion.enabled && distortion.wave > 0 ? `skew(${distortion.wave * 10}deg, ${distortion.ripple * 10}deg)` : ''}
            ${distortion.enabled && distortion.noise > 0 ? `scale(${1 + distortion.noise * 0.1})` : ''}
            ${glowSystem.enabled ? `
              drop-shadow(0 0 ${glowSystem.radius}px ${glowSystem.color})
              drop-shadow(0 0 ${glowSystem.radius * 0.5}px ${glowSystem.color})
              brightness(${1 + glowSystem.intensity * 0.2})
            ` : ''}
            ${chromatic.enabled && chromatic.prism > 0 ? `saturate(${1 + chromatic.prism * 0.3})` : ''}
          `,
          transformOrigin: 'center center',
          mixBlendMode: colorBlending.enabled ? colorBlending.mode : 'normal',
          opacity: colorBlending.enabled ? 0.5 + (colorBlending.intensity * 0.5) : 1,
          willChange: 'transform, filter, opacity',
          isolation: 'isolate'
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default EnhancedVisualCanvas;