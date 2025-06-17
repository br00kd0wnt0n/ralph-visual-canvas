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
  const { globalEffects, updateGlobalEffects, effects, updateEffects, camera, updateCamera, geometric, updateGeometric, backgroundConfig, updateBackgroundConfig } = useVisualStore();

  const blendModeOptions = useMemo(() => [
    { value: 'screen', label: 'Screen' },
    { value: 'multiply', label: 'Multiply' },
    { value: 'overlay', label: 'Overlay' },
    { value: 'soft-light', label: 'Soft Light' },
    { value: 'hard-light', label: 'Hard Light' },
    { value: 'color-dodge', label: 'Color Dodge' },
  ], []);

  return (
    <div className={styles.dashboard}>
      <PresetControls />
      <div className={styles.dashboardHeader}>
        <h2>Global Effects</h2>
      </div>

      {/* REDESIGNED: Clean Background Mode Controls */}
      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 space-y-4 border border-white/10">
        
        <div className="space-y-4">
          {/* Main Enable Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Enable Artistic Mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={backgroundConfig.enabled}
                onChange={(e) => updateBackgroundConfig({ enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {backgroundConfig.enabled && (
            <div className="space-y-4 pl-4 border-l-2 border-blue-400/50">
              
              {/* Camera Control */}
              <div>
                <h3 className="text-white font-medium mb-2">Camera Control</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateBackgroundConfig({ 
                      camera: { ...backgroundConfig.camera, fixed: false }
                    })}
                    className={`p-2 rounded text-sm font-medium transition-colors ${
                      !backgroundConfig.camera.fixed 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    🎮 Free Control
                  </button>
                  <button
                    onClick={() => updateBackgroundConfig({ 
                      camera: { ...backgroundConfig.camera, fixed: true }
                    })}
                    className={`p-2 rounded text-sm font-medium transition-colors ${
                      backgroundConfig.camera.fixed 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    🔒 Fixed View
                  </button>
                </div>
              </div>
              
              {/* Visual Style */}
              <div>
                <h3 className="text-white font-medium mb-2">Visual Style</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateBackgroundConfig({ mode: 'full3D' })}
                    className={`p-2 rounded text-sm font-medium transition-colors ${
                      backgroundConfig.mode === 'full3D' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    ☀️ Bright
                  </button>
                  <button
                    onClick={() => updateBackgroundConfig({ mode: 'modalFriendly' })}
                    className={`p-2 rounded text-sm font-medium transition-colors ${
                      backgroundConfig.mode === 'modalFriendly'
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    🎨 Modal-Friendly
                  </button>
                </div>
              </div>
              
              {/* Animation Speed */}
              <div>
                <h3 className="text-white font-medium mb-2">
                  Animation Speed: {backgroundConfig.timeScale.toFixed(2)}x
                </h3>
                <input
                  type="range"
                  min="0.01"
                  max="2.0"
                  step="0.01"
                  value={backgroundConfig.timeScale}
                  onChange={(e) => updateBackgroundConfig({ timeScale: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Ultra Slow (24h evolution)</span>
                  <span>Normal</span>
                  <span>Fast</span>
                </div>
              </div>
              
              {/* Current Status - Clean */}
              <div className="bg-gray-800/50 rounded p-3 text-sm">
                <div className="text-gray-300">
                  Camera: <span className={`font-medium ${backgroundConfig.camera.fixed ? 'text-red-400' : 'text-green-400'}`}>
                    {backgroundConfig.camera.fixed ? '🔒 Fixed' : '🎮 Free'}
                  </span>
                  {' • '}
                  Style: <span className={`font-medium ${backgroundConfig.mode === 'modalFriendly' ? 'text-purple-400' : 'text-blue-400'}`}>
                    {backgroundConfig.mode === 'modalFriendly' ? '🎨 Modal-Friendly' : '☀️ Bright'}
                  </span>
                  {' • '}
                  Speed: <span className="font-medium text-white">{backgroundConfig.timeScale.toFixed(2)}x</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Atmospheric Blur */}
      <div className={styles.controlSection}>
        <h3>🌫️ Atmospheric Blur</h3>
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
        <h3>🎨 Color Blending</h3>
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
        <h3>✨ Shape Glow</h3>
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
        <h3>🌈 Chromatic Effects</h3>
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
        <h3>🌈 Rainbow Effect</h3>
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
          >
            Add Color
          </button>
        </div>
      </div>

      {/* Distortion */}
      <div className={styles.controlSection}>
        <h3>🌊 Distortion</h3>
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
        <h3>🌫️ Volumetric</h3>
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
        <h3>🎬 Enhanced Post-FX</h3>
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

      {/* Camera */}
      <div className="control-section">
        <h3>📷 Camera</h3>
        {backgroundConfig.enabled && backgroundConfig.camera.fixed && (
          <div className="bg-yellow-500/20 p-2 rounded text-xs text-yellow-200 mb-2 border border-yellow-400">
            🔒 Camera controls overridden by Background Mode
          </div>
        )}
        <SliderControl
          label={`Distance ${backgroundConfig.enabled && backgroundConfig.camera.fixed ? '(LOCKED: 150)' : ''}`}
          value={backgroundConfig.enabled && backgroundConfig.camera.fixed ? 150 : (camera.distance || 25)}
          min={10}
          max={50}
          onChange={(value: number) => updateCamera({ distance: value })}
          disabled={backgroundConfig.enabled && backgroundConfig.camera.fixed}
        />
        <SliderControl
          label={`Height ${backgroundConfig.enabled && backgroundConfig.camera.fixed ? '(LOCKED: 0)' : ''}`}
          value={backgroundConfig.enabled && backgroundConfig.camera.fixed ? 0 : (camera.height || 0)}
          min={-15}
          max={15}
          onChange={(value: number) => updateCamera({ height: value })}
          disabled={backgroundConfig.enabled && backgroundConfig.camera.fixed}
        />
        <SliderControl
          label={`Field of View ${backgroundConfig.enabled && backgroundConfig.camera.fixed ? '(LOCKED: 30°)' : ''}`}
          value={backgroundConfig.enabled && backgroundConfig.camera.fixed ? 30 : (camera.fov || 60)}
          min={30}
          max={90}
          onChange={(value: number) => updateCamera({ fov: value })}
          disabled={backgroundConfig.enabled && backgroundConfig.camera.fixed}
        />
      </div>
    </div>
  );
};

export default GlobalEffectsDashboard; 