import { onSnapshot, collection } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export function subscribeToDocumentChanges(userId: string, onChange: (count: number) => void) {
  return onSnapshot(collection(db, "users", userId, "documents"), (snapshot) => {
    onChange(snapshot.size);
  });
}
