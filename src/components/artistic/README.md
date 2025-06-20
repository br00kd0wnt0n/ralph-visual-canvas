# Artistic Canvas System

The Artistic Canvas System transforms 3D objects into dynamic painting brushes, creating beautiful visual compositions that blend 3D geometry with 2D canvas painting effects.

## 🎨 Overview

This system allows you to:
- Convert 3D objects into painting brushes with different behaviors
- Create trails, stamps, brush strokes, splatters, ripples, and glow effects
- Apply texture overlays and color grading
- Integrate with AI and weather data for dynamic parameter mapping
- Use preset configurations for different artistic styles

## 🏗️ Architecture

### Core Components

1. **ArtisticCanvas** - Main wrapper component that constrains camera and manages the painting canvas
2. **PaintingObject** - Wrapper component that adds painting behavior to 3D objects
3. **CanvasPainter** - Core painting engine that handles different brush types and effects
4. **ArtisticConfigBuilder** - Fluent API for creating custom configurations
5. **ParameterIntegration** - Maps AI and weather data to artistic parameters

### File Structure

```
src/components/artistic/
├── ArtisticCanvasSystem.tsx    # Core painting system
├── ArtisticConfigSystem.ts     # Configuration and presets
├── ArtisticCanvasExample.tsx   # Integration example
├── presets/
│   ├── index.ts
│   ├── subtle_flow.ts
│   ├── dynamic_painting.ts
│   └── minimal_zen.ts
└── README.md
```

## 🎯 Features

### Painting Behaviors

- **Trail** - Creates flowing trails behind moving objects
- **Stamp** - Places stamps at object positions
- **Brush** - Creates brush strokes with pressure sensitivity
- **Splatter** - Generates splatter effects around objects
- **Ripple** - Creates expanding ripple effects
- **Glow** - Adds glowing effects around objects

### Color Sources

- **Object** - Uses the object's material color
- **Temperature** - Maps temperature data to color spectrum
- **Rainbow** - Cycles through rainbow colors
- **Custom** - Uses a custom color value

### Blend Modes

Supports all standard CSS blend modes:
- `normal`, `multiply`, `screen`, `overlay`
- `soft-light`, `hard-light`, `color-dodge`, `color-burn`
- `darken`, `lighten`, `difference`, `exclusion`
- `hue`, `saturation`, `color`, `luminosity`

### Texture Overlays

- **Noise** - Adds noise texture
- **Grain** - Film grain effect
- **Watercolor** - Watercolor paper texture
- **Canvas** - Canvas texture
- **Paper** - Paper texture

## 🚀 Quick Start

### Basic Integration

```tsx
import { Canvas } from '@react-three/fiber';
import { ArtisticCanvas, PaintingObject } from './components/artistic/ArtisticCanvasSystem';
import { subtleFlowPreset } from './components/artistic/presets';

function MyScene() {
  return (
    <Canvas>
      <ArtisticCanvas config={subtleFlowPreset}>
        {/* Your 3D objects wrapped with PaintingObject */}
        <PaintingObject 
          behavior={subtleFlowPreset.objectBehaviors.spheres}
          position={{ x: 0, y: 0, z: 0 }}
          objectColor="#ff6b6b"
        >
          <mesh>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#ff6b6b" />
          </mesh>
        </PaintingObject>
      </ArtisticCanvas>
    </Canvas>
  );
}
```

### Custom Configuration

```tsx
import { ArtisticConfigBuilder } from './components/artistic/ArtisticConfigSystem';

const customConfig = new ArtisticConfigBuilder('subtle_flow')
  .setAquariumView(30, 60)
  .setFadeRate(0.01)
  .setBlendMode('screen')
  .enableTrails(['spheres', 'toruses'], { 
    trailLength: 40, 
    trailWidth: 5, 
    trailFade: 0.97 
  })
  .enableGlow(['blobs'], { 
    glowIntensity: 1.5, 
    glowRadius: 25 
  })
  .addTextureLayer('watercolor', { 
    opacity: 0.15, 
    blendMode: 'overlay',
    scale: 1.2,
    movement: { x: 0.05, y: 0.02 }
  })
  .setColorGrading({ 
    saturation: 1.2, 
    contrast: 1.1, 
    brightness: 1.05 
  })
  .enableCohesionEffects({
    connectionLines: { 
      enabled: true, 
      maxDistance: 35, 
      opacity: 0.15, 
      thickness: 1.5, 
      color: 'temperature' 
    }
  })
  .makeWeatherResponsive()
  .build();
```

## 📋 Presets

### Subtle Flow
- Calm, flowing background suitable for websites
- Soft trails and gentle brush strokes
- Minimal texture overlay
- Weather-responsive temperature mapping

### Dynamic Painting
- Energetic, artistic expression
- Rainbow colors and watercolor textures
- Multiple texture layers
- High trail quality and cohesion effects

### Minimal Zen
- Minimal, zen-like aesthetic
- Reduced object count and opacity
- Paper texture overlay
- Low trail quality for performance

## 🔧 Configuration Options

### Camera Constraints
```tsx
cameraConstraint: {
  enabled: true,
  position: [0, 0, 25],        // Camera position
  lookAt: [0, 0, 0],          // Look at point
  fov: 50,                    // Field of view
  near: 1,                    // Near clipping plane
  far: 100,                   // Far clipping plane
}
```

### Painting System
```tsx
paintingSystem: {
  enabled: true,
  canvasResolution: [1920, 1080],  // Canvas resolution
  fadeRate: 0.02,                  // Fade rate per frame
  blendModes: ['soft-light', 'overlay', 'screen'],
  activeBlendMode: 'soft-light',
}
```

### Object Behaviors
```tsx
objectBehaviors: {
  spheres: {
    enabled: true,
    type: 'trail',              // Painting type
    brushSize: 15,              // Brush size
    opacity: 0.3,               // Opacity
    color: 'object',            // Color source
    trailLength: 30,            // Trail-specific
    trailWidth: 3,
    trailFade: 0.95,
    interactions: { withOtherObjects: false }
  }
}
```

## 🌤️ Weather Integration

The system can respond to weather data:

```tsx
import { ParameterIntegration } from './components/artistic/ArtisticConfigSystem';

const weatherData = {
  temperature: 25,
  humidity: 60,
  pressure: 1013,
  windSpeed: 15,
  weatherCondition: 'partly_cloudy',
  visibility: 8
};

const weatherResponsiveConfig = ParameterIntegration.mapWeatherToArtistic(
  weatherData, 
  baseConfig
);
```

## 🤖 AI Integration

The system can respond to AI analysis results:

```tsx
const aiData = {
  theme: 'energetic',
  mood: 'excited',
  complexity: 0.8,
  energy: 0.9,
  colorPalette: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
  style: 'abstract'
};

const aiResponsiveConfig = ParameterIntegration.mapAIToArtistic(
  aiData, 
  baseConfig
);
```

## 🎛️ Performance Optimization

### For Performance
```tsx
const performanceConfig = new ArtisticConfigBuilder()
  .optimizeForPerformance()
  .build();
```

### For Quality
```tsx
const qualityConfig = new ArtisticConfigBuilder()
  .optimizeForQuality()
  .build();
```

## 🔄 Integration with Existing Components

To integrate with your existing React Three Fiber components:

1. Wrap your Canvas with `ArtisticCanvas`
2. Wrap individual objects with `PaintingObject`
3. Configure behaviors in your artistic config
4. Use the `useArtisticPainter` hook to access the painter directly

```tsx
import { useArtisticPainter } from './components/artistic/ArtisticCanvasSystem';

function MyComponent() {
  const painter = useArtisticPainter();
  
  // Access painter methods directly
  useEffect(() => {
    if (painter) {
      painter.clear(); // Clear canvas
      // painter.getDataURL(); // Get canvas as data URL
    }
  }, [painter]);
}
```

## 🎨 Advanced Features

### Texture Overlays
Add multiple texture layers for complex effects:

```tsx
.addTextureLayer('watercolor', { 
  opacity: 0.15, 
  blendMode: 'overlay',
  scale: 1.2,
  movement: { x: 0.05, y: 0.02 }
})
.addTextureLayer('noise', { 
  opacity: 0.08, 
  blendMode: 'soft-light',
  scale: 3,
  movement: { x: -0.05, y: 0.02 }
})
```

### Cohesion Effects
Enable connection lines and field effects:

```tsx
.enableCohesionEffects({
  connectionLines: { 
    enabled: true, 
    maxDistance: 40, 
    opacity: 0.2, 
    thickness: 2, 
    color: 'temperature' 
  },
  fieldEffects: { 
    enabled: true, 
    strength: 0.2, 
    range: 25, 
    visualizeField: false 
  },
  ambientGlow: { 
    enabled: true, 
    intensity: 0.3, 
    radius: 80, 
    color: 'auto' 
  }
})
```

## 🐛 Troubleshooting

### Common Issues

1. **Canvas not appearing**: Ensure `paintingSystem.enabled` is true
2. **Objects not painting**: Check that `behavior.enabled` is true for the object type
3. **Performance issues**: Use `optimizeForPerformance()` or reduce canvas resolution
4. **Blend mode not working**: Verify the blend mode is supported by the browser

### Debug Tips

- Use the `useArtisticPainter` hook to access painter methods
- Check browser console for WebGL context errors
- Monitor frame rate and reduce complexity if needed
- Test with different blend modes for desired effects

## 📚 Examples

See `ArtisticCanvasExample.tsx` for a complete working example with:
- Multiple preset configurations
- Real-time preset switching
- Custom configuration builder
- Integration with existing 3D objects

## 🔮 Future Enhancements

- GPU-accelerated painting for better performance
- More brush textures and effects
- Real-time collaboration features
- Export to video formats
- Advanced particle systems integration 