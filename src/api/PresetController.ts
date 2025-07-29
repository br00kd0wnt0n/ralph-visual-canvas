// PresetController.ts
// Global API for controlling presets programmatically

import { useVisualStore } from '../store/visualStore';
import { PresetClient } from '../lib/presetClient';

export interface PresetControllerAPI {
  changePreset: (presetName: string) => Promise<boolean>;
  getAvailablePresets: () => { local: string[], cloud: string[] };
  getCurrentPreset: () => string | null;
  listCloudPresets: () => Promise<Array<{ id: string, name: string, description?: string }>>;
}

class PresetController implements PresetControllerAPI {
  private static instance: PresetController;
  private currentPreset: string | null = null;
  private cloudPresets: Array<{ id: string, name: string, description?: string }> = [];

  private constructor() {
    this.loadCloudPresets();
  }

  public static getInstance(): PresetController {
    if (!PresetController.instance) {
      PresetController.instance = new PresetController();
    }
    return PresetController.instance;
  }

  private async loadCloudPresets() {
    try {
      const response = await PresetClient.getPresets({ limit: 100 });
      this.cloudPresets = response.presets.map(p => ({
        id: p._id?.toString() || '',
        name: p.name,
        description: p.description
      }));
    } catch (error) {
      console.warn('Failed to load cloud presets:', error);
    }
  }

  /**
   * Change to a specific preset by name
   * @param presetName - Name of the preset to load (e.g., 'LANDING', 'creative', 'minimal')
   * @returns Promise<boolean> - Success status
   */
  public async changePreset(presetName: string): Promise<boolean> {
    try {
      const store = useVisualStore.getState();
      
      // First try local presets
      const localPresets = store.getAvailablePresets();
      if (localPresets.includes(presetName)) {
        store.loadPreset(presetName);
        this.currentPreset = presetName;
        console.log(`✅ Loaded local preset: ${presetName}`);
        return true;
      }

      // Then try cloud presets
      const cloudPreset = this.cloudPresets.find(p => 
        p.name.toLowerCase() === presetName.toLowerCase()
      );
      
      if (cloudPreset) {
        const preset = await PresetClient.getPresetById(cloudPreset.id);
        if (preset && preset.data) {
          store.loadPresetData(preset.data);
          this.currentPreset = preset.name;
          console.log(`✅ Loaded cloud preset: ${preset.name}`);
          return true;
        }
      }

      console.warn(`❌ Preset "${presetName}" not found in local or cloud storage`);
      return false;
    } catch (error) {
      console.error(`❌ Error loading preset "${presetName}":`, error);
      return false;
    }
  }

  /**
   * Get list of available presets
   * @returns Object with local and cloud preset arrays
   */
  public getAvailablePresets(): { local: string[], cloud: string[] } {
    const store = useVisualStore.getState();
    return {
      local: store.getAvailablePresets(),
      cloud: this.cloudPresets.map(p => p.name)
    };
  }

  /**
   * Get currently active preset name
   * @returns Current preset name or null
   */
  public getCurrentPreset(): string | null {
    return this.currentPreset;
  }

  /**
   * Get detailed list of cloud presets
   * @returns Array of cloud preset details
   */
  public async listCloudPresets(): Promise<Array<{ id: string, name: string, description?: string }>> {
    await this.loadCloudPresets(); // Refresh the list
    return [...this.cloudPresets];
  }
}

// Global instance
const presetController = PresetController.getInstance();

// Export the API methods directly for easier access
export const changePreset = (presetName: string) => presetController.changePreset(presetName);
export const getAvailablePresets = () => presetController.getAvailablePresets();
export const getCurrentPreset = () => presetController.getCurrentPreset();
export const listCloudPresets = () => presetController.listCloudPresets();

// Export the controller instance
export default presetController;