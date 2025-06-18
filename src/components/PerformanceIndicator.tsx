import React from 'react';
import { usePerformanceMonitor } from '../utils/performanceMonitor';

export const PerformanceIndicator: React.FC = () => {
  const { fps, performance } = usePerformanceMonitor();

  const getPerformanceColor = () => {
    switch (performance) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-yellow-400';
      case 'moderate': return 'text-orange-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
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
    <div 
      className="fixed bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-2 text-xs text-white"
      style={{ zIndex: 99999 }}
    >
      <div className="flex items-center gap-2">
        <span>{getPerformanceIcon()}</span>
        <span className={getPerformanceColor()}>
          {fps} FPS
        </span>
        <span className="text-gray-400">
          ({performance})
        </span>
      </div>
    </div>
  );
}; 