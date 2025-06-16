import React, { useRef, useMemo, useEffect, useState } from 'react';
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

// Add client-side only rendering wrapper
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Force store hydration on mount
    console.log('Store state on mount:', useVisualStore.getState());
  }, []);

  if (!mounted) return null;
  return <>{children}</>;
};

// Add debug logging to store initialization
const store = useVisualStore;
console.log('=== STORE INITIALIZATION ===');
console.log('Initial store state:', store.getState());

const Spheres = () => {
  const { geometric, globalEffects } = useVisualStore();
  const { spheres } = geometric;
  const { shapeGlow } = globalEffects;
  const groupRef = useRef<THREE.Group>(null);
  const [positions, setPositions] = useState<THREE.Vector3[]>([]);
  const renderKey = useMemo(() => `spheres-${spheres.count}-${Date.now()}`, [spheres.count]);

  console.log('=== SPHERES COMPONENT DEBUG ===');
  console.log('Spheres count:', spheres?.count);
  console.log('Spheres object:', spheres);
  console.log('Geometric object:', geometric);
  console.log('Full store state:', useVisualStore.getState());

  if (!spheres || spheres.count === 0) {
    console.log('Spheres component: No spheres to render - spheres:', spheres);
    return null;
  }

  // Generate positions using useMemo to ensure they're available before render
  const generatedPositions = useMemo(() => {
    console.log('Generating sphere positions for count:', spheres.count);
    const newPositions: THREE.Vector3[] = [];
    for (let i = 0; i < spheres.count; i++) {
      newPositions.push(new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ));
    }
    console.log('Generated sphere positions:', newPositions.length);
    return newPositions;
  }, [spheres.count, spheres.size]);

  // Update positions state when generated positions change
  useEffect(() => {
    setPositions(generatedPositions);
  }, [generatedPositions]);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    const waveIntensity = globalEffects.distortion.wave * 2;
    const rippleIntensity = globalEffects.distortion.ripple * 3;
    
    // Rotate the entire group
    groupRef.current.rotation.y += spheres.speed * 0.01;
    
    // Animate individual spheres
    groupRef.current.children.forEach((child, i) => {
      const pos = positions[i];
      if (!pos) return;
      
      // Base movement
      child.position.y = pos.y + Math.sin(time + i) * 2 * spheres.speed;
      
      // Add wave distortion
      if (waveIntensity > 0) {
        child.position.x = pos.x + Math.sin(time * globalEffects.distortion.frequency + i) * waveIntensity;
        child.position.z = pos.z + Math.cos(time * globalEffects.distortion.frequency + i * 0.5) * waveIntensity;
      } else {
        child.position.x = pos.x;
        child.position.z = pos.z;
      }
      
      // Add ripple effect
      if (rippleIntensity > 0) {
        const distance = Math.sqrt(child.position.x ** 2 + child.position.z ** 2);
        child.position.y += Math.sin(time * 2 + distance * 0.5) * rippleIntensity;
      }
    });
  });

  console.log('Rendering spheres with positions:', positions);

  // Don't render until positions are available
  if (positions.length === 0) {
    console.log('Waiting for sphere positions to be generated...');
    return null;
  }

  return (
    <group ref={groupRef} key={renderKey}>
      {positions.map((pos, i) => {
        console.log(`Rendering sphere ${i} at position:`, pos);
        return (
          <group key={`sphere-${i}-${spheres.count}`} position={pos}>
            {/* Main sphere */}
            <mesh>
              <sphereGeometry args={[spheres.size, 32, 32]} />
              <meshBasicMaterial 
                color={spheres.color} 
                transparent 
                opacity={spheres.opacity}
                visible={true}
                side={THREE.DoubleSide}
              />
            </mesh>
            
            {/* Single glow layer */}
            {shapeGlow.enabled && (
              <mesh>
                <sphereGeometry args={[spheres.size * 1.5, 32, 32]} />
                <meshBasicMaterial
                  color={shapeGlow.useObjectColor ? spheres.color : shapeGlow.customColor}
                  transparent
                  opacity={shapeGlow.intensity * 0.3}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  visible={true}
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

const Cubes = () => {
  const { geometric, globalEffects } = useVisualStore();
  const { cubes } = geometric;
  const { shapeGlow } = globalEffects;
  const groupRef = useRef<THREE.Group>(null);
  const [positions, setPositions] = useState<THREE.Vector3[]>([]);
  const renderKey = useMemo(() => `cubes-${cubes.count}-${Date.now()}`, [cubes.count]);

  console.log('=== CUBES COMPONENT DEBUG ===');
  console.log('Cubes count:', cubes?.count);
  console.log('Cubes object:', cubes);
  console.log('Geometric object:', geometric);
  console.log('Full store state:', useVisualStore.getState());

  if (!cubes || cubes.count === 0) {
    console.log('Cubes component: No cubes to render - cubes:', cubes);
    return null;
  }

  // Generate positions using useMemo
  const generatedPositions = useMemo(() => {
    console.log('Generating cube positions for count:', cubes.count);
    const newPositions: THREE.Vector3[] = [];
    for (let i = 0; i < cubes.count; i++) {
      newPositions.push(new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ));
    }
    console.log('Generated cube positions:', newPositions.length);
    return newPositions;
  }, [cubes.count, cubes.size]);

  // Update positions state when generated positions change
  useEffect(() => {
    setPositions(generatedPositions);
  }, [generatedPositions]);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    const noiseIntensity = globalEffects.distortion.noise;
    
    // Rotate the entire group
    groupRef.current.rotation.y += cubes.rotation * 0.01;
    
    // Animate individual cubes
    groupRef.current.children.forEach((child, i) => {
      const pos = positions[i];
      if (!pos) return;
      
      // Rotate individual cubes
      child.rotation.x += cubes.rotation * 0.01;
      child.rotation.y += cubes.rotation * 0.015;
      
      // Base movement
      child.position.x = pos.x + Math.sin(time + i) * 2;
      child.position.y = pos.y + Math.cos(time * 0.5 + i) * 2;
      child.position.z = pos.z + Math.sin(time * 0.3 + i) * 2;
      
      // Add noise distortion
      if (noiseIntensity > 0) {
        child.position.x += (Math.random() - 0.5) * noiseIntensity;
        child.position.y += (Math.random() - 0.5) * noiseIntensity;
        child.position.z += (Math.random() - 0.5) * noiseIntensity;
      }
    });
  });

  console.log('Rendering cubes with positions:', positions);

  // Don't render until positions are available
  if (positions.length === 0) {
    console.log('Waiting for cube positions to be generated...');
    return null;
  }

  return (
    <group ref={groupRef} key={renderKey}>
      {positions.map((pos, i) => {
        console.log(`Rendering cube ${i} at position:`, pos);
        return (
          <group key={`cube-${i}-${cubes.count}`} position={pos}>
            {/* Main cube */}
            <mesh>
              <boxGeometry args={[cubes.size, cubes.size, cubes.size]} />
              <meshBasicMaterial 
                color={cubes.color} 
                transparent 
                opacity={cubes.opacity}
                visible={true}
                side={THREE.DoubleSide}
              />
            </mesh>
            
            {/* Single glow layer */}
            {shapeGlow.enabled && (
              <mesh>
                <boxGeometry args={[cubes.size * 1.5, cubes.size * 1.5, cubes.size * 1.5]} />
                <meshBasicMaterial
                  color={shapeGlow.useObjectColor ? cubes.color : shapeGlow.customColor}
                  transparent
                  opacity={shapeGlow.intensity * 0.3}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  visible={true}
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

const Toruses = () => {
  const { geometric, globalEffects } = useVisualStore();
  const { toruses } = geometric;
  const { shapeGlow } = globalEffects;
  const groupRef = useRef<THREE.Group>(null);
  const [positions, setPositions] = useState<THREE.Vector3[]>([]);
  const renderKey = useMemo(() => `toruses-${toruses.count}-${Date.now()}`, [toruses.count]);

  console.log('=== TORUSES COMPONENT DEBUG ===');
  console.log('Toruses count:', toruses?.count);
  console.log('Toruses object:', toruses);
  console.log('Geometric object:', geometric);
  console.log('Full store state:', useVisualStore.getState());

  if (!toruses || toruses.count === 0) {
    console.log('Toruses component: No toruses to render - toruses:', toruses);
    return null;
  }

  // Generate positions using useMemo
  const generatedPositions = useMemo(() => {
    console.log('Generating torus positions for count:', toruses.count);
    const newPositions: THREE.Vector3[] = [];
    for (let i = 0; i < toruses.count; i++) {
      newPositions.push(new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ));
    }
    console.log('Generated torus positions:', newPositions.length);
    return newPositions;
  }, [toruses.count, toruses.size]);

  // Update positions state when generated positions change
  useEffect(() => {
    setPositions(generatedPositions);
  }, [generatedPositions]);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    const waveIntensity = globalEffects.distortion.wave * 2;
    
    // Rotate the entire group
    groupRef.current.rotation.z += toruses.speed * 0.008;
    
    // Animate individual toruses
    groupRef.current.children.forEach((child, i) => {
      const pos = positions[i];
      if (!pos) return;
      
      // Rotate individual toruses
      child.rotation.x += toruses.speed * 0.02;
      
      // Base movement
      child.position.x = pos.x + Math.cos(time * 0.02 + i * 0.5) * toruses.speed * 2;
      child.position.y = pos.y + Math.sin(time * 0.01 + i * 0.5) * toruses.speed * 2;
      child.position.z = pos.z + Math.cos(time * 0.03 + i * 0.5) * toruses.speed * 2;
      
      // Add wave effects
      if (waveIntensity > 0) {
        child.position.x += Math.sin(time * globalEffects.distortion.frequency + i) * waveIntensity;
        child.position.y += Math.cos(time * globalEffects.distortion.frequency + i * 0.5) * waveIntensity;
      }
    });
  });

  console.log('Rendering toruses with positions:', positions);

  // Don't render until positions are available
  if (positions.length === 0) {
    console.log('Waiting for torus positions to be generated...');
    return null;
  }

  return (
    <group ref={groupRef} key={renderKey}>
      {positions.map((pos, i) => {
        console.log(`Rendering torus ${i} at position:`, pos);
        return (
          <group key={`torus-${i}-${toruses.count}`} position={pos}>
            {/* Main torus */}
            <mesh>
              <torusGeometry args={[toruses.size, toruses.size * 0.3, 16, 32]} />
              <meshBasicMaterial 
                color={toruses.color} 
                transparent 
                opacity={toruses.opacity}
                visible={true}
                side={THREE.DoubleSide}
              />
            </mesh>
            
            {/* Single glow layer */}
            {shapeGlow.enabled && (
              <mesh>
                <torusGeometry args={[toruses.size * 1.5, toruses.size * 0.45, 16, 32]} />
                <meshBasicMaterial
                  color={shapeGlow.useObjectColor ? toruses.color : shapeGlow.customColor}
                  transparent
                  opacity={shapeGlow.intensity * 0.3}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  visible={true}
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

const Particles = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const { particles, globalEffects } = useVisualStore();

  // Calculate a smaller base size for particles
  const baseParticleSize = Math.max(0.1, particles.size * 0.3); // Ensure minimum size of 0.1

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
        size={baseParticleSize}
        transparent
        opacity={particles.opacity}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        map={(() => {
          // Create a circular particle texture
          const canvas = document.createElement('canvas');
          canvas.width = 32;
          canvas.height = 32;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 32, 32);
          }
          const texture = new THREE.CanvasTexture(canvas);
          texture.needsUpdate = true;
          return texture;
        })()}
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
  const { volumetric, shapeGlow } = globalEffects;

  console.log('=== SCENE COMPONENT DEBUG ===');
  console.log('Scene rendering with store state:', useVisualStore.getState());

  return (
    <>
      <VolumetricFog />
      <ambientLight intensity={0.5 + (volumetric.lightShafts * 0.5)} />
      <pointLight 
        position={[10, 10, 10]} 
        intensity={1 + (shapeGlow?.intensity || 0)}
        color={shapeGlow?.useObjectColor ? '#ffffff' : shapeGlow?.customColor || '#ffffff'}
      />
      <Spheres />
      <Cubes />
      <Toruses />
      <Particles />
    </>
  );
};

// Move the camera sync logic into a separate component
const CameraSync = () => {
  const { camera } = useVisualStore();
  const three = useThree();
  
  useEffect(() => {
    if (!three || !three.camera) return;
    three.camera.position.set(0, camera.height, camera.distance);
    if (three.camera instanceof THREE.PerspectiveCamera) {
      three.camera.fov = camera.fov;
      three.camera.updateProjectionMatrix();
    }
  }, [camera.distance, camera.height, camera.fov, three]);

  return null;
};

const EnhancedVisualCanvas = () => {
  const { globalEffects, effects, camera } = useVisualStore();
  const { chromatic, volumetric, atmosphericBlur, colorBlending, distortion } = globalEffects;
  const [forceRender, setForceRender] = useState(0);

  console.log('=== ENHANCED VISUAL CANVAS DEBUG ===');
  console.log('Canvas rendering with store state:', useVisualStore.getState());
  console.log('Force render count:', forceRender);

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

  // Create chromatic aberration layers with RGB separation
  const aberrationLayers = useMemo(() => {
    if (!chromatic.enabled || chromatic.aberration <= 0) return null;
    
    return (
      <>
        {/* Red channel - top right */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'transparent',
            filter: `blur(${chromatic.aberration * 0.8}px)`,
            mixBlendMode: 'screen',
            transform: `translate(${chromatic.aberration * 0.5}px, -${chromatic.aberration * 0.3}px)`,
            pointerEvents: 'none',
            zIndex: 201,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at 70% 30%, 
                ${chromatic.aberrationColors.red}${Math.floor(chromatic.aberration * 25).toString(16).padStart(2, '0')} 0%,
                transparent 60%
              )`,
              mixBlendMode: 'screen',
            }}
          />
        </div>
        
        {/* Green channel - center */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'transparent',
            filter: `blur(${chromatic.aberration * 0.6}px)`,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            zIndex: 202,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at 50% 50%, 
                ${chromatic.aberrationColors.green}${Math.floor(chromatic.aberration * 20).toString(16).padStart(2, '0')} 0%,
                transparent 60%
              )`,
              mixBlendMode: 'screen',
            }}
          />
        </div>
        
        {/* Blue channel - bottom left */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'transparent',
            filter: `blur(${chromatic.aberration * 1.0}px)`,
            mixBlendMode: 'screen',
            transform: `translate(-${chromatic.aberration * 0.5}px, ${chromatic.aberration * 0.3}px)`,
            pointerEvents: 'none',
            zIndex: 203,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at 30% 70%, 
                ${chromatic.aberrationColors.blue}${Math.floor(chromatic.aberration * 22).toString(16).padStart(2, '0')} 0%,
                transparent 60%
              )`,
              mixBlendMode: 'screen',
            }}
          />
        </div>

        {/* Additional color blending overlay for enhanced effect */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            filter: `blur(${chromatic.aberration * 1.5}px)`,
            mixBlendMode: 'overlay',
            opacity: 0.15,
            pointerEvents: 'none',
            zIndex: 204,
            background: `radial-gradient(circle at 50% 50%, 
              ${chromatic.aberrationColors.red}22 0%,
              ${chromatic.aberrationColors.green}22 33%,
              ${chromatic.aberrationColors.blue}22 66%,
              transparent 100%
            )`,
          }}
        />
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

  // Post-processing overlay for brightness and vignette
  const postProcessingOverlay = useMemo(() => (
    <div
      className={styles.postProcessingOverlay}
      style={{
        background: effects.vignette > 0 ? `radial-gradient(circle at center, transparent ${100 - (effects.vignette * 30)}%, rgba(0, 0, 0, ${effects.vignette * 0.8}) 100%)` : 'none',
        mixBlendMode: 'multiply',
        pointerEvents: 'none',
        zIndex: 300
      }}
    />
  ), [effects.vignette]);

  return (
    <ClientOnly>
      <div className={styles.canvasContainer}>
        <button 
          onClick={() => setForceRender(prev => prev + 1)}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1000,
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Force Re-render (Test): {forceRender}
        </button>
        
        {aberrationLayers}
        {rainbowLayer}
        {fogLayer}
        {highBlurLayer}
        {postProcessingOverlay}
        
        <Canvas
          key={forceRender}
          camera={{ position: [0, camera.height, camera.distance], fov: camera.fov }}
          style={{
            filter: `
              ${effects.brightness !== 1 ? `brightness(${effects.brightness})` : ''}
              ${atmosphericBlur.enabled ? `blur(${atmosphericBlur.intensity * 0.8}px)` : ''}
              ${distortion.enabled && distortion.wave > 0 ? `skew(${distortion.wave * 10}deg, ${distortion.ripple * 10}deg)` : ''}
              ${distortion.enabled && distortion.noise > 0 ? `scale(${1 + distortion.noise * 0.1})` : ''}
              ${chromatic.enabled && chromatic.prism > 0 ? `saturate(${1 + chromatic.prism * 0.3})` : ''}
            `,
            transformOrigin: 'center center',
            mixBlendMode: colorBlending.enabled ? colorBlending.mode : 'normal',
            opacity: colorBlending.enabled ? 0.5 + (colorBlending.intensity * 0.5) : 1,
            willChange: 'transform, filter, opacity',
            isolation: 'isolate'
          }}
        >
          <CameraSync />
          <Scene />
        </Canvas>
      </div>
    </ClientOnly>
  );
};

export default EnhancedVisualCanvas;