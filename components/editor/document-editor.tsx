'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, Save, Cloud, CloudOff } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useDocument } from '@/lib/hooks/useDocument';
import EditorToolbar from './editor-toolbar';
import { cn } from '@/lib/utils';

interface DocumentEditorProps {
  documentId: string;
}

export default function DocumentEditor({ documentId }: DocumentEditorProps) {
  const { user } = useAuth();
  const { document, loading, error, isSaving, updateContent, updateTitle } = useDocument(documentId);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const [localTitle, setLocalTitle] = useState('');
  const titleDebounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (document?.title && localTitle === '') {
      setLocalTitle(document.title);
    }
  }, [document?.title, localTitle]);

  useEffect(() => {
    if (contentRef.current && document?.content && contentRef.current.innerHTML === '') {
      contentRef.current.innerHTML = document.content;
    }
  }, [document?.content]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);
    if (titleDebounceRef.current) clearTimeout(titleDebounceRef.current);
    titleDebounceRef.current = setTimeout(() => {
      if (user && newTitle.trim()) {
        updateTitle(newTitle, user.uid);
      }
    }, 800);
  };

  const handleInput = useCallback(() => {
    if (!contentRef.current || !user) return;
    const html = contentRef.current.innerHTML;
    updateContent(html, user.uid);
  }, [updateContent, user]);

  const applyFormat = (command: string, value?: string) => {
    contentRef.current?.focus();
    window.document.execCommand(command, false, value);
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">{error ?? 'Document not found'}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-2">
        <input
          ref={titleRef}
          type="text"
          value={localTitle}
          onChange={handleTitleChange}
          placeholder="Untitled"
          className="flex-1 bg-transparent text-xl font-bold outline-none placeholder:text-muted-foreground"
          aria-label="Document title"
        />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {isSaving ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Cloud className="h-3 w-3" />
              Saved
            </>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <EditorToolbar onFormat={applyFormat} />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          className={cn(
            'editor-content min-h-full max-w-3xl mx-auto outline-none',
            'prose prose-sm sm:prose lg:prose-lg dark:prose-invert'
          )}
          aria-label="Document content"
          data-placeholder="Start writing…"
        />
      </div>
    </div>
  );
}
