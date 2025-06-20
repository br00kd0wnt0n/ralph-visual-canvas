import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Html } from '@react-three/drei';
import { useVisualStore, GLOBAL_DEFAULTS } from '../store/visualStore';
import { getArtisticCameraConfig, constrainToViewport } from '../utils/backgroundLayout';
import { performanceMonitor } from '../utils/performanceMonitor';
import { performanceOptimizer } from '../utils/performanceOptimizer';
import * as THREE from 'three';
import styles from './EnhancedVisualCanvas.module.css';
import { Blobs } from './Blobs';
import { ObjectTrails } from './ObjectTrails';
import { WaveInterference } from './WaveInterference';
import { Metamorphosis } from './Metamorphosis';
import { Fireflies } from './Fireflies';
import { LayeredSineWaves } from './LayeredSineWaves';
import { EffectComposer } from '@react-three/postprocessing';

// Utility function to convert hex color to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 255, b: 255 };
};

// Add client-side only rendering wrapper
const ClientOnly = React.memo(({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <>{children}</>;
});

const Spheres = () => {
  // Helper to create unique organic geometry for each sphere - MUST BE FIRST
  const createOrganicSphereGeometry = (size: number, organicness: number) => {
    // Safety checks to prevent NaN values
    const safeSize = isNaN(size) || size <= 0 ? 1.0 : size;
    const safeOrganicness = isNaN(organicness) || organicness < 0 ? 0 : organicness;
    
    const geometry = new THREE.SphereGeometry(safeSize, 16, 16);
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const noise = (Math.random() - 0.5) * safeOrganicness;
      positions[i] += noise;
      positions[i + 1] += noise;
      positions[i + 2] += noise;
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
  };

  const { geometric, globalEffects, backgroundConfig, globalAnimationSpeed } = useVisualStore();
  const { spheres } = geometric;
  const { shapeGlow } = globalEffects;
  const groupRef = useRef<THREE.Group>(null);
  const [positions, setPositions] = useState<THREE.Vector3[]>([]);
  const renderKey = useMemo(() => `spheres-${spheres.count}-${Date.now()}`, [spheres.count]);

  // Get layer configuration for background mode
  const layerConfig = backgroundConfig.enabled ? 
    backgroundConfig.artisticLayout?.layers?.nearBackground : null;
  const layerZ = layerConfig?.zPosition || 0;
  const layerOpacity = layerConfig?.opacity || 1.0;

  // Generate positions using useMemo to ensure they're available before render
  const generatedPositions = useMemo(() => {
    const newPositions: THREE.Vector3[] = [];
    const safeCount = isNaN(spheres.count) || spheres.count < 0 ? 0 : spheres.count;
    for (let i = 0; i < safeCount; i++) {
      newPositions.push(new THREE.Vector3(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 40,
      ));
    }
    return newPositions;
  }, [spheres.count, spheres.size]);

  // FIX: Memoize all geometries at once, BEFORE any conditional returns
  const geometries = useMemo(
    () => {
      const safeCount = isNaN(spheres.count) || spheres.count < 0 ? 0 : spheres.count;
      const safeSize = isNaN(spheres.size) || spheres.size <= 0 ? 1.0 : spheres.size;
      const safeOrganicness = isNaN(spheres.organicness) || spheres.organicness < 0 ? 0 : spheres.organicness;
      
      return Array.from({ length: safeCount }, () => 
        createOrganicSphereGeometry(safeSize, safeOrganicness)
      );
    },
    [spheres.count, spheres.size, spheres.organicness]
  );

  // Update positions state when generated positions change
  useEffect(() => {
    setPositions(generatedPositions);
  }, [generatedPositions]);

  if (!spheres || spheres.count === 0) {
    return null;
  }

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    const timeScale = backgroundConfig.timeScale;
    // Safety check: clamp global animation speed to prevent crashes
    const safeAnimationSpeed = Math.max(0.01, Math.min(5.0, globalAnimationSpeed));
    const scaledTime = time * timeScale * safeAnimationSpeed;
    const waveIntensity = globalEffects.distortion.wave * 2;
    const rippleIntensity = globalEffects.distortion.ripple * 3;
    // Calculate final speed: individual sphere speed * global animation speed
    const finalSpeed = spheres.speed * safeAnimationSpeed;
    
    // Rotate the entire group with individual speed * global animation speed
    groupRef.current.rotation.y += finalSpeed * 0.01 * timeScale;
    
    // Animate individual spheres with individual speed * global animation speed
    groupRef.current.children.forEach((child, i) => {
      const pos = positions[i];
      if (!pos) return;
      
      // Base movement with individual speed * global animation speed
      child.position.y = pos.y + Math.sin(scaledTime + i) * 2 * finalSpeed;
      
      // Add wave distortion
      if (waveIntensity > 0) {
        child.position.x = pos.x + Math.sin(scaledTime * globalEffects.distortion.frequency + i) * waveIntensity;
        child.position.z = pos.z + Math.cos(scaledTime * globalEffects.distortion.frequency + i * 0.5) * waveIntensity;
      } else {
        child.position.x = pos.x;
        child.position.z = pos.z;
      }
      
      // Add ripple effect
      if (rippleIntensity > 0) {
        const distance = Math.sqrt(child.position.x ** 2 + child.position.z ** 2);
        child.position.y += Math.sin(scaledTime * 2 + distance * 0.5) * rippleIntensity;
      }
      
      // Apply layer Z position when in background mode
      if (backgroundConfig.enabled) {
        // Apply viewport constraints for background mode
        const constrainedPosition = constrainToViewport({
          x: child.position.x,
          y: child.position.y,
          z: child.position.z
        }, layerZ);
        child.position.set(constrainedPosition.x, constrainedPosition.y, constrainedPosition.z);
      }
    });
  });

  // Don't render until positions are available
  if (positions.length === 0) {
    return null;
  }

  return (
    <group ref={groupRef} key={renderKey}>
      {positions.map((pos, i) => {
        const geometry = geometries[i];
        // Safety check: only render if geometry exists
        if (!geometry) return null;
        
        return (
          <group key={`sphere-${i}-${spheres.count}`} position={pos}>
            {/* Main sphere */}
            <mesh>
              <primitive object={geometry} />
              <meshBasicMaterial 
                color={spheres.color} 
                transparent 
                opacity={spheres.opacity * layerOpacity}
                visible={true}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Single glow layer */}
            {shapeGlow.enabled && (
              <mesh>
                <primitive object={geometry} />
                <meshBasicMaterial
                  color={shapeGlow.useObjectColor ? spheres.color : shapeGlow.customColor}
                  transparent
                  opacity={shapeGlow.intensity * 0.3 * layerOpacity}
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
  // Helper to create unique organic geometry for each cube - MUST BE FIRST
  const createOrganicCubeGeometry = (size: number, organicness: number) => {
    // Safety checks to prevent NaN values
    const safeSize = isNaN(size) || size <= 0 ? 1.0 : size;
    const safeOrganicness = isNaN(organicness) || organicness < 0 ? 0 : organicness;
    
    const geometry = new THREE.BoxGeometry(safeSize, safeSize, safeSize);
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const noise = (Math.random() - 0.5) * safeOrganicness;
      positions[i] += noise;
      positions[i + 1] += noise;
      positions[i + 2] += noise;
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
  };

  const { geometric, globalEffects, backgroundConfig, globalAnimationSpeed } = useVisualStore();
  const { cubes } = geometric;
  const { shapeGlow } = globalEffects;
  const groupRef = useRef<THREE.Group>(null);
  const [positions, setPositions] = useState<THREE.Vector3[]>([]);
  const renderKey = useMemo(() => `cubes-${cubes.count}-${Date.now()}`, [cubes.count]);

  // Get layer configuration for background mode
  const layerConfig = backgroundConfig.enabled ? 
    backgroundConfig.artisticLayout?.layers?.nearBackground : null;
  const layerZ = layerConfig?.zPosition || 0;
  const layerOpacity = layerConfig?.opacity || 1.0;

  // Generate positions using useMemo to ensure they're available before render
  const generatedPositions = useMemo(() => {
    const newPositions: THREE.Vector3[] = [];
    const safeCount = isNaN(cubes.count) || cubes.count < 0 ? 0 : cubes.count;
    for (let i = 0; i < safeCount; i++) {
      newPositions.push(new THREE.Vector3(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 40,
      ));
    }
    return newPositions;
  }, [cubes.count, cubes.size]);

  // FIX: Memoize all geometries at once, BEFORE any conditional returns
  const geometries = useMemo(
    () => {
      const safeCount = isNaN(cubes.count) || cubes.count < 0 ? 0 : cubes.count;
      const safeSize = isNaN(cubes.size) || cubes.size <= 0 ? 1.0 : cubes.size;
      const safeOrganicness = isNaN(cubes.organicness) || cubes.organicness < 0 ? 0 : cubes.organicness;
      
      return Array.from({ length: safeCount }, () => 
        createOrganicCubeGeometry(safeSize, safeOrganicness)
      );
    },
    [cubes.count, cubes.size, cubes.organicness]
  );

  // Update positions state when generated positions change
  useEffect(() => {
    setPositions(generatedPositions);
  }, [generatedPositions]);

  if (!cubes || cubes.count === 0) {
    return null;
  }

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    const timeScale = backgroundConfig.timeScale;
    // Safety check: clamp global animation speed to prevent crashes
    const safeAnimationSpeed = Math.max(0.01, Math.min(5.0, globalAnimationSpeed));
    const scaledTime = time * timeScale * safeAnimationSpeed;
    const waveIntensity = globalEffects.distortion.wave * 2;
    const rippleIntensity = globalEffects.distortion.ripple * 3;
    // Calculate final rotation speed: individual cube rotation * global animation speed
    const finalRotationSpeed = cubes.rotation * safeAnimationSpeed;
    
    // Rotate the entire group with individual rotation speed * global animation speed
    groupRef.current.rotation.y += finalRotationSpeed * 0.01 * timeScale;
    
    // Animate individual cubes with individual rotation speed * global animation speed
    groupRef.current.children.forEach((child, i) => {
      const pos = positions[i];
      if (!pos) return;
      
      // Base movement with individual rotation speed * global animation speed
      child.position.y = pos.y + Math.sin(scaledTime + i) * 1.5 * finalRotationSpeed;
      
      // Add wave distortion
      if (waveIntensity > 0) {
        child.position.x = pos.x + Math.sin(scaledTime * globalEffects.distortion.frequency + i) * waveIntensity;
        child.position.z = pos.z + Math.cos(scaledTime * globalEffects.distortion.frequency + i * 0.5) * waveIntensity;
      } else {
        child.position.x = pos.x;
        child.position.z = pos.z;
      }
      
      // Add ripple effect
      if (rippleIntensity > 0) {
        const distance = Math.sqrt(child.position.x ** 2 + child.position.z ** 2);
        child.position.y += Math.sin(scaledTime * 2 + distance * 0.5) * rippleIntensity;
      }
      
      // Apply layer Z position when in background mode
      if (backgroundConfig.enabled) {
        // Apply viewport constraints for background mode
        const constrainedPosition = constrainToViewport({
          x: child.position.x,
          y: child.position.y,
          z: child.position.z
        }, layerZ);
        child.position.set(constrainedPosition.x, constrainedPosition.y, constrainedPosition.z);
      }
    });
  });

  // Don't render until positions are available
  if (positions.length === 0) {
    return null;
  }

  return (
    <group ref={groupRef} key={renderKey}>
      {positions.map((pos, i) => {
        const geometry = geometries[i];
        // Safety check: only render if geometry exists
        if (!geometry) return null;
        
        return (
          <group key={`cube-${i}-${cubes.count}`} position={pos}>
            {/* Main cube */}
            <mesh>
              <primitive object={geometry} />
              <meshBasicMaterial 
                color={cubes.color} 
                transparent 
                opacity={cubes.opacity * layerOpacity}
                visible={true}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Single glow layer */}
            {shapeGlow.enabled && (
              <mesh>
                <primitive object={geometry} />
                <meshBasicMaterial
                  color={shapeGlow.useObjectColor ? cubes.color : shapeGlow.customColor}
                  transparent
                  opacity={shapeGlow.intensity * 0.3 * layerOpacity}
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
  // Helper to create unique organic geometry for each torus - MUST BE FIRST
  const createOrganicTorusGeometry = (size: number, organicness: number) => {
    // Safety checks to prevent NaN values
    const safeSize = isNaN(size) || size <= 0 ? 1.0 : size;
    const safeOrganicness = isNaN(organicness) || organicness < 0 ? 0 : organicness;
    
    const geometry = new THREE.TorusGeometry(safeSize, safeSize * 0.3, 16, 32);
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const noise = (Math.random() - 0.5) * safeOrganicness;
      positions[i] += noise;
      positions[i + 1] += noise;
      positions[i + 2] += noise;
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
  };

  const { geometric, globalEffects, backgroundConfig, globalAnimationSpeed } = useVisualStore();
  const { toruses } = geometric;
  const { shapeGlow } = globalEffects;
  const groupRef = useRef<THREE.Group>(null);
  const [positions, setPositions] = useState<THREE.Vector3[]>([]);
  const renderKey = useMemo(() => `toruses-${toruses.count}-${Date.now()}`, [toruses.count]);

  // Get layer configuration for background mode
  const layerConfig = backgroundConfig.enabled ? 
    backgroundConfig.artisticLayout?.layers?.nearBackground : null;
  const layerZ = layerConfig?.zPosition || 0;
  const layerOpacity = layerConfig?.opacity || 1.0;

  // Generate positions using useMemo to ensure they're available before render
  const generatedPositions = useMemo(() => {
    const newPositions: THREE.Vector3[] = [];
    const safeCount = isNaN(toruses.count) || toruses.count < 0 ? 0 : toruses.count;
    for (let i = 0; i < safeCount; i++) {
      newPositions.push(new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 30,
      ));
    }
    return newPositions;
  }, [toruses.count, toruses.size]);

  // FIX: Memoize all geometries at once, BEFORE any conditional returns
  const geometries = useMemo(
    () => {
      const safeCount = isNaN(toruses.count) || toruses.count < 0 ? 0 : toruses.count;
      const safeSize = isNaN(toruses.size) || toruses.size <= 0 ? 1.0 : toruses.size;
      const safeOrganicness = isNaN(toruses.organicness) || toruses.organicness < 0 ? 0 : toruses.organicness;
      
      return Array.from({ length: safeCount }, () => 
        createOrganicTorusGeometry(safeSize, safeOrganicness)
      );
    },
    [toruses.count, toruses.size, toruses.organicness]
  );

  // Update positions state when generated positions change
  useEffect(() => {
    setPositions(generatedPositions);
  }, [generatedPositions]);

  if (!toruses || toruses.count === 0) {
    return null;
  }

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    const timeScale = backgroundConfig.timeScale;
    // Safety check: clamp global animation speed to prevent crashes
    const safeAnimationSpeed = Math.max(0.01, Math.min(5.0, globalAnimationSpeed));
    const scaledTime = time * timeScale * safeAnimationSpeed;
    const waveIntensity = globalEffects.distortion.wave * 2;
    const rippleIntensity = globalEffects.distortion.ripple * 3;
    // Calculate final speed: individual torus speed * global animation speed
    const finalSpeed = toruses.speed * safeAnimationSpeed;
    
    // Rotate the entire group with individual speed * global animation speed
    groupRef.current.rotation.y += finalSpeed * 0.01 * timeScale;
    
    // Animate individual toruses with individual speed * global animation speed
    groupRef.current.children.forEach((child, i) => {
      const pos = positions[i];
      if (!pos) return;
      
      // Base movement with individual speed * global animation speed
      child.position.y = pos.y + Math.sin(scaledTime + i) * 1.5 * finalSpeed;
      
      // Add wave distortion
      if (waveIntensity > 0) {
        child.position.x = pos.x + Math.sin(scaledTime * globalEffects.distortion.frequency + i) * waveIntensity;
        child.position.z = pos.z + Math.cos(scaledTime * globalEffects.distortion.frequency + i * 0.5) * waveIntensity;
      } else {
        child.position.x = pos.x;
        child.position.z = pos.z;
      }
      
      // Add ripple effect
      if (rippleIntensity > 0) {
        const distance = Math.sqrt(child.position.x ** 2 + child.position.z ** 2);
        child.position.y += Math.sin(scaledTime * 2 + distance * 0.5) * rippleIntensity;
      }
      
      // Apply layer Z position when in background mode
      if (backgroundConfig.enabled) {
        // Apply viewport constraints for background mode
        const constrainedPosition = constrainToViewport({
          x: child.position.x,
          y: child.position.y,
          z: child.position.z
        }, layerZ);
        child.position.set(constrainedPosition.x, constrainedPosition.y, constrainedPosition.z);
      }
    });
  });

  // Don't render until positions are available
  if (positions.length === 0) {
    return null;
  }

  return (
    <group ref={groupRef} key={renderKey}>
      {positions.map((pos, i) => {
        const geometry = geometries[i];
        // Safety check: only render if geometry exists
        if (!geometry) return null;
        
        return (
          <group key={`torus-${i}-${toruses.count}`} position={pos}>
            {/* Main torus */}
            <mesh>
              <primitive object={geometry} />
              <meshBasicMaterial 
                color={toruses.color} 
                transparent 
                opacity={toruses.opacity * layerOpacity}
                visible={true}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Single glow layer */}
            {shapeGlow.enabled && (
              <mesh>
                <primitive object={geometry} />
                <meshBasicMaterial
                  color={shapeGlow.useObjectColor ? toruses.color : shapeGlow.customColor}
                  transparent
                  opacity={shapeGlow.intensity * 0.3 * layerOpacity}
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
  const { particles, globalEffects, backgroundConfig, globalAnimationSpeed } = useVisualStore();
  const { particleInteraction } = globalEffects;
  const [positions, setPositions] = useState<Array<{x: number, y: number, z: number}>>([]);
  const particleRefs = useRef<THREE.Mesh[]>([]);
  const renderKey = useMemo(() => `particles-${particles.count}-${Date.now()}`, [particles.count]);

  // Get layer configuration for background mode
  const layerConfig = backgroundConfig.enabled ? 
    backgroundConfig.artisticLayout?.layers?.midBackground : null;
  const layerZ = layerConfig?.zPosition || 0;
  const layerOpacity = layerConfig?.opacity || 1.0;

  // Safety checks for particle parameters
  const safeCount = Math.min(particles.count, 2000); // Cap at 2000 for performance
  const safeSize = Math.max(0.1, Math.min(particles.size, 5.0));
  const safeSpeed = Math.max(0.1, Math.min(particles.speed, 10.0));
  const safeSpread = Math.max(10, Math.min(particles.spread, 100));
  const safeOpacity = Math.max(0.1, Math.min(particles.opacity, 1.0));

  // Generate particle positions using useMemo
  const generatedPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < safeCount; i++) {
      positions.push({
        x: (Math.random() - 0.5) * safeSpread * 2,
        y: (Math.random() - 0.5) * safeSpread * 1.5,
        z: (Math.random() - 0.5) * safeSpread * 2,
      });
    }
    return positions;
  }, [safeCount, safeSpread]);

  // Frame counter for performance optimization
  const frameCountRef = useRef(0);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const timeScale = backgroundConfig.timeScale;
    // Safety check: clamp global animation speed to prevent crashes
    const safeAnimationSpeed = Math.max(0.01, Math.min(5.0, globalAnimationSpeed));
    const scaledTime = time * timeScale * safeAnimationSpeed;
    const turbulence = globalEffects.particleInteraction.turbulence;
    // Calculate final speed: individual particle speed * global animation speed
    const finalSpeed = safeSpeed * safeAnimationSpeed;
    
    // PERFORMANCE OPTIMIZATION: Only apply viewport constraints every 5 frames
    frameCountRef.current++;
    const shouldApplyConstraints = backgroundConfig.enabled && frameCountRef.current % 5 === 0;
    
    particleRefs.current.forEach((mesh, i) => {
      if (mesh) {
        // Set scale based on slider
        mesh.scale.set(safeSize, safeSize, safeSize);
        // Base movement with individual speed * global animation speed
        mesh.position.y += Math.sin(scaledTime + i) * 0.01 * finalSpeed;
        
        // Add turbulence with individual speed * global animation speed
        if (turbulence > 0) {
          mesh.position.x += (Math.random() - 0.5) * turbulence * 0.1 * finalSpeed;
          mesh.position.y += (Math.random() - 0.5) * turbulence * 0.1 * finalSpeed;
          mesh.position.z += (Math.random() - 0.5) * turbulence * 0.1 * finalSpeed;
        }
        
        // Apply viewport constraints when in background mode (less frequently)
        if (shouldApplyConstraints) {
          const currentPosition = {
            x: mesh.position.x,
            y: mesh.position.y,
            z: mesh.position.z
          };
          const constrainedPosition = constrainToViewport(currentPosition, layerZ);
          mesh.position.set(constrainedPosition.x, constrainedPosition.y, constrainedPosition.z);
        }
      }
    });
  });

  return (
    <group key={renderKey}>
      {generatedPositions.map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) particleRefs.current[i] = el;
          }}
          position={[pos.x, pos.y, pos.z]}
        >
          <sphereGeometry args={[0.1, 8, 6]} />
          <meshBasicMaterial
            color={particles.color}
            transparent
            opacity={Math.max(0.1, safeOpacity * layerOpacity)}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};

const VolumetricFog = () => {
  const { globalEffects } = useVisualStore();
  const { volumetric } = globalEffects;

  if (!volumetric.enabled || volumetric.fog <= 0) {
    return null;
  }

  // Calculate fog distance with better scaling
  // Fog: 0-1 range, Density: 0-2 range
  // Lower fog distance = more fog (objects fade out sooner)
  const baseDistance = 50;
  const fogMultiplier = 1 + (volumetric.fog * 4); // 1 to 5
  const densityMultiplier = 1 + (volumetric.density * 2); // 1 to 5
  const fogDistance = baseDistance / (fogMultiplier * densityMultiplier);
  
  return (
    <>
      <fog
        attach="fog"
        args={[volumetric.color, 1, fogDistance]}
        near={1}
        far={50}
      />
      {/* Light shafts removed - they don't look good */}
    </>
  );
};

const Scene = () => {
  const { globalEffects, backgroundConfig } = useVisualStore();
  const { volumetric, shapeGlow } = globalEffects;

  // Performance monitoring
  useFrame(() => {
    performanceMonitor.update();
  });

  return (
    <>
      <VolumetricFog />
      <ambientLight intensity={0.5} />
      <pointLight 
        position={[10, 10, 10]} 
        intensity={1 + (shapeGlow?.intensity || 0)}
        color={shapeGlow?.useObjectColor ? '#ffffff' : shapeGlow?.customColor || '#ffffff'}
      />
      <Metamorphosis />
      <WaveInterference />
      <Spheres />
      <Cubes />
      <Toruses />
      <Blobs />
      <Particles />
      <ObjectTrails />
      <Fireflies />
      <LayeredSineWaves />
    </>
  );
};

// Move the camera sync logic into a separate component
const CameraSync = () => {
  const { camera, backgroundConfig, ui } = useVisualStore();
  const three = useThree();
  
  useEffect(() => {
    if (!three || !three.camera) return;
    
    // Skip camera sync when in positioning mode - let OrbitControls handle it
    if (ui.cameraPositioningMode) return;
    
    // Determine camera values based on background mode
    let finalPosition, finalTarget, finalFov;
    
    if (backgroundConfig.enabled && backgroundConfig.camera.fixed) {
      // Fixed background mode: use artistic layout camera config
      const bgCamera = backgroundConfig.artisticLayout?.camera;
      finalPosition = bgCamera?.position || [0, 0, 50];
      finalTarget = bgCamera?.target || [0, 0, 0];
      finalFov = bgCamera?.fov || 60;
    } else {
      // Normal mode: use global defaults position and target
      finalPosition = camera.position;
      finalTarget = camera.target;
      finalFov = camera.fov;
    }
    
    // Apply camera position
    three.camera.position.set(...finalPosition);
    
    // Apply FOV
    if (three.camera instanceof THREE.PerspectiveCamera) {
      three.camera.fov = finalFov;
      three.camera.updateProjectionMatrix();
    }
    
    // Look at the target
    three.camera.lookAt(...finalTarget);
  }, [camera.position, camera.target, camera.fov, backgroundConfig.enabled, backgroundConfig.camera.fixed, backgroundConfig.artisticLayout?.camera, three, ui.cameraPositioningMode]);

  return null;
};

// NEW: Camera Controls Component for positioning mode
const CameraControls = () => {
  const { camera, ui, updateCamera } = useVisualStore();
  const controlsRef = useRef<any>(null);
  const three = useThree();
  const lastUpdateRef = useRef<{ position: [number, number, number]; target: [number, number, number] }>({
    position: camera.position,
    target: camera.target
  });

  // Update camera position from store when positioning mode is enabled
  useEffect(() => {
    if (ui.cameraPositioningMode && controlsRef.current && three.camera) {
      three.camera.position.set(...camera.position);
      controlsRef.current.target.set(...camera.target);
      controlsRef.current.update();
      lastUpdateRef.current = { position: camera.position, target: camera.target };
    }
  }, [ui.cameraPositioningMode, camera.position, camera.target, three.camera]);

  // Handle camera changes and update store
  useFrame(() => {
    if (ui.cameraPositioningMode && controlsRef.current) {
      const newPosition: [number, number, number] = [
        three.camera.position.x,
        three.camera.position.y,
        three.camera.position.z
      ];
      const newTarget: [number, number, number] = [
        controlsRef.current.target.x,
        controlsRef.current.target.y,
        controlsRef.current.target.z
      ];
      
      // Only update if position or target actually changed
      const hasChanged = 
        newPosition[0] !== lastUpdateRef.current.position[0] ||
        newPosition[1] !== lastUpdateRef.current.position[1] ||
        newPosition[2] !== lastUpdateRef.current.position[2] ||
        newTarget[0] !== lastUpdateRef.current.target[0] ||
        newTarget[1] !== lastUpdateRef.current.target[1] ||
        newTarget[2] !== lastUpdateRef.current.target[2];
      
      if (hasChanged) {
        // Calculate distance and height from position
        const distance = Math.sqrt(newPosition[0] ** 2 + newPosition[2] ** 2);
        const height = newPosition[1];
        
        updateCamera({
          position: newPosition,
          target: newTarget,
          distance,
          height
        });
        
        lastUpdateRef.current = { position: newPosition, target: newTarget };
      }
    }
  });

  if (!ui.cameraPositioningMode) return null;

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={camera.enablePan}
      enableZoom={camera.enableZoom}
      enableRotate={camera.enableRotate}
      dampingFactor={camera.damping}
      minDistance={camera.minDistance}
      maxDistance={camera.maxDistance}
      minPolarAngle={camera.minPolarAngle}
      maxPolarAngle={camera.maxPolarAngle}
      autoRotate={camera.autoRotate}
      autoRotateSpeed={camera.autoRotateSpeed}
    />
  );
};

const EnhancedVisualCanvas = () => {
  const visualStore = useVisualStore();
  const { globalEffects, effects, camera, backgroundConfig, ui } = visualStore;
  const { chromatic, volumetric, atmosphericBlur, colorBlending, distortion } = globalEffects;
  const [canvasReady, setCanvasReady] = useState(false);
  
  // WebGL context event handlers
  const handleWebGLContextLost = useCallback((event: Event) => {
    console.error('🚨 WebGL context lost!', event);
    event.preventDefault();
    
    // Disable performance monitoring during context loss
    performanceMonitor.disable();
    
    // Set a flag to prevent further rendering attempts
    setCanvasReady(false);
  }, []);

  const handleWebGLContextRestored = useCallback(() => {
    console.log('✅ WebGL context restored');
    
    // Re-enable performance monitoring
    performanceMonitor.enable();
    
    // Re-enable canvas rendering
    setCanvasReady(true);
  }, []);
  
  useEffect(() => {
    setCanvasReady(true);
    // Enable performance monitoring
    performanceMonitor.enable();
    // Enable performance optimization
    performanceOptimizer.enable();
  }, []);

  // Handle ESC key to exit camera positioning mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && ui.cameraPositioningMode) {
        visualStore.setCameraPositioningMode(false);
      }
    };

    if (ui.cameraPositioningMode) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [ui.cameraPositioningMode]);

  // Create atmospheric blur layers
  const atmosphericBlurLayers = useMemo(() => {
    if (!atmosphericBlur.enabled || atmosphericBlur.intensity <= 0) return null;
    
    const layers = [];
    const baseIntensity = atmosphericBlur.intensity;
    const layerCount = atmosphericBlur.layers;
    
    for (let i = 0; i < layerCount; i++) {
      // Progressive blur intensity for bokeh effect
      const intensity = baseIntensity * (i + 1) * 0.5;
      // Decreasing opacity for each layer
      const opacity = 0.3 / (i + 1);
      
      layers.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backdropFilter: `blur(${intensity}px)`,
            opacity,
            zIndex: 50 + i,
            mixBlendMode: 'normal',
            willChange: 'backdrop-filter',
            isolation: 'isolate'
          }}
        />
      );
    }
    
    return layers;
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
    
    const rgb = hexToRgb(volumetric.color);
    
    // Calculate CSS fog opacity based on fog and density
    const cssOpacity = Math.min(0.8, volumetric.fog * 0.8 + volumetric.density * 0.2);
    const blurAmount = volumetric.density * 15; // 0 to 30px blur
    
    return (
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at center, 
          rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${cssOpacity * 0.3}) 0%,
          rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${cssOpacity * 0.1}) 50%,
          transparent 100%
        )`,
        backdropFilter: `blur(${blurAmount}px)`,
        opacity: cssOpacity,
        pointerEvents: 'none',
        zIndex: 4
      }} />
    );
  }, [volumetric]);

  // Post-processing overlay for brightness and vignette
  const postProcessingOverlay = useMemo(() => {
    if (effects.vignette <= 0) {
      return null;
    }
    
    const gradientStart = Math.max(20, 100 - (effects.vignette * 60));
    const gradientEnd = 100;
    const opacity = Math.min(1, effects.vignette * 1.5);
    
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at center, transparent ${gradientStart}%, rgba(0, 0, 0, ${opacity}) ${gradientEnd}%)`,
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      />
    );
  }, [effects.vignette]);

  // Create bloom effect using CSS layers
  const bloomLayer = useMemo(() => {
    const bloom = GLOBAL_DEFAULTS.visual.bloom;
    if (!bloom) {
      return null;
    }
    
    return (
      <>
        {/* Primary bloom layer */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
            filter: 'blur(20px)',
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            zIndex: 10
          }}
        />
        {/* Secondary bloom layer for enhanced effect */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 50%)',
            filter: 'blur(40px)',
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            zIndex: 11
          }}
        />
      </>
    );
  }, [GLOBAL_DEFAULTS.visual.bloom]);

  // Optimize Canvas style calculation
  const canvasStyle: React.CSSProperties = useMemo(() => {
    const filters = [];
    const transforms = [];
    
    // Add brightness filter (should always work)
    if (effects.brightness !== 1) {
      filters.push(`brightness(${effects.brightness})`);
    }
    
    // Add contrast filter
    if (effects.contrast !== 1) {
      filters.push(`contrast(${effects.contrast})`);
    }
    
    // Add saturation filter
    if (effects.saturation !== 1) {
      filters.push(`saturate(${effects.saturation})`);
    }
    
    // Add glow filter
    if (effects.glow > 0) {
      // Glow effect using drop-shadow filter
      const glowIntensity = effects.glow * 2; // Scale up for visibility
      filters.push(`drop-shadow(0 0 ${glowIntensity}px rgba(255, 255, 255, ${effects.glow * 0.5}))`);
    }
    
    // Add atmospheric blur filter
    if (atmosphericBlur.enabled) {
      filters.push(`blur(${atmosphericBlur.intensity * 0.8}px)`);
    }
    
    // Add chromatic prism filter
    if (chromatic.enabled && chromatic.prism > 0) {
      filters.push(`saturate(${1 + chromatic.prism * 0.3})`);
    }
    
    // Add distortion transforms (not filters)
    if (distortion.enabled && distortion.wave > 0) {
      transforms.push(`skew(${distortion.wave * 10}deg, ${distortion.ripple * 10}deg)`);
    }
    if (distortion.enabled && distortion.noise > 0) {
      transforms.push(`scale(${1 + distortion.noise * 0.1})`);
    }
    
    return {
      filter: filters.length > 0 ? filters.join(' ') : undefined,
      transform: transforms.length > 0 ? transforms.join(' ') : undefined,
      transformOrigin: 'center center',
      mixBlendMode: colorBlending.enabled ? colorBlending.mode : 'normal',
      opacity: colorBlending.enabled ? 0.5 + (colorBlending.intensity * 0.5) : 1,
      willChange: 'transform, filter, opacity',
      isolation: 'isolate'
    };
  }, [effects.brightness, effects.contrast, effects.saturation, effects.glow, atmosphericBlur.enabled, atmosphericBlur.intensity, distortion.enabled, distortion.wave, distortion.ripple, distortion.noise, chromatic.enabled, chromatic.prism, colorBlending.enabled, colorBlending.mode, colorBlending.intensity]);
  
  if (!canvasReady) {
    return <div>Initializing Canvas...</div>;
  }

  // Calculate canvas style with debug logging
  const canvasStyleWithBackground = {
    ...canvasStyle,
    // Background-specific styles are now applied directly in Canvas style prop
  };

  return (
    <ClientOnly>
      <div className={styles.canvasContainer}>
        {aberrationLayers}
        {rainbowLayer}
        {fogLayer}
        {atmosphericBlurLayers}
        {postProcessingOverlay}
        {bloomLayer}
        
        {/* Camera Positioning Mode Indicator */}
        {ui.cameraPositioningMode && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#00ff00',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: 10000,
            border: '2px solid #00ff00',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#00ff00',
              animation: 'pulse 1.5s infinite'
            }} />
            Camera Positioning Mode Active
            <div style={{
              fontSize: '12px',
              opacity: 0.8,
              marginLeft: '8px'
            }}>
              Click and drag to move • Scroll to zoom • ESC to exit
            </div>
          </div>
        )}
        
        <Canvas
          camera={{ 
            position: [0, 0, 25], // Default position - CameraSync will override this
            fov: 60, // Default FOV - CameraSync will override this
            near: 0.1,
            far: 2000 // Keep the increased far clipping for the extreme distance
          }}
          onCreated={({ gl }) => {
            console.log('🎨 WebGL context created');
            
            // Set WebGL context attributes for better performance
            gl.setClearColor(0x000000, 0);
            gl.autoClear = false;
            gl.autoClearColor = false;
            gl.autoClearDepth = false;
            gl.autoClearStencil = false;
            
            // Optimize WebGL context
            performanceOptimizer.optimizeWebGLContext(gl);
            
            const canvas = gl.domElement;
            canvas.addEventListener('webglcontextlost', handleWebGLContextLost);
            canvas.addEventListener('webglcontextrestored', handleWebGLContextRestored);
            
            // Add error handling for WebGL errors
            const handleWebGLError = (event: Event) => {
              console.warn('WebGL error detected:', event);
            };
            
            canvas.addEventListener('webglcontextlost', handleWebGLError);
          }}
          onError={(error) => {
            console.error('Canvas error:', error);
            setCanvasReady(false);
          }}
          style={{
            ...canvasStyleWithBackground,
            ...(backgroundConfig.enabled && {
              position: 'fixed' as const,
              top: 0,
              left: 0,
              zIndex: -1,
              filter: backgroundConfig.mode === 'modalFriendly' ? 'saturate(1.2) contrast(1.1)' : 'none',
              pointerEvents: backgroundConfig.mode === 'modalFriendly' ? 'none' as const : 'auto' as const,
              border: backgroundConfig.camera.fixed ? '4px solid rgba(255, 255, 0, 0.3)' : 'none'
            })
          }}
        >
          <CameraSync />
          <CameraControls />
          <Scene />
        </Canvas>
      </div>
    </ClientOnly>
  );
};

export default EnhancedVisualCanvas;