import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
  type DocumentData
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export type WorkspaceDocument = {
  id?: string;
  title: string;
  content: string;
  tags: string[];
};

export async function listDocuments(userId: string) {
  const snapshot = await getDocs(collection(db, "users", userId, "documents"));
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as DocumentData) }));
}

export async function createDocument(userId: string, payload: WorkspaceDocument) {
  return addDoc(collection(db, "users", userId, "documents"), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function updateDocument(userId: string, docId: string, payload: Partial<WorkspaceDocument>) {
  await updateDoc(doc(db, "users", userId, "documents", docId), {
    ...payload,
    updatedAt: serverTimestamp()
  });
}
