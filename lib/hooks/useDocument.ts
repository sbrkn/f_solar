'use client';

import { useState, useEffect, useCallback } from 'react';
import { firestoreService } from '@/services/firestore.service';
import { syncService } from '@/services/sync.service';
import { Document } from '@/lib/types';

export function useDocument(documentId: string | null) {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!documentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = firestoreService.subscribeToDocument(documentId, (doc) => {
      setDocument(doc);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      syncService.cancelSync(documentId);
    };
  }, [documentId]);

  const updateContent = useCallback(
    async (content: string, userId: string) => {
      if (!documentId) return;
      setIsSaving(true);
      try {
        await syncService.queueSync(documentId, userId, content);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save');
      } finally {
        setIsSaving(false);
      }
    },
    [documentId]
  );

  const updateTitle = useCallback(
    async (title: string, userId: string) => {
      if (!documentId) return;
      try {
        await firestoreService.updateDocument(documentId, { title }, userId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update title');
      }
    },
    [documentId]
  );

  return { document, loading, error, isSaving, updateContent, updateTitle };
}

export function useDocuments(workspaceId: string | null) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workspaceId) {
      setLoading(false);
      return;
    }

    const unsubscribe = firestoreService.subscribeToDocuments(workspaceId, (docs) => {
      setDocuments(docs);
      setLoading(false);
    });

    return unsubscribe;
  }, [workspaceId]);

  const createDocument = useCallback(
    async (data: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => {
      const id = await firestoreService.createDocument(data);
      return id;
    },
    []
  );

  return { documents, loading, error, createDocument };
}
