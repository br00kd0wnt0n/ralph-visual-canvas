import React from 'react';
import styles from './AIToggle.module.css';

interface AIToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const AIToggle: React.FC<AIToggleProps> = ({ isOpen, onToggle }) => {
  return (
    <button 
      className={styles.toggleButton}
      onClick={onToggle}
      title={`${isOpen ? 'Hide' : 'Show'} AI Test Dashboard`}
    >
      🤖
    </button>
  );
}; 