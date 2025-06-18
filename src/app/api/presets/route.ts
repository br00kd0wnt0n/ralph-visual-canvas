import { NextRequest, NextResponse } from 'next/server';
import { PresetService } from '@/lib/presetService';
import { CreatePresetRequest } from '@/types/preset';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const isPublic = searchParams.get('isPublic') ? searchParams.get('isPublic') === 'true' : undefined;

    const presetService = PresetService.getInstance();
    const response = await presetService.getPresets({
      page,
      limit,
      category,
      search,
      isPublic
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching presets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch presets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePresetRequest = await request.json();
    
    // Validate required fields
    if (!body.name || !body.data) {
      return NextResponse.json(
        { error: 'Name and data are required' },
        { status: 400 }
      );
    }

    const presetService = PresetService.getInstance();
    const createdPreset = await presetService.createPreset(body);
    
    return NextResponse.json(createdPreset, { status: 201 });
  } catch (error) {
    console.error('Error creating preset:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create preset' },
      { status: 500 }
    );
  }
} 