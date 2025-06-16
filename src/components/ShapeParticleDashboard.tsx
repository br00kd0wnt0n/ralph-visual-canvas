import React from 'react';
import { useVisualStore } from '../store/visualStore';
import styles from './ShapeParticleDashboard.module.css';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

interface ColorControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const SliderControl: React.FC<SliderControlProps> = ({ 
  label, 
  value, 
  min, 
  max, 
  step = 0.1, 
  onChange, 
  disabled = false 
}) => (
  <div className={styles.controlGroup}>
    <label className={disabled ? styles.disabled : ''}>{label}</label>
    <input
      type="range"
      className={styles.slider}
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      disabled={disabled}
    />
  </div>
);

const ColorControl: React.FC<ColorControlProps> = ({ 
  label, 
  value, 
  onChange, 
  disabled = false 
}) => (
  <div className={styles.controlGroup}>
    <label className={disabled ? styles.disabled : ''}>{label}</label>
    <input
      type="color"
      className={styles.colorPicker}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  </div>
);

export const ShapeParticleDashboard = () => {
  const { geometric, particles, updateGeometric, updateParticles } = useVisualStore();

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <h2>Shapes & Particles</h2>
      </div>

      <div className={styles.tabContent}>
        {/* Particles Controls */}
        <div className={styles.controlSection}>
          <h3>✨ Particles</h3>
          <SliderControl
            label="Count"
            value={particles.count}
            min={0}
            max={1000}
            step={1}
            onChange={(value) => updateParticles({ count: value })}
          />
          <SliderControl
            label="Size"
            value={particles.size}
            min={0.1}
            max={2}
            onChange={(value) => updateParticles({ size: value })}
          />
          <ColorControl
            label="Color"
            value={particles.color}
            onChange={(value) => updateParticles({ color: value })}
          />
          <SliderControl
            label="Speed"
            value={particles.speed}
            min={0}
            max={5}
            onChange={(value) => updateParticles({ speed: value })}
          />
          <SliderControl
            label="Opacity"
            value={particles.opacity}
            min={0}
            max={1}
            onChange={(value) => updateParticles({ opacity: value })}
          />
          <SliderControl
            label="Spread"
            value={particles.spread}
            min={1}
            max={20}
            onChange={(value) => updateParticles({ spread: value })}
          />
        </div>

        {/* Spheres Controls */}
        <div className={styles.controlSection}>
          <h3>🔵 Spheres</h3>
          <SliderControl
            label="Count"
            value={geometric.spheres.count}
            min={0}
            max={20}
            step={1}
            onChange={(value) => updateGeometric('spheres', { count: value })}
          />
          <SliderControl
            label="Size"
            value={geometric.spheres.size}
            min={0.1}
            max={3}
            onChange={(value) => updateGeometric('spheres', { size: value })}
          />
          <ColorControl
            label="Color"
            value={geometric.spheres.color}
            onChange={(value) => updateGeometric('spheres', { color: value })}
          />
          <SliderControl
            label="Speed"
            value={geometric.spheres.speed}
            min={0}
            max={5}
            onChange={(value) => updateGeometric('spheres', { speed: value })}
          />
          <SliderControl
            label="Opacity"
            value={geometric.spheres.opacity}
            min={0}
            max={1}
            onChange={(value) => updateGeometric('spheres', { opacity: value })}
          />
        </div>

        {/* Cubes Controls */}
        <div className={styles.controlSection}>
          <h3>⬛ Cubes</h3>
          <SliderControl
            label="Count"
            value={geometric.cubes.count}
            min={0}
            max={20}
            step={1}
            onChange={(value) => updateGeometric('cubes', { count: value })}
          />
          <SliderControl
            label="Size"
            value={geometric.cubes.size}
            min={0.1}
            max={3}
            onChange={(value) => updateGeometric('cubes', { size: value })}
          />
          <ColorControl
            label="Color"
            value={geometric.cubes.color}
            onChange={(value) => updateGeometric('cubes', { color: value })}
          />
          <SliderControl
            label="Rotation"
            value={geometric.cubes.rotation}
            min={0}
            max={5}
            onChange={(value) => updateGeometric('cubes', { rotation: value })}
          />
          <SliderControl
            label="Opacity"
            value={geometric.cubes.opacity}
            min={0}
            max={1}
            onChange={(value) => updateGeometric('cubes', { opacity: value })}
          />
        </div>

        {/* Toruses Controls */}
        <div className={styles.controlSection}>
          <h3>⭕ Toruses</h3>
          <SliderControl
            label="Count"
            value={geometric.toruses.count}
            min={0}
            max={20}
            step={1}
            onChange={(value) => updateGeometric('toruses', { count: value })}
          />
          <SliderControl
            label="Size"
            value={geometric.toruses.size}
            min={0.1}
            max={3}
            onChange={(value) => updateGeometric('toruses', { size: value })}
          />
          <ColorControl
            label="Color"
            value={geometric.toruses.color}
            onChange={(value) => updateGeometric('toruses', { color: value })}
          />
          <SliderControl
            label="Speed"
            value={geometric.toruses.speed}
            min={0}
            max={5}
            onChange={(value) => updateGeometric('toruses', { speed: value })}
          />
          <SliderControl
            label="Opacity"
            value={geometric.toruses.opacity}
            min={0}
            max={1}
            onChange={(value) => updateGeometric('toruses', { opacity: value })}
          />
        </div>
      </div>
    </div>
  );
}; 