'use client';

import { useState, useEffect } from 'react';
import {
  db,
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  QueryConstraint,
  convertTimestamps,
} from '@/lib/firebase/firestore';

export function useFirestore<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionName), ...constraints);
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => convertTimestamps({ id: d.id, ...d.data() }) as T);
        setData(docs);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName]);

  return { data, loading, error };
}
