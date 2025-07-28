// Distortion Effect Fix Component
// This component ensures distortion effects are properly applied

import { useEffect } from 'react';
import { useVisualStore } from '../store/visualStore';

export const DistortionEffectFix = () => {
  // DISABLED: This was causing infinite re-render loops
  // Distortion now works without requiring enabled flag
  return null;
};

// Enhanced distortion calculation helper
export const calculateDistortion = (
  position: { x: number; y: number; z: number },
  time: number,
  index: number,
  distortion: any
) => {
  if (!distortion || (!distortion.wave && !distortion.ripple)) {
    return position;
  }
  
  // Make effects more visible by increasing base multipliers
  const waveIntensity = (distortion.wave || 0) * 5; // Increased from 2
  const rippleIntensity = (distortion.ripple || 0) * 8; // Increased from 3
  const frequency = distortion.frequency || 1;
  
  let { x, y, z } = position;
  
  // Wave distortion - horizontal wave pattern
  if (waveIntensity > 0) {
    const waveX = Math.sin(time * frequency + index * 0.1) * waveIntensity;
    const waveZ = Math.cos(time * frequency + index * 0.15) * waveIntensity;
    x += waveX;
    z += waveZ;
  }
  
  // Ripple effect - circular ripples from center
  if (rippleIntensity > 0) {
    const distance = Math.sqrt(x * x + z * z);
    const ripplePhase = time * 2 - distance * 0.1;
    const rippleY = Math.sin(ripplePhase) * rippleIntensity;
    y += rippleY;
    
    // Add some horizontal ripple movement too
    const rippleX = Math.cos(ripplePhase) * rippleIntensity * 0.3;
    const rippleZ = Math.sin(ripplePhase + Math.PI/2) * rippleIntensity * 0.3;
    x += rippleX;
    z += rippleZ;
  }
  
  return { x, y, z };
};