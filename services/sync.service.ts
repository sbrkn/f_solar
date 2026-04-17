import {
  updateDocument,
  getDocument,
  setDocument,
  COLLECTIONS,
} from '@/lib/firebase/firestore';
import { SyncStatus } from '@/lib/types';
import {
  uploadFile,
  updateFile,
  findOrCreateBackupFolder,
} from './google-drive.service';

export async function syncDocumentToDrive(
  documentId: string,
  content: string,
  title: string,
  accessToken: string,
  refreshToken: string
): Promise<SyncStatus> {
  const syncStatusId = `${documentId}_drive`;

  try {
    // Update sync status to syncing
    await setDocument(COLLECTIONS.SYNC_STATUS, syncStatusId, {
      documentId,
      status: 'syncing',
      lastSynced: null,
    });

    // Get or create backup folder
    const folderId = await findOrCreateBackupFolder(accessToken, refreshToken);

    // Check existing sync status
    const existingStatus = await getDocument<SyncStatus>(
      COLLECTIONS.SYNC_STATUS,
      syncStatusId
    );

    let driveFileId: string | undefined;

    if (existingStatus?.driveFileId) {
      // Update existing file
      try {
        await updateFile(
          accessToken,
          refreshToken,
          existingStatus.driveFileId,
          content
        );
        driveFileId = existingStatus.driveFileId;
      } catch {
        // File might not exist anymore, create new one
        const file = await uploadFile(
          accessToken,
          refreshToken,
          content,
          `${title}.txt`,
          folderId
        );
        driveFileId = file.id;
      }
    } else {
      // Create new file
      const file = await uploadFile(
        accessToken,
        refreshToken,
        content,
        `${title}.txt`,
        folderId
      );
      driveFileId = file.id;
    }

    const status: SyncStatus = {
      documentId,
      lastSynced: new Date(),
      status: 'synced',
      driveFileId,
    };

    await setDocument(COLLECTIONS.SYNC_STATUS, syncStatusId, status);
    return status;
  } catch (error) {
    const status: SyncStatus = {
      documentId,
      lastSynced: null,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };

    await setDocument(COLLECTIONS.SYNC_STATUS, syncStatusId, status);
    return status;
  }
}

export async function getSyncStatus(documentId: string): Promise<SyncStatus | null> {
  return getDocument<SyncStatus>(
    COLLECTIONS.SYNC_STATUS,
    `${documentId}_drive`
  );
}

export async function bulkSyncDocuments(
  documents: Array<{ id: string; content: string; title: string }>,
  accessToken: string,
  refreshToken: string
): Promise<SyncStatus[]> {
  const results = await Promise.allSettled(
    documents.map((doc) =>
      syncDocumentToDrive(
        doc.id,
        doc.content,
        doc.title,
        accessToken,
        refreshToken
      )
    )
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    return {
      documentId: documents[index].id,
      lastSynced: null,
      status: 'error' as const,
      error: 'Sync failed',
    };
  });
}
