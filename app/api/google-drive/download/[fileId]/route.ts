import { NextRequest, NextResponse } from 'next/server';
import { downloadFile } from '@/services/google-drive.service';

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  const accessToken = request.cookies.get('drive_access_token')?.value;
  const refreshToken = request.cookies.get('drive_refresh_token')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Google Drive not connected' },
      { status: 401 }
    );
  }

  try {
    const content = await downloadFile(
      accessToken,
      refreshToken || '',
      params.fileId
    );
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}
