import { NextRequest, NextResponse } from 'next/server';
import { PresetService } from '@/lib/presetService';
import { UpdatePresetRequest } from '@/types/preset';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const presetService = PresetService.getInstance();
    const preset = await presetService.getPresetById(id);
    
    if (!preset) {
      return NextResponse.json(
        { error: 'Preset not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(preset);
  } catch (error) {
    console.error('Error fetching preset:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preset' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: UpdatePresetRequest = await request.json();
    
    const presetService = PresetService.getInstance();
    const updatedPreset = await presetService.updatePreset(id, body);
    
    if (!updatedPreset) {
      return NextResponse.json(
        { error: 'Preset not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPreset);
  } catch (error) {
    console.error('Error updating preset:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
      if (error.message.includes('already exists')) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to update preset' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const presetService = PresetService.getInstance();
    const deleted = await presetService.deletePreset(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Preset not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Preset deleted successfully' });
  } catch (error) {
    console.error('Error deleting preset:', error);
    return NextResponse.json(
      { error: 'Failed to delete preset' },
      { status: 500 }
    );
  }
} 