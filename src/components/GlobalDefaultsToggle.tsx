import React, { useState } from 'react';
import { useVisualStore } from '../store/visualStore';
import { DoFTooltip } from './DoFTooltip';
import styles from './GlobalDefaultsToggle.module.css';

interface GlobalDefaultsToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const GlobalDefaultsToggle: React.FC<GlobalDefaultsToggleProps> = ({ isOpen, onToggle }) => {
  const { camera } = useVisualStore();
  const [showDoFTooltip, setShowDoFTooltip] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowDoFTooltip(true)}
      onMouseLeave={() => setShowDoFTooltip(false)}
    >
      <button 
        className={styles.toggleButton}
        onClick={onToggle}
        title={`${isOpen ? 'Hide' : 'Show'} Global Defaults Manager`}
      >
        ⚙️
      </button>
      <DoFTooltip isVisible={showDoFTooltip} />
    </div>
  );
}; 