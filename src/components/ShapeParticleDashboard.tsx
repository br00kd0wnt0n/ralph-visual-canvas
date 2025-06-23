import React, { useState } from 'react';
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

interface SelectControlProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

interface ControlSectionProps {
  title: string;
  children: React.ReactNode;
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

const SelectControl: React.FC<SelectControlProps> = React.memo(({ 
  label, 
  value, 
  options, 
  onChange, 
  disabled = false 
}) => (
  <div className={styles.controlGroup}>
    <label className={disabled ? styles.disabled : ''}>{label}</label>
    <select
      className={styles.select}
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      style={{
        backgroundColor: '#374151',
        color: '#ffffff',
        border: '1px solid #4B5563',
        borderRadius: '4px',
        padding: '4px 8px',
        fontSize: '14px'
      }}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value} style={{ backgroundColor: '#374151', color: '#ffffff' }}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
));

const ControlSection: React.FC<ControlSectionProps> = React.memo(({ 
  title, 
  children 
}) => {
  return (
    <div className={styles.controlSection}>
      <h3>{title}</h3>
      <div className={styles.controlContent}>
        {children}
      </div>
    </div>
  );
});

export const ShapeParticleDashboard = React.memo(() => {
  const { geometric, particles, globalEffects, updateGeometric, updateParticles, updateGlobalEffects } = useVisualStore();

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 text-white shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-purple-400">Shapes & Particles</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400">Active</span>
        </div>
      </div>

      <div className={styles.tabContent}>
        {/* Particles Controls */}
        <ControlSection title="Particles">
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
            value={particles.size || 0.1}
            min={0.01}
            max={1.0}
            step={0.01}
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
          <SliderControl
            label="Distance"
            value={particles.distance || 1.5}
            min={0.1}
            max={10}
            step={0.1}
            onChange={(value) => updateParticles({ distance: value })}
          />
          <SelectControl
            label="Movement Pattern"
            value={particles.movementPattern}
            options={[
              { value: 'orbit', label: 'Orbit' },
              { value: 'verticalSine', label: 'Vertical Sine' },
              { value: 'static', label: 'Static' },
              { value: 'random', label: 'Random' }
            ]}
            onChange={value => updateParticles({ movementPattern: value as any })}
          />
        </ControlSection>

        {/* Spheres Controls */}
        <ControlSection title="Spheres">
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
            label="Rotation"
            value={geometric.spheres.rotation || 1.0}
            min={0}
            max={5}
            step={0.01}
            onChange={(value) => updateGeometric('spheres', { rotation: value })}
          />
          <SliderControl
            label="Opacity"
            value={geometric.spheres.opacity || 0.7}
            min={0}
            max={1}
            onChange={(value) => updateGeometric('spheres', { opacity: value })}
          />
          <SliderControl
            label="Distance"
            value={geometric.spheres.distance || 2.0}
            min={0.1}
            max={10}
            step={0.1}
            onChange={(value) => updateGeometric('spheres', { distance: value })}
          />
          <SelectControl
            label="Movement Pattern"
            value={geometric.spheres.movementPattern}
            options={[
              { value: 'orbit', label: 'Orbit' },
              { value: 'verticalSine', label: 'Vertical Sine' },
              { value: 'static', label: 'Static' },
              { value: 'random', label: 'Random' }
            ]}
            onChange={value => updateGeometric('spheres', { movementPattern: value as any })}
          />
        </ControlSection>

        {/* Cubes Controls */}
        <ControlSection title="Cubes">
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
            label="Speed"
            value={geometric.cubes.speed || 1.0}
            min={0}
            max={5}
            onChange={(value) => updateGeometric('cubes', { speed: value })}
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
          <SliderControl
            label="Distance"
            value={geometric.cubes.distance || 2.5}
            min={0.1}
            max={10}
            step={0.1}
            onChange={(value) => updateGeometric('cubes', { distance: value })}
          />
          <SelectControl
            label="Movement Pattern"
            value={geometric.cubes.movementPattern}
            options={[
              { value: 'orbit', label: 'Orbit' },
              { value: 'verticalSine', label: 'Vertical Sine' },
              { value: 'static', label: 'Static' },
              { value: 'random', label: 'Random' }
            ]}
            onChange={value => updateGeometric('cubes', { movementPattern: value as any })}
          />
        </ControlSection>

        {/* Toruses Controls */}
        <ControlSection title="Toruses">
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
            label="Rotation"
            value={geometric.toruses.rotation || 1.0}
            min={0}
            max={5}
            step={0.01}
            onChange={(value) => updateGeometric('toruses', { rotation: value })}
          />
          <SliderControl
            label="Opacity"
            value={geometric.toruses.opacity || 0.5}
            min={0}
            max={1}
            onChange={(value) => updateGeometric('toruses', { opacity: value })}
          />
          <SliderControl
            label="Distance"
            value={geometric.toruses.distance || 2.0}
            min={0.1}
            max={10}
            step={0.1}
            onChange={(value) => updateGeometric('toruses', { distance: value })}
          />
          <SelectControl
            label="Movement Pattern"
            value={geometric.toruses.movementPattern}
            options={[
              { value: 'orbit', label: 'Orbit' },
              { value: 'verticalSine', label: 'Vertical Sine' },
              { value: 'static', label: 'Static' },
              { value: 'random', label: 'Random' }
            ]}
            onChange={value => updateGeometric('toruses', { movementPattern: value as any })}
          />
        </ControlSection>

        {/* Organic Blobs Controls */}
        <ControlSection title="Organic Blobs">
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
          <SliderControl
            label="Distance"
            value={geometric.blobs.distance || 3.0}
            min={0.1}
            max={10}
            step={0.1}
            onChange={(value) => updateGeometric('blobs', { distance: value })}
          />
          <SelectControl
            label="Movement Pattern"
            value={geometric.blobs.movementPattern}
            options={[
              { value: 'orbit', label: 'Orbit' },
              { value: 'verticalSine', label: 'Vertical Sine' },
              { value: 'static', label: 'Static' },
              { value: 'random', label: 'Random' }
            ]}
            onChange={value => updateGeometric('blobs', { movementPattern: value as any })}
          />
        </ControlSection>

        {/* Metamorphosis Controls */}
        <ControlSection title="Metamorphosis">
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
        </ControlSection>

        {/* Fireflies Controls */}
        <ControlSection title="Fireflies">
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
        </ControlSection>

        {/* Wave Interference Controls */}
        <ControlSection title="Wave Interference">
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
          
          {/* Edge Fade Controls */}
          <ToggleControl
            label="Edge Fade"
            value={globalEffects.waveInterference.edgeFade?.enabled ?? true}
            onChange={(value: boolean) => updateGlobalEffects({ 
              waveInterference: { 
                ...globalEffects.waveInterference, 
                edgeFade: { 
                  enabled: value,
                  fadeStart: globalEffects.waveInterference.edgeFade?.fadeStart ?? 0.3,
                  fadeEnd: globalEffects.waveInterference.edgeFade?.fadeEnd ?? 0.5
                }
              }
            })}
          />
          <SliderControl
            label="Fade Start"
            value={globalEffects.waveInterference.edgeFade?.fadeStart ?? 0.3}
            min={0.1}
            max={0.8}
            step={0.05}
            onChange={(value: number) => updateGlobalEffects({ 
              waveInterference: { 
                ...globalEffects.waveInterference, 
                edgeFade: { 
                  enabled: globalEffects.waveInterference.edgeFade?.enabled ?? true,
                  fadeStart: value,
                  fadeEnd: globalEffects.waveInterference.edgeFade?.fadeEnd ?? 0.5
                }
              }
            })}
          />
          <SliderControl
            label="Fade End"
            value={globalEffects.waveInterference.edgeFade?.fadeEnd ?? 0.5}
            min={0.2}
            max={0.9}
            step={0.05}
            onChange={(value: number) => updateGlobalEffects({ 
              waveInterference: { 
                ...globalEffects.waveInterference, 
                edgeFade: { 
                  enabled: globalEffects.waveInterference.edgeFade?.enabled ?? true,
                  fadeStart: globalEffects.waveInterference.edgeFade?.fadeStart ?? 0.3,
                  fadeEnd: value
                }
              }
            })}
          />
          
          <ColorControl
            label="Color"
            value={geometric.waveInterference?.color || '#333333'}
            onChange={(value) => updateGeometric('waveInterference', { color: value })}
          />
        </ControlSection>

        {/* Layered Sine Waves Controls */}
        <ControlSection title="Layered Sine Waves">
          <ToggleControl
            label="Enable"
            value={globalEffects.layeredSineWaves?.enabled ?? false}
            onChange={(value: boolean) => updateGlobalEffects({ 
              layeredSineWaves: { ...globalEffects.layeredSineWaves, enabled: value }
            })}
          />
          <SliderControl
            label="Layers"
            value={globalEffects.layeredSineWaves?.layers ?? 80}
            min={10}
            max={200}
            step={5}
            onChange={(value: number) => updateGlobalEffects({ 
              layeredSineWaves: { ...globalEffects.layeredSineWaves, layers: value }
            })}
          />
          <SliderControl
            label="Points"
            value={globalEffects.layeredSineWaves?.points ?? 200}
            min={50}
            max={500}
            step={10}
            onChange={(value: number) => updateGlobalEffects({ 
              layeredSineWaves: { ...globalEffects.layeredSineWaves, points: value }
            })}
          />
          <SliderControl
            label="Wave Amplitude"
            value={globalEffects.layeredSineWaves?.waveAmplitude ?? 40}
            min={10}
            max={100}
            step={5}
            onChange={(value: number) => updateGlobalEffects({ 
              layeredSineWaves: { ...globalEffects.layeredSineWaves, waveAmplitude: value }
            })}
          />
          <SliderControl
            label="Speed"
            value={globalEffects.layeredSineWaves?.speed ?? 0.5}
            min={0.1}
            max={2.0}
            step={0.1}
            onChange={(value: number) => updateGlobalEffects({ 
              layeredSineWaves: { ...globalEffects.layeredSineWaves, speed: value }
            })}
          />
          <SliderControl
            label="Opacity"
            value={globalEffects.layeredSineWaves?.opacity ?? 0.5}
            min={0.1}
            max={1.0}
            step={0.1}
            onChange={(value: number) => updateGlobalEffects({ 
              layeredSineWaves: { ...globalEffects.layeredSineWaves, opacity: value }
            })}
          />
          <SliderControl
            label="Line Width"
            value={globalEffects.layeredSineWaves?.lineWidth ?? 0.6}
            min={0.1}
            max={2.0}
            step={0.1}
            onChange={(value: number) => updateGlobalEffects({ 
              layeredSineWaves: { ...globalEffects.layeredSineWaves, lineWidth: value }
            })}
          />
          <SliderControl
            label="Size"
            value={globalEffects.layeredSineWaves?.size ?? 1.0}
            min={0.1}
            max={3.0}
            step={0.1}
            onChange={(value: number) => updateGlobalEffects({ 
              layeredSineWaves: { ...globalEffects.layeredSineWaves, size: value }
            })}
          />
          <SliderControl
            label="Width"
            value={globalEffects.layeredSineWaves?.width ?? 100}
            min={20}
            max={200}
            step={10}
            onChange={(value: number) => updateGlobalEffects({ 
              layeredSineWaves: { ...globalEffects.layeredSineWaves, width: value }
            })}
          />
          <SliderControl
            label="Height"
            value={globalEffects.layeredSineWaves?.height ?? 100}
            min={20}
            max={200}
            step={10}
            onChange={(value: number) => updateGlobalEffects({ 
              layeredSineWaves: { ...globalEffects.layeredSineWaves, height: value }
            })}
          />
          
          {/* Edge Fade Controls */}
          <ToggleControl
            label="Edge Fade"
            value={globalEffects.layeredSineWaves?.edgeFade?.enabled ?? true}
            onChange={(value: boolean) => updateGlobalEffects({ 
              layeredSineWaves: { 
                ...globalEffects.layeredSineWaves, 
                edgeFade: { 
                  enabled: value,
                  fadeStart: globalEffects.layeredSineWaves?.edgeFade?.fadeStart ?? 0.3,
                  fadeEnd: globalEffects.layeredSineWaves?.edgeFade?.fadeEnd ?? 0.5
                }
              }
            })}
          />
          <SliderControl
            label="Fade Start"
            value={globalEffects.layeredSineWaves?.edgeFade?.fadeStart ?? 0.3}
            min={0.1}
            max={0.8}
            step={0.05}
            onChange={(value: number) => updateGlobalEffects({ 
              layeredSineWaves: { 
                ...globalEffects.layeredSineWaves, 
                edgeFade: { 
                  enabled: globalEffects.layeredSineWaves?.edgeFade?.enabled ?? true,
                  fadeStart: value,
                  fadeEnd: globalEffects.layeredSineWaves?.edgeFade?.fadeEnd ?? 0.5
                }
              }
            })}
          />
          <SliderControl
            label="Fade End"
            value={globalEffects.layeredSineWaves?.edgeFade?.fadeEnd ?? 0.5}
            min={0.2}
            max={0.9}
            step={0.05}
            onChange={(value: number) => updateGlobalEffects({ 
              layeredSineWaves: { 
                ...globalEffects.layeredSineWaves, 
                edgeFade: { 
                  enabled: globalEffects.layeredSineWaves?.edgeFade?.enabled ?? true,
                  fadeStart: globalEffects.layeredSineWaves?.edgeFade?.fadeStart ?? 0.3,
                  fadeEnd: value
                }
              }
            })}
          />
          
          <ColorControl
            label="Color"
            value={geometric.layeredSineWaves?.color || '#323232'}
            onChange={(value) => updateGeometric('layeredSineWaves', { color: value })}
          />
        </ControlSection>
      </div>
    </div>
  );
}); 