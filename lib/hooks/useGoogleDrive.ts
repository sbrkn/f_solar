'use client';

import { useState, useCallback } from 'react';
import { DriveFile, DriveTokens } from '@/lib/types';
import { API_ROUTES } from '@/lib/utils/constants';

export function useGoogleDrive() {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    window.location.href = API_ROUTES.GOOGLE_DRIVE.AUTH;
  }, []);

  const listFiles = useCallback(async (folderId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = folderId
        ? `${API_ROUTES.GOOGLE_DRIVE.FILES}?folderId=${folderId}`
        : API_ROUTES.GOOGLE_DRIVE.FILES;
      const res = await fetch(url);
      const data = await res.json();
      setFiles(data.files ?? []);
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files');
    } finally {
      setLoading(false);
    }
  }, []);

  const syncDocument = useCallback(async (documentId: string, title: string, content: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_ROUTES.GOOGLE_DRIVE.SYNC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, title, content }),
      });
      if (!res.ok) throw new Error('Sync failed');
      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setLoading(false);
    }
  }, []);

  return { files, loading, error, isConnected, connect, listFiles, syncDocument };
}
