import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
  DocumentData,
} from 'firebase/firestore';
import app from './config';

export const db = getFirestore(app);

// Collection references
export const Collections = {
  USERS: 'users',
  WORKSPACES: 'workspaces',
  DOCUMENTS: 'documents',
  DOCUMENT_VERSIONS: 'document_versions',
  PROJECTS: 'projects',
  TAGS: 'tags',
  PERMISSIONS: 'permissions',
  ACTIVITY_LOGS: 'activity_logs',
  PRESENCE: 'presence',
} as const;

export const getCollectionRef = (collectionName: string) => collection(db, collectionName);
export const getDocRef = (collectionName: string, docId: string) =>
  doc(db, collectionName, docId);

export const convertTimestamps = <T extends DocumentData>(data: T): T => {
  const converted: DocumentData = { ...data };
  for (const key in converted) {
    if (converted[key] instanceof Timestamp) {
      converted[key] = (converted[key] as Timestamp).toDate();
    }
  }
  return converted as T;
};

export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  type QueryConstraint,
};
