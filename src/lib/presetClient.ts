import { Preset, CreatePresetRequest, UpdatePresetRequest, PresetListResponse } from '@/types/preset';

const API_BASE = '/api/presets';

export class PresetClient {
  static async getPresets(params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    isPublic?: boolean;
  }): Promise<PresetListResponse> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.category) searchParams.append('category', params.category);
    if (params.search) searchParams.append('search', params.search);
    if (params.isPublic !== undefined) searchParams.append('isPublic', params.isPublic.toString());

    const response = await fetch(`${API_BASE}?${searchParams.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch presets: ${response.statusText}`);
    }
    return response.json();
  }

  static async getPresetById(id: string): Promise<Preset> {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch preset: ${response.statusText}`);
    }
    return response.json();
  }

  static async createPreset(presetData: CreatePresetRequest): Promise<Preset> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(presetData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to create preset: ${response.statusText}`);
    }
    
    return response.json();
  }

  static async updatePreset(id: string, updateData: Partial<UpdatePresetRequest>): Promise<Preset> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to update preset: ${response.statusText}`);
    }
    
    return response.json();
  }

  static async deletePreset(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to delete preset: ${response.statusText}`);
    }
  }

  static async saveCurrentState(name: string, description?: string): Promise<Preset> {
    // This will be implemented to save the current visual state
    // We'll need to get the current state from the visual store
    const currentState = {
      camera: {},
      particles: {},
      shapes: {},
      globalEffects: {},
      backgroundConfig: {},
      performance: {},
      quality: {},
      animation: {},
      visual: {}
    };

    return this.createPreset({
      name,
      description,
      data: currentState
    });
  }
} 