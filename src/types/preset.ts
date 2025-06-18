import { ObjectId } from 'mongodb';

export interface Preset {
  _id?: ObjectId | string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  data: {
    camera: any;
    particles: any;
    geometric: any;
    globalEffects: any;
    backgroundConfig: any;
    effects: any;
    background: any;
    ui: any;
    globalAnimationSpeed: number;
  };
  isPublic?: boolean;
  createdBy?: string;
  version?: string;
}

export interface CreatePresetRequest {
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  data: Preset['data'];
  isPublic?: boolean;
}

export interface UpdatePresetRequest extends Partial<CreatePresetRequest> {
  id: string;
}

export interface PresetListResponse {
  presets: Preset[];
  total: number;
  page: number;
  limit: number;
} 