import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVisualStore } from '../store/visualStore';
import * as THREE from 'three';

interface WaveSource {
  position: THREE.Vector2;
  wavelength: number;
  phase: number;
}

// Wave interference presets
interface WavePreset {
  name: string;
  description: string;
  sources: number;
  wavelengthRange: [number, number];
  amplitude: number;
  contourLevels: number;
  gridSize?: number;
  spiral?: boolean;
  random?: boolean;
  harmonic?: boolean;
}

const WAVE_PRESETS: Record<number, WavePreset> = {
  1: {
    name: "Classic Interference",
    description: "Traditional wave interference with grid sources",
    sources: 16,
    gridSize: 4,
    wavelengthRange: [3, 5],
    amplitude: 0.3,
    contourLevels: 5
  },
  2: {
    name: "Spiral Waves", 
    description: "Concentric spiral wave pattern",
    sources: 8,
    spiral: true,
    wavelengthRange: [2, 4],
    amplitude: 0.4,
    contourLevels: 8
  },
  3: {
    name: "Chaotic Turbulence",
    description: "Random chaotic wave interference",
    sources: 12,
    random: true,
    wavelengthRange: [1, 6],
    amplitude: 0.5,
    contourLevels: 12
  },
  4: {
    name: "Harmonic Resonance",
    description: "Harmonic wave patterns with frequency relationships",
    sources: 6,
    harmonic: true,
    wavelengthRange: [4, 8],
    amplitude: 0.35,
    contourLevels: 6
  }
};

// Custom comparison function for React.memo to prevent re-renders on camera changes
const arePropsEqual = (prevProps: {}, nextProps: {}) => {
  // Always return true since this component doesn't take props
  // This prevents any re-renders from parent components
  return true;
};

const WaveInterferenceComponent = () => {
  // ALL HOOKS MUST BE CALLED FIRST, BEFORE ANY CONDITIONAL LOGIC
  const { globalEffects, geometric, globalAnimationSpeed } = useVisualStore();
  const { waveInterference } = globalEffects;
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  // Get current preset (default to 1 if not set)
  const currentPreset = waveInterference?.preset || 1;
  const preset = WAVE_PRESETS[currentPreset as keyof typeof WAVE_PRESETS] || WAVE_PRESETS[1];
  
  // Safety check: ensure preset has all required properties
  const safePreset = useMemo(() => ({
    name: preset.name || "Classic Interference",
    description: preset.description || "Traditional wave interference with grid sources",
    sources: Math.max(1, preset.sources || 16),
    wavelengthRange: preset.wavelengthRange || [3, 5],
    amplitude: preset.amplitude || 0.3,
    contourLevels: Math.max(2, preset.contourLevels || 5),
    gridSize: preset.gridSize || 4,
    spiral: preset.spiral || false,
    random: preset.random || false,
    harmonic: preset.harmonic || false
  }), [
    // FIXED: Only depend on preset and currentPreset, not camera state
    preset.name,
    preset.description,
    preset.sources,
    preset.wavelengthRange,
    preset.amplitude,
    preset.contourLevels,
    preset.gridSize,
    preset.spiral,
    preset.random,
    preset.harmonic,
    currentPreset
  ]);

  // Create wave sources based on preset
  const waveSources = useMemo((): WaveSource[] => {
    const sources: WaveSource[] = [];
    const size = 80;
    
    if (safePreset.spiral) {
      // Spiral pattern
      for (let i = 0; i < safePreset.sources; i++) {
        const angle = (i / safePreset.sources) * Math.PI * 4;
        const radius = (i / safePreset.sources) * size * 0.3;
        sources.push({
          position: new THREE.Vector2(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius
          ),
          wavelength: safePreset.wavelengthRange[0] + Math.random() * (safePreset.wavelengthRange[1] - safePreset.wavelengthRange[0]),
          phase: Math.random() * Math.PI * 2
        });
      }
    } else if (safePreset.random) {
      // Random chaotic pattern
      for (let i = 0; i < safePreset.sources; i++) {
        sources.push({
          position: new THREE.Vector2(
            (Math.random() - 0.5) * size * 0.8,
            (Math.random() - 0.5) * size * 0.8
          ),
          wavelength: safePreset.wavelengthRange[0] + Math.random() * (safePreset.wavelengthRange[1] - safePreset.wavelengthRange[0]),
          phase: Math.random() * Math.PI * 2
        });
      }
    } else if (safePreset.harmonic) {
      // Harmonic pattern with frequency relationships
      for (let i = 0; i < safePreset.sources; i++) {
        const angle = (i / safePreset.sources) * Math.PI * 2;
        const radius = size * 0.25;
        const harmonicFreq = 1 + (i % 3); // 1, 2, 3 frequency relationships
        sources.push({
          position: new THREE.Vector2(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius
          ),
          wavelength: safePreset.wavelengthRange[0] / harmonicFreq,
          phase: (i / safePreset.sources) * Math.PI * 2
        });
      }
    } else {
      // Classic grid pattern
      const gridSize = safePreset.gridSize || Math.sqrt(safePreset.sources);
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        sources.push({
          position: new THREE.Vector2(
            (i + 0.5) / gridSize * size - size/2,
            (j + 0.5) / gridSize * size - size/2
          ),
            wavelength: safePreset.wavelengthRange[0] + Math.random() * (safePreset.wavelengthRange[1] - safePreset.wavelengthRange[0]),
          phase: Math.random() * Math.PI * 2
        });
      }
    }
    }
    
    // Safety check: ensure we always have at least one source
    if (sources.length === 0) {
      sources.push({
        position: new THREE.Vector2(0, 0),
        wavelength: safePreset.wavelengthRange[0],
        phase: 0
      });
    }
    
    return sources;
  }, [
    // FIXED: Only depend on preset settings, not camera state
    safePreset.sources,
    safePreset.spiral,
    safePreset.random,
    safePreset.harmonic,
    safePreset.gridSize,
    safePreset.wavelengthRange
  ]);

  // Create geometry for the wave surface
  const geometry = useMemo(() => {
    const resolution = 128;
    const size = 80;
    return new THREE.PlaneGeometry(size, size, resolution, resolution);
  }, []);

  // Shader material for wave interference with preset support
  const material = useMemo(() => {
    const contourLevels = safePreset.contourLevels;
    const edgeFade = waveInterference?.edgeFade || { enabled: true, fadeStart: 0.3, fadeEnd: 0.5 };
    
    // Ensure we have exactly 16 valid sources (pad with zeros if needed)
    const paddedSources = Array.from({ length: 16 }, (_, i) => {
      if (i < waveSources.length && waveSources[i]) {
        return new THREE.Vector4(
          waveSources[i].position.x,
          waveSources[i].position.y,
          waveSources[i].wavelength,
          waveSources[i].phase
        );
      } else {
        // Pad with zero vectors for unused slots
        return new THREE.Vector4(0, 0, 1, 0);
      }
    });
    
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(geometric.waveInterference?.color || '#333333') },
        uOpacity: { value: safePreset.amplitude },
        uContourLevels: { value: contourLevels },
        uSources: { value: paddedSources },
        uSourceCount: { value: waveSources.length },
        uEdgeFadeEnabled: { value: edgeFade.enabled ? 1.0 : 0.0 },
        uFadeStart: { value: edgeFade.fadeStart },
        uFadeEnd: { value: edgeFade.fadeEnd },
        uPreset: { value: currentPreset }
      },
      vertexShader: `
        uniform float uTime;
        uniform vec4 uSources[16];
        uniform int uSourceCount;
        uniform int uPreset;
        varying float vHeight;
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          
          float amplitude = 0.0;
          
          // Apply different wave calculations based on preset
          if (uPreset == 2) {
            // Spiral waves - add rotation effect
            for(int i = 0; i < 16; i++) {
              if (i >= uSourceCount) break;
              vec2 sourcePos = uSources[i].xy;
              float wavelength = uSources[i].z;
              float phase = uSources[i].w;
              
              float dist = distance(pos.xy, sourcePos);
              float angle = atan(pos.y - sourcePos.y, pos.x - sourcePos.x);
              amplitude += sin((dist / wavelength - uTime) * 6.28318 + phase + angle * 2.0);
            }
          } else if (uPreset == 3) {
            // Chaotic turbulence - add noise
            for(int i = 0; i < 16; i++) {
              if (i >= uSourceCount) break;
              vec2 sourcePos = uSources[i].xy;
              float wavelength = uSources[i].z;
              float phase = uSources[i].w;
              
              float dist = distance(pos.xy, sourcePos);
              float noise = sin(pos.x * 10.0 + uTime) * cos(pos.y * 8.0 + uTime) * 0.1;
              amplitude += sin((dist / wavelength - uTime) * 6.28318 + phase) + noise;
            }
          } else if (uPreset == 4) {
            // Harmonic resonance - add frequency modulation
            for(int i = 0; i < 16; i++) {
              if (i >= uSourceCount) break;
              vec2 sourcePos = uSources[i].xy;
              float wavelength = uSources[i].z;
              float phase = uSources[i].w;
              
              float dist = distance(pos.xy, sourcePos);
              float harmonic = sin(uTime * 0.5) * 0.5 + 0.5;
              amplitude += sin((dist / wavelength - uTime) * 6.28318 + phase) * harmonic;
            }
          } else {
            // Classic interference
          for(int i = 0; i < 16; i++) {
              if (i >= uSourceCount) break;
            vec2 sourcePos = uSources[i].xy;
            float wavelength = uSources[i].z;
            float phase = uSources[i].w;
            
            float dist = distance(pos.xy, sourcePos);
            amplitude += sin((dist / wavelength - uTime) * 6.28318 + phase);
            }
          }
          
          amplitude /= float(uSourceCount);
          pos.z = amplitude * 2.0;
          vHeight = amplitude;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        uniform float uContourLevels;
        uniform float uTime;
        uniform float uEdgeFadeEnabled;
        uniform float uFadeStart;
        uniform float uFadeEnd;
        uniform int uPreset;
        varying float vHeight;
        varying vec2 vUv;
        
        void main() {
          // Create contour lines effect with configurable levels
          float contour = abs(fract(vHeight * uContourLevels) - 0.5) * 2.0;
          contour = smoothstep(0.8, 1.0, contour);
          
          // Grid pattern removed - no more visible grid
          // vec2 grid = abs(fract(vUv * 32.0) - 0.5);
          // float gridPattern = smoothstep(0.02, 0.0, min(grid.x, grid.y));
          
          // Add some wave intensity variation based on preset
          float waveIntensity = 0.5;
          if (uPreset == 2) {
            // Spiral - rotating intensity (REMOVED time dependency)
            waveIntensity = sin(vHeight * 4.0) * 0.5 + 0.5;
          } else if (uPreset == 3) {
            // Chaotic - erratic intensity (REMOVED time dependency)
            waveIntensity = sin(vHeight * 8.0) * cos(vHeight * 6.0) * 0.5 + 0.5;
          } else if (uPreset == 4) {
            // Harmonic - smooth intensity (REMOVED time dependency)
            waveIntensity = sin(vHeight * 2.0) * 0.5 + 0.5;
          } else {
            // Classic (REMOVED time dependency)
            waveIntensity = sin(vHeight * 4.0) * 0.5 + 0.5;
          }
          
          // Edge fade effect - create a radial fade from center to edges
          float edgeFade = 1.0;
          if (uEdgeFadeEnabled > 0.5) {
            vec2 center = vec2(0.5, 0.5);
            float distFromCenter = distance(vUv, center);
            edgeFade = 1.0 - smoothstep(uFadeStart, uFadeEnd, distFromCenter);
          }
          
          float alpha = contour * uOpacity * (0.5 + waveIntensity * 0.5) * edgeFade;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, [
    // FIXED: Only depend on wave interference settings, not camera state
    waveSources, 
    geometric.waveInterference?.color, 
    safePreset, 
    currentPreset, 
    waveInterference?.edgeFade
  ]);

  // ALWAYS call useFrame, but make it conditional inside
  useFrame((state, delta) => {
    // Early return if conditions aren't met
    if (!waveInterference?.enabled || !meshRef.current) return;

    const speed = waveInterference.speed || 0.5;
    const safeAnimationSpeed = Math.max(0.01, Math.min(5.0, globalAnimationSpeed));
    const finalSpeed = speed * safeAnimationSpeed;
    
    // Frame-rate independent time calculation
    const fixedTimeStep = 1/60; // 60 FPS baseline
    const timeDelta = Math.min(delta, fixedTimeStep * 2); // Cap delta to prevent large jumps
    timeRef.current += timeDelta * finalSpeed;
    
    // Use accumulated time for wave animation (completely frame-rate independent)
    material.uniforms.uTime.value = timeRef.current;
    material.uniforms.uOpacity.value = safePreset.amplitude; // Use preset amplitude
    
    // Update edge fade settings
    material.uniforms.uEdgeFadeEnabled.value = waveInterference.edgeFade?.enabled ? 1.0 : 0.0;
    material.uniforms.uFadeStart.value = waveInterference.edgeFade?.fadeStart || 0.3;
    material.uniforms.uFadeEnd.value = waveInterference.edgeFade?.fadeEnd || 0.5;
    
    // Update color if changed
    if (geometric.waveInterference?.color) {
      material.uniforms.uColor.value.set(geometric.waveInterference.color);
    }
  });

  // NOW we can have conditional returns after all hooks are called
  if (!waveInterference?.enabled) return null;

  return (
    <mesh 
      ref={meshRef} 
      geometry={geometry} 
      material={material}
      rotation={[-Math.PI / 2, 0, 0]} // Lay flat as floor
      position={[0, -15, 0]} // Position below other objects
    />
  );
};

export const WaveInterference = React.memo(WaveInterferenceComponent, arePropsEqual); 