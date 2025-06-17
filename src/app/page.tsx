'use client';

import React, { useState, useEffect } from 'react';
import EnhancedVisualCanvas from '../components/EnhancedVisualCanvas';
import { GlobalEffectsDashboard } from '../components/GlobalEffectsDashboard';
import { ShapeParticleDashboard } from '../components/ShapeParticleDashboard';
import { DashboardToggle } from '../components/DashboardToggle';
import { PerformanceIndicator } from '../components/PerformanceIndicator';
import { useVisualStore } from '../store/visualStore';
import styles from './page.module.css';

export default function Home() {
  const { ui } = useVisualStore();
  const [isVisible, setIsVisible] = useState(ui.showDashboards);

  useEffect(() => {
    if (ui.showDashboards) {
      setIsVisible(true);
    } else {
      // Delay hiding to allow for fade out animation
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [ui.showDashboards]);

  return (
    <main className={styles.main}>
      <DashboardToggle />
      <PerformanceIndicator />
      {isVisible && (
        <div className={`${styles.dashboardContainer} ${!ui.showDashboards ? styles.hidden : ''}`}>
          <GlobalEffectsDashboard />
          <ShapeParticleDashboard />
        </div>
      )}
      <EnhancedVisualCanvas />
    </main>
  );
}
