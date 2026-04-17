export const GOOGLE_DRIVE_CONFIG = {
  clientId: process.env.GOOGLE_CLIENT_ID ?? '',
  scopes: [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
  ],
  redirectUri:
    process.env.GOOGLE_REDIRECT_URI ?? 'http://localhost:3000/api/google-drive/callback',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
  backupFolderName: 'F_Solar Backups',
  syncIntervalMs: 5 * 60 * 1000, // 5 minutes
};

export const DRIVE_MIME_TYPES = {
  FOLDER: 'application/vnd.google-apps.folder',
  DOCUMENT: 'application/vnd.google-apps.document',
  JSON: 'application/json',
  TEXT: 'text/plain',
};
