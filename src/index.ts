// Main exports for Ralph Canvas
export { default as RalphCanvasBackground } from './components/RalphCanvasBackground';
export { initializeGlobalAPI } from './api/GlobalAPI';
export { changePreset, getAvailablePresets, getCurrentPreset, listCloudPresets } from './api/PresetController';
export type { RalphCanvasAPI } from './api/GlobalAPI';

// For TypeScript users
declare global {
  interface Window {
    RalphCanvas: {
      changePreset: (presetName: string) => Promise<boolean>;
      getAvailablePresets: () => { local: string[], cloud: string[] };
      getCurrentPreset: () => string | null;
      listCloudPresets: () => Promise<Array<{ id: string, name: string, description?: string }>>;
      version: string;
    };
  }
}