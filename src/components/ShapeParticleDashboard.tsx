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

const SliderControl: React.FC<SliderControlProps> = React.memo(({ 
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
));

const ColorControl: React.FC<ColorControlProps> = React.memo(({ 
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
));

export const ShapeParticleDashboard = React.memo(() => {
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
            value={particles.count || 0}
            min={0}
            max={1000}
            step={1}
            onChange={(value) => updateParticles({ count: value })}
          />
          <SliderControl
            label="Size"
            value={particles.size || 0.2}
            min={0.1}
            max={2}
            onChange={(value) => updateParticles({ size: value })}
          />
          <ColorControl
            label="Color"
            value={particles.color || '#ff1493'}
            onChange={(value) => updateParticles({ color: value })}
          />
          <SliderControl
            label="Speed"
            value={particles.speed || 1.0}
            min={0}
            max={5}
            onChange={(value) => updateParticles({ speed: value })}
          />
          <SliderControl
            label="Opacity"
            value={particles.opacity || 0.9}
            min={0}
            max={1}
            onChange={(value) => updateParticles({ opacity: value })}
          />
          <SliderControl
            label="Spread"
            value={particles.spread || 15}
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
            value={geometric.spheres.count || 0}
            min={0}
            max={20}
            step={1}
            onChange={(value) => updateGeometric('spheres', { count: value })}
          />
          <SliderControl
            label="Size"
            value={geometric.spheres.size || 1.0}
            min={0.1}
            max={3}
            onChange={(value) => updateGeometric('spheres', { size: value })}
          />
          <SliderControl
            label="Organicness"
            value={geometric.spheres.organicness || 0}
            min={0}
            max={2}
            onChange={(value) => updateGeometric('spheres', { organicness: value })}
          />
          <ColorControl
            label="Color"
            value={geometric.spheres.color || '#00ff88'}
            onChange={(value) => updateGeometric('spheres', { color: value })}
          />
          <SliderControl
            label="Speed"
            value={geometric.spheres.speed || 1.0}
            min={0}
            max={5}
            onChange={(value) => updateGeometric('spheres', { speed: value })}
          />
          <SliderControl
            label="Opacity"
            value={geometric.spheres.opacity || 0.7}
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
            value={geometric.cubes.count || 0}
            min={0}
            max={20}
            step={1}
            onChange={(value) => updateGeometric('cubes', { count: value })}
          />
          <SliderControl
            label="Size"
            value={geometric.cubes.size || 0.8}
            min={0.1}
            max={3}
            onChange={(value) => updateGeometric('cubes', { size: value })}
          />
          <SliderControl
            label="Organicness"
            value={geometric.cubes.organicness || 0}
            min={0}
            max={2}
            onChange={(value) => updateGeometric('cubes', { organicness: value })}
          />
          <ColorControl
            label="Color"
            value={geometric.cubes.color || '#4169e1'}
            onChange={(value) => updateGeometric('cubes', { color: value })}
          />
          <SliderControl
            label="Rotation"
            value={geometric.cubes.rotation || 1.0}
            min={0}
            max={5}
            onChange={(value) => updateGeometric('cubes', { rotation: value })}
          />
          <SliderControl
            label="Opacity"
            value={geometric.cubes.opacity || 0.6}
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
            value={geometric.toruses.count || 0}
            min={0}
            max={20}
            step={1}
            onChange={(value) => updateGeometric('toruses', { count: value })}
          />
          <SliderControl
            label="Size"
            value={geometric.toruses.size || 1.2}
            min={0.1}
            max={3}
            onChange={(value) => updateGeometric('toruses', { size: value })}
          />
          <SliderControl
            label="Organicness"
            value={geometric.toruses.organicness || 0}
            min={0}
            max={2}
            onChange={(value) => updateGeometric('toruses', { organicness: value })}
          />
          <ColorControl
            label="Color"
            value={geometric.toruses.color || '#ffa500'}
            onChange={(value) => updateGeometric('toruses', { color: value })}
          />
          <SliderControl
            label="Speed"
            value={geometric.toruses.speed || 0.8}
            min={0}
            max={5}
            onChange={(value) => updateGeometric('toruses', { speed: value })}
          />
          <SliderControl
            label="Opacity"
            value={geometric.toruses.opacity || 0.5}
            min={0}
            max={1}
            onChange={(value) => updateGeometric('toruses', { opacity: value })}
          />
        </div>

        {/* Organic Blobs Controls */}
        <div className={styles.controlSection}>
          <h3>🫧 Organic Blobs</h3>
          <SliderControl
            label="Count"
            value={geometric.blobs.count || 0}
            min={0}
            max={15}
            step={1}
            onChange={(value) => updateGeometric('blobs', { count: value })}
          />
          <SliderControl
            label="Size"
            value={geometric.blobs.size || 1.5}
            min={0.2}
            max={3}
            onChange={(value) => updateGeometric('blobs', { size: value })}
          />
          <SliderControl
            label="Organicness"
            value={geometric.blobs.organicness || 0.7}
            min={0}
            max={2}
            onChange={(value) => updateGeometric('blobs', { organicness: value })}
          />
          <SliderControl
            label="Speed"
            value={geometric.blobs.speed || 0.6}
            min={0}
            max={3}
            onChange={(value) => updateGeometric('blobs', { speed: value })}
          />
          <SliderControl
            label="Opacity"
            value={geometric.blobs.opacity || 0.8}
            min={0}
            max={1}
            onChange={(value) => updateGeometric('blobs', { opacity: value })}
          />
          <ColorControl
            label="Color"
            value={geometric.blobs.color || '#9370db'}
            onChange={(value) => updateGeometric('blobs', { color: value })}
          />
        </div>

        {/* Flowing Ribbons Controls */}
        <div className={styles.controlSection}>
          <h3>🎀 Flowing Ribbons</h3>
          <SliderControl
            label="Count"
            value={geometric.ribbons.count || 0}
            min={0}
            max={10}
            step={1}
            onChange={(value) => updateGeometric('ribbons', { count: value })}
          />
          <SliderControl
            label="Length"
            value={geometric.ribbons.length || 8}
            min={3}
            max={15}
            onChange={(value) => updateGeometric('ribbons', { length: value })}
          />
          <SliderControl
            label="Width"
            value={geometric.ribbons.width || 0.3}
            min={0.1}
            max={1}
            onChange={(value) => updateGeometric('ribbons', { width: value })}
          />
          <SliderControl
            label="Flow (Curve Intensity)"
            value={geometric.ribbons.flow || 0.8}
            min={0.1}
            max={2}
            step={0.1}
            onChange={(value) => updateGeometric('ribbons', { flow: value })}
          />
          <SliderControl
            label="Speed"
            value={geometric.ribbons.speed || 1.2}
            min={0}
            max={3}
            onChange={(value) => updateGeometric('ribbons', { speed: value })}
          />
          <SliderControl
            label="Opacity"
            value={geometric.ribbons.opacity || 0.6}
            min={0}
            max={1}
            onChange={(value) => updateGeometric('ribbons', { opacity: value })}
          />
          <ColorControl
            label="Color"
            value={geometric.ribbons.color || '#ff6b6b'}
            onChange={(value) => updateGeometric('ribbons', { color: value })}
          />
        </div>
      </div>
    </div>
  );
}); 