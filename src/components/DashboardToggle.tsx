import React, { useEffect } from 'react';
import { useVisualStore } from '../store/visualStore';
import styles from './DashboardToggle.module.css';

export const DashboardToggle: React.FC = () => {
  const { ui, toggleDashboards } = useVisualStore();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Toggle dashboards with 'H' key
      if (event.key.toLowerCase() === 'h' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        toggleDashboards();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleDashboards]);

  return (
    <button 
      className={styles.toggleButton}
      onClick={toggleDashboards}
      title={`${ui.showDashboards ? 'Hide' : 'Show'} Dashboards (H)`}
    >
      {ui.showDashboards ? '👁' : '👁‍🗨'}
    </button>
  );
}; 