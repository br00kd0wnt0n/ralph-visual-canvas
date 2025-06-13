'use client';

import React from 'react';
import { Scene } from '../components/Scene';
import { Dashboard } from '../components/Dashboard';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.scene}>
          <Scene />
        </div>
        <div className={styles.dashboard}>
          <Dashboard />
        </div>
      </div>
    </main>
  );
}
