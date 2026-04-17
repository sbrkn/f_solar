export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
  role: UserRole;
}

export type UserRole = 'admin' | 'member' | 'viewer';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  autoSave: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: WorkspaceMember[];
  createdAt: Date;
  updatedAt: Date;
  settings: WorkspaceSettings;
}

export interface WorkspaceMember {
  uid: string;
  role: UserRole;
  joinedAt: Date;
}

export interface WorkspaceSettings {
  isPublic: boolean;
  allowInvites: boolean;
  defaultRole: UserRole;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  projectId: string | null;
  workspaceId: string;
  authorId: string;
  collaborators: string[];
  tags: string[];
  status: DocumentStatus;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  metadata: DocumentMetadata;
}

export type DocumentStatus = 'draft' | 'published' | 'archived' | 'deleted';

export interface DocumentMetadata {
  wordCount: number;
  readTime: number;
  lastEditedBy: string;
  isTemplate: boolean;
  coverImage?: string;
  icon?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  workspaceId: string;
  ownerId: string;
  color: string;
  icon: string;
  documentIds: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  workspaceId: string;
  createdAt: Date;
}

export interface Permission {
  id: string;
  userId: string;
  resourceId: string;
  resourceType: 'workspace' | 'document' | 'project';
  level: 'read' | 'write' | 'admin';
  createdAt: Date;
}

export interface ActivityLog {
  id: string;
  userId: string;
  workspaceId: string;
  resourceId: string;
  resourceType: 'document' | 'project' | 'workspace';
  action: ActivityAction;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export type ActivityAction =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'shared'
  | 'commented'
  | 'viewed'
  | 'restored';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  webViewLink: string;
  thumbnailLink?: string;
  createdTime: string;
  modifiedTime: string;
  parents?: string[];
}

export interface SyncStatus {
  documentId: string;
  lastSynced: Date | null;
  status: 'synced' | 'syncing' | 'error' | 'pending';
  driveFileId?: string;
  error?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface PresenceUser {
  uid: string;
  displayName: string;
  photoURL: string | null;
  lastSeen: Date;
  documentId: string;
  cursor?: {
    position: number;
    selection?: { start: number; end: number };
  };
}
