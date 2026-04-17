import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await authService.loginWithEmail(email, password);
    const token = await user.getIdToken();

    const response = NextResponse.json({
      message: 'Login successful',
      uid: user.uid,
      email: user.email,
    });

    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    const code = (error as { code?: string })?.code ?? 'unknown';
    console.error('Login error code:', code);
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  }
}
