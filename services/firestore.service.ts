import { v4 as uuidv4 } from 'uuid';
import {
  COLLECTIONS,
  setDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
  subscribeToCollection,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from '@/lib/firebase/firestore';
import {
  Document,
  DocumentStatus,
  Project,
  Workspace,
  Tag,
  ActivityLog,
  ActivityAction,
} from '@/lib/types';

// Document operations
export async function createDocument(
  data: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'version'>
): Promise<Document> {
  const id = uuidv4();
  const doc: Document = {
    ...data,
    id,
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await setDocument(COLLECTIONS.DOCUMENTS, id, doc);
  return doc;
}

export async function getDocumentById(id: string): Promise<Document | null> {
  return getDocument<Document>(COLLECTIONS.DOCUMENTS, id);
}

export async function updateDocumentContent(
  id: string,
  content: string,
  userId: string
): Promise<void> {
  await updateDocument(COLLECTIONS.DOCUMENTS, id, {
    content,
    'metadata.lastEditedBy': userId,
    version: await getDocument<Document>(COLLECTIONS.DOCUMENTS, id).then(
      (d) => (d?.version ?? 0) + 1
    ),
  });
}

export async function updateDocumentTitle(
  id: string,
  title: string
): Promise<void> {
  await updateDocument(COLLECTIONS.DOCUMENTS, id, { title });
}

export async function archiveDocument(id: string): Promise<void> {
  await updateDocument(COLLECTIONS.DOCUMENTS, id, {
    status: 'archived' as DocumentStatus,
  });
}

export async function deleteDocumentSoft(id: string): Promise<void> {
  await updateDocument(COLLECTIONS.DOCUMENTS, id, {
    status: 'deleted' as DocumentStatus,
    deletedAt: new Date(),
  });
}

export async function restoreDocument(id: string): Promise<void> {
  await updateDocument(COLLECTIONS.DOCUMENTS, id, {
    status: 'draft' as DocumentStatus,
    deletedAt: null,
  });
}

export async function getWorkspaceDocuments(
  workspaceId: string,
  includeDeleted = false
): Promise<Document[]> {
  const constraints = [
    where('workspaceId', '==', workspaceId),
    orderBy('updatedAt', 'desc'),
  ];

  if (!includeDeleted) {
    constraints.unshift(where('status', '!=', 'deleted'));
  }

  return queryDocuments<Document>(COLLECTIONS.DOCUMENTS, constraints);
}

export function subscribeToWorkspaceDocuments(
  workspaceId: string,
  callback: (docs: Document[]) => void
): () => void {
  return subscribeToCollection<Document>(
    COLLECTIONS.DOCUMENTS,
    [
      where('workspaceId', '==', workspaceId),
      where('status', '!=', 'deleted'),
      orderBy('updatedAt', 'desc'),
    ],
    callback
  );
}

// Project operations
export async function createProject(
  data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Project> {
  const id = uuidv4();
  const project: Project = {
    ...data,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await setDocument(COLLECTIONS.PROJECTS, id, project);
  return project;
}

export async function getWorkspaceProjects(
  workspaceId: string
): Promise<Project[]> {
  return queryDocuments<Project>(COLLECTIONS.PROJECTS, [
    where('workspaceId', '==', workspaceId),
    orderBy('createdAt', 'desc'),
  ]);
}

export async function updateProject(
  id: string,
  data: Partial<Project>
): Promise<void> {
  await updateDocument(COLLECTIONS.PROJECTS, id, data);
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDocument(COLLECTIONS.PROJECTS, id);
}

// Workspace operations
export async function createWorkspace(
  data: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Workspace> {
  const id = uuidv4();
  const workspace: Workspace = {
    ...data,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await setDocument(COLLECTIONS.WORKSPACES, id, workspace);
  return workspace;
}

export async function getUserWorkspaces(userId: string): Promise<Workspace[]> {
  return queryDocuments<Workspace>(COLLECTIONS.WORKSPACES, [
    where('ownerId', '==', userId),
  ]);
}

export async function getWorkspaceById(id: string): Promise<Workspace | null> {
  return getDocument<Workspace>(COLLECTIONS.WORKSPACES, id);
}

// Tag operations
export async function createTag(
  name: string,
  color: string,
  workspaceId: string
): Promise<Tag> {
  const id = uuidv4();
  const tag: Tag = {
    id,
    name,
    color,
    workspaceId,
    createdAt: new Date(),
  };

  await setDocument(COLLECTIONS.TAGS, id, tag);
  return tag;
}

export async function getWorkspaceTags(workspaceId: string): Promise<Tag[]> {
  return queryDocuments<Tag>(COLLECTIONS.TAGS, [
    where('workspaceId', '==', workspaceId),
    orderBy('name', 'asc'),
  ]);
}

// Activity log
export async function logActivity(
  data: Omit<ActivityLog, 'id' | 'createdAt'>
): Promise<void> {
  const id = uuidv4();
  const log: ActivityLog = {
    ...data,
    id,
    createdAt: new Date(),
  };

  await setDocument(COLLECTIONS.ACTIVITY_LOGS, id, log);
}

export async function getWorkspaceActivity(
  workspaceId: string,
  limitCount = 20
): Promise<ActivityLog[]> {
  return queryDocuments<ActivityLog>(COLLECTIONS.ACTIVITY_LOGS, [
    where('workspaceId', '==', workspaceId),
    orderBy('createdAt', 'desc'),
    limit(limitCount),
  ]);
}
