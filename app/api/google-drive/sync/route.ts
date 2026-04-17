import { NextRequest, NextResponse } from 'next/server';
import { GoogleDriveService } from '@/services/google-drive.service';
import { DriveTokens } from '@/lib/types';

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('drive_access_token')?.value;
  const refreshToken = request.cookies.get('drive_refresh_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Google Drive not connected' }, { status: 401 });
  }

  try {
    const { documentId, title, content } = await request.json();
    if (!documentId || !title || content === undefined) {
      return NextResponse.json({ error: 'documentId, title, and content are required' }, { status: 400 });
    }

    const tokens: DriveTokens = {
      access_token: accessToken,
      refresh_token: refreshToken,
    };

    const service = new GoogleDriveService();
    service.setTokens(tokens);
    const fileId = await service.backupDocument(documentId, title, content);

    return NextResponse.json({ fileId, message: 'Document backed up to Google Drive' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sync failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
