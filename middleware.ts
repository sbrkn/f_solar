import { NextRequest, NextResponse } from 'next/server';

const publicPaths = ['/login', '/signup', '/forgot-password'];
const apiPublicPaths = ['/api/auth/login', '/api/auth/signup', '/api/auth/google'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Allow public API paths
  if (apiPublicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/icons') ||
    pathname === '/manifest.json' ||
    pathname === '/service-worker.js' ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp)$/)
  ) {
    return NextResponse.next();
  }

  // For API routes, check Authorization header
  if (pathname.startsWith('/api/')) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
