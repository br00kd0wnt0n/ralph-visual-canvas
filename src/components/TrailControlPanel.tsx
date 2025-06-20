import React from 'react';
import { useVisualStore } from '../store/visualStore';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

interface ToggleControlProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
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
  <div className="mb-4">
    <label className={`block text-sm font-medium mb-2 ${disabled ? 'text-gray-500' : 'text-gray-300'}`}>
      {label}
    </label>
    <input
      type="range"
      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      disabled={disabled}
    />
    <div className="text-xs text-gray-400 mt-1">{value}</div>
  </div>
));

const ToggleControl: React.FC<ToggleControlProps> = React.memo(({ 
  label, 
  value, 
  onChange, 
  disabled = false 
}) => (
  <div className="mb-4">
    <label className={`flex items-center cursor-pointer ${disabled ? 'text-gray-500' : 'text-gray-300'}`}>
      <input
        type="checkbox"
        className="sr-only"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        value ? 'bg-blue-600' : 'bg-gray-600'
      } ${disabled ? 'opacity-50' : ''}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          value ? 'translate-x-6' : 'translate-x-1'
        }`} />
      </div>
      <span className="ml-3 text-sm font-medium">{label}</span>
    </label>
  </div>
));

const ControlSection: React.FC<ControlSectionProps> = React.memo(({ 
  title, 
  children 
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-purple-400 mb-4 border-b border-gray-700 pb-2">
        {title}
      </h3>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
});

interface TrailControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrailControlPanel: React.FC<TrailControlPanelProps> = ({ isOpen, onClose }) => {
  const { globalEffects, updateGlobalEffects } = useVisualStore();
  const { trails } = globalEffects;

  // Add safety checks and fallback values for when trails is undefined
  const safeTrails = trails || {
    enabled: false,
    sphereTrails: { enabled: false, length: 50, opacity: 0.6, width: 0.8, fadeRate: 0.3 },
    cubeTrails: { enabled: false, length: 40, opacity: 0.5, width: 0.7, fadeRate: 0.4 },
    blobTrails: { enabled: false, length: 60, opacity: 0.7, width: 0.9, fadeRate: 0.2 },
    torusTrails: { enabled: false, length: 35, opacity: 0.5, width: 0.6, fadeRate: 0.5 },
    particleTrails: { enabled: false, length: 100, opacity: 0.8, width: 0.3, fadeRate: 0.1 }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900/95 border border-gray-700 rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-purple-400">Trail System Controls</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Global Trail Toggle */}
        <ControlSection title="Global Settings">
          <ToggleControl
            label="Enable Trail System"
            value={safeTrails.enabled}
            onChange={(value) => updateGlobalEffects({ 
              trails: { ...safeTrails, enabled: value } 
            })}
          />
        </ControlSection>

        {/* Sphere Trails */}
        <ControlSection title="Sphere Trails">
          <ToggleControl
            label="Enable Sphere Trails"
            value={safeTrails.sphereTrails.enabled}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                sphereTrails: { ...safeTrails.sphereTrails, enabled: value } 
              } 
            })}
          />
          <SliderControl
            label="Trail Length"
            value={safeTrails.sphereTrails.length}
            min={5}
            max={1000}
            step={1}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                sphereTrails: { ...safeTrails.sphereTrails, length: value } 
              } 
            })}
            disabled={!safeTrails.sphereTrails.enabled}
          />
          <SliderControl
            label="Trail Opacity"
            value={safeTrails.sphereTrails.opacity}
            min={0.1}
            max={1}
            step={0.1}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                sphereTrails: { ...safeTrails.sphereTrails, opacity: value } 
              } 
            })}
            disabled={!safeTrails.sphereTrails.enabled}
          />
          <SliderControl
            label="Trail Width"
            value={safeTrails.sphereTrails.width}
            min={0.1}
            max={1.0}
            step={0.05}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                sphereTrails: { ...safeTrails.sphereTrails, width: value } 
              } 
            })}
            disabled={!safeTrails.sphereTrails.enabled}
          />
          <SliderControl
            label="Fade Rate"
            value={safeTrails.sphereTrails.fadeRate}
            min={0.1}
            max={0.9}
            step={0.05}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                sphereTrails: { ...safeTrails.sphereTrails, fadeRate: value } 
              } 
            })}
            disabled={!safeTrails.sphereTrails.enabled}
          />
        </ControlSection>

        {/* Cube Trails */}
        <ControlSection title="Cube Trails">
          <ToggleControl
            label="Enable Cube Trails"
            value={safeTrails.cubeTrails.enabled}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                cubeTrails: { ...safeTrails.cubeTrails, enabled: value } 
              } 
            })}
          />
          <SliderControl
            label="Trail Length"
            value={safeTrails.cubeTrails.length}
            min={5}
            max={1000}
            step={1}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                cubeTrails: { ...safeTrails.cubeTrails, length: value } 
              } 
            })}
            disabled={!safeTrails.cubeTrails.enabled}
          />
          <SliderControl
            label="Trail Opacity"
            value={safeTrails.cubeTrails.opacity}
            min={0.1}
            max={1}
            step={0.1}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                cubeTrails: { ...safeTrails.cubeTrails, opacity: value } 
              } 
            })}
            disabled={!safeTrails.cubeTrails.enabled}
          />
          <SliderControl
            label="Trail Width"
            value={safeTrails.cubeTrails.width}
            min={0.1}
            max={1.0}
            step={0.05}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                cubeTrails: { ...safeTrails.cubeTrails, width: value } 
              } 
            })}
            disabled={!safeTrails.cubeTrails.enabled}
          />
          <SliderControl
            label="Fade Rate"
            value={safeTrails.cubeTrails.fadeRate}
            min={0.1}
            max={0.9}
            step={0.05}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                cubeTrails: { ...safeTrails.cubeTrails, fadeRate: value } 
              } 
            })}
            disabled={!safeTrails.cubeTrails.enabled}
          />
        </ControlSection>

        {/* Blob Trails */}
        <ControlSection title="Blob Trails">
          <ToggleControl
            label="Enable Blob Trails"
            value={safeTrails.blobTrails.enabled}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                blobTrails: { ...safeTrails.blobTrails, enabled: value } 
              } 
            })}
          />
          <SliderControl
            label="Trail Length"
            value={safeTrails.blobTrails.length}
            min={5}
            max={1000}
            step={1}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                blobTrails: { ...safeTrails.blobTrails, length: value } 
              } 
            })}
            disabled={!safeTrails.blobTrails.enabled}
          />
          <SliderControl
            label="Trail Opacity"
            value={safeTrails.blobTrails.opacity}
            min={0.1}
            max={1}
            step={0.1}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                blobTrails: { ...safeTrails.blobTrails, opacity: value } 
              } 
            })}
            disabled={!safeTrails.blobTrails.enabled}
          />
          <SliderControl
            label="Trail Width"
            value={safeTrails.blobTrails.width}
            min={0.1}
            max={1.0}
            step={0.05}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                blobTrails: { ...safeTrails.blobTrails, width: value } 
              } 
            })}
            disabled={!safeTrails.blobTrails.enabled}
          />
          <SliderControl
            label="Fade Rate"
            value={safeTrails.blobTrails.fadeRate}
            min={0.1}
            max={0.9}
            step={0.05}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                blobTrails: { ...safeTrails.blobTrails, fadeRate: value } 
              } 
            })}
            disabled={!safeTrails.blobTrails.enabled}
          />
        </ControlSection>

        {/* Torus Trails */}
        <ControlSection title="Torus Trails">
          <ToggleControl
            label="Enable Torus Trails"
            value={safeTrails.torusTrails.enabled}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                torusTrails: { ...safeTrails.torusTrails, enabled: value } 
              } 
            })}
          />
          <SliderControl
            label="Trail Length"
            value={safeTrails.torusTrails.length}
            min={5}
            max={1000}
            step={1}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                torusTrails: { ...safeTrails.torusTrails, length: value } 
              } 
            })}
            disabled={!safeTrails.torusTrails.enabled}
          />
          <SliderControl
            label="Trail Opacity"
            value={safeTrails.torusTrails.opacity}
            min={0.1}
            max={1}
            step={0.1}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                torusTrails: { ...safeTrails.torusTrails, opacity: value } 
              } 
            })}
            disabled={!safeTrails.torusTrails.enabled}
          />
          <SliderControl
            label="Trail Width"
            value={safeTrails.torusTrails.width}
            min={0.1}
            max={1.0}
            step={0.05}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                torusTrails: { ...safeTrails.torusTrails, width: value } 
              } 
            })}
            disabled={!safeTrails.torusTrails.enabled}
          />
          <SliderControl
            label="Fade Rate"
            value={safeTrails.torusTrails.fadeRate}
            min={0.1}
            max={0.9}
            step={0.05}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                torusTrails: { ...safeTrails.torusTrails, fadeRate: value } 
              } 
            })}
            disabled={!safeTrails.torusTrails.enabled}
          />
        </ControlSection>

        {/* Particle Trails */}
        <ControlSection title="Particle Trails">
          <ToggleControl
            label="Enable Particle Trails"
            value={safeTrails.particleTrails.enabled}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                particleTrails: { ...safeTrails.particleTrails, enabled: value } 
              } 
            })}
          />
          <SliderControl
            label="Trail Length"
            value={safeTrails.particleTrails.length}
            min={5}
            max={1500}
            step={1}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                particleTrails: { ...safeTrails.particleTrails, length: value } 
              } 
            })}
            disabled={!safeTrails.particleTrails.enabled}
          />
          <SliderControl
            label="Trail Opacity"
            value={safeTrails.particleTrails.opacity}
            min={0.1}
            max={1}
            step={0.1}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                particleTrails: { ...safeTrails.particleTrails, opacity: value } 
              } 
            })}
            disabled={!safeTrails.particleTrails.enabled}
          />
          <SliderControl
            label="Trail Width"
            value={safeTrails.particleTrails.width}
            min={0.1}
            max={1.0}
            step={0.05}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                particleTrails: { ...safeTrails.particleTrails, width: value } 
              } 
            })}
            disabled={!safeTrails.particleTrails.enabled}
          />
          <SliderControl
            label="Fade Rate"
            value={safeTrails.particleTrails.fadeRate}
            min={0.1}
            max={0.9}
            step={0.05}
            onChange={(value) => updateGlobalEffects({ 
              trails: { 
                ...safeTrails, 
                particleTrails: { ...safeTrails.particleTrails, fadeRate: value } 
              } 
            })}
            disabled={!safeTrails.particleTrails.enabled}
          />
        </ControlSection>
      </div>
    </div>
  );
}; 