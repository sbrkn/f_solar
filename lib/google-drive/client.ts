import { google } from 'googleapis';
import { GOOGLE_DRIVE_CONFIG } from './config';

export function createOAuth2Client(accessToken?: string, refreshToken?: string) {
  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_DRIVE_CONFIG.clientId,
    GOOGLE_DRIVE_CONFIG.clientSecret,
    GOOGLE_DRIVE_CONFIG.redirectUri
  );

  if (accessToken || refreshToken) {
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  return oauth2Client;
}

export function getAuthorizationUrl(state?: string): string {
  const oauth2Client = createOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: GOOGLE_DRIVE_CONFIG.scopes,
    state,
    prompt: 'consent',
  });
}

export async function exchangeCodeForTokens(code: string) {
  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export function createDriveClient(accessToken: string, refreshToken?: string) {
  const oauth2Client = createOAuth2Client(accessToken, refreshToken);
  return google.drive({ version: 'v3', auth: oauth2Client });
}
