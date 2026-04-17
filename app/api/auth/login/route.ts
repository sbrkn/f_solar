import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/utils/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Authentication is handled client-side with Firebase SDK
    // This endpoint can be used for server-side session management if needed
    return NextResponse.json({
      message: 'Login successful',
      status: 200,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
