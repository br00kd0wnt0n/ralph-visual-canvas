import React, { useState, useEffect } from 'react';
import { useVisualStore } from '../store/visualStore';
import { AIWorkflowWizard } from './AIWorkflowWizard';
import styles from './AIIntegrationDashboard.module.css';

interface AIIntegrationDashboardProps {
  isVisible: boolean;
  onClose: () => void;
}

export const AIIntegrationDashboard: React.FC<AIIntegrationDashboardProps> = ({
  isVisible,
  onClose
}) => {
  const { 
    ai, 
    setAIEnabled, 
    updateAIFeatures,
    updateAIStatus
  } = useVisualStore();

  // Initialize AI if not already initialized
  useEffect(() => {
    if (!ai) {
      setAIEnabled(true);
      updateAIFeatures({
        weatherIntegration: true,
        colorHarmony: true,
        themeAnalysis: true,
        parameterInterpolation: true
      });
      updateAIStatus({
        coreAI: 'idle',
        enhancedAI: 'idle',
        weatherService: 'idle'
      });
    }
  }, [ai, setAIEnabled, updateAIFeatures, updateAIStatus]);

  if (!isVisible) return null;

  return (
    <div className={styles.aiDashboardWrapper}>
      <div className={styles.aiDashboard}>
        <div className={styles.dashboardHeader}>
          <h2>AI Theme Generator</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.workflowContainer}>
          <AIWorkflowWizard />
        </div>
      </div>
    </div>
  );
}; 