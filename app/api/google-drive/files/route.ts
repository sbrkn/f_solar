import { NextRequest, NextResponse } from 'next/server';
import { GoogleDriveService } from '@/services/google-drive.service';
import { DriveTokens } from '@/lib/types';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('drive_access_token')?.value;
  const refreshToken = request.cookies.get('drive_refresh_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Google Drive not connected' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId') ?? undefined;

    const tokens: DriveTokens = {
      access_token: accessToken,
      refresh_token: refreshToken,
    };

    const service = new GoogleDriveService();
    service.setTokens(tokens);
    const files = await service.listFiles(folderId);

    return NextResponse.json({ files });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list files';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
