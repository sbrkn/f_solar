import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const GDRIVE_OAUTH_STATE_COOKIE = "gdrive_oauth_state";

interface GoogleTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

/**
 * Compares two strings in constant time to prevent timing attacks.
 */
function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, "utf8");
    const bufB = Buffer.from(b, "utf8");
    if (bufA.length !== bufB.length) {
      return false;
    }
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * GET /api/gdrive/callback
 * Handles the Google OAuth callback.
 *
 * Security steps:
 * 1. Read the `state` cookie and compare it (constant-time) to the `state` query param.
 * 2. Clear the state cookie regardless of outcome.
 * 3. Exchange the `code` for tokens only if state is valid.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const returnedState = searchParams.get("state");
  const error = searchParams.get("error");

  const storedState = req.cookies.get(GDRIVE_OAUTH_STATE_COOKIE)?.value;

  // Always clear the state cookie after reading it (success or failure)
  const clearStateCookie = (response: NextResponse): NextResponse => {
    response.cookies.set(GDRIVE_OAUTH_STATE_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
    return response;
  };

  // Handle user-denied access or other provider errors
  if (error) {
    const resp = NextResponse.redirect(
      new URL("/settings?gdrive=error", req.url)
    );
    return clearStateCookie(resp);
  }

  // Validate state: both must be present and match
  if (
    !storedState ||
    !returnedState ||
    !safeCompare(storedState, returnedState)
  ) {
    const resp = NextResponse.json(
      { error: "Invalid or missing OAuth state parameter" },
      { status: 400 }
    );
    return clearStateCookie(resp);
  }

  if (!code) {
    const resp = NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 }
    );
    return clearStateCookie(resp);
  }

  // Exchange authorization code for tokens
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    const resp = NextResponse.json(
      { error: "Google OAuth is not configured" },
      { status: 500 }
    );
    return clearStateCookie(resp);
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }).toString(),
  });

  if (!tokenRes.ok) {
    const resp = NextResponse.json(
      { error: "Failed to exchange authorization code" },
      { status: 502 }
    );
    return clearStateCookie(resp);
  }

  let tokens: GoogleTokenResponse;
  try {
    const body = (await tokenRes.json()) as Record<string, unknown>;
    if (
      typeof body.access_token !== "string" ||
      typeof body.expires_in !== "number"
    ) {
      throw new Error("Unexpected token response shape");
    }
    tokens = {
      accessToken: body.access_token,
      refreshToken: typeof body.refresh_token === "string" ? body.refresh_token : undefined,
      expiresIn: body.expires_in,
    };
  } catch {
    const resp = NextResponse.json(
      { error: "Invalid token response from Google" },
      { status: 502 }
    );
    return clearStateCookie(resp);
  }

  // Redirect back to settings and persist the access token in an HttpOnly cookie
  // (not readable by JavaScript). The refreshToken should be persisted server-side
  // in Firestore tied to the user session in a follow-up.
  const successUrl = new URL("/settings?gdrive=connected", req.url);
  const resp = NextResponse.redirect(successUrl);

  resp.cookies.set("gdrive_access_token", tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: tokens.expiresIn,
    path: "/",
  });

  return clearStateCookie(resp);
}
