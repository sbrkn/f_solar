'use client';

import { useState, useCallback } from 'react';
import {
  setDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
} from '@/lib/firebase/firestore';
import { QueryConstraint } from 'firebase/firestore';

export function useFirestore<T>(collectionName: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (id: string, data: Omit<T, 'id'>) => {
      setLoading(true);
      setError(null);
      try {
        await setDocument(collectionName, id, data as Record<string, unknown>);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create document');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  const update = useCallback(
    async (id: string, data: Partial<T>) => {
      setLoading(true);
      setError(null);
      try {
        await updateDocument(collectionName, id, data as Record<string, unknown>);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update document');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  const remove = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await deleteDocument(collectionName, id);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete document');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  const query = useCallback(
    async (constraints: QueryConstraint[]) => {
      setLoading(true);
      setError(null);
      try {
        const results = await queryDocuments<T>(collectionName, constraints);
        return results;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to query documents');
        return [];
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  return { create, update, remove, query, loading, error };
}
