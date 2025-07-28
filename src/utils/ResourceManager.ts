import * as THREE from 'three';

// Resource tracking and disposal system
export class ResourceManager {
  private static instance: ResourceManager;
  private geometries = new Map<string, THREE.BufferGeometry>();
  private materials = new Map<string, THREE.Material>();
  private textures = new Map<string, THREE.Texture>();
  private meshes = new WeakSet<THREE.Mesh>();
  
  private constructor() {}
  
  static getInstance(): ResourceManager {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }
    return ResourceManager.instance;
  }
  
  // Track a geometry
  trackGeometry(key: string, geometry: THREE.BufferGeometry): void {
    const existing = this.geometries.get(key);
    if (existing && existing !== geometry) {
      existing.dispose();
    }
    this.geometries.set(key, geometry);
  }
  
  // Track a material
  trackMaterial(key: string, material: THREE.Material): void {
    const existing = this.materials.get(key);
    if (existing && existing !== material) {
      existing.dispose();
    }
    this.materials.set(key, material);
  }
  
  // Track a texture
  trackTexture(key: string, texture: THREE.Texture): void {
    const existing = this.textures.get(key);
    if (existing && existing !== texture) {
      existing.dispose();
    }
    this.textures.set(key, texture);
  }
  
  // Track a mesh
  trackMesh(mesh: THREE.Mesh): void {
    this.meshes.add(mesh);
  }
  
  // Get or create geometry
  getOrCreateGeometry(
    key: string, 
    factory: () => THREE.BufferGeometry
  ): THREE.BufferGeometry {
    let geometry = this.geometries.get(key);
    if (!geometry) {
      geometry = factory();
      this.trackGeometry(key, geometry);
    }
    return geometry;
  }
  
  // Get or create material
  getOrCreateMaterial(
    key: string,
    factory: () => THREE.Material
  ): THREE.Material {
    let material = this.materials.get(key);
    if (!material) {
      material = factory();
      this.trackMaterial(key, material);
    }
    return material;
  }
  
  // Dispose specific resource
  disposeGeometry(key: string): void {
    const geometry = this.geometries.get(key);
    if (geometry) {
      geometry.dispose();
      this.geometries.delete(key);
    }
  }
  
  disposeMaterial(key: string): void {
    const material = this.materials.get(key);
    if (material) {
      material.dispose();
      this.materials.delete(key);
    }
  }
  
  disposeTexture(key: string): void {
    const texture = this.textures.get(key);
    if (texture) {
      texture.dispose();
      this.textures.delete(key);
    }
  }
  
  // Dispose all resources of a type
  disposeAllGeometries(): void {
    this.geometries.forEach(geometry => geometry.dispose());
    this.geometries.clear();
  }
  
  disposeAllMaterials(): void {
    this.materials.forEach(material => material.dispose());
    this.materials.clear();
  }
  
  disposeAllTextures(): void {
    this.textures.forEach(texture => texture.dispose());
    this.textures.clear();
  }
  
  // Dispose all resources
  disposeAll(): void {
    this.disposeAllGeometries();
    this.disposeAllMaterials();
    this.disposeAllTextures();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🗑️ Disposed all tracked resources');
    }
  }
  
  // Get resource counts
  getResourceCounts(): {
    geometries: number;
    materials: number;
    textures: number;
  } {
    return {
      geometries: this.geometries.size,
      materials: this.materials.size,
      textures: this.textures.size
    };
  }
  
  // Memory optimization helpers
  pruneUnusedResources(): void {
    // This would need scene traversal to identify unused resources
    // For now, just log the counts
    const counts = this.getResourceCounts();
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Resource counts:', counts);
    }
  }
}

// Global instance
export const resourceManager = ResourceManager.getInstance();

// React hook for resource management
import { useEffect, useRef } from 'react';

export function useDisposableGeometry(
  key: string,
  factory: () => THREE.BufferGeometry
): THREE.BufferGeometry {
  const geometryRef = useRef<THREE.BufferGeometry>();
  
  useEffect(() => {
    geometryRef.current = resourceManager.getOrCreateGeometry(key, factory);
    
    return () => {
      // Don't dispose on unmount as it might be reused
      // Let the resource manager handle lifecycle
    };
  }, [key]);
  
  return geometryRef.current || factory();
}

export function useDisposableMaterial(
  key: string,
  factory: () => THREE.Material
): THREE.Material {
  const materialRef = useRef<THREE.Material>();
  
  useEffect(() => {
    materialRef.current = resourceManager.getOrCreateMaterial(key, factory);
    
    return () => {
      // Don't dispose on unmount as it might be reused
    };
  }, [key]);
  
  return materialRef.current || factory();
}