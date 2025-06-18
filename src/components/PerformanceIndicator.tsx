import React from 'react';
import { usePerformanceMonitor } from '../utils/performanceMonitor';

export const PerformanceIndicator: React.FC = () => {
  const { fps, performance } = usePerformanceMonitor();

  const getPerformanceColor = () => {
    switch (performance) {
      case 'excellent': return '#10b981';
      case 'good': return '#f59e0b';
      case 'moderate': return '#f97316';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPerformanceIcon = () => {
    switch (performance) {
      case 'excellent': return '🚀';
      case 'good': return '✅';
      case 'moderate': return '⚠️';
      case 'poor': return '🐌';
      default: return '❓';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 1000,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <span>{getPerformanceIcon()}</span>
      <span style={{ color: getPerformanceColor() }}>
        {fps} FPS
      </span>
      <span style={{ color: '#6b7280' }}>
        ({performance})
      </span>
    </div>
  );
}; 