import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useVisualStore } from '../store/visualStore';

// Global trail manager instance (will be shared)
let trailManager: any = null;

// Trail point with object information
interface TrailPoint {
  position: THREE.Vector3;
  timestamp: number;
  velocity: THREE.Vector3;
  scale: THREE.Vector3;
  rotation: THREE.Euler;
  geometry?: THREE.BufferGeometry;
  material?: THREE.Material;
}

interface TrailObjectData {
  id: string;
  points: TrailPoint[];
  maxPoints: number;
  fadeTime: number;
  color: THREE.Color;
  size: number;
  opacity: number;
  geometry?: THREE.BufferGeometry;
  material?: THREE.Material;
}

interface TrailMesh {
  mesh: THREE.InstancedMesh;
  material: THREE.Material;
}

class TrailManager {
  private trails: Map<string, TrailObjectData> = new Map();
  private trailMeshes: Map<string, TrailMesh> = new Map();

  addTrail(
    id: string, 
    position: THREE.Vector3, 
    velocity: THREE.Vector3, 
    color: THREE.Color, 
    size: number = 0.1,
    geometry?: THREE.BufferGeometry,
    material?: THREE.Material,
    scale: THREE.Vector3 = new THREE.Vector3(1, 1, 1),
    rotation: THREE.Euler = new THREE.Euler(),
    trailConfig?: { maxPoints: number; fadeTime: number; opacity: number; width?: number }
  ) {
    if (!this.trails.has(id)) {
      this.trails.set(id, {
        id,
        points: [],
        maxPoints: trailConfig?.maxPoints || 15,
        fadeTime: trailConfig?.fadeTime || 1.5,
        color,
        size,
        opacity: trailConfig?.opacity || 1,
        geometry,
        material
      });
    } else {
      const trail = this.trails.get(id)!;
      if (trailConfig) {
        trail.maxPoints = trailConfig.maxPoints;
        trail.fadeTime = trailConfig.fadeTime;
        trail.opacity = trailConfig.opacity;
      }
      trail.size = size;
    }

    const trail = this.trails.get(id)!;
    const now = Date.now();
    
    // Apply trail width multiplier to the size
    const trailWidth = size * (trailConfig?.width || 1.0);
    const scaledScale = scale.clone().multiplyScalar(trailWidth / Math.max(scale.x, scale.y, scale.z));
    
    trail.points.push({
      position: position.clone(),
      timestamp: now,
      velocity: velocity.clone(),
      scale: scaledScale,
      rotation: rotation.clone(),
      geometry,
      material
    });

    if (trail.points.length > trail.maxPoints) {
      trail.points.shift();
    }
  }

  updateTrails(deltaTime: number) {
    const now = Date.now();
    
    this.trails.forEach((trail) => {
      trail.points = trail.points.filter(point => 
        now - point.timestamp < trail.fadeTime * 1000
      );
    });
  }

  getTrailMeshes(): { mesh: THREE.InstancedMesh; material: THREE.Material; count: number }[] {
    const meshes: { mesh: THREE.InstancedMesh; material: THREE.Material; count: number }[] = [];
    
    this.trails.forEach((trail) => {
      if (trail.points.length === 0 || !trail.geometry) return;
      
      let trailMesh = this.trailMeshes.get(trail.id);
      
      if (!trailMesh) {
        // Create a custom shader material for per-instance opacity
        const material = new THREE.ShaderMaterial({
          uniforms: {
            baseColor: { value: trail.material && 'color' in trail.material ? trail.material.color : trail.color },
            baseOpacity: { value: trail.opacity }
          },
          vertexShader: `
            attribute float instanceOpacity;
            varying float vOpacity;
            void main() {
              vOpacity = instanceOpacity;
              vec4 worldPosition = instanceMatrix * vec4(position, 1.0);
              gl_Position = projectionMatrix * modelViewMatrix * worldPosition;
            }
          `,
          fragmentShader: `
            uniform vec3 baseColor;
            uniform float baseOpacity;
            varying float vOpacity;
            void main() {
              gl_FragColor = vec4(baseColor, vOpacity * baseOpacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        
        // Add instance opacity attribute to geometry
        const instanceOpacity = new Float32Array(trail.maxPoints);
        trail.geometry.setAttribute('instanceOpacity', new THREE.InstancedBufferAttribute(instanceOpacity, 1));
        
        const instancedMesh = new THREE.InstancedMesh(trail.geometry, material, trail.maxPoints);
        instancedMesh.frustumCulled = false;
        
        trailMesh = { mesh: instancedMesh, material };
        this.trailMeshes.set(trail.id, trailMesh);
      }
      
      const matrix = new THREE.Matrix4();
      const now = Date.now();
      const instanceOpacity = trailMesh.mesh.geometry.attributes.instanceOpacity as THREE.InstancedBufferAttribute;
      
      // Update shader material color if trail material has changed
      if (trail.material && 'color' in trail.material && (trailMesh.material as THREE.ShaderMaterial).uniforms) {
        (trailMesh.material as THREE.ShaderMaterial).uniforms.baseColor.value = trail.material.color;
      } else if ((trailMesh.material as THREE.ShaderMaterial).uniforms) {
        // Fallback to trail color if material doesn't have color property
        (trailMesh.material as THREE.ShaderMaterial).uniforms.baseColor.value = trail.color;
      }
      
      trail.points.forEach((point, index) => {
        // Calculate age-based fade (time-based)
        const age = (now - point.timestamp) / (trail.fadeTime * 1000);
        const timeAlpha = Math.max(0, 1 - age);
        
        // Calculate position-based fade (length-based)
        // Older points (lower index) should be more transparent
        const positionAlpha = (index + 1) / trail.points.length; // 0 at start, 1 at end
        
        // Combine both fade effects
        const combinedAlpha = timeAlpha * positionAlpha;
        
        // Set the opacity for this instance
        instanceOpacity.setX(index, combinedAlpha);
        
        const quaternion = new THREE.Quaternion().setFromEuler(point.rotation);
        matrix.compose(
          point.position,
          quaternion,
          point.scale
        );
        
        trailMesh.mesh.setMatrixAt(index, matrix);
      });
      
      instanceOpacity.needsUpdate = true;
      trailMesh.mesh.instanceMatrix.needsUpdate = true;
      trailMesh.mesh.count = trail.points.length;
      
      meshes.push({ mesh: trailMesh.mesh, material: trailMesh.material, count: trail.points.length });
    });
    
    return meshes;
  }

  clear() {
    this.trails.clear();
    this.trailMeshes.clear();
  }

  clearTrailsForType(trailType: string) {
    this.trails.forEach((trail, id) => {
      if (id.includes(trailType)) {
        this.trails.delete(id);
        this.trailMeshes.delete(id);
      }
    });
  }
}

// Initialize trail manager
if (!trailManager) {
  trailManager = new TrailManager();
}

export const TrailObject = ({ 
  children, 
  id, 
  color = new THREE.Color(0xff00ff), 
  size = 0.1,
  velocityThreshold = 0.05,
  geometry,
  material,
  trailType = 'sphereTrails'
}: { 
  children: React.ReactNode; 
  id: string; 
  color?: THREE.Color; 
  size?: number;
  velocityThreshold?: number;
  geometry?: THREE.BufferGeometry;
  material?: THREE.Material;
  trailType?: 'sphereTrails' | 'cubeTrails' | 'blobTrails' | 'torusTrails' | 'particleTrails';
}) => {
  const { globalEffects } = useVisualStore();
  const { trails } = globalEffects;
  const groupRef = useRef<THREE.Group>(null);
  const lastPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const lastTime = useRef<number>(Date.now());
  const lastScale = useRef<THREE.Vector3>(new THREE.Vector3(1, 1, 1));
  const lastRotation = useRef<THREE.Euler>(new THREE.Euler());
  const lastConfigHash = useRef<string>('');
  const lastTrailTime = useRef<number>(0);
  const trailThrottle = 50;
  const debugFrame = useRef(0);

  useFrame(() => {
    if (!trails?.enabled || !groupRef.current) return;
    
    const trailConfig = trails[trailType];
    if (!trailConfig?.enabled) return;
    
    const configHash = `${trailConfig?.length ?? 0}-${trailConfig?.opacity ?? 0}-${trailConfig?.width ?? 0}-${trailConfig?.fadeRate ?? 0}`;
    
    if (id === 'sphere-0' && configHash !== lastConfigHash.current) {
      console.log(`🎨 Trail config changed for ${trailType}:`, {
        enabled: trailConfig?.enabled,
        length: trailConfig?.length,
        opacity: trailConfig?.opacity,
        width: trailConfig?.width,
        fadeRate: trailConfig?.fadeRate
      });
      lastConfigHash.current = configHash;
      trailManager.clearTrailsForType('sphere');
    }
    
    // Get the group that contains the mesh (first child of TrailObject group)
    const groupChild = groupRef.current.children[0];
    if (!groupChild) return;
    
    const currentPosition = new THREE.Vector3();
    const currentScale = new THREE.Vector3();
    const currentQuaternion = new THREE.Quaternion();
    const currentRotation = new THREE.Euler();
    
    groupChild.getWorldPosition(currentPosition);
    groupChild.getWorldScale(currentScale);
    groupChild.getWorldQuaternion(currentQuaternion);
    currentRotation.setFromQuaternion(currentQuaternion);

    // Debug: log the world position for sphere-0 every 30 frames
    if (id === 'sphere-0') {
      debugFrame.current++;
      if (debugFrame.current % 30 === 0) {
        console.log(`[TrailObject DEBUG] sphere-0 world position:`, currentPosition.toArray());
      }
    }
    
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastTime.current) / 1000;
    
    if (deltaTime > 0) {
      const velocity = currentPosition.clone().sub(lastPosition.current).divideScalar(deltaTime);
      const speed = velocity.length();
      
      if (speed > velocityThreshold && (currentTime - lastTrailTime.current) > trailThrottle) {
        let trailMaterial = material;
        if (material) {
          trailMaterial = material.clone();
          // Ensure the trail material uses the object's actual color
          if ('color' in trailMaterial) {
            trailMaterial.color = color;
          }
          // Preserve emissive color for glow effects
          if ('emissive' in trailMaterial && 'emissive' in material) {
            (trailMaterial as any).emissive = (material as any).emissive.clone();
          }
          if ('emissiveIntensity' in trailMaterial && 'emissiveIntensity' in material) {
            (trailMaterial as any).emissiveIntensity = (material as any).emissiveIntensity;
          }
          // Apply trail opacity
          if ('opacity' in trailMaterial) {
            trailMaterial.opacity = trailConfig?.opacity ?? 0.5;
            trailMaterial.transparent = true;
          }
        }
        
        const fadeTime = 0.5 + ((trailConfig?.fadeRate ?? 0) * 2.5);
        
        trailManager.addTrail(
          id, 
          currentPosition, 
          velocity, 
          color, 
          size,
          geometry,
          trailMaterial,
          currentScale,
          currentRotation,
          {
            maxPoints: trailConfig?.length ?? 50,
            fadeTime: fadeTime,
            opacity: trailConfig?.opacity ?? 0.5,
            width: trailConfig?.width ?? 1.0
          }
        );
        
        if (id === 'sphere-0' && Math.random() < 0.1) {
          console.log(`🎨 Trail created for ${id}:`, {
            position: currentPosition.toArray(),
            velocity: velocity.toArray(),
            speed: speed.toFixed(3),
            scale: currentScale.toArray(),
            color: color.getHexString(),
            config: {
              length: trailConfig?.length ?? 50,
              opacity: trailConfig?.opacity ?? 0.5,
              width: trailConfig?.width ?? 1.0,
              fadeRate: trailConfig?.fadeRate ?? 0,
              fadeTime: fadeTime
            }
          });
        }
        
        lastTrailTime.current = currentTime;
      }
    }
    
    lastPosition.current.copy(currentPosition);
    lastScale.current.copy(currentScale);
    lastRotation.current.copy(currentRotation);
    lastTime.current = currentTime;
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
};

// Export the trail manager for use in other components
export { trailManager }; 