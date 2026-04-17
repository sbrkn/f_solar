import { google } from 'googleapis';
import { DriveTokens } from '@/lib/types';

export const createOAuth2Client = () =>
  new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

export const getAuthUrl = (): string => {
  const oauth2Client = createOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
    ],
    prompt: 'consent',
  });
};

export const getTokensFromCode = async (code: string): Promise<DriveTokens> => {
  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens as DriveTokens;
};

export const createDriveClient = (tokens: DriveTokens) => {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials(tokens);
  return google.drive({ version: 'v3', auth: oauth2Client });
};
