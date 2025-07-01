import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVisualStore } from '../store/visualStore';
import * as THREE from 'three';

export const LayeredSineWaves = () => {
  // ALL HOOKS MUST BE CALLED FIRST, BEFORE ANY CONDITIONAL LOGIC
  const { globalEffects, geometric, globalAnimationSpeed } = useVisualStore();
  const { layeredSineWaves } = globalEffects;
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.LineBasicMaterial | null>(null);
  const timeRef = useRef(0);
  const frameCountRef = useRef(0);
  const lastLogTimeRef = useRef(0);

  // Create material with ref for dynamic updates
  const lineMaterial = useMemo(() => {
    const material = new THREE.LineBasicMaterial({
      color: geometric.layeredSineWaves?.color || '#323232',
      transparent: true,
      opacity: layeredSineWaves?.opacity || 0.5,
      linewidth: layeredSineWaves?.lineWidth || 0.6,
    });
    materialRef.current = material;
    return material;
  }, [geometric.layeredSineWaves?.color, layeredSineWaves?.lineWidth]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (groupRef.current) {
        while (groupRef.current.children.length > 0) {
          const child = groupRef.current.children[0];
          if (child instanceof THREE.Line) {
            if (child.geometry) {
              child.geometry.dispose();
            }
            if (child.material) {
              child.material.dispose();
            }
          }
          groupRef.current.remove(child);
        }
      }
      if (materialRef.current) {
        materialRef.current.dispose();
      }
    };
  }, []);

  // ALWAYS call useFrame, but make it conditional inside
  useFrame((state, delta) => {
    // Early return if conditions aren't met
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
    const intensity = layeredSineWaves.intensity || 1.0;
    const layerCount = layeredSineWaves.layerCount || 1;
    const edgeFade = layeredSineWaves.edgeFade ?? { enabled: true, fadeStart: 0.3, fadeEnd: 0.5 };
    
    // Safety check: clamp global animation speed to prevent crashes
    const safeAnimationSpeed = Math.max(0.01, Math.min(5.0, globalAnimationSpeed));
    const finalSpeed = speed * safeAnimationSpeed;
    
    timeRef.current += delta * finalSpeed;

    // Update material properties
    if (materialRef.current) {
      const currentColor = geometric.layeredSineWaves?.color || '#323232';
      if (materialRef.current.color.getHexString() !== currentColor.replace('#', '')) {
        materialRef.current.color.set(currentColor);
      }
      
      if (Math.abs(materialRef.current.linewidth - lineWidth) > 0.001) {
        materialRef.current.linewidth = lineWidth;
        materialRef.current.needsUpdate = true;
      }
      
      if (Math.abs(materialRef.current.opacity - baseOpacity) > 0.001) {
        materialRef.current.opacity = baseOpacity;
        materialRef.current.needsUpdate = true;
      }
      
      if (!materialRef.current.transparent) {
        materialRef.current.transparent = true;
        materialRef.current.needsUpdate = true;
      }
    }

    // PERFORMANCE OPTIMIZATION: Only update geometry every 10 frames (was 5)
    frameCountRef.current++;
    const shouldUpdateGeometry = frameCountRef.current % 10 === 0;

    if (shouldUpdateGeometry) {
      // Clear existing lines and dispose geometries
      while (groupRef.current.children.length > 0) {
        const child = groupRef.current.children[0];
        if (child instanceof THREE.Line) {
          if (child.geometry) {
            child.geometry.dispose();
          }
          if (child.material) {
            child.material.dispose();
          }
        }
        groupRef.current.remove(child);
      }

      const halfWidth = (width / 2) * size;
      const halfHeight = (height / 2) * size;

      // PERFORMANCE OPTIMIZATION: Limit layer count to prevent excessive rendering
      const maxLayerCount = Math.min(layerCount, 3); // Cap at 3 layers max
      
      // Create multiple layer instances with progressive opacity
      for (let instanceIndex = 0; instanceIndex < maxLayerCount; instanceIndex++) {
        const instanceOpacity = intensity * (0.4 / (instanceIndex + 1)); // Decreasing opacity for each instance
        const instanceOffset = instanceIndex * 2;
        
        // Draw each layer within this instance
        for (let layer = 0; layer < layers; layer++) {
          const layerPosition = (layer / layers) * halfHeight * 0.8 + halfHeight * 0.1 - halfHeight / 2;
          const layerFrequency = 0.5 + layer * 0.03;
          const layerPhase = timeRef.current * 0.2 + layer * 0.05;
          const layerAmplitude = waveAmplitude * size * (0.5 + 0.5 * Math.sin(layer * 0.1 + timeRef.current * 0.3));
          
          const baseLayerOpacity = 0.2 + 0.6 * Math.pow(Math.sin((layer / layers) * Math.PI), 2);
          const timeEffect = 0.2 * Math.sin(timeRef.current * 0.4 + layer * 0.1);
          const layerOpacity = Math.min(0.9, Math.max(0.1, baseLayerOpacity + timeEffect)) * baseOpacity * instanceOpacity;
          
          // Create blur effect by generating multiple overlapping lines (only when blur is enabled)
          const blurLayers = 1; // Single layer when no blur effect
          for (let blurIndex = 0; blurIndex < blurLayers; blurIndex++) {
            const blurOffset = 0; // No offset when no blur
            const blurOpacity = layerOpacity;
        
            const geometry = new THREE.BufferGeometry();
            const positions = [];
            
            for (let i = 0; i <= points; i++) {
              const x = (i / points) * width * size - halfWidth;
              
              let y = layerPosition + blurOffset;
              
              // Primary wave
              y += layerAmplitude * 0.1 * Math.sin(x * 0.1 * layerFrequency + layerPhase);
              
              // Secondary waves for complexity
              y += layerAmplitude * 0.03 * Math.sin(x * 0.2 * layerFrequency + layerPhase * 1.5);
              y += layerAmplitude * 0.02 * Math.sin(x * 0.4 * layerFrequency - layerPhase * 0.7);
              
              // Tertiary high-frequency detail
              y += layerAmplitude * 0.01 * Math.sin(x * 0.8 * layerFrequency + layerPhase * 2.3);
              
              positions.push(x, y, instanceOffset);
            }
            
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            
            const layerMaterial = materialRef.current?.clone();
            if (layerMaterial) {
              let finalOpacity = blurOpacity;
              if (edgeFade.enabled) {
                const maxDistance = Math.max(halfWidth, halfHeight);
                const layerDistance = Math.abs(layerPosition) / maxDistance;
                
                if (layerDistance > edgeFade.fadeStart) {
                  const fadeProgress = (layerDistance - edgeFade.fadeStart) / (edgeFade.fadeEnd - edgeFade.fadeStart);
                  const fadeFactor = Math.max(0, 1 - fadeProgress);
                  finalOpacity *= fadeFactor;
                }
              }
              
              layerMaterial.opacity = finalOpacity;
              layerMaterial.linewidth = lineWidth;
              
              const line = new THREE.Line(geometry, layerMaterial);
              groupRef.current.add(line);
            }
          }
        }
      }
    }

    // Debug logging (much less frequent - every 10 seconds instead of every 2 seconds)
    const currentTime = performance.now();
    if (currentTime - lastLogTimeRef.current > 10000) { // Log every 10 seconds
      lastLogTimeRef.current = currentTime;
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('🎨 LayeredSineWaves running smoothly');
      }
    }
  });

  // NOW we can have conditional returns after all hooks are called
  if (!layeredSineWaves?.enabled) {
    return null;
  }

  return (
    <group ref={groupRef} position={[0, 0, -30]} />
  );
}; 