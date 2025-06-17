import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVisualStore } from '../store/visualStore';
import * as THREE from 'three';

interface FormFunction {
  (u: number, v: number, t: number): THREE.Vector3;
}

export const Metamorphosis = () => {
  const { globalEffects, geometric } = useVisualStore();
  const { metamorphosis } = globalEffects;
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(2000);
  const frameCountRef = useRef(0);
  const lastUpdateRef = useRef(0);

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

  // Create wireframe material
  const wireframeMaterial = useMemo(() => 
    new THREE.LineBasicMaterial({
      color: geometric.metamorphosis?.color || '#333333',
      transparent: true,
      opacity: metamorphosis?.wireframeOpacity || 0.4,
    }), [geometric.metamorphosis?.color, metamorphosis?.wireframeOpacity]
  );

  // Pre-allocate geometry objects for reuse
  const geometryPoolRef = useRef<THREE.BufferGeometry[]>([]);
  const linePoolRef = useRef<THREE.Line[]>([]);

  useFrame((state, delta) => {
    if (!metamorphosis?.enabled || !groupRef.current) return;

    const morphSpeed = metamorphosis.morphSpeed || 1;
    const size = metamorphosis.size || 1.0;
    const blur = metamorphosis.blur || 0.0;
    timeRef.current += delta * 30 * morphSpeed; // Animation speed

    // PERFORMANCE OPTIMIZATION: Only update geometry every 3 frames
    frameCountRef.current++;
    const shouldUpdateGeometry = frameCountRef.current % 3 === 0;
    
    if (shouldUpdateGeometry) {
      // Clear previous geometry
      groupRef.current.clear();

      // PERFORMANCE OPTIMIZATION: Reduced geometry complexity
      const numLines = 30; // Reduced from 60
      const lineSegments = 45; // Reduced from 90

      // Ensure we have enough pooled objects
      const totalLines = numLines + Math.floor(numLines * 0.3);
      while (geometryPoolRef.current.length < totalLines) {
        geometryPoolRef.current.push(new THREE.BufferGeometry());
      }
      while (linePoolRef.current.length < totalLines) {
        const geometry = geometryPoolRef.current[linePoolRef.current.length];
        linePoolRef.current.push(new THREE.Line(geometry, wireframeMaterial));
      }

      let lineIndex = 0;

      // Horizontal contour lines
      for (let i = 0; i < numLines; i++) {
        const v = i / (numLines - 1);
        const points: THREE.Vector3[] = [];
        
        for (let j = 0; j <= lineSegments; j++) {
          const u = j / lineSegments;
          const point = getCurrentForm(u, v, timeRef.current);
          // Apply size scaling
          point.multiplyScalar(size);
          points.push(point);
        }
        
        const geometry = geometryPoolRef.current[lineIndex];
        geometry.setFromPoints(points);
        geometry.attributes.position.needsUpdate = true;
        
        const line = linePoolRef.current[lineIndex];
        line.geometry = geometry;
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
          // Apply size scaling
          point.multiplyScalar(size);
          points.push(point);
        }
        
        const geometry = geometryPoolRef.current[lineIndex];
        geometry.setFromPoints(points);
        geometry.attributes.position.needsUpdate = true;
        
        const line = linePoolRef.current[lineIndex];
        line.geometry = geometry;
        groupRef.current.add(line);
        lineIndex++;
      }
    }

    // Apply rotation (every frame)
    const rotationSpeed = metamorphosis.rotationSpeed || 1;
    const rotateSpeed = 0.00025 * rotationSpeed;
    const rotateX = Math.sin(timeRef.current * rotateSpeed) * 0.5;
    const rotateY = Math.cos(timeRef.current * rotateSpeed * 0.7) * 0.3;
    const rotateZ = timeRef.current * rotateSpeed * 0.1;
    
    groupRef.current.rotation.set(rotateX, rotateY, rotateZ);
    
    // Apply blur effect by adjusting material properties
    if (blur > 0) {
      wireframeMaterial.opacity = (metamorphosis.wireframeOpacity || 0.4) * (1 - blur * 0.5);
      wireframeMaterial.transparent = true;
    } else {
      wireframeMaterial.opacity = metamorphosis.wireframeOpacity || 0.4;
    }
  });

  if (!metamorphosis?.enabled) return null;

  return (
    <group 
      ref={groupRef} 
      position={[0, 0, -30]} // Position behind other objects
      scale={[1.5, 1.5, 1.5]} // Make it larger as background element
    />
  );
}; 