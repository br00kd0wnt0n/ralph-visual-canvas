import React from 'react';
import styles from './GlobalDefaultsToggle.module.css';

interface GlobalDefaultsToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const GlobalDefaultsToggle: React.FC<GlobalDefaultsToggleProps> = ({ isOpen, onToggle }) => {
  return (
    <button 
      className={styles.toggleButton}
      onClick={onToggle}
      title={`${isOpen ? 'Hide' : 'Show'} Global Defaults Manager`}
    >
      ⚙️
    </button>
  );
}; 