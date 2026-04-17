const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";

export function buildGoogleDriveAuthUrl() {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? "",
    redirect_uri: process.env.GOOGLE_REDIRECT_URI ?? "",
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: DRIVE_SCOPE
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
