import React, { useState } from 'react';
import { useVisualStore } from '../store/visualStore';
import styles from './ShapeParticleDashboard.module.css';
import CollapsibleSection from './CollapsibleSection';

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

export const ShapeParticleDashboard = React.memo(() => {
  const { geometric, particles, globalEffects, updateGeometric, updateParticles, updateGlobalEffects } = useVisualStore();

  // Create safe defaults for globalEffects
  const defaultGlobalEffects = {
    atmosphericBlur: {
      enabled: false,
      intensity: 0.5,
      layers: 5,
    },
    colorBlending: {
      enabled: false,
      mode: 'screen',
      intensity: 0.5,
    },
    shapeGlow: {
      enabled: false,
      intensity: 0.4,
      radius: 20,
      useObjectColor: true,
      customColor: '#ffffff',
      pulsing: false,
      pulseSpeed: 1.0,
    },
    chromatic: {
      enabled: false,
      aberration: 0,
      aberrationColors: {
        red: '#ff0000',
        green: '#00ff00',
        blue: '#0000ff',
      },
      rainbow: {
        enabled: false,
        intensity: 0,
        speed: 1,
        rotation: 0,
        blendMode: 'screen',
        colors: [
          '#ff0000',
          '#ff7f00',
          '#ffff00',
          '#00ff00',
          '#0000ff',
          '#4b0082',
          '#9400d3'
        ],
        opacity: 0.3
      },
      prism: 0,
    },
    distortion: {
      enabled: false,
      wave: 0,
      ripple: 0,
      noise: 0,
      frequency: 1,
    },
    particleInteraction: {
      enabled: false,
      magnetism: 0,
      repulsion: 0,
      flowField: false,
      turbulence: 0,
    },
    volumetric: {
      enabled: false,
      fog: 0,
      lightShafts: 0,
      density: 0.5,
      color: '#4169e1',
    },
    trails: {
      enabled: true,
      sphereTrails: {
        enabled: true,
        length: 150,
        opacity: 0.6,
        width: 0.8,
        fadeRate: 0.3,
      },
      cubeTrails: {
        enabled: true,
        length: 120,
        opacity: 0.5,
        width: 0.7,
        fadeRate: 0.4,
      },
      blobTrails: {
        enabled: true,
        length: 200,
        opacity: 0.7,
        width: 0.9,
        fadeRate: 0.2,
      },
      torusTrails: {
        enabled: true,
        length: 100,
        opacity: 0.5,
        width: 0.6,
        fadeRate: 0.5,
      },
      particleTrails: {
        enabled: true,
        length: 300,
        opacity: 0.8,
        width: 0.3,
        fadeRate: 0.1,
      },
    },
    waveInterference: {
      enabled: false,
      speed: 0.5,
      amplitude: 0.5,
      contourLevels: 5,
      preset: 1,
      edgeFade: {
        enabled: true,
        fadeStart: 0.3,
        fadeEnd: 0.5,
      },
    },
    metamorphosis: {
      enabled: true,
      morphSpeed: 0.5,
      rotationSpeed: 0.5,
      wireframeOpacity: 0.8,
      size: 1.5,
      blur: 0.0,
      intensity: 1.0,
      layers: 1,
    },
    fireflies: {
      enabled: false,
      count: 100,
      speed: 0.5,
      glowIntensity: 0.5,
      swarmRadius: 20,
    },
    layeredSineWaves: {
      enabled: false,
      layers: 80,
      points: 200,
      waveAmplitude: 40,
      speed: 0.5,
      opacity: 0.5,
      lineWidth: 0.6,
      size: 1.0,
      width: 100,
      height: 100,
      intensity: 1.0,
      layerCount: 1,
      edgeFade: {
        enabled: true,
        fadeStart: 0.3,
        fadeEnd: 0.5,
      },
    },
  };

  // Deep merge function
  const deepMerge = (defaults: any, actual: any): any => {
    if (!actual) return defaults;
    const result = { ...defaults };
    for (const key in actual) {
      if (actual[key] && typeof actual[key] === 'object' && !Array.isArray(actual[key])) {
        result[key] = deepMerge(defaults[key] || {}, actual[key]);
      } else if (actual[key] !== undefined) {
        result[key] = actual[key];
      }
    }
    return result;
  };

  // Safe globalEffects
  const safeGlobalEffects = deepMerge(defaultGlobalEffects, globalEffects);

  // Safe update function
  const safeUpdateGlobalEffects = (updates: any) => {
    const currentSafe = deepMerge(defaultGlobalEffects, globalEffects);
    const updated = deepMerge(currentSafe, updates);
    updateGlobalEffects(updated);
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 text-white shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-purple-400">Shapes & Particles</h2>
      </div>

      <div className={styles.tabContent}>
        {/* Particles Controls */}
        <CollapsibleSection title="Particles" defaultExpanded={false}>
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
            max={10.0}
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
            value={particles.spread || 40}
            min={10}
            max={100}
            onChange={(value) => updateParticles({ spread: value })}
          />
          <SelectControl
            label="Movement Pattern"
            value={particles.movementPattern || 'random'}
            options={[
              { value: 'orbit', label: 'Orbit' },
              { value: 'verticalSine', label: 'Vertical Sine' },
              { value: 'static', label: 'Static' },
              { value: 'random', label: 'Random' }
            ]}
            onChange={(value) => updateParticles({ movementPattern: value as any })}
          />
          <SliderControl
            label="Distance"
            value={particles.distance || 1.5}
            min={0.5}
            max={10}
            step={0.1}
            onChange={(value) => updateParticles({ distance: value })}
          />
          <ToggleControl
            label="Pulse Enabled"
            value={particles.pulseEnabled || false}
            onChange={(value) => updateParticles({ pulseEnabled: value })}
          />
          {particles.pulseEnabled && (
            <SliderControl
              label="Pulse Size"
              value={particles.pulseSize || 1.0}
              min={0.5}
              max={3.0}
              step={0.1}
              onChange={(value) => updateParticles({ pulseSize: value })}
            />
          )}
        </CollapsibleSection>

        {/* Spheres Controls */}
        <CollapsibleSection title="Spheres" defaultExpanded={false}>
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
            max={15}
            onChange={(value) => updateGeometric('spheres', { size: value })}
          />
          <SliderControl
            label="Organicness"
            value={geometric.spheres.organicness || 0}
            min={0}
            max={5}
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
          <ToggleControl
            label="Pulse"
            value={geometric.spheres.pulseEnabled}
            onChange={(value) => updateGeometric('spheres', { pulseEnabled: value })}
          />
          {geometric.spheres.pulseEnabled && (
            <SliderControl
              label="Pulse Size"
              value={geometric.spheres.pulseSize}
              min={0.1}
              max={3}
              onChange={(value) => updateGeometric('spheres', { pulseSize: value })}
            />
          )}
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
        </CollapsibleSection>

        {/* Cubes Controls */}
        <CollapsibleSection title="Cubes" defaultExpanded={false}>
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
            max={15}
            onChange={(value) => updateGeometric('cubes', { size: value })}
          />
          <SliderControl
            label="Organicness"
            value={geometric.cubes.organicness || 0}
            min={0}
            max={5}
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
          <ToggleControl
            label="Pulse"
            value={geometric.cubes.pulseEnabled}
            onChange={(value) => updateGeometric('cubes', { pulseEnabled: value })}
          />
          {geometric.cubes.pulseEnabled && (
            <SliderControl
              label="Pulse Size"
              value={geometric.cubes.pulseSize}
              min={0.1}
              max={3}
              onChange={(value) => updateGeometric('cubes', { pulseSize: value })}
            />
          )}
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
        </CollapsibleSection>

        {/* Toruses Controls */}
        <CollapsibleSection title="Toruses" defaultExpanded={false}>
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
            max={15}
            onChange={(value) => updateGeometric('toruses', { size: value })}
          />
          <SliderControl
            label="Organicness"
            value={geometric.toruses.organicness || 0}
            min={0}
            max={5}
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
          <ToggleControl
            label="Pulse"
            value={geometric.toruses.pulseEnabled}
            onChange={(value) => updateGeometric('toruses', { pulseEnabled: value })}
          />
          {geometric.toruses.pulseEnabled && (
            <SliderControl
              label="Pulse Size"
              value={geometric.toruses.pulseSize}
              min={0.1}
              max={3}
              onChange={(value) => updateGeometric('toruses', { pulseSize: value })}
            />
          )}
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
        </CollapsibleSection>

        {/* Organic Blobs Controls */}
        <CollapsibleSection title="Organic Blobs" defaultExpanded={false}>
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
            max={15}
            onChange={(value) => updateGeometric('blobs', { size: value })}
          />
          <SliderControl
            label="Organicness"
            value={geometric.blobs.organicness || 1.5}
            min={0}
            max={5}
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
          <ToggleControl
            label="Pulse"
            value={geometric.blobs.pulseEnabled}
            onChange={(value) => updateGeometric('blobs', { pulseEnabled: value })}
          />
          {geometric.blobs.pulseEnabled && (
          <SliderControl
              label="Pulse Size"
              value={geometric.blobs.pulseSize}
            min={0.1}
              max={3}
              onChange={(value) => updateGeometric('blobs', { pulseSize: value })}
          />
          )}
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
        </CollapsibleSection>

        {/* Fireflies Controls */}
        <CollapsibleSection title="Fireflies" defaultExpanded={false}>
          <ToggleControl
            label="Enable"
            value={safeGlobalEffects.fireflies?.enabled ?? false}
            onChange={(value: boolean) => safeUpdateGlobalEffects({ 
              fireflies: { ...safeGlobalEffects.fireflies, enabled: value }
            })}
          />
          <SliderControl
            label="Count"
            value={safeGlobalEffects.fireflies?.count ?? 50}
            min={10}
            max={100}
            step={5}
            onChange={(value: number) => safeUpdateGlobalEffects({ 
              fireflies: { ...safeGlobalEffects.fireflies, count: value }
            })}
          />
          <SliderControl
            label="Speed"
            value={safeGlobalEffects.fireflies?.speed ?? 1}
            min={0.1}
            max={3}
            step={0.1}
            onChange={(value: number) => safeUpdateGlobalEffects({ 
              fireflies: { ...safeGlobalEffects.fireflies, speed: value }
            })}
          />
          <SliderControl
            label="Glow Intensity"
            value={safeGlobalEffects.fireflies?.glowIntensity ?? 1}
            min={0.1}
            max={2}
            step={0.1}
            onChange={(value: number) => safeUpdateGlobalEffects({ 
              fireflies: { ...safeGlobalEffects.fireflies, glowIntensity: value }
            })}
          />
          <SliderControl
            label="Swarm Radius"
            value={safeGlobalEffects.fireflies?.swarmRadius ?? 30}
            min={10}
            max={50}
            step={5}
            onChange={(value: number) => safeUpdateGlobalEffects({ 
              fireflies: { ...safeGlobalEffects.fireflies, swarmRadius: value }
            })}
          />
          <ColorControl
            label="Color"
            value={geometric.fireflies?.color || '#ffff88'}
            onChange={(value) => updateGeometric('fireflies', { color: value })}
          />
        </CollapsibleSection>

        {/* Metamorphosis Controls */}
        <CollapsibleSection title="Metamorphosis" defaultExpanded={false}>
          <ToggleControl
            label="Enable"
            value={safeGlobalEffects.metamorphosis?.enabled ?? false}
            onChange={(value: boolean) => safeUpdateGlobalEffects({ 
              metamorphosis: { ...safeGlobalEffects.metamorphosis, enabled: value }
            })}
          />
          <SliderControl
            label="Intensity"
            value={safeGlobalEffects.metamorphosis?.intensity ?? 1.0}
            min={0.1}
            max={3.0}
            step={0.1}
            onChange={(value: number) => safeUpdateGlobalEffects({ 
              metamorphosis: { ...safeGlobalEffects.metamorphosis, intensity: value }
            })}
          />
          <SliderControl
            label="Layers"
            value={safeGlobalEffects.metamorphosis?.layers ?? 1}
            min={1}
            max={5}
            step={1}
            onChange={(value: number) => safeUpdateGlobalEffects({ 
              metamorphosis: { ...safeGlobalEffects.metamorphosis, layers: value }
            })}
          />
          <SliderControl
            label="Morph Speed"
            value={safeGlobalEffects.metamorphosis?.morphSpeed ?? 1}
            min={0.1}
            max={3}
            step={0.1}
            onChange={(value: number) => safeUpdateGlobalEffects({ 
              metamorphosis: { ...safeGlobalEffects.metamorphosis, morphSpeed: value }
            })}
          />
          <SliderControl
            label="Rotation Speed"
            value={safeGlobalEffects.metamorphosis?.rotationSpeed ?? 1}
            min={0}
            max={2}
            step={0.1}
            onChange={(value: number) => safeUpdateGlobalEffects({ 
              metamorphosis: { ...safeGlobalEffects.metamorphosis, rotationSpeed: value }
            })}
          />
          <SliderControl
            label="Wireframe Opacity"
            value={safeGlobalEffects.metamorphosis?.wireframeOpacity ?? 0.4}
            min={0.1}
            max={1}
            step={0.1}
            onChange={(value: number) => safeUpdateGlobalEffects({ 
              metamorphosis: { ...safeGlobalEffects.metamorphosis, wireframeOpacity: value }
            })}
          />
          <SliderControl
            label="Size"
            value={safeGlobalEffects.metamorphosis?.size ?? 1.0}
            min={0.1}
            max={15.0}
            step={0.1}
            onChange={(value: number) => safeUpdateGlobalEffects({ 
              metamorphosis: { ...safeGlobalEffects.metamorphosis, size: value }
            })}
          />
          <SliderControl
            label="Blur"
            value={safeGlobalEffects.metamorphosis?.blur ?? 0.0}
            min={0.0}
            max={1.0}
            step={0.1}
            onChange={(value: number) => safeUpdateGlobalEffects({ 
              metamorphosis: { ...safeGlobalEffects.metamorphosis, blur: value }
            })}
          />
          <ColorControl
            label="Color"
            value={geometric.metamorphosis?.color || '#333333'}
            onChange={(value) => updateGeometric('metamorphosis', { color: value })}
          />
        </CollapsibleSection>

        {/* Wave Interference Controls */}
        <CollapsibleSection title="Wave Interference" defaultExpanded={false}>
          <ToggleControl
            label="Enable"
            value={safeGlobalEffects.waveInterference.enabled}
            onChange={(value: boolean) => safeUpdateGlobalEffects({ 
              waveInterference: { ...safeGlobalEffects.waveInterference, enabled: value }
            })}
          />
          <SelectControl
            label="Preset"
            value={safeGlobalEffects.waveInterference.preset?.toString() || "1"}
            options={[
              { value: "1", label: "1 - Classic Interference" },
              { value: "2", label: "2 - Spiral Waves" },
              { value: "3", label: "3 - Chaotic Turbulence" },
              { value: "4", label: "4 - Harmonic Resonance" }
            ]}
            onChange={(value: string) => safeUpdateGlobalEffects({ 
              waveInterference: { ...safeGlobalEffects.waveInterference, preset: parseInt(value) }
            })}
          />
          {/* Preset descriptions */}
          <div className="text-xs text-gray-400 mt-1 mb-2 px-2">
            {safeGlobalEffects.waveInterference.preset === 1 && "Traditional wave interference with grid sources"}
            {safeGlobalEffects.waveInterference.preset === 2 && "Concentric spiral wave pattern with rotation effects"}
            {safeGlobalEffects.waveInterference.preset === 3 && "Random chaotic wave interference with noise"}
            {safeGlobalEffects.waveInterference.preset === 4 && "Harmonic wave patterns with frequency relationships"}
          </div>
          <SliderControl
            label="Speed"
            value={safeGlobalEffects.waveInterference.speed || 0.5}
            min={0.1}
            max={2.0}
            step={0.1}
            onChange={(value: number) => safeUpdateGlobalEffects({ 
              waveInterference: { ...safeGlobalEffects.waveInterference, speed: value }
            })}
          />
          <SliderControl
            label="Amplitude"
            value={safeGlobalEffects.waveInterference.amplitude || 0.5}
            min={0.1}
            max={2.0}
            step={0.1}
            onChange={(value: number) => safeUpdateGlobalEffects({ 
              waveInterference: { ...safeGlobalEffects.waveInterference, amplitude: value }
            })}
          />
          <SliderControl
            label="Contour Levels"
            value={safeGlobalEffects.waveInterference.contourLevels || 5}
            min={2}
            max={20}
            step={1}
            onChange={(value: number) => safeUpdateGlobalEffects({ 
              waveInterference: { ...safeGlobalEffects.waveInterference, contourLevels: value }
            })}
          />
          
          {/* Edge Fade Controls */}
          <ToggleControl
            label="Edge Fade"
            value={safeGlobalEffects.waveInterference.edgeFade?.enabled ?? true}
            onChange={(value: boolean) => safeUpdateGlobalEffects({ 
              waveInterference: { 
                ...safeGlobalEffects.waveInterference, 
                edgeFade: { 
                  enabled: value,
                  fadeStart: safeGlobalEffects.waveInterference.edgeFade?.fadeStart ?? 0.3,
                  fadeEnd: safeGlobalEffects.waveInterference.edgeFade?.fadeEnd ?? 0.5
                }
              }
            })}
          />
          <SliderControl
            label="Fade Start"
            value={safeGlobalEffects.waveInterference.edgeFade?.fadeStart ?? 0.3}
            min={0.1}
            max={0.8}
            step={0.05}
            onChange={(value: number) => safeUpdateGlobalEffects({ 
              waveInterference: { 
                ...safeGlobalEffects.waveInterference, 
                edgeFade: { 
                  enabled: safeGlobalEffects.waveInterference.edgeFade?.enabled ?? true,
                  fadeStart: value,
                  fadeEnd: safeGlobalEffects.waveInterference.edgeFade?.fadeEnd ?? 0.5
                }
              }
            })}
          />
          <SliderControl
            label="Fade End"
            value={safeGlobalEffects.waveInterference.edgeFade?.fadeEnd ?? 0.5}
            min={0.2}
            max={0.9}
            step={0.05}
            onChange={(value: number) => safeUpdateGlobalEffects({ 
              waveInterference: { 
                ...safeGlobalEffects.waveInterference, 
                edgeFade: { 
                  enabled: safeGlobalEffects.waveInterference.edgeFade?.enabled ?? true,
                  fadeStart: safeGlobalEffects.waveInterference.edgeFade?.fadeStart ?? 0.3,
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
        </CollapsibleSection>

        {/* Layered Sine Waves Controls */}
        <CollapsibleSection title="Layered Sine Waves" defaultExpanded={false}>
          <ToggleControl
            label="Enable"
            value={globalEffects.layeredSineWaves?.enabled ?? false}
            onChange={(value: boolean) => updateGlobalEffects({ 
              layeredSineWaves: { ...globalEffects.layeredSineWaves, enabled: value }
            })}
          />
          <SliderControl
            label="Intensity"
            value={globalEffects.layeredSineWaves?.intensity ?? 1.0}
            min={0.1}
            max={3.0}
            step={0.1}
            onChange={(value: number) => updateGlobalEffects({ 
              layeredSineWaves: { ...globalEffects.layeredSineWaves, intensity: value }
            })}
          />
          <SliderControl
            label="Layer Count"
            value={globalEffects.layeredSineWaves?.layerCount ?? 1}
            min={1}
            max={5}
            step={1}
            onChange={(value: number) => updateGlobalEffects({ 
              layeredSineWaves: { ...globalEffects.layeredSineWaves, layerCount: value }
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
            max={15.0}
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
        </CollapsibleSection>
      </div>
    </div>
  );
}); 