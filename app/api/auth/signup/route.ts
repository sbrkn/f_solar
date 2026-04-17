import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    const { email, password, displayName } = await request.json();
    if (!email || !password || !displayName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const user = await authService.signupWithEmail(email, password, displayName);
    const token = await user.getIdToken();

    const response = NextResponse.json({
      message: 'Account created successfully',
      uid: user.uid,
      email: user.email,
    });

    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Signup failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
