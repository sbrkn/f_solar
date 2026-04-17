'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Cloud, CloudOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { EditorToolbar } from './editor-toolbar';
import { useDocument } from '@/lib/hooks/useDocument';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  updateDocumentContent,
  updateDocumentTitle,
} from '@/services/firestore.service';
import { toast } from '@/components/ui/use-toast';
import { DEBOUNCE_DELAY } from '@/lib/utils/constants';

interface DocumentEditorProps {
  documentId: string;
}

export function DocumentEditor({ documentId }: DocumentEditorProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { document, loading } = useDocument(documentId);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content);
    }
  }, [document]);

  const saveDocument = useCallback(async () => {
    if (!user || !document) return;
    setIsSaving(true);
    try {
      await updateDocumentContent(documentId, content, user.uid);
      setLastSaved(new Date());
    } catch {
      toast({
        title: 'Save failed',
        description: 'Failed to save document',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [documentId, content, user, document]);

  const handleTitleChange = async (newTitle: string) => {
    setTitle(newTitle);
    clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      await updateDocumentTitle(documentId, newTitle);
    }, DEBOUNCE_DELAY);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(saveDocument, DEBOUNCE_DELAY);
  };

  // Keyboard shortcut for save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveDocument();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveDocument]);

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-4 border-b p-4">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="mb-6 h-10 w-3/4" />
          <Skeleton className="mb-3 h-4 w-full" />
          <Skeleton className="mb-3 h-4 w-5/6" />
          <Skeleton className="mb-3 h-4 w-4/5" />
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-muted-foreground">Document not found</p>
          <Button onClick={() => router.push('/documents')}>
            Back to Documents
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/documents')}
          aria-label="Back to documents"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <EditorToolbar />
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          {isSaving ? (
            <>
              <Cloud className="h-4 w-4 animate-pulse" />
              <span>Saving...</span>
            </>
          ) : lastSaved ? (
            <>
              <Cloud className="h-4 w-4" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <CloudOff className="h-4 w-4" />
              <span>Not saved</span>
            </>
          )}
        </div>
        <Button size="sm" onClick={saveDocument} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-8 py-10">
          {/* Title */}
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="mb-6 border-none bg-transparent p-0 text-4xl font-bold shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50"
            placeholder="Untitled"
          />

          {/* Content */}
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="editor-content w-full resize-none bg-transparent text-base leading-relaxed outline-none placeholder:text-muted-foreground/50"
            placeholder="Start writing..."
          />
        </div>
      </div>
    </div>
  );
}
