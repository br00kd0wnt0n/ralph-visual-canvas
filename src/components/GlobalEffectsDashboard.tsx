import React, { useMemo } from 'react';
import { useVisualStore } from '../store/visualStore';
import styles from './GlobalEffectsDashboard.module.css';
import SliderControl from './SliderControl';
import ToggleControl from './ToggleControl';
import PresetControls from './PresetControls';

const SelectControl = React.memo(({ 
  label, 
  value, 
  options, 
  onChange,
  disabled = false 
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) => (
  <div className={styles.controlGroup}>
    <label className={disabled ? styles.disabled : ''}>{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles.selectControl}
      disabled={disabled}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
));

export const GlobalEffectsDashboard = () => {
  const { globalEffects, updateGlobalEffects, effects, updateEffects, camera, updateCamera, geometric, updateGeometric, globalAnimationSpeed, updateGlobalAnimationSpeed } = useVisualStore();

  // Debug logging for global animation speed
  console.log(`🎯 GlobalEffectsDashboard render - globalAnimationSpeed:`, globalAnimationSpeed);

  const blendModeOptions = useMemo(() => [
    { value: 'screen', label: 'Screen' },
    { value: 'multiply', label: 'Multiply' },
    { value: 'overlay', label: 'Overlay' },
    { value: 'soft-light', label: 'Soft Light' },
    { value: 'hard-light', label: 'Hard Light' },
    { value: 'color-dodge', label: 'Color Dodge' },
  ], []);

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 text-white shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-blue-400">Global Effects</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400">Active</span>
        </div>
      </div>

      {/* Enhanced Preset Controls */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-lg p-4 mb-6 border border-purple-500/20">
        <PresetControls />
      </div>

      {/* Global Animation Speed */}
      <div className={styles.controlSection}>
        <h3>Global Animation Speed</h3>
        <SliderControl
          label="Speed Multiplier"
          value={globalAnimationSpeed}
          min={0.1}
          max={3.0}
          step={0.1}
          onChange={(value: number) => updateGlobalAnimationSpeed(value)}
        />
        <div className="text-xs text-gray-400 mt-1">
          {globalAnimationSpeed.toFixed(1)}x
          {globalAnimationSpeed > 2.0 && (
            <span className="text-yellow-400 ml-2">⚠️ High speed may affect performance</span>
          )}
        </div>
        <div className="text-xs text-gray-400 mt-2">
          This controls the global animation speed multiplier that affects all animated elements in the scene.
          Lower values create slower, more cinematic animations, while higher values create faster, more energetic movements.
        </div>
      </div>

      {/* Atmospheric Blur */}
      <div className={styles.controlSection}>
        <h3>Atmospheric Blur</h3>
        <ToggleControl
          label="Enable"
          value={globalEffects.atmosphericBlur.enabled}
          onChange={(value: boolean) => updateGlobalEffects({ 
            atmosphericBlur: { ...globalEffects.atmosphericBlur, enabled: value }
          })}
        />
        <SliderControl
          label="Intensity"
          value={globalEffects.atmosphericBlur.intensity || 0.5}
          min={0}
          max={25}
          step={0.5}
          onChange={(value: number) => updateGlobalEffects({ 
            atmosphericBlur: { ...globalEffects.atmosphericBlur, intensity: value }
          })}
        />
        <SliderControl
          label="Layers"
          value={globalEffects.atmosphericBlur.layers || 5}
          min={1}
          max={20}
          step={1}
          onChange={(value: number) => updateGlobalEffects({ 
            atmosphericBlur: { ...globalEffects.atmosphericBlur, layers: value }
          })}
        />
      </div>

      {/* Color Blending */}
      <div className={styles.controlSection}>
        <h3>Color Blending</h3>
        <ToggleControl
          label="Enable"
          value={globalEffects.colorBlending.enabled}
          onChange={(value: boolean) => updateGlobalEffects({ 
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
          value={globalEffects.colorBlending.intensity || 0.5}
          min={0}
          max={2}
          step={0.1}
          onChange={(value: number) => updateGlobalEffects({ 
            colorBlending: { ...globalEffects.colorBlending, intensity: value }
          })}
        />
      </div>

      {/* Shape Glow */}
      <div className={styles.controlSection}>
        <h3>Shape Glow</h3>
        <ToggleControl
          label="Enable"
          value={globalEffects.shapeGlow.enabled}
          onChange={(value: boolean) => updateGlobalEffects({ 
            shapeGlow: { ...globalEffects.shapeGlow, enabled: value }
          })}
        />
        <ToggleControl
          label="Use Object Color"
          value={globalEffects.shapeGlow.useObjectColor}
          onChange={(value: boolean) => updateGlobalEffects({ 
            shapeGlow: { ...globalEffects.shapeGlow, useObjectColor: value }
          })}
        />
        {!globalEffects.shapeGlow.useObjectColor && (
          <div className={styles.colorControls}>
            <label>Glow Color</label>
            <input
              type="color"
              value={globalEffects.shapeGlow.customColor || '#ffffff'}
              onChange={(e) => updateGlobalEffects({
                shapeGlow: {
                  ...globalEffects.shapeGlow,
                  customColor: e.target.value
                }
              })}
            />
          </div>
        )}
        <SliderControl
          label="Intensity"
          value={globalEffects.shapeGlow.intensity || 0.4}
          min={0}
          max={3}
          onChange={(value: number) => updateGlobalEffects({ 
            shapeGlow: { ...globalEffects.shapeGlow, intensity: value }
          })}
        />
        <SliderControl
          label="Radius"
          value={globalEffects.shapeGlow.radius || 20}
          min={5}
          max={100}
          onChange={(value: number) => updateGlobalEffects({ 
            shapeGlow: { ...globalEffects.shapeGlow, radius: value }
          })}
        />
        <ToggleControl
          label="Pulsing"
          value={globalEffects.shapeGlow.pulsing}
          onChange={(value: boolean) => updateGlobalEffects({ 
            shapeGlow: { ...globalEffects.shapeGlow, pulsing: value }
          })}
        />
        {globalEffects.shapeGlow.pulsing && (
          <SliderControl
            label="Pulse Speed"
            value={globalEffects.shapeGlow.pulseSpeed || 1.0}
            min={0.1}
            max={5}
            onChange={(value: number) => updateGlobalEffects({ 
              shapeGlow: { ...globalEffects.shapeGlow, pulseSpeed: value }
            })}
          />
        )}
      </div>

      {/* Chromatic Effects */}
      <div className={styles.controlSection}>
        <h3>Chromatic Effects</h3>
        <ToggleControl
          label="Enable"
          value={globalEffects.chromatic.enabled}
          onChange={(value: boolean) => updateGlobalEffects({ 
            chromatic: { ...globalEffects.chromatic, enabled: value }
          })}
        />
        <SliderControl
          label="Aberration"
          value={globalEffects.chromatic.aberration || 0}
          min={0}
          max={10}
          onChange={(value: number) => updateGlobalEffects({ 
            chromatic: { ...globalEffects.chromatic, aberration: value }
          })}
        />
        <div className={styles.colorControls}>
          <label>Red Channel</label>
          <input
            type="color"
            value={globalEffects.chromatic.aberrationColors.red || '#ff0000'}
            onChange={(e) => updateGlobalEffects({
              chromatic: {
                ...globalEffects.chromatic,
                aberrationColors: {
                  ...globalEffects.chromatic.aberrationColors,
                  red: e.target.value
                }
              }
            })}
          />
          <label>Green Channel</label>
          <input
            type="color"
            value={globalEffects.chromatic.aberrationColors.green || '#00ff00'}
            onChange={(e) => updateGlobalEffects({
              chromatic: {
                ...globalEffects.chromatic,
                aberrationColors: {
                  ...globalEffects.chromatic.aberrationColors,
                  green: e.target.value
                }
              }
            })}
          />
          <label>Blue Channel</label>
          <input
            type="color"
            value={globalEffects.chromatic.aberrationColors.blue || '#0000ff'}
            onChange={(e) => updateGlobalEffects({
              chromatic: {
                ...globalEffects.chromatic,
                aberrationColors: {
                  ...globalEffects.chromatic.aberrationColors,
                  blue: e.target.value
                }
              }
            })}
          />
        </div>
        <SliderControl
          label="Prism"
          value={globalEffects.chromatic.prism || 0}
          min={0}
          max={1}
          onChange={(value: number) => updateGlobalEffects({ 
            chromatic: { ...globalEffects.chromatic, prism: value }
          })}
        />
      </div>

      {/* Rainbow Effect */}
      <div className={styles.controlSection}>
        <h3>Rainbow Effect</h3>
        <ToggleControl
          label="Enable"
          value={globalEffects.chromatic.rainbow.enabled}
          onChange={(value: boolean) => updateGlobalEffects({ 
            chromatic: { 
              ...globalEffects.chromatic, 
              rainbow: { ...globalEffects.chromatic.rainbow, enabled: value }
            }
          })}
        />
        <SliderControl
          label="Intensity"
          value={globalEffects.chromatic.rainbow.intensity || 0}
          min={0}
          max={2}
          onChange={(value: number) => updateGlobalEffects({ 
            chromatic: { 
              ...globalEffects.chromatic, 
              rainbow: { ...globalEffects.chromatic.rainbow, intensity: value }
            }
          })}
        />
        <SliderControl
          label="Speed"
          value={globalEffects.chromatic.rainbow.speed || 1}
          min={0}
          max={5}
          onChange={(value: number) => updateGlobalEffects({ 
            chromatic: { 
              ...globalEffects.chromatic, 
              rainbow: { ...globalEffects.chromatic.rainbow, speed: value }
            }
          })}
        />
        <SliderControl
          label="Rotation"
          value={globalEffects.chromatic.rainbow.rotation || 0}
          min={0}
          max={360}
          step={1}
          onChange={(value: number) => updateGlobalEffects({ 
            chromatic: { 
              ...globalEffects.chromatic, 
              rainbow: { ...globalEffects.chromatic.rainbow, rotation: value }
            }
          })}
        />
        <SliderControl
          label="Opacity"
          value={globalEffects.chromatic.rainbow.opacity || 0.3}
          min={0}
          max={1}
          step={0.01}
          onChange={(value: number) => updateGlobalEffects({ 
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
          {(globalEffects.chromatic.rainbow.colors || []).map((color, index) => (
            <div key={index} className={styles.colorRow}>
              <input
                type="color"
                value={color}
                onChange={(e) => {
                  const currentColors = globalEffects.chromatic.rainbow.colors || [];
                  const newColors = [...currentColors];
                  newColors[index] = e.target.value;
                  updateGlobalEffects({
                    chromatic: {
                      ...globalEffects.chromatic,
                      rainbow: { 
                        ...globalEffects.chromatic.rainbow, 
                        colors: newColors 
                      }
                    }
                  });
                }}
              />
              <button
                className={styles.removeColor}
                onClick={() => {
                  const currentColors = globalEffects.chromatic.rainbow.colors || [];
                  const newColors = currentColors.filter((_, i) => i !== index);
                  if (newColors.length >= 2) {
                    updateGlobalEffects({
                      chromatic: {
                        ...globalEffects.chromatic,
                        rainbow: { 
                          ...globalEffects.chromatic.rainbow, 
                          colors: newColors 
                        }
                      }
                    });
                  }
                }}
              >
                ×
              </button>
            </div>
          ))}
          <button
            className={styles.addColor}
            onClick={() => {
              const currentColors = globalEffects.chromatic.rainbow.colors || [];
              const newColors = [...currentColors, '#ffffff'];
              updateGlobalEffects({
                chromatic: {
                  ...globalEffects.chromatic,
                  rainbow: { 
                    ...globalEffects.chromatic.rainbow, 
                    colors: newColors 
                  }
                }
              });
            }}
          >
            Add Color
          </button>
        </div>
      </div>

      {/* Distortion */}
      <div className={styles.controlSection}>
        <h3>Distortion</h3>
        <ToggleControl
          label="Enable"
          value={globalEffects.distortion.enabled}
          onChange={(value: boolean) => updateGlobalEffects({ 
            distortion: { ...globalEffects.distortion, enabled: value }
          })}
        />
        <SliderControl
          label="Wave"
          value={globalEffects.distortion.wave || 0}
          min={0}
          max={1}
          onChange={(value: number) => updateGlobalEffects({ 
            distortion: { ...globalEffects.distortion, wave: value }
          })}
        />
        <SliderControl
          label="Ripple"
          value={globalEffects.distortion.ripple || 0}
          min={0}
          max={1}
          onChange={(value: number) => updateGlobalEffects({ 
            distortion: { ...globalEffects.distortion, ripple: value }
          })}
        />
        <SliderControl
          label="Noise"
          value={globalEffects.distortion.noise || 0}
          min={0}
          max={1}
          onChange={(value: number) => updateGlobalEffects({ 
            distortion: { ...globalEffects.distortion, noise: value }
          })}
        />
        <SliderControl
          label="Frequency"
          value={globalEffects.distortion.frequency || 1}
          min={0.1}
          max={5}
          onChange={(value: number) => updateGlobalEffects({ 
            distortion: { ...globalEffects.distortion, frequency: value }
          })}
        />
      </div>

      {/* Volumetric Effects */}
      <div className={styles.controlSection}>
        <h3>Volumetric</h3>
        <ToggleControl
          label="Enable"
          value={globalEffects.volumetric.enabled}
          onChange={(value: boolean) => updateGlobalEffects({ 
            volumetric: { ...globalEffects.volumetric, enabled: value }
          })}
        />
        <SliderControl
          label="Fog"
          value={globalEffects.volumetric.fog || 0}
          min={0}
          max={1}
          onChange={(value: number) => updateGlobalEffects({ 
            volumetric: { ...globalEffects.volumetric, fog: value }
          })}
        />
        <SliderControl
          label="Density"
          value={globalEffects.volumetric.density || 0.5}
          min={0}
          max={2}
          onChange={(value: number) => updateGlobalEffects({ 
            volumetric: { ...globalEffects.volumetric, density: value }
          })}
        />
        <div className={styles.colorControls}>
          <label>Fog Color</label>
          <input
            type="color"
            value={globalEffects.volumetric.color || '#4169e1'}
            onChange={(e) => updateGlobalEffects({
              volumetric: {
                ...globalEffects.volumetric,
                color: e.target.value
              }
            })}
          />
        </div>
      </div>

      {/* Enhanced Post-Processing */}
      <div className={styles.controlSection}>
        <h3>Enhanced Post-FX</h3>
        <SliderControl
          label="Brightness"
          value={effects.brightness || 1.0}
          min={0.3}
          max={2}
          onChange={(value: number) => updateEffects({ brightness: value })}
        />
        <SliderControl
          label="Vignette"
          value={effects.vignette || 0}
          min={0}
          max={1}
          onChange={(value: number) => updateEffects({ vignette: value })}
        />
      </div>
    </div>
  );
};

export default GlobalEffectsDashboard; 