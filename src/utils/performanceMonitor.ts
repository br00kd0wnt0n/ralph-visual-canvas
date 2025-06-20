import React from 'react';

// Performance monitoring utility
class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private frameCount = 0;
  private lastTime = performance.now();
  private fpsHistory: number[] = [];
  private maxHistoryLength = 60; // Keep last 60 frames
  private isEnabled = false;
  private lastLogTime = 0;
  private logInterval = 5000; // Log every 5 seconds instead of every second

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  enable() {
    this.isEnabled = true;
    console.log('🔧 Performance monitoring enabled');
  }

  disable() {
    this.isEnabled = false;
    console.log('🔧 Performance monitoring disabled');
  }

  update() {
    if (!this.isEnabled) return;

    this.frameCount++;
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    if (deltaTime >= 1000) { // Update FPS every second
      const fps = Math.round((this.frameCount * 1000) / deltaTime);
      this.fpsHistory.push(fps);
      
      if (this.fpsHistory.length > this.maxHistoryLength) {
        this.fpsHistory.shift();
      }

      const avgFps = Math.round(
        this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length
      );

      // Log performance warnings less frequently
      const timeSinceLastLog = currentTime - this.lastLogTime;
      if (timeSinceLastLog >= this.logInterval) {
        this.lastLogTime = currentTime;
        
        // Only log in development mode
        if (process.env.NODE_ENV === 'development') {
          if (avgFps < 30) {
            console.warn(`⚠️ Low FPS detected: ${avgFps} FPS (current: ${fps} FPS)`);
          } else if (avgFps < 50) {
            console.info(`📊 Moderate FPS: ${avgFps} FPS (current: ${fps} FPS)`);
          }
        }
      }

      this.frameCount = 0;
      this.lastTime = currentTime;
    }
  }

  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 0;
    return Math.round(
      this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length
    );
  }

  getCurrentFPS(): number {
    if (this.fpsHistory.length === 0) return 0;
    return this.fpsHistory[this.fpsHistory.length - 1];
  }

  getPerformanceReport(): {
    currentFPS: number;
    averageFPS: number;
    performance: 'excellent' | 'good' | 'moderate' | 'poor';
  } {
    const avgFps = this.getAverageFPS();
    let performance: 'excellent' | 'good' | 'moderate' | 'poor' = 'excellent';
    
    if (avgFps < 30) performance = 'poor';
    else if (avgFps < 50) performance = 'moderate';
    else if (avgFps < 55) performance = 'good';

    return {
      currentFPS: this.getCurrentFPS(),
      averageFPS: avgFps,
      performance
    };
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

// Hook for React components
export const usePerformanceMonitor = () => {
  const [fps, setFps] = React.useState(0);
  const [performance, setPerformance] = React.useState<'excellent' | 'good' | 'moderate' | 'poor'>('excellent');

  React.useEffect(() => {
    const interval = setInterval(() => {
      const report = performanceMonitor.getPerformanceReport();
      setFps(report.averageFPS);
      setPerformance(report.performance);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { fps, performance };
}; 