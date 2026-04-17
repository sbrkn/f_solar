'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, FileText, MoreHorizontal, Archive, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useDocuments } from '@/lib/hooks/useDocument';
import { firestoreService } from '@/services/firestore.service';
import { formatRelative } from '@/lib/utils/date';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CreateModal from './create-modal';
import { toast } from 'sonner';

const DEMO_WORKSPACE = 'default';

export default function DocumentList() {
  const { user } = useAuth();
  const { documents, loading, createDocument } = useDocuments(DEMO_WORKSPACE);
  const [createOpen, setCreateOpen] = useState(false);
  const router = useRouter();

  const handleCreate = async (title: string) => {
    if (!user) return;
    try {
      const id = await createDocument({
        title,
        content: '',
        workspaceId: DEMO_WORKSPACE,
        authorId: user.uid,
        tags: [],
        isArchived: false,
        isTrashed: false,
        collaborators: [user.uid],
        lastEditedBy: user.uid,
      });
      setCreateOpen(false);
      router.push(`/documents/${id}`);
    } catch {
      toast.error('Failed to create document');
    }
  };

  const handleTrash = async (id: string) => {
    if (!user) return;
    try {
      await firestoreService.trashDocument(id, user.uid);
      toast.success('Document moved to trash');
    } catch {
      toast.error('Failed to trash document');
    }
  };

  const handleArchive = async (id: string) => {
    if (!user) return;
    try {
      await firestoreService.archiveDocument(id, user.uid);
      toast.success('Document archived');
    } catch {
      toast.error('Failed to archive document');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setCreateOpen(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Document
        </Button>
      </div>

      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <FileText className="mb-4 h-10 w-10 text-muted-foreground/50" />
          <p className="font-medium">No documents yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first document to get started
          </p>
          <Button className="mt-4" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Document
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-xl border bg-card p-4 hover:bg-accent/50 transition-colors"
            >
              <Link href={`/documents/${doc.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="truncate font-medium">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatRelative(doc.updatedAt)}
                  </p>
                </div>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleArchive(doc.id)}>
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleTrash(doc.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Move to Trash
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}

      <CreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        title="New Document"
        placeholder="Untitled Document"
      />
    </div>
  );
}
