import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/google-drive/client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      new URL(`/settings?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL('/settings?error=no_code', request.url));
  }

  try {
    const tokens = await exchangeCodeForTokens(code);

    // In production, store tokens securely (encrypted in Firestore or secure cookie)
    const response = NextResponse.redirect(
      new URL('/settings?drive_connected=true', request.url)
    );

    // Store tokens in secure httpOnly cookie
    if (tokens.access_token) {
      response.cookies.set('drive_access_token', tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: tokens.expiry_date
          ? Math.floor((tokens.expiry_date - Date.now()) / 1000)
          : 3600,
      });
    }

    if (tokens.refresh_token) {
      response.cookies.set('drive_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    return response;
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(
      new URL('/settings?error=oauth_failed', request.url)
    );
  }
}
