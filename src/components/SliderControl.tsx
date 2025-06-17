import React from 'react';
import styles from './GlobalEffectsDashboard.module.css';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const SliderControl: React.FC<SliderControlProps> = React.memo(({
  label,
  value,
  min,
  max,
  step = 0.1,
  onChange,
  disabled = false,
}) => (
  <div className={styles.controlGroup}>
    <label className={disabled ? styles.disabled : ''}>
      {label}
      <span>{value.toFixed(2)}</span>
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className={styles.slider}
      disabled={disabled}
    />
  </div>
));

export default SliderControl; 