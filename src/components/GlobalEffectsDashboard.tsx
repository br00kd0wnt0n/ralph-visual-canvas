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
  const { globalEffects, updateGlobalEffects, effects, updateEffects, camera, updateCamera, geometric, updateGeometric } = useVisualStore();

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

      {/* Object Trails */}
      <div className={styles.controlSection}>
        <h3>✨ Object Trails</h3>
        <ToggleControl
          label="Enable Trails"
          value={globalEffects.trails.enabled}
          onChange={(value: boolean) => updateGlobalEffects({ 
            trails: { ...globalEffects.trails, enabled: value }
          })}
        />
        
        {/* Sphere Trails */}
        <div className={styles.subSection}>
          <h4>Sphere Trails</h4>
          <ToggleControl
            label="Enable"
            value={globalEffects.trails.sphereTrails.enabled}
            onChange={(value: boolean) => updateGlobalEffects({ 
              trails: { 
                ...globalEffects.trails, 
                sphereTrails: { ...globalEffects.trails.sphereTrails, enabled: value }
              }
            })}
          />
          <SliderControl
            label="Length"
            value={globalEffects.trails.sphereTrails.length}
            min={5}
            max={50}
            step={1}
            onChange={(value: number) => updateGlobalEffects({ 
              trails: { 
                ...globalEffects.trails, 
                sphereTrails: { ...globalEffects.trails.sphereTrails, length: value }
              }
            })}
          />
          <SliderControl
            label="Opacity"
            value={globalEffects.trails.sphereTrails.opacity}
            min={0.1}
            max={1}
            onChange={(value: number) => updateGlobalEffects({ 
              trails: { 
                ...globalEffects.trails, 
                sphereTrails: { ...globalEffects.trails.sphereTrails, opacity: value }
              }
            })}
          />
          <SliderControl
            label="Width"
            value={globalEffects.trails.sphereTrails.width}
            min={0.01}
            max={0.5}
            onChange={(value: number) => updateGlobalEffects({ 
              trails: { 
                ...globalEffects.trails, 
                sphereTrails: { ...globalEffects.trails.sphereTrails, width: value }
              }
            })}
          />
          <SliderControl
            label="Fade Rate"
            value={globalEffects.trails.sphereTrails.fadeRate}
            min={0.8}
            max={0.99}
            step={0.01}
            onChange={(value: number) => updateGlobalEffects({ 
              trails: { 
                ...globalEffects.trails, 
                sphereTrails: { ...globalEffects.trails.sphereTrails, fadeRate: value }
              }
            })}
          />
        </div>

        {/* Cube Trails */}
        <div className={styles.subSection}>
          <h4>Cube Trails</h4>
          <ToggleControl
            label="Enable"
            value={globalEffects.trails.cubeTrails.enabled}
            onChange={(value: boolean) => updateGlobalEffects({ 
              trails: { 
                ...globalEffects.trails, 
                cubeTrails: { ...globalEffects.trails.cubeTrails, enabled: value }
              }
            })}
          />
          <SliderControl
            label="Length"
            value={globalEffects.trails.cubeTrails.length}
            min={5}
            max={50}
            step={1}
            onChange={(value: number) => updateGlobalEffects({ 
              trails: { 
                ...globalEffects.trails, 
                cubeTrails: { ...globalEffects.trails.cubeTrails, length: value }
              }
            })}
          />
          <SliderControl
            label="Opacity"
            value={globalEffects.trails.cubeTrails.opacity}
            min={0.1}
            max={1}
            onChange={(value: number) => updateGlobalEffects({ 
              trails: { 
                ...globalEffects.trails, 
                cubeTrails: { ...globalEffects.trails.cubeTrails, opacity: value }
              }
            })}
          />
          <SliderControl
            label="Width"
            value={globalEffects.trails.cubeTrails.width}
            min={0.01}
            max={0.5}
            onChange={(value: number) => updateGlobalEffects({ 
              trails: { 
                ...globalEffects.trails, 
                cubeTrails: { ...globalEffects.trails.cubeTrails, width: value }
              }
            })}
          />
          <SliderControl
            label="Fade Rate"
            value={globalEffects.trails.cubeTrails.fadeRate}
            min={0.8}
            max={0.99}
            step={0.01}
            onChange={(value: number) => updateGlobalEffects({ 
              trails: { 
                ...globalEffects.trails, 
                cubeTrails: { ...globalEffects.trails.cubeTrails, fadeRate: value }
              }
            })}
          />
        </div>

        {/* Blob Trails */}
        <div className={styles.subSection}>
          <h4>Blob Trails</h4>
          <ToggleControl
            label="Enable"
            value={globalEffects.trails.blobTrails.enabled}
            onChange={(value: boolean) => updateGlobalEffects({ 
              trails: { 
                ...globalEffects.trails, 
                blobTrails: { ...globalEffects.trails.blobTrails, enabled: value }
              }
            })}
          />
          <SliderControl
            label="Length"
            value={globalEffects.trails.blobTrails.length}
            min={5}
            max={50}
            step={1}
            onChange={(value: number) => updateGlobalEffects({ 
              trails: { 
                ...globalEffects.trails, 
                blobTrails: { ...globalEffects.trails.blobTrails, length: value }
              }
            })}
          />
          <SliderControl
            label="Opacity"
            value={globalEffects.trails.blobTrails.opacity}
            min={0.1}
            max={1}
            onChange={(value: number) => updateGlobalEffects({ 
              trails: { 
                ...globalEffects.trails, 
                blobTrails: { ...globalEffects.trails.blobTrails, opacity: value }
              }
            })}
          />
          <SliderControl
            label="Width"
            value={globalEffects.trails.blobTrails.width}
            min={0.01}
            max={0.5}
            onChange={(value: number) => updateGlobalEffects({ 
              trails: { 
                ...globalEffects.trails, 
                blobTrails: { ...globalEffects.trails.blobTrails, width: value }
              }
            })}
          />
          <SliderControl
            label="Fade Rate"
            value={globalEffects.trails.blobTrails.fadeRate}
            min={0.8}
            max={0.99}
            step={0.01}
            onChange={(value: number) => updateGlobalEffects({ 
              trails: { 
                ...globalEffects.trails, 
                blobTrails: { ...globalEffects.trails.blobTrails, fadeRate: value }
              }
            })}
          />
        </div>

        {/* Ribbon Trails */}
        <div className={styles.subSection}>
          <h4>Ribbon Trails</h4>
          <ToggleControl
            label="Enable"
            value={globalEffects.trails.ribbonTrails.enabled}
            onChange={(value: boolean) => updateGlobalEffects({ 
              trails: { 
                ...globalEffects.trails, 
                ribbonTrails: { ...globalEffects.trails.ribbonTrails, enabled: value }
              }
            })}
          />
          <SliderControl
            label="Length"
            value={globalEffects.trails.ribbonTrails.length}
            min={5}
            max={50}
            step={1}
            onChange={(value: number) => updateGlobalEffects({ 
              trails: { 
                ...globalEffects.trails, 
                ribbonTrails: { ...globalEffects.trails.ribbonTrails, length: value }
              }
            })}
          />
          <SliderControl
            label="Opacity"
            value={globalEffects.trails.ribbonTrails.opacity}
            min={0.1}
            max={1}
            onChange={(value: number) => updateGlobalEffects({ 
              trails: { 
                ...globalEffects.trails, 
                ribbonTrails: { ...globalEffects.trails.ribbonTrails, opacity: value }
              }
            })}
          />
          <SliderControl
            label="Width"
            value={globalEffects.trails.ribbonTrails.width}
            min={0.01}
            max={0.5}
            onChange={(value: number) => updateGlobalEffects({ 
              trails: { 
                ...globalEffects.trails, 
                ribbonTrails: { ...globalEffects.trails.ribbonTrails, width: value }
              }
            })}
          />
          <SliderControl
            label="Fade Rate"
            value={globalEffects.trails.ribbonTrails.fadeRate}
            min={0.8}
            max={0.99}
            step={0.01}
            onChange={(value: number) => updateGlobalEffects({ 
              trails: { 
                ...globalEffects.trails, 
                ribbonTrails: { ...globalEffects.trails.ribbonTrails, fadeRate: value }
              }
            })}
          />
        </div>
      </div>

      {/* Radial Growth */}
      <div className={styles.controlSection}>
        <h3>🌱 Radial Growth</h3>
        <ToggleControl
          label="Enable"
          value={globalEffects.radialGrowth.enabled}
          onChange={(value: boolean) => updateGlobalEffects({ 
            radialGrowth: { ...globalEffects.radialGrowth, enabled: value }
          })}
        />
        <SliderControl
          label="Max Radiators"
          value={globalEffects.radialGrowth.maxRadiators || 20}
          min={5}
          max={50}
          step={1}
          onChange={(value: number) => updateGlobalEffects({ 
            radialGrowth: { ...globalEffects.radialGrowth, maxRadiators: value }
          })}
        />
        <SliderControl
          label="Spawn Rate"
          value={globalEffects.radialGrowth.spawnRate || 0.5}
          min={0.1}
          max={2.0}
          step={0.1}
          onChange={(value: number) => updateGlobalEffects({ 
            radialGrowth: { ...globalEffects.radialGrowth, spawnRate: value }
          })}
        />
        <SliderControl
          label="Growth Speed"
          value={globalEffects.radialGrowth.growthSpeed || 0.1}
          min={0.01}
          max={0.5}
          step={0.01}
          onChange={(value: number) => updateGlobalEffects({ 
            radialGrowth: { ...globalEffects.radialGrowth, growthSpeed: value }
          })}
        />
        <div className={styles.colorControls}>
          <label>Color</label>
          <input
            type="color"
            value={geometric.radialGrowth?.color || '#333333'}
            onChange={(e) => updateGeometric('radialGrowth', { color: e.target.value })}
          />
        </div>
      </div>

      {/* Wave Interference */}
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
        <div className={styles.colorControls}>
          <label>Color</label>
          <input
            type="color"
            value={geometric.waveInterference?.color || '#333333'}
            onChange={(e) => updateGeometric('waveInterference', { color: e.target.value })}
          />
        </div>
      </div>

      {/* Metamorphosis */}
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
        <div className={styles.colorControls}>
          <label>Color</label>
          <input
            type="color"
            value={geometric.metamorphosis?.color || '#333333'}
            onChange={(e) => updateGeometric('metamorphosis', { color: e.target.value })}
          />
        </div>
      </div>

      {/* Fireflies */}
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
        <div className={styles.colorControls}>
          <label>Color</label>
          <input
            type="color"
            value={geometric.fireflies?.color || '#ffff88'}
            onChange={(e) => updateGeometric('fireflies', { color: e.target.value })}
          />
        </div>
      </div>

      {/* Camera */}
      <div className="control-section">
        <h3>📷 Camera</h3>
        <SliderControl
          label="Distance"
          value={camera.distance || 25}
          min={10}
          max={50}
          onChange={(value: number) => updateCamera({ distance: value })}
        />
        <SliderControl
          label="Height"
          value={camera.height || 0}
          min={-15}
          max={15}
          onChange={(value: number) => updateCamera({ height: value })}
        />
        <SliderControl
          label="Field of View"
          value={camera.fov || 60}
          min={30}
          max={90}
          onChange={(value: number) => updateCamera({ fov: value })}
        />
      </div>
    </div>
  );
};

export default GlobalEffectsDashboard; 