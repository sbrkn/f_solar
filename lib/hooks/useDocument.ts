'use client';

import { useState, useEffect, useCallback } from 'react';
import { Document } from '@/lib/types';
import { subscribeToDocument } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase/firestore';

export function useDocument(documentId: string | null) {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!documentId) {
      setDocument(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToDocument<Document>(
      COLLECTIONS.DOCUMENTS,
      documentId,
      (data) => {
        setDocument(data);
        setLoading(false);
        setError(null);
      }
    );

    return () => unsubscribe();
  }, [documentId]);

  return { document, loading, error };
}

export function useDocumentList(workspaceId: string | null) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workspaceId) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const fetchDocuments = async () => {
      try {
        const { queryDocuments, where, orderBy } = await import(
          '@/lib/firebase/firestore'
        );
        const docs = await queryDocuments<Document>(COLLECTIONS.DOCUMENTS, [
          where('workspaceId', '==', workspaceId),
          where('status', '!=', 'deleted'),
          orderBy('updatedAt', 'desc'),
        ]);
        setDocuments(docs);
        setLoading(false);
      } catch {
        setError('Failed to load documents');
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [workspaceId]);

  return { documents, loading, error };
}
