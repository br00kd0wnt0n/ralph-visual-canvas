import React, { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVisualStore } from '../store/visualStore';
import { constrainToViewport } from '../utils/backgroundLayout';
import * as THREE from 'three';
import { Cubes } from './Cubes';
import { Spheres } from './Spheres';
import { Toruses } from './Toruses';
import { Particles } from './Particles';
import { TrailObject } from './TrailObject';

// Resource manager for shared geometries and materials
class ResourceManager {
  private static instance: ResourceManager;
  private geometryCache = new Map<string, THREE.BufferGeometry>();
  private materialCache = new Map<string, THREE.Material>();

  static getInstance(): ResourceManager {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }
    return ResourceManager.instance;
  }

  // Create organic geometry matching your existing pattern
  getOrganicGeometry(type: 'cube' | 'sphere' | 'torus', size: number, organicness: number): THREE.BufferGeometry {
    const key = `${type}-${size.toFixed(2)}-${organicness.toFixed(2)}`;
    
    if (!this.geometryCache.has(key)) {
      let geometry: THREE.BufferGeometry | undefined;
      
      // Match your existing geometry creation
      switch (type) {
        case 'cube':
          geometry = new THREE.BoxGeometry(size, size, size);
          break;
        case 'sphere':
          geometry = new THREE.SphereGeometry(size, 16, 16);
          break;
        case 'torus':
          geometry = new THREE.TorusGeometry(size, size * 0.3, 8, 16);
          break;
        default:
          throw new Error(`Unknown geometry type: ${type}`);
      }
      
      if (!geometry) {
        throw new Error(`Failed to create geometry for type: ${type}`);
      }
      
      // Apply organicness exactly like your existing code
      if (organicness > 0) {
        const positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          const noise = (Math.random() - 0.5) * organicness;
          positions[i] += noise;
          positions[i + 1] += noise;
          positions[i + 2] += noise;
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
      }
      
      this.geometryCache.set(key, geometry);
    }
    
    return this.geometryCache.get(key)!;
  }

  // Material manager matching your existing glow system
  getMaterial(
    color: string, 
    opacity: number, 
    glow?: { enabled: boolean; intensity: number; customColor?: string; useObjectColor: boolean }
  ): THREE.Material {
    const glowColor = glow?.enabled ? (glow.useObjectColor ? color : glow.customColor || color) : color;
    const glowIntensity = glow?.enabled ? glow.intensity : 0;
    const key = `${color}-${opacity.toFixed(2)}-${glowColor}-${glowIntensity.toFixed(2)}`;
    
    if (!this.materialCache.has(key)) {
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        emissive: new THREE.Color(glowColor),
        emissiveIntensity: glowIntensity * 2.0, // Match your existing glow intensity
        transparent: opacity < 1,
        opacity,
        blending: glowIntensity > 0 ? THREE.AdditiveBlending : THREE.NormalBlending,
        metalness: glowIntensity > 0 ? 0.8 : 0.0,
        roughness: glowIntensity > 0 ? 0.2 : 0.5,
      });
      
      this.materialCache.set(key, material);
    }
    
    return this.materialCache.get(key)!;
  }

  dispose() {
    this.geometryCache.forEach(geometry => geometry.dispose());
    this.materialCache.forEach(material => material.dispose());
    this.geometryCache.clear();
    this.materialCache.clear();
  }
}

// Utility: Seeded random for stable positions
function mulberry32(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function useStableSeeds(count: number) {
  const seedsRef = useRef<number[]>([]);
  if (seedsRef.current.length !== count) {
    seedsRef.current = Array.from({ length: count }, (_, i) => Math.floor(Math.random() * 1000000) + i * 1000);
  }
  return seedsRef.current;
}

const OrganicShapeList = ({ type }: { type: 'cubes' | 'spheres' | 'toruses' }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { geometric, globalEffects, backgroundConfig, globalAnimationSpeed } = useVisualStore();
  const shape = geometric[type];
  const { shapeGlow } = globalEffects;

  // Layer config
  const layerConfig = backgroundConfig.enabled ? backgroundConfig.artisticLayout?.layers?.nearBackground : null;
  const layerZ = layerConfig?.zPosition || 0;
  const movementSpeed = 1.0;

  // Safety checks
  const safeCount = isNaN(shape.count) || shape.count < 0 ? 0 : shape.count;
  const safeSize = isNaN(shape.size) || shape.size <= 0 ? 1.0 : shape.size;
  const safeOrganicness = isNaN(shape.organicness) || shape.organicness < 0 ? 0 : shape.organicness;
  const safeOpacity = isNaN(shape.opacity) || shape.opacity < 0 ? 1.0 : shape.opacity;
  const safeSpeed = isNaN(shape.speed) || shape.speed < 0 ? 1.0 : shape.speed;
  const safeRotation = isNaN((shape as any).rotation) ? 1.0 : (shape as any).rotation;
  const movementPattern = shape.movementPattern || 'orbit';
  const safeDistance = isNaN(shape.distance) || shape.distance < 0 ? 2.0 : shape.distance;

  if (!shape || safeCount === 0) return null;

  // Stable seeds and positions
  const seeds = useStableSeeds(safeCount);
  const positionsRef = useRef<[number, number, number][]>([]);
  if (positionsRef.current.length !== safeCount) {
    positionsRef.current = seeds.map((seed) => {
      const rand = mulberry32(seed + 9999);
      return [
        (rand() - 0.5) * 50,
        (rand() - 0.5) * 30,
        (rand() - 0.5) * 40
      ];
    });
  }

  // Shared material
  const glowColor = shapeGlow.useObjectColor ? shape.color : (shapeGlow.customColor || shape.color);
  const glowIntensity = shapeGlow.enabled ? shapeGlow.intensity : 0;
  const sharedMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: shape.color,
    emissive: new THREE.Color(glowColor),
    emissiveIntensity: glowIntensity * 2.0,
    transparent: true,
    opacity: shape.opacity,
    blending: glowIntensity > 0 ? THREE.AdditiveBlending : THREE.NormalBlending,
    metalness: glowIntensity > 0 ? 0.8 : 0.1,
    roughness: glowIntensity > 0 ? 0.2 : 0.8
  }), [shape.color, glowColor, glowIntensity, shape.opacity]);

  // Individual organic geometries
  const geometries = useMemo(() => {
    return Array.from({ length: safeCount }, () => {
      let geometry: THREE.BufferGeometry;
      if (type === 'cubes') {
        geometry = new THREE.BoxGeometry(safeSize, safeSize, safeSize);
      } else if (type === 'spheres') {
        geometry = new THREE.SphereGeometry(safeSize, 16, 16);
      } else {
        geometry = new THREE.TorusGeometry(safeSize, safeSize * 0.3, 8, 16);
      }
      if (safeOrganicness > 0) {
        const positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          const noise = (Math.random() - 0.5) * safeOrganicness;
          positions[i] += noise;
          positions[i + 1] += noise;
          positions[i + 2] += noise;
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
      }
      return geometry;
    });
  }, [safeCount, safeSize, safeOrganicness, type]);

  // Frame counter for constraint optimization
  const frameCountRef = useRef(0);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    const safeAnimationSpeed = Math.max(0.01, Math.min(5.0, globalAnimationSpeed));
    const scaledTime = time * safeAnimationSpeed;
    const waveIntensity = globalEffects.distortion.wave * 2;
    const rippleIntensity = globalEffects.distortion.ripple * 3;
    const finalSpeed = safeSpeed * movementSpeed * safeAnimationSpeed;
    const finalRotation = safeRotation * safeAnimationSpeed;
    frameCountRef.current++;
    const shouldApplyConstraints = backgroundConfig.enabled && frameCountRef.current % 3 === 0;
    groupRef.current.children.forEach((child, i) => {
      const trailObjectGroup = child as THREE.Group;
      const mesh = trailObjectGroup.children[0] as THREE.Mesh;
      const pos = positionsRef.current[i];
      if (!pos) return;
      let x = pos[0];
      let y = pos[1];
      let z = pos[2];
      if (movementPattern === 'orbit') {
        x = pos[0] + Math.sin(scaledTime + i) * 2 * finalSpeed * safeDistance;
        y = pos[1] + Math.cos(scaledTime + i * 0.5) * 1.5 * finalSpeed * safeDistance;
        z = pos[2] + Math.sin(scaledTime * 0.7 + i) * 1 * finalSpeed * safeDistance;
      } else if (movementPattern === 'verticalSine') {
        y = pos[1] + Math.sin(scaledTime + i) * 2 * finalSpeed * safeDistance;
      } else if (movementPattern === 'random') {
        x = pos[0] + (Math.random() - 0.5) * 0.5 * finalSpeed * safeDistance;
        y = pos[1] + (Math.random() - 0.5) * 0.5 * finalSpeed * safeDistance;
        z = pos[2] + (Math.random() - 0.5) * 0.5 * finalSpeed * safeDistance;
      }
      if (waveIntensity > 0) {
        x += Math.sin(scaledTime * globalEffects.distortion.frequency + i) * waveIntensity;
        z += Math.cos(scaledTime * globalEffects.distortion.frequency + i * 0.5) * waveIntensity;
      }
      if (rippleIntensity > 0) {
        const distance = Math.sqrt(x ** 2 + z ** 2);
        y += Math.sin(scaledTime * 2 + distance * 0.5) * rippleIntensity;
      }
      if (shouldApplyConstraints) {
        const constrained = constrainToViewport({ x, y, z }, layerZ);
        trailObjectGroup.position.set(constrained.x, constrained.y, constrained.z);
      } else {
        trailObjectGroup.position.set(x, y, z);
      }
      // Rotation
      mesh.rotation.x += safeRotation * 0.01;
      mesh.rotation.y += safeRotation * 0.015;
    });
  });

  return (
    <group ref={groupRef} key={`${type}-${safeCount}`}> 
      {positionsRef.current.map((position, i) => (
        <TrailObject
          key={`${type}-${i}-${safeCount}`}
          id={`${type}-${i}`}
          color={new THREE.Color(shape.color)}
          size={safeSize}
          velocityThreshold={0.05}
          trailType={
            type === 'cubes' ? 'cubeTrails' :
            type === 'spheres' ? 'sphereTrails' :
            'torusTrails'
          }
          geometry={geometries[i]}
          material={sharedMaterial}
        >
          <group position={position}>
            <mesh geometry={geometries[i]} material={sharedMaterial} />
          </group>
        </TrailObject>
      ))}
    </group>
  );
};

// Optimized particles component
const OptimizedParticles: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { particles, globalEffects, backgroundConfig, globalAnimationSpeed } = useVisualStore();
  const resourceManager = ResourceManager.getInstance();
  
  // Apply your existing safety checks
  const safeCount = Math.max(0, Math.min(particles.count, 2000));
  const safeSize = Math.max(0.1, Math.min(particles.size, 5.0));
  const safeSpeed = Math.max(0.1, Math.min(particles.speed, 10.0));
  const safeSpread = Math.max(10, Math.min(particles.spread, 100));
  const safeOpacity = Math.max(0.1, Math.min(particles.opacity, 1.0));
  const safeAnimationSpeed = Math.max(0.01, Math.min(globalAnimationSpeed, 5));
  const movementPattern = particles.movementPattern || 'random';
  const safeDistance = isNaN(particles.distance) || particles.distance < 0 ? 1.5 : particles.distance;

  // Create shared geometry and material
  const geometry = useMemo(() => new THREE.SphereGeometry(0.1, 8, 6), []);
  
  const material = useMemo(() => {
    const glowColor = globalEffects.shapeGlow.useObjectColor ? particles.color : (globalEffects.shapeGlow.customColor || particles.color);
    const glowIntensity = globalEffects.shapeGlow.enabled ? globalEffects.shapeGlow.intensity : 0;
    
    return new THREE.MeshStandardMaterial({
      color: particles.color,
      emissive: new THREE.Color(glowColor),
      emissiveIntensity: glowIntensity * 1.5,
      transparent: true,
      opacity: safeOpacity,
      blending: glowIntensity > 0 ? THREE.AdditiveBlending : THREE.NormalBlending,
      metalness: glowIntensity > 0 ? 0.6 : 0.1,
      roughness: glowIntensity > 0 ? 0.3 : 0.8
    });
  }, [particles.color, safeOpacity, globalEffects.shapeGlow]);

  // Generate particle positions
  const instanceData = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    
    for (let i = 0; i < safeCount; i++) {
      positions.push(new THREE.Vector3(
        (Math.random() - 0.5) * safeSpread * 2,
        (Math.random() - 0.5) * safeSpread * 1.5,
        (Math.random() - 0.5) * safeSpread * 2,
      ));
    }
    
    return { positions };
  }, [safeCount, safeSpread]);

  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const frameCountRef = useRef(0);

  useFrame((state) => {
    if (!meshRef.current || safeCount === 0) return;
    
    const time = state.clock.elapsedTime;
    const timeScale = backgroundConfig.timeScale || 1;
    const scaledTime = time * timeScale * safeAnimationSpeed;
    const turbulence = globalEffects.particleInteraction?.turbulence || 0;
    const finalSpeed = safeSpeed * safeAnimationSpeed;
    
    // Performance optimization: apply constraints less frequently
    frameCountRef.current++;
    const shouldApplyConstraints = backgroundConfig.enabled && frameCountRef.current % 5 === 0;
    const layerZ = backgroundConfig.enabled ? 
      backgroundConfig.artisticLayout?.layers?.midBackground?.zPosition || 0 : 0;

    for (let i = 0; i < safeCount; i++) {
      const originalPos = instanceData.positions[i];
      
      let x = originalPos.x;
      let y = originalPos.y;
      let z = originalPos.z;
      if (movementPattern === 'orbit') {
        x = originalPos.x + Math.sin(scaledTime + i) * 2 * finalSpeed * safeDistance;
        y = originalPos.y + Math.cos(scaledTime + i * 0.5) * 1.5 * finalSpeed * safeDistance;
        z = originalPos.z + Math.sin(scaledTime * 0.7 + i) * 1 * finalSpeed * safeDistance;
      } else if (movementPattern === 'verticalSine') {
        y = originalPos.y + Math.sin(scaledTime + i) * 2 * finalSpeed * safeDistance;
      } else if (movementPattern === 'random') {
        x = originalPos.x + (Math.random() - 0.5) * 0.5 * finalSpeed * safeDistance;
        y = originalPos.y + (Math.random() - 0.5) * 0.5 * finalSpeed * safeDistance;
        z = originalPos.z + (Math.random() - 0.5) * 0.5 * finalSpeed * safeDistance;
      }
      if (turbulence > 0) {
        x += (Math.random() - 0.5) * turbulence * 0.1 * finalSpeed;
        y += (Math.random() - 0.5) * turbulence * 0.1 * finalSpeed;
        z += (Math.random() - 0.5) * turbulence * 0.1 * finalSpeed;
      }
      
      if (shouldApplyConstraints && backgroundConfig.enabled) {
        const constrainedPosition = constrainToViewport({ x, y, z }, layerZ);
        tempObject.position.set(constrainedPosition.x, constrainedPosition.y, constrainedPosition.z);
      } else {
        tempObject.position.set(x, y, z);
      }
      
      tempObject.scale.setScalar(safeSize);
      tempObject.rotation.set(0, 0, 0);
      
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (safeCount === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, safeCount]}
      frustumCulled={true}
    />
  );
};

// Main optimized geometric system
export const OptimizedGeometricSystem: React.FC = () => {
  const { geometric, particles, globalEffects } = useVisualStore();
  const trails = globalEffects.trails;

  return (
    <group>
      {/* Cubes */}
      {geometric.cubes.count > 0 && <OrganicShapeList type="cubes" />}
      {/* Spheres */}
      {geometric.spheres.count > 0 && <OrganicShapeList type="spheres" />}
      {/* Toruses */}
      {geometric.toruses.count > 0 && <OrganicShapeList type="toruses" />}
      {/* Particles (keep instanced for perf) */}
      {particles.count > 0 && (
        trails?.particleTrails?.enabled
          ? <Particles />
          : <OptimizedParticles />
      )}
    </group>
  );
};

// Cleanup function
export const cleanupOptimizedResources = () => {
  ResourceManager.getInstance().dispose();
}; 