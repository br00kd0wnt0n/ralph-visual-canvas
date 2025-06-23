import React, { useState } from 'react';
import styles from './CollapsibleSection.module.css';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = React.memo(({ 
  title, 
  children, 
  defaultExpanded = false,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`${styles.collapsibleSection} ${className}`}>
      <button 
        className={styles.sectionHeader}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <h3 className={styles.sectionTitle}>{title}</h3>
        <div className={`${styles.arrow} ${isExpanded ? styles.arrowExpanded : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </div>
      </button>
      <div className={`${styles.sectionContent} ${isExpanded ? styles.expanded : ''}`}>
        {children}
      </div>
    </div>
  );
});

export default CollapsibleSection; 