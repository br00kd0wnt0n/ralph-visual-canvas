// GlobalAPI.ts
// Exposes preset control functions to the global window object

import { changePreset, getAvailablePresets, getCurrentPreset, listCloudPresets } from './PresetController';

// Define the global API interface
export interface RalphCanvasAPI {
  changePreset: (presetName: string) => Promise<boolean>;
  getAvailablePresets: () => { local: string[], cloud: string[] };
  getCurrentPreset: () => string | null;
  listCloudPresets: () => Promise<Array<{ id: string, name: string, description?: string }>>;
  version: string;
}

// Create the API object
const ralphCanvasAPI: RalphCanvasAPI = {
  changePreset,
  getAvailablePresets,
  getCurrentPreset,
  listCloudPresets,
  version: '1.0.0'
};

// Attach to window object for global access
declare global {
  interface Window {
    RalphCanvas: RalphCanvasAPI;
  }
}

// Initialize the global API
export function initializeGlobalAPI() {
  if (typeof window !== 'undefined') {
    window.RalphCanvas = ralphCanvasAPI;
    
    console.log('🎨 Ralph Canvas API initialized');
    console.log('Available methods:');
    console.log('  - RalphCanvas.changePreset(name)');
    console.log('  - RalphCanvas.getAvailablePresets()');
    console.log('  - RalphCanvas.getCurrentPreset()');
    console.log('  - RalphCanvas.listCloudPresets()');
    console.log('');
    console.log('Example usage:');
    console.log('  RalphCanvas.changePreset("creative")');
    console.log('  RalphCanvas.changePreset("LANDING")');
    
    return true;
  }
  return false;
}

export default ralphCanvasAPI;