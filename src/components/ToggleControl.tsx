import React from 'react';
import styles from './GlobalEffectsDashboard.module.css';

interface ToggleControlProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

const ToggleControl: React.FC<ToggleControlProps> = ({
  label,
  value,
  onChange,
}) => (
  <div className={styles.controlGroup}>
    <label className={styles.toggleLabel}>
      <input
        type="checkbox"
        checked={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked)}
        className={styles.toggleCheckbox}
      />
      <span className={styles.toggleSwitch}></span>
      {label}
    </label>
  </div>
);

export default ToggleControl; 