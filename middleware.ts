import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { NextRequest, NextResponse } from "next/server";

/**
 * Routes that do not require authentication.
 * Requests to these paths pass through without token verification.
 */
const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/api/auth",
  "/_next",
  "/favicon.ico",
];

const SESSION_COOKIE = "session";

/**
 * Firebase issues JWTs signed with RS256.
 * Public keys are exposed via Google's JWKS endpoint.
 */
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "";
const FIREBASE_JWKS_URI =
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

// createRemoteJWKSet handles in-memory key caching keyed by `kid`.
const firebaseJWKS = createRemoteJWKSet(new URL(FIREBASE_JWKS_URI));

/**
 * Verifies a Firebase ID token using JOSE + Google's public JWKs.
 * Compatible with the Edge runtime (no firebase-admin dependency).
 */
async function verifyFirebaseToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, firebaseJWKS, {
      issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
      audience: FIREBASE_PROJECT_ID,
    });
    return payload;
  } catch {
    return null;
  }
}

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (pub) => pathname === pub || pathname.startsWith(pub + "/") || pathname.startsWith(pub + "?")
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow public/static paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    return redirectToLogin(req);
  }

  const payload = await verifyFirebaseToken(token);

  if (!payload) {
    // Token is invalid or expired — redirect to /login and clear the stale cookie
    return redirectToLogin(req, true);
  }

  // Token is valid; forward the request
  return NextResponse.next();
}

function redirectToLogin(req: NextRequest, clearCookie = false): NextResponse {
  const loginUrl = new URL("/login", req.url);
  const response = NextResponse.redirect(loginUrl);
  if (clearCookie) {
    response.cookies.set(SESSION_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
  }
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     *  - _next/static (static files)
     *  - _next/image (image optimization)
     *  - favicon.ico
     *  - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
