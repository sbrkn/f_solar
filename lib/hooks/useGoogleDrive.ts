'use client';

import { useState, useCallback } from 'react';
import { DriveFile } from '@/lib/types';

interface DriveState {
  files: DriveFile[];
  loading: boolean;
  error: string | null;
  isConnected: boolean;
}

export function useGoogleDrive() {
  const [state, setState] = useState<DriveState>({
    files: [],
    loading: false,
    error: null,
    isConnected: false,
  });

  const connect = useCallback(() => {
    window.location.href = '/api/google-drive/auth';
  }, []);

  const listFiles = useCallback(async (folderId?: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const url = folderId
        ? `/api/google-drive/files?folderId=${folderId}`
        : '/api/google-drive/files';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to list files');
      const data = await response.json();
      setState((prev) => ({
        ...prev,
        files: data.files,
        loading: false,
        isConnected: true,
      }));
      return data.files as DriveFile[];
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to list files',
      }));
      return [];
    }
  }, []);

  const uploadFile = useCallback(
    async (content: string, fileName: string, folderId?: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await fetch('/api/google-drive/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, fileName, folderId }),
        });
        if (!response.ok) throw new Error('Failed to upload file');
        const data = await response.json();
        setState((prev) => ({ ...prev, loading: false }));
        return data.file as DriveFile;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to upload file',
        }));
        return null;
      }
    },
    []
  );

  const downloadFile = useCallback(async (fileId: string): Promise<string | null> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`/api/google-drive/download/${fileId}`);
      if (!response.ok) throw new Error('Failed to download file');
      const data = await response.json();
      setState((prev) => ({ ...prev, loading: false }));
      return data.content as string;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to download file',
      }));
      return null;
    }
  }, []);

  const syncDocument = useCallback(
    async (documentId: string, content: string, title: string) => {
      try {
        const response = await fetch('/api/sync/drive', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentId, content, title }),
        });
        if (!response.ok) throw new Error('Failed to sync document');
        return true;
      } catch {
        return false;
      }
    },
    []
  );

  return {
    ...state,
    connect,
    listFiles,
    uploadFile,
    downloadFile,
    syncDocument,
  };
}
