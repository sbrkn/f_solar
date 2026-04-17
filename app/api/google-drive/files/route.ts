import { NextRequest, NextResponse } from 'next/server';
import { listFiles } from '@/services/google-drive.service';
import { getAuthorizationUrl } from '@/lib/google-drive/client';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('drive_access_token')?.value;
  const refreshToken = request.cookies.get('drive_refresh_token')?.value;

  if (!accessToken) {
    const authUrl = getAuthorizationUrl();
    return NextResponse.json(
      { error: 'Google Drive not connected', authUrl },
      { status: 401 }
    );
  }

  try {
    const folderId = request.nextUrl.searchParams.get('folderId') || undefined;
    const files = await listFiles(accessToken, refreshToken || '', folderId);
    return NextResponse.json({ files });
  } catch (error) {
    console.error('List files error:', error);
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    );
  }
}
