'use client';

import { useState } from 'react';
import { Plus, FolderOpen, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { firestoreService } from '@/services/firestore.service';
import { Button } from '@/components/ui/button';
import CreateModal from './create-modal';
import { toast } from 'sonner';
import { Project } from '@/lib/types';
import { formatRelative } from '@/lib/utils/date';

const DEMO_WORKSPACE = 'default';

export default function ProjectList() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const handleCreate = async (name: string) => {
    if (!user) return;
    try {
      const id = await firestoreService.createProject({
        name,
        workspaceId: DEMO_WORKSPACE,
        ownerId: user.uid,
        documentIds: [],
        isArchived: false,
      });
      setProjects((prev) => [
        ...prev,
        { id, name, workspaceId: DEMO_WORKSPACE, ownerId: user.uid, documentIds: [], isArchived: false, createdAt: new Date(), updatedAt: new Date() },
      ]);
      setCreateOpen(false);
      toast.success('Project created');
    } catch {
      toast.error('Failed to create project');
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setCreateOpen(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <FolderOpen className="mb-4 h-10 w-10 text-muted-foreground/50" />
          <p className="font-medium">No projects yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Group documents into projects</p>
          <Button className="mt-4" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="rounded-xl border bg-card p-5">
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: project.color ?? '#3b82f6' }}
                >
                  <FolderOpen className="h-4 w-4 text-white" />
                </div>
                <p className="font-medium">{project.name}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {project.documentIds.length} document{project.documentIds.length !== 1 ? 's' : ''}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatRelative(project.updatedAt)}
              </p>
            </div>
          ))}
        </div>
      )}

      <CreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        title="New Project"
        placeholder="Project name"
      />
    </div>
  );
}
