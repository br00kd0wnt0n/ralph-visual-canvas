import { useVisualStore } from '../store/visualStore';

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface ViewportBounds {
  x: [number, number];
  y: [number, number];
  z: [number, number];
}

/**
 * Constrain a position to the viewport bounds when in artistic mode
 */
export const constrainToViewport = (position: Position3D, layerZ: number = 0): Position3D => {
  const { backgroundConfig } = useVisualStore.getState();
  
  if (!backgroundConfig.enabled) {
    return position;
  }
  
  const bounds = backgroundConfig.artisticLayout.viewport.bounds;
  const adjustedZ = position.z + layerZ;
  
  // Only constrain if the position is actually outside the bounds
  // This allows natural movement within the bounds
  const constrainedX = position.x < bounds.x[0] ? bounds.x[0] : 
                      position.x > bounds.x[1] ? bounds.x[1] : position.x;
  const constrainedY = position.y < bounds.y[0] ? bounds.y[0] : 
                      position.y > bounds.y[1] ? bounds.y[1] : position.y;
  const constrainedZ = adjustedZ < bounds.z[0] ? bounds.z[0] - layerZ : 
                      adjustedZ > bounds.z[1] ? bounds.z[1] - layerZ : position.z;
  
  return {
    x: constrainedX,
    y: constrainedY,
    z: constrainedZ
  };
};

/**
 * Get the layer configuration for a specific object type
 */
export const getLayerConfig = (objectType: string) => {
  const { backgroundConfig } = useVisualStore.getState();
  
  if (!backgroundConfig.enabled) {
    return null;
  }
  
  const { layers } = backgroundConfig.artisticLayout;
  
  // Find which layer contains this object type
  for (const [layerName, layerConfig] of Object.entries(layers)) {
    if (layerConfig.objects.includes(objectType)) {
      return {
        name: layerName,
        ...layerConfig
      };
    }
  }
  
  // Default to nearBackground if not found
  return {
    name: 'nearBackground',
    ...layers.nearBackground
  };
};

/**
 * Get movement speed multiplier based on layer movement type
 */
export const getMovementSpeed = (movementType: 'minimal' | 'slow' | 'normal' | 'active'): number => {
  switch (movementType) {
    case 'minimal': return 0.2;
    case 'slow': return 0.5;
    case 'normal': return 0.8;
    case 'active': return 1.2;
    default: return 0.8;
  }
};

/**
 * Get the optimal camera position for artistic mode
 */
export const getArtisticCameraConfig = () => {
  const { backgroundConfig } = useVisualStore.getState();
  
  if (!backgroundConfig.enabled) {
    return null;
  }
  
  return backgroundConfig.artisticLayout.camera;
}; 