'use client';

import React, { useState, useEffect } from 'react';
import EnhancedVisualCanvas from '../components/EnhancedVisualCanvas';
import { GlobalEffectsDashboard } from '../components/GlobalEffectsDashboard';
import { ShapeParticleDashboard } from '../components/ShapeParticleDashboard';
import { DashboardToggle } from '../components/DashboardToggle';
import { GlobalDefaultsToggle } from '../components/GlobalDefaultsToggle';
import { PerformanceIndicator } from '../components/PerformanceIndicator';
import { AITestDashboard } from '../ai-system/components/AITestDashboard';
import GlobalDefaultsPanel from '../components/GlobalDefaultsManager';
import { useVisualStore } from '../store/visualStore';
import styles from './page.module.css';

export default function Home() {
  const { ui } = useVisualStore();
  const [isVisible, setIsVisible] = useState(ui.showDashboards);
  const [showAITest, setShowAITest] = useState(false);
  const [showGlobalDefaults, setShowGlobalDefaults] = useState(false);

  useEffect(() => {
    console.log('Home component mounted');
    if (ui.showDashboards) {
      setIsVisible(true);
    } else {
      // Delay hiding to allow for fade out animation
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [ui.showDashboards]);

  const handleAITestClick = () => {
    console.log('AI Test System button clicked!');
    setShowAITest((prev) => !prev);
  };

  return (
    <main className={styles.main}>
      {/* AI Test System Button - Styled to match dashboard */}
      <button
        onClick={handleAITestClick}
        className={styles.aiTestButton}
        title="Theme, AI + Logic"
      >
        🤖
      </button>
      
      {/* AI Test Dashboard Overlay */}
      {showAITest && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10000,
            width: 'min(98vw, 900px)',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'rgba(20,20,30,0.95)',
            borderRadius: 16,
            boxShadow: '0 4px 32px rgba(0,0,0,0.4)',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            backdropFilter: 'blur(10px)',
          }}
        >
          <button
            onClick={() => setShowAITest(false)}
            style={{
              alignSelf: 'flex-end',
              margin: 8,
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: 20,
              cursor: 'pointer',
              opacity: 0.7,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
            aria-label="Close Theme, AI + Logic"
          >
            ✕
          </button>
          <AITestDashboard />
        </div>
      )}

      <DashboardToggle />
      <GlobalDefaultsToggle 
        isOpen={showGlobalDefaults} 
        onToggle={() => setShowGlobalDefaults(!showGlobalDefaults)} 
      />
      <PerformanceIndicator />
      {isVisible && (
        <div className={`${styles.dashboardContainer} ${!ui.showDashboards ? styles.hidden : ''}`}>
          <GlobalEffectsDashboard />
          <ShapeParticleDashboard />
        </div>
      )}
      
      {/* Global Defaults Manager Modal */}
      <GlobalDefaultsPanel 
        isOpen={showGlobalDefaults} 
        onClose={() => setShowGlobalDefaults(false)} 
      />
      
      <EnhancedVisualCanvas />
    </main>
  );
}
