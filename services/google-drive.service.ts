import { createDriveClient, getAuthUrl, getTokensFromCode } from '@/lib/google-drive/client';
import { GOOGLE_DRIVE_CONFIG, DRIVE_MIME_TYPES } from '@/lib/google-drive/config';
import { DriveFile, DriveTokens } from '@/lib/types';

export class GoogleDriveService {
  private tokens: DriveTokens | null = null;

  setTokens(tokens: DriveTokens) {
    this.tokens = tokens;
  }

  getAuthUrl(): string {
    return getAuthUrl();
  }

  async exchangeCode(code: string): Promise<DriveTokens> {
    const tokens = await getTokensFromCode(code);
    this.tokens = tokens;
    return tokens;
  }

  private getDrive() {
    if (!this.tokens) throw new Error('Google Drive not authenticated');
    return createDriveClient(this.tokens);
  }

  async listFiles(folderId?: string): Promise<DriveFile[]> {
    const drive = this.getDrive();
    const params: Record<string, string> = {
      fields: 'files(id,name,mimeType,size,modifiedTime,webViewLink,webContentLink,parents,thumbnailLink)',
      pageSize: '100',
    };
    if (folderId) {
      params.q = `'${folderId}' in parents and trashed=false`;
    }
    const response = await drive.files.list(params);
    return (response.data.files ?? []) as DriveFile[];
  }

  async uploadFile(
    name: string,
    content: string,
    mimeType: string = DRIVE_MIME_TYPES.JSON,
    folderId?: string
  ): Promise<DriveFile> {
    const drive = this.getDrive();
    const metadata: Record<string, unknown> = { name, mimeType };
    if (folderId) metadata.parents = [folderId];

    const { Readable } = await import('stream');
    const media = {
      mimeType,
      body: Readable.from([content]),
    };

    const response = await drive.files.create({
      requestBody: metadata,
      media,
      fields: 'id,name,mimeType,size,modifiedTime,webViewLink',
    });
    return response.data as DriveFile;
  }

  async updateFile(fileId: string, content: string, mimeType: string = DRIVE_MIME_TYPES.JSON): Promise<DriveFile> {
    const drive = this.getDrive();
    const { Readable } = await import('stream');
    const media = {
      mimeType,
      body: Readable.from([content]),
    };
    const response = await drive.files.update({
      fileId,
      media,
      fields: 'id,name,mimeType,modifiedTime',
    });
    return response.data as DriveFile;
  }

  async downloadFile(fileId: string): Promise<string> {
    const drive = this.getDrive();
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'text' }
    );
    return response.data as string;
  }

  async deleteFile(fileId: string): Promise<void> {
    const drive = this.getDrive();
    await drive.files.delete({ fileId });
  }

  async createFolder(name: string, parentFolderId?: string): Promise<string> {
    const drive = this.getDrive();
    const metadata: Record<string, unknown> = {
      name,
      mimeType: DRIVE_MIME_TYPES.FOLDER,
    };
    if (parentFolderId) metadata.parents = [parentFolderId];
    const response = await drive.files.create({
      requestBody: metadata,
      fields: 'id',
    });
    return response.data.id ?? '';
  }

  async findOrCreateBackupFolder(): Promise<string> {
    const drive = this.getDrive();
    const folderName = GOOGLE_DRIVE_CONFIG.backupFolderName;

    const searchResponse = await drive.files.list({
      q: `name='${folderName}' and mimeType='${DRIVE_MIME_TYPES.FOLDER}' and trashed=false`,
      fields: 'files(id,name)',
    });

    if (searchResponse.data.files && searchResponse.data.files.length > 0) {
      return searchResponse.data.files[0].id ?? '';
    }

    return this.createFolder(folderName);
  }

  async backupDocument(documentId: string, title: string, content: string): Promise<string> {
    const folderId = await this.findOrCreateBackupFolder();
    const fileName = `${title}_${documentId}.json`;
    const fileContent = JSON.stringify({ documentId, title, content, backedUpAt: new Date().toISOString() });

    const drive = this.getDrive();
    const searchResponse = await drive.files.list({
      q: `name='${fileName}' and '${folderId}' in parents and trashed=false`,
      fields: 'files(id)',
    });

    if (searchResponse.data.files && searchResponse.data.files.length > 0) {
      const fileId = searchResponse.data.files[0].id ?? '';
      await this.updateFile(fileId, fileContent);
      return fileId;
    } else {
      const file = await this.uploadFile(fileName, fileContent, DRIVE_MIME_TYPES.JSON, folderId);
      return file.id;
    }
  }
}

export const googleDriveService = new GoogleDriveService();
