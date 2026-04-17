"use client";

import Link from "next/link";
import { Database, FileText, Tags } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { useDocuments } from "@/lib/hooks/useDocuments";

export function WorkspaceShell() {
  const { user } = useAuth();
  const { documents, loading } = useDocuments(user?.uid);

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="space-y-2">
        <h2 className="text-sm font-semibold uppercase text-muted-foreground">Workspace</h2>
        <nav className="space-y-1 text-sm">
          <Link href="#" className="flex items-center gap-2 rounded-md p-2 hover:bg-muted">
            <FileText className="h-4 w-4" /> Dokümanlar
          </Link>
          <Link href="#" className="flex items-center gap-2 rounded-md p-2 hover:bg-muted">
            <Database className="h-4 w-4" /> Veri Tabloları
          </Link>
          <Link href="#" className="flex items-center gap-2 rounded-md p-2 hover:bg-muted">
            <Tags className="h-4 w-4" /> Etiketler
          </Link>
        </nav>
      </aside>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Collaboration Workspace</h1>
          <Button>Yeni Doküman</Button>
        </div>

        <Card>
          <p className="text-sm text-muted-foreground">Realtime doküman listesi (Firestore)</p>
          <div className="mt-4 space-y-2">
            {loading && <p>Yükleniyor...</p>}
            {!loading && documents.length === 0 && <p>Henüz doküman yok.</p>}
            {documents.map((doc) => (
              <div key={doc.id} className="rounded-md border border-border p-3">
                <h3 className="font-medium">{doc.title}</h3>
                <p className="text-sm text-muted-foreground">{doc.content.slice(0, 120)}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
