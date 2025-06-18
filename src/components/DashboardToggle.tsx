import React from 'react';
import { useVisualStore } from '../store/visualStore';
import styles from './DashboardToggle.module.css';

export const DashboardToggle: React.FC = () => {
  const { ui, toggleDashboards } = useVisualStore();

  return (
    <button 
      className={styles.toggleButton}
      onClick={toggleDashboards}
      title={`${ui.showDashboards ? 'Hide' : 'Show'} Dashboards`}
    >
      {ui.showDashboards ? '👁' : '👁‍🗨'}
    </button>
  );
}; 