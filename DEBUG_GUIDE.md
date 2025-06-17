# 🔍 Effect Debugging Guide

## Current Debug Setup

### 1. Debug Panel (Top of Dashboard)
- **Location**: Red-tinted section at the top of the Global Effects Dashboard
- **Shows**: Real-time values for all major effects
- **Purpose**: Verify that effect values are being updated correctly

### 2. Console Logging
- **Location**: Browser Developer Tools Console
- **Shows**: Detailed effect state on every render
- **Look for**: `=== EFFECTS DEBUG ===` section

### 3. Visual Debug Indicators
- **Location**: Top-left corner of the canvas
- **Colors**:
  - 🔴 **Red**: Atmospheric Blur (shows layer count)
  - 🔵 **Blue**: Vignette (shows intensity)
  - 🟢 **Green**: Shape Glow (shows intensity)
  - 🟣 **Purple**: Volumetric (shows fog value)
  - 🟠 **Orange**: Chromatic (shows aberration value)

## Systematic Testing Protocol

### STEP 1: Verify Store State
1. Open browser console (F12)
2. Look for `=== EFFECTS DEBUG ===` logs
3. Verify all effect values are present and correct
4. Check for any error messages

### STEP 2: Test Atmospheric Blur
1. **Enable** Atmospheric Blur in dashboard
2. **Check Debug Panel**: Should show `enabled=true, layers=5`
3. **Check Visual Indicator**: Red box should appear showing layer count
4. **Check Console**: Should log atmospheric blur state
5. **Adjust Layers**: Change from 5 to 10, verify debug panel updates
6. **Adjust Intensity**: Change from 0.5 to 2.0, verify visual effect

**Expected Behavior**: 
- Red debug indicator appears when enabled
- Canvas should show blur effect
- Console should log state changes

### STEP 3: Test Vignette
1. **Adjust Vignette** slider in "Enhanced Post-FX" section
2. **Check Debug Panel**: Should show vignette value
3. **Check Visual Indicator**: Blue box should appear when > 0
4. **Check Console**: Should log vignette value

**Expected Behavior**:
- Blue debug indicator appears when vignette > 0
- Darkening effect around edges of canvas
- Console should log value changes

### STEP 4: Test Shape Glow
1. **Enable** Shape Glow in dashboard
2. **Check Debug Panel**: Should show intensity and radius
3. **Check Visual Indicator**: Green box should appear
4. **Check Console**: Should log glow system state
5. **Adjust Intensity**: Change from 0.4 to 1.0
6. **Check 3D Objects**: Spheres/cubes should have glow effect

**Expected Behavior**:
- Green debug indicator appears when enabled
- 3D objects should have visible glow
- Console should log glow parameters

### STEP 5: Test Volumetric Effects
1. **Enable** Volumetric in dashboard
2. **Check Debug Panel**: Should show fog and lightShafts values
3. **Check Visual Indicator**: Purple box should appear
4. **Check Console**: Should log volumetric state
5. **Adjust Fog**: Change from 0 to 0.5
6. **Adjust Light Shafts**: Change from 0 to 0.3

**Expected Behavior**:
- Purple debug indicator appears when enabled
- Fog effect should be visible in 3D scene
- Light shafts should appear as planes
- Console should log volumetric parameters

### STEP 6: Test Chromatic Aberration
1. **Enable** Chromatic Effects in dashboard
2. **Check Debug Panel**: Should show aberration value
3. **Check Visual Indicator**: Orange box should appear
4. **Check Console**: Should log chromatic state
5. **Adjust Aberration**: Change from 0 to 5
6. **Check Color Channels**: Red, green, blue separation should be visible

**Expected Behavior**:
- Orange debug indicator appears when enabled
- Color separation effect should be visible
- RGB channels should be offset
- Console should log chromatic parameters

## Troubleshooting Checklist

### If Debug Panel Shows Wrong Values:
- Check store initialization
- Verify updateGlobalEffects function calls
- Check for state persistence issues

### If Visual Indicators Don't Appear:
- Check component rendering
- Verify conditional logic
- Check z-index conflicts

### If Console Logs Are Missing:
- Check component mounting
- Verify store subscription
- Check for JavaScript errors

### If Effects Don't Render:
- Check layer z-index ordering
- Verify CSS filter support
- Check for conflicting styles
- Verify Three.js material settings

## Common Issues to Look For

1. **Z-Index Conflicts**: Effects might be hidden behind other layers
2. **CSS Filter Support**: Some browsers don't support all filters
3. **State Synchronization**: Store updates might not trigger re-renders
4. **Three.js Material Issues**: Glow effects might not work with certain materials
5. **Performance Issues**: Too many effects might cause lag

## Next Steps After Testing

1. **Document Working Effects**: Note which effects function correctly
2. **Identify Broken Effects**: List specific effects that don't work
3. **Check Error Patterns**: Look for common issues across broken effects
4. **Prioritize Fixes**: Focus on most important effects first

## Quick Test Commands

```javascript
// In browser console, test store state:
console.log(useVisualStore.getState().globalEffects)

// Test specific effect:
console.log(useVisualStore.getState().globalEffects.atmosphericBlur)

// Force re-render:
// Click the "Force Re-render (Test)" button

// NEW: Use debug helpers (easier access):
window.debugStore.getState()           // Get full store state
window.debugStore.getEffects()         // Get all global effects
window.debugStore.getAtmosphericBlur() // Get atmospheric blur state
window.debugStore.getShapeGlow()       // Get shape glow state
window.debugStore.getVolumetric()      // Get volumetric state
window.debugStore.getChromatic()       // Get chromatic state
window.debugStore.getVignette()        // Get vignette value

// Example: Check if atmospheric blur is working
const blur = window.debugStore.getAtmosphericBlur();
console.log('Blur enabled:', blur.enabled, 'Layers:', blur.layers, 'Intensity:', blur.intensity);
```

---

**Remember**: This is temporary debugging code. Remove debug indicators and console logs once issues are identified and fixed. 