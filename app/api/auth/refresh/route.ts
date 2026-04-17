import { NextRequest, NextResponse } from 'next/server';
import { getIdToken } from '@/lib/firebase/auth';

export async function POST(_request: NextRequest) {
  try {
    const token = await getIdToken(true);
    if (!token) {
      return NextResponse.json({ error: 'No authenticated user' }, { status: 401 });
    }

    const response = NextResponse.json({ message: 'Token refreshed' });
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 });
  }
}
