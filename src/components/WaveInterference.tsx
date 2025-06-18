import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVisualStore } from '../store/visualStore';
import * as THREE from 'three';

interface WaveSource {
  position: THREE.Vector2;
  wavelength: number;
  phase: number;
}

export const WaveInterference = () => {
  const { globalEffects, geometric, globalAnimationSpeed } = useVisualStore();
  const { waveInterference } = globalEffects;
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  // Create wave sources in a grid
  const waveSources = useMemo((): WaveSource[] => {
    const sources: WaveSource[] = [];
    const gridSize = 4;
    const size = 80; // World space size - doubled from 40 to 80
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        sources.push({
          position: new THREE.Vector2(
            (i + 0.5) / gridSize * size - size/2,
            (j + 0.5) / gridSize * size - size/2
          ),
          wavelength: 3 + Math.random() * 2,
          phase: Math.random() * Math.PI * 2
        });
      }
    }
    return sources;
  }, []);

  // Create geometry for the wave surface
  const geometry = useMemo(() => {
    const resolution = 128; // Higher resolution for smooth waves
    const size = 80; // Doubled from 40 to 80
    return new THREE.PlaneGeometry(size, size, resolution, resolution);
  }, []);

  // Shader material for wave interference
  const material = useMemo(() => {
    const contourLevels = waveInterference?.contourLevels || 5;
    const edgeFade = waveInterference?.edgeFade || { enabled: true, fadeStart: 0.3, fadeEnd: 0.5 };
    
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(geometric.waveInterference?.color || '#333333') },
        uOpacity: { value: 0.3 },
        uContourLevels: { value: contourLevels },
        uSources: { value: waveSources.map(s => new THREE.Vector4(s.position.x, s.position.y, s.wavelength, s.phase)) },
        uEdgeFadeEnabled: { value: edgeFade.enabled ? 1.0 : 0.0 },
        uFadeStart: { value: edgeFade.fadeStart },
        uFadeEnd: { value: edgeFade.fadeEnd }
      },
      vertexShader: `
        uniform float uTime;
        uniform vec4 uSources[16];
        varying float vHeight;
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          
          float amplitude = 0.0;
          for(int i = 0; i < 16; i++) {
            vec2 sourcePos = uSources[i].xy;
            float wavelength = uSources[i].z;
            float phase = uSources[i].w;
            
            float dist = distance(pos.xy, sourcePos);
            amplitude += sin((dist / wavelength - uTime) * 6.28318 + phase);
          }
          
          amplitude /= 16.0;
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
        varying float vHeight;
        varying vec2 vUv;
        
        void main() {
          // Create contour lines effect with configurable levels
          float contour = abs(fract(vHeight * uContourLevels) - 0.5) * 2.0;
          contour = smoothstep(0.8, 1.0, contour);
          
          // Grid pattern
          vec2 grid = abs(fract(vUv * 32.0) - 0.5);
          float gridPattern = smoothstep(0.02, 0.0, min(grid.x, grid.y));
          
          // Add some wave intensity variation
          float waveIntensity = sin(vHeight * 4.0 + uTime * 2.0) * 0.5 + 0.5;
          
          // Edge fade effect - create a radial fade from center to edges
          float edgeFade = 1.0;
          if (uEdgeFadeEnabled > 0.5) {
            vec2 center = vec2(0.5, 0.5);
            float distFromCenter = distance(vUv, center);
            edgeFade = 1.0 - smoothstep(uFadeStart, uFadeEnd, distFromCenter);
          }
          
          float alpha = max(contour, gridPattern * 0.3) * uOpacity * (0.5 + waveIntensity * 0.5) * edgeFade;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, [waveSources, geometric.waveInterference?.color, waveInterference?.contourLevels, waveInterference?.edgeFade]);

  useFrame((state, delta) => {
    if (!waveInterference?.enabled || !meshRef.current) return;

    const speed = waveInterference.speed || 0.5;
    const amplitude = waveInterference.amplitude || 0.5;
    const edgeFade = waveInterference.edgeFade || { enabled: true, fadeStart: 0.3, fadeEnd: 0.5 };
    // Safety check: clamp global animation speed to prevent crashes
    const safeAnimationSpeed = Math.max(0.01, Math.min(5.0, globalAnimationSpeed));
    // Calculate final speed: individual wave interference speed * global animation speed
    const finalSpeed = speed * safeAnimationSpeed;
    
    timeRef.current += delta * finalSpeed; // Use individual speed * global animation speed
    material.uniforms.uTime.value = timeRef.current;
    material.uniforms.uOpacity.value = amplitude; // Use configurable amplitude
    
    // Update edge fade settings
    material.uniforms.uEdgeFadeEnabled.value = edgeFade.enabled ? 1.0 : 0.0;
    material.uniforms.uFadeStart.value = edgeFade.fadeStart;
    material.uniforms.uFadeEnd.value = edgeFade.fadeEnd;
    
    // Update color if changed
    if (geometric.waveInterference?.color) {
      material.uniforms.uColor.value.set(geometric.waveInterference.color);
    }
  });

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