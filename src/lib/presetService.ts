import clientPromise from './mongodb';
import { Preset, CreatePresetRequest, UpdatePresetRequest, PresetListResponse } from '@/types/preset';

export class PresetService {
  private static instance: PresetService;
  
  public static getInstance(): PresetService {
    if (!PresetService.instance) {
      PresetService.instance = new PresetService();
    }
    return PresetService.instance;
  }

  async getPresets(params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    isPublic?: boolean;
  }): Promise<PresetListResponse> {
    const client = await clientPromise;
    const db = client.db('visual-canvas');
    const collection = db.collection<Preset>('presets');

    const { page = 1, limit = 20, category, search, isPublic } = params;

    // Build query
    const query: any = {};
    if (category) query.category = category;
    if (isPublic !== undefined) query.isPublic = isPublic;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Get total count
    const total = await collection.countDocuments(query);

    // Get presets with pagination
    const presets = await collection
      .find(query)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return {
      presets,
      total,
      page,
      limit
    };
  }

  async getPresetById(id: string): Promise<Preset | null> {
    const client = await clientPromise;
    const db = client.db('visual-canvas');
    const collection = db.collection<Preset>('presets');

    return await collection.findOne({ _id: id });
  }

  async createPreset(presetData: CreatePresetRequest): Promise<Preset> {
    const client = await clientPromise;
    const db = client.db('visual-canvas');
    const collection = db.collection<Preset>('presets');

    // Check if preset with same name already exists
    const existingPreset = await collection.findOne({ name: presetData.name });
    if (existingPreset) {
      throw new Error('A preset with this name already exists');
    }

    const now = new Date();
    const preset: Omit<Preset, '_id'> = {
      name: presetData.name,
      description: presetData.description || '',
      category: presetData.category || 'default',
      tags: presetData.tags || [],
      createdAt: now,
      updatedAt: now,
      data: presetData.data,
      isPublic: presetData.isPublic || false,
      createdBy: 'user', // TODO: Add user authentication
      version: '1.0.0'
    };

    const result = await collection.insertOne(preset);
    const createdPreset = await collection.findOne({ _id: result.insertedId });
    
    if (!createdPreset) {
      throw new Error('Failed to create preset');
    }

    return createdPreset;
  }

  async updatePreset(id: string, updateData: Partial<UpdatePresetRequest>): Promise<Preset | null> {
    const client = await clientPromise;
    const db = client.db('visual-canvas');
    const collection = db.collection<Preset>('presets');

    // Check if preset exists
    const existingPreset = await collection.findOne({ _id: id });
    if (!existingPreset) {
      throw new Error('Preset not found');
    }

    // Check if new name conflicts with another preset
    if (updateData.name && updateData.name !== existingPreset.name) {
      const nameConflict = await collection.findOne({ 
        name: updateData.name,
        _id: { $ne: id }
      });
      if (nameConflict) {
        throw new Error('A preset with this name already exists');
      }
    }

    const dataToUpdate: Partial<Preset> = {
      ...updateData,
      updatedAt: new Date()
    };

    const result = await collection.updateOne(
      { _id: id },
      { $set: dataToUpdate }
    );

    if (result.matchedCount === 0) {
      throw new Error('Preset not found');
    }

    return await collection.findOne({ _id: id });
  }

  async deletePreset(id: string): Promise<boolean> {
    const client = await clientPromise;
    const db = client.db('visual-canvas');
    const collection = db.collection<Preset>('presets');

    const result = await collection.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
} 