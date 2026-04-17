import { createDriveClient } from '@/lib/google-drive/client';
import { DriveFile, SyncStatus } from '@/lib/types';
import { GOOGLE_DRIVE_CONFIG } from '@/lib/google-drive/config';

export async function listFiles(
  accessToken: string,
  refreshToken: string,
  folderId?: string
): Promise<DriveFile[]> {
  const drive = createDriveClient(accessToken, refreshToken);

  const query = folderId
    ? `'${folderId}' in parents and trashed=false`
    : `'root' in parents and trashed=false`;

  const response = await drive.files.list({
    q: query,
    fields: 'files(id,name,mimeType,size,webViewLink,thumbnailLink,createdTime,modifiedTime,parents)',
    orderBy: 'modifiedTime desc',
  });

  return (response.data.files as DriveFile[]) || [];
}

export async function uploadFile(
  accessToken: string,
  refreshToken: string,
  content: string,
  fileName: string,
  folderId?: string
): Promise<DriveFile> {
  const drive = createDriveClient(accessToken, refreshToken);

  const metadata = {
    name: fileName,
    mimeType: 'text/plain',
    parents: folderId ? [folderId] : undefined,
  };

  const response = await drive.files.create({
    requestBody: metadata,
    media: {
      mimeType: 'text/plain',
      body: content,
    },
    fields: 'id,name,mimeType,size,webViewLink,createdTime,modifiedTime',
  });

  return response.data as DriveFile;
}

export async function downloadFile(
  accessToken: string,
  refreshToken: string,
  fileId: string
): Promise<string> {
  const drive = createDriveClient(accessToken, refreshToken);

  const response = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'text' }
  );

  return response.data as string;
}

export async function updateFile(
  accessToken: string,
  refreshToken: string,
  fileId: string,
  content: string
): Promise<DriveFile> {
  const drive = createDriveClient(accessToken, refreshToken);

  const response = await drive.files.update({
    fileId,
    media: {
      mimeType: 'text/plain',
      body: content,
    },
    fields: 'id,name,mimeType,size,webViewLink,modifiedTime',
  });

  return response.data as DriveFile;
}

export async function deleteFile(
  accessToken: string,
  refreshToken: string,
  fileId: string
): Promise<void> {
  const drive = createDriveClient(accessToken, refreshToken);
  await drive.files.delete({ fileId });
}

export async function createFolder(
  accessToken: string,
  refreshToken: string,
  name: string,
  parentId?: string
): Promise<DriveFile> {
  const drive = createDriveClient(accessToken, refreshToken);

  const response = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : undefined,
    },
    fields: 'id,name,mimeType,createdTime',
  });

  return response.data as DriveFile;
}

export async function findOrCreateBackupFolder(
  accessToken: string,
  refreshToken: string
): Promise<string> {
  const drive = createDriveClient(accessToken, refreshToken);

  const searchResponse = await drive.files.list({
    q: `name='${GOOGLE_DRIVE_CONFIG.backupFolderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id,name)',
  });

  if (searchResponse.data.files && searchResponse.data.files.length > 0) {
    return searchResponse.data.files[0].id!;
  }

  const folder = await createFolder(
    accessToken,
    refreshToken,
    GOOGLE_DRIVE_CONFIG.backupFolderName
  );
  return folder.id;
}
