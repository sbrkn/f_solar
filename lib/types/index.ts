// ============================
// User & Auth Types
// ============================
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
}

export type UserRole = 'admin' | 'member' | 'viewer';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  defaultWorkspaceId?: string;
}

// ============================
// Workspace Types
// ============================
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: WorkspaceMember[];
  createdAt: Date;
  updatedAt: Date;
  settings: WorkspaceSettings;
}

export interface WorkspaceMember {
  userId: string;
  role: UserRole;
  joinedAt: Date;
}

export interface WorkspaceSettings {
  isPublic: boolean;
  allowInvites: boolean;
  googleDriveConnected: boolean;
  googleDriveFolderId?: string;
}

// ============================
// Document Types
// ============================
export interface Document {
  id: string;
  title: string;
  content: string;
  plainText?: string;
  workspaceId: string;
  projectId?: string;
  authorId: string;
  tags: string[];
  isArchived: boolean;
  isTrashed: boolean;
  collaborators: string[];
  version: number;
  createdAt: Date;
  updatedAt: Date;
  lastEditedBy: string;
  googleDriveFileId?: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  content: string;
  version: number;
  editedBy: string;
  editedAt: Date;
  changeDescription?: string;
}

// ============================
// Project Types
// ============================
export interface Project {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  ownerId: string;
  documentIds: string[];
  color?: string;
  icon?: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================
// Tag Types
// ============================
export interface Tag {
  id: string;
  name: string;
  color: string;
  workspaceId: string;
  createdBy: string;
  createdAt: Date;
}

// ============================
// Permission Types
// ============================
export type Permission = 'read' | 'write' | 'admin';

export interface ResourcePermission {
  id: string;
  resourceId: string;
  resourceType: 'document' | 'project' | 'workspace';
  userId: string;
  permission: Permission;
  grantedBy: string;
  grantedAt: Date;
}

// ============================
// Activity Log Types
// ============================
export interface ActivityLog {
  id: string;
  userId: string;
  workspaceId: string;
  resourceId: string;
  resourceType: 'document' | 'project' | 'workspace';
  action: ActivityAction;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

export type ActivityAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'view'
  | 'share'
  | 'archive'
  | 'restore'
  | 'export'
  | 'import';

// ============================
// Google Drive Types
// ============================
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  modifiedTime: string;
  webViewLink?: string;
  webContentLink?: string;
  parents?: string[];
  thumbnailLink?: string;
}

export interface DriveTokens {
  access_token: string;
  refresh_token?: string;
  expiry_date?: number;
  token_type?: string;
  scope?: string;
}

// ============================
// Sync Types
// ============================
export interface SyncStatus {
  documentId: string;
  status: 'synced' | 'syncing' | 'pending' | 'conflict' | 'error';
  lastSyncedAt?: Date;
  error?: string;
}

export interface Presence {
  userId: string;
  displayName: string | null;
  photoURL: string | null;
  documentId: string;
  lastSeen: Date;
  cursor?: { line: number; column: number };
}

// ============================
// API Response Types
// ============================
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ============================
// Form Types
// ============================
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface DocumentFormData {
  title: string;
  content?: string;
  projectId?: string;
  tags?: string[];
}

export interface ProjectFormData {
  name: string;
  description?: string;
  color?: string;
}
