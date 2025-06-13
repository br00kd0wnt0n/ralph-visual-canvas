import React from 'react';
import { useVisualStore } from '../store/visualStore';
import type { VisualState } from '../store/visualStore';

const SliderControl = ({ 
  label, 
  value, 
  min, 
  max, 
  step = 0.1, 
  onChange 
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) => (
  <div className="control-group">
    <label>{label}: {value.toFixed(2)}</label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="slider"
    />
  </div>
);

const ColorControl = ({ 
  label, 
  value, 
  onChange 
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="control-group">
    <label>{label}</label>
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="color-picker"
    />
  </div>
);

const ToggleControl = ({
  label,
  value,
  onChange
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) => (
  <div className="control-group">
    <label>{label}</label>
    <input
      type="checkbox"
      checked={value}
      onChange={(e) => onChange(e.target.checked)}
      className="toggle"
    />
  </div>
);

const isSphereOrTorus = (shape: string, config: any): config is { speed: number } => {
  return shape === 'spheres' || shape === 'toruses';
};

const isCube = (shape: string, config: any): config is { rotation: number } => {
  return shape === 'cubes';
};

export const Dashboard = () => {
  const {
    background,
    geometric,
    particles,
    effects,
    updateBackground,
    updateGeometric,
    updateParticles,
    updateEffects,
    resetToDefaults,
    savePreset,
    loadPreset,
  } = useVisualStore();

  const [presetName, setPresetName] = React.useState('');

  const handleNumberChange = (section: 'background' | 'particles' | 'effects', key: string, value: number) => {
    switch (section) {
      case 'background':
        updateBackground({ [key]: value });
        break;
      case 'particles':
        updateParticles({ [key]: value });
        break;
      case 'effects':
        updateEffects({ [key]: value });
        break;
    }
  };

  const handleColorChange = (section: 'background' | 'particles', key: string, value: string) => {
    switch (section) {
      case 'background':
        updateBackground({ [key]: value });
        break;
      case 'particles':
        updateParticles({ [key]: value });
        break;
    }
  };

  return (
    <div className="dashboard">
      <div className="section">
        <h2>Background</h2>
        <SliderControl
          label="Opacity"
          value={background.opacity}
          min={0}
          max={1}
          onChange={(value) => handleNumberChange('background', 'opacity', value)}
        />
        <SliderControl
          label="Blur"
          value={background.blur}
          min={0}
          max={10}
          onChange={(value) => handleNumberChange('background', 'blur', value)}
        />
        <ColorControl
          label="Color"
          value={background.color}
          onChange={(value) => handleColorChange('background', 'color', value)}
        />
        <ToggleControl
          label="Gradient"
          value={background.gradient}
          onChange={(value) => updateBackground({ gradient: value })}
        />
      </div>

      <div className="section">
        <h2>Geometric Shapes</h2>
        {Object.entries(geometric).map(([shape, config]) => (
          <div key={shape} className="subsection">
            <h3>{shape.charAt(0).toUpperCase() + shape.slice(1)}</h3>
            <SliderControl
              label="Count"
              value={config.count}
              min={0}
              max={20}
              step={1}
              onChange={(value) => updateGeometric(shape as keyof typeof geometric, { count: value })}
            />
            <SliderControl
              label="Size"
              value={config.size}
              min={0.1}
              max={2}
              onChange={(value) => updateGeometric(shape as keyof typeof geometric, { size: value })}
            />
            <ColorControl
              label="Color"
              value={config.color}
              onChange={(value) => updateGeometric(shape as keyof typeof geometric, { color: value })}
            />
            <SliderControl
              label="Opacity"
              value={config.opacity}
              min={0}
              max={1}
              onChange={(value) => updateGeometric(shape as keyof typeof geometric, { opacity: value })}
            />
            {isSphereOrTorus(shape, config) && (
              <SliderControl
                label="Speed"
                value={config.speed}
                min={0}
                max={2}
                onChange={(value) => updateGeometric(shape as keyof typeof geometric, { speed: value })}
              />
            )}
            {isCube(shape, config) && (
              <SliderControl
                label="Rotation"
                value={config.rotation}
                min={0}
                max={2}
                onChange={(value) => updateGeometric(shape as keyof typeof geometric, { rotation: value })}
              />
            )}
          </div>
        ))}
      </div>

      <div className="section">
        <h2>Particles</h2>
        <SliderControl
          label="Count"
          value={particles.count}
          min={0}
          max={1000}
          step={10}
          onChange={(value) => handleNumberChange('particles', 'count', value)}
        />
        <SliderControl
          label="Size"
          value={particles.size}
          min={0.01}
          max={0.5}
          onChange={(value) => handleNumberChange('particles', 'size', value)}
        />
        <ColorControl
          label="Color"
          value={particles.color}
          onChange={(value) => handleColorChange('particles', 'color', value)}
        />
        <SliderControl
          label="Speed"
          value={particles.speed}
          min={0}
          max={3}
          onChange={(value) => handleNumberChange('particles', 'speed', value)}
        />
        <SliderControl
          label="Opacity"
          value={particles.opacity}
          min={0}
          max={1}
          onChange={(value) => handleNumberChange('particles', 'opacity', value)}
        />
        <SliderControl
          label="Spread"
          value={particles.spread}
          min={1}
          max={20}
          onChange={(value) => handleNumberChange('particles', 'spread', value)}
        />
      </div>

      <div className="section">
        <h2>Effects</h2>
        <SliderControl
          label="Glow"
          value={effects.glow}
          min={0}
          max={1}
          onChange={(value) => handleNumberChange('effects', 'glow', value)}
        />
        <SliderControl
          label="Contrast"
          value={effects.contrast}
          min={0.5}
          max={2}
          onChange={(value) => handleNumberChange('effects', 'contrast', value)}
        />
        <SliderControl
          label="Saturation"
          value={effects.saturation}
          min={0}
          max={2}
          onChange={(value) => handleNumberChange('effects', 'saturation', value)}
        />
        <SliderControl
          label="Hue"
          value={effects.hue}
          min={0}
          max={360}
          step={1}
          onChange={(value) => handleNumberChange('effects', 'hue', value)}
        />
      </div>

      <div className="section">
        <h2>Presets</h2>
        <div className="preset-controls">
          <input
            type="text"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="Preset name"
            className="preset-input"
          />
          <button onClick={() => savePreset(presetName)} className="preset-button">
            Save Preset
          </button>
          <button onClick={() => loadPreset(presetName)} className="preset-button">
            Load Preset
          </button>
          <button onClick={resetToDefaults} className="preset-button">
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}; 