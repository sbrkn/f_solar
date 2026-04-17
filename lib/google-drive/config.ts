export const GOOGLE_DRIVE_CONFIG = {
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  redirectUri:
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback',
  scopes: [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
  ],
  backupFolderName: 'F-Solar Backups',
};
