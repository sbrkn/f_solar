import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

const GDRIVE_OAUTH_STATE_COOKIE = "gdrive_oauth_state";
const STATE_TTL_SECONDS = 5 * 60; // 5 minutes

/**
 * GET /api/gdrive/auth
 * Initiates the Google Drive OAuth flow.
 * Generates a cryptographically-random state, stores it in a short-lived HttpOnly cookie,
 * and redirects the user to the Google authorization URL.
 */
export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "Google OAuth is not configured" },
      { status: 500 }
    );
  }

  // Generate a cryptographically-random state value (16 bytes → 32 hex chars)
  const state = randomBytes(16).toString("hex");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: [
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/drive.readonly",
    ].join(" "),
    access_type: "offline",
    prompt: "consent",
    state,
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  const response = NextResponse.redirect(authUrl);

  // Store state in a short-lived HttpOnly Secure SameSite=Lax cookie
  response.cookies.set(GDRIVE_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: STATE_TTL_SECONDS,
    path: "/",
  });

  return response;
}
