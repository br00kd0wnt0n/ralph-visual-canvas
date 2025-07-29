# 🎨 Ralph Canvas - Component Usage Guide

## Using Ralph Canvas as a Website Background

### Basic Integration

```tsx
import { RalphCanvasBackground } from './src/components/RalphCanvasBackground';

function MyWebsite() {
  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      {/* Ralph Canvas Background */}
      <RalphCanvasBackground 
        defaultPreset="LANDING"
        onPresetLoaded={(name) => console.log(`Loaded: ${name}`)}
      />
      
      {/* Your website content */}
      <div style={{ position: 'relative', zIndex: 100 }}>
        <h1>My Amazing Website</h1>
        <p>Content goes here...</p>
      </div>
    </div>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultPreset` | `string` | `'LANDING'` | Preset to load on mount |
| `showLoading` | `boolean` | `true` | Show loading screen |
| `loadingComponent` | `ReactNode` | Built-in spinner | Custom loading component |
| `onPresetLoaded` | `(name: string) => void` | `undefined` | Callback when preset loads |
| `className` | `string` | `''` | Additional CSS classes |
| `style` | `CSSProperties` | `{}` | Additional styles |

## 🎛️ Controlling Presets Programmatically

### Global API Methods

Once the component is mounted, you can control it using the global `RalphCanvas` API:

```javascript
// Change preset
await RalphCanvas.changePreset('creative');
await RalphCanvas.changePreset('LANDING');
await RalphCanvas.changePreset('minimal');

// Get available presets
const presets = RalphCanvas.getAvailablePresets();
console.log('Local presets:', presets.local);
console.log('Cloud presets:', presets.cloud);

// Get current preset
const current = RalphCanvas.getCurrentPreset();
console.log('Current preset:', current);

// List all cloud presets with details
const cloudPresets = await RalphCanvas.listCloudPresets();
console.log('Available cloud presets:', cloudPresets);
```

### Example: Dynamic Preset Switching

```javascript
// Button click handlers
function switchToCreative() {
  RalphCanvas.changePreset('creative');
}

function switchToMinimal() {
  RalphCanvas.changePreset('minimal');
}

function switchToLanding() {
  RalphCanvas.changePreset('LANDING');
}

// Automatic preset rotation
function rotatePresets() {
  const presets = ['LANDING', 'creative', 'minimal', 'energetic'];
  let currentIndex = 0;
  
  setInterval(() => {
    RalphCanvas.changePreset(presets[currentIndex]);
    currentIndex = (currentIndex + 1) % presets.length;
  }, 10000); // Change every 10 seconds
}
```

## 🎨 Available Presets

### Cloud Presets (Always Available)
- `LANDING` - Clean, professional look
- `creative` - Vibrant, artistic style
- `minimal` - Simple, elegant design
- `energetic` - Dynamic, high-energy visuals

### Local Presets (Browser-specific)
- `INIT` - Basic initialization preset
- Custom presets saved by users

## 🔧 Integration Examples

### React Component

```tsx
import React, { useEffect } from 'react';
import { RalphCanvasBackground } from './src/components/RalphCanvasBackground';

function HomePage() {
  useEffect(() => {
    // Set initial preset after component mounts
    setTimeout(() => {
      RalphCanvas.changePreset('creative');
    }, 1000);
  }, []);

  return (
    <div style={{ height: '100vh' }}>
      <RalphCanvasBackground defaultPreset="LANDING" />
      
      <div className="content-overlay">
        <nav>
          <button onClick={() => RalphCanvas.changePreset('creative')}>
            Creative
          </button>
          <button onClick={() => RalphCanvas.changePreset('minimal')}>
            Minimal
          </button>
        </nav>
        
        <main>
          <h1>Welcome to My Site</h1>
        </main>
      </div>
    </div>
  );
}
```

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <div id="background-container" style="height: 100vh; position: relative;">
    <!-- Ralph Canvas will render here -->
  </div>
  
  <div style="position: absolute; top: 0; z-index: 100;">
    <button onclick="changeToCreative()">Creative</button>
    <button onclick="changeToMinimal()">Minimal</button>
  </div>

  <script>
    function changeToCreative() {
      RalphCanvas.changePreset('creative');
    }
    
    function changeToMinimal() {
      RalphCanvas.changePreset('minimal');
    }
    
    // Auto-change preset every 30 seconds
    setInterval(() => {
      const presets = ['LANDING', 'creative', 'minimal'];
      const randomPreset = presets[Math.floor(Math.random() * presets.length)];
      RalphCanvas.changePreset(randomPreset);
    }, 30000);
  </script>
</body>
</html>
```

## 🚀 Build for Production

To use as a component, build the project:

```bash
npm run build
```

Then import the built component into your website project.

## 🎯 Best Practices

1. **Loading States**: Always handle loading states for smooth UX
2. **Error Handling**: Wrap preset changes in try-catch blocks
3. **Performance**: Avoid changing presets too frequently (< 1 second intervals)
4. **Fallbacks**: Always specify a reliable default preset
5. **Z-Index**: Ensure your content has higher z-index than the background

## 🐛 Troubleshooting

### Preset Not Loading
```javascript
// Check if preset exists
const presets = RalphCanvas.getAvailablePresets();
console.log('Available presets:', presets);

// Try loading with error handling
try {
  const success = await RalphCanvas.changePreset('your-preset');
  if (!success) {
    console.log('Preset not found, falling back to LANDING');
    await RalphCanvas.changePreset('LANDING');
  }
} catch (error) {
  console.error('Error loading preset:', error);
}
```

### API Not Available
```javascript
// Check if API is loaded
if (typeof window !== 'undefined' && window.RalphCanvas) {
  // API is available
  RalphCanvas.changePreset('creative');
} else {
  // Wait for API to load
  setTimeout(() => {
    RalphCanvas.changePreset('creative');
  }, 1000);
}
```

This approach gives you complete programmatic control without URL dependencies!