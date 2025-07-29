// ShareToggle.tsx
// Share button component for the bottom navigation bar

import React from 'react';

interface ShareToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const ShareToggle: React.FC<ShareToggleProps> = ({ isOpen, onToggle }) => {
  return (
    <button
      className="toggleButton"
      onClick={onToggle}
      style={{
        background: isOpen 
          ? 'rgba(59, 130, 246, 0.9)' 
          : 'rgba(0, 0, 0, 0.8)',
        border: isOpen 
          ? '2px solid #3b82f6' 
          : '1px solid rgba(255,255,255,0.2)',
        borderRadius: '50%',
        width: 50,
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: 20,
        color: 'white',
        boxShadow: isOpen 
          ? '0 4px 16px rgba(59,130,246,0.3)' 
          : '0 4px 12px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease',
        pointerEvents: 'auto',
        filter: isOpen ? 'none' : 'grayscale(100%)',
      }}
      title="Share Presets"
    >
      🔗
    </button>
  );
};