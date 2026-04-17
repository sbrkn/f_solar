'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { documentSchema, projectSchema } from '@/lib/utils/validation';
import { createDocument, createProject } from '@/services/firestore.service';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

interface CreateModalProps {
  type: 'document' | 'project';
  isOpen: boolean;
  onClose: () => void;
  workspaceId?: string;
}

export function CreateModal({
  type,
  isOpen,
  onClose,
  workspaceId = 'default',
}: CreateModalProps) {
  const { user } = useAuth();
  const router = useRouter();

  const schema = type === 'document' ? documentSchema : projectSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Record<string, unknown>) => {
    if (!user) return;

    try {
      if (type === 'document') {
        const doc = await createDocument({
          title: data.title as string,
          content: '',
          projectId: null,
          workspaceId,
          authorId: user.uid,
          collaborators: [],
          tags: [],
          status: 'draft',
          deletedAt: null,
          metadata: {
            wordCount: 0,
            readTime: 0,
            lastEditedBy: user.uid,
            isTemplate: false,
          },
        });
        toast({ title: 'Document created', description: `"${doc.title}" has been created.` });
        router.push(`/documents/${doc.id}`);
      } else {
        await createProject({
          name: data.name as string,
          description: (data.description as string) || '',
          workspaceId,
          ownerId: user.uid,
          color: '#f97316',
          icon: '📁',
          documentIds: [],
          tags: [],
        });
        toast({ title: 'Project created' });
      }

      reset();
      onClose();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create new {type === 'document' ? 'document' : 'project'}
          </DialogTitle>
          <DialogDescription>
            {type === 'document'
              ? 'Add a title for your new document'
              : 'Add a name for your new project'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="title">
                {type === 'document' ? 'Title' : 'Name'}
              </Label>
              <Input
                id="title"
                placeholder={
                  type === 'document'
                    ? 'Untitled document'
                    : 'My Project'
                }
                {...register(type === 'document' ? 'title' : 'name')}
              />
              {(errors.title || errors.name) && (
                <p className="text-sm text-destructive">
                  {String(errors.title?.message || errors.name?.message)}
                </p>
              )}
            </div>
            {type === 'project' && (
              <div className="space-y-1">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="What is this project about?"
                  rows={3}
                  {...register('description')}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Creating...'
                : `Create ${type === 'document' ? 'document' : 'project'}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
