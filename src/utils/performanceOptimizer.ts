// Performance optimization utilities to prevent browser crashes

export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private isEnabled = false;
  private lastMemoryCheck = 0;
  private memoryCheckInterval = 10000; // Check memory every 10 seconds

  private constructor() {}

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  enable() {
    this.isEnabled = true;
    this.startMemoryMonitoring();
  }

  disable() {
    this.isEnabled = false;
  }

  private startMemoryMonitoring() {
    if (!this.isEnabled) return;

    const checkMemory = () => {
      if (!this.isEnabled) return;

      const currentTime = performance.now();
      if (currentTime - this.lastMemoryCheck > this.memoryCheckInterval) {
        this.lastMemoryCheck = currentTime;
        this.checkMemoryUsage();
      }

      requestAnimationFrame(checkMemory);
    };

    requestAnimationFrame(checkMemory);
  }

  private checkMemoryUsage() {
    // Check if memory usage is available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
      const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
      const usagePercent = Math.round((usedMB / limitMB) * 100);

      // Log memory usage in development mode
      if (process.env.NODE_ENV === 'development' && usagePercent > 80) {
        console.warn(`⚠️ High memory usage: ${usedMB}MB / ${limitMB}MB (${usagePercent}%)`);
      }

      // Force garbage collection if memory usage is very high
      if (usagePercent > 90) {
        this.forceGarbageCollection();
      }
    }
  }

  private forceGarbageCollection() {
    // Try to force garbage collection if available
    if ('gc' in window) {
      try {
        (window as any).gc();
        console.log('🗑️ Forced garbage collection');
      } catch (error) {
        // GC not available or failed
      }
    }
  }

  // Optimize WebGL context
  optimizeWebGLContext(gl: any) {
    if (!gl) return;

    try {
      // Set conservative limits to prevent crashes
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      const maxViewportDims = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
      
      // Log WebGL capabilities in development
      if (process.env.NODE_ENV === 'development') {
        console.log('🎨 WebGL capabilities:', {
          maxTextureSize,
          maxViewportDims,
          vendor: gl.getParameter(gl.VENDOR),
          renderer: gl.getParameter(gl.RENDERER)
        });
      }

      // Set conservative texture size limit
      const safeTextureSize = Math.min(maxTextureSize, 2048);
      
      return {
        maxTextureSize: safeTextureSize,
        maxViewportDims,
        safeTextureSize
      };
    } catch (error) {
      console.warn('Failed to optimize WebGL context:', error);
      return null;
    }
  }

  // Reduce animation complexity when performance is poor
  getPerformanceLevel(): 'high' | 'medium' | 'low' {
    if (!this.isEnabled) return 'high';

    // Check FPS from performance monitor
    const fps = this.getCurrentFPS();
    
    if (fps > 50) return 'high';
    if (fps > 30) return 'medium';
    return 'low';
  }

  private getCurrentFPS(): number {
    // This would integrate with the performance monitor
    // For now, return a default value
    return 60;
  }

  // Get recommended settings based on performance level
  getRecommendedSettings(level: 'high' | 'medium' | 'low') {
    switch (level) {
      case 'high':
        return {
          maxParticles: 1500,
          maxShapes: 150,
          updateFrequency: 1, // Update every frame
          quality: 'high'
        };
      case 'medium':
        return {
          maxParticles: 800,
          maxShapes: 80,
          updateFrequency: 2, // Update every 2 frames
          quality: 'medium'
        };
      case 'low':
        return {
          maxParticles: 400,
          maxShapes: 40,
          updateFrequency: 3, // Update every 3 frames
          quality: 'low'
        };
    }
  }
}

export const performanceOptimizer = PerformanceOptimizer.getInstance(); 