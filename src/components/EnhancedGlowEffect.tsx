import React from 'react';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

// Enhanced glow material with better visibility
export class GlowMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        glowColor: { value: new THREE.Color(0xffffff) },
        intensity: { value: 1.0 },
        viewVector: { value: new THREE.Vector3() }
      },
      vertexShader: `
        uniform vec3 viewVector;
        varying float vIntensity;
        
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          vec3 vNormel = normalize(normalMatrix * viewVector);
          vIntensity = pow(0.8 - dot(vNormal, vNormel), 2.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float intensity;
        varying float vIntensity;
        
        void main() {
          vec3 glow = glowColor * vIntensity * intensity;
          gl_FragColor = vec4(glow, vIntensity * intensity);
        }
      `,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false
    });
  }
}

// Register the material
extend({ GlowMaterial });

// Enhanced glow settings calculator
export const calculateGlowSettings = (
  baseColor: string,
  glowConfig: any,
  objectType: 'sphere' | 'cube' | 'torus' | 'particle'
) => {
  const glowEnabled = glowConfig?.enabled || false;
  const baseIntensity = glowConfig?.intensity || 0;
  
  // Increase base intensity for better visibility
  const intensityMultipliers = {
    sphere: 3.0,
    cube: 2.5,
    torus: 2.8,
    particle: 2.0
  };
  
  const finalIntensity = baseIntensity * intensityMultipliers[objectType];
  
  // Calculate glow color
  const glowColor = glowConfig?.useObjectColor ? baseColor : (glowConfig?.customColor || baseColor);
  
  // Enhanced material settings
  const materialSettings = {
    emissive: new THREE.Color(glowColor),
    emissiveIntensity: finalIntensity,
    // Add rim lighting effect
    metalness: glowEnabled ? 0.7 : 0.3,
    roughness: glowEnabled ? 0.2 : 0.8,
    // Ensure transparency works properly
    transparent: true,
    opacity: 0.9,
    // Use additive blending for brighter glow
    blending: finalIntensity > 0.5 ? THREE.AdditiveBlending : THREE.NormalBlending
  };
  
  return {
    enabled: glowEnabled,
    intensity: finalIntensity,
    color: glowColor,
    materialSettings,
    // Settings for outer glow mesh
    outerGlowSettings: {
      scale: 1.2 + (baseIntensity * 0.3),
      opacity: baseIntensity * 0.6,
      color: glowColor
    }
  };
};

// Glow mesh component
export const GlowMesh = ({ 
  geometry, 
  glowSettings,
  position = [0, 0, 0],
  scale = 1
}: {
  geometry: THREE.BufferGeometry;
  glowSettings: ReturnType<typeof calculateGlowSettings>;
  position?: [number, number, number];
  scale?: number;
}) => {
  if (!glowSettings.enabled || glowSettings.intensity <= 0) {
    return null;
  }
  
  const { outerGlowSettings } = glowSettings;
  
  return (
    <mesh
      geometry={geometry}
      position={position}
      scale={scale * outerGlowSettings.scale}
    >
      <meshBasicMaterial
        color={outerGlowSettings.color}
        transparent={true}
        opacity={outerGlowSettings.opacity}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
};