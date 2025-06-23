import React, { useEffect, useRef, useState } from 'react';
import { useVisualStore } from '../store/visualStore';

interface WebGLContextManagerProps {
  children: React.ReactNode;
}

export const WebGLContextManager: React.FC<WebGLContextManagerProps> = ({ children }) => {
  const [contextLost, setContextLost] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    canvasRef.current = canvas;

    function handleContextLost(e: Event) {
      e.preventDefault();
      setContextLost(true);
      // Optionally: update Zustand error state
      // useVisualStore.getState().setCanvasError?.(new Error('WebGL context lost'));
      console.error('WebGL context lost');
    }
    function handleContextRestored() {
      setContextLost(false);
      // Optionally: update Zustand error state
      // useVisualStore.getState().setCanvasError?.(null);
      console.info('WebGL context restored');
    }
    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, []);

  if (contextLost) {
    return (
      <div style={{
        background: 'rgba(30, 0, 0, 0.85)',
        color: '#fff',
        padding: '2rem',
        borderRadius: '1rem',
        textAlign: 'center',
        maxWidth: 480,
        margin: '2rem auto',
        boxShadow: '0 0 32px #0008',
      }}>
        <h2>WebGL context lost</h2>
        <p>The 3D canvas has lost its graphics context. This can happen due to memory pressure or GPU reset.</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: '#ff4d4f',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '0.5rem 1.5rem',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            marginTop: 16,
          }}
        >
          Reload Canvas
        </button>
      </div>
    );
  }
  return <>{children}</>;
}; 