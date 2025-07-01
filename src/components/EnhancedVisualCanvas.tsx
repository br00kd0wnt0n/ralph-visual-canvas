import React, { useRef, useMemo, useEffect, useState, useCallback, useReducer } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Html } from '@react-three/drei';
import { useVisualStore, GLOBAL_DEFAULTS } from '../store/visualStore';
import { getArtisticCameraConfig, constrainToViewport } from '../utils/backgroundLayout';
import { performanceMonitor } from '../utils/performanceMonitor';
import { performanceOptimizer } from '../utils/performanceOptimizer';
import * as THREE from 'three';
import { TrailObject, trailManager } from './TrailObject';
import styles from './EnhancedVisualCanvas.module.css';
import { Blobs } from './Blobs';
import { ObjectTrails } from './ObjectTrails';
import { WaveInterference } from './WaveInterference';
import { Metamorphosis } from './Metamorphosis';
import { Fireflies } from './Fireflies';
import { LayeredSineWaves } from './LayeredSineWaves';
import { ArtisticCanvasController } from './artistic/ArtisticCanvasSystem';
import { ArtisticPresets } from './artistic/ArtisticConfigSystem';

// Import artistic canvas system
import { ArtisticCanvas, PaintingObject, ArtisticCanvasOverlay } from './artistic/ArtisticCanvasSystem';
import type { ArtisticCanvasConfig } from '../types/artistic';
import { OptimizedGeometricSystem } from './OptimizedGeometricSystem';
import { PerformanceMonitor } from './PerformanceMonitor';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';
import { WebGLContextManager } from './WebGLContextManager';
import CompanyLogo from './CompanyLogo';
import { memoryManager } from '../utils/MemoryManager';

// Trail renderer component with performance optimizations
const TrailRenderer = () => {
  const [trailMeshes, setTrailMeshes] = useState<{ mesh: THREE.InstancedMesh; material: THREE.Material; count: number }[]>([]);
  const frameCountRef = useRef(0);

  useFrame(() => {
    // PERFORMANCE OPTIMIZATION: Only update trail meshes every 3 frames
    frameCountRef.current++;
    if (frameCountRef.current % 3 !== 0) return;
    
    // Update trail meshes from the global trail manager
    const meshes = trailManager.getTrailMeshes();
    setTrailMeshes(meshes);
    
    // Update trails with proper delta time
    trailManager.updateTrails(0.016); // Assuming 60fps
  });

  return (
    <>
      {trailMeshes.map(({ mesh, material, count }, index) => (
        <primitive
          key={`trail-mesh-${index}`}
          object={mesh}
        />
      ))}
    </>
  );
};

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

  // ALL HOOKS MUST BE CALLED FIRST, BEFORE ANY CONDITIONAL LOGIC
  const { globalEffects, backgroundConfig, globalAnimationSpeed } = useVisualStore();
  const spheres = useVisualStore(state => state.geometric.spheres);
  const spheresCount = useVisualStore(state => state.geometric.spheres.count);
  const spheresColor = useVisualStore(state => state.geometric.spheres.color);
  const spheresSize = useVisualStore(state => state.geometric.spheres.size);
  const { shapeGlow } = globalEffects;
  
  const groupRef = useRef<THREE.Group>(null);
  const [positions, setPositions] = useState<THREE.Vector3[]>([]);
  const renderKey = useMemo(() => `spheres-${spheresCount}-${Date.now()}`, [spheresCount]);
  const pulseTimeRef = useRef(0);

  // Get layer configuration for background mode
  const layerConfig = backgroundConfig.enabled ? 
    backgroundConfig.artisticLayout?.layers?.nearBackground : null;
  const layerZ = layerConfig?.zPosition || 0;
  const layerOpacity = layerConfig?.opacity || 1.0;

  // Generate positions using useMemo to ensure they're available before render
  const generatedPositions = useMemo(() => {
    const newPositions: THREE.Vector3[] = [];
    const safeCount = isNaN(spheresCount) || spheresCount < 0 ? 0 : spheresCount;
    for (let i = 0; i < safeCount; i++) {
      newPositions.push(new THREE.Vector3(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 40,
      ));
    }
    return newPositions;
  }, [spheresCount, spheresSize]);

  // FIX: Memoize all geometries at once, BEFORE any conditional returns
  const geometries = useMemo(
    () => {
      const safeCount = isNaN(spheresCount) || spheresCount < 0 ? 0 : spheresCount;
      const safeSize = isNaN(spheresSize) || spheresSize <= 0 ? 1.0 : spheresSize;
      const safeOrganicness = isNaN(spheres.organicness) || spheres.organicness < 0 ? 0 : spheres.organicness;
      
      return Array.from({ length: safeCount }, () => 
        createOrganicSphereGeometry(safeSize, safeOrganicness)
      );
    },
    [spheresCount, spheresSize, spheres.organicness]
  );

  // Update positions state when generated positions change
  useEffect(() => {
    setPositions(generatedPositions);
  }, [generatedPositions]);

  // ALWAYS call useFrame, but make it conditional inside
  useFrame((state) => {
    // Early return if conditions aren't met
    if (!groupRef.current || !spheres || spheresCount === 0) return;
    
    const time = state.clock.elapsedTime;
    const timeScale = backgroundConfig.timeScale;
    // Safety check: clamp global animation speed to prevent crashes
    const safeAnimationSpeed = Math.max(0.01, Math.min(5.0, globalAnimationSpeed));
    const scaledTime = time * timeScale * safeAnimationSpeed;
    
    // Add safety checks for globalEffects properties
    const distortion = globalEffects?.distortion;
    const waveIntensity = (distortion?.wave ?? 0) * 2;
    const rippleIntensity = (distortion?.ripple ?? 0) * 3;
    const distortionFrequency = distortion?.frequency ?? 1;
    
    // Calculate final speed: individual sphere speed * global animation speed
    const finalSpeed = spheres.speed * safeAnimationSpeed;
    
    // Update pulse time for glow animation
    if (shapeGlow?.enabled && shapeGlow?.pulsing) {
      pulseTimeRef.current += state.clock.getDelta() * (shapeGlow?.pulseSpeed ?? 1.0) * safeAnimationSpeed;
    }
    
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
        child.position.x = pos.x + Math.sin(scaledTime * distortionFrequency + i) * waveIntensity;
        child.position.z = pos.z + Math.cos(scaledTime * distortionFrequency + i * 0.5) * waveIntensity;
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
      
      // Animate glow pulsing for individual spheres
      if (shapeGlow?.enabled && shapeGlow?.pulsing) {
        const trailObjectGroup = child as THREE.Group;
        const mesh = trailObjectGroup.children[0] as THREE.Mesh;
        
        // Safety check: ensure mesh and material exist and are of correct type
        if (mesh && mesh.material && mesh.material instanceof THREE.MeshStandardMaterial) {
          const material = mesh.material as THREE.MeshStandardMaterial;
          
          // Create pulsing effect with individual phase offset
          const pulsePhase = pulseTimeRef.current + i * 0.5;
          const pulseIntensity = 0.5 + 0.5 * Math.sin(pulsePhase);
          material.emissiveIntensity = (shapeGlow?.intensity || 0) * 2.0 * pulseIntensity;
          
          // Also animate the pulsing glow mesh if it exists
          if (trailObjectGroup.children.length > 1) {
            const glowMesh = trailObjectGroup.children[1] as THREE.Mesh;
            if (glowMesh && glowMesh.material && glowMesh.material instanceof THREE.MeshBasicMaterial) {
              const glowMaterial = glowMesh.material as THREE.MeshBasicMaterial;
              glowMaterial.opacity = (shapeGlow?.intensity || 0) * 0.3 * pulseIntensity;
            }
          }
        }
      }
    });
  });

  // DEBUG: Log current sphere values - only log occasionally to reduce performance impact
  if (process.env.NODE_ENV === 'development' && Math.random() < 0.001) { // 0.1% chance per frame
    console.log('🎨 Spheres component - Current store values:', {
      count: spheresCount,
      size: spheresSize,
      color: spheresColor,
      speed: spheres.speed,
      rotation: spheres.rotation,
      opacity: spheres.opacity,
      organicness: spheres.organicness
    });
  }

  // TEMPORARY: Test with hardcoded values to see if component can render different counts
  const testCount = 35; // Hardcoded test value
  if (process.env.NODE_ENV === 'development' && Math.random() < 0.001) { // 0.1% chance per frame
    console.log('🎨 Testing with hardcoded count:', testCount);
  }

  // Force re-render when store changes
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  useEffect(() => {
    forceUpdate();
  }, [spheresCount, spheresColor, spheresSize]);

  // NOW we can have conditional returns after all hooks are called
  if (!spheres || spheresCount === 0) {
    return null;
  }

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
        
        // Enhanced glow effect with better visibility
        const glowColor = shapeGlow?.useObjectColor ? spheresColor : (shapeGlow?.customColor || spheresColor);
        const glowIntensity = shapeGlow?.enabled ? shapeGlow?.intensity : 0;
        
        // Create material for this sphere with enhanced glow
        const material = new THREE.MeshStandardMaterial({
          color: spheresColor,
          emissive: new THREE.Color(glowColor),
          emissiveIntensity: glowIntensity * 2.0, // Much stronger glow
          transparent: true,
          opacity: spheres.opacity, // Use actual sphere opacity instead of layerOpacity
          // Add additive blending for more vibrant glow
          blending: glowIntensity > 0 ? THREE.AdditiveBlending : THREE.NormalBlending,
          // Increase metalness and roughness for better glow visibility
          metalness: glowIntensity > 0 ? 0.8 : 0.0,
          roughness: glowIntensity > 0 ? 0.2 : 0.5,
        });
        
        return (
          <TrailObject 
            key={`sphere-${i}-${spheresCount}`} 
            id={`sphere-${i}`}
            color={new THREE.Color(spheresColor)}
            size={spheresSize}
            velocityThreshold={0.05}
            geometry={geometry}
            material={material}
            trailType='sphereTrails'
          >
            <group position={pos}>
              <mesh geometry={geometry} material={material} />
              
              {/* Add pulsing glow effect when enabled */}
              {shapeGlow?.enabled && shapeGlow?.pulsing && (
                <mesh geometry={geometry} position={[0, 0, 0]}>
                  <meshBasicMaterial
                    color={glowColor}
                    transparent={true}
                    opacity={glowIntensity * 0.3}
                    blending={THREE.AdditiveBlending}
                    side={THREE.BackSide}
                  />
                </mesh>
              )}
            </group>
          </TrailObject>
        );
      })}
    </group>
  );
};

const Cubes = () => {
  // Helper to create unique organic geometry for each cube
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

  // ALL HOOKS MUST BE CALLED FIRST, BEFORE ANY CONDITIONAL LOGIC
  const { globalEffects, backgroundConfig, globalAnimationSpeed } = useVisualStore();
  const cubes = useVisualStore(state => state.geometric.cubes);
  const cubesCount = useVisualStore(state => state.geometric.cubes.count);
  const cubesColor = useVisualStore(state => state.geometric.cubes.color);
  const cubesSize = useVisualStore(state => state.geometric.cubes.size);
  const { shapeGlow } = globalEffects;
  
  const groupRef = useRef<THREE.Group>(null);
  const [positions, setPositions] = useState<THREE.Vector3[]>([]);
  const renderKey = useMemo(() => `cubes-${cubesCount}-${Date.now()}`, [cubesCount]);
  const pulseTimeRef = useRef(0);

  // Get layer configuration for background mode
  const layerConfig = backgroundConfig.enabled ? 
    backgroundConfig.artisticLayout?.layers?.nearBackground : null;
  const layerZ = layerConfig?.zPosition || 0;
  const layerOpacity = layerConfig?.opacity || 1.0;

  // Generate positions using useMemo to ensure they're available before render
  const generatedPositions = useMemo(() => {
    const newPositions: THREE.Vector3[] = [];
    const safeCount = isNaN(cubesCount) || cubesCount < 0 ? 0 : cubesCount;
    for (let i = 0; i < safeCount; i++) {
      newPositions.push(new THREE.Vector3(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 40,
      ));
    }
    return newPositions;
  }, [cubesCount, cubesSize]);

  // FIX: Memoize all geometries at once, BEFORE any conditional returns
  const geometries = useMemo(
    () => {
      const safeCount = isNaN(cubesCount) || cubesCount < 0 ? 0 : cubesCount;
      const safeSize = isNaN(cubesSize) || cubesSize <= 0 ? 1.0 : cubesSize;
      const safeOrganicness = isNaN(cubes.organicness) || cubes.organicness < 0 ? 0 : cubes.organicness;
      
      return Array.from({ length: safeCount }, () => 
        createOrganicCubeGeometry(safeSize, safeOrganicness)
      );
    },
    [cubesCount, cubesSize, cubes.organicness]
  );

  // Update positions state when generated positions change
  useEffect(() => {
    setPositions(generatedPositions);
  }, [generatedPositions]);

  // ALWAYS call useFrame, but make it conditional inside
  useFrame((state) => {
    // Early return if conditions aren't met
    if (!groupRef.current || !cubes || cubesCount === 0) return;
    
    const time = state.clock.elapsedTime;
    const timeScale = backgroundConfig.timeScale;
    // Safety check: clamp global animation speed to prevent crashes
    const safeAnimationSpeed = Math.max(0.01, Math.min(5.0, globalAnimationSpeed));
    const scaledTime = time * timeScale * safeAnimationSpeed;
    
    // Add safety checks for globalEffects properties
    const distortion = globalEffects?.distortion;
    const waveIntensity = (distortion?.wave ?? 0) * 2;
    const rippleIntensity = (distortion?.ripple ?? 0) * 3;
    const distortionFrequency = distortion?.frequency ?? 1;
    
    // Calculate final speeds: individual cube speeds * global animation speed
    const finalRotationSpeed = cubes.rotation * safeAnimationSpeed;
    const finalMovementSpeed = cubes.speed * safeAnimationSpeed;
    
    // Animate individual cubes with separate movement and rotation speeds
    groupRef.current.children.forEach((child, i) => {
      const pos = positions[i];
      if (!pos) return;
      
      // Individual cube rotation: use rotation property for spinning
      child.rotation.x += finalRotationSpeed * 0.01;
      child.rotation.y += finalRotationSpeed * 0.015;
      
      // Base movement with individual movement speed * global animation speed
      child.position.x = pos.x + Math.sin(scaledTime + i) * 2 * finalMovementSpeed;
      child.position.y = pos.y + Math.cos(scaledTime + i * 0.5) * 1.5 * finalMovementSpeed;
      child.position.z = pos.z + Math.sin(scaledTime * 0.7 + i) * 1 * finalMovementSpeed;
      
      // Add wave distortion on top of base movement
      if (waveIntensity > 0) {
        child.position.x += Math.sin(scaledTime * distortionFrequency + i) * waveIntensity;
        child.position.z += Math.cos(scaledTime * distortionFrequency + i * 0.5) * waveIntensity;
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

  // DEBUG: Log current cube values - only log occasionally to reduce performance impact
  if (process.env.NODE_ENV === 'development' && Math.random() < 0.001) { // 0.1% chance per frame
    console.log('🎨 Cubes component - Current store values:', {
      count: cubesCount,
      size: cubesSize,
      color: cubesColor,
      speed: cubes.speed,
      rotation: cubes.rotation,
      opacity: cubes.opacity,
      organicness: cubes.organicness
    });
  }

  // Force re-render when store changes
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  useEffect(() => {
    forceUpdate();
  }, [cubesCount, cubesColor, cubesSize]);

  // NOW we can have conditional returns after all hooks are called
  if (!cubes || cubesCount === 0) {
    return null;
  }

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
        
        // Enhanced glow effect with better visibility
        const glowColor = shapeGlow?.useObjectColor ? cubesColor : (shapeGlow?.customColor || cubesColor);
        const glowIntensity = shapeGlow?.enabled ? shapeGlow?.intensity : 0;
        
        // Create material for this cube with enhanced glow
        const material = new THREE.MeshStandardMaterial({
          color: cubesColor,
          emissive: new THREE.Color(glowColor),
          emissiveIntensity: glowIntensity * 2.0, // Much stronger glow
          transparent: true,
          opacity: cubes.opacity, // Use actual cube opacity instead of layerOpacity
          // Add additive blending for more vibrant glow
          blending: glowIntensity > 0 ? THREE.AdditiveBlending : THREE.NormalBlending,
          // Increase metalness and roughness for better glow visibility
          metalness: glowIntensity > 0 ? 0.8 : 0.0,
          roughness: glowIntensity > 0 ? 0.2 : 0.5,
        });
        
        return (
          <TrailObject 
            key={`cube-${i}-${cubesCount}`} 
            id={`cube-${i}`}
            color={new THREE.Color(cubesColor)}
            size={cubesSize}
            velocityThreshold={0.05}
            geometry={geometry}
            material={material}
            trailType='cubeTrails'
          >
            <group position={pos}>
              <mesh geometry={geometry} material={material} />
              
              {/* Add pulsing glow effect when enabled */}
              {shapeGlow?.enabled && shapeGlow?.pulsing && (
                <mesh geometry={geometry} position={[0, 0, 0]}>
                  <meshBasicMaterial
                    color={glowColor}
                    transparent={true}
                    opacity={glowIntensity * 0.3}
                    blending={THREE.AdditiveBlending}
                    side={THREE.BackSide}
                  />
                </mesh>
              )}
            </group>
          </TrailObject>
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
    
    const geometry = new THREE.TorusGeometry(safeSize, safeSize * 0.3, 8, 16);
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

  // ALL HOOKS MUST BE CALLED FIRST, BEFORE ANY CONDITIONAL LOGIC
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
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 40,
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

  // ALWAYS call useFrame, but make it conditional inside
  useFrame((state) => {
    // Early return if conditions aren't met
    if (!groupRef.current || !toruses || toruses.count === 0) return;
    
    const time = state.clock.elapsedTime;
    const timeScale = backgroundConfig.timeScale;
    // Safety check: clamp global animation speed to prevent crashes
    const safeAnimationSpeed = Math.max(0.01, Math.min(5.0, globalAnimationSpeed));
    const scaledTime = time * timeScale * safeAnimationSpeed;
    
    // Add safety checks for globalEffects properties
    const distortion = globalEffects?.distortion;
    const waveIntensity = (distortion?.wave ?? 0) * 2;
    const rippleIntensity = (distortion?.ripple ?? 0) * 3;
    const distortionFrequency = distortion?.frequency ?? 1;
    
    // Calculate final rotation speed: individual torus rotation * global animation speed
    const finalRotationSpeed = toruses.speed * safeAnimationSpeed;
    
    // Rotate the entire group with individual rotation speed * global animation speed
    groupRef.current.rotation.y += finalRotationSpeed * 0.01 * timeScale;
    
    // Animate individual toruses with individual rotation speed * global animation speed
    groupRef.current.children.forEach((child, i) => {
      const pos = positions[i];
      if (!pos) return;
      
      // Base movement with individual rotation speed * global animation speed
      child.position.y = pos.y + Math.sin(scaledTime + i) * 1.5 * finalRotationSpeed;
      
      // Add wave distortion
      if (waveIntensity > 0) {
        child.position.x = pos.x + Math.sin(scaledTime * distortionFrequency + i) * waveIntensity;
        child.position.z = pos.z + Math.cos(scaledTime * distortionFrequency + i * 0.5) * waveIntensity;
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

  // NOW we can have conditional returns after all hooks are called
  if (!toruses || toruses.count === 0) {
    return null;
  }

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
        
        // Enhanced glow effect with better visibility
        const glowColor = shapeGlow?.useObjectColor ? toruses.color : (shapeGlow?.customColor || toruses.color);
        const glowIntensity = shapeGlow?.enabled ? shapeGlow?.intensity : 0;
        
        // Create material for this torus with enhanced glow
        const material = new THREE.MeshStandardMaterial({
          color: toruses.color,
          emissive: new THREE.Color(glowColor),
          emissiveIntensity: glowIntensity * 2.0, // Much stronger glow
          transparent: true,
          opacity: toruses.opacity, // Use actual torus opacity instead of layerOpacity
          // Add additive blending for more vibrant glow
          blending: glowIntensity > 0 ? THREE.AdditiveBlending : THREE.NormalBlending,
          // Increase metalness and roughness for better glow visibility
          metalness: glowIntensity > 0 ? 0.8 : 0.0,
          roughness: glowIntensity > 0 ? 0.2 : 0.5,
        });
        
        return (
          <TrailObject 
            key={`torus-${i}-${toruses.count}`} 
            id={`torus-${i}`}
            color={new THREE.Color(toruses.color)}
            size={toruses.size * 0.3}
            velocityThreshold={0.05}
            geometry={geometry}
            material={material}
            trailType='torusTrails'
          >
            <group position={pos}>
              <mesh geometry={geometry} material={material} />
              
              {/* Add pulsing glow effect when enabled */}
              {shapeGlow?.enabled && shapeGlow?.pulsing && (
                <mesh geometry={geometry} position={[0, 0, 0]}>
                  <meshBasicMaterial
                    color={glowColor}
                    transparent={true}
                    opacity={glowIntensity * 0.3}
                    blending={THREE.AdditiveBlending}
                    side={THREE.BackSide}
                  />
                </mesh>
              )}
            </group>
          </TrailObject>
        );
      })}
    </group>
  );
};

const Particles = () => {
  const { particles, globalEffects, backgroundConfig, globalAnimationSpeed } = useVisualStore();
  const { particleInteraction, shapeGlow } = globalEffects;
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
  const safeSize = Math.max(0.1, Math.min(particles.size, 15.0));
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
    
    // Add safety checks for globalEffects properties
    const particleInteraction = globalEffects?.particleInteraction;
    const turbulence = particleInteraction?.turbulence ?? 0;
    
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
      {generatedPositions.map((pos, i) => {
        const geometry = new THREE.SphereGeometry(0.1, 8, 6);
        
        // Enhanced glow effect for particles with safety checks
        const glowColor = shapeGlow?.useObjectColor ? particles.color : (shapeGlow?.customColor || particles.color);
        const glowIntensity = shapeGlow?.enabled ? (shapeGlow?.intensity ?? 0) : 0;
        
        const material = new THREE.MeshStandardMaterial({
          color: particles.color,
          emissive: new THREE.Color(glowColor),
          emissiveIntensity: glowIntensity * 1.5, // Slightly less intense for particles
          transparent: true,
          opacity: particles.opacity, // Use actual particles opacity instead of layerOpacity
          // Add additive blending for more vibrant glow
          blending: glowIntensity > 0 ? THREE.AdditiveBlending : THREE.NormalBlending,
          // Adjust metalness and roughness for better glow visibility
          metalness: glowIntensity > 0 ? 0.6 : 0.1,
          roughness: glowIntensity > 0 ? 0.3 : 0.8
        });
        
        return (
          <TrailObject 
            key={i}
            id={`particle-${i}`}
            color={new THREE.Color(particles.color)}
            size={safeSize}
            velocityThreshold={0.05}
            trailType='particleTrails'
            geometry={geometry}
            material={material}
          >
            <group position={[pos.x, pos.y, pos.z]}>
              <mesh
                ref={(el) => {
                  if (el) particleRefs.current[i] = el;
                }}
                geometry={geometry}
                material={material}
              />
              
              {/* Add pulsing glow effect when enabled */}
              {shapeGlow?.enabled && shapeGlow?.pulsing && (
                <mesh geometry={geometry} position={[0, 0, 0]}>
                  <meshBasicMaterial
                    color={glowColor}
                    transparent={true}
                    opacity={glowIntensity * 0.2}
                    blending={THREE.AdditiveBlending}
                    side={THREE.BackSide}
                  />
                </mesh>
              )}
            </group>
          </TrailObject>
        );
      })}
    </group>
  );
};

const VolumetricFog = () => {
  const { globalEffects } = useVisualStore();
  const volumetric = globalEffects?.volumetric;

  if (!volumetric?.enabled || (volumetric?.fog ?? 0) <= 0) {
    return null;
  }

  // Calculate fog distance with better scaling
  // Fog: 0-1 range, Density: 0-2 range
  // Lower fog distance = more fog (objects fade out sooner)
  const baseDistance = 50;
  const fogMultiplier = 1 + ((volumetric?.fog ?? 0) * 4); // 1 to 5
  const densityMultiplier = 1 + ((volumetric?.density ?? 0.5) * 2); // 1 to 5
  const fogDistance = baseDistance / (fogMultiplier * densityMultiplier);
  
  return (
    <>
      <fog
        attach="fog"
        args={[volumetric?.color ?? '#4169e1', 1, fogDistance]}
        near={1}
        far={50}
      />
      {/* Light shafts removed - they don't look good */}
    </>
  );
};

const Scene = () => {
  const { effects, globalEffects, background, globalAnimationSpeed } = useVisualStore();
  
  // Performance monitoring - only in development mode
  useFrame(() => {
    if (process.env.NODE_ENV === 'development') {
      performanceMonitor.update();
    }
  });
  
  // DEBUG: Log current effects values - only log occasionally to reduce performance impact
  if (process.env.NODE_ENV === 'development' && Math.random() < 0.001) { // 0.1% chance per frame
    console.log('🎨 Scene component - Current store values:', {
      effects: effects,
      globalEffects: {
        atmosphericBlur: globalEffects?.atmosphericBlur,
        volumetric: globalEffects?.volumetric,
        distortion: globalEffects?.distortion
      },
      background: background,
      globalAnimationSpeed: globalAnimationSpeed
    });
  }
  
  return (
    <>
      {/* Background */}
      <color attach="background" args={[background.color]} />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      {/* Volumetric Fog */}
      <VolumetricFog />
      
      {/* Geometric Objects */}
      <Spheres />
      <Cubes />
      <Toruses />
      <Blobs />
      
      {/* Particles */}
      <Particles />
      
      {/* Special Effects */}
      <WaveInterference />
      <Metamorphosis />
      <Fireflies />
      <LayeredSineWaves />
      
      {/* Trail System */}
      <TrailRenderer />
      <ObjectTrails />
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
  // ALL HOOKS MUST BE CALLED FIRST, BEFORE ANY CONDITIONAL LOGIC
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

  // NOW we can have conditional returns after all hooks are called
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

// NEW: Auto-pan system component for cinematic camera movement
const AutoPanSystem = () => {
  const { camera, globalAnimationSpeed, updateAutoPanAngle, updateCamera } = useVisualStore();
  const three = useThree();
  const isInitializedRef = useRef(false);
  const startPositionRef = useRef<THREE.Vector3 | null>(null);
  const startTargetRef = useRef<THREE.Vector3 | null>(null);
  const lastUpdateRef = useRef(0);
  
  useFrame((state) => {
    if (!camera.autoPan.enabled || !three.camera) {
      // Reset initialization when auto-pan is disabled
      isInitializedRef.current = false;
      startPositionRef.current = null;
      startTargetRef.current = null;
      return;
    }
    
    const time = state.clock.elapsedTime;
    const { speed, radius, height, easing, currentAngle } = camera.autoPan;
    
    // PERFORMANCE OPTIMIZATION: Increase throttle to every 4 frames to reduce performance impact
    if (Math.floor(time * 60) % 4 !== 0) {
      return;
    }
    
    // Initialize auto-pan from current camera position on first frame
    if (!isInitializedRef.current) {
      startPositionRef.current = three.camera.position.clone();
      startTargetRef.current = new THREE.Vector3(0, 0, 0); // Always look at center
      isInitializedRef.current = true;
      
      // Calculate initial angle based on current camera position
      const currentX = three.camera.position.x;
      const currentZ = three.camera.position.z;
      const initialAngle = Math.atan2(currentZ, currentX);
      
      // Update the store with the initial angle
      updateAutoPanAngle(initialAngle);
    }
    
    // Calculate new angle with slower speed for more cinematic movement
    const newAngle = currentAngle + (speed * 0.005); // Removed safeAnimationSpeed dependency
    
    // Calculate new camera position using circular motion around the center
    const newX = Math.cos(newAngle) * radius;
    const newZ = Math.sin(newAngle) * radius;
    const newY = height;
    
    // Apply easing to smooth the movement
    const currentPosition = three.camera.position;
    const targetPosition = new THREE.Vector3(newX, newY, newZ);
    
    // Smooth interpolation with easing
    currentPosition.lerp(targetPosition, easing);
    
    // Always look at the center (0, 0, 0)
    three.camera.lookAt(0, 0, 0);
    
    // PERFORMANCE OPTIMIZATION: Only update store every 8 frames to reduce store update frequency
    if (Math.floor(time * 60) % 8 === 0) {
      updateAutoPanAngle(newAngle);
    }
  });
  
  return null;
};

// Auto-pan indicator component with speed selector
const AutoPanIndicator = ({ showUI }: { showUI: boolean }) => {
  // ALL HOOKS MUST BE CALLED FIRST, BEFORE ANY CONDITIONAL LOGIC
  const { camera, updateCamera } = useVisualStore();

  // NOW we can have conditional returns after all hooks are called
  if (!camera.autoPan.enabled || !showUI) return null;

  const speedOptions = [
    { label: '1x', value: 0.15 },
    { label: '2x', value: 0.30 },
    { label: '4x', value: 0.60 }
  ];

  const currentSpeed = camera.autoPan.speed;
  const currentSpeedLabel = speedOptions.find(option => 
    Math.abs(option.value - currentSpeed) < 0.01
  )?.label || '1x';

  const handleSpeedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSpeed = parseFloat(event.target.value);
    updateCamera({
      autoPan: {
        ...camera.autoPan,
        speed: newSpeed
      }
    });
  };
  
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'rgba(37, 99, 235, 0.3)',
      color: 'rgba(255, 255, 255, 0.7)',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: 'normal',
      zIndex: 10000,
      border: '1px solid rgba(37, 99, 235, 0.4)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      opacity: 0.6,
      transition: 'opacity 0.3s ease'
    }}>
      <div style={{
        width: '4px',
        height: '4px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        animation: 'pulse 2s infinite'
      }} />
      <span>Auto Pan</span>
      <select
        value={currentSpeed}
        onChange={handleSpeedChange}
        style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '4px',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '10px',
          padding: '2px 4px',
          cursor: 'pointer',
          outline: 'none',
          minWidth: '35px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.parentElement!.style.opacity = '0.9';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.parentElement!.style.opacity = '0.6';
        }}
      >
        {speedOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const EnhancedVisualCanvas = ({ showUI = false }: { showUI?: boolean }) => {
  const visualStore = useVisualStore();
  const [error, setError] = useState<string | null>(null);
  const [isWebGLOptimized, setIsWebGLOptimized] = useState(false);
  const [performanceMode, setPerformanceMode] = useState<'high' | 'medium' | 'low'>('high');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPerformanceCheck = useRef(0);
  const frameCountRef = useRef(0);
  const lastFpsCheck = useRef(0);
  const fpsHistory = useRef<number[]>([]);
  const maxFpsHistory = 60;

  // Memory management integration
  useEffect(() => {
    // Register cleanup callbacks
    const cleanupTrails = () => {
      if (trailManager) {
        trailManager.clear();
      }
    };
    
    const cleanupGeometries = () => {
      // Force garbage collection of unused geometries
      if (window.gc) {
        window.gc();
      }
    };
    
    memoryManager.registerCleanup(cleanupTrails);
    memoryManager.registerCleanup(cleanupGeometries);
    
    // Start memory monitoring
    memoryManager.startMonitoring();
    
    return () => {
      memoryManager.stopMonitoring();
      cleanupTrails();
      cleanupGeometries();
    };
  }, []);
  
  // Add safety check for store initialization
  if (!visualStore) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-lg">Initializing Store...</div>
        </div>
      </div>
    );
  }
  
  const { globalEffects, effects, camera, backgroundConfig, ui, globalBlendMode } = visualStore || {};
  
  // Add safety checks for potentially undefined properties
  const chromatic = globalEffects?.chromatic || {
    enabled: false,
    aberration: 0,
    aberrationColors: { red: '#ff0000', green: '#00ff00', blue: '#0000ff' },
    rainbow: { enabled: false, intensity: 0, speed: 1, rotation: 0, blendMode: 'normal', colors: [], opacity: 0 },
    prism: 0
  };
  const volumetric = globalEffects?.volumetric || {
    enabled: false,
    fog: 0,
    lightShafts: 0,
    density: 0,
    color: '#ffffff'
  };
  const atmosphericBlur = globalEffects?.atmosphericBlur || {
    enabled: false,
    intensity: 0,
    layers: 1
  };
  const colorBlending = globalEffects?.colorBlending || {
    enabled: false,
    mode: 'screen',
    intensity: 0
  };
  const distortion = globalEffects?.distortion || {
    enabled: false,
    wave: 0,
    ripple: 0,
    noise: 0,
    frequency: 1
  };
  
  // Add safety checks for other properties
  const safeEffects = effects || {
    brightness: 1,
    contrast: 1,
    saturation: 1,
    glow: 0,
    vignette: 0
  };
  
  // Use actual camera state from store, with proper fallback for depthOfField
  const safeCamera = {
    ...camera,
    depthOfField: camera?.depthOfField || { enabled: false, focusDistance: 10, focalLength: 50, bokehScale: 1, blur: 0.5 }
  };
  
  const safeBackgroundConfig = backgroundConfig || {
    enabled: false,
    timeScale: 1
  };
  
  const safeUI = ui || {
    cameraPositioningMode: false
  };
  
  const safeGlobalBlendMode = globalBlendMode || {
    mode: 'normal',
    opacity: 0
  };
  
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
      if (event.key === 'Escape' && safeUI.cameraPositioningMode) {
        visualStore.setCameraPositioningMode(false);
      }
    };

    if (safeUI.cameraPositioningMode) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [safeUI.cameraPositioningMode]);

  // Create depth of field layer - MOVED INSIDE COMPONENT
  const depthOfFieldLayer = useMemo(() => {
    if (!safeCamera.depthOfField?.enabled) {
      return null;
    }

    const { focusDistance, focalLength, bokehScale, blur } = safeCamera.depthOfField;
    
    // Debug logging to verify values are updating - only log occasionally to reduce performance impact
    if (process.env.NODE_ENV === 'development' && Math.random() < 0.001) { // 0.1% chance per frame
      console.log('🎯 Depth of Field Update:', { focusDistance, focalLength, bokehScale, blur });
    }
    
    // Calculate blur intensity based on depth of field settings
    const blurIntensity = blur * bokehScale * 20; // Increased from 10 to 20 for more visibility
    const focusRange = focalLength * 0.5; // Increased from 0.3 to 0.5 for larger focus range
    
    // Create multiple layers for more dramatic effect
    return (
      <>
        {/* Primary depth of field layer */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'transparent',
          backdropFilter: `blur(${blurIntensity}px)`,
          opacity: 0.95, // Increased from 0.8 to 0.95 for more visibility
          pointerEvents: 'none',
          zIndex: 5,
          // Create a radial gradient that simulates depth of field
          mask: `radial-gradient(circle at center, 
            transparent ${Math.max(5, 100 - focusDistance * 4)}%, 
            rgba(0, 0, 0, 0.95) ${Math.min(100, 100 - focusDistance * 4 + focusRange)}%
          )`,
          WebkitMask: `radial-gradient(circle at center, 
            transparent ${Math.max(5, 100 - focusDistance * 4)}%, 
            rgba(0, 0, 0, 0.95) ${Math.min(100, 100 - focusDistance * 4 + focusRange)}%
          )`
        }} />
        
        {/* Secondary bokeh layer for enhanced effect */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'transparent',
          backdropFilter: `blur(${blurIntensity * 0.5}px)`,
          opacity: 0.7, // Increased from 0.4 to 0.7 for more visibility
          pointerEvents: 'none',
          zIndex: 6,
          mixBlendMode: 'overlay',
          mask: `radial-gradient(circle at center, 
            transparent ${Math.max(10, 100 - focusDistance * 3)}%, 
            rgba(0, 0, 0, 0.7) ${Math.min(100, 100 - focusDistance * 3 + focusRange * 1.5)}%
          )`,
          WebkitMask: `radial-gradient(circle at center, 
            transparent ${Math.max(10, 100 - focusDistance * 3)}%, 
            rgba(0, 0, 0, 0.7) ${Math.min(100, 100 - focusDistance * 3 + focusRange * 1.5)}%
          )`
        }} />
      </>
    );
  }, [safeCamera.depthOfField]);

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
    if (safeEffects.vignette <= 0) {
      return null;
    }
    
    const gradientStart = Math.max(20, 100 - (safeEffects.vignette * 60));
    const gradientEnd = 100;
    const opacity = Math.min(1, safeEffects.vignette * 1.5);
    
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
  }, [safeEffects.vignette]);

  // Create bloom effect using CSS layers
  const bloomLayer = useMemo(() => {
    const bloom = GLOBAL_DEFAULTS?.visual?.bloom;
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
  }, [GLOBAL_DEFAULTS?.visual?.bloom]);

  // Global blend mode overlay - FIXED IMPLEMENTATION
  const blendModeOverlay = useMemo(() => {
    if (!safeGlobalBlendMode || safeGlobalBlendMode.mode === 'normal' || safeGlobalBlendMode.opacity <= 0) {
      return null;
    }
    
    // Create a colored overlay for blend modes
    let overlayColor = 'white';
    if (safeGlobalBlendMode.mode === 'multiply') {
      overlayColor = '#808080'; // Gray for multiply
    } else if (safeGlobalBlendMode.mode === 'screen') {
      overlayColor = '#404040'; // Dark gray for screen
    } else if (safeGlobalBlendMode.mode === 'overlay') {
      overlayColor = '#606060'; // Medium gray for overlay
    } else if (safeGlobalBlendMode.mode === 'color-dodge') {
      overlayColor = '#202020'; // Very dark for color dodge
    } else if (safeGlobalBlendMode.mode === 'color-burn') {
      overlayColor = '#a0a0a0'; // Light gray for color burn
    }
    
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          background: overlayColor,
          mixBlendMode: safeGlobalBlendMode.mode as any,
          opacity: safeGlobalBlendMode.opacity,
          transition: 'opacity 0.3s',
        }}
      />
    );
  }, [safeGlobalBlendMode]);

  // Optimize Canvas style calculation
  const canvasStyle: React.CSSProperties = useMemo(() => {
    const filters = [];
    
    // Add brightness filter (should always work)
    if (safeEffects.brightness !== 1) {
      filters.push(`brightness(${safeEffects.brightness})`);
    }
    
    // Add contrast filter
    if (safeEffects.contrast !== 1) {
      filters.push(`contrast(${safeEffects.contrast})`);
    }
    
    // Add saturation filter
    if (safeEffects.saturation !== 1) {
      filters.push(`saturate(${safeEffects.saturation})`);
    }
    
    // Add glow filter
    if (safeEffects.glow > 0) {
      // Glow effect using drop-shadow filter
      const glowIntensity = safeEffects.glow * 2; // Scale up for visibility
      filters.push(`drop-shadow(0 0 ${glowIntensity}px rgba(255, 255, 255, ${safeEffects.glow * 0.5}))`);
    }
    
    // Add atmospheric blur filter
    if (atmosphericBlur.enabled) {
      filters.push(`blur(${atmosphericBlur.intensity * 0.8}px)`);
    }
    
    // Add chromatic prism filter
    if (chromatic.enabled && chromatic.prism > 0) {
      filters.push(`saturate(${1 + chromatic.prism * 0.3})`);
    }
    
    // Note: Distortion effects are now only applied at the object level, not canvas level
    // This prevents the entire viewport from being twisted
    
    return {
      filter: filters.length > 0 ? filters.join(' ') : undefined,
      mixBlendMode: colorBlending.enabled ? colorBlending.mode : 'normal',
      opacity: colorBlending.enabled ? 0.5 + (colorBlending.intensity * 0.5) : 1,
      willChange: 'filter, opacity',
      isolation: 'isolate'
    };
  }, [safeEffects.brightness, safeEffects.contrast, safeEffects.saturation, safeEffects.glow, atmosphericBlur.enabled, atmosphericBlur.intensity, chromatic.enabled, chromatic.prism, colorBlending.enabled, colorBlending.mode, colorBlending.intensity]);
  
  if (!canvasReady) {
    return <div>Initializing Canvas...</div>;
  }

  // Calculate canvas style with debug logging
  const canvasStyleWithBackground = {
    ...canvasStyle,
    // Background-specific styles are now applied directly in Canvas style prop
  };

  try {
    return (
      <CanvasErrorBoundary>
        <WebGLContextManager>
          <div className={styles.canvasContainer}>
            {aberrationLayers}
            {rainbowLayer}
            {fogLayer}
            {atmosphericBlurLayers}
            {depthOfFieldLayer}
            {postProcessingOverlay}
            {bloomLayer}
            {blendModeOverlay}
            
            {/* Company Logo Overlay */}
            <CompanyLogo />
            
            {/* Camera Positioning Mode Indicator */}
            {safeUI.cameraPositioningMode && !safeCamera.autoPan?.enabled && (
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
            
            {/* Auto Pan Indicator */}
            <AutoPanIndicator showUI={showUI} />
            
            <Canvas
              camera={{ 
                position: [0, 0, 25], // Default position - CameraSync will override this
                fov: 60, // Default FOV - CameraSync will override this
                near: 0.1,
                far: 2000 // Keep the increased far clipping for the extreme distance
              }}
              onCreated={({ gl }) => {
                // Set WebGL context attributes for better performance
                gl.setClearColor(0x000000, 0);
                gl.autoClear = true; // Enable auto-clear to prevent warnings
                gl.autoClearColor = true;
                gl.autoClearDepth = true;
                gl.autoClearStencil = false;
                
                // Add a longer delay to ensure WebGL context is fully initialized
                // React Three Fiber needs more time to properly set up the context
                // Retry mechanism for WebGL optimization
                let attempts = 0;
                const maxAttempts = 3;
                
                const tryOptimizeWebGL = () => {
                  attempts++;
                  try {
                    const optimizationResult = performanceOptimizer.optimizeWebGLContext(gl);
                    if (optimizationResult) {
                      return; // Success, stop retrying
                    } else {
                      if (process.env.NODE_ENV === 'development') {
                        console.warn(`⚠️ WebGL context optimization attempt ${attempts} failed`);
                      }
                    }
                  } catch (error) {
                    if (process.env.NODE_ENV === 'development') {
                      console.warn(`⚠️ Error during WebGL optimization attempt ${attempts}:`, error);
                    }
                  }
                  
                  // Retry with exponential backoff if we haven't reached max attempts
                  if (attempts < maxAttempts) {
                    const delay = Math.pow(2, attempts) * 500; // 500ms, 1000ms, 2000ms
                    setTimeout(tryOptimizeWebGL, delay);
                  } else {
                    if (process.env.NODE_ENV === 'development') {
                      console.warn('⚠️ WebGL context optimization failed after all attempts, using default settings');
                    }
                  }
                };
                
                // Start the optimization process with initial delay
                setTimeout(tryOptimizeWebGL, 500);
                
                const canvas = gl.domElement;
                canvas.addEventListener('webglcontextlost', handleWebGLContextLost);
                canvas.addEventListener('webglcontextrestored', handleWebGLContextRestored);
                
                // Add error handling for WebGL errors
                const handleWebGLError = (event: Event) => {
                  if (process.env.NODE_ENV === 'development') {
                    console.warn('WebGL error detected:', event);
                  }
                };
                
                canvas.addEventListener('webglcontextlost', handleWebGLError);
              }}
              onError={(error) => {
                if (process.env.NODE_ENV === 'development') {
                  console.error('Canvas error:', error);
                }
                setCanvasReady(false);
              }}
              style={{
                ...canvasStyleWithBackground,
                ...(safeBackgroundConfig.enabled && {
                  position: 'fixed' as const,
                  top: 0,
                  left: 0,
                  zIndex: -1,
                  filter: safeBackgroundConfig.mode === 'modalFriendly' ? 'saturate(1.2) contrast(1.1)' : 'none',
                  pointerEvents: safeBackgroundConfig.mode === 'modalFriendly' ? 'none' as const : 'auto' as const,
                  border: safeBackgroundConfig.camera?.fixed ? '4px solid rgba(255, 255, 0, 0.3)' : 'none'
                })
              }}
            >
              <CameraSync />
              <CameraControls />
              <AutoPanSystem />
              <Scene />
            </Canvas>
          </div>
        </WebGLContextManager>
      </CanvasErrorBoundary>
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error rendering EnhancedVisualCanvas:', error);
    }
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Canvas Error</div>
          <div className="text-gray-400 text-sm">Please refresh the page</div>
        </div>
      </div>
    );
  }
};

export default EnhancedVisualCanvas;