import React from 'react';
import { useVisualStore } from '../store/visualStore';
import styles from './GlobalEffectsDashboard.module.css';

const SliderControl = ({ 
  label, 
  value, 
  min, 
  max, 
  step = 0.1, 
  onChange,
  disabled = false 
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) => (
  <div className={styles.controlGroup}>
    <label className={disabled ? styles.disabled : ''}>{label}: {value.toFixed(2)}</label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className={styles.slider}
      disabled={disabled}
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
  <div className={styles.controlGroup}>
    <label className={styles.toggleLabel}>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className={styles.toggleCheckbox}
      />
      <span className={styles.toggleSwitch}></span>
      {label}
    </label>
  </div>
);

const SelectControl = ({ 
  label, 
  value, 
  options, 
  onChange 
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) => (
  <div className={styles.controlGroup}>
    <label>{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles.selectControl}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export const GlobalEffectsDashboard = () => {
  const { globalEffects, effects, updateGlobalEffects, updateEffects } = useVisualStore();

  const blendModeOptions = [
    { value: 'screen', label: 'Screen' },
    { value: 'multiply', label: 'Multiply' },
    { value: 'overlay', label: 'Overlay' },
    { value: 'soft-light', label: 'Soft Light' },
    { value: 'hard-light', label: 'Hard Light' },
    { value: 'color-dodge', label: 'Color Dodge' },
  ];

  return (
    <div className={styles.globalEffectsWrapper}>
      <div className={styles.globalEffectsSections}>
        {/* Atmospheric Blur */}
        <div className={styles.controlSection}>
          <h3>🌫️ Atmospheric Blur</h3>
          <ToggleControl
            label="Enable"
            value={globalEffects.atmosphericBlur.enabled}
            onChange={(value) => updateGlobalEffects({ 
              atmosphericBlur: { ...globalEffects.atmosphericBlur, enabled: value }
            })}
          />
          <SliderControl
            label="Intensity"
            value={globalEffects.atmosphericBlur.intensity}
            min={0}
            max={2}
            onChange={(value) => updateGlobalEffects({ 
              atmosphericBlur: { ...globalEffects.atmosphericBlur, intensity: value }
            })}
            disabled={!globalEffects.atmosphericBlur.enabled}
          />
          <SliderControl
            label="Layers"
            value={globalEffects.atmosphericBlur.layers}
            min={1}
            max={8}
            step={1}
            onChange={(value) => updateGlobalEffects({ 
              atmosphericBlur: { ...globalEffects.atmosphericBlur, layers: value }
            })}
            disabled={!globalEffects.atmosphericBlur.enabled}
          />
        </div>

        {/* Color Blending */}
        <div className={styles.controlSection}>
          <h3>🎨 Color Blending</h3>
          <ToggleControl
            label="Enable"
            value={globalEffects.colorBlending.enabled}
            onChange={(value) => updateGlobalEffects({ 
              colorBlending: { ...globalEffects.colorBlending, enabled: value }
            })}
          />
          <SelectControl
            label="Blend Mode"
            value={globalEffects.colorBlending.mode}
            options={blendModeOptions}
            onChange={(value) => updateGlobalEffects({ 
              colorBlending: { ...globalEffects.colorBlending, mode: value as any }
            })}
          />
          <SliderControl
            label="Intensity"
            value={globalEffects.colorBlending.intensity}
            min={0}
            max={2}
            onChange={(value) => updateGlobalEffects({ 
              colorBlending: { ...globalEffects.colorBlending, intensity: value }
            })}
            disabled={!globalEffects.colorBlending.enabled}
          />
        </div>

        {/* Glow System */}
        <div className={styles.controlSection}>
          <h3>✨ Global Glow</h3>
          <ToggleControl
            label="Enable"
            value={globalEffects.glowSystem.enabled}
            onChange={(value) => updateGlobalEffects({ 
              glowSystem: { ...globalEffects.glowSystem, enabled: value }
            })}
          />
          <SliderControl
            label="Intensity"
            value={globalEffects.glowSystem.intensity}
            min={0}
            max={3}
            onChange={(value) => updateGlobalEffects({ 
              glowSystem: { ...globalEffects.glowSystem, intensity: value }
            })}
            disabled={!globalEffects.glowSystem.enabled}
          />
          <SliderControl
            label="Radius"
            value={globalEffects.glowSystem.radius}
            min={5}
            max={100}
            onChange={(value) => updateGlobalEffects({ 
              glowSystem: { ...globalEffects.glowSystem, radius: value }
            })}
            disabled={!globalEffects.glowSystem.enabled}
          />
          <ToggleControl
            label="Pulsing"
            value={globalEffects.glowSystem.pulsing}
            onChange={(value) => updateGlobalEffects({ 
              glowSystem: { ...globalEffects.glowSystem, pulsing: value }
            })}
          />
        </div>

        {/* Chromatic Effects */}
        <div className={styles.controlSection}>
          <h3>🌈 Chromatic Effects</h3>
          <SliderControl
            label="Aberration"
            value={globalEffects.chromatic.aberration}
            min={0}
            max={10}
            onChange={(value) => updateGlobalEffects({ 
              chromatic: { ...globalEffects.chromatic, aberration: value }
            })}
          />
          <div className={styles.colorControls}>
            <label>Red Channel</label>
            <input
              type="color"
              value={globalEffects.chromatic.aberrationColors.red}
              onChange={(e) => updateGlobalEffects({
                chromatic: {
                  ...globalEffects.chromatic,
                  aberrationColors: {
                    ...globalEffects.chromatic.aberrationColors,
                    red: e.target.value
                  }
                }
              })}
              disabled={globalEffects.chromatic.aberration === 0}
            />
            <label>Green Channel</label>
            <input
              type="color"
              value={globalEffects.chromatic.aberrationColors.green}
              onChange={(e) => updateGlobalEffects({
                chromatic: {
                  ...globalEffects.chromatic,
                  aberrationColors: {
                    ...globalEffects.chromatic.aberrationColors,
                    green: e.target.value
                  }
                }
              })}
              disabled={globalEffects.chromatic.aberration === 0}
            />
            <label>Blue Channel</label>
            <input
              type="color"
              value={globalEffects.chromatic.aberrationColors.blue}
              onChange={(e) => updateGlobalEffects({
                chromatic: {
                  ...globalEffects.chromatic,
                  aberrationColors: {
                    ...globalEffects.chromatic.aberrationColors,
                    blue: e.target.value
                  }
                }
              })}
              disabled={globalEffects.chromatic.aberration === 0}
            />
          </div>
          <SliderControl
            label="Prism"
            value={globalEffects.chromatic.prism}
            min={0}
            max={1}
            onChange={(value) => updateGlobalEffects({ 
              chromatic: { ...globalEffects.chromatic, prism: value }
            })}
          />
        </div>

        {/* Rainbow Effect */}
        <div className={styles.controlSection}>
          <h3>🌈 Rainbow Effect</h3>
          <SliderControl
            label="Intensity"
            value={globalEffects.chromatic.rainbow.intensity}
            min={0}
            max={2}
            onChange={(value) => updateGlobalEffects({ 
              chromatic: { 
                ...globalEffects.chromatic, 
                rainbow: { ...globalEffects.chromatic.rainbow, intensity: value }
              }
            })}
          />
          <SliderControl
            label="Speed"
            value={globalEffects.chromatic.rainbow.speed}
            min={0}
            max={5}
            onChange={(value) => updateGlobalEffects({ 
              chromatic: { 
                ...globalEffects.chromatic, 
                rainbow: { ...globalEffects.chromatic.rainbow, speed: value }
              }
            })}
          />
          <SliderControl
            label="Rotation"
            value={globalEffects.chromatic.rainbow.rotation}
            min={0}
            max={360}
            step={1}
            onChange={(value) => updateGlobalEffects({ 
              chromatic: { 
                ...globalEffects.chromatic, 
                rainbow: { ...globalEffects.chromatic.rainbow, rotation: value }
              }
            })}
          />
          <SliderControl
            label="Opacity"
            value={globalEffects.chromatic.rainbow.opacity}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) => updateGlobalEffects({ 
              chromatic: { 
                ...globalEffects.chromatic, 
                rainbow: { ...globalEffects.chromatic.rainbow, opacity: value }
              }
            })}
          />
          <SelectControl
            label="Blend Mode"
            value={globalEffects.chromatic.rainbow.blendMode}
            options={[
              { value: 'normal', label: 'Normal' },
              { value: 'screen', label: 'Screen' },
              { value: 'overlay', label: 'Overlay' },
              { value: 'soft-light', label: 'Soft Light' },
              { value: 'hard-light', label: 'Hard Light' },
              { value: 'color-dodge', label: 'Color Dodge' },
              { value: 'color-burn', label: 'Color Burn' },
              { value: 'difference', label: 'Difference' },
              { value: 'exclusion', label: 'Exclusion' }
            ]}
            onChange={(value) => updateGlobalEffects({ 
              chromatic: { 
                ...globalEffects.chromatic, 
                rainbow: { ...globalEffects.chromatic.rainbow, blendMode: value as any }
              }
            })}
          />
          <div className={styles.colorControls}>
            <label>Rainbow Colors</label>
            {globalEffects.chromatic.rainbow.colors.map((color, index) => (
              <div key={index} className={styles.colorRow}>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const newColors = [...globalEffects.chromatic.rainbow.colors];
                    newColors[index] = e.target.value;
                    updateGlobalEffects({
                      chromatic: {
                        ...globalEffects.chromatic,
                        rainbow: { ...globalEffects.chromatic.rainbow, colors: newColors }
                      }
                    });
                  }}
                  disabled={globalEffects.chromatic.rainbow.intensity === 0}
                />
                <button
                  className={styles.removeColor}
                  onClick={() => {
                    const newColors = globalEffects.chromatic.rainbow.colors.filter((_, i) => i !== index);
                    if (newColors.length >= 2) {
                      updateGlobalEffects({
                        chromatic: {
                          ...globalEffects.chromatic,
                          rainbow: { ...globalEffects.chromatic.rainbow, colors: newColors }
                        }
                      });
                    }
                  }}
                  disabled={globalEffects.chromatic.rainbow.colors.length <= 2}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              className={styles.addColor}
              onClick={() => {
                const newColors = [...globalEffects.chromatic.rainbow.colors, '#ffffff'];
                updateGlobalEffects({
                  chromatic: {
                    ...globalEffects.chromatic,
                    rainbow: { ...globalEffects.chromatic.rainbow, colors: newColors }
                  }
                });
              }}
              disabled={globalEffects.chromatic.rainbow.colors.length >= 10}
            >
              Add Color
            </button>
          </div>
        </div>

        {/* Distortion Effects */}
        <div className={styles.controlSection}>
          <h3>🌊 Distortion</h3>
          <SliderControl
            label="Wave"
            value={globalEffects.distortion.wave}
            min={0}
            max={1}
            onChange={(value) => updateGlobalEffects({ 
              distortion: { ...globalEffects.distortion, wave: value }
            })}
          />
          <SliderControl
            label="Ripple"
            value={globalEffects.distortion.ripple}
            min={0}
            max={1}
            onChange={(value) => updateGlobalEffects({ 
              distortion: { ...globalEffects.distortion, ripple: value }
            })}
          />
          <SliderControl
            label="Noise"
            value={globalEffects.distortion.noise}
            min={0}
            max={1}
            onChange={(value) => updateGlobalEffects({ 
              distortion: { ...globalEffects.distortion, noise: value }
            })}
          />
          <SliderControl
            label="Frequency"
            value={globalEffects.distortion.frequency}
            min={0.1}
            max={5}
            onChange={(value) => updateGlobalEffects({ 
              distortion: { ...globalEffects.distortion, frequency: value }
            })}
          />
        </div>

        {/* Volumetric Effects */}
        <div className={styles.controlSection}>
          <h3>🌫️ Volumetric</h3>
          <ToggleControl
            label="Enable"
            value={globalEffects.volumetric.enabled}
            onChange={(value) => updateGlobalEffects({ 
              volumetric: { ...globalEffects.volumetric, enabled: value }
            })}
          />
          <SliderControl
            label="Fog"
            value={globalEffects.volumetric.fog}
            min={0}
            max={1}
            onChange={(value) => updateGlobalEffects({ 
              volumetric: { ...globalEffects.volumetric, fog: value }
            })}
            disabled={!globalEffects.volumetric.enabled}
          />
          <SliderControl
            label="Light Shafts"
            value={globalEffects.volumetric.lightShafts}
            min={0}
            max={1}
            onChange={(value) => updateGlobalEffects({ 
              volumetric: { ...globalEffects.volumetric, lightShafts: value }
            })}
            disabled={!globalEffects.volumetric.enabled}
          />
          <SliderControl
            label="Density"
            value={globalEffects.volumetric.density}
            min={0}
            max={2}
            onChange={(value) => updateGlobalEffects({ 
              volumetric: { ...globalEffects.volumetric, density: value }
            })}
            disabled={!globalEffects.volumetric.enabled}
          />
        </div>

        {/* Enhanced Post-Processing */}
        <div className={styles.controlSection}>
          <h3>🎬 Enhanced Post-FX</h3>
          <SliderControl
            label="Brightness"
            value={effects.brightness}
            min={0.3}
            max={2}
            onChange={(value) => updateEffects({ brightness: value })}
          />
          <SliderControl
            label="Vignette"
            value={effects.vignette}
            min={0}
            max={1}
            onChange={(value) => updateEffects({ vignette: value })}
          />
          <SliderControl
            label="Film Grain"
            value={effects.filmGrain}
            min={0}
            max={1}
            onChange={(value) => updateEffects({ filmGrain: value })}
          />
          <SliderControl
            label="Scanlines"
            value={effects.scanlines}
            min={0}
            max={1}
            onChange={(value) => updateEffects({ scanlines: value })}
          />
        </div>
      </div>
    </div>
  );
}; 