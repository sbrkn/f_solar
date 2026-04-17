import { NextRequest, NextResponse } from 'next/server';
import { getTokensFromCode } from '@/lib/google-drive/client';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/settings?drive_error=access_denied', request.url));
  }

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    const tokens = await getTokensFromCode(code);
    const response = NextResponse.redirect(new URL('/settings?drive_connected=true', request.url));
    response.cookies.set('drive_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600,
      path: '/',
    });
    if (tokens.refresh_token) {
      response.cookies.set('drive_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
    }
    return response;
  } catch {
    return NextResponse.redirect(new URL('/settings?drive_error=exchange_failed', request.url));
  }
}
