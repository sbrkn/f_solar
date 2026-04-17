import { firestoreService } from './firestore.service';
import { Document } from '@/lib/types';

export class SyncService {
  private syncQueue: Map<string, NodeJS.Timeout> = new Map();
  private readonly DEBOUNCE_MS = 1000;

  async queueSync(documentId: string, userId: string, content: string): Promise<void> {
    const existing = this.syncQueue.get(documentId);
    if (existing) clearTimeout(existing);

    const timeout = setTimeout(async () => {
      await this.syncDocument(documentId, userId, content);
      this.syncQueue.delete(documentId);
    }, this.DEBOUNCE_MS);

    this.syncQueue.set(documentId, timeout);
  }

  private async syncDocument(documentId: string, userId: string, content: string): Promise<void> {
    try {
      await firestoreService.updateDocument(documentId, { content }, userId);
    } catch (error) {
      console.error('Sync failed for document:', documentId, error);
    }
  }

  async resolveConflict(local: Document, remote: Document): Promise<Document> {
    // Last-write-wins strategy; remote wins if newer
    if (remote.updatedAt > local.updatedAt) return remote;
    return local;
  }

  cancelSync(documentId: string): void {
    const existing = this.syncQueue.get(documentId);
    if (existing) {
      clearTimeout(existing);
      this.syncQueue.delete(documentId);
    }
  }

  flushAll(): void {
    this.syncQueue.forEach((timeout, id) => {
      clearTimeout(timeout);
      this.syncQueue.delete(id);
    });
  }
}

export const syncService = new SyncService();
