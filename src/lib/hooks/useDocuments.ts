"use client";

import { useEffect, useState } from "react";
import { listDocuments, type WorkspaceDocument } from "@/services/firestore.service";

export function useDocuments(userId?: string) {
  const [documents, setDocuments] = useState<WorkspaceDocument[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setDocuments([]);
      return;
    }

    setLoading(true);
    listDocuments(userId)
      .then((items) => setDocuments(items as WorkspaceDocument[]))
      .finally(() => setLoading(false));
  }, [userId]);

  return { documents, loading };
}
