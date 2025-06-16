'use client';

import React from 'react';
import EnhancedVisualCanvas from '../components/EnhancedVisualCanvas';
import { GlobalEffectsDashboard } from '../components/GlobalEffectsDashboard';
import { ShapeParticleDashboard } from '../components/ShapeParticleDashboard';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.dashboardContainer}>
        <GlobalEffectsDashboard />
        <ShapeParticleDashboard />
      </div>
      <EnhancedVisualCanvas />
    </main>
  );
}
