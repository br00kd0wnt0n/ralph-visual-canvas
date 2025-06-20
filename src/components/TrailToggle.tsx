import React from 'react';
import { useVisualStore } from '../store/visualStore';

interface TrailToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const TrailToggle: React.FC<TrailToggleProps> = ({ isOpen, onToggle }) => {
  const { globalEffects } = useVisualStore();
  const { trails } = globalEffects;

  return (
    <button
      className="toggleButton"
      style={{
        zIndex: 2000,
        background: isOpen ? 'rgba(147, 51, 234, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        border: isOpen ? '2px solid #9333ea' : '1px solid rgba(255,255,255,0.2)',
        borderRadius: '50%',
        width: 50,
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: 20,
        color: 'white',
        boxShadow: isOpen ? '0 4px 16px rgba(147,51,234,0.3)' : '0 4px 12px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease',
        pointerEvents: 'auto',
        position: 'relative',
      }}
      title={isOpen ? 'Close Trail Controls' : 'Open Trail Controls'}
      onClick={onToggle}
    >
      <span style={{ 
        position: 'absolute', 
        top: -2, 
        right: -2, 
        width: 8, 
        height: 8, 
        borderRadius: '50%', 
        background: trails.enabled ? '#10b981' : '#6b7280',
        border: '1px solid rgba(0,0,0,0.3)',
        transition: 'background 0.3s ease'
      }} />
      🎨
    </button>
  );
}; 