import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  QueryConstraint,
  DocumentData,
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';

export const COLLECTIONS = {
  USERS: 'users',
  WORKSPACES: 'workspaces',
  DOCUMENTS: 'documents',
  PROJECTS: 'projects',
  TAGS: 'tags',
  PERMISSIONS: 'permissions',
  ACTIVITY_LOGS: 'activityLogs',
  PRESENCE: 'presence',
  SYNC_STATUS: 'syncStatus',
} as const;

export function toDate(timestamp: Timestamp | Date | null): Date | null {
  if (!timestamp) return null;
  if (timestamp instanceof Timestamp) return timestamp.toDate();
  return timestamp;
}

export function fromDate(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}

export async function getDocument<T>(
  collectionName: string,
  documentId: string
): Promise<T | null> {
  const docRef = doc(db, collectionName, documentId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as T;
}

export async function setDocument(
  collectionName: string,
  documentId: string,
  data: DocumentData
): Promise<void> {
  const docRef = doc(db, collectionName, documentId);
  await setDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function updateDocument(
  collectionName: string,
  documentId: string,
  data: Partial<DocumentData>
): Promise<void> {
  const docRef = doc(db, collectionName, documentId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDocument(
  collectionName: string,
  documentId: string
): Promise<void> {
  const docRef = doc(db, collectionName, documentId);
  await deleteDoc(docRef);
}

export async function queryDocuments<T>(
  collectionName: string,
  constraints: QueryConstraint[]
): Promise<T[]> {
  const colRef = collection(db, collectionName);
  const q = query(colRef, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

export function subscribeToDocument<T>(
  collectionName: string,
  documentId: string,
  callback: (data: T | null) => void
): () => void {
  const docRef = doc(db, collectionName, documentId);
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      callback({ id: snap.id, ...snap.data() } as T);
    } else {
      callback(null);
    }
  });
}

export function subscribeToCollection<T>(
  collectionName: string,
  constraints: QueryConstraint[],
  callback: (data: T[]) => void
): () => void {
  const colRef = collection(db, collectionName);
  const q = query(colRef, ...constraints);
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
    callback(data);
  });
}

export { where, orderBy, limit, serverTimestamp, writeBatch, collection, doc, db };
