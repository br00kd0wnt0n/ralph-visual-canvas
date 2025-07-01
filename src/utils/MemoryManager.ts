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

// Memory management utility for performance optimization
export class MemoryManager {
  private static instance: MemoryManager;
  private cleanupCallbacks: (() => void)[] = [];
  private isMonitoring = false;
  private lastMemoryCheck = 0;
  private memoryCheckInterval = 10000; // Check every 10 seconds

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  // Register cleanup callback
  registerCleanup(callback: () => void): void {
    this.cleanupCallbacks.push(callback);
  }

  // Perform memory cleanup
  cleanup(): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('🧹 Performing memory cleanup...');
    }
    
    this.cleanupCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Memory cleanup error:', error);
        }
      }
    });
    
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
  }

  // Start memory monitoring - optimized for performance
  startMonitoring(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    
    const checkMemory = () => {
      if (!this.isMonitoring) return;
      
      const now = performance.now();
      if (now - this.lastMemoryCheck > this.memoryCheckInterval) {
        this.lastMemoryCheck = now;
        
        // Check memory usage if available
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
          const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
          const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`📊 Memory: ${usedMB}MB / ${totalMB}MB (${limitMB}MB limit)`);
          }
          
          // Trigger cleanup if memory usage is high
          if (usedMB > totalMB * 0.8) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('⚠️ High memory usage detected, triggering cleanup');
            }
            this.cleanup();
          }
        }
      }
      
      // Use setTimeout instead of requestAnimationFrame for memory monitoring
      // This reduces the frequency and doesn't interfere with rendering
      setTimeout(checkMemory, 1000); // Check every second instead of every frame
    };
    
    setTimeout(checkMemory, 1000);
  }

  // Stop memory monitoring
  stopMonitoring(): void {
    this.isMonitoring = false;
  }

  // Get memory usage info
  getMemoryInfo(): { used: number; total: number; limit: number } | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      };
    }
    return null;
  }
}

// Global instance
export const memoryManager = MemoryManager.getInstance(); 