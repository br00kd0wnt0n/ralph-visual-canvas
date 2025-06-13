'use client';

import React from 'react';
import { EnhancedVisualCanvas } from '../components/EnhancedVisualCanvas';
import { GlobalEffectsDashboard } from '../components/GlobalEffectsDashboard';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.scene}>
          <EnhancedVisualCanvas />
        </div>
        <GlobalEffectsDashboard />
      </div>
    </main>
  );
}
