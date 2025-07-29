import React, { useMemo } from 'react';
import { useVisualStore } from '../store/visualStore';
import styles from './GlobalEffectsDashboard.module.css';
import SliderControl from './SliderControl';
import ToggleControl from './ToggleControl';
import PresetControls from './PresetControls';
import CollapsibleSection from './CollapsibleSection';

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
  const { globalEffects, updateGlobalEffects, effects, updateEffects, globalAnimationSpeed, updateGlobalAnimationSpeed } = useVisualStore();

  // Create safe defaults with proper nested structure
  const defaultGlobalEffects = {
    atmosphericBlur: {
      enabled: false,
      intensity: 0.5,
      layers: 5
    },
    colorBlending: {
      enabled: false,
      mode: 'screen' as const,
      intensity: 0.5
    },
    shapeGlow: {
      enabled: false,
      intensity: 0.4,
      radius: 20,
      useObjectColor: false,
      customColor: '#ffffff',
      pulsing: false,
      pulseSpeed: 1.0
    },
    chromatic: {
      enabled: false,
      aberration: 0,
      aberrationColors: {
        red: '#ff0000',
        green: '#00ff00',
        blue: '#0000ff'
      },
      rainbow: {
        enabled: false,
        intensity: 0.5,
        speed: 1.0,
        rotation: 0,
        blendMode: 'screen' as const,
        colors: ['#ff0000', '#00ff00', '#0000ff'],
        opacity: 0.5
      },
      prism: 0
    },
    distortion: {
      enabled: false,
      wave: 0,
      ripple: 0,
      noise: 0,
      frequency: 1
    },
    particleInteraction: {
      enabled: false,
      magnetism: 0,
      repulsion: 0,
      flowField: false,
      turbulence: 0
    },
    volumetric: {
      enabled: false,
      fog: 0,
      lightShafts: 0,
      density: 0.5,
      color: '#4169e1'
    },
    trails: {
      enabled: false,
      sphereTrails: {
        enabled: false,
        length: 10,
        opacity: 0.3,
        width: 2,
        fadeRate: 0.95
      },
      cubeTrails: {
        enabled: false,
        length: 10,
        opacity: 0.3,
        width: 2,
        fadeRate: 0.95
      },
      blobTrails: {
        enabled: false,
        length: 10,
        opacity: 0.3,
        width: 2,
        fadeRate: 0.95
      },
      torusTrails: {
        enabled: false,
        length: 10,
        opacity: 0.3,
        width: 2,
        fadeRate: 0.95
      },
      particleTrails: {
        enabled: false,
        length: 10,
        opacity: 0.3,
        width: 2,
        fadeRate: 0.95
      }
    },
    waveInterference: {
      enabled: false,
      speed: 1.0,
      amplitude: 0.5,
      contourLevels: 10,
      preset: 1,
      edgeFade: {
        enabled: false,
        fadeStart: 0.7,
        fadeEnd: 1.0
      }
    },
    metamorphosis: {
      enabled: false,
      morphSpeed: 1.0,
      rotationSpeed: 1.0,
      wireframeOpacity: 0.3,
      size: 1.0,
      blur: 0.1,
      intensity: 0.5,
      layers: 3
    },
    fireflies: {
      enabled: false,
      count: 50,
      speed: 1.0,
      glowIntensity: 0.5,
      swarmRadius: 20
    },
    layeredSineWaves: {
      enabled: false,
      layers: 3,
      points: 100,
      waveAmplitude: 0.5,
      speed: 1.0,
      opacity: 0.3,
      lineWidth: 1,
      size: 1.0,
      width: 100,
      height: 100,
      intensity: 0.5,
      layerCount: 3,
      edgeFade: {
        enabled: false,
        fadeStart: 0.7,
        fadeEnd: 1.0
      }
    }
  };

  const defaultEffects = {
    glow: 0,
    contrast: 1,
    saturation: 1,
    hue: 0,
    brightness: 1,
    vignette: 0
  };

  // Deep merge function to handle nested objects
  const deepMerge = (defaults: any, actual: any): any => {
    if (!actual) return defaults;
    
    const result = { ...defaults };
    
    for (const key in actual) {
      if (actual[key] && typeof actual[key] === 'object' && !Array.isArray(actual[key])) {
        result[key] = deepMerge(defaults[key] || {}, actual[key]);
      } else {
        result[key] = actual[key];
      }
    }
    
    return result;
  };

  // Create safe versions with proper defaults
  const safeGlobalEffects = deepMerge(defaultGlobalEffects, globalEffects || {});
  const safeEffects = deepMerge(defaultEffects, effects || {});

  const blendModeOptions = useMemo(() => [
    { value: 'screen', label: 'Screen' },
    { value: 'multiply', label: 'Multiply' },
    { value: 'overlay', label: 'Overlay' },
    { value: 'soft-light', label: 'Soft Light' },
    { value: 'hard-light', label: 'Hard Light' },
    { value: 'color-dodge', label: 'Color Dodge' },
    { value: 'color-burn', label: 'Color Burn' },
    { value: 'difference', label: 'Difference' },
    { value: 'exclusion', label: 'Exclusion' }
  ], []);

  // Safe update function that ensures all required properties exist
  const safeUpdateGlobalEffects = (updates: any) => {
    try {
      const currentSafe = deepMerge(defaultGlobalEffects, globalEffects || {});
      const updated = deepMerge(currentSafe, updates || {});
      updateGlobalEffects(updated);
    } catch (error) {
      console.error('Error updating global effects:', error);
      // Fallback to just updating with defaults merged
      updateGlobalEffects(deepMerge(defaultGlobalEffects, updates || {}));
    }
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 text-white shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-blue-400">Global Effects</h2>
      </div>

      {/* Enhanced Preset Controls */}
      <CollapsibleSection title="Preset Controls" defaultExpanded={false}>
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
        <PresetControls />
      </div>
      </CollapsibleSection>

      {/* Global Animation Speed */}
      <CollapsibleSection title="Global Animation Speed" defaultExpanded={false}>
        <SliderControl
          label="Animation Speed"
          value={globalAnimationSpeed || 1.0}
          min={0.1}
          max={1.5}
          step={0.1}
          onChange={(value: number) => updateGlobalAnimationSpeed(value)}
        />
      </CollapsibleSection>

      {/* Atmospheric Blur */}
      <CollapsibleSection title="Atmospheric Blur" defaultExpanded={false}>
        <ToggleControl
          label="Enable"
          value={safeGlobalEffects?.atmosphericBlur?.enabled ?? false}
          onChange={(value: boolean) => safeUpdateGlobalEffects({ 
            atmosphericBlur: { ...safeGlobalEffects?.atmosphericBlur, enabled: value }
          })}
        />
        <SliderControl
          label="Intensity"
          value={safeGlobalEffects.atmosphericBlur.intensity || 0.5}
          min={0}
          max={25}
          step={0.5}
          onChange={(value: number) => safeUpdateGlobalEffects({ 
            atmosphericBlur: { ...safeGlobalEffects.atmosphericBlur, intensity: value }
          })}
        />
        <SliderControl
          label="Layers"
          value={safeGlobalEffects.atmosphericBlur.layers || 5}
          min={1}
          max={20}
          step={1}
          onChange={(value: number) => safeUpdateGlobalEffects({ 
            atmosphericBlur: { ...safeGlobalEffects.atmosphericBlur, layers: value }
          })}
        />
      </CollapsibleSection>

      {/* Color Blending */}
      <CollapsibleSection title="Color Blending" defaultExpanded={false}>
        <ToggleControl
          label="Enable"
          value={safeGlobalEffects?.colorBlending?.enabled ?? false}
          onChange={(value: boolean) => safeUpdateGlobalEffects({ 
            colorBlending: { ...safeGlobalEffects.colorBlending, enabled: value }
          })}
        />
        <SelectControl
          label="Blend Mode"
          value={safeGlobalEffects.colorBlending.mode}
          options={blendModeOptions}
          onChange={(value) => safeUpdateGlobalEffects({ 
            colorBlending: { ...safeGlobalEffects.colorBlending, mode: value as any }
          })}
        />
        <SliderControl
          label="Intensity"
          value={safeGlobalEffects.colorBlending.intensity || 0.5}
          min={0}
          max={2}
          step={0.1}
          onChange={(value: number) => safeUpdateGlobalEffects({ 
            colorBlending: { ...safeGlobalEffects.colorBlending, intensity: value }
          })}
        />
      </CollapsibleSection>

      {/* Shape Glow */}
      <CollapsibleSection title="Shape Glow" defaultExpanded={false}>
        <ToggleControl
          label="Enable Shape Glow"
          value={safeGlobalEffects?.shapeGlow?.enabled ?? false}
          onChange={(value: boolean) => safeUpdateGlobalEffects({ 
            shapeGlow: { ...safeGlobalEffects?.shapeGlow, enabled: value }
          })}
        />
        
        <ToggleControl
          label="Use Object Color"
          value={safeGlobalEffects?.shapeGlow?.useObjectColor ?? false}
          onChange={(value: boolean) => safeUpdateGlobalEffects({ 
            shapeGlow: { ...safeGlobalEffects?.shapeGlow, useObjectColor: value }
          })}
        />
        
        {!safeGlobalEffects?.shapeGlow?.useObjectColor && (
          <div className={styles.colorControls}>
            <label>Glow Color</label>
            <input
              type="color"
              value={safeGlobalEffects?.shapeGlow?.customColor || '#ffffff'}
              onChange={(e) => safeUpdateGlobalEffects({
                shapeGlow: {
                  ...safeGlobalEffects?.shapeGlow,
                  customColor: e.target.value
                }
              })}
            />
          </div>
        )}
        
        <SliderControl
          label="Glow Intensity"
          value={safeGlobalEffects?.shapeGlow?.intensity ?? 0.4}
          min={0}
          max={2}
          step={0.1}
          onChange={(value: number) => safeUpdateGlobalEffects({ 
            shapeGlow: { ...safeGlobalEffects?.shapeGlow, intensity: value }
          })}
        />
        
        <SliderControl
          label="Glow Radius"
          value={safeGlobalEffects?.shapeGlow?.radius ?? 20}
          min={1}
          max={50}
          step={1}
          onChange={(value: number) => safeUpdateGlobalEffects({ 
            shapeGlow: { ...safeGlobalEffects?.shapeGlow, radius: value }
          })}
        />
        <ToggleControl
          label="Pulsing Glow"
          value={safeGlobalEffects?.shapeGlow?.pulsing ?? false}
          onChange={(value: boolean) => safeUpdateGlobalEffects({ 
            shapeGlow: { ...safeGlobalEffects?.shapeGlow, pulsing: value }
          })}
        />
        {safeGlobalEffects?.shapeGlow?.pulsing && (
          <SliderControl
            label="Pulse Speed"
            value={safeGlobalEffects?.shapeGlow?.pulseSpeed ?? 1.0}
            min={0.1}
            max={3}
            step={0.1}
            onChange={(value: number) => safeUpdateGlobalEffects({ 
              shapeGlow: { ...safeGlobalEffects?.shapeGlow, pulseSpeed: value }
            })}
          />
        )}
      </CollapsibleSection>

      {/* Chromatic Effects */}
      <CollapsibleSection title="Chromatic Effects" defaultExpanded={false}>
        <ToggleControl
          label="Enable"
          value={safeGlobalEffects?.chromatic?.enabled ?? false}
          onChange={(value: boolean) => safeUpdateGlobalEffects({ 
            chromatic: { ...safeGlobalEffects.chromatic, enabled: value }
          })}
        />
        <SliderControl
          label="Aberration"
          value={safeGlobalEffects.chromatic.aberration || 0}
          min={0}
          max={10}
          onChange={(value: number) => safeUpdateGlobalEffects({ 
            chromatic: { ...safeGlobalEffects.chromatic, aberration: value }
          })}
        />
        <div className={styles.colorControls}>
          <label>Red Channel</label>
          <input
            type="color"
            value={safeGlobalEffects.chromatic.aberrationColors.red || '#ff0000'}
            onChange={(e) => safeUpdateGlobalEffects({
              chromatic: {
                ...safeGlobalEffects.chromatic,
                aberrationColors: {
                  ...safeGlobalEffects.chromatic.aberrationColors,
                  red: e.target.value
                }
              }
            })}
          />
          <label>Green Channel</label>
          <input
            type="color"
            value={safeGlobalEffects.chromatic.aberrationColors.green || '#00ff00'}
            onChange={(e) => safeUpdateGlobalEffects({
              chromatic: {
                ...safeGlobalEffects.chromatic,
                aberrationColors: {
                  ...safeGlobalEffects.chromatic.aberrationColors,
                  green: e.target.value
                }
              }
            })}
          />
          <label>Blue Channel</label>
          <input
            type="color"
            value={safeGlobalEffects.chromatic.aberrationColors.blue || '#0000ff'}
            onChange={(e) => safeUpdateGlobalEffects({
              chromatic: {
                ...safeGlobalEffects.chromatic,
                aberrationColors: {
                  ...safeGlobalEffects.chromatic.aberrationColors,
                  blue: e.target.value
                }
              }
            })}
          />
        </div>
        <SliderControl
          label="Prism"
          value={safeGlobalEffects.chromatic.prism || 0}
          min={0}
          max={1}
          onChange={(value: number) => safeUpdateGlobalEffects({ 
            chromatic: { ...safeGlobalEffects.chromatic, prism: value }
          })}
        />
      </CollapsibleSection>

      {/* Rainbow Effect */}
      <CollapsibleSection title="Rainbow Effect" defaultExpanded={false}>
        <ToggleControl
          label="Enable"
          value={safeGlobalEffects?.chromatic?.rainbow?.enabled ?? false}
          onChange={(value: boolean) => safeUpdateGlobalEffects({ 
            chromatic: { 
              ...safeGlobalEffects.chromatic, 
              rainbow: { ...safeGlobalEffects.chromatic.rainbow, enabled: value }
            }
          })}
        />
        <SliderControl
          label="Intensity"
          value={safeGlobalEffects.chromatic.rainbow.intensity || 0}
          min={0}
          max={2}
          onChange={(value: number) => safeUpdateGlobalEffects({ 
            chromatic: { 
              ...safeGlobalEffects.chromatic, 
              rainbow: { ...safeGlobalEffects.chromatic.rainbow, intensity: value }
            }
          })}
        />
        <SliderControl
          label="Speed"
          value={safeGlobalEffects.chromatic.rainbow.speed || 1}
          min={0}
          max={5}
          onChange={(value: number) => safeUpdateGlobalEffects({ 
            chromatic: { 
              ...safeGlobalEffects.chromatic, 
              rainbow: { ...safeGlobalEffects.chromatic.rainbow, speed: value }
            }
          })}
        />
        <SliderControl
          label="Rotation"
          value={safeGlobalEffects.chromatic.rainbow.rotation || 0}
          min={0}
          max={360}
          step={1}
          onChange={(value: number) => safeUpdateGlobalEffects({ 
            chromatic: { 
              ...safeGlobalEffects.chromatic, 
              rainbow: { ...safeGlobalEffects.chromatic.rainbow, rotation: value }
            }
          })}
        />
        <SliderControl
          label="Opacity"
          value={safeGlobalEffects.chromatic.rainbow.opacity || 0.3}
          min={0}
          max={1}
          step={0.01}
          onChange={(value: number) => safeUpdateGlobalEffects({ 
            chromatic: { 
              ...safeGlobalEffects.chromatic, 
              rainbow: { ...safeGlobalEffects.chromatic.rainbow, opacity: value }
            }
          })}
        />
        <SelectControl
          label="Blend Mode"
          value={safeGlobalEffects.chromatic.rainbow.blendMode}
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
          onChange={(value) => safeUpdateGlobalEffects({ 
            chromatic: { 
              ...safeGlobalEffects.chromatic, 
              rainbow: { ...safeGlobalEffects.chromatic.rainbow, blendMode: value as any }
            }
          })}
        />
        <div className={styles.colorControls}>
          <label>Rainbow Colors</label>
          {(safeGlobalEffects.chromatic.rainbow.colors || []).map((color: string, index: number) => (
            <div key={index} className={styles.colorRow}>
              <input
                type="color"
                value={color}
                onChange={(e) => {
                  const currentColors = safeGlobalEffects.chromatic.rainbow.colors || [];
                  const newColors = [...currentColors];
                  newColors[index] = e.target.value;
                  safeUpdateGlobalEffects({
                    chromatic: {
                      ...safeGlobalEffects.chromatic,
                      rainbow: { 
                        ...safeGlobalEffects.chromatic.rainbow, 
                        colors: newColors 
                      }
                    }
                  });
                }}
              />
              <button
                className={styles.removeColor}
                onClick={() => {
                  const currentColors = safeGlobalEffects.chromatic.rainbow.colors || [];
                  const newColors = currentColors.filter((_: string, i: number) => i !== index);
                  if (newColors.length >= 2) {
                    safeUpdateGlobalEffects({
                      chromatic: {
                        ...safeGlobalEffects.chromatic,
                        rainbow: { 
                          ...safeGlobalEffects.chromatic.rainbow, 
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
              const currentColors = safeGlobalEffects.chromatic.rainbow.colors || [];
              const newColors = [...currentColors, '#ffffff'];
              safeUpdateGlobalEffects({
                chromatic: {
                  ...safeGlobalEffects.chromatic,
                  rainbow: { 
                    ...safeGlobalEffects.chromatic.rainbow, 
                    colors: newColors 
                  }
                }
              });
            }}
          >
            Add Color
          </button>
        </div>
      </CollapsibleSection>

      {/* Distortion */}
      <CollapsibleSection title="Distortion" defaultExpanded={false}>
        <ToggleControl
          label="Enable"
          value={safeGlobalEffects?.distortion?.enabled ?? false}
          onChange={(value: boolean) => safeUpdateGlobalEffects({ 
            distortion: { ...safeGlobalEffects.distortion, enabled: value }
          })}
        />
        <SliderControl
          label="Wave"
          value={safeGlobalEffects.distortion.wave || 0}
          min={0}
          max={1}
          onChange={(value: number) => safeUpdateGlobalEffects({ 
            distortion: { ...safeGlobalEffects.distortion, wave: value }
          })}
        />
        <SliderControl
          label="Ripple"
          value={safeGlobalEffects.distortion.ripple || 0}
          min={0}
          max={1}
          onChange={(value: number) => safeUpdateGlobalEffects({ 
            distortion: { ...safeGlobalEffects.distortion, ripple: value }
          })}
        />
        <SliderControl
          label="Noise"
          value={safeGlobalEffects.distortion.noise || 0}
          min={0}
          max={1}
          onChange={(value: number) => safeUpdateGlobalEffects({ 
            distortion: { ...safeGlobalEffects.distortion, noise: value }
          })}
        />
        <SliderControl
          label="Frequency"
          value={safeGlobalEffects.distortion.frequency || 1}
          min={0.1}
          max={5}
          onChange={(value: number) => safeUpdateGlobalEffects({ 
            distortion: { ...safeGlobalEffects.distortion, frequency: value }
          })}
        />
      </CollapsibleSection>

      {/* Volumetric Effects */}
      <CollapsibleSection title="Volumetric" defaultExpanded={false}>
        <ToggleControl
          label="Enable"
          value={safeGlobalEffects?.volumetric?.enabled ?? false}
          onChange={(value: boolean) => safeUpdateGlobalEffects({ 
            volumetric: { ...safeGlobalEffects.volumetric, enabled: value }
          })}
        />
        <SliderControl
          label="Fog"
          value={safeGlobalEffects.volumetric.fog || 0}
          min={0}
          max={1}
          onChange={(value: number) => safeUpdateGlobalEffects({ 
            volumetric: { ...safeGlobalEffects.volumetric, fog: value }
          })}
        />
        <SliderControl
          label="Density"
          value={safeGlobalEffects.volumetric.density || 0.5}
          min={0}
          max={2}
          onChange={(value: number) => safeUpdateGlobalEffects({ 
            volumetric: { ...safeGlobalEffects.volumetric, density: value }
          })}
        />
        <div className={styles.colorControls}>
          <label>Fog Color</label>
          <input
            type="color"
            value={safeGlobalEffects.volumetric.color || '#4169e1'}
            onChange={(e) => safeUpdateGlobalEffects({
              volumetric: {
                ...safeGlobalEffects.volumetric,
                color: e.target.value
              }
            })}
          />
        </div>
      </CollapsibleSection>

      {/* Enhanced Post-Processing */}
      <CollapsibleSection title="Enhanced Post-FX" defaultExpanded={false}>
        <SliderControl
          label="Brightness"
          value={safeEffects?.brightness ?? 1}
          min={0.3}
          max={2}
          onChange={(value: number) => updateEffects({ brightness: value })}
        />
        <SliderControl
          label="Contrast"
          value={safeEffects?.contrast ?? 1}
          min={0.5}
          max={2}
          step={0.1}
          onChange={(value: number) => updateEffects({ contrast: value })}
        />
        <SliderControl
          label="Saturation"
          value={safeEffects?.saturation ?? 1}
          min={0}
          max={2}
          step={0.1}
          onChange={(value: number) => updateEffects({ saturation: value })}
        />
        <SliderControl
          label="Hue"
          value={safeEffects?.hue ?? 0}
          min={-180}
          max={180}
          step={1}
          onChange={(value: number) => updateEffects({ hue: value })}
        />
        <SliderControl
          label="Glow"
          value={safeEffects?.glow ?? 0}
          min={0}
          max={1}
          step={0.1}
          onChange={(value: number) => updateEffects({ glow: value })}
        />
        <SliderControl
          label="Vignette"
          value={safeEffects?.vignette ?? 0}
          min={0}
          max={1}
          onChange={(value: number) => updateEffects({ vignette: value })}
        />
      </CollapsibleSection>
    </div>
  );
};

export default GlobalEffectsDashboard; 