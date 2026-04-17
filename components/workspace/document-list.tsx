'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Plus, Search, MoreHorizontal, Trash, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/common/header';
import { CreateModal } from './create-modal';
import { useAuth } from '@/lib/hooks/useAuth';
import { useDocumentList } from '@/lib/hooks/useDocument';
import { formatRelativeTime } from '@/lib/utils/date';

export function DocumentList() {
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { user } = useAuth();

  // Use first workspace - in production, get from workspace context
  const { documents, loading } = useDocumentList(null);

  const filtered = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Documents</h1>
            <p className="text-muted-foreground">
              Manage your documents and notes
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Document
          </Button>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border p-4">
                <Skeleton className="h-8 w-8 rounded" />
                <div className="flex-1">
                  <Skeleton className="mb-1 h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-2 font-semibold">No documents yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Create your first document to get started
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Document
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((doc) => (
              <div
                key={doc.id}
                className="group flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent/50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" />
                </div>
                <Link href={`/documents/${doc.id}`} className="flex-1 min-w-0">
                  <p className="truncate font-medium">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Updated {formatRelativeTime(doc.updatedAt)}
                  </p>
                </Link>
                {doc.tags?.length > 0 && (
                  <div className="hidden gap-1 sm:flex">
                    {doc.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/documents/${doc.id}`}>Open</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2">
                      <Archive className="h-4 w-4" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-destructive">
                      <Trash className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>
      <CreateModal
        type="document"
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
