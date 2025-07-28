# Performance Optimization Implementation Plan

## Quick Wins (Implement First)

### 1. Fix Camera Update Frequencies

```typescript
// Camera update optimization - reduce frequency based on actual movement
const CAMERA_UPDATE_THRESHOLD = 0.01; // Minimum movement to trigger update
const MIN_UPDATE_INTERVAL = 100; // Minimum ms between updates

// In AutoPanSystem component:
const lastPositionRef = useRef<THREE.Vector3>(new THREE.Vector3());
const lastUpdateTime = useRef(0);

useFrame((state) => {
  if (!camera.autoPan.enabled) return;
  
  const now = performance.now();
  if (now - lastUpdateTime.current < MIN_UPDATE_INTERVAL) return;
  
  // Calculate new position
  const newPosition = calculateNewPosition();
  
  // Only update if position changed significantly
  if (lastPositionRef.current.distanceTo(newPosition) > CAMERA_UPDATE_THRESHOLD) {
    three.camera.position.copy(newPosition);
    lastPositionRef.current.copy(newPosition);
    lastUpdateTime.current = now;
  }
});
```

### 2. Implement Instanced Rendering

```typescript
// Replace individual mesh creation with instanced mesh
const createInstancedShapes = (count: number, geometry: THREE.BufferGeometry) => {
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  const matrix = new THREE.Matrix4();
  
  for (let i = 0; i < count; i++) {
    matrix.setPosition(positions[i]);
    mesh.setMatrixAt(i, matrix);
  }
  
  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
};
```

### 3. Optimize useFrame Hooks

```typescript
// Consolidate multiple useFrame into single update manager
const UpdateManager = () => {
  const frameCount = useRef(0);
  
  useFrame((state, delta) => {
    frameCount.current++;
    
    // Update different systems at different frequencies
    if (frameCount.current % 2 === 0) updateParticles(state, delta);
    if (frameCount.current % 3 === 0) updateTrails(state, delta);
    if (frameCount.current % 4 === 0) updateShapes(state, delta);
    if (frameCount.current % 8 === 0) updateCamera(state, delta);
  });
};
```

## Medium Priority Fixes

### 1. Material and Geometry Pooling

```typescript
// Material pool to reuse materials
class MaterialPool {
  private pool: Map<string, THREE.Material[]> = new Map();
  
  getMaterial(key: string, factory: () => THREE.Material): THREE.Material {
    if (!this.pool.has(key)) {
      this.pool.set(key, []);
    }
    
    const materials = this.pool.get(key)!;
    return materials.pop() || factory();
  }
  
  returnMaterial(key: string, material: THREE.Material): void {
    if (!this.pool.has(key)) {
      this.pool.set(key, []);
    }
    this.pool.get(key)!.push(material);
  }
}
```

### 2. LOD (Level of Detail) System

```typescript
// Implement LOD for distant objects
const createLODObject = (highDetail: THREE.Mesh, mediumDetail: THREE.Mesh, lowDetail: THREE.Mesh) => {
  const lod = new THREE.LOD();
  
  lod.addLevel(highDetail, 0);     // 0-50 units
  lod.addLevel(mediumDetail, 50);  // 50-100 units
  lod.addLevel(lowDetail, 100);    // 100+ units
  
  return lod;
};
```

### 3. Batch State Updates

```typescript
// Batch multiple state updates
const batchedUpdates = {
  pending: new Map(),
  
  schedule(key: string, value: any) {
    this.pending.set(key, value);
    
    if (this.pending.size === 1) {
      requestAnimationFrame(() => this.flush());
    }
  },
  
  flush() {
    const updates = Object.fromEntries(this.pending);
    this.pending.clear();
    
    // Apply all updates at once
    useVisualStore.setState(updates);
  }
};
```

## Performance Monitoring Integration

### Add Real-time Performance Metrics

```typescript
const PerformanceOverlay = () => {
  const { fps, performance } = usePerformanceMonitor();
  const memoryInfo = memoryManager.getMemoryInfo();
  
  return (
    <div className="performance-overlay">
      <div>FPS: {fps}</div>
      <div>Performance: {performance}</div>
      {memoryInfo && (
        <div>Memory: {Math.round(memoryInfo.used / 1024 / 1024)}MB</div>
      )}
    </div>
  );
};
```

## Testing Performance Improvements

### Before Optimization:
- Manual Camera: 30-45 FPS
- Auto-Pan: 25-40 FPS
- 100 Objects: <20 FPS

### Expected After Optimization:
- Manual Camera: 55-60 FPS
- Auto-Pan: 50-60 FPS
- 100 Objects: 40-50 FPS

## Implementation Priority:

1. **Week 1**: Camera optimizations + useFrame consolidation
2. **Week 2**: Instanced rendering + Material pooling
3. **Week 3**: LOD system + Batch updates
4. **Week 4**: Testing + Performance monitoring UI