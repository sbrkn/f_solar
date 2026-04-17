import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/services/google-drive.service';

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('drive_access_token')?.value;
  const refreshToken = request.cookies.get('drive_refresh_token')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Google Drive not connected' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { content, fileName, folderId } = body;

    if (!content || !fileName) {
      return NextResponse.json(
        { error: 'content and fileName are required' },
        { status: 400 }
      );
    }

    const file = await uploadFile(
      accessToken,
      refreshToken || '',
      content,
      fileName,
      folderId
    );

    return NextResponse.json({ file });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
