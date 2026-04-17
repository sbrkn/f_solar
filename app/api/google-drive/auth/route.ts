import { NextRequest, NextResponse } from 'next/server';
import { getAuthUrl } from '@/lib/google-drive/client';

export async function GET(_request: NextRequest) {
  try {
    const authUrl = getAuthUrl();
    return NextResponse.redirect(authUrl);
  } catch {
    return NextResponse.json({ error: 'Failed to generate auth URL' }, { status: 500 });
  }
}
