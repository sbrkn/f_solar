import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizationUrl } from '@/lib/google-drive/client';

export async function GET(request: NextRequest) {
  const authUrl = getAuthorizationUrl();
  return NextResponse.redirect(authUrl);
}
