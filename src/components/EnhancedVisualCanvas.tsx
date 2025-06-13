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

const Cubes = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { geometric, globalEffects } = useVisualStore();
  const { cubes } = geometric;

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
        <mesh key={i} position={position as [number, number, number]}>
          <boxGeometry args={[cubes.size, cubes.size, cubes.size]} />
          <meshBasicMaterial 
            color={cubes.color} 
            transparent 
            opacity={cubes.opacity}
          />
        </mesh>
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
        size={particles.size}
        transparent
        opacity={particles.opacity}
        sizeAttenuation={false}
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
      <Particles />
    </>
  );
};

export const EnhancedVisualCanvas = () => {
  const { background, effects, globalEffects } = useVisualStore();
  const rainbowTime = useRainbowAnimation(
    globalEffects.chromatic.rainbow.speed,
    globalEffects.chromatic.rainbow.rotation
  );

  // Build complex filter chain
  const buildFilterChain = () => {
    const filters = [];
    
    // Base effects
    if (background.blur > 0) filters.push(`blur(${background.blur}px)`);
    if (effects.contrast !== 1) filters.push(`contrast(${effects.contrast})`);
    if (effects.saturation !== 1) filters.push(`saturate(${effects.saturation})`);
    if (effects.hue !== 0) filters.push(`hue-rotate(${effects.hue}deg)`);
    if (effects.brightness !== 1) filters.push(`brightness(${effects.brightness})`);
    
    // Chromatic effects
    if (globalEffects.chromatic.aberration > 0) {
      filters.push(`blur(${globalEffects.chromatic.aberration * 0.5}px)`);
    }
    
    return filters.join(' ');
  };

  // Separate style for the canvas container to handle blend modes
  const containerStyle = {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    isolation: 'isolate' as const,
  };

  const canvasStyle = {
    filter: buildFilterChain(),
  };

  // Atmospheric blur layers
  const atmosphericLayers = [];
  if (globalEffects.atmosphericBlur.enabled) {
    for (let i = 0; i < globalEffects.atmosphericBlur.layers; i++) {
      const layerBlur = globalEffects.atmosphericBlur.intensity * (i + 1) * 2;
      const layerOpacity = 0.3 / (i + 1);
      atmosphericLayers.push(
        <div
          key={i}
          className={styles['atmospheric-layer']}
          style={{
            background: `radial-gradient(circle, transparent 0%, ${background.color}${Math.floor(layerOpacity * 255).toString(16)} 100%)`,
            backdropFilter: `blur(${layerBlur}px)`,
          }}
        />
      );
    }
  }

  return (
    <div className={styles['enhanced-canvas-container']} style={containerStyle}>
      {/* Background layer for color blending */}
      {globalEffects.colorBlending.enabled && (
        <div 
          className={styles['blend-background']}
          style={{
            background: `linear-gradient(45deg, 
              ${globalEffects.colorBlending.mode === 'multiply' ? '#ffffff' : '#000000'},
              ${globalEffects.colorBlending.mode === 'multiply' ? '#ff00ff' : '#00ffff'}
            )`,
            opacity: globalEffects.colorBlending.intensity * 0.5,
            mixBlendMode: globalEffects.colorBlending.mode as BlendMode,
          }}
        />
      )}
      
      {/* Main Canvas */}
      <div className={styles['canvas-layer']} style={canvasStyle}>
        <Canvas
          camera={{ position: [0, 0, 15], fov: 60 }}
          style={{ 
            background: background.color, 
            opacity: background.opacity,
            // Enhanced prism effect
            ...(globalEffects.chromatic.prism > 0 && {
              transform: `
                scale(${1 + globalEffects.chromatic.prism * 0.3})
                perspective(1000px)
                rotateX(${globalEffects.chromatic.prism * 5}deg)
                rotateY(${globalEffects.chromatic.prism * -5}deg)
              `,
              transformOrigin: 'center center',
              filter: `
                contrast(${1 + globalEffects.chromatic.prism * 0.5})
                saturate(${1 + globalEffects.chromatic.prism * 0.3})
              `
            })
          }}
        >
          <Scene />
        </Canvas>
      </div>
      
      {/* Global Glow Layer */}
      {globalEffects.glowSystem.enabled && globalEffects.glowSystem.intensity > 0 && (
        <div
          className={`${styles['glow-layer']} ${globalEffects.glowSystem.pulsing ? styles.pulsing : ''}`}
          style={{
            background: `radial-gradient(circle at center, ${globalEffects.glowSystem.color}${Math.floor(globalEffects.glowSystem.intensity * 255).toString(16)} 0%, transparent 70%)`,
            filter: `blur(${globalEffects.glowSystem.radius * 2}px)`,
            animationDuration: `${2 / globalEffects.glowSystem.pulseSpeed}s`,
          }}
        />
      )}
      
      {/* Atmospheric Layers */}
      {atmosphericLayers}
      
      {/* Vignette Effect */}
      {effects.vignette > 0 && (
        <div
          className={styles['vignette-layer']}
          style={{
            background: `radial-gradient(circle at center, transparent 30%, rgba(0,0,0,${effects.vignette}) 100%)`,
          }}
        />
      )}
      
      {/* Film Grain Effect */}
      {effects.filmGrain > 0 && (
        <div
          className={styles['film-grain-layer']}
          style={{
            opacity: effects.filmGrain,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '50px 50px',
            backgroundRepeat: 'repeat',
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
          }}
        />
      )}
      
      {/* Chromatic Aberration Effect */}
      {globalEffects.chromatic.aberration > 0 && (
        <div
          className={styles['chromatic-layer']}
          style={{
            background: `
              radial-gradient(circle at 30% 30%, ${globalEffects.chromatic.aberrationColors.red}${Math.floor(globalEffects.chromatic.aberration * 0.1 * 255).toString(16).padStart(2, '0')} 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, ${globalEffects.chromatic.aberrationColors.green}${Math.floor(globalEffects.chromatic.aberration * 0.1 * 255).toString(16).padStart(2, '0')} 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, ${globalEffects.chromatic.aberrationColors.blue}${Math.floor(globalEffects.chromatic.aberration * 0.1 * 255).toString(16).padStart(2, '0')} 0%, transparent 50%)
            `,
          }}
        />
      )}
      
      {/* Rainbow Effect */}
      {globalEffects.chromatic.rainbow.intensity > 0 && (
        <div
          className={styles['rainbow-layer']}
          style={{
            opacity: globalEffects.chromatic.rainbow.opacity * globalEffects.chromatic.rainbow.intensity,
            background: `linear-gradient(${globalEffects.chromatic.rainbow.rotation}deg, 
              ${globalEffects.chromatic.rainbow.colors.map((color, index) => 
                `${color}${Math.floor(globalEffects.chromatic.rainbow.opacity * 255).toString(16).padStart(2, '0')} ${(index / (globalEffects.chromatic.rainbow.colors.length - 1)) * 100}%`
              ).join(', ')})`,
            mixBlendMode: globalEffects.chromatic.rainbow.blendMode,
            transform: `translate(-50%, -50%) rotate(${rainbowTime}deg)`,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}; 