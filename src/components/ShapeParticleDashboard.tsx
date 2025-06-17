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

interface ToggleControlProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
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

const ToggleControl: React.FC<ToggleControlProps> = React.memo(({ 
  label, 
  value, 
  onChange, 
  disabled = false 
}) => (
  <div className={styles.controlGroup}>
    <label className={disabled ? styles.disabled : ''}>{label}</label>
    <input
      type="checkbox"
      className={styles.toggle}
      checked={value}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
    />
  </div>
));

export const ShapeParticleDashboard = React.memo(() => {
  const { geometric, particles, globalEffects, updateGeometric, updateParticles, updateGlobalEffects } = useVisualStore();

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

        {/* Metamorphosis Controls */}
        <div className={styles.controlSection}>
          <h3>🔄 Metamorphosis</h3>
          <ToggleControl
            label="Enable"
            value={globalEffects.metamorphosis.enabled}
            onChange={(value: boolean) => updateGlobalEffects({ 
              metamorphosis: { ...globalEffects.metamorphosis, enabled: value }
            })}
          />
          <SliderControl
            label="Morph Speed"
            value={globalEffects.metamorphosis.morphSpeed || 1}
            min={0.1}
            max={3}
            step={0.1}
            onChange={(value: number) => updateGlobalEffects({ 
              metamorphosis: { ...globalEffects.metamorphosis, morphSpeed: value }
            })}
          />
          <SliderControl
            label="Rotation Speed"
            value={globalEffects.metamorphosis.rotationSpeed || 1}
            min={0}
            max={2}
            step={0.1}
            onChange={(value: number) => updateGlobalEffects({ 
              metamorphosis: { ...globalEffects.metamorphosis, rotationSpeed: value }
            })}
          />
          <SliderControl
            label="Wireframe Opacity"
            value={globalEffects.metamorphosis.wireframeOpacity || 0.4}
            min={0.1}
            max={1}
            step={0.1}
            onChange={(value: number) => updateGlobalEffects({ 
              metamorphosis: { ...globalEffects.metamorphosis, wireframeOpacity: value }
            })}
          />
          <SliderControl
            label="Size"
            value={globalEffects.metamorphosis.size || 1.0}
            min={0.1}
            max={3.0}
            step={0.1}
            onChange={(value: number) => updateGlobalEffects({ 
              metamorphosis: { ...globalEffects.metamorphosis, size: value }
            })}
          />
          <SliderControl
            label="Blur"
            value={globalEffects.metamorphosis.blur || 0.0}
            min={0.0}
            max={1.0}
            step={0.1}
            onChange={(value: number) => updateGlobalEffects({ 
              metamorphosis: { ...globalEffects.metamorphosis, blur: value }
            })}
          />
          <ColorControl
            label="Color"
            value={geometric.metamorphosis?.color || '#333333'}
            onChange={(value) => updateGeometric('metamorphosis', { color: value })}
          />
        </div>

        {/* Fireflies Controls */}
        <div className={styles.controlSection}>
          <h3>🦟 Fireflies</h3>
          <ToggleControl
            label="Enable"
            value={globalEffects.fireflies.enabled}
            onChange={(value: boolean) => updateGlobalEffects({ 
              fireflies: { ...globalEffects.fireflies, enabled: value }
            })}
          />
          <SliderControl
            label="Count"
            value={globalEffects.fireflies.count || 50}
            min={10}
            max={100}
            step={5}
            onChange={(value: number) => updateGlobalEffects({ 
              fireflies: { ...globalEffects.fireflies, count: value }
            })}
          />
          <SliderControl
            label="Speed"
            value={globalEffects.fireflies.speed || 1}
            min={0.1}
            max={3}
            step={0.1}
            onChange={(value: number) => updateGlobalEffects({ 
              fireflies: { ...globalEffects.fireflies, speed: value }
            })}
          />
          <SliderControl
            label="Glow Intensity"
            value={globalEffects.fireflies.glowIntensity || 1}
            min={0.1}
            max={2}
            step={0.1}
            onChange={(value: number) => updateGlobalEffects({ 
              fireflies: { ...globalEffects.fireflies, glowIntensity: value }
            })}
          />
          <SliderControl
            label="Swarm Radius"
            value={globalEffects.fireflies.swarmRadius || 30}
            min={10}
            max={50}
            step={5}
            onChange={(value: number) => updateGlobalEffects({ 
              fireflies: { ...globalEffects.fireflies, swarmRadius: value }
            })}
          />
          <ColorControl
            label="Color"
            value={geometric.fireflies?.color || '#ffff88'}
            onChange={(value) => updateGeometric('fireflies', { color: value })}
          />
        </div>

        {/* Wave Interference Controls */}
        <div className={styles.controlSection}>
          <h3>🌊 Wave Interference</h3>
          <ToggleControl
            label="Enable"
            value={globalEffects.waveInterference.enabled}
            onChange={(value: boolean) => updateGlobalEffects({ 
              waveInterference: { ...globalEffects.waveInterference, enabled: value }
            })}
          />
          <SliderControl
            label="Speed"
            value={globalEffects.waveInterference.speed || 0.5}
            min={0.1}
            max={2.0}
            step={0.1}
            onChange={(value: number) => updateGlobalEffects({ 
              waveInterference: { ...globalEffects.waveInterference, speed: value }
            })}
          />
          <SliderControl
            label="Amplitude"
            value={globalEffects.waveInterference.amplitude || 0.5}
            min={0.1}
            max={2.0}
            step={0.1}
            onChange={(value: number) => updateGlobalEffects({ 
              waveInterference: { ...globalEffects.waveInterference, amplitude: value }
            })}
          />
          <SliderControl
            label="Contour Levels"
            value={globalEffects.waveInterference.contourLevels || 5}
            min={2}
            max={20}
            step={1}
            onChange={(value: number) => updateGlobalEffects({ 
              waveInterference: { ...globalEffects.waveInterference, contourLevels: value }
            })}
          />
          <ColorControl
            label="Color"
            value={geometric.waveInterference?.color || '#333333'}
            onChange={(value) => updateGeometric('waveInterference', { color: value })}
          />
        </div>
      </div>
    </div>
  );
}); 