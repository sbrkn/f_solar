import { NextRequest, NextResponse } from 'next/server';
import { syncDocumentToDrive } from '@/services/sync.service';

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('drive_access_token')?.value;
    const refreshToken = request.cookies.get('drive_refresh_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Google Drive not connected' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { documentId, content, title } = body;

    if (!documentId || !content || !title) {
      return NextResponse.json(
        { error: 'documentId, content, and title are required' },
        { status: 400 }
      );
    }

    const status = await syncDocumentToDrive(
      documentId,
      content,
      title,
      accessToken,
      refreshToken || ''
    );

    return NextResponse.json({ data: status });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
