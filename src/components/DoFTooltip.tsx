import React from 'react';
import { useVisualStore } from '../store/visualStore';

interface DoFTooltipProps {
  isVisible: boolean;
}

export const DoFTooltip: React.FC<DoFTooltipProps> = ({ isVisible }) => {
  const { camera } = useVisualStore();

  if (!isVisible || !camera.depthOfField.enabled) {
    return null;
  }

  return (
    <div style={{
      position: 'absolute',
      bottom: '60px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0, 0, 0, 0.9)',
      color: '#00ff00',
      padding: '6px 10px',
      borderRadius: '6px',
      fontSize: '12px',
      zIndex: 3000,
      border: '1px solid #00ff00',
      backdropFilter: 'blur(10px)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
      animation: 'fadeIn 0.2s ease-in-out'
    }}>
      DOF: {camera.depthOfField.blur.toFixed(1)} | {camera.depthOfField.bokehScale.toFixed(1)}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(5px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}; 