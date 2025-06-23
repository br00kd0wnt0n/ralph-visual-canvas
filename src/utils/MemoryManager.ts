// MemoryManager for Three.js resources
import * as THREE from 'three';

const trackedResources = new Set<THREE.Object3D | THREE.Material | THREE.Texture | THREE.BufferGeometry>();

export function trackResource(resource: any) {
  if (resource && typeof resource.dispose === 'function') {
    trackedResources.add(resource);
  }
}

export function disposeResource(resource: any) {
  if (resource && typeof resource.dispose === 'function') {
    try {
      resource.dispose();
      trackedResources.delete(resource);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to dispose resource:', e);
    }
  }
}

export function disposeAllResources() {
  trackedResources.forEach((resource) => {
    disposeResource(resource);
  });
  trackedResources.clear();
} 