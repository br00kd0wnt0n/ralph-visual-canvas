import React, { useRef, useEffect, useState } from 'react';
import { useVisualStore } from '../store/visualStore';

export const PerformanceMonitor: React.FC = () => {
  const [fps, setFps] = useState(0);
  const lastFrame = useRef(performance.now());
  const frameCount = useRef(0);
  const rafId = useRef<number | null>(null);

  // Get object counts from the store
  const cubes = useVisualStore(state => state.geometric.cubes.count);
  const spheres = useVisualStore(state => state.geometric.spheres.count);
  const toruses = useVisualStore(state => state.geometric.toruses.count);
  const particles = useVisualStore(state => state.particles.count);

  useEffect(() => {
    let running = true;
    const loop = () => {
      frameCount.current++;
      const now = performance.now();
      if (now - lastFrame.current >= 1000) {
        setFps(frameCount.current);
        frameCount.current = 0;
        lastFrame.current = now;
      }
      if (running) {
        rafId.current = requestAnimationFrame(loop);
      }
    };
    rafId.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 16,
      right: 16,
      background: 'rgba(20,20,30,0.85)',
      color: '#fff',
      padding: '12px 20px',
      borderRadius: 10,
      fontFamily: 'monospace',
      zIndex: 10000,
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    }}>
      <div style={{fontWeight: 'bold', fontSize: 18, marginBottom: 4}}>Performance</div>
      <div>FPS: <span style={{color: fps < 30 ? '#ff5555' : fps < 50 ? '#ffb300' : '#00ff88'}}>{fps}</span></div>
      <div>Cubes: {cubes}</div>
      <div>Spheres: {spheres}</div>
      <div>Toruses: {toruses}</div>
      <div>Particles: {particles}</div>
    </div>
  );
}; 