import { NextRequest, NextResponse } from 'next/server';
import { PresetService } from '@/lib/presetService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Preset ID is required' },
        { status: 400 }
      );
    }

    const presetService = PresetService.getInstance();
    const preset = await presetService.getPresetById(id);
    
    if (!preset) {
      return NextResponse.json(
        { error: 'Preset not found' },
        { status: 404 }
      );
    }

    // Generate shareable metadata
    const shareableData = {
      id: preset._id,
      name: preset.name,
      description: preset.description,
      category: preset.category,
      tags: preset.tags,
      createdAt: preset.createdAt,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?preset=${preset._id}`,
      data: preset.data // Full preset data for loading
    };

    return NextResponse.json(shareableData);
  } catch (error) {
    console.error('Error getting shareable preset:', error);
    return NextResponse.json(
      { error: 'Failed to get shareable preset' },
      { status: 500 }
    );
  }
}