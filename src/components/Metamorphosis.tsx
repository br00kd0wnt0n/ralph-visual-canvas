import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVisualStore } from '../store/visualStore';
import * as THREE from 'three';

interface FormFunction {
  (u: number, v: number, t: number): THREE.Vector3;
}

export const Metamorphosis = () => {
  const { globalEffects, geometric, globalAnimationSpeed } = useVisualStore();
  const { metamorphosis } = globalEffects;
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.LineBasicMaterial | null>(null);
  const timeRef = useRef(0);
  const frameCountRef = useRef(0);
  const lastUpdateRef = useRef(0);

  // Debug: Log when component mounts
  useEffect(() => {
    // Component mounted successfully
  }, [metamorphosis?.enabled]);

  // Define the three morphing forms
  const forms = useMemo((): FormFunction[] => [
    // Form 1: Draped cloth-like shape
    (u, v, t) => {
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      let r = 12 + 3 * Math.sin(phi * 4 + theta * 2);
      r += 2 * Math.sin(phi * 6) * Math.cos(theta * 3);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + 2 * Math.sin(theta * 5 + phi * 3);
      
      return new THREE.Vector3(x, y, z);
    },
    
    // Form 2: More angular folded shape
    (u, v, t) => {
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      let r = 15 + 2 * Math.cos(phi * 8);
      r *= 0.8 + 0.2 * Math.abs(Math.cos(theta * 2));
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * (0.8 + 0.3 * Math.sin(theta * 4));
      
      return new THREE.Vector3(x, y, z);
    },
    
    // Form 3: Organic bulbous shape
    (u, v, t) => {
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      let r = 12;
      r += 5 * Math.sin(phi * 3) * Math.sin(theta * 2.5);
      r += 3 * Math.cos(phi * 5 + theta);
      
      // Create some hollow areas
      const hollow = Math.max(0, Math.sin(phi * 2 + theta * 3) - 0.7);
      r *= 1 - hollow * 0.8;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return new THREE.Vector3(x, y, z);
    }
  ], []);

  // Interpolate between forms
  const interpolateForms = (formA: FormFunction, formB: FormFunction, u: number, v: number, t: number, blend: number): THREE.Vector3 => {
    const pointA = formA(u, v, t);
    const pointB = formB(u, v, t);
    
    return new THREE.Vector3(
      pointA.x * (1 - blend) + pointB.x * blend,
      pointA.y * (1 - blend) + pointB.y * blend,
      pointA.z * (1 - blend) + pointB.z * blend
    );
  };

  // Get current form with morphing
  const getCurrentForm = (u: number, v: number, t: number): THREE.Vector3 => {
    const totalForms = forms.length;
    const cycleTime = 600;
    const position = (t % (cycleTime * totalForms)) / cycleTime;
    const formIndex = Math.floor(position);
    const nextFormIndex = (formIndex + 1) % totalForms;
    
    let rawBlend = position - formIndex;
    const pauseTime = 0;
    const transitionTime = 1 - (pauseTime * 2);
    
    let blend;
    if (rawBlend < pauseTime) {
      blend = 0;
    } else if (rawBlend > (1 - pauseTime)) {
      blend = 1;
    } else {
      const normalizedTime = (rawBlend - pauseTime) / transitionTime;
      blend = normalizedTime < 0.5
        ? 4 * normalizedTime * normalizedTime * normalizedTime
        : 1 - Math.pow(-2 * normalizedTime + 2, 3) / 2;
    }
    
    return interpolateForms(forms[formIndex], forms[nextFormIndex], u, v, t, blend);
  };

  // Create wireframe material with ref for dynamic updates
  const wireframeMaterial = useMemo(() => {
    const material = new THREE.LineBasicMaterial({
      color: geometric.metamorphosis?.color || '#333333',
      transparent: true,
      opacity: metamorphosis?.wireframeOpacity || 0.4,
    });
    materialRef.current = material;
    return material;
  }, [geometric.metamorphosis?.color]);

  // Pre-allocate geometry objects for reuse
  const geometryPoolRef = useRef<THREE.BufferGeometry[]>([]);
  const linePoolRef = useRef<THREE.Line[]>([]);

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
      // Dispose pooled objects
      geometryPoolRef.current.forEach(geometry => geometry.dispose());
      linePoolRef.current.forEach(line => {
        if (line.geometry) line.geometry.dispose();
        if (line.material && Array.isArray(line.material)) {
          line.material.forEach(mat => mat.dispose());
        } else if (line.material) {
          line.material.dispose();
        }
      });
      geometryPoolRef.current = [];
      linePoolRef.current = [];
    };
  }, []);

  useFrame((state, delta) => {
    if (!metamorphosis?.enabled || !groupRef.current) {
      return;
    }

    const morphSpeed = metamorphosis.morphSpeed || 1;
    const size = metamorphosis.size || 1.0;
    const blur = metamorphosis.blur || 0.0;
    const baseOpacity = metamorphosis.wireframeOpacity || 0.4;
    const intensity = metamorphosis.intensity || 1.0;
    const layers = metamorphosis.layers || 1;
    
    // Safety check: clamp global animation speed to prevent crashes
    const safeAnimationSpeed = Math.max(0.01, Math.min(5.0, globalAnimationSpeed));
    // Calculate final speeds: individual speeds * global animation speed
    const finalMorphSpeed = morphSpeed * safeAnimationSpeed;
    const finalRotationSpeed = (metamorphosis.rotationSpeed || 1) * safeAnimationSpeed;
    
    timeRef.current += delta * 30 * finalMorphSpeed; // Individual morph speed * global animation speed

    // Update material properties for opacity and blur effects
    if (materialRef.current) {
      // Update color if it changed
      const currentColor = geometric.metamorphosis?.color || '#333333';
      if (materialRef.current.color.getHexString() !== currentColor.replace('#', '')) {
        materialRef.current.color.set(currentColor);
      }
      
      // Apply blur effect by reducing opacity
      let finalOpacity = baseOpacity * intensity;
      if (blur > 0) {
        finalOpacity = finalOpacity * (1 - blur * 0.3); // Reduced blur opacity reduction
      }
      
      // Only update if opacity actually changed
      if (Math.abs(materialRef.current.opacity - finalOpacity) > 0.001) {
        materialRef.current.opacity = finalOpacity;
        materialRef.current.needsUpdate = true;
        
        // Update all existing lines with the new material
        groupRef.current.children.forEach((child) => {
          if (child instanceof THREE.Line && child.material) {
            child.material.opacity = finalOpacity;
            child.material.needsUpdate = true;
          }
        });
      }
      
      // Ensure transparency is enabled
      if (!materialRef.current.transparent) {
        materialRef.current.transparent = true;
        materialRef.current.needsUpdate = true;
        
        // Update all existing lines
        groupRef.current.children.forEach((child) => {
          if (child instanceof THREE.Line && child.material) {
            child.material.transparent = true;
            child.material.needsUpdate = true;
          }
        });
      }
    }

    // Debug logging (less frequent)
    if (frameCountRef.current % 120 === 0) { // Log every 120 frames (about every 2 seconds)
      // Metamorphosis is running smoothly
    }

    // PERFORMANCE OPTIMIZATION: Only update geometry every 3 frames
    frameCountRef.current++;
    const shouldUpdateGeometry = frameCountRef.current % 3 === 0;
    
    if (shouldUpdateGeometry) {
      // Clear previous geometry
      groupRef.current.clear();

      // PERFORMANCE OPTIMIZATION: Reduced geometry complexity
      const numLines = 30; // Reduced from 60
      const lineSegments = 45; // Reduced from 90

      // Calculate blur layers - create multiple overlapping layers for blur effect
      const blurLayers = blur > 0 ? Math.max(1, Math.floor(blur * 8)) : 0; // 0 blur layers when blur is 0
      const totalLayers = layers * (blurLayers > 0 ? blurLayers : 1); // Use 1 layer when no blur
      
      // Ensure we have enough pooled objects for all layers
      const totalLines = (numLines + Math.floor(numLines * 0.3)) * totalLayers;
      while (geometryPoolRef.current.length < totalLines) {
        geometryPoolRef.current.push(new THREE.BufferGeometry());
      }
      while (linePoolRef.current.length < totalLines) {
        const geometry = geometryPoolRef.current[linePoolRef.current.length];
        const line = new THREE.Line(geometry, wireframeMaterial);
        linePoolRef.current.push(line);
      }

      let lineIndex = 0;

      // Create multiple layers with progressive opacity
      for (let layerIndex = 0; layerIndex < layers; layerIndex++) {
        const baseLayerOpacity = intensity * (0.3 / (layerIndex + 1)); // Decreasing opacity for each layer
        const baseLayerOffset = layerIndex * 0.5; // Slight position offset for each layer
        
        // Create blur layers for this base layer (or just one layer if no blur)
        const layersToCreate = blurLayers > 0 ? blurLayers : 1;
        for (let blurIndex = 0; blurIndex < layersToCreate; blurIndex++) {
          const blurOffset = blur > 0 ? (blurIndex - (blurLayers - 1) / 2) * blur * 0.1 : 0; // Position offset for blur
          const blurOpacity = blur > 0 ? baseLayerOpacity * (1 - Math.abs(blurIndex - (blurLayers - 1) / 2) / blurLayers) : baseLayerOpacity;
          const layerOffset = baseLayerOffset + blurOffset;
          
          // Horizontal contour lines
          for (let i = 0; i < numLines; i++) {
            const v = i / (numLines - 1);
            const points: THREE.Vector3[] = [];
            
            for (let j = 0; j <= lineSegments; j++) {
              const u = j / lineSegments;
              const point = getCurrentForm(u, v, timeRef.current);
              // Apply size scaling and layer offset
              point.multiplyScalar(size);
              point.z += layerOffset;
              points.push(point);
            }
            
            const geometry = geometryPoolRef.current[lineIndex];
            geometry.setFromPoints(points);
            geometry.attributes.position.needsUpdate = true;
            
            const line = linePoolRef.current[lineIndex];
            line.geometry = geometry;
            
            // Create layer-specific material with adjusted opacity
            if (materialRef.current) {
              const layerMaterial = materialRef.current.clone();
              layerMaterial.opacity = blurOpacity;
              line.material = layerMaterial;
            }
            
            groupRef.current.add(line);
            lineIndex++;
          }

          // Vertical contour lines (fewer)
          const verticalLines = Math.floor(numLines * 0.3);
          for (let i = 0; i < verticalLines; i++) {
            const u = i / (verticalLines - 1);
            const points: THREE.Vector3[] = [];
            
            for (let j = 0; j <= Math.floor(lineSegments * 0.5); j++) {
              const v = j / Math.floor(lineSegments * 0.5);
              const point = getCurrentForm(u, v, timeRef.current);
              // Apply size scaling and layer offset
              point.multiplyScalar(size);
              point.z += layerOffset;
              points.push(point);
            }
            
            const geometry = geometryPoolRef.current[lineIndex];
            geometry.setFromPoints(points);
            geometry.attributes.position.needsUpdate = true;
            
            const line = linePoolRef.current[lineIndex];
            line.geometry = geometry;
            
            // Create layer-specific material with adjusted opacity
            if (materialRef.current) {
              const layerMaterial = materialRef.current.clone();
              layerMaterial.opacity = blurOpacity;
              line.material = layerMaterial;
            }
            
            groupRef.current.add(line);
            lineIndex++;
          }
        }
      }
    }

    // Apply rotation (every frame)
    const rotateSpeed = 0.00025 * finalRotationSpeed;
    const rotateX = Math.sin(timeRef.current * rotateSpeed) * 0.5;
    const rotateY = Math.cos(timeRef.current * rotateSpeed * 0.7) * 0.3;
    const rotateZ = timeRef.current * rotateSpeed * 0.1;
    
    groupRef.current.rotation.set(rotateX, rotateY, rotateZ);
  });

  if (!metamorphosis?.enabled) return null;

  return (
    <group 
      ref={groupRef} 
      position={[0, 0, -80]} // Position much further back to be behind wave interference
      scale={[2.0, 2.0, 2.0]} // Make it larger as background element
    />
  );
}; 