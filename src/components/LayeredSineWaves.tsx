import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVisualStore } from '../store/visualStore';
import * as THREE from 'three';

export const LayeredSineWaves = () => {
  const { globalEffects, geometric, globalAnimationSpeed } = useVisualStore();
  const { layeredSineWaves } = globalEffects;
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.LineBasicMaterial | null>(null);
  const timeRef = useRef(0);
  const frameCountRef = useRef(0);

  // Debug: Log when component mounts
  useEffect(() => {
    console.log('🎨 LayeredSineWaves component mounted, enabled:', layeredSineWaves?.enabled);
  }, [layeredSineWaves?.enabled]);

  // Create material with ref for dynamic updates
  const lineMaterial = useMemo(() => {
    const material = new THREE.LineBasicMaterial({
      color: geometric.layeredSineWaves?.color || '#323232',
      transparent: true,
      opacity: layeredSineWaves?.opacity || 0.5,
      linewidth: layeredSineWaves?.lineWidth || 0.6, // Apply line width
    });
    materialRef.current = material;
    return material;
  }, [geometric.layeredSineWaves?.color, layeredSineWaves?.lineWidth]);

  useFrame((state, delta) => {
    if (!layeredSineWaves?.enabled || !groupRef.current) {
      return;
    }

    const speed = layeredSineWaves.speed || 0.5;
    const layers = layeredSineWaves.layers || 80;
    const points = layeredSineWaves.points || 200;
    const waveAmplitude = layeredSineWaves.waveAmplitude || 40;
    const lineWidth = layeredSineWaves.lineWidth || 0.6;
    const baseOpacity = layeredSineWaves.opacity || 0.5;
    const size = layeredSineWaves.size || 1.0;
    const width = layeredSineWaves.width || 100;
    const height = layeredSineWaves.height || 100;
    const edgeFade = layeredSineWaves.edgeFade ?? { enabled: true, fadeStart: 0.3, fadeEnd: 0.5 };
    // Safety check: clamp global animation speed to prevent crashes
    const safeAnimationSpeed = Math.max(0.01, Math.min(5.0, globalAnimationSpeed));
    // Calculate final speed: individual layered sine waves speed * global animation speed
    const finalSpeed = speed * safeAnimationSpeed;
    
    timeRef.current += delta * finalSpeed; // Individual speed * global animation speed

    // Update material properties
    if (materialRef.current) {
      // Update color if it changed
      const currentColor = geometric.layeredSineWaves?.color || '#323232';
      if (materialRef.current.color.getHexString() !== currentColor.replace('#', '')) {
        materialRef.current.color.set(currentColor);
      }
      
      // Update line width
      if (Math.abs(materialRef.current.linewidth - lineWidth) > 0.001) {
        materialRef.current.linewidth = lineWidth;
        materialRef.current.needsUpdate = true;
      }
      
      // Update opacity
      if (Math.abs(materialRef.current.opacity - baseOpacity) > 0.001) {
        materialRef.current.opacity = baseOpacity;
        materialRef.current.needsUpdate = true;
      }
      
      // Ensure transparency is enabled
      if (!materialRef.current.transparent) {
        materialRef.current.transparent = true;
        materialRef.current.needsUpdate = true;
      }
    }

    // PERFORMANCE OPTIMIZATION: Only update geometry every 3 frames
    frameCountRef.current++;
    const shouldUpdateGeometry = frameCountRef.current % 3 === 0;

    if (shouldUpdateGeometry) {
      // Clear existing lines
      while (groupRef.current.children.length > 0) {
        const child = groupRef.current.children[0];
        groupRef.current.remove(child);
      }

      // Calculate dimensions based on size and width/height
      const halfWidth = (width / 2) * size;
      const halfHeight = (height / 2) * size;

      // Draw each layer - forms emerging from the formless
      for (let layer = 0; layer < layers; layer++) {
        const layerPosition = (layer / layers) * halfHeight * 0.8 + halfHeight * 0.1 - halfHeight / 2;
        const layerFrequency = 0.5 + layer * 0.03;
        const layerPhase = timeRef.current * 0.2 + layer * 0.05;
        const layerAmplitude = waveAmplitude * size * (0.5 + 0.5 * Math.sin(layer * 0.1 + timeRef.current * 0.3));
        
        // Set opacity based on layer position and time
        const baseLayerOpacity = 0.2 + 0.6 * Math.pow(Math.sin((layer / layers) * Math.PI), 2);
        const timeEffect = 0.2 * Math.sin(timeRef.current * 0.4 + layer * 0.1);
        const layerOpacity = Math.min(0.9, Math.max(0.1, baseLayerOpacity + timeEffect)) * baseOpacity;
        
        // Create wave geometry
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        
        // Generate points along the wave
        for (let i = 0; i <= points; i++) {
          const x = (i / points) * width * size - halfWidth;
          
          // Create complex wave with multiple sine components
          let y = layerPosition;
          
          // Primary wave
          y += layerAmplitude * 0.1 * Math.sin(x * 0.1 * layerFrequency + layerPhase);
          
          // Secondary waves for complexity
          y += layerAmplitude * 0.03 * Math.sin(x * 0.2 * layerFrequency + layerPhase * 1.5);
          y += layerAmplitude * 0.02 * Math.sin(x * 0.4 * layerFrequency - layerPhase * 0.7);
          
          // Tertiary high-frequency detail
          y += layerAmplitude * 0.01 * Math.sin(x * 0.8 * layerFrequency + layerPhase * 2.3);
          
          positions.push(x, y, 0);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        
        // Create material for this layer
        const layerMaterial = materialRef.current?.clone();
        if (layerMaterial) {
          // Apply edge fade if enabled
          let finalOpacity = layerOpacity;
          if (edgeFade.enabled) {
            // Calculate radial distance from center for this layer
            const maxDistance = Math.max(halfWidth, halfHeight);
            
            // Use the layer position and wave amplitude to determine distance
            const layerDistance = Math.abs(layerPosition) / maxDistance;
            
            // Apply fade based on layer distance from center
            if (layerDistance > edgeFade.fadeStart) {
              const fadeProgress = (layerDistance - edgeFade.fadeStart) / (edgeFade.fadeEnd - edgeFade.fadeStart);
              const fadeFactor = Math.max(0, 1 - fadeProgress);
              finalOpacity *= fadeFactor;
            }
          }
          
          layerMaterial.opacity = finalOpacity;
          layerMaterial.linewidth = lineWidth; // Ensure line width is applied
          
          const line = new THREE.Line(geometry, layerMaterial);
          groupRef.current.add(line);
        }
      }
    }

    // Debug logging (less frequent)
    if (frameCountRef.current % 120 === 0) {
      console.log('🎨 LayeredSineWaves running smoothly, lineWidth:', lineWidth, 'edgeFade:', edgeFade.enabled, 'fadeStart:', edgeFade.fadeStart, 'fadeEnd:', edgeFade.fadeEnd);
    }
  });

  if (!layeredSineWaves?.enabled) {
    return null;
  }

  return (
    <group ref={groupRef} position={[0, 0, -30]} />
  );
}; 