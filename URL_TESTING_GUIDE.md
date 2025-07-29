# 🧪 URL Preset System Testing Guide

## 🎯 How to Test URL Extensions:

### **1. Access the Share Menu**
- Look for the blue 🔗 button in the top-right corner
- Click to open the preset sharing menu

### **2. Test Local Preset URLs**
Format: `?p=<preset-name>`

Try these URLs:
```
http://localhost:3000?p=LANDING
http://localhost:3000?p=RALPH
http://localhost:3000?p=INIT
```

### **3. Test Cloud Preset URLs**
Format: `?preset=<mongodb-id>`

Try these URLs (using actual cloud preset IDs):
```
http://localhost:3000?preset=686e62c5a63c173742e2ba4c
http://localhost:3000?preset=685adcba5ef03e70eb285641
http://localhost:3000?preset=685abd6aff9941e3dffd84bb
```

### **4. Quick Test Feature**
- Click the "🧪 Test with Sample Preset" button
- This opens a new tab with a sample URL to verify functionality

## 🔍 What to Look For:

### **URL Loading Indicators**:
1. **Top banner** shows loading state when URL preset is detected
2. **Success message** displays preset name when loaded
3. **Error message** shows if preset not found

### **Share Functionality**:
1. **🔗 buttons** copy URLs to clipboard
2. **✓ checkmark** appears when URL copied successfully
3. **URLs work** when pasted in new browser tab

### **Visual Feedback**:
- Loading spinner during preset fetch
- Green banner for successful loads
- Red banner for errors
- Blue banner during loading

## 🚨 Troubleshooting:

### **If URLs don't work**:
1. Check browser console for errors
2. Verify preset exists (for cloud presets)
3. Ensure localhost:3000 is running
4. Try refreshing the page

### **If share button not visible**:
1. Look for blue 🔗 button in top-right
2. Make sure you're on the main page
3. Check if JavaScript is enabled

### **Common Test URLs**:
```bash
# Local preset test
curl http://localhost:3000?p=LANDING

# Cloud preset test  
curl http://localhost:3000?preset=686e62c5a63c173742e2ba4c

# Invalid preset test (should show error)
curl http://localhost:3000?p=INVALID
```

## ✅ Expected Behavior:

1. **Valid URL**: Preset loads automatically, banner shows success
2. **Invalid URL**: Error message displayed, falls back to default
3. **Share button**: Copies working URL to clipboard
4. **New tab test**: Pasted URL loads the same preset

The system should work seamlessly for sharing and loading presets via URLs!