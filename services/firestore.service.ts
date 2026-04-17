import {
  db,
  Collections,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  convertTimestamps,
  QueryConstraint,
} from '@/lib/firebase/firestore';
import { Document, Project, Workspace, ActivityLog, ActivityAction } from '@/lib/types';

export class FirestoreService {
  // ============================
  // Documents
  // ============================
  async getDocument(id: string): Promise<Document | null> {
    const ref = doc(db, Collections.DOCUMENTS, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return convertTimestamps({ id: snap.id, ...snap.data() }) as Document;
  }

  async getDocuments(workspaceId: string, filters?: {
    projectId?: string;
    isArchived?: boolean;
    isTrashed?: boolean;
    limit?: number;
  }): Promise<Document[]> {
    const constraints: QueryConstraint[] = [
      where('workspaceId', '==', workspaceId),
    ];

    if (filters?.projectId) constraints.push(where('projectId', '==', filters.projectId));
    if (filters?.isArchived !== undefined) constraints.push(where('isArchived', '==', filters.isArchived));
    if (filters?.isTrashed !== undefined) constraints.push(where('isTrashed', '==', filters.isTrashed));

    constraints.push(orderBy('updatedAt', 'desc'));
    if (filters?.limit) constraints.push(limit(filters.limit));

    const q = query(collection(db, Collections.DOCUMENTS), ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map((d) => convertTimestamps({ id: d.id, ...d.data() }) as Document);
  }

  async createDocument(data: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<string> {
    const ref = await addDoc(collection(db, Collections.DOCUMENTS), {
      ...data,
      version: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await this.logActivity(data.workspaceId, data.authorId, ref.id, 'document', 'create');
    return ref.id;
  }

  async updateDocument(id: string, data: Partial<Document>, userId: string): Promise<void> {
    const ref = doc(db, Collections.DOCUMENTS, id);
    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
      lastEditedBy: userId,
    });
  }

  async deleteDocument(id: string): Promise<void> {
    const ref = doc(db, Collections.DOCUMENTS, id);
    await deleteDoc(ref);
  }

  async trashDocument(id: string, userId: string): Promise<void> {
    await this.updateDocument(id, { isTrashed: true }, userId);
  }

  async archiveDocument(id: string, userId: string): Promise<void> {
    await this.updateDocument(id, { isArchived: true }, userId);
  }

  subscribeToDocument(id: string, callback: (doc: Document | null) => void) {
    const ref = doc(db, Collections.DOCUMENTS, id);
    return onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        callback(null);
        return;
      }
      callback(convertTimestamps({ id: snap.id, ...snap.data() }) as Document);
    });
  }

  subscribeToDocuments(workspaceId: string, callback: (docs: Document[]) => void) {
    const q = query(
      collection(db, Collections.DOCUMENTS),
      where('workspaceId', '==', workspaceId),
      where('isTrashed', '==', false),
      where('isArchived', '==', false),
      orderBy('updatedAt', 'desc')
    );
    return onSnapshot(q, (snap) => {
      const docs = snap.docs.map((d) => convertTimestamps({ id: d.id, ...d.data() }) as Document);
      callback(docs);
    });
  }

  // ============================
  // Projects
  // ============================
  async getProject(id: string): Promise<Project | null> {
    const ref = doc(db, Collections.PROJECTS, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return convertTimestamps({ id: snap.id, ...snap.data() }) as Project;
  }

  async getProjects(workspaceId: string): Promise<Project[]> {
    const q = query(
      collection(db, Collections.PROJECTS),
      where('workspaceId', '==', workspaceId),
      where('isArchived', '==', false),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => convertTimestamps({ id: d.id, ...d.data() }) as Project);
  }

  async createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const ref = await addDoc(collection(db, Collections.PROJECTS), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  }

  async updateProject(id: string, data: Partial<Project>): Promise<void> {
    const ref = doc(db, Collections.PROJECTS, id);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  }

  async deleteProject(id: string): Promise<void> {
    const ref = doc(db, Collections.PROJECTS, id);
    await deleteDoc(ref);
  }

  // ============================
  // Workspaces
  // ============================
  async getWorkspace(id: string): Promise<Workspace | null> {
    const ref = doc(db, Collections.WORKSPACES, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return convertTimestamps({ id: snap.id, ...snap.data() }) as Workspace;
  }

  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    const q = query(
      collection(db, Collections.WORKSPACES),
      where('ownerId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => convertTimestamps({ id: d.id, ...d.data() }) as Workspace);
  }

  async createWorkspace(data: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const ref = await addDoc(collection(db, Collections.WORKSPACES), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  }

  // ============================
  // Activity Log
  // ============================
  async logActivity(
    workspaceId: string,
    userId: string,
    resourceId: string,
    resourceType: ActivityLog['resourceType'],
    action: ActivityAction,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    try {
      await addDoc(collection(db, Collections.ACTIVITY_LOGS), {
        workspaceId,
        userId,
        resourceId,
        resourceType,
        action,
        metadata,
        timestamp: serverTimestamp(),
      });
    } catch {
      console.warn('Failed to log activity');
    }
  }

  async getRecentActivity(workspaceId: string, count = 20): Promise<ActivityLog[]> {
    const q = query(
      collection(db, Collections.ACTIVITY_LOGS),
      where('workspaceId', '==', workspaceId),
      orderBy('timestamp', 'desc'),
      limit(count)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => convertTimestamps({ id: d.id, ...d.data() }) as ActivityLog);
  }
}

export const firestoreService = new FirestoreService();
